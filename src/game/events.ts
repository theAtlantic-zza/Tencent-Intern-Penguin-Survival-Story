import type { EventTag, GameEvent } from './types';

/** 标签预设 */
const TAG: Record<string, EventTag> = {
  health: { label: '健康警报', emoji: '🩺', color: 'bg-rose-50 text-rose-600' },
  work: { label: '工作日常', emoji: '💼', color: 'bg-tx-ice text-tx-blue' },
  social: { label: '同事八卦', emoji: '👀', color: 'bg-violet-50 text-violet-600' },
  boss: { label: '老板召唤', emoji: '📞', color: 'bg-amber-50 text-amber-600' },
  mentor: { label: '导师时刻', emoji: '🧑‍🏫', color: 'bg-emerald-50 text-emerald-600' },
  life: { label: '打工日常', emoji: '🐧', color: 'bg-sky-50 text-sky-600' },
  chance: { label: '机会来了', emoji: '✨', color: 'bg-yellow-50 text-yellow-700' },
  trap: { label: '小心有坑', emoji: '⚠️', color: 'bg-orange-50 text-orange-600' },
  promo: { label: '晋升副本', emoji: '⚔️', color: 'bg-fuchsia-50 text-fuchsia-700' },
};

/**
 * 实习生事件库
 * 每个 choice 都带原创 outcome 旁白，做完选择后玩家会看到一段剧情化反馈
 */
export const EVENTS: GameEvent[] = [
  // ============ 通用事件 ============
  {
    id: 'onboard',
    tag: TAG.life,
    image: '/images/hero.png',
    title: '入职第一天，HR 姐姐递给你一张工牌挂绳。',
    subtitle: '工牌上写着大大的"INTERN"，你深吸一口气。',
    choices: [
      {
        text: '低调挂在脖子上',
        emoji: '🙂',
        effects: { eq: 1, mentor: 1 },
        outcome: '你把工牌端端正正挂好。导师瞥了一眼，露出"这孩子靠谱"的微笑。',
      },
      {
        text: '骄傲地拍照发朋友圈',
        emoji: '📸',
        effects: { eq: -1, hp: 1 },
        outcome: '九宫格已发，配文：「鹅厂第一天，启程！」高中同学集体来点赞，工位旁边的产品鹅瞄了你一眼，没说话。',
      },
      {
        text: '塞进口袋假装不是实习生',
        emoji: '🤫',
        effects: { eq: -1, iq: 1 },
        outcome: '你一边走路一边偷瞄路过的工牌——原来他们也是实习生。你的伪装毫无意义。',
      },
    ],
  },
  {
    id: 'first_meeting',
    tag: TAG.work,
    image: '/images/event-confused.png',
    title: '第一次参加部门周会，导师让你做个自我介绍。',
    choices: [
      {
        text: '一本正经报学校 + 专业',
        emoji: '🎓',
        effects: { eq: 1, mentor: 1, rank: 1 },
        trackBias: { pm: 1 },
        outcome: '你说完后会议室一片"嗯嗯"的礼貌点头，导师在小本本上记了一笔。稳了。',
      },
      {
        text: '甩一段沙雕段子',
        emoji: '😎',
        effects: { eq: 2, hp: -1 },
        trackBias: { op: 2 },
        outcome: '全场爆笑。leader 说："这个孩子有点东西。"——你瞬间成了部门活宝。',
      },
      {
        text: '紧张到话都说不清',
        emoji: '😰',
        effects: { eq: -2, mentor: -1 },
        outcome: '你结结巴巴说了三十秒，最后一句话是"嗯，就这样"。导师默默叹了口气。',
      },
    ],
  },
  {
    id: 'lunch',
    tag: TAG.life,
    image: '/images/event-canteen.png',
    title: '中午食堂，三个窗口排队都很长。',
    subtitle: '黄焖鸡、麻辣烫、轻食沙拉……',
    choices: [
      {
        text: '🍗 黄焖鸡，回血就完事',
        effects: { hp: 2, money: -1 },
        outcome: '一大碗下肚，你瘫在椅子上发出满足的叹息。下午的会议你将无情挑战瞌睡。',
      },
      {
        text: '🌶 麻辣烫，顺便和邻桌唠两句',
        effects: { hp: 1, eq: 1, money: -1 },
        trackBias: { op: 1 },
        outcome: '邻桌的运营鹅一边吸粉丝一边跟你聊上了，临走还加了你微信。社交+1。',
      },
      {
        text: '🥗 轻食沙拉，假装很自律',
        effects: { hp: -1, iq: 1, eq: 1 },
        trackBias: { design: 1 },
        outcome: '一盘叶子下肚，肚子两小时后开始抗议。但工位旁边的同事问你："你最近在减脂吗？" 你笑而不答。',
      },
    ],
  },
  {
    id: 'doc_read',
    tag: TAG.work,
    image: '/images/event-overtime.png',
    title: '导师丢给你一份 200 页的项目文档，让你"先看看"。',
    choices: [
      {
        text: '🤓 一字不漏读完',
        effects: { iq: 3, hp: -2, mentor: 2, rank: 2 },
        trackBias: { dev: 2, pm: 1 },
        outcome: '凌晨一点你合上文档，眼睛又干又涩——但你已经能讲出整个系统的来龙去脉。导师第二天问你的问题，你对答如流。',
      },
      {
        text: '⏩ 只看目录摘要',
        effects: { iq: 1, eq: 1 },
        trackBias: { pm: 1 },
        outcome: '你扫了 15 分钟，假装看完了。导师追问细节时你含糊其辞，他没追究，但表情有点微妙。',
      },
      {
        text: '🤖 让 AI 总结一下',
        effects: { iq: 2, eq: -1 },
        trackBias: { dev: 1 },
        outcome: 'AI 给你列了一份漂亮的脑图。你把脑图复述给导师，他眯起眼睛："这总结得有点眼熟……"',
      },
    ],
  },
  {
    id: 'first_task',
    tag: TAG.mentor,
    image: '/images/event-confused.png',
    title: '导师扔给你第一个任务："这个小需求你试试看。"',
    subtitle: '你打开需求文档：1 句话，无背景，无验收。',
    choices: [
      {
        text: '✋ 主动追问需求背景',
        effects: { iq: 1, mentor: 2, rank: 2, eq: 1 },
        trackBias: { pm: 2 },
        outcome: '导师愣了一下，然后笑了："问得挺到位。" 接下来一小时他给你讲了整个项目的来龙去脉。',
      },
      {
        text: '🤔 自己脑补硬做',
        effects: { iq: 2, hp: -1, rank: 1 },
        trackBias: { dev: 2 },
        outcome: '你闷头肝了三个晚上做出来。导师一看："这……和我想的不太一样，但也不错？" 你长舒一口气。',
      },
      {
        text: '😶 默默搜一下别人怎么做',
        effects: { iq: 1, eq: -1 },
        trackBias: { staff: 1 },
        outcome: '你照着前人的方案抄了一版交上去。能跑，但毫无亮点。导师评价："中规中矩。"',
      },
    ],
  },
  {
    id: 'design_review',
    tag: TAG.work,
    image: '/images/event-confused.png',
    title: '设计稿评审，老板说："五彩斑斓的黑，再大气一点。"',
    choices: [
      {
        text: '🎨 默默改第 17 版',
        effects: { hp: -2, mentor: 1, rank: 1 },
        trackBias: { design: 3 },
        outcome: '你把第 17 版交上去，老板说："就是这个感觉！" ——你看了眼对比图，跟第 3 版几乎一样。',
      },
      {
        text: '📝 先把需求结构化记下来',
        effects: { iq: 2, eq: 1, rank: 1 },
        trackBias: { pm: 2 },
        outcome: '你列了一张"老板偏好清单"，每条都附上参考图。下次评审，你一稿过。',
      },
      {
        text: '🙋 当场问"具体大气是指？"',
        effects: { eq: -1, iq: 1, mentor: -1 },
        outcome: '会议室陷入两秒尴尬的沉默。老板皱眉："这还用问吗？" 导师在桌底踢了你一脚。',
      },
    ],
  },
  {
    id: 'bug',
    tag: TAG.trap,
    image: '/images/event-overtime.png',
    title: '你提交的代码被测试打回，说有个偶现 Bug。',
    choices: [
      {
        text: '🐛 通宵复现到天亮',
        effects: { hp: -3, iq: 3, mentor: 2, rank: 2 },
        trackBias: { dev: 3 },
        outcome: '凌晨 4 点，你终于复现并定位到问题——是个并发竞态。修完那一刻，你想哭。',
      },
      {
        text: '🤝 找同事一起定位',
        effects: { eq: 2, iq: 1, rank: 1 },
        trackBias: { dev: 1, pm: 1 },
        outcome: '隔壁工位的老 K 哥过来一看："这不是上次那个坑吗？" 五分钟搞定。你给他点了奶茶。',
      },
      {
        text: '🙈 改两行说"应该好了"',
        effects: { hp: 1, mentor: -2, rank: -1 },
        outcome: '第二天测试又来找你："还在复现。" 这次导师亲自来盯，气氛凝重。',
      },
    ],
  },
  {
    id: 'campaign',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    title: '运营组在策划一个活动，缺人手，有人喊你上。',
    subtitle: '"实习生顶上！锻炼锻炼！"',
    choices: [
      {
        text: '🔥 主动接，文案、海报全包',
        effects: { hp: -2, eq: 2, rank: 2, money: 1 },
        trackBias: { op: 3 },
        outcome: '活动上线那天数据爆表，运营 leader 在群里 @ 你："这个实习生是谁？给我留个 HC。"',
      },
      {
        text: '🖼 只接设计部分',
        effects: { hp: -1, iq: 1, rank: 1 },
        trackBias: { design: 2 },
        outcome: '你出的几张海报被运营拿去 A/B 测试，CTR 提升了 18%。设计 leader 把你拉进了组里聊天群。',
      },
      {
        text: '🙅 婉拒，专心本职',
        effects: { eq: -1, mentor: -1 },
        outcome: '你没接，活动后来火了。茶水间里听同事讨论，你默默低头喝水。',
      },
    ],
  },
  {
    id: 'data_report',
    tag: TAG.work,
    image: '/images/event-overtime.png',
    title: '导师让你出一份周报数据。',
    choices: [
      {
        text: '📊 做个炫酷可视化图',
        effects: { iq: 2, hp: -1, mentor: 2, rank: 2 },
        trackBias: { pm: 2, design: 1 },
        outcome: '导师把你的周报转发给了 leader，leader 又转发给了部门群："这个图好看，以后都按这个模板。"',
      },
      {
        text: '📋 直接 Excel 拉表格',
        effects: { iq: 1, rank: 1 },
        trackBias: { staff: 2 },
        outcome: '一张工整的 Excel 摆在导师桌上。他点点头："数据没问题，发吧。" 简单高效。',
      },
      {
        text: '🤥 编一个差不多的数',
        effects: { mentor: -3, rank: -2, eq: -1 },
        outcome: '导师对了一下后台原始数据，眼神沉了下来："这个数据，你是怎么算的？" 你冷汗下来了。',
      },
    ],
  },
  {
    id: 'mentor_chat',
    tag: TAG.mentor,
    image: '/images/hero.png',
    title: '导师约你下午茶，问你"对鹅厂感觉怎么样？"',
    choices: [
      {
        text: '☕ 真诚地夸，但提一点建议',
        effects: { eq: 2, mentor: 3, iq: 1 },
        trackBias: { pm: 1, staff: 1 },
        outcome: '导师认真听完："你这个观察很细，我帮你提到 leader 那边。" 临走还多送了你一杯。',
      },
      {
        text: '🍰 全程商业互吹',
        effects: { eq: 1, mentor: 1 },
        outcome: '气氛和谐，但导师起身时拍了拍你的肩膀："以后有意见可以直说。"',
      },
      {
        text: '🍵 把吐槽全倒出来',
        effects: { hp: 1, mentor: -2 },
        outcome: '你越说越激动，导师全程礼貌微笑。第二天，你被踢出了几个核心讨论群。',
      },
    ],
  },
  {
    id: 'colleague_help',
    tag: TAG.social,
    image: '/images/event-confused.png',
    title: '隔壁组的姐姐找你帮忙处理点杂事。',
    subtitle: '"反正实习生闲着也是闲着对吧？"',
    choices: [
      {
        text: '😊 笑着帮了',
        effects: { eq: 2, hp: -1, mentor: 1 },
        trackBias: { staff: 2, op: 1 },
        outcome: '姐姐很感动，请你喝了一杯瑞幸。从此整个隔壁组都对你笑脸相迎。',
      },
      {
        text: '🙇 委婉拒绝',
        effects: { eq: -1, hp: 1, iq: 1 },
        outcome: '"哦哦没事的。" 姐姐笑着走了。但你能感觉到她身后那一丝凉意。',
      },
      {
        text: '🤝 帮一半，剩下让她自己来',
        effects: { eq: 1, iq: 1 },
        trackBias: { pm: 1 },
        outcome: '姐姐说："谢谢你！剩下我能搞定。" 双赢。你在心里点了个赞。',
      },
    ],
  },
  {
    id: 'gossip',
    tag: TAG.social,
    image: '/images/event-confused.png',
    title: '茶水间撞见两位老员工在吐槽某 leader。',
    choices: [
      {
        text: '👂 假装没听见走开',
        effects: { eq: 1, mentor: 1 },
        outcome: '你装作只是来接水，倒满就走。两位老员工都没正眼看你——这才是聪明人的做法。',
      },
      {
        text: '🗣 凑过去一起吐槽',
        effects: { eq: -2, hp: 1 },
        outcome: '你刚说两句，背后传来一声咳嗽——被吐槽的 leader 站在门口。整个茶水间静止了三秒。',
      },
      {
        text: '🙃 礼貌点头不接话',
        effects: { eq: 2, iq: 1 },
        trackBias: { staff: 2 },
        outcome: '你笑着冲他们点点头，倒水离开。多年后回想起来，这是你在职场学会的第一课。',
      },
    ],
  },
  {
    id: 'group_share',
    tag: TAG.work,
    image: '/images/event-reward.png',
    title: '部门内部分享，导师说："实习生也讲一个吧。"',
    choices: [
      {
        text: '🎤 认真准备一份 PPT',
        effects: { iq: 3, hp: -2, mentor: 2, rank: 3 },
        trackBias: { pm: 2, design: 1 },
        outcome: '你讲了 20 分钟，全场无人玩手机。leader 私聊你："这个分享干货很足，下次部门大会也来讲一下。"',
      },
      {
        text: '🪞 复述一篇技术博客',
        effects: { iq: 1, mentor: 1, rank: 1 },
        trackBias: { dev: 2 },
        outcome: '你照着博客读了一遍。听众礼貌点头，但有个老员工低声问邻座："这不是上周掘金那篇吗？"',
      },
      {
        text: '🙏 装病推掉',
        effects: { hp: 2, mentor: -2, rank: -1 },
        outcome: '你发了条"突发肠胃炎"的消息。导师回了个"好"。但下次分享你还是要讲，逃得了一时逃不了一世。',
      },
    ],
  },
  {
    id: 'boss_elevator',
    tag: TAG.boss,
    image: '/images/event-confused.png',
    title: '电梯里偶遇大老板，他问你："最近做啥呢？"',
    choices: [
      {
        text: '🎯 30 秒电梯演讲',
        effects: { eq: 2, mentor: 1, rank: 2 },
        trackBias: { pm: 2, op: 1 },
        outcome: '老板眼神亮了一下："这个项目我听说过，做得不错。" 出电梯前他记住了你的名字。',
      },
      {
        text: '😅 尬笑挠头',
        effects: { eq: -1 },
        outcome: '"就……就那样吧。" 老板礼貌一笑，电梯叮的一声开了。机会就这样溜走了。',
      },
      {
        text: '🤓 顺便提一个产品建议',
        effects: { eq: 1, iq: 2, rank: 2 },
        trackBias: { pm: 3 },
        outcome: '老板停顿了一下："这个想法有点意思，你回头写个详细方案发我邮箱。" ——你找到了一条快速通道。',
      },
    ],
  },
  {
    id: 'boss_call',
    tag: TAG.boss,
    image: '/images/event-overtime.png',
    title: '周五晚上 10 点，老板突然 @ 你："明早要个方案。"',
    choices: [
      {
        text: '💪 通宵肝完',
        effects: { hp: -3, iq: 2, mentor: 2, rank: 3 },
        trackBias: { dev: 1, pm: 2 },
        outcome: '凌晨四点你点了发送。早上九点老板回："非常棒。" 你瘫在床上睡了一整天。',
      },
      {
        text: '🧠 列个框架，明早再补',
        effects: { hp: -1, iq: 2, rank: 2 },
        trackBias: { pm: 3 },
        outcome: '你睡了 4 小时，早上一杯咖啡灌下，迅速把框架填实。老板对你的"先框架后细节"思路赞不绝口。',
      },
      {
        text: '🛌 装作没看见手机',
        effects: { hp: 2, mentor: -3, rank: -2 },
        outcome: '周一早上你打开钉钉，看到老板的"？？"和导师的连环问号。空气突然安静。',
      },
    ],
  },
  {
    id: 'review',
    tag: TAG.boss,
    image: '/images/event-confused.png',
    title: '月度面谈，导师说："你这个月表现……还行。"',
    choices: [
      {
        text: '📈 直接问怎么改进',
        effects: { iq: 2, mentor: 2, rank: 2 },
        trackBias: { pm: 1 },
        outcome: '导师愣了一秒，然后给你列了五条具体建议。"这种态度我喜欢。" 他说。',
      },
      {
        text: '🥲 微笑接受',
        effects: { eq: 1, mentor: -1 },
        outcome: '你点点头说"好的我会努力"。导师叹了口气："你回去想想吧。"',
      },
      {
        text: '🥊 据理力争举例反驳',
        effects: { eq: -1, iq: 1, rank: 1 },
        outcome: '你举出三件你做得不错的事。导师认真听完："这些我看到了，但还是希望你能……" 一场博弈。',
      },
    ],
  },
  {
    id: 'dizzy',
    tag: TAG.health,
    image: '/images/event-dizzy.png',
    title: '连续加班一周，今早起床突然一阵天旋地转。',
    subtitle: '你的身体，正在疯狂敲响警钟。',
    choices: [
      {
        text: '🏥 请假去医院',
        effects: { hp: 4, mentor: -1, rank: -1 },
        outcome: '医生说："年轻人不要拿命换钱。" 你回家躺了一天，群里 99+ 消息，但身体确实舒服多了。',
      },
      {
        text: '💊 吃片药扛过去',
        effects: { hp: -1, mentor: 1, rank: 1 },
        outcome: '你硬撑到下班，导师拍拍你的肩："今天辛苦了。" 一句话，值了。但晚上你躺在床上盯着天花板转。',
      },
      {
        text: '🧋 点杯养生奶茶骗自己',
        effects: { hp: -2, money: -1, eq: 1 },
        outcome: '"加红枣枸杞，少糖。" 你郑重其事地下了订单，仿佛这样就能续命。',
      },
    ],
  },
  {
    id: 'overtime',
    tag: TAG.life,
    image: '/images/event-overtime.png',
    title: '晚上九点，工位灯还亮着。',
    choices: [
      {
        text: '🔥 继续肝',
        effects: { hp: -2, iq: 1, mentor: 1, rank: 2 },
        outcome: '你又干到 11 点，做完了别人两天的活。第二天早会上 leader 当众表扬了你——但你眼下的青黑藏不住了。',
      },
      {
        text: '🚪 果断下班',
        effects: { hp: 3, mentor: -1 },
        outcome: '你 9:01 准时下班，地铁里还有座位。一时洒脱，但群里那条"还在的同学辛苦了"你假装没看见。',
      },
      {
        text: '🎭 假装加班刷手机',
        effects: { hp: 1, eq: -1, mentor: 1 },
        outcome: '你打开 IDE 不动，刷了两小时小红书。10 点半离开时跟导师说"先走了"，他点了点头——这场表演完美。',
      },
    ],
  },
  {
    id: 'broke',
    tag: TAG.life,
    image: '/images/event-confused.png',
    title: '月底了，你查了一下卡里余额。',
    subtitle: '只剩两位数。',
    choices: [
      {
        text: '💰 找妈妈打钱',
        effects: { money: 4, eq: -1 },
        outcome: '妈妈一边唠叨"鹅厂工资这么高怎么还借钱"一边秒到账。你说"下个月还。" 你们都知道这是骗人的。',
      },
      {
        text: '🍜 吃一个月泡面',
        effects: { hp: -2, money: 2 },
        outcome: '一周后你看到泡面盒就反胃。但你硬是扛了 30 天，钱包活了。',
      },
      {
        text: '💼 主动接外包活',
        effects: { hp: -1, iq: 1, money: 3 },
        trackBias: { dev: 1, design: 1 },
        outcome: '你利用周末做了三天外包，到手 3000。打工人的第二增长曲线，开始了。',
      },
    ],
  },
  {
    id: 'fitness',
    tag: TAG.life,
    image: '/images/event-canteen.png',
    title: '公司发了健身房月卡。',
    choices: [
      {
        text: '🏋️ 每天打卡',
        effects: { hp: 3, iq: -1 },
        outcome: '一个月后你的胸围 +2cm，但工作 OKR 完成度 -15%。leader 委婉地说："状态不错，但是……"',
      },
      {
        text: '📷 拍照发朋友圈一次',
        effects: { eq: 1 },
        outcome: '你穿着崭新的运动服站在跑步机前自拍。点赞 38，发完就没去过第二次。',
      },
      {
        text: '🎁 转手送人',
        effects: { eq: 2, hp: -1 },
        outcome: '你把月卡送给了爱健身的同事，他感动地请你吃了顿饭。你的肌肉变小了，但人脉变大了。',
      },
    ],
  },
  {
    id: 'cat',
    tag: TAG.life,
    image: '/images/hero.png',
    title: '公司楼下捡到一只流浪猫，它一直跟着你。',
    choices: [
      {
        text: '🐈 带回工位偷偷养',
        effects: { hp: 2, eq: 2, money: -1, mentor: -1 },
        outcome: '它成了部门新晋顶流，每天有人偷偷投喂。但 HR 发了一封"工位禁止带宠物"的全员邮件……',
      },
      {
        text: '🏥 送去宠物医院',
        effects: { eq: 2, money: -2 },
        outcome: '医生说它需要绝育和疫苗。你忍痛刷了卡，回头在朋友圈发了它的照片：自由的猫，自由的我。',
      },
      {
        text: '📸 拍张照然后离开',
        effects: { eq: -1 },
        outcome: '你拍了张照发了个"今日份治愈"，然后走了。回家路上你一直在想，它现在怎么样了。',
      },
    ],
  },
  {
    id: 'oncall',
    tag: TAG.chance,
    image: '/images/event-overtime.png',
    title: '凌晨三点线上 P0 故障，群里 @ 全员。',
    choices: [
      {
        text: '⚡ 第一个跳出来分析日志',
        effects: { hp: -3, iq: 3, mentor: 3, rank: 4 },
        trackBias: { dev: 4 },
        outcome: '你 10 分钟定位，30 分钟修复。早上 leader 在群里说："这位同学今晚救了我们。" 你的名字第一次进了管理层视野。',
      },
      {
        text: '📞 通知值班同事',
        effects: { eq: 2, mentor: 1, rank: 1 },
        trackBias: { staff: 2 },
        outcome: '你冷静地拉群、@人、记录时间线。事后值班同事专门感谢你："关键时刻你的协调救了我。"',
      },
      {
        text: '🙈 假装在睡觉',
        effects: { hp: 1, mentor: -3, rank: -2 },
        outcome: '第二天早会复盘，你被点名："凌晨群里@了三次都没回。" 整个会议室没人替你说话。',
      },
    ],
  },
  {
    id: 'innovation',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    title: '部门搞内部 hackathon，欢迎实习生组队。',
    choices: [
      {
        text: '🚀 拉个小团队参赛',
        effects: { hp: -2, iq: 3, eq: 2, rank: 3, mentor: 2 },
        trackBias: { pm: 2, dev: 2 },
        outcome: '你们三人组拿了三等奖。颁奖时 leader 笑着说："这个实习生 hold 住了整个组的节奏。"',
      },
      {
        text: '🎨 帮其他队做设计',
        effects: { hp: -1, iq: 1, eq: 1, rank: 1 },
        trackBias: { design: 3 },
        outcome: '你做的 UI 帮其他队拿了"最佳人气"。三个队长都来加你微信："以后有设计活我们找你。"',
      },
      {
        text: '🛋 在家躺一周',
        effects: { hp: 3, mentor: -2 },
        outcome: '你睡了 14 小时，刷了一整周综艺。回公司时听同事在聊 hackathon，你突然觉得有点错过什么。',
      },
    ],
  },
  {
    id: 'present',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    title: '老板突然说："你来给客户讲一下方案。"',
    choices: [
      {
        text: '🎤 上！稳住',
        effects: { eq: 3, iq: 2, mentor: 3, rank: 3, hp: -1 },
        trackBias: { op: 3, pm: 1 },
        outcome: '你深呼吸三秒，然后开讲。客户全程认真听，最后说："这个实习生，专业。" 老板朝你竖了大拇指。',
      },
      {
        text: '📑 帮老板递 PPT',
        effects: { eq: 1, mentor: 1, rank: 1 },
        trackBias: { staff: 2 },
        outcome: '你完美地配合了老板，PPT 切换无缝、水杯及时递上。老板私下说："小事见心。"',
      },
      {
        text: '🙅 推说今天不舒服',
        effects: { hp: 1, mentor: -2, rank: -2 },
        outcome: '老板没说什么，转头让另一个同事上。会后你看到那个同事进了核心项目群，而你没有。',
      },
    ],
  },
  {
    id: 'process',
    tag: TAG.work,
    image: '/images/event-confused.png',
    title: '一份合同要走 8 个审批节点，全部门都被卡住了。',
    choices: [
      {
        text: '📞 一个个打电话推流程',
        effects: { hp: -2, eq: 2, mentor: 2, rank: 3 },
        trackBias: { staff: 4 },
        outcome: '你打了 12 通电话，3 小时内合同走完了所有节点。整个部门都记住了这个能办事的实习生。',
      },
      {
        text: '🤷 等着就行',
        effects: { hp: 1, mentor: -1 },
        outcome: '一周后合同还在第 3 个节点。leader 大发雷霆，但没人主动认领责任。',
      },
      {
        text: '💡 顺手画个流程图给老板',
        effects: { iq: 2, mentor: 2, rank: 2 },
        trackBias: { staff: 2, pm: 1 },
        outcome: '你的流程图被老板转发到了高层群，标题写着"应该所有部门学习"。',
      },
    ],
  },
  {
    id: 'user_research',
    tag: TAG.work,
    image: '/images/event-canteen.png',
    title: '产品组要做用户调研，缺一个能聊的人。',
    choices: [
      {
        text: '🎙 主动报名做访谈',
        effects: { eq: 3, iq: 2, rank: 2, hp: -1 },
        trackBias: { pm: 3, op: 2 },
        outcome: '你聊了 12 个用户，整理出一份洞察报告，三个观点直接写进了产品规划。',
      },
      {
        text: '📝 帮忙整理录音',
        effects: { iq: 2, rank: 1 },
        trackBias: { pm: 1 },
        outcome: '你抠完 8 小时录音，给每段都打了标签。产品经理感动："这质量，比外包靠谱。"',
      },
      {
        text: '🙅 不参与',
        effects: { mentor: -1 },
        outcome: '你专心干自己的活。产品组的活动名单上少了你的名字，未来一段时间也不会有了。',
      },
    ],
  },
  {
    id: 'bonus',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    title: '实习中期奖金到账，比你预想多。',
    choices: [
      {
        text: '💰 全存起来',
        effects: { money: 4, iq: 1 },
        outcome: '你打开理财 App，看着余额暗自盘算"距离财富自由还差……" 算完发现还很远，但好歹是个开始。',
      },
      {
        text: '🎁 给导师买杯好咖啡',
        effects: { money: 2, mentor: 3, eq: 1 },
        outcome: '导师收到时愣了一下："你这小子。" 但接下来一周，他给你的活都明显更核心了。',
      },
      {
        text: '🎮 直接换台 Switch',
        effects: { money: -1, hp: 2, eq: -1 },
        outcome: '《塞尔达》成了你这个月的避风港。但工位上你顶着黑眼圈被导师问："最近又熬夜了？"',
      },
    ],
  },
  {
    id: 'rumor',
    tag: TAG.social,
    image: '/images/event-confused.png',
    title: '听说今年实习生留用名额砍半。',
    minWeek: 6,
    choices: [
      {
        text: '🧘 不慌，把活干好',
        effects: { mentor: 2, rank: 2, hp: -1 },
        outcome: '你假装没听见，继续高质量交付。两周后导师私下跟你说："留用名单我帮你争了。"',
      },
      {
        text: '😱 焦虑到失眠',
        effects: { hp: -3, iq: -1, eq: -1 },
        outcome: '连续三天失眠，工作出错。leader 委婉地说："你最近状态不太好。" 你心里更慌了。',
      },
      {
        text: '🔍 立刻投别家做 Plan B',
        effects: { iq: 2, mentor: -2, rank: -1 },
        outcome: '你拿到了两个面试机会。但导师在你电脑屏幕上瞥见了简历，气氛瞬间凝固。',
      },
    ],
  },
  {
    id: 'pre_review',
    tag: TAG.boss,
    image: '/images/event-overtime.png',
    title: '转正答辩前夜，PPT 还差一半。',
    minWeek: 9,
    choices: [
      {
        text: '🌙 通宵改完',
        effects: { hp: -3, iq: 2, rank: 4, mentor: 2 },
        outcome: '凌晨 5 点你保存最后一版，瘫在椅子上。八点钟答辩，你顶着熊猫眼但稿子滚瓜烂熟。',
      },
      {
        text: '🤝 求导师 review',
        effects: { mentor: 3, rank: 3, eq: 1 },
        trackBias: { pm: 2 },
        outcome: '导师抽出一小时帮你梳理逻辑，标红了三个关键点。"明天稳了。" 他说。',
      },
      {
        text: '😴 睡了，明天再说',
        effects: { hp: 2, mentor: -3, rank: -3 },
        outcome: '答辩当天你一脸蒙圈地讲完，评委没怎么提问——这不是好事。',
      },
    ],
  },
  {
    id: 'final_review',
    tag: TAG.boss,
    image: '/images/event-reward.png',
    title: '终轮答辩，评委追问："你最大的产出是什么？"',
    minWeek: 10,
    choices: [
      {
        text: '📊 数据 + 案例双管齐下',
        effects: { iq: 3, eq: 2, rank: 4, mentor: 2 },
        trackBias: { pm: 2 },
        outcome: '你列出三个核心指标 + 两个案例。评委频频点头，最后一句话是："这就是我们要的人。"',
      },
      {
        text: '😤 谦虚地说团队功劳大',
        effects: { eq: 2, rank: 2 },
        trackBias: { staff: 2 },
        outcome: '"我做得不多，主要靠 leader 和同事。" 评委对视一眼："格局不错。"',
      },
      {
        text: '🙃 支支吾吾说不清',
        effects: { eq: -2, rank: -3, mentor: -2 },
        outcome: '你说了半天没说到重点。一个评委轻声问："你上半年具体做了什么？" 你脑子一片空白。',
      },
    ],
  },
  {
    id: 'temptation',
    tag: TAG.trap,
    image: '/images/event-confused.png',
    title: '另一家公司发来 offer，给的钱比转正还多。',
    minWeek: 8,
    choices: [
      {
        text: '🚪 当场离职走人',
        effects: { money: 4, mentor: -5, rank: -10 },
        outcome: '你一周后入职新东家。回头看朋友圈，导师发了条："祝某某前程似锦。" 字里行间有点凉。',
      },
      {
        text: '💼 谈完再做决定',
        effects: { iq: 2, eq: 1 },
        outcome: '你和对方谈了三轮，终于看清了对方的真实底牌——也看清了自己想要什么。',
      },
      {
        text: '🐧 婉拒，留下继续干',
        effects: { mentor: 3, rank: 2, eq: 1 },
        outcome: '你回了一句"谢谢但暂时不考虑"。两个月后你听说那家公司业务收缩——你长舒一口气。',
      },
    ],
  },

  // ============ 晋升副本（仅完整版第 13 周后触发） ============
  {
    id: 'promo_review',
    tag: TAG.promo,
    image: '/images/event-overtime.png',
    extendedOnly: true,
    minWeek: 13,
    title: '半年绩效大盘点，你被拉进 5 人横评名单。',
    subtitle: '同期里要分出 1 个 SP、3 个 A、1 个 B。',
    choices: [
      {
        text: '📊 拼命做述职 PPT',
        effects: { hp: -3, iq: 2, rank: 4, mentor: 2 },
        outcome: '你做了 60 页的述职稿，评委的提问你一一接住。结果出来：A+，仅次于第一名。',
      },
      {
        text: '🤝 找导师内部铺路',
        effects: { mentor: 4, rank: 3, eq: 2, money: -2 },
        outcome: '导师在评委会前替你说了几句话。你最终拿到 A，但请导师吃饭花了不少。',
      },
      {
        text: '😶 听天由命',
        effects: { hp: 2, mentor: -2, rank: -2 },
        outcome: '你交了一份普通的述职。结果是 B。导师叹气："早跟你说过要重视。"',
      },
    ],
  },
  {
    id: 'promo_org',
    tag: TAG.promo,
    image: '/images/event-confused.png',
    extendedOnly: true,
    minWeek: 14,
    title: '组织架构调整，你的部门要被合并到另一个 BG。',
    choices: [
      {
        text: '🚀 主动跟着新业务',
        effects: { iq: 2, eq: 2, rank: 3, hp: -2 },
        trackBias: { pm: 2, op: 2 },
        outcome: '你成为新组的"老人"，半年后新 leader 重用你。变化即机会，你赌对了。',
      },
      {
        text: '🛡 抱紧导师大腿',
        effects: { mentor: 3, eq: 1, rank: 1 },
        outcome: '导师调到哪你跟到哪。虽然换了个不熟的方向，但身边有熟人，安全感拉满。',
      },
      {
        text: '🚪 申请转岗别的组',
        effects: { eq: 1, mentor: -2, rank: -3 },
        outcome: '你跑到了另一个看似稳定的组。三个月后那个组也被裁了——人生啊。',
      },
    ],
  },
  {
    id: 'promo_poach',
    tag: TAG.promo,
    image: '/images/event-reward.png',
    extendedOnly: true,
    minWeek: 15,
    title: '猎头打来电话：另一家大厂给你开 1.5 倍薪资。',
    choices: [
      {
        text: '💰 跳了！',
        effects: { money: 8, mentor: -6, rank: -8 },
        outcome: '你拎着行李去了新东家。鹅厂工位邻居发朋友圈："恭喜某某高就。" 但谁都知道他下面那条评论："这次跳早了？"',
      },
      {
        text: '🤔 拿这个谈反聘',
        effects: { money: 4, eq: 2, rank: 2, mentor: -1 },
        outcome: '你拿 offer 跟 leader 谈了一次，他给你加了 30%。导师私下说："你这招用得有点冒险。"',
      },
      {
        text: '🐧 婉拒，路还长',
        effects: { mentor: 3, rank: 2 },
        outcome: '你说"谢谢但我相信这里。" 三个月后你被晋升——leader 知道你拒了那家。',
      },
    ],
  },
  {
    id: 'promo_pip',
    tag: TAG.promo,
    image: '/images/event-dizzy.png',
    extendedOnly: true,
    minWeek: 16,
    title: 'leader 找你聊："最近状态有点……要不你做个改进计划？"',
    subtitle: '这是传说中的 PIP（绩效改进计划）。',
    choices: [
      {
        text: '🔥 立军令状，下个季度翻盘',
        effects: { hp: -4, iq: 3, rank: 5, mentor: 2 },
        outcome: '三个月后你不仅完成 OKR 还超额 30%。leader 在全员会上说："这就是绝地反击的样子。"',
      },
      {
        text: '📝 老老实实写改进文档',
        effects: { iq: 2, mentor: 1, rank: 2, hp: -1 },
        outcome: '你交了一份诚恳的复盘。leader 点点头："态度可以。" 给了你三个月观察期。',
      },
      {
        text: '🥲 主动找 HR 谈裸辞',
        effects: { hp: 2, mentor: -5, rank: -8, money: -2 },
        outcome: '你递了离职申请。HR 姐姐看着你："这一年的奖金就这么不要了？" 你点点头。',
      },
    ],
  },
  {
    id: 'promo_lead',
    tag: TAG.promo,
    image: '/images/event-reward.png',
    extendedOnly: true,
    minWeek: 13,
    title: 'leader 让你 Owner 一个 5 人小项目。',
    choices: [
      {
        text: '👑 全程主导',
        effects: { hp: -3, iq: 3, eq: 3, rank: 5, mentor: 3 },
        trackBias: { pm: 3 },
        outcome: '你拉群、定 OKR、跟进度、复盘。三个月后项目上线，五个人在群里集体发花——你成了真正的小 leader。',
      },
      {
        text: '🤝 平等协作',
        effects: { eq: 2, iq: 2, rank: 2 },
        trackBias: { pm: 1, dev: 1 },
        outcome: '你不强势但全员买账。项目按时交付，leader 评价："气氛 ok，但缺少决断力。"',
      },
      {
        text: '🙅 我还想再学学',
        effects: { mentor: -2, rank: -2 },
        outcome: 'leader 把项目交给了另一个人，那人三个月后晋升了。你看着对方的工牌，沉默了一会儿。',
      },
    ],
  },
  {
    id: 'promo_layoff',
    tag: TAG.promo,
    image: '/images/ending-fired.png',
    extendedOnly: true,
    minWeek: 17,
    title: '部门优化名单出来了，你不在第一批，但同组的好兄弟在。',
    choices: [
      {
        text: '🤐 默默旁观',
        effects: { eq: -2, hp: -1 },
        outcome: '你假装一切如常。但他临走那天看着你的眼神，你一辈子都忘不了。',
      },
      {
        text: '📢 找 HR 帮他争取',
        effects: { eq: 3, mentor: -1, rank: -1, money: -1 },
        outcome: '你硬着头皮敲开了 HR 的门。最终他多拿了两个月赔偿，临走时拍着你的肩说："这辈子记你一份情。"',
      },
      {
        text: '🍻 请他喝酒送行',
        effects: { eq: 2, money: -2, hp: -1 },
        outcome: '你们喝到凌晨。他笑着说："鹅厂留不住所有人，但留住了我们的兄弟情。" 你眼眶有点热。',
      },
    ],
  },
  {
    id: 'promo_share',
    tag: TAG.promo,
    image: '/images/event-reward.png',
    extendedOnly: true,
    minWeek: 14,
    title: '股票期权解锁了一部分。',
    choices: [
      {
        text: '💎 全部行权然后持有',
        effects: { money: 6, iq: 1 },
        outcome: '你按下"持有"按钮的瞬间，仿佛听见自己说："我赌它涨。" 一年后你发现自己赌对了。',
      },
      {
        text: '💸 立刻卖掉变现',
        effects: { money: 9, eq: 1 },
        outcome: '钱秒到账，你换了台新 MacBook + 一只 PS5。一年后股价翻倍，你假装没看见。',
      },
      {
        text: '🎁 给爸妈打过去',
        effects: { money: 4, eq: 3, hp: 1 },
        outcome: '你妈在电话那头哭了很久："我儿真出息了。" 这一笔钱，比赚到的本身更有意义。',
      },
    ],
  },
  {
    id: 'promo_keynote',
    tag: TAG.promo,
    image: '/images/event-reward.png',
    extendedOnly: true,
    minWeek: 18,
    title: '公司年会，你被选去做主舞台 keynote。',
    choices: [
      {
        text: '🎤 上！稳住全公司',
        effects: { eq: 4, rank: 6, mentor: 3, hp: -3 },
        trackBias: { op: 3, pm: 2 },
        outcome: '你站在 5000 人面前讲了 15 分钟，全场掌声雷动。CEO 下台后专门来握你的手。这一刻你想哭。',
      },
      {
        text: '🎭 做个搞笑短视频代替',
        effects: { eq: 3, rank: 2, hp: -1 },
        trackBias: { op: 2, design: 2 },
        outcome: '你的视频在内网爆了，转发破万。但 leader 私下说："我以为你会上台讲。"',
      },
      {
        text: '🙅 死活推掉',
        effects: { mentor: -3, rank: -3 },
        outcome: '机会被让给了同期，他借此一炮而红。你看着他在群里被各种夸，沉默地关掉了手机。',
      },
    ],
  },
  {
    id: 'promo_vp',
    tag: TAG.promo,
    image: '/images/event-confused.png',
    extendedOnly: true,
    minWeek: 19,
    title: 'VP 突然 1on1 找你，问你"接下来三年怎么规划？"',
    choices: [
      {
        text: '🎯 清晰 OKR + 路径',
        effects: { iq: 3, eq: 2, mentor: 4, rank: 5 },
        trackBias: { pm: 3 },
        outcome: 'VP 听完笑了："这思路比我手下一些 leader 还清晰。" 一周后你的工号被加进了核心讨论群。',
      },
      {
        text: '😅 谦虚说想多学习',
        effects: { mentor: 1, eq: 1 },
        outcome: 'VP 点点头："好的，慢慢来。" 但那种"还不够"的眼神你看见了。',
      },
      {
        text: '🔥 直接说想坐他位置',
        effects: { eq: -2, mentor: 2, rank: 3 },
        outcome: 'VP 哈哈大笑："有志气！" 但接下来三个月，他给你的任务难度翻了三倍。',
      },
    ],
  },
  {
    id: 'promo_burnout',
    tag: TAG.promo,
    image: '/images/event-dizzy.png',
    extendedOnly: true,
    minWeek: 20,
    title: '连肝三个月，你开始怀疑人生。',
    choices: [
      {
        text: '🏖 请年假去三亚',
        effects: { hp: 5, money: -3, mentor: -1 },
        outcome: '你在沙滩上发了一周呆，回来时晒黑了一圈，但眼睛里有光了。',
      },
      {
        text: '🧘 请心理咨询师聊聊',
        effects: { hp: 3, eq: 2, money: -2 },
        outcome: '咨询师说："你不是不行，你只是太累了。" 你哭了 20 分钟。',
      },
      {
        text: '🍜 在工位下泡面继续干',
        effects: { hp: -3, rank: 2, mentor: 1 },
        outcome: '你又肝了三个月，绩效拿到了 A。但镜子里的你，已经认不出自己了。',
      },
    ],
  },
  {
    id: 'promo_final',
    tag: TAG.promo,
    image: '/images/ending-graduate.png',
    extendedOnly: true,
    minWeek: 22,
    title: '终极晋升答辩，VP + GM 联评。',
    choices: [
      {
        text: '🚀 数据 + 案例 + 愿景三件套',
        effects: { iq: 4, eq: 3, rank: 8, mentor: 4, hp: -3 },
        outcome: '你讲完后会议室一片寂静，然后 GM 第一个鼓掌——晋升通过。你出门那一刻，腿是软的。',
      },
      {
        text: '🤝 抱团答辩，强调团队',
        effects: { eq: 4, rank: 4, mentor: 2 },
        trackBias: { staff: 3 },
        outcome: '"团队的成绩不是我一个人的功劳。" 你说。VP 点头："格局够大。" 晋升 ok。',
      },
      {
        text: '🥲 临场怯了支支吾吾',
        effects: { eq: -3, rank: -5, mentor: -3 },
        outcome: '你结巴了 20 分钟。结果出来时，你已经知道答案。',
      },
    ],
  },

  // ============ 产品鹅 专属 ============
  {
    id: 'pm_change_req',
    professionId: 'pm',
    tag: TAG.work,
    image: '/images/event-confused.png',
    title: '研发哥怒视你："这个需求你昨天才说定稿，今天又改？"',
    choices: [
      {
        text: '🛡 坚持改',
        effects: { eq: -2, iq: 1, rank: 1 },
        outcome: '研发摔了下鼠标继续改。当晚他发了条朋友圈："不想干了。" 仅你不可见。',
      },
      {
        text: '↩️ 撤回需求',
        effects: { eq: 1, hp: -1, mentor: -1 },
        outcome: '"算了算了下个版本再说。" 你说。但接下来一周 leader 看你的眼神都不太对劲。',
      },
      {
        text: '🧋 请他喝奶茶',
        effects: { money: -1, eq: 2, mentor: 1 },
        outcome: '一杯霸王茶姬下肚，研发哥的火气消了大半："行吧，看在奶茶的份上。"',
      },
    ],
  },
  {
    id: 'pm_dau',
    professionId: 'pm',
    tag: TAG.boss,
    image: '/images/event-overtime.png',
    minWeek: 4,
    title: '上线一周 DAU 不升反降，老板让你给个解释。',
    choices: [
      {
        text: '🪞 甩锅给设计',
        effects: { eq: -2, hp: 1, mentor: -1 },
        outcome: '"按钮颜色没设计好，用户找不到。" 你说。设计听到后给你递了一杯咖啡——杯子上写着"敬甩锅人"。',
      },
      {
        text: '🪞 甩锅给研发',
        effects: { eq: -2, hp: 1, mentor: -1 },
        outcome: '"代码有性能问题，加载慢。" 研发当场打开监控："数据从来没超过 200ms。" 全场寂静。',
      },
      {
        text: '📊 认真复盘报告',
        effects: { iq: 3, hp: -1, eq: 1, rank: 3, mentor: 2 },
        outcome: '你列了 6 个原因 + 3 个改进方案。老板看完点头："这就是产品的态度。"',
      },
    ],
  },
  {
    id: 'pm_battle',
    professionId: 'pm',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    minWeek: 6,
    title: '需求评审会，被质问"为什么这么做？"',
    subtitle: '同部门 5 个产品同事都看着你。',
    choices: [
      {
        text: '📈 用数据 + 用户故事 + 竞品分析三连',
        effects: { iq: 3, eq: 2, rank: 4, mentor: 2 },
        outcome: '你 3 分钟讲清楚 4 个维度。老产品在群里发了句："后生可畏。"',
      },
      {
        text: '😎 反问"那你觉得应该怎么做？"',
        effects: { eq: -1, iq: 1, rank: 1 },
        outcome: '空气安静了三秒。老产品嗤笑一声："我不做产品的。" 你心里一凉。',
      },
      {
        text: '🤐 沉默，会后再补',
        effects: { eq: -1, hp: -1 },
        outcome: '会议室没人帮你接话。会后你给所有人发了补充材料，但已经晚了。',
      },
    ],
  },

  // ============ 设计鹅 专属 ============
  {
    id: 'design_revise',
    professionId: 'design',
    tag: TAG.work,
    image: '/images/event-confused.png',
    title: '甲方说："五彩斑斓的黑，再大气一点。"',
    choices: [
      {
        text: '😇 微笑改第 17 版',
        effects: { hp: -3, eq: 1, mentor: 1, rank: 1 },
        outcome: '改完凌晨两点。第二天甲方说："还是第一版好。" 你深呼吸三次，没说话。',
      },
      {
        text: '🪄 换个文件名再交一次',
        effects: { iq: 2, eq: 1, rank: 1 },
        outcome: '"这版你看？" 甲方眼睛一亮："这版好多了！" 你和导师对了个不易察觉的眼神。',
      },
      {
        text: '⚔️ 据理力争',
        effects: { eq: -2, iq: 1, mentor: -1 },
        outcome: '你详细解释了色彩理论。甲方："专业的事我不懂，但我就要五彩斑斓的黑。" 鸡同鸭讲。',
      },
    ],
  },
  {
    id: 'design_ip',
    professionId: 'design',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    minWeek: 5,
    title: '你设计的 IP 形象在小红书上火了，但被指"撞款"。',
    choices: [
      {
        text: '📣 发公告澄清',
        effects: { eq: 1, iq: 1, mentor: 1 },
        outcome: '你诚恳列出参考来源和原创点。评论区从骂战变成了"理解了，加油"。',
      },
      {
        text: '🤐 不予回应',
        effects: { hp: -1, eq: -1 },
        outcome: '热度三天后退去，但"撞款"的标签留在了搜索结果里。',
      },
      {
        text: '🖼 甩出原稿过程图',
        effects: { eq: 2, iq: 2, rank: 3, mentor: 2 },
        outcome: '50 张草图一字排开。网友瞬间"破案"："看我们错怪她了。" 你的微博粉丝涨了 5 万。',
      },
    ],
  },
  {
    id: 'design_pixel',
    professionId: 'design',
    tag: TAG.trap,
    image: '/images/event-overtime.png',
    title: 'leader 把你拉到屏幕前："这里偏了 1 个像素。"',
    choices: [
      {
        text: '🔍 立刻对齐到完美',
        effects: { iq: 1, hp: -1, mentor: 2, rank: 1 },
        outcome: 'leader 满意地点头："这才是设计师该有的眼睛。" 但你回工位后揉了 5 分钟眼睛。',
      },
      {
        text: '🤷 问"用户能看出来吗？"',
        effects: { eq: -2, mentor: -2 },
        outcome: 'leader 缓缓转身："我能看出来。" 整个工区瞬间安静。',
      },
      {
        text: '😶 默默改完不说话',
        effects: { mentor: 1, hp: -1 },
        outcome: '改完递交，leader 没说什么。但你知道，这一关你过了。',
      },
    ],
  },

  // ============ 研发鹅 专属 ============
  {
    id: 'dev_p0',
    professionId: 'dev',
    tag: TAG.trap,
    image: '/images/event-overtime.png',
    title: '凌晨三点，线上出现 P0 故障，群里 @ 全员。',
    choices: [
      {
        text: '⚡ 紧急回滚',
        effects: { hp: -2, iq: 2, money: 1, rank: 2, mentor: 2 },
        outcome: '5 分钟内服务恢复。第二天复盘会上 leader 说："这就是教科书级的应急响应。"',
      },
      {
        text: '🔬 改完再测',
        effects: { hp: -3, iq: 3, rank: 3, mentor: 1 },
        outcome: '你花了 4 小时找到根因并修复。线上稳定后 SRE 群里发了一句："漂亮。"',
      },
      {
        text: '🙈 装作没看见群消息',
        effects: { hp: 2, eq: -3, mentor: -3, rank: -3 },
        outcome: '早上你打开钉钉，看到导师的连环 @。"昨晚去哪了？" 你不知道怎么回答。',
      },
    ],
  },
  {
    id: 'dev_oss',
    professionId: 'dev',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    minWeek: 4,
    title: '你周末写的开源项目突然在 GitHub 拿了 3k star。',
    choices: [
      {
        text: '🛠 认真维护',
        effects: { iq: 3, hp: -2, eq: 2, rank: 2 },
        outcome: '一年后这个项目 star 破 2 万。你的 GitHub 主页成了简历的另一面。',
      },
      {
        text: '😴 挂着不管',
        effects: { eq: -1 },
        outcome: 'Issues 区从 3 条涨到 300 条没人回。半年后另一个 fork 项目超越了它。',
      },
      {
        text: '💼 尝试商业化',
        effects: { money: 4, hp: -2, iq: 1, rank: 2 },
        outcome: '你做了个企业版，第一个客户付了 10 万年费。这是你副业的第一桶金。',
      },
    ],
  },
  {
    id: 'dev_review',
    professionId: 'dev',
    tag: TAG.work,
    image: '/images/event-confused.png',
    title: 'Code Review，资深同事在你的 PR 下连留 23 条评论。',
    choices: [
      {
        text: '📝 一条一条改完',
        effects: { iq: 3, hp: -2, mentor: 2, rank: 2 },
        outcome: '改到第 23 条时你发现自己代码水平肉眼可见地涨了。资深同事最后回复："这次写得不错。"',
      },
      {
        text: '🤺 逐条反驳',
        effects: { iq: 2, eq: -2, mentor: -1 },
        outcome: '吵了三个回合后你被全部 reject。但你心里其实承认对方说得对。',
      },
      {
        text: '🙏 求他来对线讲讲',
        effects: { iq: 2, eq: 2, mentor: 2, rank: 1 },
        outcome: '资深同事拉了你 1 小时，从设计模式讲到代码风格。这一小时比你前 3 个月学的都多。',
      },
    ],
  },

  // ============ 运营鹅 专属 ============
  {
    id: 'op_event',
    professionId: 'op',
    tag: TAG.trap,
    image: '/images/event-overtime.png',
    minWeek: 3,
    title: '你策划的拉新活动，被薅羊毛大军一夜薅走 200 万预算。',
    choices: [
      {
        text: '🚨 紧急下线',
        effects: { eq: 1, money: -2, hp: -2, mentor: 1 },
        outcome: '凌晨四点你截断了入口，止损 50 万。leader 第二天说："反应快。" 但语气里还是有一丝叹息。',
      },
      {
        text: '🔥 硬着头皮继续',
        effects: { money: -3, iq: 1, rank: 1 },
        outcome: '活动跑完，预算超支 40%，但 DAU 真的提升了 18%。leader 沉默了很久："数据还行。"',
      },
      {
        text: '🪞 甩锅给风控',
        effects: { eq: -3, mentor: -2 },
        outcome: '风控组在群里贴出了你三天前提交的"风控豁免申请"截图。所有人都不说话。',
      },
    ],
  },
  {
    id: 'op_kpi',
    professionId: 'op',
    tag: TAG.chance,
    image: '/images/event-reward.png',
    minWeek: 5,
    title: '月底 KPI 还差 30%，老板让你"想想办法"。',
    choices: [
      {
        text: '💧 刷量',
        effects: { money: 1, eq: -2, iq: -1, mentor: -2 },
        outcome: 'KPI 完成了。但月底审计时数据被识破，你的名字进了"重点关注名单"。',
      },
      {
        text: '🔥 通宵做活动',
        effects: { hp: -3, money: 3, iq: 1, rank: 3, mentor: 2 },
        outcome: '你三天三夜上线了一波 H5，KPI 不仅完成还超额 5%。leader 给你发了一个红包。',
      },
      {
        text: '🐧 坦白汇报',
        effects: { eq: 2, money: -1, mentor: 2 },
        outcome: '老板听完叹了口气："至少你诚实。下次提前预警。" 你知道这次没事，下次就难说了。',
      },
    ],
  },

  // ============ 职能鹅 专属 ============
  {
    id: 'staff_hire',
    professionId: 'staff',
    tag: TAG.work,
    image: '/images/event-overtime.png',
    title: '业务部门要紧急扩编 20 人，HRBP 让你三天搞定。',
    choices: [
      {
        text: '🌙 熬夜筛简历',
        effects: { hp: -3, iq: 2, money: 1, rank: 3, mentor: 2 },
        outcome: '你筛了 800 份简历，三天上岗 18 人。HRBP 在 OKR 复盘会上专门点了你的名。',
      },
      {
        text: '🤝 请猎头帮忙',
        effects: { money: -2, eq: 1, rank: 1 },
        outcome: '猎头 24 小时给你送了 30 个简历。3 天上岗 15 人。但部门预算账单让财务皱了皱眉。',
      },
      {
        text: '⚡ 直接发 offer',
        effects: { eq: -2, hp: 1, mentor: -2 },
        outcome: '你直接给前同事们群发。结果有 2 个面都没面就来报到了，leader 大发雷霆。',
      },
    ],
  },
  {
    id: 'staff_audit',
    professionId: 'staff',
    tag: TAG.boss,
    image: '/images/event-confused.png',
    minWeek: 4,
    title: '审计来查账，发现一笔报销记录有点问题。',
    choices: [
      {
        text: '📋 据实说明',
        effects: { eq: 1, iq: 1, mentor: 2, rank: 2 },
        outcome: '你诚恳列出问题原因 + 改进方案。审计组长记下你的名字："这个实习生靠谱。"',
      },
      {
        text: '🤝 帮同事顶下',
        effects: { eq: 2, money: -2, hp: -1 },
        outcome: '你说"是我录入有误"。同事感动地请你吃了三顿饭。但审计私下问你："真的是你？"',
      },
      {
        text: '🙃 装作不知情',
        effects: { eq: -2, mentor: -2 },
        outcome: '"这个我不太清楚。" 你说。审计眯起眼睛："那这个签字是谁的？"',
      },
    ],
  },
];
