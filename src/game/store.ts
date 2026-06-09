import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EVENTS } from './events';
import { ENDINGS, ACHIEVEMENTS } from './endings';
import { DIFFICULTY_CONFIG, TRACKS } from './tracks';
import { getTalentById, TALENTS } from './talents';
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

export type Stage = 'home' | 'naming' | 'difficulty' | 'talent' | 'playing' | 'ended';

interface PersistedState {
  unlockedEndings: string[];
  unlockedAchievements: string[];
  reincarnations: number;
  records: RunRecord[];
  triedTalents: string[];
  /** 总开关：静音 */
  muted: boolean;
}

interface RuntimeState {
  stage: Stage;
  name: string;
  difficulty: Difficulty;
  talent: Talent | null;
  /** 开局抽到的 3 个候选天赋 */
  talentOptions: Talent[];
  attrs: Attrs;
  week: number;
  trackScores: Record<Track, number>;
  /** 当前周三选一候选事件 */
  eventOptions: GameEvent[];
  /** 已选中正在面对的事件 */
  currentEvent: GameEvent | null;
  lastOutcome: string | null;
  lastEffects: Partial<Attrs> | null;
  ending: Ending | null;
  endingDesc: string | null;
  /** 一局内的最高存款，用于成就判定 */
  peakMoney: number;
  usedEventIds: string[];
}

interface Actions {
  goHome: () => void;
  startNaming: () => void;
  setName: (name: string) => void;
  confirmName: (name: string) => void;
  pickDifficulty: (d: Difficulty) => void;
  pickTalent: (id: string) => void;
  /** 玩家从 3 个候选中选一个事件去面对 */
  pickEvent: (idx: number) => void;
  pickChoice: (idx: number) => void;
  nextWeek: () => void;
  reincarnate: () => void;
  clearRecords: () => void;
  toggleMute: () => void;
}

type Store = RuntimeState & PersistedState & Actions;

const INITIAL_ATTRS: Attrs = {
  hp: 8,
  iq: 5,
  eq: 5,
  money: 5,
  mentor: 0,
  rank: 0,
};

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
  talent: null,
  talentOptions: [],
  attrs: { ...INITIAL_ATTRS },
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
};

const initialPersisted: PersistedState = {
  unlockedEndings: [],
  unlockedAchievements: [],
  reincarnations: 0,
  records: [],
  triedTalents: [],
  muted: false,
};

/** 三选一事件池（不放重复 id，且尽量从不同 tag 抽，体验更丰富） */
function rollEvents(
  difficulty: Difficulty,
  week: number,
  usedIds: string[],
): GameEvent[] {
  const pool = EVENTS.filter((e) => {
    if (e.minWeek && week < e.minWeek) return false;
    if (e.maxWeek && week > e.maxWeek) return false;
    if (e.extendedOnly && difficulty !== 'extended') return false;
    return !usedIds.includes(e.id);
  });
  // 全用过则放宽限制（只过滤 minWeek 和 difficulty）
  const fallback =
    pool.length >= 3
      ? pool
      : EVENTS.filter((e) => {
          if (e.minWeek && week < e.minWeek) return false;
          if (e.extendedOnly && difficulty !== 'extended') return false;
          return true;
        });
  // Fisher-Yates 抽 3 个不同 tag 的事件
  const shuffled = [...fallback];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const out: GameEvent[] = [];
  const seenTags = new Set<string>();
  for (const e of shuffled) {
    if (out.length >= 3) break;
    if (seenTags.has(e.tag.label)) continue;
    out.push(e);
    seenTags.add(e.tag.label);
  }
  // tag 不够 3 种时直接补
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

function topTrack(scores: Record<Track, number>): Track {
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

function checkEnding(
  attrs: Attrs,
  week: number,
  scores: Record<Track, number>,
  difficulty: Difficulty,
): Ending | null {
  const totalWeeks = DIFFICULTY_CONFIG[difficulty].weeks;
  const graduated = week > totalWeeks;
  const top = topTrack(scores);
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
        // 难度选定 → 进入天赋选择
        const opts = rollTalentOptions();
        set({
          difficulty: d,
          talentOptions: opts,
          stage: 'talent',
        });
      },

      pickTalent: (id) => {
        const t = getTalentById(id);
        if (!t) return;
        const tried = get().triedTalents;
        const nextTried = tried.includes(id) ? tried : [...tried, id];
        const evtOpts = rollEvents(get().difficulty, 1, []);
        set({
          talent: t,
          triedTalents: nextTried,
          attrs: { ...INITIAL_ATTRS },
          week: 1,
          trackScores: { ...INITIAL_TRACK_SCORES },
          eventOptions: evtOpts,
          currentEvent: null,
          lastOutcome: null,
          lastEffects: null,
          ending: null,
          endingDesc: null,
          peakMoney: INITIAL_ATTRS.money,
          usedEventIds: [],
          stage: 'playing',
        });
      },

      pickEvent: (idx) => {
        const { eventOptions } = get();
        const evt = eventOptions[idx];
        if (!evt) return;
        set({
          currentEvent: evt,
          eventOptions: [],
          usedEventIds: [...get().usedEventIds, evt.id],
        });
      },

      pickChoice: (idx) => {
        const { currentEvent, attrs, week, trackScores, talent, difficulty, peakMoney } = get();
        if (!currentEvent) return;
        const choice: Choice | undefined = currentEvent.choices[idx];
        if (!choice) return;

        // 天赋会调整原始 effects
        const finalEffects = talent ? talent.modify(choice.effects) : choice.effects;

        const newAttrs = applyEffects(attrs, finalEffects);
        const newScores: Record<Track, number> = { ...trackScores };
        if (choice.trackBias) {
          (Object.keys(choice.trackBias) as Track[]).forEach((k) => {
            newScores[k] = newScores[k] + (choice.trackBias![k] ?? 0);
          });
        }

        const ending = checkEnding(newAttrs, week, newScores, difficulty);

        set({
          attrs: newAttrs,
          trackScores: newScores,
          lastEffects: finalEffects,
          lastOutcome: choice.outcome ?? null,
          currentEvent: null,
          peakMoney: Math.max(peakMoney, newAttrs.money),
        });

        if (ending) finalize(get, set, ending);
      },

      nextWeek: () => {
        const { week, usedEventIds, attrs, trackScores, difficulty } = get();
        const nextWeekNum = week + 1;
        const totalWeeks = DIFFICULTY_CONFIG[difficulty].weeks;
        // 撑过实习期 → 触发毕业判定
        if (nextWeekNum > totalWeeks) {
          const ending = checkEnding(attrs, nextWeekNum, trackScores, difficulty);
          if (ending) {
            set({ week: nextWeekNum });
            finalize(get, set, ending);
            return;
          }
        }
        const opts = rollEvents(difficulty, nextWeekNum, usedEventIds);
        set({
          week: nextWeekNum,
          eventOptions: opts,
          currentEvent: null,
          lastOutcome: null,
          lastEffects: null,
        });
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
      name: 'penguin-intern-v2',
      partialize: (state): PersistedState => ({
        unlockedEndings: state.unlockedEndings,
        unlockedAchievements: state.unlockedAchievements,
        reincarnations: state.reincarnations,
        records: state.records,
        triedTalents: state.triedTalents,
        muted: state.muted,
      }),
    },
  ),
);

/** 抽 3 个天赋作为开局选项 */
function rollTalentOptions(): Talent[] {
  const arr = [...TALENTS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}

/** 结算 */
function finalize(
  get: () => Store,
  set: (partial: Partial<Store>) => void,
  ending: Ending,
) {
  const s = get();

  let endingDesc = ending.desc;
  if (ending.id === 'graduate_normal') {
    const top = topTrack(s.trackScores);
    const t = TRACKS[top];
    endingDesc = `你顺利通过实习答辩，转正成为一只光荣的【${t.name}】${t.emoji}！${t.desc}`;
  } else if (ending.id === 'graduate_top') {
    const top = topTrack(s.trackScores);
    const t = TRACKS[top];
    endingDesc = `${ending.desc} 你最终被定级为【${t.name}】${t.emoji}，前途无量。`;
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
  if (unlockedEndings.length >= 5) achieved.add('collector');
  if (
    s.difficulty === 'extended' &&
    (ending.id === 'graduate_top' ||
      ending.id === 'graduate_normal' ||
      ending.id === 'graduate_fail')
  )
    achieved.add('extended');
  if (s.peakMoney >= 20) achieved.add('rich');
  const triedAll = TALENTS.every((t) => s.triedTalents.includes(t.id));
  if (triedAll) achieved.add('allTalents');

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
