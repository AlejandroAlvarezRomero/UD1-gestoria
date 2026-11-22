# Runbook — Mareas Asesores: qué hemos hecho

9 escenas · 32 beats · español · tema neutral con acento azul tinta/teal (`themes/mareas.css`).
Un clic = un beat. La presentación es apoyo de lo que se cuenta en voz alta: no hay comandos ni texto técnico en
el escenario (salvo «Secure Boot» y la nota 9.6 → 6.0, que se pidieron explícitamente).

## Antes de la charla

1. `npm install` (una vez, con internet). Todo lo demás funciona sin red.
2. `npm run dev` → abre **`http://127.0.0.1:5173/#1.1`**. Es la URL de desarrollo; el archivo que sirve la
   presentación es `index.html` en la raíz de `slides/` (Vite lo sirve desde ahí).
   Para la charla en director, usa mejor `npm run present`: compila y abre `http://127.0.0.1:4173/` desde `dist/`.
3. El Wi-Fi puede estar apagado: `dist/` es autocontenido (fuentes incluidas, sin CDN, sin APIs, sin analítica).
   Cualquier servidor estático sirve `dist/`; también se puede copiar la carpeta a otro portátil.
4. Proyector a 1920×1080 si se puede. En cualquier otra relación de aspecto salen barras negras, nunca
   deformación.
5. Pulsa **P** para abrir la ventana del presentador y arrástrala a tu pantalla. Debe decir «stage connected».
   Ahí están el beat actual, el siguiente, `ref`, `source` y `note`, además del temporizador.
6. Haz clic en la ventana del escenario y pulsa **F** para el modo pantalla completa. Estás en 1.1 (standby,
   pantalla en negro). El primer clic empieza la charla.

## Durante la charla

| Tecla | Acción |
| --- | --- |
| → ↓ PageDown, clic, Espacio (en pantalla completa) | siguiente beat |
| ← ↑ PageUp | beat anterior |
| 1–9 | salto directo a la escena |
| Home / End | primer / último beat |
| B o . | apagón de pantalla (no forma parte de la historia) |
| O | vista general (clic en un beat para saltar) |
| F | pantalla completa |
| Esc | cierra la vista general |

**Ir a un beat concreto:** la URL usa `#escena.beat`, ambos empezando en 1. Ejemplos:
`#1.1` standby, `#4.2` «el móvil, solo a Internet», `#8.5` la nota 9.6 → 6.0, `#9.6` la pregunta final.
Recargar con esa misma URL vuelve exactamente al mismo beat.

**Beats automáticos:** ninguno. No hay `auto: true`, no hay temporizaciones que esperar y no hay movimiento que
se salte: cada cambio lo provoca el clic. No hace falta esperar animaciones largas.

**Reduced motion:** con `?reduced=1` (o la preferencia del sistema) se conserva la historia y los cortes, y se
quitan los bucles ambientales. Ningún beat depende de ellos.

## Mapa rápido de escenas

| Escena | Tema | Beats |
| --- | --- | --- |
| 1 · POR QUÉ | standby, título, portátil robado en septiembre, cualquiera podía ver los documentos | 4 |
| 2 · ANTES | una sola red; el móvil del cliente llegaba al servidor | 2 |
| 3 · LÍMITES | trabajar igual, no comprar hardware, no cambiar el programa de la asesoría | 3 |
| 4 · DESPUÉS | tres redes separadas; el móvil solo sale a Internet | 2 |
| 5 · REGLAS | asesoría solo desde su dirección; plantilla solo web y carpeta; wifi no ve la oficina | 3 |
| 6 · DOCUMENTOS | disco del portátil, disco del servidor, clave solo para cambiar el arranque | 3 |
| 7 · DÍA A DÍA | Laura, plantilla, servidor solo, por qué merece la pena | 4 |
| 8 · COMPROBADO | cinco comprobaciones, una por beat | 5 |
| 9 · QUEDA | pendiente, riesgos asumidos, límites, opinión | 6 |

## Si algo va mal

- **Perdiste el sitio o recargaste por accidente:** la URL conserva `#escena.beat`; recarga y vuelves al beat.
- **El presentador dice «no connection»:** pulsa **resync** en el presentador, o ciérralo y vuelve a pulsar **P**.
  Las dos ventanas tienen que ser del mismo navegador y del mismo equipo (BroadcastChannel, sin red).
- **Una animación se queda rara:** pulsa ← y → para volver a entrar en el beat; se reconstruye desde cero.
- **Fallo total:** `dist/` en un USB y cualquier portátil con navegador. No depende de internet.
- **Se ve texto pequeño o cortado:** no debería pasar (`npm run verify` lo comprueba); vuelve a comprobar con
  `npm run verify` y mira `artifacts/verify/contact.png` y el `walk-*.png` del beat afectado.

## Config que hay que revisar el día

`deck/deck.config.ts`:

- `title`: «Mareas Asesores: qué hemos hecho» (decisión tomada en nombre del usuario; se puede cambiar).
- `author`: «Grupo 1» (confirmado por el usuario).

Tras cualquier cambio en `deck/`, ejecuta `npm run build` y `npm run verify`.

## Comprobación previa ya realizada

- `npm run build`: ✓ typecheck + bundle + comprobación offline (sin referencias remotas en `dist/`).
- `npm run verify -- --source=reference/fuentes-unidas.md`: ✓ 32 beats forwards, 32 backwards, 32 desde la URL;
  frames idénticos (≤ 0,1 % de píxeles); sin errores de layout, sin peticiones remotas, sin errores de consola;
  presentador conectado. `report.json` sin `errors`, `layout`, `mismatches`, `warnings` ni `notInSource`.
- Contact sheet: `artifacts/verify/contact.png`.
