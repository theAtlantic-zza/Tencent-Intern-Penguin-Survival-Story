import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EVENTS } from './events';
import { ENDINGS, ACHIEVEMENTS } from './endings';
import { DIFFICULTY_CONFIG, TRACKS } from './tracks';
import { getTalentById, TALENTS } from './talents';
import { getProfessionById, PROFESSIONS } from './professions';
import { getMentorById, MENTORS } from './mentors';
import type { Mentor } from './mentors';
import type { Profession } from './professions';
import type {
  Achievement,
  Attrs,
  AttrKey,
  Choice,
  Difficulty,
  Ending,
  GameEvent,
  RunRecord,
  Talent,
  Track,
} from './types';

export type Stage =
  | 'home'
  | 'naming'
  | 'difficulty'
  | 'choosing'
  | 'mentor'
  | 'talent'
  | 'playing'
  | 'report'
  | 'ended';

interface PersistedState {
  unlockedEndings: string[];
  unlockedAchievements: string[];
  reincarnations: number;
  records: RunRecord[];
  triedTalents: string[];
  /** 体验过的职业 id */
  triedProfessions: string[];
  /** 体验过的导师 id */
  triedMentors: string[];
  muted: boolean;
}

interface RuntimeState {
  stage: Stage;
  name: string;
  difficulty: Difficulty;
  /** 入职职业 */
  profession: Profession | null;
  /** 实习导师 */
  mentor: Mentor | null;
  /** 通用天赋（3 选 1） */
  talent: Talent | null;
  talentOptions: Talent[];
  attrs: Attrs;
  week: number;
  /** trackScores 仍保留，用作"中途跳槽"等延伸场景；但结局走的是 profession.id */
  trackScores: Record<Track, number>;
  eventOptions: GameEvent[];
  currentEvent: GameEvent | null;
  lastOutcome: string | null;
  lastEffects: Partial<Attrs> | null;
  ending: Ending | null;
  endingDesc: string | null;
  peakMoney: number;
  usedEventIds: string[];
  /** 月度复盘：上一次复盘时的属性快照（用来算 delta） */
  lastReportAttrs: Attrs;
  /** 月度复盘：累计触发的事件标题（用于复盘列表） */
  monthEventTitles: string[];
  /** 月度复盘关闭后展示的"新月份开始"过渡卡 flag */
  showMonthIntro: boolean;
}

interface Actions {
  goHome: () => void;
  startNaming: () => void;
  setName: (name: string) => void;
  confirmName: (name: string) => void;
  pickDifficulty: (d: Difficulty) => void;
  pickProfession: (id: string) => void;
  pickMentor: (id: string) => void;
  pickTalent: (id: string) => void;
  pickEvent: (idx: number) => void;
  pickChoice: (idx: number) => void;
  nextWeek: () => void;
  closeMonthlyReport: () => void;
  dismissMonthIntro: () => void;
  reincarnate: () => void;
  clearRecords: () => void;
  toggleMute: () => void;
}

type Store = RuntimeState & PersistedState & Actions;

const INITIAL_TRACK_SCORES: Record<Track, number> = {
  pm: 0,
  design: 0,
  dev: 0,
  op: 0,
  staff: 0,
};

const initialRuntime: RuntimeState = {
  stage: 'home',
  name: '',
  difficulty: 'standard',
  profession: null,
  mentor: null,
  talent: null,
  talentOptions: [],
  attrs: { hp: 8, iq: 5, eq: 5, money: 5, mentor: 0, rank: 0 },
  week: 1,
  trackScores: { ...INITIAL_TRACK_SCORES },
  eventOptions: [],
  currentEvent: null,
  lastOutcome: null,
  lastEffects: null,
  ending: null,
  endingDesc: null,
  peakMoney: 5,
  usedEventIds: [],
  lastReportAttrs: { hp: 8, iq: 5, eq: 5, money: 5, mentor: 0, rank: 0 },
  monthEventTitles: [],
  showMonthIntro: false,
};

const initialPersisted: PersistedState = {
  unlockedEndings: [],
  unlockedAchievements: [],
  reincarnations: 0,
  records: [],
  triedTalents: [],
  triedProfessions: [],
  triedMentors: [],
  muted: false,
};

/** 三选一：职业专属事件优先，其余通用 */
function rollEvents(
  professionId: Track,
  difficulty: Difficulty,
  week: number,
  usedIds: string[],
): GameEvent[] {
  const pool = EVENTS.filter((e) => {
    if (e.minWeek && week < e.minWeek) return false;
    if (e.maxWeek && week > e.maxWeek) return false;
    if (e.extendedOnly && difficulty !== 'extended') return false;
    // 职业专属事件只有匹配的职业能触发；通用事件所有人都能触发
    if (e.professionId && e.professionId !== professionId) return false;
    return !usedIds.includes(e.id);
  });
  const fallback =
    pool.length >= 3
      ? pool
      : EVENTS.filter((e) => {
          if (e.minWeek && week < e.minWeek) return false;
          if (e.extendedOnly && difficulty !== 'extended') return false;
          if (e.professionId && e.professionId !== professionId) return false;
          return true;
        });
  const shuffled = [...fallback];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // 至少塞 1 个职业专属事件（如果池子里有的话）
  const out: GameEvent[] = [];
  const seenTags = new Set<string>();
  const proSpecific = shuffled.find((e) => e.professionId === professionId);
  if (proSpecific) {
    out.push(proSpecific);
    seenTags.add(proSpecific.tag.label);
  }
  for (const e of shuffled) {
    if (out.length >= 3) break;
    if (out.includes(e)) continue;
    if (seenTags.has(e.tag.label)) continue;
    out.push(e);
    seenTags.add(e.tag.label);
  }
  if (out.length < 3) {
    for (const e of shuffled) {
      if (out.length >= 3) break;
      if (!out.includes(e)) out.push(e);
    }
  }
  return out.slice(0, 3);
}

function applyEffects(attrs: Attrs, effects: Partial<Attrs>): Attrs {
  const next = { ...attrs };
  (Object.keys(effects) as AttrKey[]).forEach((k) => {
    next[k] = next[k] + (effects[k] ?? 0);
  });
  return next;
}

function mergeEffects(
  a: Partial<Attrs> | null,
  b: Partial<Attrs> | null,
): Partial<Attrs> | null {
  if (!a && !b) return null;
  const out: Partial<Attrs> = {};
  const keys = new Set([
    ...Object.keys(a ?? {}),
    ...Object.keys(b ?? {}),
  ]) as Set<AttrKey>;
  keys.forEach((k) => {
    out[k] = (a?.[k] ?? 0) + (b?.[k] ?? 0);
  });
  return out;
}

/** 顺序应用：职业独门天赋 → 导师 → 通用天赋 */
function applyTalentChain(
  effects: Partial<Attrs>,
  profession: Profession | null,
  mentor: Mentor | null,
  talent: Talent | null,
): Partial<Attrs> {
  let out = effects;
  if (profession) out = profession.signatureTalent.modify(out);
  if (mentor) out = mentor.modify(out);
  if (talent) out = talent.modify(out);
  return out;
}

function checkEnding(
  attrs: Attrs,
  week: number,
  profession: Profession | null,
  scores: Record<Track, number>,
  difficulty: Difficulty,
): Ending | null {
  const totalWeeks = DIFFICULTY_CONFIG[difficulty].weeks;
  const graduated = week > totalWeeks;
  // topTrack 优先用入职职业；没选职业才退回 trackScores（兜底）
  const top: Track = profession?.id ?? topTrackByScores(scores);
  for (const e of ENDINGS) {
    if (
      e.condition({
        attrs,
        week,
        topTrack: top,
        trackScores: scores,
        graduated,
        difficulty,
      })
    ) {
      return e;
    }
  }
  return null;
}

function topTrackByScores(scores: Record<Track, number>): Track {
  let best: Track = 'pm';
  let bestVal = -Infinity;
  (Object.keys(scores) as Track[]).forEach((k) => {
    if (scores[k] > bestVal) {
      bestVal = scores[k];
      best = k;
    }
  });
  return best;
}

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      ...initialRuntime,
      ...initialPersisted,

      goHome: () => set({ ...initialRuntime, stage: 'home' }),

      startNaming: () => set({ stage: 'naming', name: '' }),

      setName: (name) => set({ name }),

      confirmName: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set({ name: trimmed, stage: 'difficulty' });
      },

      pickDifficulty: (d) => {
        set({ difficulty: d, stage: 'choosing' });
      },

      pickProfession: (id) => {
        const p = getProfessionById(id);
        if (!p) return;
        const tried = get().triedProfessions;
        const nextTried = tried.includes(id) ? tried : [...tried, id];
        set({
          profession: p,
          attrs: { ...p.baseAttrs },
          peakMoney: p.baseAttrs.money,
          triedProfessions: nextTried,
          stage: 'mentor',
        });
      },

      pickMentor: (id) => {
        const m = getMentorById(id);
        if (!m) return;
        const tried = get().triedMentors;
        const nextTried = tried.includes(id) ? tried : [...tried, id];
        set({
          mentor: m,
          triedMentors: nextTried,
          talentOptions: rollTalentOptions(),
          stage: 'talent',
        });
      },

      pickTalent: (id) => {
        const t = getTalentById(id);
        if (!t) return;
        const { profession, difficulty, attrs } = get();
        if (!profession) return;
        const tried = get().triedTalents;
        const nextTried = tried.includes(id) ? tried : [...tried, id];
        const evtOpts = rollEvents(profession.id, difficulty, 1, []);
        set({
          talent: t,
          triedTalents: nextTried,
          week: 1,
          trackScores: { ...INITIAL_TRACK_SCORES },
          eventOptions: evtOpts,
          currentEvent: null,
          lastOutcome: null,
          lastEffects: null,
          ending: null,
          endingDesc: null,
          usedEventIds: [],
          lastReportAttrs: { ...attrs },
          monthEventTitles: [],
          stage: 'playing',
        });
      },

      pickEvent: (idx) => {
        const { eventOptions, monthEventTitles } = get();
        const evt = eventOptions[idx];
        if (!evt) return;
        set({
          currentEvent: evt,
          eventOptions: [],
          usedEventIds: [...get().usedEventIds, evt.id],
          monthEventTitles: [...monthEventTitles, evt.title],
        });
      },

      pickChoice: (idx) => {
        const {
          currentEvent,
          attrs,
          week,
          trackScores,
          profession,
          mentor,
          talent,
          difficulty,
          peakMoney,
        } = get();
        if (!currentEvent) return;
        const choice: Choice | undefined = currentEvent.choices[idx];
        if (!choice) return;

        // 处理高风险选项的掷骰子
        let actualEffects: Partial<Attrs> = choice.effects;
        let actualOutcome: string | null = choice.outcome ?? null;
        let forcedEnding: Ending | null = null;

        if (choice.risk) {
          const roll = Math.random();
          if (roll >= choice.risk.chance) {
            actualEffects = choice.risk.fallbackEffects;
            actualOutcome = choice.risk.fallbackOutcome;
            if (choice.risk.fatalEndingId) {
              const e = ENDINGS.find((x) => x.id === choice.risk!.fatalEndingId);
              if (e) forcedEnding = e;
            }
          }
        }

        // 职业天赋 → 导师 → 通用天赋
        const finalEffects = applyTalentChain(actualEffects, profession, mentor, talent);

        const newAttrs = applyEffects(attrs, finalEffects);
        const newScores: Record<Track, number> = { ...trackScores };
        if (choice.trackBias) {
          (Object.keys(choice.trackBias) as Track[]).forEach((k) => {
            newScores[k] = newScores[k] + (choice.trackBias![k] ?? 0);
          });
        }

        const ending =
          forcedEnding ?? checkEnding(newAttrs, week, profession, newScores, difficulty);

        set({
          attrs: newAttrs,
          trackScores: newScores,
          lastEffects: finalEffects,
          lastOutcome: actualOutcome,
          currentEvent: null,
          peakMoney: Math.max(peakMoney, newAttrs.money),
        });

        if (ending) finalize(get, set, ending);
      },

      nextWeek: () => {
        const {
          week,
          usedEventIds,
          attrs,
          trackScores,
          difficulty,
          profession,
          mentor,
        } = get();
        if (!profession) return;
        const nextWeekNum = week + 1;
        const totalWeeks = DIFFICULTY_CONFIG[difficulty].weeks;

        // 触发职业被动 + 导师 tick
        const passiveFromPro = profession.passive.tick({
          week: nextWeekNum,
          attrs,
        });
        const passiveFromMentor = mentor
          ? mentor.tick({ week: nextWeekNum, attrs })
          : null;
        const merged: Partial<Attrs> | null =
          passiveFromPro || passiveFromMentor
            ? mergeEffects(passiveFromPro, passiveFromMentor)
            : null;
        const attrsAfterPassive = merged ? applyEffects(attrs, merged) : attrs;

        if (nextWeekNum > totalWeeks) {
          const ending = checkEnding(
            attrsAfterPassive,
            nextWeekNum,
            profession,
            trackScores,
            difficulty,
          );
          if (ending) {
            set({ week: nextWeekNum, attrs: attrsAfterPassive });
            finalize(get, set, ending);
            return;
          }
        }

        // 月度复盘：每 4 周触发一次（在 week=5/9/13/... 进入时）
        const shouldShowReport =
          nextWeekNum > 1 && (nextWeekNum - 1) % 4 === 0 && nextWeekNum <= totalWeeks;

        const opts = rollEvents(profession.id, difficulty, nextWeekNum, usedEventIds);
        if (shouldShowReport) {
          set({
            week: nextWeekNum,
            attrs: attrsAfterPassive,
            eventOptions: opts,
            currentEvent: null,
            lastOutcome: null,
            lastEffects: null,
            stage: 'report',
          });
        } else {
          set({
            week: nextWeekNum,
            attrs: attrsAfterPassive,
            eventOptions: opts,
            currentEvent: null,
            lastOutcome: merged
              ? `本周自动结算${profession.passive.name ? `【${profession.passive.name}】` : ''}${mentor && passiveFromMentor ? `+【${mentor.name}】` : ''}`
              : null,
            lastEffects: merged ?? null,
          });
        }
      },

      closeMonthlyReport: () => {
        const { attrs } = get();
        set({
          stage: 'playing',
          lastReportAttrs: { ...attrs },
          monthEventTitles: [],
          lastOutcome: null,
          lastEffects: null,
          showMonthIntro: true,
        });
      },

      dismissMonthIntro: () => {
        set({ showMonthIntro: false });
      },

      reincarnate: () => {
        set({
          ...initialRuntime,
          stage: 'naming',
          name: '',
        });
      },

      clearRecords: () => set({ records: [] }),

      toggleMute: () => set({ muted: !get().muted }),
    }),
    {
      name: 'penguin-intern-v4',
      partialize: (state): PersistedState => ({
        unlockedEndings: state.unlockedEndings,
        unlockedAchievements: state.unlockedAchievements,
        reincarnations: state.reincarnations,
        records: state.records,
        triedTalents: state.triedTalents,
        triedProfessions: state.triedProfessions,
        triedMentors: state.triedMentors,
        muted: state.muted,
      }),
    },
  ),
);

function rollTalentOptions(): Talent[] {
  const arr = [...TALENTS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}

function finalize(
  get: () => Store,
  set: (partial: Partial<Store>) => void,
  ending: Ending,
) {
  const s = get();
  const profession = s.profession;

  let endingDesc = ending.desc;
  if (ending.id === 'graduate_normal' && profession) {
    const t = TRACKS[profession.id];
    endingDesc = `你顺利通过实习答辩，转正成为一只正式的【${t.name}】${t.emoji}！${t.desc}`;
  } else if (ending.id === 'graduate_top' && profession) {
    const t = TRACKS[profession.id];
    endingDesc = `${ending.desc} 你以【${t.name}】${t.emoji}身份被定级为 SP，前途无量。`;
  }

  const unlockedEndings = s.unlockedEndings.includes(ending.id)
    ? s.unlockedEndings
    : [...s.unlockedEndings, ending.id];

  const reincarnations = s.reincarnations + 1;

  const totalWeeks = DIFFICULTY_CONFIG[s.difficulty].weeks;
  const newRecord: RunRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: s.name,
    weeks: Math.min(s.week, totalWeeks),
    endingId: ending.id,
    endingName: ending.name,
    difficulty: s.difficulty,
    at: Date.now(),
  };
  const records = [newRecord, ...s.records].slice(0, 30);

  // 成就
  const achieved = new Set(s.unlockedAchievements);
  achieved.add('first_run');
  if (reincarnations >= 3) achieved.add('reincarnate_3');
  if (
    ending.id === 'graduate_top' ||
    ending.id === 'graduate_normal' ||
    ending.id === 'graduate_fail'
  )
    achieved.add('graduate');
  if (s.week < 5) achieved.add('speedrun');
  if (unlockedEndings.length >= 8) achieved.add('collector');
  if (
    s.difficulty === 'extended' &&
    (ending.id === 'graduate_top' ||
      ending.id === 'graduate_normal' ||
      ending.id === 'graduate_fail')
  )
    achieved.add('extended');
  if (s.peakMoney >= 20) achieved.add('rich');
  const triedAllTalents = TALENTS.every((t) => s.triedTalents.includes(t.id));
  if (triedAllTalents) achieved.add('allTalents');
  const triedAllPros = PROFESSIONS.every((p) => s.triedProfessions.includes(p.id));
  if (triedAllPros) achieved.add('allPros');
  const triedAllMentors = MENTORS.every((m) => s.triedMentors.includes(m.id));
  if (triedAllMentors) achieved.add('allMentors');

  set({
    stage: 'ended',
    ending,
    endingDesc,
    unlockedEndings,
    unlockedAchievements: Array.from(achieved),
    reincarnations,
    records,
  });
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getEndingById(id: string): Ending | undefined {
  return ENDINGS.find((e) => e.id === id);
}
