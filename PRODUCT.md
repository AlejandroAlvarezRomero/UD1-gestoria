# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React. El usuario pidió React expresamente; Vite es la elección delegada para el andamiaje local. Beatdeck vive en una carpeta propia con su proyecto React/Vite.

## Users

La usuaria principal es la jefa de Mareas Asesores. No usa lenguaje técnico y necesita entender, en lenguaje natural, qué fallaba, qué se ha cambiado, por qué y qué sigue pendiente antes de dar su visto bueno. Los evaluadores del módulo son una audiencia secundaria confirmada por el contexto del repositorio, no la audiencia principal de esta superficie.

## Product Purpose

Servir de portafolio y dossier visual del proyecto de bastionado: contextar el problema, comparar la red antes y después, explicar las medidas aplicadas y remitir a una presentación que apoya la conversación con la jefa. El éxito es que ella pueda explicar con sus palabras qué se ha hecho y decidir con confianza.

## Positioning

Un caso real de una gestoría con restricciones duras: no cambiar la forma de trabajar de la plantilla ni del FTP externo, no comprar hardware y no parar el servicio. La prueba no es una promesa genérica: es el contraste entre la red plana diagnosticada y la red segmentada implantada, con cada decisión ligada a una razón y a una comprobación.

## Operating Context

El trabajo se hizo sobre una maqueta GNS3: Router-operadora (MikroTik), Switch-oficina, srv-mareas (Ubuntu), puestos Windows, portátil de Laura, impresoras, móvil de cliente y Asesoría Fiscal externa. Las decisiones, implantaciones y verificaciones están en `diagnostico.md`, `propuesta.md`, `decisiones.md`, `verificacion.md`, `responsables.md` y `aprendizaje.md`, con capturas en `Images/`.

## Capabilities and Constraints

- Explicar cada medida en modo sencillo y permitir cambiarla a modo técnico con un interruptor; al cambiar, el texto sencillo desaparece.
- Comparar antes/después de la red con un deslizador.
- Mostrar las medidas más importantes con aparición progresiva al hacer scroll.
- Enlace a las diapositivas hechas con Beatdeck.
- Texto mínimo, sin cajitas ni exceso de contenedores; titulares sencillos y en lenguaje natural, sin analogías de dos líneas.
- Estado honesto: la medida «inventariar, reducir y acotar servicios» figura como pendiente en `responsables.md`; no se presentará como terminada.
- La Asesoría Fiscal sigue con FTP en claro porque cambiar a SFTP rompería su flujo: riesgo aceptado y acotado por IP.

## Brand Commitments

Nombre: Mareas Asesores. Voz: sencilla, directa y sin tecnicismos en la capa sencilla. El usuario fijó como restricciones de diseño: página visual y potente, poco texto, nada de cajitas, titulares naturales y posibilidad de buscar imágenes reales.

## Evidence on Hand

Documentación Markdown y capturas en `Images/` (incluido `cambio red.jpg`). Fotografía real descargada de Pexels (Rachel Claire, photo 5531700) en `public/images/marea-hero.jpg`; la generación de imágenes con IA falló por credenciales y no se reintentó. No hay testimonios, cifras de negocio ni logos de cliente: no inventarlos.

## Product Principles

1. La jefa entiende antes de que le sorprenda la interfaz.
2. Cada afirmación va ligada a una prueba del repositorio.
3. La restricción del cliente manda sobre la elegancia técnica.
4. Lo pendiente se dice, no se disfraza.
5. La imagen sostiene la historia; el texto solo la nombra.

## Accessibility & Inclusion

El deslizador y los interruptores deben ser utilizables con teclado, con etiquetas y estados visibles. El contraste debe bastar sin depender de color como único indicador.
