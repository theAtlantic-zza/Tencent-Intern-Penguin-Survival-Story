import type { Attrs, AttrKey, Track } from './types';

export interface Profession {
  id: Track;
  name: string;
  emoji: string;
  desc: string;
  /** 起始属性（替代默认值） */
  baseAttrs: Attrs;
  /** 独门天赋（入职即自动激活，区别于通用天赋） */
  signatureTalent: {
    name: string;
    desc: string;
    /** 改造选项的实际生效数值 */
    modify: (effects: Partial<Attrs>) => Partial<Attrs>;
  };
}

/** 5 个入职部门 */
export const PROFESSIONS: Profession[] = [
  {
    id: 'pm',
    name: '产品鹅',
    emoji: '📋',
    desc: '画原型、写文档、追研发，梦想是改变世界，现实是改改需求。',
    baseAttrs: { hp: 7, iq: 6, eq: 8, money: 5, mentor: 0, rank: 0 },
    signatureTalent: {
      name: '需求评审',
      desc: '情商相关增益 +30%，但每次涉及体力的事件多消耗 1 点。',
      modify: (e) => {
        const out = { ...e };
        if (out.eq !== undefined && out.eq > 0) out.eq = Math.ceil(out.eq * 1.3);
        if (out.hp !== undefined && out.hp < 0) out.hp = out.hp - 1;
        return out;
      },
    },
  },
  {
    id: 'design',
    name: '设计鹅',
    emoji: '🎨',
    desc: '像素眼 + 完美主义，一个 banner 改 28 版是基操。',
    baseAttrs: { hp: 6, iq: 8, eq: 6, money: 5, mentor: 0, rank: 0 },
    signatureTalent: {
      name: '审美爆发',
      desc: '智力相关增益 +40%，但加班概率上升（体力消耗 +20%）。',
      modify: (e) => {
        const out = { ...e };
        if (out.iq !== undefined && out.iq > 0) out.iq = Math.ceil(out.iq * 1.4);
        if (out.hp !== undefined && out.hp < 0) out.hp = Math.floor(out.hp * 1.2);
        return out;
      },
    },
  },
  {
    id: 'dev',
    name: '研发鹅',
    emoji: '💻',
    desc: '凌晨三点对着 Bug 沉思，发际线与代码量成反比。',
    baseAttrs: { hp: 6, iq: 9, eq: 4, money: 7, mentor: 0, rank: 0 },
    signatureTalent: {
      name: '极限调试',
      desc: '体力消耗换取智力翻倍：体力 -2 以上时智力增益翻倍。',
      modify: (e) => {
        const out = { ...e };
        if ((out.hp ?? 0) <= -2 && out.iq !== undefined && out.iq > 0) {
          out.iq = out.iq * 2;
        }
        return out;
      },
    },
  },
  {
    id: 'op',
    name: '运营鹅',
    emoji: '📣',
    desc: '活动、文案、拉新、留存，KPI 永远比目标多 30%。',
    baseAttrs: { hp: 7, iq: 5, eq: 8, money: 6, mentor: 0, rank: 0 },
    signatureTalent: {
      name: '万物皆可营销',
      desc: '存款相关增益 +50%，但情商负向影响也翻倍（甲方磨人）。',
      modify: (e) => {
        const out = { ...e };
        if (out.money !== undefined && out.money > 0) out.money = Math.ceil(out.money * 1.5);
        if (out.eq !== undefined && out.eq < 0) out.eq = out.eq * 2;
        return out;
      },
    },
  },
  {
    id: 'staff',
    name: '职能鹅',
    emoji: '🗂️',
    desc: 'HR / 财务 / 行政 / 法务……鹅厂的隐形守护者。',
    baseAttrs: { hp: 8, iq: 6, eq: 7, money: 5, mentor: 1, rank: 0 },
    signatureTalent: {
      name: '流程精通',
      desc: '所有正向变化 +1（雨露均沾），但单次最大涨幅不超过 +5。',
      modify: (e) => {
        const out: Partial<Attrs> = { ...e };
        (Object.keys(out) as AttrKey[]).forEach((k) => {
          const v = out[k];
          if (v === undefined || v <= 0) return;
          out[k] = Math.min(v + 1, 5);
        });
        return out;
      },
    },
  },
];

export const PROFESSION_MAP: Record<string, Profession> = Object.fromEntries(
  PROFESSIONS.map((p) => [p.id, p]),
);

export function getProfessionById(id: string): Profession | undefined {
  return PROFESSION_MAP[id];
}
