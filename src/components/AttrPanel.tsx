import { useEffect, useState } from 'react';
import type { Attrs, AttrKey } from '../game/types';
import { useAnimatedNumber } from './useAnimatedNumber';

const INTERN_WEEKS = 12;

const META: Record<AttrKey, { label: string; emoji: string; color: string; cap: number; ringActive: string }> = {
  hp: {
    label: '体力',
    emoji: '❤️',
    color: 'bg-rose-400',
    cap: 12,
    ringActive: 'ring-rose-300',
  },
  iq: {
    label: '智力',
    emoji: '🧠',
    color: 'bg-violet-400',
    cap: 15,
    ringActive: 'ring-violet-300',
  },
  eq: {
    label: '情商',
    emoji: '💬',
    color: 'bg-amber-400',
    cap: 12,
    ringActive: 'ring-amber-300',
  },
  money: {
    label: '存款',
    emoji: '💰',
    color: 'bg-emerald-400',
    cap: 20,
    ringActive: 'ring-emerald-300',
  },
  mentor: {
    label: '导师好感',
    emoji: '🧑‍🏫',
    color: 'bg-sky-400',
    cap: 10,
    ringActive: 'ring-sky-300',
  },
  rank: {
    label: '转正进度',
    emoji: '🎯',
    color: 'bg-tx-blue',
    cap: 20,
    ringActive: 'ring-tx-blue/40',
  },
};

interface Props {
  attrs: Attrs;
  diff?: Partial<Attrs> | null;
}

export default function AttrPanel({ attrs, diff }: Props) {
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
      <RankCard val={attrs.rank} d={diff?.rank ?? 0} />
    </div>
  );
}

function RankCard({ val, d }: { val: number; d: number }) {
  const flash = useFlashOnChange(d);
  return (
    <div
      className={`mt-2 rounded-xl bg-tx-blue/5 px-3 py-2 ring-1 transition-all ${
        flash
          ? 'ring-2 ring-tx-blue/60 shadow-[0_0_18px_rgba(74,144,226,0.35)] scale-[1.015]'
          : 'ring-tx-blue/15'
      }`}
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-tx-deep">
          {META.rank.emoji} 转正进度
        </span>
        <span className="font-semibold text-tx-deep">
          <AnimatedNum value={Math.max(0, val)} />
          <FloatingDelta d={d} />
          {' '}
          / {META.rank.cap}
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white">
        <div
          className={`h-full bg-gradient-to-r from-tx-blue to-sky-400 transition-all duration-700 ${
            flash ? 'shadow-[inset_0_0_8px_rgba(255,255,255,0.6)]' : ''
          }`}
          style={{
            width: `${Math.max(0, Math.min(100, (val / META.rank.cap) * 100))}%`,
          }}
        />
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
  const flash = useFlashOnChange(d);

  return (
    <div
      className={`rounded-xl bg-white/80 px-2.5 py-2 ring-1 transition-all duration-300 ${
        wide ? 'col-span-2' : ''
      } ${
        flash
          ? `ring-2 ${meta.ringActive} scale-[1.02] shadow-[0_4px_14px_rgba(0,0,0,0.08)]`
          : 'ring-slate-100'
      }`}
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-600">
          {meta.emoji} {meta.label}
        </span>
        <span className="font-semibold text-slate-800">
          <AnimatedNum value={val} />
          <FloatingDelta d={d} />
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full ${meta.color} transition-all duration-700 ease-out ${
            flash ? 'brightness-125' : ''
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * 数值变化 chip：从数字旁边浮起 + 渐隐
 */
function FloatingDelta({ d }: { d: number }) {
  const [show, setShow] = useState(false);
  const [v, setV] = useState(d);
  useEffect(() => {
    if (d === 0) return;
    setV(d);
    setShow(true);
    const t = setTimeout(() => setShow(false), 1300);
    return () => clearTimeout(t);
  }, [d]);
  if (!show || v === 0) return null;
  return (
    <span
      className={`ml-1 inline-block text-[10px] font-bold animate-delta-pop ${
        v > 0 ? 'text-emerald-500' : 'text-rose-500'
      }`}
    >
      {v > 0 ? `+${v}` : v}
    </span>
  );
}

/**
 * 变化时返回 true，350ms 后回 false，用于驱动短暂高亮
 */
function useFlashOnChange(d: number): boolean {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (d === 0) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 700);
    return () => clearTimeout(t);
  }, [d]);
  return flash;
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
          className="h-full bg-gradient-to-r from-amber-300 to-rose-400 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function AnimatedNum({ value }: { value: number }) {
  const v = useAnimatedNumber(value, 600);
  return <>{v}</>;
}
