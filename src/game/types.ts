// 实习生视角 - 完整类型定义

export type AttrKey = 'hp' | 'iq' | 'eq' | 'money' | 'mentor' | 'rank';
// hp=体力 iq=智力 eq=情商 money=存款 mentor=导师好感 rank=转正进度

export type Attrs = Record<AttrKey, number>;

/** 5 条转正路线 */
export type Track = 'pm' | 'design' | 'dev' | 'op' | 'staff';

/** 难度档位 */
export type Difficulty = 'standard' | 'extended';

/** 天赋：开局抽 3 选 1，影响整局事件加成 */
export interface Talent {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  /**
   * 加成函数：对选项原始 effects 做调整
   * 例：学霸 → iq 类正向加成 +50%
   */
  modify: (effects: Partial<Attrs>) => Partial<Attrs>;
}

export interface Choice {
  text: string;
  emoji?: string;
  effects: Partial<Attrs>;
  trackBias?: Partial<Record<Track, number>>;
  outcome?: string;
  /**
   * 高风险高回报选项：选了之后按 chance 掷骰子
   * - 命中：使用 effects（高回报版本）+ outcome
   * - 未中：使用 fallbackEffects + fallbackOutcome（崩盘版本）
   * - 如果 fatalEndingId 有值且未命中，直接触发该结局
   */
  risk?: {
    /** 0~1 之间的成功概率，e.g. 0.4 = 40% 成功 */
    chance: number;
    /** 失败时的 effects（覆盖 effects） */
    fallbackEffects: Partial<Attrs>;
    /** 失败旁白 */
    fallbackOutcome: string;
    /** 失败时直接触发的结局 id（如 'burnout' / 'fired'） */
    fatalEndingId?: string;
  };
}

export interface EventTag {
  label: string;
  emoji: string;
  color: string;
}

export interface GameEvent {
  id: string;
  tag: EventTag;
  image: string;
  /** 触发的最小周数 */
  minWeek?: number;
  /** 触发的最大周数（用于晋升副本只在后期出现） */
  maxWeek?: number;
  /** 是否为晋升副本事件（仅完整版） */
  extendedOnly?: boolean;
  /** 职业专属事件：仅这个职业能触发；不填代表通用事件 */
  professionId?: Track;
  title: string;
  subtitle?: string;
  choices: Choice[];
}

export interface Ending {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  desc: string;
  /** 触发条件 */
  condition: (ctx: EndingCtx) => boolean;
  /** 触发提示，显示在图鉴未解锁状态 */
  hint?: string;
}

export interface EndingCtx {
  attrs: Attrs;
  week: number;
  topTrack: Track;
  trackScores: Record<Track, number>;
  graduated: boolean;
  difficulty: Difficulty;
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

export interface RunRecord {
  id: string;
  name: string;
  weeks: number;
  endingId: string;
  endingName: string;
  difficulty: Difficulty;
  at: number;
}
