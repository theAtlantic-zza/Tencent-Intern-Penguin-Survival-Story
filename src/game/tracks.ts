import type { Difficulty, Track } from './types';

export const TRACKS: Record<Track, { name: string; emoji: string; desc: string }> = {
  pm: {
    name: '产品鹅',
    emoji: '📋',
    desc: '画原型、写文档、追研发，梦想是改变世界。',
  },
  design: {
    name: '设计鹅',
    emoji: '🎨',
    desc: '像素眼 + 完美主义，一个 banner 改 28 版是基操。',
  },
  dev: {
    name: '研发鹅',
    emoji: '💻',
    desc: '凌晨三点对着 Bug 沉思，发际线与代码量成反比。',
  },
  op: {
    name: '运营鹅',
    emoji: '📣',
    desc: '活动、文案、拉新、留存，KPI 永远比目标多 30%。',
  },
  staff: {
    name: '职能鹅',
    emoji: '🗂️',
    desc: 'HR / 财务 / 行政 / 法务……鹅厂的隐形守护者。',
  },
};

/** 难度配置 */
export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { name: string; emoji: string; weeks: number; desc: string; subtitle: string }
> = {
  standard: {
    name: '标准实习',
    emoji: '🐧',
    weeks: 12,
    desc: '12 周完整实习期，体验完整剧情线。',
    subtitle: '推荐第一次玩',
  },
  extended: {
    name: '完整鹅生',
    emoji: '🏆',
    weeks: 24,
    desc: '24 周长线挑战，第 13 周后开启「晋升副本」事件，硬度翻倍。',
    subtitle: '高玩挑战',
  },
};
