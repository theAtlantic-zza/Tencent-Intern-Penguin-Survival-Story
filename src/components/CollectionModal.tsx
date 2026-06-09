import { useState } from 'react';
import { useGame } from '../game/store';
import type { Achievement, Ending } from '../game/types';

interface Props {
  endings: Ending[];
  achievements: Achievement[];
  onClose: () => void;
}

type Tab = 'endings' | 'achievements';

export default function CollectionModal({
  endings,
  achievements,
  onClose,
}: Props) {
  const [tab, setTab] = useState<Tab>('endings');
  const [selectedEnding, setSelectedEnding] = useState<Ending | null>(null);
  const unlockedEndings = useGame((s) => s.unlockedEndings);
  const unlockedAchievements = useGame((s) => s.unlockedAchievements);

  const endingPct = (unlockedEndings.length / endings.length) * 100;
  const achPct = (unlockedAchievements.length / achievements.length) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] animate-pop overflow-hidden rounded-3xl bg-white shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部：进度环 + 标题 */}
        <div className="relative bg-gradient-to-br from-tx-blue to-sky-500 px-5 pt-5 pb-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-xs hover:bg-white/30"
          >
            ✕
          </button>
          <div className="text-[10px] tracking-[0.3em] opacity-80">
            COLLECTION
          </div>
          <div className="mt-1 text-base font-bold">📖 我的鹅生图鉴</div>

          <div className="mt-4 flex items-center gap-4">
            <ProgressRing
              pct={tab === 'endings' ? endingPct : achPct}
              text={
                tab === 'endings'
                  ? `${unlockedEndings.length}/${endings.length}`
                  : `${unlockedAchievements.length}/${achievements.length}`
              }
            />
            <div className="flex-1 space-y-1.5">
              <TabBtn
                active={tab === 'endings'}
                onClick={() => setTab('endings')}
                label={`结局收集 ${unlockedEndings.length}/${endings.length}`}
              />
              <TabBtn
                active={tab === 'achievements'}
                onClick={() => setTab('achievements')}
                label={`成就解锁 ${unlockedAchievements.length}/${achievements.length}`}
              />
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="max-h-[58vh] overflow-y-auto px-4 pb-4 pt-3">
          {tab === 'endings' ? (
            <div className="grid grid-cols-3 gap-2.5">
              {endings.map((e) => {
                const got = unlockedEndings.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() => got && setSelectedEnding(e)}
                    className={`overflow-hidden rounded-2xl text-left transition ${
                      got
                        ? 'bg-white ring-1 ring-tx-blue/20 hover:-translate-y-0.5 hover:ring-tx-blue/50'
                        : 'bg-slate-50 ring-1 ring-slate-100'
                    }`}
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-[#cfe5f1]">
                      {got && e.image ? (
                        <img
                          src={e.image}
                          alt=""
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-3xl text-slate-300">
                          ❓
                        </div>
                      )}
                      {got && (
                        <div className="absolute right-1 top-1 rounded-full bg-tx-blue px-1.5 py-0.5 text-[9px] font-medium text-white">
                          已解锁
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <div
                        className={`flex items-center gap-1 text-[11px] font-semibold ${
                          got ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        <span>{got ? e.emoji : '🔒'}</span>
                        <span className="truncate">
                          {got ? e.name : '???'}
                        </span>
                      </div>
                      {!got && e.hint && (
                        <div className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-slate-400">
                          {e.hint}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {achievements.map((a) => {
                const got = unlockedAchievements.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className={`overflow-hidden rounded-2xl p-3 ring-1 ${
                      got
                        ? 'bg-gradient-to-br from-amber-50 to-amber-100 ring-amber-200'
                        : 'bg-slate-50 ring-slate-100'
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                        got ? 'bg-white shadow-sm' : 'bg-slate-100 grayscale'
                      }`}
                    >
                      {got ? a.emoji : '🔒'}
                    </div>
                    <div
                      className={`mt-2 text-[12px] font-semibold ${
                        got ? 'text-amber-800' : 'text-slate-400'
                      }`}
                    >
                      {got ? a.name : '???'}
                    </div>
                    <div
                      className={`mt-0.5 text-[10px] leading-tight ${
                        got ? 'text-amber-700/80' : 'text-slate-400'
                      }`}
                    >
                      {a.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 结局详情弹窗 */}
      {selectedEnding && (
        <EndingDetailModal
          ending={selectedEnding}
          onClose={() => setSelectedEnding(null)}
        />
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs transition ${
        active ? 'bg-white text-tx-blue shadow-sm' : 'bg-white/15 text-white/90 hover:bg-white/25'
      }`}
    >
      {label}
    </button>
  );
}

/** SVG 圆环进度 */
function ProgressRing({ pct, text }: { pct: number; text: string }) {
  const size = 64;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="white"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
        fill="white"
      >
        {text}
      </text>
    </svg>
  );
}

function EndingDetailModal({
  ending,
  onClose,
}: {
  ending: Ending;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[380px] animate-pop overflow-hidden rounded-3xl bg-white shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
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
        <div className="p-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{ending.emoji}</span>
            <span className="text-base font-bold text-slate-800">
              {ending.name}
            </span>
          </div>
          <div className="mt-2 text-xs leading-relaxed text-slate-600">
            {ending.desc}
          </div>
          {ending.hint && (
            <div className="mt-3 rounded-lg bg-tx-ice/60 px-3 py-2 text-[11px] text-tx-deep">
              💡 触发方式：{ending.hint}
            </div>
          )}
          <button
            onClick={onClose}
            className="mt-4 block w-full rounded-xl bg-slate-100 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
