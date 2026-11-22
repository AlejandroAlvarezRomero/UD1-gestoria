import { Arrow, NodeBox, Reveal, Scene, useScene } from 'beatdeck';

const servers = { x: 150, y: 400, w: 500, h: 300 };
const staff = { x: 710, y: 400, w: 500, h: 300 };
const clients = { x: 1270, y: 400, w: 500, h: 300 };
const internet = { x: 1270, y: 820, w: 500, h: 130 };

function After_() {
  const { here, b } = useScene();
  const onlyInternet = here && b >= 1;

  return (
    <>
      <Reveal on={here} x={160} y={140}><div className="t-eyebrow">Después</div></Reveal>
      <Reveal on={here && b === 0} out={here && b > 0} x={150} y={205}>
        <div className="big" style={{ fontSize: 112 }}>Tres redes separadas</div>
      </Reveal>
      <Reveal on={onlyInternet} x={150} y={205}>
        <div className="big" style={{ fontSize: 104 }}>El móvil, solo a Internet</div>
      </Reveal>

      <NodeBox rect={servers} on={here} tone={onlyInternet ? 'dim' : 'hot'} kind="Servidores">
        <div className="bd-node-value"><span className="node-value-sans">Documentos de clientes</span></div>
      </NodeBox>
      <NodeBox rect={staff} on={here} tone={onlyInternet ? 'dim' : 'normal'} kind="Plantilla">
        <div className="bd-node-value"><span className="node-value-sans">Puestos e impresoras</span></div>
      </NodeBox>
      <NodeBox rect={clients} on={here} tone={onlyInternet ? 'hot' : 'normal'} kind="Clientes">
        <div className="bd-node-value"><span className="node-value-sans">WiFi de sala de espera</span></div>
      </NodeBox>

      <NodeBox rect={internet} on={onlyInternet} kind="Internet" value="Internet" tone="hot" />
      <Arrow from={clients} to={internet} on={onlyInternet} tone="hot" label="sí sale" ly={10} />
      <Arrow from={clients} to={staff} on={onlyInternet} tone="ghost" head={false} label="no ve la oficina" ly={-200} />
    </>
  );
}

/** 04 DESPUÉS — three separate networks; guests only reach the Internet. */
export const After = () => <Scene index={3}><After_ /></Scene>;
