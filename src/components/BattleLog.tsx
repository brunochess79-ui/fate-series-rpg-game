import { useEffect, useRef } from 'react';

interface Props {
  log: string[];
}

export function BattleLog({ log }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length]);

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
