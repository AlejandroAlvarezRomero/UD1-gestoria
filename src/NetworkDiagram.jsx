const node = (x, y, w, h, label, color = '#4b5b57') => (
  <g key={label}>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth="2" />
    <text x={x + w / 2} y={y + h / 2 + 7} textAnchor="middle" fontSize="22" fill="#162421">
      {label}
    </text>
  </g>
)

function Before() {
  const line = '#52645f'
  return (
    <svg viewBox="0 0 1200 620" role="img" aria-label="Antes: todos los equipos en una sola red">
      <text x="60" y="70" fontSize="22" letterSpacing="3" fill="#52645f">
        VLAN 1 · TODO JUNTO
      </text>
      <g stroke={line} strokeWidth="2" fill="none">
        <path d="M250 310 H390" />
        <path d="M520 310 H640 V170 H720" />
        <path d="M520 310 H720" />
        <path d="M520 310 H640 V450 H720" />
        <path d="M520 310 H890 V450 H950" />
        <path d="M520 310 H640 V170 H950" />
      </g>
      {node(70, 270, 180, 80, 'Router', line)}
      {node(390, 270, 130, 80, 'Switch', line)}
      {node(720, 130, 230, 80, 'Servidor', line)}
      {node(720, 270, 230, 80, 'Puestos', line)}
      {node(720, 410, 230, 80, 'Impresoras', line)}
      {node(950, 410, 200, 80, 'Móvil cliente', line)}
      {node(950, 130, 200, 80, 'Asesoría FTP', '#8a5200')}
      <text x="60" y="560" fontSize="20" fill="#52645f">
        El móvil de un cliente puede llegar al servidor.
      </text>
    </svg>
  )
}

function After() {
  const teal = '#0f6a63'
  const amber = '#8a5200'
  const soft = '#c9d8d4'
  return (
    <svg viewBox="0 0 1200 620" role="img" aria-label="Después: tres redes separadas por VLAN">
      <g stroke={soft} strokeWidth="1.5">
        <path d="M40 170 H1160" />
        <path d="M40 360 H1160" />
        <path d="M40 550 H1160" />
      </g>
      <text x="60" y="70" fontSize="22" letterSpacing="3" fill={teal}>
        VLAN 10 · SERVIDOR
      </text>
      {node(470, 100, 260, 56, 'srv-mareas', teal)}
      <path d="M730 128 H1040" stroke={amber} strokeWidth="2.5" fill="none" />
      <text x="745" y="112" fontSize="17" fill={amber}>
        solo desde la IP de la asesoría
      </text>

      <text x="60" y="260" fontSize="22" letterSpacing="3" fill={teal}>
        VLAN 20 · PLANTILLA
      </text>
      {node(300, 285, 210, 56, 'Puestos', teal)}
      {node(560, 285, 210, 56, 'Impresoras', teal)}
      <path d="M770 313 H1040" stroke={teal} strokeWidth="2.5" fill="none" />
      <text x="785" y="297" fontSize="17" fill={teal}>
        solo web y carpeta
      </text>

      <text x="60" y="450" fontSize="22" letterSpacing="3" fill={teal}>
        VLAN 30 · CLIENTES
      </text>
      {node(300, 475, 210, 56, 'Móvil cliente', teal)}
      <path d="M510 503 H1040" stroke={soft} strokeWidth="2.5" strokeDasharray="8 8" fill="none" />
      <text x="700" y="487" fontSize="17" fill="#52645f">
        solo Internet
      </text>

      {node(1040, 270, 120, 90, 'Router', '#162421')}
      <text x="60" y="595" fontSize="20" fill="#52645f">
        Lo que no está permitido no se enruta.
      </text>
    </svg>
  )
}

export default function NetworkDiagram({ position }) {
  return (
    <div className="diagram-stage" style={{ '--pos': `${position}%` }}>
      <div className="diagram-layer diagram-before">
        <Before />
      </div>
      <div className="diagram-layer diagram-after">
        <After />
      </div>
      <div className="diagram-divider" aria-hidden="true">
        <span className="diagram-grip" />
      </div>
      <span className="diagram-tag diagram-tag--before">Antes</span>
      <span className="diagram-tag diagram-tag--after">Después</span>
    </div>
  )
}
