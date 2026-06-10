import type { Attrs, AttrKey } from './types';

/** 导师人设：开局 4 选 1，整局影响 effects 链路 + 周自动结算 */
export interface Mentor {
  id: string;
  name: string;
  emoji: string;
  /** 一句话自介 */
  desc: string;
  /** 风格标签 */
  vibe: string;
  /**
   * effects 加成：和 talent 类似，所有事件 effects 经过这一层
   */
  modify: (effects: Partial<Attrs>) => Partial<Attrs>;
  /**
   * 每周自动结算（在职业 passive 之后调用），可叠加被动效果
   */
  tick: (ctx: { week: number; attrs: Attrs }) => Partial<Attrs> | null;
  /**
   * 月度评语生成器：根据这 4 周属性变化生成一句吐槽/夸奖
   * delta 形如 { iq: +3, hp: -2 }
   */
  comment: (delta: Partial<Attrs>) => string;
}

export const MENTORS: Mentor[] = [
  {
    id: 'kevin',
    name: 'Kevin',
    emoji: '🥵',
    desc: '"今天加班吗？" 是他的口头禅。',
    vibe: '卷王导师',
    modify: (e) => {
      const out: Partial<Attrs> = { ...e };
      // 智力 / 转正进度正向收益 +30%
      if (out.iq !== undefined && out.iq > 0) out.iq = Math.ceil(out.iq * 1.3);
      if (out.rank !== undefined && out.rank > 0) out.rank = Math.ceil(out.rank * 1.3);
      // 体力消耗 +30%
      if (out.hp !== undefined && out.hp < 0) out.hp = Math.floor(out.hp * 1.3);
      return out;
    },
    tick: () => ({ hp: -1 }), // 跟着 Kevin 每周自动 -1 体力
    comment: (delta) => {
      const iq = delta.iq ?? 0;
      const rank = delta.rank ?? 0;
      if (iq + rank >= 8) return 'Kevin："这周还算可以。下周再加把劲。"';
      if (iq + rank >= 4) return 'Kevin："还能再卷一点，懂吗？"';
      return 'Kevin："你这进度，我都替你急。" ';
    },
  },
  {
    id: 'cathy',
    name: 'Cathy',
    emoji: '🐟',
    desc: '"差不多得了，别累着。" 工位上常年挂着摸鱼神器。',
    vibe: '摸鱼导师',
    modify: (e) => {
      const out: Partial<Attrs> = { ...e };
      // 情商正向 +20%
      if (out.eq !== undefined && out.eq > 0) out.eq = Math.ceil(out.eq * 1.2);
      // 转正进度正向 -30%
      if (out.rank !== undefined && out.rank > 0) out.rank = Math.floor(out.rank * 0.7);
      return out;
    },
    tick: () => ({ hp: 1 }), // 跟着 Cathy 每周自动 +1 体力
    comment: (delta) => {
      const hp = delta.hp ?? 0;
      const rank = delta.rank ?? 0;
      if (hp >= 0 && rank <= 4) return 'Cathy："养生得不错，进度嘛……不重要。"';
      if (hp < -3) return 'Cathy："你在拼什么命？早点下班好吗。"';
      return 'Cathy："状态可以。继续摸。"';
    },
  },
  {
    id: 'morgan',
    name: 'Morgan',
    emoji: '🧙',
    desc: '"你自己悟。" 总是欲言又止，眼神深邃。',
    vibe: '神秘导师',
    modify: (e) => {
      const out: Partial<Attrs> = { ...e };
      // 导师好感涨速 -50%（更难讨好）
      if (out.mentor !== undefined && out.mentor > 0)
        out.mentor = Math.floor(out.mentor * 0.5);
      return out;
    },
    tick: () => null,
    comment: (delta) => {
      const mentor = delta.mentor ?? 0;
      if (mentor >= 4) return 'Morgan："你比我想得有点意思。"';
      if (mentor >= 1) return 'Morgan："……" （他点了点头，没说话）';
      return 'Morgan："还需要再观察。"';
    },
  },
  {
    id: 'brian',
    name: 'Brian',
    emoji: '🤗',
    desc: '"都挺好都挺好。" 永远的笑脸 + 永远的好好先生。',
    vibe: '老好人导师',
    modify: (e) => {
      const out: Partial<Attrs> = { ...e };
      // 所有正向 +1（雨露均沾），所有负向 -1（一损俱损）
      (Object.keys(out) as AttrKey[]).forEach((k) => {
        const v = out[k];
        if (v === undefined) return;
        if (v > 0) out[k] = v + 1;
        else if (v < 0) out[k] = v - 1;
      });
      return out;
    },
    tick: () => null,
    comment: (delta) => {
      const total = (Object.values(delta) as number[]).reduce((a, b) => a + b, 0);
      if (total >= 5) return 'Brian："你这周挺棒的！加油哦！"';
      if (total >= -2) return 'Brian："都挺好的呀，不要太焦虑。"';
      return 'Brian："小磕碰难免，咱明天继续呀！"';
    },
  },
];

export const MENTOR_MAP: Record<string, Mentor> = Object.fromEntries(
  MENTORS.map((m) => [m.id, m]),
);

export function getMentorById(id: string): Mentor | undefined {
  return MENTOR_MAP[id];
}
