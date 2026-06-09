import type { Achievement, Ending } from './types';

/**
 * 实习生结局
 * 触发顺序：从上往下，先匹配先触发
 */
export const ENDINGS: Ending[] = [
  {
    id: 'burnout',
    name: '过劳猝死',
    emoji: '💀',
    image: '/images/event-dizzy.png',
    desc: '你倒在了工位上，最后一句话是："这个 bug 我修完就走。" 实习生涯戛然而止。',
    hint: '让体力归零。',
    condition: ({ attrs }) => attrs.hp <= 0,
  },
  {
    id: 'broke',
    name: '弹尽粮绝',
    emoji: '💸',
    image: '/images/ending-fired.png',
    desc: '存款见底、信用卡刷爆，你连下个月房租都凑不齐，只能含泪打包回家。',
    hint: '让存款跌到 -3 以下。',
    condition: ({ attrs }) => attrs.money <= -3,
  },
  {
    id: 'social_dead',
    name: '社死毕业',
    emoji: '😱',
    image: '/images/event-confused.png',
    desc: '一次失言让你在鹅厂彻底社会性死亡，再也抬不起头，只能默默退出实习群。',
    hint: '让情商跌到 -3 以下。',
    condition: ({ attrs }) => attrs.eq <= -3,
  },
  {
    id: 'fired',
    name: '提前劝退',
    emoji: '📦',
    image: '/images/ending-fired.png',
    desc: '导师把你叫到会议室，叹了口气："这个岗位可能不太适合你……" 你抱着纸箱离开了鹅厂。',
    hint: '让导师好感跌到 -3 以下并撑过 4 周。',
    condition: ({ attrs, week }) => attrs.mentor <= -3 && week >= 4,
  },
  {
    id: 'jumped',
    name: '中途跑路',
    emoji: '🏃',
    image: '/images/ending-fired.png',
    desc: '另一份 offer 太香，你头也不回地走了。鹅厂工牌挂在工位上孤零零地晃着。',
    hint: '在转正进度极低时主动跑路。',
    condition: ({ attrs, week }) => attrs.rank <= -5 && week >= 6,
  },
  {
    id: 'rich',
    name: '财富自由',
    emoji: '💎',
    image: '/images/event-reward.png',
    desc: '靠着股票 + 副业 + 期权，你提前实现财富自由，挥一挥衣袖去大理开了家咖啡馆。',
    hint: '让存款累计到 25 以上。',
    condition: ({ attrs }) => attrs.money >= 25,
  },
  {
    id: 'guru',
    name: '行业大牛',
    emoji: '🧠',
    image: '/images/event-reward.png',
    desc: '你成了业界 KOL，公众号 10w+，知乎大 V。鹅厂只是你简历上的一行字。',
    hint: '智力突破 22。',
    condition: ({ attrs }) => attrs.iq >= 22,
  },
  {
    id: 'graduate_top',
    name: '王牌实习生',
    emoji: '🏆',
    image: '/images/ending-graduate.png',
    desc: '你以全场最高评价拿到 SP offer，导师在朋友圈连发三条夸你。鹅厂未来是你的。',
    hint: '撑满全程并把转正进度拉到 18 以上。',
    condition: ({ graduated, attrs }) => graduated && attrs.rank >= 18,
  },
  {
    id: 'graduate_normal',
    name: '顺利转正',
    emoji: '🎓',
    image: '/images/ending-graduate.png',
    desc: '你顺利通过实习答辩，转正成为一只正式的鹅厂打工人。',
    hint: '撑满全程并把转正进度拉到 8 以上。',
    condition: ({ graduated, attrs }) => graduated && attrs.rank >= 8,
  },
  {
    id: 'graduate_fail',
    name: '实习未通过',
    emoji: '📉',
    image: '/images/ending-fired.png',
    desc: '12 周悄然过去，你拿到一份诚挚的"非常感谢你的付出"邮件。这就是社会的初体验。',
    hint: '撑满全程但转正进度不够。',
    condition: ({ graduated }) => graduated,
  },
];

/** 成就 */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_run', name: '初入鹅厂', emoji: '🐣', desc: '完成你的第一次实习。' },
  { id: 'reincarnate_3', name: '反复横跳', emoji: '🔁', desc: '累计转生 3 次。' },
  { id: 'graduate', name: '转正成功', emoji: '🎓', desc: '撑满实习期并成功转正。' },
  { id: 'speedrun', name: '光速猝死', emoji: '⚡', desc: '在第 5 周之前结束游戏。' },
  { id: 'collector', name: '结局收藏家', emoji: '🏆', desc: '解锁 5 个不同结局。' },
  { id: 'extended', name: '马拉松选手', emoji: '🏃', desc: '完整版 24 周通关一次。' },
  { id: 'rich', name: '小富即安', emoji: '💰', desc: '一局内存款达到 20 以上。' },
  { id: 'allTalents', name: '天赋全收集', emoji: '🌟', desc: '体验过全部 5 种天赋。' },
  { id: 'allPros', name: '五职归一', emoji: '🐧', desc: '体验过全部 5 个入职部门。' },
];
