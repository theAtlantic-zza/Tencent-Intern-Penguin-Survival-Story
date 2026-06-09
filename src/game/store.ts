import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EVENTS } from './events';
import { ENDINGS, ACHIEVEMENTS } from './endings';
import { INTERN_WEEKS, TRACKS } from './tracks';
import type {
  Achievement,
  Attrs,
  AttrKey,
  Choice,
  Ending,
  GameEvent,
  RunRecord,
  Track,
} from './types';

export type Stage = 'home' | 'naming' | 'playing' | 'ended';

interface PersistedState {
  unlockedEndings: string[];
  unlockedAchievements: string[];
  reincarnations: number;
  records: RunRecord[];
}

interface RuntimeState {
  stage: Stage;
  name: string;
  attrs: Attrs;
  week: number;
  /** 5 条转正路线累计分数 */
  trackScores: Record<Track, number>;
  currentEvent: GameEvent | null;
  lastOutcome: string | null;
  lastEffects: Partial<Attrs> | null;
  ending: Ending | null;
  /** 结局描述（可能含动态拼接的转正路线） */
  endingDesc: string | null;
  /** 当前轮回内已用过的事件 id */
  usedEventIds: string[];
}

interface Actions {
  goHome: () => void;
  startNaming: () => void;
  setName: (name: string) => void;
  confirmName: (name: string) => void;
  pickChoice: (idx: number) => void;
  nextWeek: () => void;
  reincarnate: () => void;
  clearRecords: () => void;
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
  attrs: { ...INITIAL_ATTRS },
  week: 1,
  trackScores: { ...INITIAL_TRACK_SCORES },
  currentEvent: null,
  lastOutcome: null,
  lastEffects: null,
  ending: null,
  endingDesc: null,
  usedEventIds: [],
};

const initialPersisted: PersistedState = {
  unlockedEndings: [],
  unlockedAchievements: [],
  reincarnations: 0,
  records: [],
};

function pickRandomEvent(week: number, usedIds: string[]): GameEvent {
  const pool = EVENTS.filter((e) => {
    if (e.minWeek && week < e.minWeek) return false;
    return !usedIds.includes(e.id);
  });
  if (pool.length === 0) {
    return EVENTS[Math.floor(Math.random() * EVENTS.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
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
): Ending | null {
  const graduated = week > INTERN_WEEKS;
  const top = topTrack(scores);
  for (const e of ENDINGS) {
    if (
      e.condition({
        attrs,
        week,
        topTrack: top,
        trackScores: scores,
        graduated,
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
        const firstEvent = pickRandomEvent(1, []);
        set({
          name: trimmed,
          stage: 'playing',
          attrs: { ...INITIAL_ATTRS },
          week: 1,
          trackScores: { ...INITIAL_TRACK_SCORES },
          currentEvent: firstEvent,
          lastOutcome: null,
          lastEffects: null,
          ending: null,
          endingDesc: null,
          usedEventIds: [firstEvent.id],
        });
      },

      pickChoice: (idx) => {
        const { currentEvent, attrs, week, trackScores } = get();
        if (!currentEvent) return;
        const choice: Choice | undefined = currentEvent.choices[idx];
        if (!choice) return;

        const newAttrs = applyEffects(attrs, choice.effects);
        const newScores: Record<Track, number> = { ...trackScores };
        if (choice.trackBias) {
          (Object.keys(choice.trackBias) as Track[]).forEach((k) => {
            newScores[k] = newScores[k] + (choice.trackBias![k] ?? 0);
          });
        }

        const ending = checkEnding(newAttrs, week, newScores);

        set({
          attrs: newAttrs,
          trackScores: newScores,
          lastEffects: choice.effects,
          lastOutcome: choice.outcome ?? null,
          currentEvent: null,
        });

        if (ending) finalize(get, set, ending);
      },

      nextWeek: () => {
        const { week, usedEventIds, attrs, trackScores } = get();
        const nextWeekNum = week + 1;
        // 撑过实习期 → 触发毕业判定
        if (nextWeekNum > INTERN_WEEKS) {
          const ending = checkEnding(attrs, nextWeekNum, trackScores);
          if (ending) {
            set({ week: nextWeekNum });
            finalize(get, set, ending);
            return;
          }
        }
        const evt = pickRandomEvent(nextWeekNum, usedEventIds);
        set({
          week: nextWeekNum,
          currentEvent: evt,
          lastOutcome: null,
          lastEffects: null,
          usedEventIds: [...usedEventIds, evt.id],
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
    }),
    {
      name: 'penguin-intern-v1',
      partialize: (state): PersistedState => ({
        unlockedEndings: state.unlockedEndings,
        unlockedAchievements: state.unlockedAchievements,
        reincarnations: state.reincarnations,
        records: state.records,
      }),
    },
  ),
);

/** 结算：写进度、解锁成就、保存记录、生成动态结局描述 */
function finalize(
  get: () => Store,
  set: (partial: Partial<Store>) => void,
  ending: Ending,
) {
  const s = get();

  // 顺利转正：根据 topTrack 拼接动态描述
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

  // 解锁结局
  const unlockedEndings = s.unlockedEndings.includes(ending.id)
    ? s.unlockedEndings
    : [...s.unlockedEndings, ending.id];

  const reincarnations = s.reincarnations + 1;

  const newRecord: RunRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: s.name,
    weeks: Math.min(s.week, INTERN_WEEKS),
    endingId: ending.id,
    endingName: ending.name,
    at: Date.now(),
  };
  const records = [newRecord, ...s.records].slice(0, 20);

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
  if (unlockedEndings.length >= 3) achieved.add('collector');

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
