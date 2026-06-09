import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import { DIFFICULTY_CONFIG } from '../game/tracks';
import type { Difficulty } from '../game/types';
import { playSfx } from '../game/sfx';

const DIFFS: Difficulty[] = ['standard', 'extended'];

export default function DifficultyScreen() {
  const pickDifficulty = useGame((s) => s.pickDifficulty);
  const startNaming = useGame((s) => s.startNaming);

  return (
    <div className="space-y-3 animate-float-in">
      <Card>
        <div className="text-sm font-semibold text-slate-700">选择实习难度</div>
        <p className="mt-1 text-xs text-slate-500">
          不同难度决定实习总周数与是否解锁后期「晋升副本」事件
        </p>
      </Card>

      <div className="space-y-2">
        {DIFFS.map((d) => {
          const cfg = DIFFICULTY_CONFIG[d];
          return (
            <button
              key={d}
              onClick={() => {
                playSfx('click');
                pickDifficulty(d);
              }}
              className="block w-full overflow-hidden rounded-2xl bg-white/85 p-4 text-left shadow-soft ring-1 ring-white backdrop-blur-sm transition hover:-translate-y-[1px] hover:ring-tx-blue/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tx-ice text-2xl">
                  {cfg.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-800">
                      {cfg.name}
                    </span>
                    <span className="rounded-full bg-tx-blue/10 px-2 py-0.5 text-[10px] text-tx-blue">
                      {cfg.weeks} 周
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    {cfg.subtitle}
                  </div>
                </div>
              </div>
              <div className="mt-2.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] leading-relaxed text-slate-600">
                {cfg.desc}
              </div>
            </button>
          );
        })}
      </div>

      <Button variant="ghost" className="w-full" onClick={startNaming}>
        ← 返回改名
      </Button>
    </div>
  );
}
