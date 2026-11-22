import { Arrow, NodeBox, Reveal, Scene, useScene } from 'beatdeck';
import { GroupFrame } from './ui';

const server = { x: 210, y: 540, w: 320, h: 150 };
const staff = { x: 620, y: 540, w: 300, h: 150 };
const printers = { x: 1010, y: 540, w: 330, h: 150 };
const phone = { x: 210, y: 760, w: 400, h: 130 };
const advisor = { x: 1520, y: 190, w: 280, h: 150 };

function Before_() {
  const { here, b } = useScene();
  const reached = here && b >= 1;

  return (
    <>
      <Reveal on={here} x={160} y={140}><div className="t-eyebrow">Antes</div></Reveal>
      <Reveal on={here} x={150} y={205}>
        <div className="big" style={{ fontSize: 130 }}>Todo junto</div>
      </Reveal>

      <GroupFrame x={150} y={440} w={1340} h={490} label="UNA SOLA RED" />

      <NodeBox rect={server} on={here} tone={reached ? 'hot' : 'normal'} kind="Servidor" value="Servidor" />
      <NodeBox rect={staff} on={here} tone={reached ? 'dim' : 'normal'} kind="Puestos" value="Puestos" />
      <NodeBox rect={printers} on={here} tone={reached ? 'dim' : 'normal'} kind="Impresoras" value="Impresoras" />
      <NodeBox rect={phone} on={here} tone={reached ? 'hot' : 'normal'} kind="Móvil del cliente" value="Móvil de cliente" />
      <NodeBox rect={advisor} on={here} tone={reached ? 'dim' : 'normal'} kind="Desde fuera" value="Asesoría" />

      <Arrow from={advisor} to={server} on={here} tone={reached ? 'dim' : 'normal'} label="entrada por FTP" ly={-24} />
      <Arrow from={phone} to={server} on={reached} tone="hot" label="llegaba al servidor" lx={230} ly={-10} labelAnchor="start" />
    </>
  );
}

/** 02 ANTES — one flat network; then the client phone reaching the server. */
export const Before = () => <Scene index={1}><Before_ /></Scene>;
