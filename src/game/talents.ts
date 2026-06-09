import type { Attrs, AttrKey, Talent } from './types';

/**
 * 5 个天赋：开局随机抽 3 个让玩家选 1
 * 每个天赋通过 modify 函数微调选项的实际生效数值
 */
export const TALENTS: Talent[] = [
  {
    id: 'scholar',
    name: '学霸',
    emoji: '🤓',
    desc: '智力相关增益 +50%，但情商提升打 7 折（社交太菜）。',
    modify: (e) => boost(e, { iq: 1.5, eq: 0.7 }),
  },
  {
    id: 'mouth',
    name: '嘴炮王',
    emoji: '🗣️',
    desc: '情商相关增益 +60%，导师好感 +30%。',
    modify: (e) => boost(e, { eq: 1.6, mentor: 1.3 }),
  },
  {
    id: 'iron',
    name: '铁打的身板',
    emoji: '💪',
    desc: '体力消耗 -50%（向下取整），但每次智力增益减半。',
    modify: (e) => {
      const out = { ...e };
      if (out.hp !== undefined && out.hp < 0) out.hp = Math.ceil(out.hp / 2);
      if (out.iq !== undefined && out.iq > 0) out.iq = Math.floor(out.iq * 0.5);
      return out;
    },
  },
  {
    id: 'lucky',
    name: '欧皇附体',
    emoji: '🍀',
    desc: '存款增益 +80%，每次属性下降时有 30% 概率免疫。',
    modify: (e) => {
      const out = { ...e };
      if (out.money !== undefined && out.money > 0) out.money = Math.ceil(out.money * 1.8);
      // 30% 概率把所有负向收益归零
      if (Math.random() < 0.3) {
        (Object.keys(out) as AttrKey[]).forEach((k) => {
          if ((out[k] ?? 0) < 0) out[k] = 0;
        });
      }
      return out;
    },
  },
  {
    id: 'climber',
    name: '卷王本王',
    emoji: '🔥',
    desc: '转正进度 +60%，但体力消耗额外 +30%（卷是要付出代价的）。',
    modify: (e) => {
      const out = { ...e };
      if (out.rank !== undefined && out.rank > 0) out.rank = Math.ceil(out.rank * 1.6);
      if (out.hp !== undefined && out.hp < 0) out.hp = Math.floor(out.hp * 1.3);
      return out;
    },
  },
];

/** 取 3 个不重复的天赋作为开局选项 */
export function rollTalents(): Talent[] {
  const arr = [...TALENTS];
  // Fisher-Yates 洗牌
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}

export function getTalentById(id: string): Talent | undefined {
  return TALENTS.find((t) => t.id === id);
}

/** 对 effects 按倍率调整（涨幅向上取整，跌幅向下取整保持惩罚感） */
function boost(
  effects: Partial<Attrs>,
  ratios: Partial<Record<AttrKey, number>>,
): Partial<Attrs> {
  const out: Partial<Attrs> = { ...effects };
  (Object.keys(ratios) as AttrKey[]).forEach((k) => {
    const r = ratios[k];
    const v = out[k];
    if (r === undefined || v === undefined || v === 0) return;
    out[k] = v > 0 ? Math.ceil(v * r) : Math.floor(v * r);
  });
  return out;
}
