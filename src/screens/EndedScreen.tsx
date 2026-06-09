import { useGame, getAchievementById } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';

interface Props {
  onOpenCollection: () => void;
}

export default function EndedScreen({ onOpenCollection }: Props) {
  const ending = useGame((s) => s.ending);
  const endingDesc = useGame((s) => s.endingDesc);
  const name = useGame((s) => s.name);
  const week = useGame((s) => s.week);
  const reincarnate = useGame((s) => s.reincarnate);
  const goHome = useGame((s) => s.goHome);
  const unlockedAchievements = useGame((s) => s.unlockedAchievements);

  if (!ending) return null;

  const recent = unlockedAchievements
    .slice(-3)
    .map((id) => getAchievementById(id))
    .filter(Boolean);

  return (
    <div className="space-y-3 animate-float-in">
      <Card className="!p-0 overflow-hidden">
        {ending.image && (
          <div className="aspect-square w-full overflow-hidden bg-[#9ed8ee]">
            <img
              src={ending.image}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        )}
        <div className="p-5 text-center">
          <div className="text-xs text-slate-400">本世结局</div>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-2xl">{ending.emoji}</span>
            <span className="text-lg font-bold text-slate-800">
              {ending.name}
            </span>
          </div>
          <div className="mt-2 text-xs leading-relaxed text-slate-600">
            {endingDesc ?? ending.desc}
          </div>

          <div className="mt-4 rounded-xl bg-tx-ice/60 px-3 py-2 text-[11px] text-tx-deep">
            {name} · 实习鹅 · 共撑过 {Math.min(week, 12)} 周
          </div>

          {recent.length > 0 && (
            <div className="mt-3">
              <div className="text-[11px] text-slate-500">已解锁成就</div>
              <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
                {recent.map((a) => (
                  <span
                    key={a!.id}
                    className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-700"
                  >
                    {a!.emoji} {a!.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 text-[11px] text-slate-400">
            截图分享你的鹅厂实习结局 #鹅厂实习记
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        <Button onClick={reincarnate} className="!py-3 !text-[15px]">
          转生再战
        </Button>
        <Button variant="soft" onClick={onOpenCollection}>
          查看图鉴
        </Button>
        <Button variant="ghost" onClick={goHome}>
          返回首页
        </Button>
      </div>
    </div>
  );
}
