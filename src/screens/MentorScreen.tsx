import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import { MENTORS } from '../game/mentors';
import { playSfx } from '../game/sfx';

export default function MentorScreen() {
  const profession = useGame((s) => s.profession);
  const pickMentor = useGame((s) => s.pickMentor);

  return (
    <div className="space-y-3 animate-float-in">
      <Card>
        <div className="text-sm font-semibold text-slate-700">
          {profession ? `${profession.emoji} ` : ''}入职报道，你被分到了谁手下？
        </div>
        <p className="mt-1 text-xs text-slate-500">
          导师人设决定整局节奏 · 数值加成 · 月度评语风格
        </p>
      </Card>

      <div className="space-y-2">
        {MENTORS.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              playSfx('click');
              pickMentor(m.id);
            }}
            className="block w-full overflow-hidden rounded-2xl bg-white/85 p-4 text-left shadow-soft ring-1 ring-white backdrop-blur-sm transition hover:-translate-y-[1px] hover:ring-tx-blue/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tx-ice text-2xl">
                {m.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    {m.name}
                  </span>
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] text-violet-700">
                    {m.vibe}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {m.desc}
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-lg bg-violet-50 px-2.5 py-1.5 text-[11px] leading-relaxed text-violet-800 ring-1 ring-violet-200">
              {mentorSummary(m.id)}
            </div>
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => useGame.setState({ stage: 'choosing' })}
      >
        ← 返回职业选择
      </Button>
    </div>
  );
}

function mentorSummary(id: string): string {
  switch (id) {
    case 'kevin':
      return '智力/转正进度 +30%，体力消耗 +30%，每周自动 -1 体力';
    case 'cathy':
      return '情商正向 +20%，转正进度 -30%，每周自动 +1 体力';
    case 'morgan':
      return '导师好感涨速 -50%，但封顶更高，玄学加成';
    case 'brian':
      return '所有正向 +1，所有负向 -1（大开大合）';
    default:
      return '';
  }
}
