import type { Track } from './types';

/** 5 条未来路线（实习成果方向） */
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

/** 实习总周数（实习期满 = 撑过 12 周） */
export const INTERN_WEEKS = 12;
