---
name: Mareas Asesores · Bastionado de redes
description: Lámina editorial de mareas donde la red se manipula para explicar el bastionado de una gestoría.
colors:
  ink: "#071417"
  paper: "#f2f0e8"
  water: "#9fd8ce"
  amber: "#e9a23b"
  amber-on-paper: "#8a5200"
  teal: "#0f6a63"
  paper-ink: "#162421"
  muted: "#a8bcb7"
  paper-muted: "#5b6d68"
  line-paper: "#c9d2ce"
  line-ink: "rgba(242, 240, 232, 0.18)"
  diagram-bg: "#e7ece8"
  diagram-rule: "#c9d8d4"
  diagram-before: "#52645f"
  diagram-node: "#4b5b57"
  technical-ink: "#35463f"
  footer-ink: "#8aa09a"
  scrollbar-thumb: "#2c4a49"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(2.9rem, 5.9vw, 5.3rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(2.5rem, 4.8vw, 4.6rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(1.55rem, 2.5vw, 2.55rem)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.028em"
  body:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    letterSpacing: "0.14em"
  header:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 400
    letterSpacing: "0.06em"
  brand:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
  hero-context:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 400
  diagnostic:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(1.35rem, 2.35vw, 2.3rem)"
    fontWeight: 600
    letterSpacing: "-0.025em"
  diagram-tag:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    letterSpacing: "0.12em"
  decision-title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
  technical:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "clamp(1rem, 1.3vw, 1.22rem)"
    fontWeight: 400
  toggle:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 700
  closing:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(3rem, 6.1vw, 6rem)"
    fontWeight: 600
  action:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)"
    fontWeight: 600
  footer:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 400
  body-mobile:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "17px"
    fontWeight: 400
  display-mobile:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "2.65rem"
    fontWeight: 600
  diagram-tag-mobile:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "0.62rem"
    fontWeight: 700
spacing:
  gutter: "5vw"
  section-y: "12vh"
  section-y-compact: "9vh"
components:
  link-hero:
    textColor: "{colors.amber}"
    padding: "0.9rem 0 0"
    width: "min(100%, 22rem)"
  link-closing:
    textColor: "{colors.amber}"
    padding: "0 0 0.3rem"
  link-header:
    padding: "0 0 0.2rem"
  mode-toggle:
    textColor: "{colors.teal}"
    padding: "0 0 0.25rem"
  slider-input:
    width: "100%"
    height: "100%"
---

# Design System: Mareas Asesores · Bastionado de redes

## Overview

**Creative North Star: "La lámina de mareas"**

La superficie es una lámina editorial de scroll continuo, no un panel de seguridad. La red aparece como un dibujo manipulable: dos capas SVG se recortan con un deslizador y las tres VLAN se leen como notas al margen, no como etiquetas decorativas. La fotografía del mar ocupa la mitad derecha de la portada a sangre; la otra mitad queda en tinta para una sola frase en grande, una línea de contexto y un enlace al pie.

La densidad es baja y la jerarquía se apoya en el hueco: reglas finas, sangrías grandes y filas de texto en lugar de contenedores. Se rechazan explícitamente el hero de dashboard y la fila de tarjetas; tampoco hay cajitas ni kicker sobre el titular. El ámbar es la única marca, y aparece de forma escasa: sobre tinta en los enlaces de acción y sobre papel solo en su variante oscurecida, dentro del diagrama.

El movimiento es de aparición y de manipulación, nunca de coreografía decorativa. Los bloques entran con un desplazamiento y un desenfoque breves al cruzar el umbral del observador; el texto de medida cambia de modo con un fundido; el tirador responde al dedo o al teclado. Todo eso vive en React, un `IntersectionObserver` y un `input[type=range]`: no hay otra capa de interacción.

**Key Characteristics:**
- Lámina de scroll continuo, derivada de un seed y no un dashboard.
- Una sola marca ámbar sobre tinta; variante oscurecida para anotaciones sobre papel.
- Reglas finas y sangrías grandes en lugar de cajas.
- La red se manipula; las VLAN se explican como notas al margen.
- Fotografía real a sangre y tipografías autoc-hosteadas.

## Colors

Tinta y paper sostienen la lámina; el agua separa, el teal señala decisiones y el ámbar marca el único acento.

### Primary
- **Ámbar** (`colors.amber`): marca única sobre tinta. Aparece en los enlaces de acción, en el subrayado de la cabecera al pasar el cursor, en la selección, en el contorno de foco y en el divisor del deslizador.
- **Ámbar de anotación** (`colors.amber-on-paper`): la misma marca oscurecida para que la anotación sobre papel sea legible; se usa en el texto y el trazo que acotan el acceso de la asesoría dentro del diagrama.

### Secondary
- **Agua** (`colors.water`): regla de apertura de los enunciados sobre tinta y cierre de la página; nunca rellena superficies.
- **Teal** (`colors.teal`): color funcional sobre papel. Nombra las decisiones en la red posterior, el interruptor de modo y los verbos de la sección «Por qué la cambiamos».

### Neutral
- **Tinta** (`colors.ink`): fondo de portada, de contexto y de cierre; también color del texto sobre papel en el bosquejo.
- **Papel** (`colors.paper`): fondo de las secciones de red y medidas, y texto sobre tinta.
- **Tinta de papel** (`colors.paper-ink`): cuerpo de las secciones claras y estado de hover del interruptor.
- **Apagado sobre tinta** (`colors.muted`): contexto de portada y párrafo de cierre.
- **Apagado sobre papel** (`colors.paper-muted`): encabezados de sección, rótulos de medida y nota de lo pendiente.
- **Línea sobre papel** (`colors.line-paper`): reglas de un píxel entre filas y bloques.
- **Línea sobre tinta** (`colors.line-ink`): reglas de un píxel sobre fondo oscuro.
- **Papel del diagrama** (`colors.diagram-bg`): fondo neutro del escenario de la red.
- **Regla del diagrama** (`colors.diagram-rule`): líneas de separación entre las tres zonas.
- **Bosquejo** (`colors.diagram-before`): trazo y voz de la red anterior, deliberadamente apagado.
- **Técnico** (`colors.technical-ink`): texto del modo técnico sobre papel.
- **Pie** (`colors.footer-ink`): texto del crédito final sobre tinta.
- **Barra de desplazamiento** (`colors.scrollbar-thumb`): pulgar del scroll del navegador.

### Named Rules
**The One Mark Rule.** El ámbar es la única marca y nunca se convierte en fondo de caja; sobre papel se usa su variante oscurecida.

**The Waterline Rule.** El agua abre y cierra los bloques sobre tinta; el teal nombra las decisiones sobre papel. Cada color tiene un lado de la lámina.

## Typography

**Display Font:** Bricolage Grotesque, autoc-hosteada y con `sans-serif` de respaldo (`typography.display`).
**Body Font:** Source Sans 3, autoc-hosteada y con `sans-serif` de respaldo (`typography.body`).

**Character:** La display es ancha, directa y sin aspavientos: dice la frase que la jefa diría en voz alta. La body es neutra y se reserva para contexto, modo técnico y controles; el contraste entre las dos es el que jerarquiza, no el tamaño solamente. Junto a los cinco roles principales, el frontmatter documenta los pasos auxiliares que el build usa de verdad: cabecera, marca, contexto de portada, diagnóstico, rótulos de diagrama, título de decisión, modo técnico, interruptor, cierre, acción, pie y sus variantes móviles.

### Hierarchy
- **Display** (`typography.display`): el h1 de la portada y el h2 de cierre; el cierre lleva además un tamaño propio mayor (`clamp(3rem, 6.1vw, 6rem)`). Frases con saldo natural y sin texto por encima.
- **Headline** (`typography.headline`): los h2 de «Lo que encontramos», «La red, antes y después» y «Lo que hemos hecho».
- **Title** (`typography.title`): las tres líneas del diagnóstico, los enunciados de medida en modo sencillo y el texto de apertura del deslizador.
- **Body** (`typography.body`): contexto de portada, encabezados de sección, filas de decisión y modo técnico, este último con cifras tabulares.
- **Label** (`typography.label`): nombres de medida y rótulos «Antes» / «Después» del diagrama.

### Named Rules
**The Natural Sentence Rule.** El titular es la frase de siempre dicha en voz alta: sin texto previo, sin analogía de dos líneas y sin lenguaje técnico en la capa sencilla.

## Layout

La página es una sola columna de secciones que se suceden sin tarjetas. La portada mide `100svh` y se parte en dos columnas del 55 % y el 45 %: texto sobre tinta a la izquierda, fotografía a sangre a la derecha. La cabecera es absoluta y no ocupa altura de flujo. Las secciones comparten el sangrado lateral de `spacing.gutter` y el alto vertical de `spacing.section-y`, que baja a `spacing.section-y-compact` en pantallas pequeñas.

El escenario de la red se centra con un ancho máximo de `1240px` y una relación de `1200 / 620`; encima va un `input[type=range]` transparente que cubre toda el área. Las filas de decisión y de medida usan dos columnas de `11rem` y `1fr` con separaciones de `2rem` y `3rem` respectivamente. Los textos se cortan con medidas de lectura explícitas: `42ch` en el contexto de portada, `28ch` en el encabezado de sección, `58ch` en el diagnóstico, `36ch` en la medida sencilla, `66ch` en la técnica y `70ch` en las decisiones.

A `900px` la portada apila la imagen debajo del texto, el encabezado de sección deja de ir en dos extremos y las filas de dos columnas pasan a una. A `520px` el cuerpo baja a `17px`, el h1 se fija en `2.65rem`, los h2 en `2.5rem` y las secciones se aprietan. Con `prefers-reduced-motion` se apagan el scroll suave y todas las animaciones de entrada.

## Elevation & Depth

No hay ni una sola sombra en el build: es un sistema plano por decisión. La profundidad viene del contraste entre tinta y papel, de la regla de un píxel que separa filas y del recorte del deslizador, que deja ver una capa u otra. El foco se hace visible con contornos: ámbar de dos píxeles con separación de cuatro en los enlaces y en el interruptor, y teal de dos píxeles con la misma separación cuando el deslizador recibe el foco.

## Shapes

La forma por defecto es el ángulo recto: no hay radio en secciones, botones ni escenario; el propio rótulo de medida es una sola fila subrayada, no una caja. Las únicas curvas son el tirador del deslizador, un círculo de `30px` con borde de dos píxeles, y el interruptor, una pista en forma de píldora de `999px` con un knob circular de `12px`. Las reglas son de un píxel salvo la de agua, de dos, y el subrayado del enlace de cierre, también de dos.

## Components

### Enlaces de acción
- **Shape:** una regla por encima en la portada, una por debajo en el cierre; sin caja ni radio.
- **Primary:** texto en ámbar (`typography.body` en la portada y tamaño propio en el cierre), flecha de texto al final y alineación a la izquierda.
- **Hover / Focus:** el texto pasa a papel y la flecha del cierre se desplaza; el foco muestra el contorno ámbar descrito en Elevation.

### Cabecera
- **Style:** enlaces sin subrayado salvo una regla inferior de un píxel en «Diapositivas»; la marca usa la display en neo-gruesa y el resto va en mayúsculas con espaciado.
- **State:** al pasar el cursor, la regla y el texto del enlace pasan a ámbar. Es absoluta y se mantiene legible sobre la tinta de la portada.

### Interruptor de medida
- **Shape:** texto con regla inferior y, a la izquierda, pista en píldora con knob circular; sin fondo.
- **Color:** teal sobre papel en reposo, tinta de papel en hover; el knob se desplaza con el estado `aria-pressed`.
- **State:** al activarlo el texto sencillo desaparece y entra el técnico con un fundido; el cambio es una sustitución, no una adición.

### Deslizador de red
- **Style:** un `input[type=range]` invisible que cubre el escenario; el cursor es de redimensionado horizontal y el valor se anuncia como porcentaje del «después».
- **State:** el divisor ámbar y su tirador siguen el valor; al recibir foco, el escenario muestra un contorno teal. Funciona con teclado porque es un control nativo con etiqueta y `aria-valuetext`.

### Fila de medida
- **Corner Style:** sin radio; dos columnas partidas por una regla superior.
- **Background:** papel, sin relleno propio ni sombra.
- **Border:** una regla inferior de `colors.line-paper`.
- **Internal Padding:** `2.6rem` arriba y abajo, separación de `3rem` entre rótulo y texto.
- **Behavior:** entra con desplazamiento al hacerse visible; las pares lo hacen con un recorrido mayor.

### Diagrama antes / después
- **Style:** dos capas SVG superpuestas sobre el fondo del escenario; la capa posterior se recorta con `clip-path` según el valor del deslizador.
- **Annotation:** las VLAN son texto dentro del dibujo, con el bosquejo apagado a la izquierda y el teal a la derecha; el ámbar oscurecido acota la excepción del FTP.
- **Reading:** una frase resume la red anterior y otra la posterior; los rótulos «Antes» y «Después» van en la esquina superior.

## Do's and Don'ts

### Do:
- **Do** mantener la portada en dos mitades con la fotografía a sangre a la derecha y el h1 en la izquierda sobre tinta.
- **Do** usar el agua para separar bloques sobre tinta y el teal para nombrar decisiones sobre papel.
- **Do** dejar que el deslizador gobierne la lectura de la red; las VLAN se explican al margen del dibujo.
- **Do** mantener el modo técnico como sustitución del sencillo, con el texto cambiando de familia y de ancho de lectura.
- **Do** escribir lo pendiente con la misma voz que lo hecho, separado por una regla.

### Don't:
- **Don't** convertir la página en un panel de seguridad ni disponer los contenidos en una fila de tarjetas.
- **Don't** añadir cajas de fondo, radios ni sombras: la jerarquía la hacen la regla y el hueco.
- **Don't** poner texto de apoyo por encima del h1 de la portada: la frase abre directamente.
- **Don't** usar el ámbar claro sobre papel para texto; para eso existe la variante oscurecida del diagrama.
- **Don't** presentar la medida pendiente como terminada ni disfrazar el FTP en claro como resuelto.
- **Don't** introducir otra biblioteca de interacción: el build se sostiene con React, `IntersectionObserver` y el input de rango.
