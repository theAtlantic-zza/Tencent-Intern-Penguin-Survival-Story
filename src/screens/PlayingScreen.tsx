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
        <OutcomeCard
          outcome={lastOutcome}
          effects={lastEffects}
          onNext={() => {
            playSfx('click');
            nextWeek();
          }}
          onHome={goHome}
        />
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

/**
 * 过渡卡 V2：outcome 旁白为主角（带打字机），属性变化用横向 chip 紧凑展示
 */
function OutcomeCard({
  outcome,
  effects,
  onNext,
  onHome,
}: {
  outcome: string | null;
  effects: Partial<Attrs> | null;
  onNext: () => void;
  onHome: () => void;
}) {
  // 没有 outcome 时直接用极简文案兜底，保证不空着
  const fallback = '一周悄然过去，你又长大了一点。';
  const text = outcome && outcome.trim() ? outcome : fallback;
  const { shown, done, skip } = useTypewriter(text, 50);

  const entries = effects
    ? (Object.keys(effects) as AttrKey[])
        .filter((k) => (effects[k] ?? 0) !== 0)
        .map((k) => ({ k, v: effects[k] as number }))
    : [];

  return (
    <Card className="animate-pop">
      {/* 旁白主区：占据视觉中心，可点击跳过打字机 */}
      <div
        className="rounded-2xl bg-gradient-to-br from-tx-ice/80 to-white p-4 ring-1 ring-tx-blue/15"
        onClick={skip}
      >
        <div className="text-[10px] tracking-[0.3em] text-tx-blue/70">
          STORY
        </div>
        <div className="mt-1.5 min-h-[64px] text-[15px] font-medium leading-relaxed text-slate-800">
          {shown}
          {!done && (
            <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-slate-400 align-middle" />
          )}
        </div>
        {!done && (
          <div className="mt-1 text-right text-[10px] text-slate-400">
            点击跳过 ↓
          </div>
        )}
      </div>

      {/* 属性变化 chip：横向紧凑排列 */}
      {entries.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entries.map(({ k, v }) => {
            const meta = EFFECT_META[k];
            const positive = v > 0;
            return (
              <span
                key={k}
                className={`inline-flex animate-pop items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                  positive
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                    : 'bg-rose-50 text-rose-700 ring-rose-200'
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
                <span>{positive ? `+${v}` : v}</span>
              </span>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <Button onClick={onNext} disabled={!done}>
          {done ? '进入下一周 →' : '请先看完这段……'}
        </Button>
        <Button variant="ghost" onClick={onHome}>
          结束这一世（回首页）
        </Button>
      </div>
    </Card>
  );
}

function EventDetail({
  event,
  onPick,
}: {
  event: GameEvent;
  onPick: (idx: number) => void;
}) {
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
          {!done && titleShown.length < event.title.length && (
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
