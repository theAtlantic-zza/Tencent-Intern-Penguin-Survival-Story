import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import { PROFESSIONS } from '../game/professions';
import type { AttrKey } from '../game/types';
import { playSfx } from '../game/sfx';

const ATTR_LABEL: Record<AttrKey, string> = {
  hp: '体力',
  iq: '智力',
  eq: '情商',
  money: '存款',
  mentor: '导师',
  rank: '转正',
};

export default function ChoosingScreen() {
  const name = useGame((s) => s.name);
  const pickProfession = useGame((s) => s.pickProfession);

  return (
    <div className="space-y-3 animate-float-in">
      <Card>
        <div className="text-sm font-semibold text-slate-700">
          {name}，你想以什么身份入职鹅厂？
        </div>
        <p className="mt-1 text-xs text-slate-500">
          不同部门有专属事件、起始属性和独门天赋
        </p>
      </Card>

      <div className="space-y-2">
        {PROFESSIONS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              playSfx('click');
              pickProfession(p.id);
            }}
            className="block w-full overflow-hidden rounded-2xl bg-white/85 p-4 text-left shadow-soft ring-1 ring-white backdrop-blur-sm transition hover:-translate-y-[1px] hover:ring-tx-blue/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tx-ice text-2xl">
                {p.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800">
                  {p.name}
                </div>
                <div className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {p.desc}
                </div>
              </div>
            </div>

            {/* 起始属性条 */}
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {(['hp', 'iq', 'eq', 'money'] as AttrKey[]).map((k) => (
                <div
                  key={k}
                  className="rounded-md bg-slate-50 px-2 py-1 text-center text-[10px]"
                >
                  <div className="text-slate-500">{ATTR_LABEL[k]}</div>
                  <div className="font-semibold text-slate-800">
                    {p.baseAttrs[k]}
                  </div>
                </div>
              ))}
            </div>

            {/* 独门天赋 */}
            <div className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-800 ring-1 ring-amber-200">
              <span className="font-semibold">
                💎 独门天赋 · {p.signatureTalent.name}：
              </span>
              {p.signatureTalent.desc}
            </div>
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => useGame.setState({ stage: 'difficulty' })}
      >
        ← 返回难度选择
      </Button>
    </div>
  );
}
