import { useEffect, useRef } from 'react';

interface Props {
  log: string[];
  autoScroll?: boolean;
}

export function BattleLog({ log, autoScroll = true }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length, autoScroll]);

  return (
    <div className="battle-log">
      {log.map((line, i) => (
        <p key={i} className="log-line">
          {line}
        </p>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
