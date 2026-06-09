import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import AttrPanel, { WeekIndicator } from '../components/AttrPanel';
import { playSfx } from '../game/sfx';
import { useTypewriter } from '../components/useTypewriter';
import type { Attrs, AttrKey, GameEvent } from '../game/types';

interface Props {
  onOpenCollection: () => void;
}

export default function PlayingScreen({ onOpenCollection }: Props) {
  const name = useGame((s) => s.name);
  const profession = useGame((s) => s.profession);
  const talent = useGame((s) => s.talent);
  const attrs = useGame((s) => s.attrs);
  const week = useGame((s) => s.week);
  const eventOptions = useGame((s) => s.eventOptions);
  const currentEvent = useGame((s) => s.currentEvent);
  const lastOutcome = useGame((s) => s.lastOutcome);
  const lastEffects = useGame((s) => s.lastEffects);
  const difficulty = useGame((s) => s.difficulty);
  const pickEvent = useGame((s) => s.pickEvent);
  const pickChoice = useGame((s) => s.pickChoice);
  const nextWeek = useGame((s) => s.nextWeek);
  const goHome = useGame((s) => s.goHome);
  const muted = useGame((s) => s.muted);
  const toggleMute = useGame((s) => s.toggleMute);

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
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-slate-800">
                {name}
              </span>
              <span className="shrink-0 rounded-full bg-tx-blue/10 px-2 py-0.5 text-[10px] text-tx-blue">
                {profession ? `${profession.emoji} 实习${profession.name.slice(0, 1)}` : '实习鹅'}
              </span>
              {profession && (
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">
                  💎 {profession.signatureTalent.name}
                </span>
              )}
              {talent && (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">
                  {talent.emoji} {talent.name}
                </span>
              )}
            </div>
            <div className="mt-1.5">
              <WeekIndicator
                week={week}
                totalWeeks={difficulty === 'extended' ? 24 : 12}
              />
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-1">
            <button
              onClick={toggleMute}
              className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
              title={muted ? '已静音' : '点击静音'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={onOpenCollection}
              className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
            >
              图鉴
            </button>
          </div>
        </div>

        <div className="mt-3">
          <AttrPanel attrs={attrs} diff={lastEffects} />
        </div>
      </Card>

      {/* 三选一事件挑选 */}
      {eventOptions.length > 0 && !currentEvent && (
        <>
          <Card>
            <div className="text-center text-sm font-semibold text-slate-700">
              ✨ 这周有 3 件事在等你，挑一件去面对
            </div>
            <p className="mt-1 text-center text-[11px] text-slate-500">
              另外两件不会再回来，谨慎选择
            </p>
          </Card>

          {eventOptions.map((e, i) => (
            <button
              key={e.id}
              onClick={() => {
                playSfx('click');
                pickEvent(i);
              }}
              className="block w-full overflow-hidden rounded-2xl bg-white/85 text-left shadow-soft ring-1 ring-white backdrop-blur-sm transition hover:-translate-y-[1px] hover:ring-tx-blue/40"
            >
              <div className="flex gap-3 p-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#9ed8ee]">
                  <img
                    src={e.image}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${e.tag.color}`}
                  >
                    <span>{e.tag.emoji}</span>
                    <span>{e.tag.label}</span>
                  </span>
                  <div className="mt-1.5 line-clamp-3 text-[13px] font-medium leading-snug text-slate-800">
                    {e.title}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </>
      )}

      {/* 选中后的事件详情 */}
      {currentEvent && (
        <EventDetail
          key={currentEvent.id}
          event={currentEvent}
          onPick={(i) => {
            playSfx('click');
            pickChoice(i);
          }}
        />
      )}

      {/* 过渡卡：刚做完选择，未刷新下一周 */}
      {!currentEvent && eventOptions.length === 0 && (
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
            <Button
              onClick={() => {
                playSfx('click');
                nextWeek();
              }}
            >
              进入下一周 →
            </Button>
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
  money: { label: '存款', emoji: '💰' },
  mentor: { label: '导师好感', emoji: '🧑‍🏫' },
  rank: { label: '转正进度', emoji: '🎯' },
};

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

function EventDetail({
  event,
  onPick,
}: {
  event: GameEvent;
  onPick: (idx: number) => void;
}) {
  // 标题 + 副标 拼一段做打字机
  const fullText = event.subtitle
    ? `${event.title}\n${event.subtitle}`
    : event.title;
  const { shown, done, skip } = useTypewriter(fullText, 35);
  const lines = shown.split('\n');
  const titleShown = lines[0] ?? '';
  const subtitleShown = lines[1] ?? '';

  return (
    <Card className="animate-pop !p-0 overflow-hidden">
      <div className="aspect-square w-full overflow-hidden bg-[#9ed8ee]">
        <img
          src={event.image}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div className="p-5" onClick={skip}>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${event.tag.color}`}
        >
          <span>{event.tag.emoji}</span>
          <span>{event.tag.label}</span>
        </span>

        <div className="mt-3 min-h-[40px] text-[15px] font-semibold leading-relaxed text-slate-800">
          {titleShown}
          {!done && titleShown.length === event.title.length === false && (
            <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-slate-400 align-middle" />
          )}
        </div>
        {event.subtitle && (
          <div className="mt-1 min-h-[18px] text-xs leading-relaxed text-slate-500">
            {subtitleShown}
          </div>
        )}

        {!done && (
          <div className="mt-2 text-center text-[10px] text-slate-400">
            点击跳过 ↓
          </div>
        )}

        <div
          className={`mt-4 flex flex-col gap-2 transition-opacity ${
            done ? 'opacity-100' : 'pointer-events-none opacity-40'
          }`}
        >
          {event.choices.map((c, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (!done) return;
                onPick(i);
              }}
              className="rounded-xl bg-white px-3 py-3 text-left text-sm text-slate-700 ring-1 ring-slate-200 transition hover:-translate-y-[1px] hover:ring-tx-blue/40 active:scale-[0.99]"
            >
              {c.emoji && <span className="mr-1.5">{c.emoji}</span>}
              {c.text}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
