import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';
import { ENDINGS, ACHIEVEMENTS } from '../game/endings';

interface Props {
  onOpenCollection: () => void;
}

export default function HomeScreen({ onOpenCollection }: Props) {
  const startNaming = useGame((s) => s.startNaming);
  const unlockedEndings = useGame((s) => s.unlockedEndings);
  const unlockedAchievements = useGame((s) => s.unlockedAchievements);
  const reincarnations = useGame((s) => s.reincarnations);
  const records = useGame((s) => s.records);
  const clearRecords = useGame((s) => s.clearRecords);

  return (
    <div className="space-y-4 animate-float-in">
      {/* Hero 卡片：大插图 + 标题 + 引言 + CTA */}
      <Card className="overflow-hidden !p-0">
        <div className="aspect-square w-full overflow-hidden bg-[#9ed8ee]">
          <img
            src="/images/hero.png"
            alt="实习企鹅"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <div className="p-5">
          <Logo />

          <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-center text-[13px] text-slate-600">
            "今天也要元气满满地被需求蹂躏哦 ✨"
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={startNaming} className="!py-3 !text-[15px]">
              开启鹅生 →
            </Button>
            <Button variant="soft" onClick={onOpenCollection}>
              结局 &amp; 成就图鉴
            </Button>
          </div>

          <div className="mt-4 text-center text-[11px] text-slate-500">
            已解锁结局 {unlockedEndings.length}/{ENDINGS.length} · 成就{' '}
            {unlockedAchievements.length}/{ACHIEVEMENTS.length} · 转生{' '}
            {reincarnations} 世
          </div>
        </div>
      </Card>

      {/* 历世记录 */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <span>📜</span>
            <span>实习记录（历世轮回）</span>
          </div>
          {records.length > 0 && (
            <button
              className="text-xs text-slate-400 hover:text-slate-600"
              onClick={() => {
                if (confirm('确定清空所有实习记录吗？')) clearRecords();
              }}
            >
              清空
            </button>
          )}
        </div>
        {records.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            还没有实习记录，快开始你的第一世吧！🐧
          </div>
        ) : (
          <ul className="space-y-2">
            {records.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"
              >
                <div className="flex-1 truncate font-medium text-slate-700">
                  {r.name}
                </div>
                <div className="ml-2 shrink-0 text-slate-500">
                  第 {r.weeks} 周 · {r.endingName}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
