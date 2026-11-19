# Decisiones importantes

## Decisión 1: Segmentación de la red mediante tres VLAN

### Contexto

Inicialmente, todos los dispositivos ocupaban la misma red plana `192.168.1.0/24`. Los clientes de la sala de espera podían alcanzar equipos de la gestoría y el servidor, mientras que servidores, puestos e impresoras compartían el mismo dominio de difusión.

### Opciones consideradas

1. Mantener la red plana sin cambios.
2. Separar la infraestructura mediante varias redes físicas.
3. Crear redes lógicas mediante VLAN y gobernar la comunicación entre ellas con un router y un firewall.

La opción de nuevas redes físicas se descartó porque el cliente exige no incorporar hardware nuevo.

### Decisión

Se han creado tres VLAN:

| VLAN | Función | Red |
|---|---|---|
| VLAN 10 | Servidores y gestión | `192.168.1.0/28` |
| VLAN 20 | Plantilla, puestos e impresoras | `192.168.1.64/26` |
| VLAN 30 | Clientes de la sala de espera | `192.168.1.128/26` |

El switch configura puertos de acceso para cada zona y un enlace troncal hacia el router MikroTik. El router proporciona las puertas de enlace virtuales y aplica las reglas de seguridad.

### Consecuencias

- Los clientes quedan aislados de los servidores y de la plantilla.
- El equipo administrador debe mantener las VLAN y las reglas de enrutamiento.
- La red puede crecer hasta 40 personas sin rehacer la infraestructura física.
- Las rutas y reglas deben comprobarse para no bloquear el trabajo cotidiano.

## Decisión 2: Limitar el acceso externo por FTP

### Contexto

El servicio FTP del servidor debe seguir utilizándose por la Asesoría Fiscal, mientras que el puerto 21 y el rango pasivo `40000-40050` estaban anteriormente abiertos desde el exterior sin filtrar el origen.

### Opciones consideradas

1. Mantener las redirecciones abiertas a cualquier dirección externa.
2. Bloquear completamente el FTP externo.
3. Mantener FTP, pero permitirlo solo desde la dirección conocida de la Asesoría Fiscal.
4. Sustituir FTP por SFTP.

La opción 2 impediría el trabajo habitual del cliente externo. La opción 4 se descartó porque exigiría cambiar los programas y los procedimientos de la asesoría, aumentando la molestia y el riesgo de interrupción.

### Decisión

Se mantienen el FTP y el modo pasivo, pero se acotan las reglas Destination NAT del router a la dirección origen `192.168.122.50`.

```routeros
/ip firewall nat
add action=dst-nat chain=dstnat dst-port=21 in-interface=ether1 protocol=tcp src-address=192.168.122.50 to-addresses=192.168.1.10
add action=dst-nat chain=dstnat dst-port=40000-40050 in-interface=ether1 protocol=tcp src-address=192.168.122.50 to-addresses=192.168.1.10
```

Además, se permiten las sesiones establecidas y las redirecciones NAT necesarias en la cadena `forward`.

### Consecuencias

- La Asesoría Fiscal puede continuar trabajando.
- Un tercero externo que no utilice la IP autorizada no puede alcanzar las redirecciones FTP.
- FTP continúa transmitiendo datos sin cifrado; el riesgo se acepta temporalmente y queda reducido mediante la restricción de origen.
- Si la dirección pública de la asesoría cambia, deberá actualizarse la regla del router.

## Decisión 3: Desactivar y limitar los servicios de administración del router

### Contexto

El MikroTik ofrecía servicios de administración mediante Telnet, FTP, API, API-SSL, WWW, SSH y Winbox. Algunos emplean protocolos en texto claro o ofrecen acceso innecesario desde Internet.

### Opciones consideradas

1. Mantener todos los servicios activos.
2. Desactivar servicios innecesarios o inseguros.
3. Mantener los servicios necesarios, pero limitar su acceso a las redes internas de gestión.

### Decisión

Se desactivaron Telnet, FTP, API y API-SSL. Los servicios necesarios se limitaron a las direcciones de las VLAN 10 y 20:

```routeros
/ip service
set www address=192.168.1.0/28,192.168.1.64/26
set ssh address=192.168.1.0/28,192.168.1.64/26
set winbox address=192.168.1.0/28,192.168.1.64/26
```

### Consecuencias

- Se reduce la superficie de administración expuesta desde Internet y desde la red de clientes.
- Los administradores podrán gestionar el router desde VLAN 10 o VLAN 20.
- Debe verificarse que las direcciones administrativas usadas corresponden a esas subredes.

## Decisión 4: Reparto de direcciones por VLSM

### Contexto

La antigua red única tenía `192.168.1.0/24`, pero las zonas no tenían el mismo número de equipos. También era necesario dejar margen para crecer sin reconstruir la red.

### Opciones consideradas

1. Crear tres `/24`.
2. Mantener una única `/24`.
3. Crear subredes con máscaras distintas según las necesidades de cada zona.

### Decisión

Se empleó VLSM:

- `/28` para la VLAN 10, por necesitar menos direcciones.
- `/26` para la VLAN 20 y la VLAN 30, al necesitar grupos de 64 direcciones.

Las puertas de enlace se asignaron a `192.168.1.1`, `192.168.1.65` y `192.168.1.129`.

### Consecuencias

- Se aprovechan mejor las direcciones disponibles.
- Las VLAN tienen capacidad suficiente para una ampliación razonable.
- Los equipos de gestión y los servidores deben configurar máscaras y puertas de enlace nuevas.

## Decisión 5: Controlar únicamente el tráfico necesario entre VLAN

### Contexto

Los empleados necesitan comunicarse con el servidor para trabajar, pero el resto del tráfico entre VLAN no es necesario.

### Opciones consideradas

1. Permitir todo el tráfico entre segmentos.
2. Bloquear todas las comunicaciones entre VLAN.
3. Permitir solamente los puertos necesarios y bloquear el resto.

### Decisión

Desde la VLAN 20 se permite el acceso al servidor por:

- TCP/80 para HTTP.
- TCP/445 para Samba.

El resto del tráfico desde empleados hacia el servidor se bloquea. Desde la VLAN 30 se bloquea el acceso tanto a la VLAN 10 como a la VLAN 20.

### Consecuencias

- Se limita el movimiento lateral desde puestos o equipos de clientes.
- La plantilla conserva el acceso a los servicios diarios necesarios.
- Las reglas establecidas y relacionadas deben permitir también las respuestas legítimas.
- Deben verificarse impresoras, puestos, servidor y cliente de sala de espera antes de dar por finalizada la medida.

## Decisión 6: Cifrado de discos con LUKS

### Contexto

El portátil robado contenía datos de clientes y no tenía cifrado ni protección previa al arranque. El servidor guardaba los documentos en una partición sin cifrado.

### Opciones consideradas

1. Proteger únicamente el sistema operativo.
2. Usar cifrado completo del disco.
3. Cifrar solamente la partición que contiene los documentos de clientes.
4. No cifrar y asumir el riesgo.

### Decisión

Se propone cifrar el portátil con LUKS y cifrar en el servidor la partición o volumen que contiene los documentos de clientes, ubicada en `/srv/samba/clientes`.

El portátil deberá solicitar la clave al arrancar y el administrador deberá desbloquear los datos del servidor tras un reinicio físico.

### Consecuencias

- Si se extrae un disco o se roba el portátil, los datos no podrán leerse sin la clave.
- Se añade una molestia limitada al arranque y al reinicio administrativo.
- Es imprescindible proteger adecuadamente las claves de recuperación.
- La medida debe verificarse arrancando desde un entorno externo como Kali y comprobando que la partición no puede montarse sin la clave.

## Decisión 7: Configurar la BIOS/UEFI para impedir arranques externos

### Contexto

El portátil no pedía credenciales antes del arranque y permitía cargar otro sistema desde un dispositivo externo.

### Opciones consideradas

1. Proteger solamente la cuenta del sistema operativo.
2. Configurar contraseña en BIOS/UEFI y deshabilitar arranque externo.
3. Utilizar cifrado sin controlar el arranque.

### Decisión

Se propone definir una contraseña administrativa de BIOS/UEFI, fijar el disco interno como primer dispositivo y deshabilitar USB y arranque PXE.

El cifrado de disco actúa como segunda capa para proteger los datos si se extrae físicamente el almacenamiento.

### Consecuencias

- Dificulta arrancar con Linux Live u otros sistemas externos.
- No impide todos los ataques físicos: una extracción del hardware, el borrado de la CMOS o una contraseña maestra mal gestionada pueden dejar abierta la protección.
- La contraseña debe comunicarse de forma segura al administrador y a quien pueda necesitar recuperarlo.