// 实习生视角 - MVP 类型定义

export type AttrKey = 'hp' | 'iq' | 'eq' | 'money' | 'mentor' | 'rank';
// hp=体力 iq=智力 eq=情商 money=零花钱 mentor=导师好感 rank=转正进度

export type Attrs = Record<AttrKey, number>;

/** 5 条转正路线，决定结局走哪条 */
export type Track = 'pm' | 'design' | 'dev' | 'op' | 'staff';

export interface Choice {
  text: string;
  /** 选项前缀 emoji */
  emoji?: string;
  effects: Partial<Attrs>;
  /** 选项倾向：影响最终走哪条转正路线 */
  trackBias?: Partial<Record<Track, number>>;
  /** 选项后追加叙事 */
  outcome?: string;
}

/** 事件标签：用于顶部小徽章 */
export interface EventTag {
  label: string;
  emoji: string;
  /** Tailwind class，如 'bg-rose-100 text-rose-600' */
  color: string;
}

export interface GameEvent {
  id: string;
  tag: EventTag;
  /** 事件配图，public/images/xxx.png */
  image: string;
  /** 触发的最小周数 */
  minWeek?: number;
  /** 标题（粗） */
  title: string;
  /** 副标小字 */
  subtitle?: string;
  choices: Choice[];
}

export interface Ending {
  id: string;
  name: string;
  emoji: string;
  /** 结局插画 */
  image?: string;
  desc: string;
  /** 触发条件 */
  condition: (ctx: EndingCtx) => boolean;
}

export interface EndingCtx {
  attrs: Attrs;
  week: number;
  /** 倾向最高的路线 */
  topTrack: Track;
  trackScores: Record<Track, number>;
  /** 是否已撑满实习期 */
  graduated: boolean;
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
  at: number;
}
