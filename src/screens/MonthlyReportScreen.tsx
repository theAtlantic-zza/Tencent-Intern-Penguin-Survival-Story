import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import type { Attrs, AttrKey } from '../game/types';
import { playSfx } from '../game/sfx';

const ATTR_META: Record<AttrKey, { label: string; emoji: string }> = {
  hp: { label: '体力', emoji: '❤️' },
  iq: { label: '智力', emoji: '🧠' },
  eq: { label: '情商', emoji: '💬' },
  money: { label: '存款', emoji: '💰' },
  mentor: { label: '导师好感', emoji: '🧑‍🏫' },
  rank: { label: '转正进度', emoji: '🎯' },
};

export default function MonthlyReportScreen() {
  const week = useGame((s) => s.week);
  const attrs = useGame((s) => s.attrs);
  const lastReportAttrs = useGame((s) => s.lastReportAttrs);
  const monthEventTitles = useGame((s) => s.monthEventTitles);
  const mentor = useGame((s) => s.mentor);
  const profession = useGame((s) => s.profession);
  const closeMonthlyReport = useGame((s) => s.closeMonthlyReport);

  const month = Math.floor((week - 1) / 4); // 第 5 周触发 = 1 月底
  const delta: Partial<Attrs> = {};
  (Object.keys(attrs) as AttrKey[]).forEach((k) => {
    const d = attrs[k] - lastReportAttrs[k];
    if (d !== 0) delta[k] = d;
  });

  const sortedDelta = (Object.keys(delta) as AttrKey[])
    .map((k) => ({ k, v: delta[k]! }))
    .sort((a, b) => Math.abs(b.v) - Math.abs(a.v));

  const eventCount = monthEventTitles.length;
  const recentTitles = monthEventTitles.slice(-4);

  const mentorComment = mentor ? mentor.comment(delta) : null;

  return (
    <div className="space-y-3 animate-float-in">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-tx-blue/70">
              MONTHLY REPORT
            </div>
            <div className="text-base font-semibold text-slate-800">
              📅 第 {month} 个月小结
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              {profession ? `${profession.emoji} ${profession.name}` : ''} · 走过{' '}
              {week - 1} 周 · 经历 {eventCount} 件事
            </div>
          </div>
        </div>
      </Card>

      {/* 属性变化 */}
      <Card>
        <div className="mb-2 text-xs font-semibold text-slate-700">
          📊 这个月你变化了什么
        </div>
        {sortedDelta.length === 0 ? (
          <div className="text-[12px] text-slate-500">
            波澜不惊的一个月，数值没什么变化。
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {sortedDelta.map(({ k, v }) => {
              const meta = ATTR_META[k];
              const positive = v > 0;
              return (
                <div
                  key={k}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs ring-1 ${
                    positive
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : 'bg-rose-50 text-rose-700 ring-rose-200'
                  }`}
                >
                  <span>
                    {meta.emoji} {meta.label}
                  </span>
                  <span className="font-semibold">
                    {positive ? `+${v}` : v}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* 经历过的事件 */}
      {recentTitles.length > 0 && (
        <Card>
          <div className="mb-2 text-xs font-semibold text-slate-700">
            🎬 这个月经历过
          </div>
          <ul className="space-y-1 text-[12px] leading-relaxed text-slate-600">
            {recentTitles.map((t, i) => (
              <li key={i} className="line-clamp-1">
                · {t}
              </li>
            ))}
            {monthEventTitles.length > recentTitles.length && (
              <li className="text-[10px] text-slate-400">
                ……以及更早的 {monthEventTitles.length - recentTitles.length} 件事
              </li>
            )}
          </ul>
        </Card>
      )}

      {/* 导师评语 */}
      {mentorComment && mentor && (
        <Card>
          <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-white p-3 ring-1 ring-violet-200">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-violet-700">
              <span>{mentor.emoji}</span>
              <span>{mentor.name.toUpperCase()}'S COMMENT</span>
            </div>
            <div className="mt-1.5 text-[14px] font-medium leading-relaxed text-slate-800">
              {mentorComment}
            </div>
          </div>
        </Card>
      )}

      {/* 操作 */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            playSfx('click');
            closeMonthlyReport();
          }}
        >
          继续下一个月 →
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            closeMonthlyReport();
          }}
        >
          跳过本月小结
        </Button>
      </div>
    </div>
  );
}
