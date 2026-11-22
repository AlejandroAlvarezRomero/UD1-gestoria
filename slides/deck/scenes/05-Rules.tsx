import { Arrow, NodeBox, Reveal, Scene, useScene } from 'beatdeck';

function Rules_() {
  const { here, b } = useScene();
  const r0 = here && b === 0;
  const r1 = here && b === 1;
  const r2 = here && b === 2;

  return (
    <>
      <Reveal on={here} x={160} y={140}><div className="t-eyebrow">Reglas sencillas</div></Reveal>
      <Reveal on={r0} out={here && b > 0} x={150} y={210}><div className="big" style={{ fontSize: 96 }}>Solo su dirección entra</div></Reveal>
      <Reveal on={r1} out={here && b > 1} x={150} y={210}><div className="big" style={{ fontSize: 96 }}>Solo la web y la carpeta</div></Reveal>
      <Reveal on={r2} x={150} y={210}><div className="big" style={{ fontSize: 96 }}>El wifi no ve la oficina</div></Reveal>

      {/* 5.1 — the tax advisor is let in only from the known address */}
      <NodeBox rect={{ x: 160, y: 520, w: 360, h: 150 }} on={r0} kind="Desde fuera" value="Asesoría" />
      <NodeBox rect={{ x: 650, y: 520, w: 380, h: 150 }} on={r0} tone="hot" kind="Regla" value="Solo su dirección" />
      <NodeBox rect={{ x: 1140, y: 520, w: 360, h: 150 }} on={r0} kind="Dentro" value="Servidor" />
      <NodeBox rect={{ x: 160, y: 760, w: 360, h: 130 }} on={r0} tone="dim" kind="Otros" value="Otra dirección" />
      <Arrow from={{ x: 160, y: 520, w: 360, h: 150 }} to={{ x: 650, y: 520, w: 380, h: 150 }} on={r0} tone="hot" />
      <Arrow from={{ x: 650, y: 520, w: 380, h: 150 }} to={{ x: 1140, y: 520, w: 360, h: 150 }} on={r0} tone="hot" />
      <Arrow from={{ x: 160, y: 760, w: 360, h: 130 }} to={{ x: 650, y: 520, w: 380, h: 150 }} on={r0} tone="ghost" head={false} label="no pasa" ly={-20} />

      {/* 5.2 — staff reach only the web page and the shared folder */}
      <NodeBox rect={{ x: 160, y: 520, w: 360, h: 150 }} on={r1} kind="Plantilla" value="Plantilla" />
      <NodeBox rect={{ x: 1140, y: 520, w: 360, h: 150 }} on={r1} tone="hot" kind="Servidor" value="Servidor" />
      <Arrow from={{ x: 160, y: 520, w: 360, h: 150 }} to={{ x: 1140, y: 520, w: 360, h: 150 }} on={r1} tone="hot" label="web y carpeta" ly={-45} />

      {/* 5.3 — guests cannot see the office */}
      <NodeBox rect={{ x: 160, y: 520, w: 400, h: 150 }} on={r2} tone="hot" kind="Clientes" value="Clientes (wifi)" />
      <NodeBox rect={{ x: 1140, y: 520, w: 400, h: 150 }} on={r2} tone="dim" kind="Oficina" value="Oficina" />
      <NodeBox rect={{ x: 1140, y: 760, w: 400, h: 130 }} on={r2} tone="hot" kind="Internet" value="Internet" />
      <Arrow from={{ x: 160, y: 520, w: 400, h: 150 }} to={{ x: 1140, y: 520, w: 400, h: 150 }} on={r2} tone="ghost" head={false} label="bloqueado" ly={-45} />
      <Arrow from={{ x: 160, y: 520, w: 400, h: 150 }} to={{ x: 1140, y: 760, w: 400, h: 130 }} on={r2} tone="hot" label="sí sale" ly={20} />
    </>
  );
}

/** 05 REGLAS — one access rule per click. */
export const Rules = () => <Scene index={4}><Rules_ /></Scene>;
