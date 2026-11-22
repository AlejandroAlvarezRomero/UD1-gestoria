import { Reveal, Scene, useScene } from 'beatdeck';

const ROWS = [
  { role: 'Laura', text: 'Una clave al encender' },
  { role: 'Plantilla', text: 'Usuario y contraseña' },
  { role: 'Servidor', text: 'Arranca solo' },
];

function Routine_() {
  const { here, b } = useScene();
  const close = here && b === 3;

  return (
    <>
      <Reveal on={here} x={160} y={140}><div className="t-eyebrow">En el día a día</div></Reveal>
      {ROWS.map((row, i) => (
        <Reveal key={row.role} on={here && b >= i && b < 3} out={here && b > 2} x={170} y={280 + i * 190}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 60 }}>
            <span className="mono-note" style={{ width: 240, color: 'var(--accent)', fontSize: 26 }}>{row.role}</span>
            <span className="big" style={{ fontSize: 76 }}>{row.text}</span>
          </div>
        </Reveal>
      ))}

      <Reveal on={close} x={150} y={370}><div className="big" style={{ fontSize: 140 }}>Pocas molestias</div></Reveal>
      <Reveal on={close} x={155} y={620} delay={160}>
        <div className="soft" style={{ fontSize: 72 }}>pero nadie ajeno lee los documentos</div>
      </Reveal>
    </>
  );
}

/** 07 DÍA A DÍA — what changes for Laura, for staff, and why it is worth it. */
export const Routine = () => <Scene index={6}><Routine_ /></Scene>;
