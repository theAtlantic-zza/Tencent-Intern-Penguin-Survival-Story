import type { EventTag, GameEvent } from './types';

/** 标签预设，避免每个事件重复写 */
const TAG: Record<string, EventTag> = {
  health: { label: '健康警报', emoji: '🩺', color: 'bg-rose-50 text-rose-600' },
  work: { label: '工作日常', emoji: '💼', color: 'bg-tx-ice text-tx-blue' },
  social: { label: '同事八卦', emoji: '👀', color: 'bg-violet-50 text-violet-600' },
  boss: { label: '老板召唤', emoji: '📞', color: 'bg-amber-50 text-amber-600' },
  mentor: { label: '导师时刻', emoji: '🧑‍🏫', color: 'bg-emerald-50 text-emerald-600' },
  life: { label: '打工日常', emoji: '🐧', color: 'bg-sky-50 text-sky-600' },
  chance: { label: '机会来了', emoji: '✨', color: 'bg-yellow-50 text-yellow-700' },
  trap: { label: '小心有坑', emoji: '⚠️', color: 'bg-orange-50 text-orange-600' },
};

/**
 * 实习生事件库
 * - 每个事件都有大插画 + 标签 + 标题 + 选项
 * - 选项的 trackBias 决定最终走哪条转正路线
 */
export const EVENTS: GameEvent[] = [
  // === 入职 / 早期 ===
  {
    id: 'onboard',
    tag: TAG.life,
    image: '/images/hero.png',
    title: '入职第一天，HR 姐姐递给你一张工牌挂绳。',
    subtitle: '工牌上写着大大的"INTERN"，你深吸一口气。',
    choices: [
      { text: '低调挂在脖子上', emoji: '🙂', effects: { eq: 1, mentor: 1 } },
      { text: '骄傲地拍照发朋友圈', emoji: '📸', effects: { eq: -1, hp: 1 }, outcome: '高中同学们集体点赞。' },
      { text: '塞进口袋假装不是实习生', emoji: '🤫', effects: { eq: -1, iq: 1 } },
    ],
  },
  {
    id: 'first_meeting',
    tag: TAG.work,
    image: '/images/event-confused.png',
    title: '第一次参加部门周会，导师让你做个自我介绍。',
    choices: [
      { text: '一本正经报学校 + 专业', emoji: '🎓', effects: { eq: 1, mentor: 1, rank: 1 }, trackBias: { pm: 1 } },
      { text: '甩一段沙雕段子', emoji: '😎', effects: { eq: 2, hp: -1 }, trackBias: { op: 2 } },
      { text: '紧张到话都说不清', emoji: '😰', effects: { eq: -2, mentor: -1 } },
    ],
  },
  {
    id: 'lunch',
    tag: TAG.life,
    image: '/images/event-canteen.png',
    title: '中午食堂，三个窗口排队都很长。',
    subtitle: '黄焖鸡、麻辣烫、轻食沙拉……',
    choices: [
      { text: '🍗 黄焖鸡，回血就完事', effects: { hp: 2, money: -1 } },
      { text: '🌶 麻辣烫，顺便和邻桌唠两句', effects: { hp: 1, eq: 1, money: -1 }, trackBias: { op: 1 } },
      { text: '🥗 轻食沙拉，假装很自律', effects: { hp: -1, iq: 1, eq: 1 }, trackBias: { design: 1 } },
    ],
  },
  {
    id: 'doc_read',
    tag: TAG.work,
    image: '/images/event-overtime.png',
    title: '导师丢给你一份 200 页的项目文档，让你"先看看"。',
    choices: [
      { text: '🤓 一字不漏读完', effects: { iq: 3, hp: -2, mentor: 2, rank: 2 }, trackBias: { dev: 2, pm: 1 } },
      { text: '⏩ 只看目录摘要', effects: { iq: 1, eq: 1 }, trackBias: { pm: 1 } },
      { text: '🤖 让 AI 总结一下', effects: { iq: 2, eq: -1 }, trackBias: { dev: 1 } },
    ],
  },

  // === 任务挑战 ===
  {
    id: 'first_task',
    tag: TAG.mentor,
    image: '/images/event-confused.png',
    title: '导师扔给你第一个任务："这个小需求你试试看。"',
    subtitle: '你打开需求文档：1 句话，无背景，无验收。',
    choices: [
      { text: '✋ 主动追问需求背景', effects: { iq: 1, mentor: 2, rank: 2, eq: 1 }, trackBias: { pm: 2 } },
      { text: '🤔 自己脑补硬做', effects: { iq: 2, hp: -1, rank: 1 }, trackBias: { dev: 2 } },
      { text: '😶 默默搜一下别人怎么做', effects: { iq: 1, eq: -1 }, trackBias: { staff: 1 } },
    ],
  },
  {
    id: 'design_review',
    tag: TAG.work,
    image: '/images/event-confused.png',
    title: '设计稿评审，老板说："五彩斑斓的黑，再大气一点。"',
    choices: [
      { text: '🎨 默默改第 17 版', effects: { hp: -2, mentor: 1, rank: 1 }, trackBias: { design: 3 } },
      { text: '📝 先把需求结构化记下来', effects: { iq: 2, eq: 1, rank: 1 }, trackBias: { pm: 2 } },
      { text: '🙋 当场问"具体大气是指？"', effects: { eq: -1, iq: 1, mentor: -1 } },
    ],
  },
  {
    id: 'bug',
    tag: TAG.trap,
    image: '/images/event-overtime.png',
    title: '你提交的代码被测试打回，说有个偶现 Bug。',
    choices: [
      { text: '🐛 通宵复现到天亮', effects: { hp: -3, iq: 3, mentor: 2, rank: 2 }, trackBias: { dev: 3 } },
      { text: '🤝 找同事一起定位', effects: { eq: 2, iq: 1, rank: 1 }, trackBias: { dev: 1, pm: 1 } },
      { text: '🙈 改两行说"应该好了"', effects: { hp: 1, mentor: -2, rank: -1 } },
    ],
  },
  {
    id: 'campaign',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    title: '运营组在策划一个活动，缺人手，有人喊你上。',
    subtitle: '"实习生顶上！锻炼锻炼！"',
    choices: [
      { text: '🔥 主动接，文案、海报全包', effects: { hp: -2, eq: 2, rank: 2, money: 1 }, trackBias: { op: 3 } },
      { text: '🖼 只接设计部分', effects: { hp: -1, iq: 1, rank: 1 }, trackBias: { design: 2 } },
      { text: '🙅 婉拒，专心本职', effects: { eq: -1, mentor: -1 } },
    ],
  },
  {
    id: 'data_report',
    tag: TAG.work,
    image: '/images/event-overtime.png',
    title: '导师让你出一份周报数据。',
    choices: [
      { text: '📊 做个炫酷可视化图', effects: { iq: 2, hp: -1, mentor: 2, rank: 2 }, trackBias: { pm: 2, design: 1 } },
      { text: '📋 直接 Excel 拉表格', effects: { iq: 1, rank: 1 }, trackBias: { staff: 2 } },
      { text: '🤥 编一个差不多的数', effects: { mentor: -3, rank: -2, eq: -1 } },
    ],
  },

  // === 同事 / 社交 ===
  {
    id: 'mentor_chat',
    tag: TAG.mentor,
    image: '/images/hero.png',
    title: '导师约你下午茶，问你"对鹅厂感觉怎么样？"',
    choices: [
      { text: '☕ 真诚地夸，但提一点建议', effects: { eq: 2, mentor: 3, iq: 1 }, trackBias: { pm: 1, staff: 1 } },
      { text: '🍰 全程商业互吹', effects: { eq: 1, mentor: 1 } },
      { text: '🍵 把吐槽全倒出来', effects: { hp: 1, mentor: -2 } },
    ],
  },
  {
    id: 'colleague_help',
    tag: TAG.social,
    image: '/images/event-confused.png',
    title: '隔壁组的姐姐找你帮忙处理点杂事。',
    subtitle: '"反正实习生闲着也是闲着对吧？"',
    choices: [
      { text: '😊 笑着帮了', effects: { eq: 2, hp: -1, mentor: 1 }, trackBias: { staff: 2, op: 1 } },
      { text: '🙇 委婉拒绝', effects: { eq: -1, hp: 1, iq: 1 } },
      { text: '🤝 帮一半，剩下让她自己来', effects: { eq: 1, iq: 1 }, trackBias: { pm: 1 } },
    ],
  },
  {
    id: 'gossip',
    tag: TAG.social,
    image: '/images/event-confused.png',
    title: '茶水间撞见两位老员工在吐槽某 leader。',
    choices: [
      { text: '👂 假装没听见走开', effects: { eq: 1, mentor: 1 } },
      { text: '🗣 凑过去一起吐槽', effects: { eq: -2, hp: 1 } },
      { text: '🙃 礼貌点头不接话', effects: { eq: 2, iq: 1 }, trackBias: { staff: 2 } },
    ],
  },
  {
    id: 'group_share',
    tag: TAG.work,
    image: '/images/event-reward.png',
    title: '部门内部分享，导师说："实习生也讲一个吧。"',
    choices: [
      { text: '🎤 认真准备一份 PPT', effects: { iq: 3, hp: -2, mentor: 2, rank: 3 }, trackBias: { pm: 2, design: 1 } },
      { text: '🪞 复述一篇技术博客', effects: { iq: 1, mentor: 1, rank: 1 }, trackBias: { dev: 2 } },
      { text: '🙏 装病推掉', effects: { hp: 2, mentor: -2, rank: -1 } },
    ],
  },

  // === 老板 / 关键事件 ===
  {
    id: 'boss_elevator',
    tag: TAG.boss,
    image: '/images/event-confused.png',
    title: '电梯里偶遇大老板，他问你："最近做啥呢？"',
    choices: [
      { text: '🎯 30 秒电梯演讲', effects: { eq: 2, mentor: 1, rank: 2 }, trackBias: { pm: 2, op: 1 } },
      { text: '😅 尬笑挠头', effects: { eq: -1 } },
      { text: '🤓 顺便提一个产品建议', effects: { eq: 1, iq: 2, rank: 2 }, trackBias: { pm: 3 } },
    ],
  },
  {
    id: 'boss_call',
    tag: TAG.boss,
    image: '/images/event-overtime.png',
    title: '周五晚上 10 点，老板突然 @ 你："明早要个方案。"',
    choices: [
      { text: '💪 通宵肝完', effects: { hp: -3, iq: 2, mentor: 2, rank: 3 }, trackBias: { dev: 1, pm: 2 } },
      { text: '🧠 列个框架，明早再补', effects: { hp: -1, iq: 2, rank: 2 }, trackBias: { pm: 3 } },
      { text: '🛌 装作没看见手机', effects: { hp: 2, mentor: -3, rank: -2 } },
    ],
  },
  {
    id: 'review',
    tag: TAG.boss,
    image: '/images/event-confused.png',
    title: '月度面谈，导师说："你这个月表现……还行。"',
    choices: [
      { text: '📈 直接问怎么改进', effects: { iq: 2, mentor: 2, rank: 2 }, trackBias: { pm: 1 } },
      { text: '🥲 微笑接受', effects: { eq: 1, mentor: -1 } },
      { text: '🥊 据理力争举例反驳', effects: { eq: -1, iq: 1, rank: 1 } },
    ],
  },

  // === 健康 / 生活 ===
  {
    id: 'dizzy',
    tag: TAG.health,
    image: '/images/event-dizzy.png',
    title: '连续加班一周，今早起床突然一阵天旋地转。',
    subtitle: '你的身体，正在疯狂敲响警钟。',
    choices: [
      { text: '🏥 请假去医院', effects: { hp: 4, mentor: -1, rank: -1 } },
      { text: '💊 吃片药扛过去', effects: { hp: -1, mentor: 1, rank: 1 } },
      { text: '🧋 点杯养生奶茶骗自己', effects: { hp: -2, money: -1, eq: 1 } },
    ],
  },
  {
    id: 'overtime',
    tag: TAG.life,
    image: '/images/event-overtime.png',
    title: '晚上九点，工位灯还亮着。',
    choices: [
      { text: '🔥 继续肝', effects: { hp: -2, iq: 1, mentor: 1, rank: 2 } },
      { text: '🚪 果断下班', effects: { hp: 3, mentor: -1 } },
      { text: '🎭 假装加班刷手机', effects: { hp: 1, eq: -1, mentor: 1 } },
    ],
  },
  {
    id: 'broke',
    tag: TAG.life,
    image: '/images/event-confused.png',
    title: '月底了，你查了一下卡里余额。',
    subtitle: '只剩两位数。',
    choices: [
      { text: '💰 找妈妈打钱', effects: { money: 4, eq: -1 } },
      { text: '🍜 吃一个月泡面', effects: { hp: -2, money: 2 } },
      { text: '💼 主动接外包活', effects: { hp: -1, iq: 1, money: 3 }, trackBias: { dev: 1, design: 1 } },
    ],
  },
  {
    id: 'fitness',
    tag: TAG.life,
    image: '/images/event-canteen.png',
    title: '公司发了健身房月卡。',
    choices: [
      { text: '🏋️ 每天打卡', effects: { hp: 3, iq: -1 } },
      { text: '📷 拍照发朋友圈一次', effects: { eq: 1 } },
      { text: '🎁 转手送人', effects: { eq: 2, hp: -1 } },
    ],
  },
  {
    id: 'cat',
    tag: TAG.life,
    image: '/images/hero.png',
    title: '公司楼下捡到一只流浪猫，它一直跟着你。',
    choices: [
      { text: '🐈 带回工位偷偷养', effects: { hp: 2, eq: 2, money: -1, mentor: -1 } },
      { text: '🏥 送去宠物医院', effects: { eq: 2, money: -2 } },
      { text: '📸 拍张照然后离开', effects: { eq: -1 } },
    ],
  },

  // === 机会 / 关键节点 ===
  {
    id: 'oncall',
    tag: TAG.chance,
    image: '/images/event-overtime.png',
    title: '凌晨三点线上 P0 故障，群里 @ 全员。',
    choices: [
      { text: '⚡ 第一个跳出来分析日志', effects: { hp: -3, iq: 3, mentor: 3, rank: 4 }, trackBias: { dev: 4 } },
      { text: '📞 通知值班同事', effects: { eq: 2, mentor: 1, rank: 1 }, trackBias: { staff: 2 } },
      { text: '🙈 假装在睡觉', effects: { hp: 1, mentor: -3, rank: -2 } },
    ],
  },
  {
    id: 'innovation',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    title: '部门搞内部 hackathon，欢迎实习生组队。',
    choices: [
      { text: '🚀 拉个小团队参赛', effects: { hp: -2, iq: 3, eq: 2, rank: 3, mentor: 2 }, trackBias: { pm: 2, dev: 2 } },
      { text: '🎨 帮其他队做设计', effects: { hp: -1, iq: 1, eq: 1, rank: 1 }, trackBias: { design: 3 } },
      { text: '🛋 在家躺一周', effects: { hp: 3, mentor: -2 } },
    ],
  },
  {
    id: 'present',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    title: '老板突然说："你来给客户讲一下方案。"',
    choices: [
      { text: '🎤 上！稳住', effects: { eq: 3, iq: 2, mentor: 3, rank: 3, hp: -1 }, trackBias: { op: 3, pm: 1 } },
      { text: '📑 帮老板递 PPT', effects: { eq: 1, mentor: 1, rank: 1 }, trackBias: { staff: 2 } },
      { text: '🙅 推说今天不舒服', effects: { hp: 1, mentor: -2, rank: -2 } },
    ],
  },
  {
    id: 'process',
    tag: TAG.work,
    image: '/images/event-confused.png',
    title: '一份合同要走 8 个审批节点，全部门都被卡住了。',
    choices: [
      { text: '📞 一个个打电话推流程', effects: { hp: -2, eq: 2, mentor: 2, rank: 3 }, trackBias: { staff: 4 } },
      { text: '🤷 等着就行', effects: { hp: 1, mentor: -1 } },
      { text: '💡 顺手画个流程图给老板', effects: { iq: 2, mentor: 2, rank: 2 }, trackBias: { staff: 2, pm: 1 } },
    ],
  },
  {
    id: 'user_research',
    tag: TAG.work,
    image: '/images/event-canteen.png',
    title: '产品组要做用户调研，缺一个能聊的人。',
    choices: [
      { text: '🎙 主动报名做访谈', effects: { eq: 3, iq: 2, rank: 2, hp: -1 }, trackBias: { pm: 3, op: 2 } },
      { text: '📝 帮忙整理录音', effects: { iq: 2, rank: 1 }, trackBias: { pm: 1 } },
      { text: '🙅 不参与', effects: { mentor: -1 } },
    ],
  },
  {
    id: 'bonus',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    title: '实习中期奖金到账，比你预想多。',
    choices: [
      { text: '💰 全存起来', effects: { money: 4, iq: 1 } },
      { text: '🎁 给导师买杯好咖啡', effects: { money: 2, mentor: 3, eq: 1 } },
      { text: '🎮 直接换台 Switch', effects: { money: -1, hp: 2, eq: -1 } },
    ],
  },

  // === 后期 / 转正前夕 ===
  {
    id: 'rumor',
    tag: TAG.social,
    image: '/images/event-confused.png',
    title: '听说今年实习生留用名额砍半。',
    minWeek: 6,
    choices: [
      { text: '🧘 不慌，把活干好', effects: { mentor: 2, rank: 2, hp: -1 } },
      { text: '😱 焦虑到失眠', effects: { hp: -3, iq: -1, eq: -1 } },
      { text: '🔍 立刻投别家做 Plan B', effects: { iq: 2, mentor: -2, rank: -1 } },
    ],
  },
  {
    id: 'pre_review',
    tag: TAG.boss,
    image: '/images/event-overtime.png',
    title: '转正答辩前夜，PPT 还差一半。',
    minWeek: 9,
    choices: [
      { text: '🌙 通宵改完', effects: { hp: -3, iq: 2, rank: 4, mentor: 2 } },
      { text: '🤝 求导师 review', effects: { mentor: 3, rank: 3, eq: 1 }, trackBias: { pm: 2 } },
      { text: '😴 睡了，明天再说', effects: { hp: 2, mentor: -3, rank: -3 } },
    ],
  },
  {
    id: 'final_review',
    tag: TAG.boss,
    image: '/images/event-reward.png',
    title: '终轮答辩，评委追问："你最大的产出是什么？"',
    minWeek: 10,
    choices: [
      { text: '📊 数据 + 案例双管齐下', effects: { iq: 3, eq: 2, rank: 4, mentor: 2 }, trackBias: { pm: 2 } },
      { text: '😤 谦虚地说团队功劳大', effects: { eq: 2, rank: 2 }, trackBias: { staff: 2 } },
      { text: '🙃 支支吾吾说不清', effects: { eq: -2, rank: -3, mentor: -2 } },
    ],
  },
  {
    id: 'temptation',
    tag: TAG.trap,
    image: '/images/event-confused.png',
    title: '另一家公司发来 offer，给的钱比转正还多。',
    minWeek: 8,
    choices: [
      { text: '🚪 当场离职走人', effects: { money: 4, mentor: -5, rank: -10 } },
      { text: '💼 谈完再做决定', effects: { iq: 2, eq: 1 } },
      { text: '🐧 婉拒，留下继续干', effects: { mentor: 3, rank: 2, eq: 1 } },
    ],
  },
];
