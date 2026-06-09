import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import { playSfx } from '../game/sfx';

export default function TalentScreen() {
  const talentOptions = useGame((s) => s.talentOptions);
  const pickTalent = useGame((s) => s.pickTalent);

  return (
    <div className="space-y-3 animate-float-in">
      <Card>
        <div className="text-sm font-semibold text-slate-700">
          抽到了 3 个天赋，选 1 个伴随你这一世
        </div>
        <p className="mt-1 text-xs text-slate-500">
          天赋会暗中调整你每次属性变化的实际生效数值
        </p>
      </Card>

      <div className="space-y-2">
        {talentOptions.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              playSfx('click');
              pickTalent(t.id);
            }}
            className="block w-full rounded-2xl bg-white/85 p-4 text-left shadow-soft ring-1 ring-white backdrop-blur-sm transition hover:-translate-y-[1px] hover:ring-tx-blue/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                {t.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800">
                  {t.name}
                </div>
                <div className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {t.desc}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-[11px] text-slate-400">
        随机抽取，每次重开会刷新
      </div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => useGame.setState({ stage: 'choosing' })}
      >
        ← 返回选职业
      </Button>
    </div>
  );
}
