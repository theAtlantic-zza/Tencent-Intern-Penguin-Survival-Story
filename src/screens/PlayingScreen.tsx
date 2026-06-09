import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import AttrPanel, { WeekIndicator } from '../components/AttrPanel';
import type { Attrs, AttrKey } from '../game/types';

interface Props {
  onOpenCollection: () => void;
}

export default function PlayingScreen({ onOpenCollection }: Props) {
  const name = useGame((s) => s.name);
  const attrs = useGame((s) => s.attrs);
  const week = useGame((s) => s.week);
  const currentEvent = useGame((s) => s.currentEvent);
  const lastOutcome = useGame((s) => s.lastOutcome);
  const lastEffects = useGame((s) => s.lastEffects);
  const pickChoice = useGame((s) => s.pickChoice);
  const nextWeek = useGame((s) => s.nextWeek);
  const goHome = useGame((s) => s.goHome);

  return (
    <div className="space-y-3 animate-float-in">
      {/* 角色头条 */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#9ed8ee]">
            <img
              src="/images/hero.png"
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-slate-800">
                {name}
              </span>
              <span className="shrink-0 rounded-full bg-tx-blue/10 px-2 py-0.5 text-[10px] text-tx-blue">
                实习鹅
              </span>
            </div>
            <div className="mt-1.5">
              <WeekIndicator week={week} />
            </div>
          </div>
          <button
            onClick={onOpenCollection}
            className="shrink-0 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
          >
            图鉴
          </button>
        </div>

        <div className="mt-3">
          <AttrPanel attrs={attrs} diff={lastEffects} />
        </div>
      </Card>

      {/* 事件 */}
      {currentEvent ? (
        <Card key={currentEvent.id} className="animate-pop !p-0 overflow-hidden">
          {/* 大插画 */}
          <div className="aspect-square w-full overflow-hidden bg-[#9ed8ee]">
            <img
              src={currentEvent.image}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>

          <div className="p-5">
            {/* 标签徽章 */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${currentEvent.tag.color}`}
            >
              <span>{currentEvent.tag.emoji}</span>
              <span>{currentEvent.tag.label}</span>
            </span>

            {/* 标题 + 副标 */}
            <div className="mt-3 text-[15px] font-semibold leading-relaxed text-slate-800">
              {currentEvent.title}
            </div>
            {currentEvent.subtitle && (
              <div className="mt-1 text-xs leading-relaxed text-slate-500">
                {currentEvent.subtitle}
              </div>
            )}

            {/* 选项 */}
            <div className="mt-4 flex flex-col gap-2">
              {currentEvent.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => pickChoice(i)}
                  className="rounded-xl bg-white px-3 py-3 text-left text-sm text-slate-700 ring-1 ring-slate-200 transition hover:-translate-y-[1px] hover:ring-tx-blue/40 active:scale-[0.99]"
                >
                  {c.emoji && <span className="mr-1.5">{c.emoji}</span>}
                  {c.text}
                </button>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="animate-pop">
          <div className="text-center text-[11px] tracking-widest text-slate-400">
            本回合影响
          </div>
          <EffectsSummary effects={lastEffects} />

          {lastOutcome && (
            <div className="mt-3 rounded-lg bg-tx-ice/60 px-3 py-2 text-xs leading-relaxed text-tx-deep">
              {lastOutcome}
            </div>
          )}
          <div className="mt-4 text-center text-xs text-slate-500">
            一周过去了……
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Button onClick={nextWeek}>进入下一周 →</Button>
            <Button variant="ghost" onClick={goHome}>
              结束这一世（回首页）
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

const EFFECT_META: Record<AttrKey, { label: string; emoji: string }> = {
  hp: { label: '体力', emoji: '❤️' },
  iq: { label: '智力', emoji: '🧠' },
  eq: { label: '情商', emoji: '💬' },
  money: { label: '零花', emoji: '💰' },
  mentor: { label: '导师好感', emoji: '🧑‍🏫' },
  rank: { label: '转正进度', emoji: '🎯' },
};

/** 把本回合属性变化做成大号醒目卡片 */
function EffectsSummary({ effects }: { effects: Partial<Attrs> | null }) {
  if (!effects) {
    return (
      <div className="mt-2 py-3 text-center text-xs text-slate-400">
        没有任何变化
      </div>
    );
  }
  const entries = (Object.keys(effects) as AttrKey[])
    .filter((k) => (effects[k] ?? 0) !== 0)
    .map((k) => ({ k, v: effects[k] as number }));

  if (entries.length === 0) {
    return (
      <div className="mt-2 py-3 text-center text-xs text-slate-400">
        本回合属性无变化
      </div>
    );
  }

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {entries.map(({ k, v }) => {
        const meta = EFFECT_META[k];
        const positive = v > 0;
        return (
          <div
            key={k}
            className={`animate-pop flex items-center gap-2 rounded-xl px-3 py-2.5 ring-1 ${
              positive
                ? 'bg-emerald-50 ring-emerald-200'
                : 'bg-rose-50 ring-rose-200'
            }`}
          >
            <span className="text-2xl leading-none">{meta.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] text-slate-500">
                {meta.label}
              </div>
              <div
                className={`text-lg font-bold leading-tight ${
                  positive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {positive ? `+${v}` : v}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
