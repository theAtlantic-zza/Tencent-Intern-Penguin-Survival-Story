import type { Attrs, AttrKey } from '../game/types';

const INTERN_WEEKS = 12;

const META: Record<AttrKey, { label: string; emoji: string; color: string; cap: number }> = {
  hp: { label: '体力', emoji: '❤️', color: 'bg-rose-400', cap: 12 },
  iq: { label: '智力', emoji: '🧠', color: 'bg-violet-400', cap: 15 },
  eq: { label: '情商', emoji: '💬', color: 'bg-amber-400', cap: 12 },
  money: { label: '存款', emoji: '💰', color: 'bg-emerald-400', cap: 20 },
  mentor: { label: '导师好感', emoji: '🧑‍🏫', color: 'bg-sky-400', cap: 10 },
  rank: { label: '转正进度', emoji: '🎯', color: 'bg-tx-blue', cap: 20 },
};

interface Props {
  attrs: Attrs;
  diff?: Partial<Attrs> | null;
}

export default function AttrPanel({ attrs, diff }: Props) {
  // 普通 4 项 + 单独突出"导师好感" + 整体进度条"转正进度"
  const mainKeys: AttrKey[] = ['hp', 'iq', 'eq', 'money'];
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {mainKeys.map((k) => (
          <Bar key={k} k={k} val={attrs[k]} d={diff?.[k] ?? 0} />
        ))}
      </div>
      <div className="mt-2">
        <Bar k="mentor" val={attrs.mentor} d={diff?.mentor ?? 0} wide />
      </div>
      <div className="mt-2 rounded-xl bg-tx-blue/5 px-3 py-2 ring-1 ring-tx-blue/15">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-tx-deep">
            {META.rank.emoji} 转正进度
          </span>
          <span className="font-semibold text-tx-deep">
            {Math.max(0, attrs.rank)}
            {(diff?.rank ?? 0) !== 0 && (
              <span
                className={`ml-1 text-[10px] ${
                  (diff?.rank ?? 0) > 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {(diff?.rank ?? 0) > 0 ? `+${diff?.rank}` : diff?.rank}
              </span>
            )}{' '}
            / {META.rank.cap}
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white">
          <div
            className="h-full bg-gradient-to-r from-tx-blue to-sky-400 transition-all"
            style={{
              width: `${Math.max(0, Math.min(100, (attrs.rank / META.rank.cap) * 100))}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

interface BarProps {
  k: AttrKey;
  val: number;
  d: number;
  wide?: boolean;
}

function Bar({ k, val, d, wide }: BarProps) {
  const meta = META[k];
  const pct = Math.max(0, Math.min(100, (val / meta.cap) * 100));
  return (
    <div
      className={`rounded-xl bg-white/80 px-2.5 py-2 ring-1 ring-slate-100 ${
        wide ? 'col-span-2' : ''
      }`}
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-600">
          {meta.emoji} {meta.label}
        </span>
        <span className="font-semibold text-slate-800">
          {val}
          {d !== 0 && (
            <span
              className={`ml-1 text-[10px] ${
                d > 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {d > 0 ? `+${d}` : d}
            </span>
          )}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full ${meta.color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function WeekIndicator({
  week,
  totalWeeks = INTERN_WEEKS,
}: {
  week: number;
  totalWeeks?: number;
}) {
  const safeWeek = Math.min(week, totalWeeks);
  const pct = (safeWeek / totalWeeks) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-500">实习倒计时</span>
        <span className="font-semibold text-slate-700">
          第 {safeWeek} / {totalWeeks} 周
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-gradient-to-r from-amber-300 to-rose-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
