import { Reveal, Scene, useScene } from 'beatdeck';
import { config } from '../deck.config';

function Open_() {
  const { here, b } = useScene();
  const standby = here && b === 0;
  const title = here && b === 1;
  const why = here && b === 2;
  const access = here && b === 3;

  return (
    <>
      {/* 01.1 — calm standby; the stage is forced black here. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', left: 950, top: 528, width: 20, height: 20,
          background: 'var(--accent)', opacity: standby ? 1 : 0, transition: 'opacity 400ms',
        }}
      />

      {/* 01.2 — title */}
      <Reveal on={title} x={160} y={286}><div className="t-eyebrow">Mareas Asesores</div></Reveal>
      <Reveal on={title} x={150} y={366} delay={120}>
        <div className="t-statement" style={{ fontSize: 180 }}>Qué hemos hecho</div>
      </Reveal>
      {config.author && (
        <Reveal on={title} x={166} y={640} delay={360}>
          <div className="t-meta" style={{ fontSize: 24 }}>{config.author}</div>
        </Reveal>
      )}

      {/* 01.3 — the stolen laptop */}
      <Reveal on={why} x={160} y={270}><div className="t-eyebrow">El motivo</div></Reveal>
      <Reveal on={why} x={150} y={360} delay={100}>
        <div className="big" style={{ fontSize: 160 }}>Robaron un portátil</div>
      </Reveal>
      <Reveal on={why} x={166} y={610} delay={320}>
        <div className="mono-note" style={{ fontSize: 30, color: 'var(--accent)' }}>Septiembre</div>
      </Reveal>

      {/* 01.4 — the exposure */}
      <Reveal on={access} x={160} y={250}><div className="t-eyebrow">El problema</div></Reveal>
      <Reveal on={access} x={150} y={350}><div className="big" style={{ fontSize: 118 }}>Cualquiera en la red</div></Reveal>
      <Reveal on={access} x={150} y={490} delay={120}><div className="big" style={{ fontSize: 118 }}>podía ver los documentos</div></Reveal>
      <Reveal on={access} x={150} y={630} delay={240}><div className="big" style={{ fontSize: 118 }}>de los clientes</div></Reveal>
    </>
  );
}

/** 01 POR QUÉ — standby, title, the theft, the exposure. */
export const Open = () => <Scene index={0}><Open_ /></Scene>;
