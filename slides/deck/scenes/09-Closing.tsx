import { Reveal, Scene, useScene } from 'beatdeck';

const ITEMS = [
  {
    eyebrow: 'Pendiente',
    lines: ['Quitar servicios', 'que no hacen falta'],
    size: 96,
    sub: ['Es lo único que sigue sin verificar'],
  },
  {
    eyebrow: 'Riesgo asumido',
    lines: ['El FTP sigue sin cifrar'],
    size: 104,
    sub: ['Cambiarlo rompería el trabajo de la asesoría'],
  },
  {
    eyebrow: 'Riesgo asumido',
    lines: ['Los USB siguen permitidos'],
    size: 96,
    sub: ['Por si los clientes traen documentos'],
  },
  {
    eyebrow: 'Límite del laboratorio',
    lines: ['Falta la clave de la BIOS', 'en el laboratorio'],
    size: 92,
    sub: ['Las máquinas de pruebas no la permiten;', 'tampoco Secure Boot (arranque seguro)'],
  },
  {
    eyebrow: 'Límite que queda',
    lines: ['Un portátil encendido', 'sigue sin protección'],
    size: 92,
    sub: ['Con la sesión abierta, estas capas no ayudan'],
  },
];

function Closing_() {
  const { here, b } = useScene();
  const opinion = here && b === 5;

  return (
    <>
      {ITEMS.map((item, i) => (
        <div key={item.eyebrow + i}>
          <Reveal on={here && b === i} out={here && b > i} x={160} y={140}>
            <div className="t-eyebrow">{item.eyebrow}</div>
          </Reveal>
          {item.lines.map((line, j) => (
            <Reveal key={line} on={here && b === i} out={here && b > i} x={150} y={300 + j * 130}>
              <div className="big" style={{ fontSize: item.size }}>{line}</div>
            </Reveal>
          ))}
          {item.sub.map((line, j) => (
            <Reveal key={line} on={here && b === i} out={here && b > i} x={160} y={700 + j * 62}>
              <div className="soft" style={{ fontSize: 42 }}>{line}</div>
            </Reveal>
          ))}
        </div>
      ))}

      <Reveal on={opinion} out={here && b > 5} x={160} y={280}><div className="t-eyebrow">Y ahora...</div></Reveal>
      <Reveal on={opinion} out={here && b > 5} x={150} y={370}>
        <div className="big" style={{ fontSize: 190 }}>¿Qué te parece?</div>
      </Reveal>
      <Reveal on={opinion} out={here && b > 5} x={160} y={650}>
        <div className="soft" style={{ fontSize: 48 }}>Tu opinión antes del siguiente paso</div>
      </Reveal>
    </>
  );
}

/** 09 QUEDA — pending work, accepted risks, open limits and the ask. */
export const Closing = () => <Scene index={8}><Closing_ /></Scene>;
