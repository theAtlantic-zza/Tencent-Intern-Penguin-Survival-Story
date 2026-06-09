import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';
import { ENDINGS, ACHIEVEMENTS } from '../game/endings';
import { PROFESSIONS, getProfessionById } from '../game/professions';

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
  const triedProfessions = useGame((s) => s.triedProfessions);

  // 数据统计
  const totalRuns = records.length;
  const minWeek = totalRuns > 0 ? Math.min(...records.map((r) => r.weeks)) : 0;
  const maxWeek = totalRuns > 0 ? Math.max(...records.map((r) => r.weeks)) : 0;
  const graduateCount = records.filter((r) =>
    r.endingId.startsWith('graduate'),
  ).length;
  const winRate =
    totalRuns > 0 ? Math.round((graduateCount / totalRuns) * 100) : 0;

  // 最常入职职业（用 triedProfessions 第一个作为入门职业，简化处理）
  const favPro =
    triedProfessions.length > 0
      ? getProfessionById(triedProfessions[0])
      : null;

  return (
    <div className="space-y-4 animate-float-in">
      {/* Hero 卡片 */}
      <Card className="overflow-hidden !p-0">
        <div className="relative aspect-square w-full overflow-hidden bg-[#9ed8ee]">
          <img
            src="/images/hero.png"
            alt="实习企鹅"
            className="h-full w-full object-cover"
            draggable={false}
          />
          {reincarnations > 0 && (
            <div className="absolute right-3 top-3 rounded-full bg-amber-400/95 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg ring-2 ring-white/60">
              ⚜️ 已转生 {reincarnations} 世
            </div>
          )}
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

      {/* 我的鹅生数据 */}
      {totalRuns > 0 && (
        <Card>
          <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <span>📊</span>
            <span>我的鹅生数据</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="累计轮回" value={`${totalRuns} 世`} />
            <Stat label="转正率" value={`${winRate}%`} />
            <Stat label="最快猝死" value={`第 ${minWeek} 周`} />
            <Stat label="最长存活" value={`第 ${maxWeek} 周`} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Stat
              label="体验职业"
              value={`${triedProfessions.length}/${PROFESSIONS.length}`}
            />
            <Stat
              label="最常入职"
              value={favPro ? `${favPro.emoji} ${favPro.name}` : '—'}
            />
          </div>
        </Card>
      )}

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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-slate-800">
        {value}
      </div>
    </div>
  );
}
