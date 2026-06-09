import { useState } from 'react';
import { useGame } from '../game/store';
import type { Achievement, Ending } from '../game/types';

interface Props {
  endings: Ending[];
  achievements: Achievement[];
  onClose: () => void;
}

export default function CollectionModal({
  endings,
  achievements,
  onClose,
}: Props) {
  const [tab, setTab] = useState<'endings' | 'achievements'>('endings');
  const unlockedEndings = useGame((s) => s.unlockedEndings);
  const unlockedAchievements = useGame((s) => s.unlockedAchievements);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] animate-pop overflow-hidden rounded-2xl bg-white shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="text-sm font-semibold text-slate-800">📖 图鉴</div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
          >
            关闭
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3">
          <TabBtn
            active={tab === 'endings'}
            onClick={() => setTab('endings')}
            label={`结局 ${unlockedEndings.length}/${endings.length}`}
          />
          <TabBtn
            active={tab === 'achievements'}
            onClick={() => setTab('achievements')}
            label={`成就 ${unlockedAchievements.length}/${achievements.length}`}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
          {tab === 'endings' ? (
            <ul className="space-y-2">
              {endings.map((e) => {
                const got = unlockedEndings.includes(e.id);
                return (
                  <li
                    key={e.id}
                    className={`rounded-xl px-3 py-2.5 ring-1 ${
                      got
                        ? 'bg-tx-ice/60 ring-tx-blue/20'
                        : 'bg-slate-50 ring-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{got ? e.emoji : '❓'}</span>
                      <span
                        className={`text-sm font-medium ${
                          got ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {got ? e.name : '???'}
                      </span>
                    </div>
                    <div
                      className={`mt-1 text-[11px] leading-relaxed ${
                        got ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {got ? e.desc : '未解锁'}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="space-y-2">
              {achievements.map((a) => {
                const got = unlockedAchievements.includes(a.id);
                return (
                  <li
                    key={a.id}
                    className={`rounded-xl px-3 py-2.5 ring-1 ${
                      got
                        ? 'bg-amber-50 ring-amber-200'
                        : 'bg-slate-50 ring-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{got ? a.emoji : '🔒'}</span>
                      <span
                        className={`text-sm font-medium ${
                          got ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {got ? a.name : '???'}
                      </span>
                    </div>
                    <div
                      className={`mt-1 text-[11px] leading-relaxed ${
                        got ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {got ? a.desc : '未解锁'}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
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
      className={`flex-1 rounded-lg px-3 py-1.5 text-xs transition ${
        active
          ? 'bg-tx-blue text-white shadow-soft'
          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );
}
