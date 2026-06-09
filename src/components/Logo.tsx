interface Props {
  /** 大字版（首页） */
  size?: 'lg' | 'sm';
}

/**
 * 标题：鹅厂实习记 · "实习记"用蓝色重点
 * 上方一行 letter-spacing 加宽的英文小字
 */
export default function Logo({ size = 'lg' }: Props) {
  const isLg = size === 'lg';
  return (
    <div className="text-center">
      <div
        className={`tracking-[0.32em] text-tx-blue/80 ${
          isLg ? 'text-[11px]' : 'text-[10px]'
        }`}
      >
        TENCENT PENGUIN INTERN
      </div>
      <h1
        className={`mt-1.5 font-bold text-slate-800 ${
          isLg ? 'text-[34px] leading-tight' : 'text-base'
        }`}
      >
        鹅厂<span className="text-tx-blue">实习记</span>
      </h1>
      {isLg && (
        <p className="mt-1 text-xs text-slate-500">
          一只打工企鹅的实习求生路 🐧
        </p>
      )}
    </div>
  );
}
