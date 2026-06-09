import type { Achievement, Ending } from './types';

/**
 * 实习生结局
 * 触发顺序：从上往下，先匹配先触发
 * - graduate_normal 的描述会在 store 里根据 topTrack 动态拼接
 */
export const ENDINGS: Ending[] = [
  {
    id: 'burnout',
    name: '过劳猝死',
    emoji: '💀',
    image: '/images/event-dizzy.png',
    desc: '你倒在了工位上，最后一句话是："这个 bug 我修完就走。" 实习生涯戛然而止。',
    condition: ({ attrs }) => attrs.hp <= 0,
  },
  {
    id: 'broke',
    name: '弹尽粮绝',
    emoji: '💸',
    image: '/images/ending-fired.png',
    desc: '钱包归零、信用卡刷爆，你连下个月房租都凑不齐，只能含泪打包回家。',
    condition: ({ attrs }) => attrs.money <= -3,
  },
  {
    id: 'social_dead',
    name: '社死毕业',
    emoji: '😱',
    image: '/images/event-confused.png',
    desc: '一次失言让你在鹅厂彻底社会性死亡，再也抬不起头，只能默默退出实习群。',
    condition: ({ attrs }) => attrs.eq <= -3,
  },
  {
    id: 'fired',
    name: '提前劝退',
    emoji: '📦',
    image: '/images/ending-fired.png',
    desc: '导师把你叫到会议室，叹了口气："这个岗位可能不太适合你……" 你抱着纸箱离开了鹅厂。',
    condition: ({ attrs, week }) => attrs.mentor <= -3 && week >= 4,
  },
  {
    id: 'jumped',
    name: '中途跑路',
    emoji: '🏃',
    image: '/images/ending-fired.png',
    desc: '另一份 offer 太香，你头也不回地走了。鹅厂工牌挂在工位上孤零零地晃着。',
    condition: ({ attrs, week }) => attrs.rank <= -5 && week >= 6,
  },
  {
    id: 'graduate_top',
    name: '王牌实习生',
    emoji: '🏆',
    image: '/images/ending-graduate.png',
    desc: '你以全场最高评价拿到 SP offer，导师在朋友圈连发三条夸你。鹅厂未来是你的。',
    condition: ({ graduated, attrs }) => graduated && attrs.rank >= 18,
  },
  {
    id: 'graduate_normal',
    name: '顺利转正',
    emoji: '🎓',
    image: '/images/ending-graduate.png',
    // 实际文案会在 store 里根据 topTrack 拼接，这里是兜底
    desc: '你顺利通过实习答辩，转正成为一只正式的鹅厂打工人。',
    condition: ({ graduated, attrs }) => graduated && attrs.rank >= 8,
  },
  {
    id: 'graduate_fail',
    name: '实习未通过',
    emoji: '📉',
    image: '/images/ending-fired.png',
    desc: '12 周悄然过去，你拿到一份诚挚的"非常感谢你的付出"邮件。这就是社会的初体验。',
    condition: ({ graduated }) => graduated,
  },
];

/** 成就 */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_run', name: '初入鹅厂', emoji: '🐣', desc: '完成你的第一次实习。' },
  { id: 'reincarnate_3', name: '反复横跳', emoji: '🔁', desc: '累计转生 3 次。' },
  { id: 'graduate', name: '转正成功', emoji: '🎓', desc: '撑满 12 周并成功转正。' },
  { id: 'speedrun', name: '光速猝死', emoji: '⚡', desc: '在第 5 周之前结束游戏。' },
  { id: 'collector', name: '结局收藏家', emoji: '🏆', desc: '解锁 3 个不同结局。' },
];
