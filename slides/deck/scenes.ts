import type { SceneDef } from 'beatdeck';

/**
 * The talk's beat map: scenes → beats. One click = one beat.
 * `ref` = where it comes from in the source, `source` = what the source says, `note` = speaker cue
 * (the presenter view shows all three; the audience never does).
 */
export const SCENES: SceneDef[] = [
  {
    id: '01', title: 'POR QUÉ',
    beats: [
      {
        name: 'standby',
        note: 'Pantalla en negro mientras llegan. El primer clic empieza. No digas nada todavía.',
      },
      {
        name: 'title',
        note: 'Presentación sencilla: esto es lo que hemos hecho y lo que queremos que opinemos antes de tocar la oficina real.',
      },
      {
        name: 'robo',
        ref: 'propuesta.md · Medida «Cifrado de disco (LUKS) en portátil y servidor»',
        source: 'En septiembre se robó un portátil y se desconoce si leyeron los datos.',
        note: 'Empieza por el susto, sin tecnicismos. Septiembre es del documento; no añadas detalles.',
      },
      {
        name: 'acceso',
        ref: 'diagnostico.md · Bloque 2 «¿Qué carpetas se comparten, y con quién?»',
        source: 'Samba comparte [clientes] con guest ok = Yes y read only = No: la configuración permite entrar sin contraseña a cualquiera que llegue al puerto 445.',
        note: 'Frase clave: cualquiera que estuviera en la red podía ver los documentos de los clientes.',
      },
    ],
  },
  {
    id: '02', title: 'ANTES',
    beats: [
      {
        name: 'una-red',
        ref: 'diagnostico.md · Bloques 1–4; propuesta.md · §1.1',
        source: 'Todos los dispositivos quedan conectados a la misma infraestructura interna. El switch muestra la VLAN 1 activa. La asesoría fiscal está fuera y entra por FTP (21 y 40000-40050).',
        note: 'Señala el dibujo: servidor, puestos, impresoras y el móvil del cliente, todos juntos. La asesoría entra desde fuera por FTP.',
      },
      {
        name: 'movil-llega',
        ref: 'diagnostico.md · Bloque 4 «Desde ese móvil, ¿se llega al servidor?»',
        source: 'Servidor: Sí. Impresoras: No. Router: Sí. Internet: Sí.',
        note: 'Éste es el ejemplo que entendemos todos: el móvil de un cliente en la sala de espera podía llegar al servidor.',
      },
    ],
  },
  {
    id: '03', title: 'LÍMITES',
    beats: [
      {
        name: 'trabajar-igual',
        ref: 'propuesta.md · §1.2; aprendizaje.md · «Riesgos aceptados por el cliente»',
        source: 'Para cumplir con la premisa de no alterar la forma de trabajar de clientes externos, mantendremos el protocolo FTP que utiliza la Asesoría Fiscal.',
        note: 'Primera restricción: la gestoría tiene que seguir trabajando como siempre.',
      },
      {
        name: 'sin-hardware',
        ref: 'aprendizaje.md · «Segmentación de redes»; propuesta.md · «Configurar la VLAN 30 en el switch y router existentes»',
        source: 'Para separar la infraestructura sin comprar hardware adicional, hemos utilizado VLAN y hemos hecho llegar todas ellas al mismo switch y al router mediante un enlace troncal.',
        note: 'Segunda restricción: no comprar equipos. Usamos el switch y el router que ya había.',
      },
      {
        name: 'sin-cambiar-asesoria',
        ref: 'propuesta.md · §4 «Descarte 2»; decisiones.md · §6.4',
        source: 'Modificar el protocolo de FTP a SFTP exigiría que la Asesoría Fiscal externa cambiase sus programas o flujos de trabajo, lo cual vulnera la regla de impacto limitado dictada por el cliente.',
        note: 'Tercera restricción: no pedir a la asesoría que cambie su programa. Por eso el FTP se queda, acotado.',
      },
    ],
  },
  {
    id: '04', title: 'DESPUÉS',
    beats: [
      {
        name: 'tres-redes',
        ref: 'propuesta.md · §§1.1–1.4',
        source: 'Tres redes locales virtuales (VLAN): VLAN 10 dedicada al servidor, VLAN 20 para la plantilla (puestos e impresoras) y VLAN 30 para la red inalámbrica de los clientes en la sala de espera.',
        note: 'Los nombres de VLAN no salen en pantalla: servidores, plantilla y clientes. El cambio es de sitio, no de programas.',
      },
      {
        name: 'clientes-internet',
        ref: 'propuesta.md · §1.4; verificacion.md · §6.3',
        source: 'Se deniega cualquier intento de conexión desde la VLAN 30 (Clientes) hacia la red de los empleados o hacia el servidor. Los clientes solo dispondrán de salida a Internet.',
        note: 'El móvil del cliente sigue navegando, pero ya no ve la oficina. Antes sí llegaba al servidor (beat 2.2).',
      },
    ],
  },
  {
    id: '05', title: 'REGLAS',
    beats: [
      {
        name: 'asesoria-ip',
        ref: 'decisiones.md · D-H1 y §6.4; verificacion.md · §4.1 y §6.5',
        source: 'Se mantienen FTP y el modo pasivo, pero las redirecciones Destination NAT del router se limitan al origen 192.168.122.50. Las direcciones externas distintas de 192.168.122.50 no pueden usar las redirecciones FTP.',
        note: 'La asesoría no nota nada: su dirección es la conocida. Cualquier otra dirección se queda fuera. No menciones comandos.',
      },
      {
        name: 'plantilla-web-carpeta',
        ref: 'propuesta.md · §1.4; decisiones.md · §6.3; verificacion.md · §6.4',
        source: 'La plantilla (VLAN 20) tiene permitido el acceso a Internet y la comunicación con el servidor (VLAN 10) restringida a los puertos 445 (Samba) y 80 (HTTP).',
        note: 'La plantilla sigue entrando a la web interna y a la carpeta; el resto de puertos del servidor quedan cerrados para ella.',
      },
      {
        name: 'wifi-oficina',
        ref: 'propuesta.md · §1.4; verificacion.md · §6.3',
        source: 'Se deniega cualquier intento de conexión desde la VLAN 30 (Clientes) hacia la red de los empleados o hacia el servidor.',
        note: 'Regla del wifi de sala de espera: sale a Internet, pero no ve la oficina ni el servidor.',
      },
    ],
  },
  {
    id: '06', title: 'DOCUMENTOS',
    beats: [
      {
        name: 'cifrar-portatil',
        ref: 'decisiones.md · §1.2; verificacion.md · §1.2; propuesta.md · Medida LUKS',
        source: 'Se ha realizado la instalación de Ubuntu Desktop 22.04.5 LTS … seleccionado el uso de LVM y el cifrado mediante LUKS … preparada para proteger la información en caso de pérdida o acceso no autorizado.',
        note: 'El disco del portátil va cerrado con clave. Si lo roban, quien se lo lleve no puede leer los documentos.',
      },
      {
        name: 'cifrar-servidor',
        ref: 'decisiones.md · §1.1; verificacion.md · §1.1',
        source: 'Se ha creado una partición de 4 GB, se ha protegido mediante cifrado LUKS2 … y se ha montado en el directorio /clientes.',
        note: 'Lo mismo para la parte del servidor donde están los documentos. Si se llevan el disco, tampoco pueden leerlo. Ojo: el montaje actual es temporal.',
      },
      {
        name: 'clave-solo-editar',
        ref: 'decisiones.md · D-L7; verificacion.md · §§3.1.3–3.1.4',
        source: 'Contraseña solo para editar, para la consola y para las entradas no habituales. El arranque normal queda libre. Servidor: se reinicia sin tocar nada y llega solo al login.',
        note: 'La clave del arranque no molesta: el equipo arranca normal. Solo se pide si alguien intenta cambiar cómo arranca.',
      },
    ],
  },
  {
    id: '07', title: 'DÍA A DÍA',
    beats: [
      {
        name: 'laura',
        ref: 'propuesta.md · Medida LUKS, «A quién afecta»; verificacion.md · §1.2',
        source: 'A Laura (deberá poner la clave al encender el portátil) … El resultado es una instalación de Ubuntu con almacenamiento cifrado.',
        note: 'Una sola clave nueva para Laura, al encender. Antes del cifrado el portátil no pedía nada (diagnóstico, Bloque 3).',
      },
      {
        name: 'plantilla',
        ref: 'propuesta.md · §3 «Autenticación personal en Samba»; §7.3 de verificacion.md',
        source: 'Se retirará el acceso libre a la carpeta de clientes y se eliminará la cuenta compartida. A toda la plantilla de asesores que accede diariamente al servidor.',
        note: 'La plantilla pone su usuario y contraseña para entrar a la carpeta. Antes entraba cualquiera sin clave.',
      },
      {
        name: 'servidor-solo',
        ref: 'decisiones.md · D-L5 y D-L7; verificacion.md · §3.1.4',
        source: 'Sin contraseña de arranque en el servidor. Tras un reinicio o un corte de luz, el servidor se quedaría parado hasta que alguien la escribiera, y la gestoría no podría trabajar.',
        note: 'El servidor arranca solo, incluso tras un corte de luz: nadie tiene que escribir una clave para que siga trabajando.',
      },
      {
        name: 'merece-la-pena',
        ref: 'propuesta.md · §3 «Por qué merece la pena» de la medida LUKS',
        source: 'Es la única garantía técnica que cumple el requisito de que «si nos roban otro portátil [o los discos del servidor], nadie puede leer lo que hay dentro».',
        note: 'Cierre del bloc: son pocas molestias y son las que permiten decir que, si roban el equipo, no leen los documentos.',
      },
    ],
  },
  {
    id: '08', title: 'COMPROBADO',
    beats: [
      {
        name: 'movil-bloqueado',
        ref: 'verificacion.md · §6.3',
        source: 'Movil-cliente> ping 192.168.1.10 → 192.168.1.10 icmp_seq=1 timeout … ¿Sigue funcionando tras reiniciar?: Sí.',
        note: 'Probado desde la maqueta: el móvil de cliente ya no alcanza el servidor. Tampoco alcanza los puestos.',
      },
      {
        name: 'asesoria-si-otra-no',
        ref: 'verificacion.md · §4.1 pruebas 1 y 2; §6.5',
        source: 'La dirección autorizada recibió el banner de vsftpd … Se asignó temporalmente 192.168.122.99/24 … Resultado: la conexión fue rechazada con Connection refused.',
        note: 'La asesoría, desde su dirección, entra. Probamos con otra dirección y no entra. El FTP sigue sin cifrar: se dice en el bloque siguiente.',
      },
      {
        name: 'carpeta-funciona',
        ref: 'verificacion.md · §2.1.4; §6.4',
        source: 'Con Samba ya confinado, se crea una carpeta en el recurso de clientes, se lista y se borra sin errores … Tras reiniciar el servidor se repitieron las pruebas con el mismo resultado.',
        note: 'La comprobación importante para la jefa: la carpeta de clientes sigue funcionando igual, también después de reiniciar.',
      },
      {
        name: 'arranque-protegido',
        ref: 'verificacion.md · §3.1.3 y §3.1.4',
        source: 'Al intentar editar una entrada (e) … GRUB pide usuario y contraseña … Servidor: se reinicia sin tocar nada y llega solo al login.',
        note: 'Si alguien intenta cambiar el arranque, pide clave. Para arrancar, no. Probado en los dos equipos.',
      },
      {
        name: 'nota-exposicion',
        ref: 'decisiones.md · D-L3 y D-L4; verificacion.md · §2.1.3',
        source: 'Nivel de exposición, antes y después: 9.6 UNSAFE → 6.0 MEDIUM.',
        note: 'Esto es una nota técnica, pero es la prueba de que la carpeta está mejor protegida. Baja de 9,6 a 6,0; no decimos que sea 0 porque la gestoría tiene que seguir trabajando.',
      },
    ],
  },
  {
    id: '09', title: 'QUEDA',
    beats: [
      {
        name: 'servicios-pendientes',
        ref: 'responsables.md · fila «Inventariar, reducir y acotar los servicios del servidor»; verificacion.md · §7',
        source: 'Estado: Pendiente de ejecutar y verificar en GNS3.',
        note: 'Primero lo que queda: quitar servicios que no hacen falta en el servidor. Es lo único que figura como pendiente en la tabla de responsables.',
      },
      {
        name: 'ftp-sin-cifrar',
        ref: 'propuesta.md · §4 «Descarte 2»; decisiones.md · §6.4; aprendizaje.md · «Riesgos que quedan abiertos»',
        source: 'Al mantener FTP, las transferencias entre el servidor y la asesoría siguen viajando sin cifrado. Este riesgo se asume, pero se acota el vector de ataque externo permitiendo la conexión exclusivamente desde la IP estática de la asesoría.',
        note: 'Riesgo asumido: lo que se envía a la asesoría va sin cifrar. Cambiarlo obligaría a la asesoría a cambiar su programa, y eso estaba prohibido. Queda acotado a su dirección.',
      },
      {
        name: 'usb-permitido',
        ref: 'propuesta.md · §4 «Descarte 1»; aprendizaje.md · «Riesgos aceptados por el cliente»',
        source: 'No se bloquean las unidades extraíbles mediante GPO de Windows porque se asume (a falta de confirmación) que los clientes pueden aportar documentación fiscal o certificados digitales en memorias USB durante la campaña de la renta.',
        note: 'También seguimos permitiendo USB, por si traen documentos en la campaña de la renta. Queda como riesgo aceptado mientras no haya confirmación por escrito.',
      },
      {
        name: 'bios-lab',
        ref: 'decisiones.md · D-L5 y D-L6; verificacion.md · §3.1.1; aprendizaje.md · «Riesgos que quedan abiertos»',
        source: 'SeaBIOS no permite contraseña de setup, así que en el laboratorio esta medida queda documentada para el equipo real … Sin Secure Boot, en el laboratorio no se verifica la firma del gestor de arranque.',
        note: 'En las máquinas de pruebas no se pudo poner la clave de BIOS ni Secure Boot: usan una BIOS antigua que no lo permite. Queda preparado para los equipos de verdad.',
      },
      {
        name: 'portatil-encendido',
        ref: 'decisiones.md · D-L8; aprendizaje.md · «Riesgos que quedan abiertos»',
        source: 'Robar el portátil encendido con la sesión abierta → Ninguna de estas capas. Hace falta el bloqueo automático de pantalla. Riesgo abierto.',
        note: 'Último límite, dicho con claridad: si roban el portátil encendido y con la sesión abierta, estas protecciones no sirven. Haría falta bloquear la pantalla solo.',
      },
      {
        name: 'opinion',
        ref: 'briefing (the deck is a proposal to the boss before implementation)',
        source: 'La presentación se hace para saber qué le parece la propuesta ANTES de llevarla a cabo.',
        note: 'Pregunta abierta a la jefa. Cierra aquí la presentación. Espera respuesta antes de seguir. No anuncies una fecha: no hay ninguna en los documentos.',
      },
    ],
  },
];
