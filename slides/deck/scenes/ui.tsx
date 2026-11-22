/** Tiny local marks. Diagrams themselves use beatdeck's NodeBox / Arrow. */

export function Lock({ x, y, size = 120 }: { x: number; y: number; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"
      style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}
    >
      <path d="M28 44 V34 a22 22 0 0 1 44 0 V44" fill="none" stroke="var(--accent)" strokeWidth="6" />
      <rect x="17" y="43" width="66" height="47" rx="4" fill="var(--bg)" stroke="var(--accent)" strokeWidth="6" />
      <circle cx="50" cy="65" r="5" fill="var(--accent)" />
    </svg>
  );
}

export function Tick({ x, y, size = 110 }: { x: number; y: number; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"
      style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}
    >
      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="5" />
      <path d="M31 51 L44 64 L70 37" fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Cross({ x, y, size = 60 }: { x: number; y: number; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"
      style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}
    >
      <path d="M22 22 L78 78 M78 22 L22 78" fill="none" stroke="var(--ink-3)" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

/** The one big hairline box of the «before» diagram. */
export function GroupFrame({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <>
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, border: '2px solid var(--hair-strong)', boxSizing: 'border-box' }} />
      <div className="mono-note" style={{ position: 'absolute', left: x + 32, top: y + 16, color: 'var(--accent)', fontSize: 22 }}>{label}</div>
    </>
  );
}
