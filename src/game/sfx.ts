import { useGame } from '../game/store';

/**
 * 极简音效系统：使用 WebAudio 实时合成短促音，避免引入音频资源
 * - click：选项点击 / 翻页
 * - good：正向属性变化
 * - bad：负向属性变化
 * - end：结局触发
 */
type SfxKind = 'click' | 'good' | 'bad' | 'end';

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  // 浏览器自动暂停的恢复
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) {
  const c = ensureCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playSfx(kind: SfxKind) {
  const muted = useGame.getState().muted;
  if (muted) return;
  switch (kind) {
    case 'click':
      tone(880, 0.06, 'triangle', 0.06);
      break;
    case 'good':
      tone(660, 0.08, 'sine', 0.08);
      setTimeout(() => tone(990, 0.12, 'sine', 0.08), 60);
      break;
    case 'bad':
      tone(220, 0.12, 'sawtooth', 0.06);
      break;
    case 'end':
      tone(523, 0.12, 'triangle', 0.1);
      setTimeout(() => tone(659, 0.12, 'triangle', 0.1), 100);
      setTimeout(() => tone(784, 0.2, 'triangle', 0.1), 200);
      break;
  }
}
