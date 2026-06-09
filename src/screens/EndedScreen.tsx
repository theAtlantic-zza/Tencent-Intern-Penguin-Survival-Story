import { useGame, getAchievementById } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { playSfx } from '../game/sfx';
import { DIFFICULTY_CONFIG } from '../game/tracks';

interface Props {
  onOpenCollection: () => void;
}

export default function EndedScreen({ onOpenCollection }: Props) {
  const ending = useGame((s) => s.ending);
  const endingDesc = useGame((s) => s.endingDesc);
  const name = useGame((s) => s.name);
  const week = useGame((s) => s.week);
  const difficulty = useGame((s) => s.difficulty);
  const profession = useGame((s) => s.profession);
  const talent = useGame((s) => s.talent);
  const reincarnate = useGame((s) => s.reincarnate);
  const goHome = useGame((s) => s.goHome);
  const unlockedAchievements = useGame((s) => s.unlockedAchievements);

  const posterRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  if (!ending) return null;

  const cfg = DIFFICULTY_CONFIG[difficulty];
  const totalWeeks = cfg.weeks;

  const recent = unlockedAchievements
    .slice(-3)
    .map((id) => getAchievementById(id))
    .filter(Boolean);

  const onShare = async () => {
    if (!posterRef.current || busy) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#f0f6ff',
        scale: 2,
        useCORS: true,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `鹅厂实习记-${name}-${ending.name}.png`;
      a.click();
      playSfx('good');
    } catch (e) {
      console.error(e);
      alert('截图失败，请重试');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 animate-float-in">
      <div ref={posterRef}>
        <Card className="!p-0 overflow-hidden">
          {ending.image && (
            <div className="aspect-square w-full overflow-hidden bg-[#9ed8ee]">
              <img
                src={ending.image}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
                crossOrigin="anonymous"
              />
            </div>
          )}
          <div className="p-5 text-center">
            <div className="tracking-[0.32em] text-[10px] text-tx-blue/80">
              TENCENT PENGUIN INTERN
            </div>
            <div className="mt-1 text-[13px] font-medium text-slate-600">
              鹅厂<span className="text-tx-blue">实习记</span>
            </div>

            <div className="mt-3 text-xs text-slate-400">本世结局</div>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-2xl">{ending.emoji}</span>
              <span className="text-lg font-bold text-slate-800">
                {ending.name}
              </span>
            </div>
            <div className="mt-2 px-2 text-xs leading-relaxed text-slate-600">
              {endingDesc ?? ending.desc}
            </div>

            <div className="mt-4 rounded-xl bg-tx-ice/60 px-3 py-2 text-[11px] text-tx-deep">
              {name} · {profession ? `${profession.emoji} ${profession.name}` : '实习鹅'} · {cfg.name} · 共撑过{' '}
              {Math.min(week, totalWeeks)} / {totalWeeks} 周
            </div>

            {talent && (
              <div className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] text-amber-700">
                {talent.emoji} {talent.name}
              </div>
            )}

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
              #鹅厂实习记 · 来开启你的轮回吧
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            playSfx('click');
            reincarnate();
          }}
          className="!py-3 !text-[15px]"
        >
          转生再战
        </Button>
        <Button variant="soft" onClick={onShare} disabled={busy}>
          {busy ? '生成中…' : '📸 保存结局海报'}
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
