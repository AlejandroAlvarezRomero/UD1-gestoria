import { Reveal, Scene, useScene } from 'beatdeck';
import { Tick } from './ui';

const CHECKS = [
  { lines: ['El móvil del cliente', 'no llega al servidor'], size: 92 },
  { lines: ['La asesoría entra', 'otra dirección, no'], size: 100 },
  { lines: ['La carpeta sigue funcionando'], size: 96 },
  { lines: ['El arranque pide clave', 'solo al cambiarlo'], size: 96 },
];

function Verified_() {
  const { here, b } = useScene();
  const score = here && b === 4;

  return (
    <>
      <Reveal on={here} x={160} y={140}><div className="t-eyebrow">Comprobado</div></Reveal>

      {CHECKS.map((check, i) => (
        <div key={i}>
          <Reveal on={here && b === i} out={here && b > i}><Tick x={160} y={320} size={110} /></Reveal>
          {check.lines.map((line, j) => (
            <Reveal key={line} on={here && b === i} out={here && b > i} x={330} y={320 + j * 130}>
              <div className="big" style={{ fontSize: check.size, color: j === 1 ? 'var(--accent)' : 'var(--ink)' }}>{line}</div>
            </Reveal>
          ))}
        </div>
      ))}

      <Reveal on={score} x={260} y={330}><div className="mono-note" style={{ fontSize: 26 }}>antes</div></Reveal>
      <Reveal on={score} x={250} y={380}><div className="t-numeral" style={{ fontSize: 220 }}>9.6</div></Reveal>
      <Reveal on={score} x={820} y={430} delay={180}><div className="big" style={{ fontSize: 150, color: 'var(--accent)' }}>→</div></Reveal>
      <Reveal on={score} x={1160} y={330}><div className="mono-note" style={{ fontSize: 26, color: 'var(--accent)' }}>ahora</div></Reveal>
      <Reveal on={score} x={1150} y={380} delay={120}><div className="t-numeral" style={{ fontSize: 220, color: 'var(--accent)' }}>6.0</div></Reveal>
      <Reveal on={score} x={260} y={740} delay={260}><div className="soft" style={{ fontSize: 44 }}>La carpeta está menos expuesta</div></Reveal>
    </>
  );
}

/** 08 COMPROBADO — five checks, one idea each. */
export const Verified = () => <Scene index={7}><Verified_ /></Scene>;
