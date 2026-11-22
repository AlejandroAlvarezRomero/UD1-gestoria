import { NodeBox, Reveal, Scene, useScene } from 'beatdeck';
import { Lock, Tick } from './ui';

const box = { x: 250, y: 470, w: 560, h: 230 };

function Documents_() {
  const { here, b } = useScene();
  const laptop = here && b === 0;
  const server = here && b === 1;
  const boot = here && b === 2;

  return (
    <>
      <Reveal on={here} x={160} y={140}><div className="t-eyebrow">Los documentos</div></Reveal>

      <Reveal on={laptop} out={here && b > 0} x={150} y={210}><div className="big" style={{ fontSize: 96 }}>El portátil, cerrado con clave</div></Reveal>
      <Reveal on={server} out={here && b > 1} x={150} y={210}><div className="big" style={{ fontSize: 96 }}>Y el disco del servidor</div></Reveal>
      <Reveal on={boot} x={150} y={210}><div className="big" style={{ fontSize: 88 }}>La clave no se pide al arrancar</div></Reveal>

      <NodeBox rect={box} on={laptop} tone="hot" kind="Portátil">
        <div className="bd-node-value"><span className="node-value-sans">Documentos de clientes</span></div>
      </NodeBox>
      <Reveal on={laptop} x={250} y={790}><div className="soft" style={{ fontSize: 44 }}>Si lo roban, no pueden leerlo</div></Reveal>
      <Reveal on={laptop}><Lock x={700} y={430} size={130} /></Reveal>

      <NodeBox rect={box} on={server} tone="hot" kind="Servidor">
        <div className="bd-node-value"><span className="node-value-sans">Carpeta de clientes</span></div>
      </NodeBox>
      <Reveal on={server} x={250} y={790}><div className="soft" style={{ fontSize: 44 }}>Si roban el disco, tampoco</div></Reveal>
      <Reveal on={server}><Lock x={700} y={430} size={130} /></Reveal>

      <Reveal on={boot}><Tick x={230} y={490} size={90} /></Reveal>
      <Reveal on={boot} x={370} y={520}><span className="big" style={{ fontSize: 56 }}>Arrancar: sin clave</span></Reveal>
      <Reveal on={boot}><Lock x={240} y={680} size={90} /></Reveal>
      <Reveal on={boot} x={370} y={710}><span className="big" style={{ fontSize: 52 }}>Cambiar el arranque: con clave</span></Reveal>
      <Reveal on={boot} x={230} y={880}><div className="mono-note" style={{ fontSize: 26 }}>En los dos equipos</div></Reveal>
    </>
  );
}

/** 06 DOCUMENTOS — encryption and the boot password, in plain words. */
export const Documents = () => <Scene index={5}><Documents_ /></Scene>;
