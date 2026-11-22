import { Reveal, Scene, useScene } from 'beatdeck';

const RULES = [
  { n: '01', text: 'Seguir trabajando igual', size: 100 },
  { n: '02', text: 'No comprar hardware', size: 100 },
  { n: '03', text: 'No cambiar el programa de la asesoría', size: 76 },
];

function Limits_() {
  const { here, b } = useScene();
  return (
    <>
      <Reveal on={here} x={160} y={140}><div className="t-eyebrow">Lo que no podemos cambiar</div></Reveal>
      {RULES.map((rule, i) => (
        <Reveal key={rule.n} on={here && b >= i} x={170} y={280 + i * 190}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 40 }}>
            <span className="rule-index">{rule.n}</span>
            <span className="big" style={{ fontSize: rule.size }}>{rule.text}</span>
          </div>
        </Reveal>
      ))}
    </>
  );
}

/** 03 LÍMITES — the three restrictions, one per click. */
export const Limits = () => <Scene index={2}><Limits_ /></Scene>;
