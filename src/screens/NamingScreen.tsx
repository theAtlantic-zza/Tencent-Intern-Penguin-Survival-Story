import { useGame } from '../game/store';
import Button from '../components/Button';
import Card from '../components/Card';
import { randomFunnyName } from '../game/nameGen';

export default function NamingScreen() {
  const name = useGame((s) => s.name);
  const setName = useGame((s) => s.setName);
  const confirmName = useGame((s) => s.confirmName);
  const goHome = useGame((s) => s.goHome);

  return (
    <Card className="animate-float-in !p-0 overflow-hidden">
      {/* 顶部小尺寸企鹅 */}
      <div className="flex justify-center pt-6">
        <div className="h-28 w-28 overflow-hidden rounded-2xl bg-[#9ed8ee]">
          <img
            src="/images/hero.png"
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="text-center text-base font-semibold text-slate-800">
          给你的实习企鹅取个名
        </div>
        <p className="mt-1 text-center text-xs text-slate-500">
          这个名字将伴随你历经数世轮回
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 8))}
          placeholder="输入名字（最多8个字）"
          className="mt-5 w-full rounded-2xl border-2 border-tx-blue/60 bg-white px-4 py-3 text-center text-sm outline-none transition focus:border-tx-blue focus:ring-4 focus:ring-tx-blue/15"
          maxLength={8}
        />

        <div className="mt-2 text-center text-[11px] text-slate-400">
          💡 不知道叫啥？点下面随机生成一个沙雕名
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Button variant="soft" onClick={() => setName(randomFunnyName())}>
            🎲 随机取名
          </Button>
          <Button
            onClick={() => confirmName(name)}
            disabled={!name.trim()}
            className="!py-3 !text-[15px]"
          >
            就叫这个名！→
          </Button>
          <Button variant="ghost" onClick={goHome}>
            ← 返回
          </Button>
        </div>
      </div>
    </Card>
  );
}
