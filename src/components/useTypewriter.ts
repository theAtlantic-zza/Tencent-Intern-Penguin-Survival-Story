import { useEffect, useState, useRef } from 'react';

/**
 * 打字机：text 变化时，从 0 开始按字数递增显示
 * - speed: 字/秒
 * - 用户也可以点击容器跳过到完整文本
 */
export function useTypewriter(text: string, speed = 30) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setShown('');
    setDone(false);
    if (!text) {
      setDone(true);
      return;
    }
    let i = 0;
    const interval = 1000 / speed;
    const tick = () => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        return;
      }
      timerRef.current = window.setTimeout(tick, interval);
    };
    timerRef.current = window.setTimeout(tick, interval);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [text, speed]);

  const skip = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setShown(text);
    setDone(true);
  };

  return { shown, done, skip };
}
