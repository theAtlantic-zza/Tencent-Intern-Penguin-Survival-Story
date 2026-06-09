/** 沙雕实习生名字生成器 */
const PREFIX = ['卷', '摸', '划', '秃', '佛', '咕', '冲', '躺', '肥', '丧', '猛', '糊', '菜', '咸', '蔫'];
const MIDDLE = ['小', '大', '老', '阿', '二', '一'];
const SUFFIX = ['鹅', '企鹅', '冬瓜', '布丁', '咕咕', '土豆', '螺丝', '泡芙', '奶茶', '柠檬', '呱呱', '糯米'];

export function randomFunnyName(): string {
  const a = pick(PREFIX);
  const b = Math.random() > 0.5 ? pick(MIDDLE) : '';
  const c = pick(SUFFIX);
  return `${a}${b}${c}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
