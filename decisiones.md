# 1. Cifrado del portatil y de la partición del servidor

## Configuración de un disco cifrado con LUKS en Ubuntu Server

### Objetivo de la decisión tomada

El objetivo es preparar el segundo disco del servidor Ubuntu Server para almacenar los documentos de los clientes.

Para ello, se realizarán las siguientes operaciones:

1. Identificar el segundo disco disponible.
2. Crear una partición que ocupe todo el disco.
3. Cifrar la partición mediante LUKS.
4. Desbloquear el volumen cifrado.
5. Crear un sistema de archivos EXT4.
6. Crear el directorio donde se montará la partición.
7. Montar la partición en el directorio `/clientes`.
8. Comprobar que todo funciona correctamente.

---

### Identificación de los discos

En primer lugar, comprobamos los discos disponibles en el servidor utilizando:

```bash
lsblk
```

![Identificación de discos](<Images/Server1.png>)

El resultado muestra dos discos principales:

- `/dev/vda`: disco principal del sistema, con un tamaño de 20 GB.
- `/dev/vdb`: segundo disco disponible, con un tamaño de 4 GB.

El disco que utilizaremos es `/dev/vdb`, ya que está vacío y destinado al almacenamiento de los documentos de clientes.

**Importante:** No debemos modificar `/dev/vda`, porque contiene el sistema operativo.

---

### Creación de la partición

Para crear una partición en el segundo disco, ejecutamos:

```bash
sudo fdisk /dev/vdb
```

![Creación de la partición](<Images/Server2.png>)

Una vez dentro de la herramienta `fdisk`, introducimos los siguientes comandos:

| Comando   | Función                                   |
| --------- | ------------------------------------------ |
| `n`     | Crear una partición nueva.                |
| `p`     | Seleccionar una partición primaria.       |
| `1`     | Asignar el número 1 a la partición.      |
| `Enter` | Utilizar el primer sector predeterminado.  |
| `Enter` | Utilizar el último sector predeterminado. |
| `w`     | Guardar los cambios y salir.               |

La partición creada ocupa todo el espacio disponible del disco, aproximadamente 4 GB.

Para comprobar que se ha creado correctamente, ejecutamos:

```bash
lsblk
```

El resultado esperado es:

```text
vdb       4G  disk
└─vdb1    4G  part
```

La nueva partición es `/dev/vdb1`.

---

### Instalación de las herramientas de cifrado

Para poder utilizar LUKS necesitamos instalar la herramienta `cryptsetup`.

Primero actualizamos los repositorios:

```bash
sudo apt update
```

Después instalamos el paquete:

```bash
sudo apt install cryptsetup -y
```

Esta herramienta permite cifrar y administrar volúmenes mediante LUKS.

---

### Cifrado de la partición mediante LUKS

Una vez instalada la herramienta, procedemos a cifrar la partición creada.

![Cifrado mediante LUKS](<Images/Server3.png>)

Ejecutamos:

```bash
sudo cryptsetup luksFormat /dev/vdb1
```

El sistema muestra una advertencia indicando que se sobrescribirán los datos existentes en la partición.

Para confirmar la operación, escribimos:

```text
YES
```

A continuación, introducimos una contraseña para proteger el volumen cifrado y la repetimos para verificarla.

Con este procedimiento, la partición `/dev/vdb1` queda cifrada mediante LUKS2.

---

### Desbloqueo del volumen cifrado

Después de cifrar la partición, debemos desbloquearla para poder utilizarla.

Ejecutamos:

```bash
sudo cryptsetup luksOpen /dev/vdb1 clientes_cifrado
```

El sistema solicita la contraseña que hemos establecido anteriormente.

Al introducirla correctamente, se crea el dispositivo:

```text
/dev/mapper/clientes_cifrado
```

Este dispositivo representa la partición cifrada una vez desbloqueada.

Para comprobar su estado, ejecutamos:

```bash
sudo cryptsetup status clientes_cifrado
```

El resultado debe indicar:

```text
/dev/mapper/clientes_cifrado is active.
```

Esto confirma que el volumen está desbloqueado y disponible.

---

### Creación del sistema de archivos EXT4

Ahora debemos crear un sistema de archivos en el volumen desbloqueado.

![Creación del sistema de archivos EXT4](<Images/Server4.png>)

Utilizaremos EXT4, un sistema de archivos habitual en Linux.

Ejecutamos:

```bash
sudo mkfs.ext4 /dev/mapper/clientes_cifrado
```

El comando crea el sistema de archivos y prepara el espacio para almacenar documentos.

Durante el proceso se generan las tablas de grupos, los inodos y el diario del sistema de archivos.

Al finalizar, el volumen está preparado para almacenar información.

---

### Creación del directorio de montaje

Para acceder al contenido del disco desde el sistema, necesitamos crear un directorio que servirá como punto de montaje.

En este ejercicio utilizaremos `/clientes`.

Ejecutamos:

```bash
sudo mkdir -p /clientes
```

Este comando crea el directorio si todavía no existe.

---

### Montaje de la partición cifrada

Una vez creado el directorio, montamos el volumen desbloqueado en `/clientes`.

Ejecutamos:

```bash
sudo mount /dev/mapper/clientes_cifrado /clientes
```

A partir de este momento, podemos utilizar `/clientes` para almacenar los documentos de los clientes.

Los datos escritos en este directorio se almacenan realmente en la partición cifrada.

---

### Comprobación del montaje

Para comprobar que la partición se ha montado correctamente, ejecutamos:

```bash
df -h
```

En nuestro caso, aparece una línea similar a esta:

```text
Filesystem                         Size  Used  Avail  Use%  Mounted on
/dev/mapper/clientes_cifrado       3.9G   24K   3.7G    1%  /clientes
```

Esto confirma que:

- El volumen tiene aproximadamente 3,9 GB disponibles.
- El sistema de archivos está funcionando.
- El punto de montaje es `/clientes`.

También podemos comprobar la estructura de los discos mediante:

```bash
lsblk
```

El resultado obtenido muestra:

```text
vdb                    4G  disk
└─vdb1                 4G  part
  └─clientes_cifrado   4G  crypt  /clientes
```

Esta estructura confirma que el disco tiene una partición cifrada con LUKS y que está montada correctamente.

Por último, podemos verificar el estado del cifrado con:

```bash
sudo cryptsetup status clientes_cifrado
```

---

## Instalación de Ubuntu Desktop con cifrado LUKS en QEMU (GNS3)

### Objetivo del ejercicio

El objetivo es instalar Ubuntu Desktop 22.04.5 LTS en una máquina virtual QEMU dentro del proyecto de GNS3, configurando el cifrado del disco mediante LUKS y creando una cuenta de usuario para Laura.

Durante el proceso se realizarán las siguientes operaciones:

1. Iniciar el instalador de Ubuntu.
2. Seleccionar el tipo de instalación.
3. Configurar el disco para utilizar LVM y cifrado LUKS.
4. Establecer una contraseña de seguridad para el cifrado.
5. Activar la clave de recuperación.
6. Crear la cuenta de usuario de Laura.
7. Completar la instalación de Ubuntu.
8. Comprobar el funcionamiento del sistema.

---

### Inicio de la instalación

Se inicia la máquina virtual Ubuntu Desktop desde el proyecto de GNS3 utilizando QEMU.

Una vez iniciado el instalador, se siguen los pasos de configuración inicial.

En la pantalla de selección de aplicaciones aparecen dos opciones:

- Instalación normal.
- Instalación mínima.

En este caso se selecciona:

**Instalación normal.**

![Selección de la instalación normal](<Images/Ubuntu1.png>)

Esta opción incluye navegador web, utilidades, paquete de oficina, juegos y reproductores multimedia.

En el apartado de otras opciones:

- No se selecciona la descarga de actualizaciones, ya que no hay conexión a Internet.
- La instalación de programas de terceros es opcional.

A continuación, se pulsa el botón «Continuar».

---

### Selección del tipo de instalación

![Selección del tipo de instalación](<Images/Ubuntu2.png>)

El instalador detecta que el equipo ya tiene instalado Ubuntu 22.04 LTS.

Se muestran diferentes opciones:

- Eliminar Ubuntu 22.04 LTS y reinstalar.
- Instalar Ubuntu 22.04.5 LTS junto a Ubuntu 22.04 LTS.
- Borrar disco e instalar Ubuntu.
- Más opciones.

Como queremos realizar una instalación limpia y configurar el cifrado del disco, seleccionamos:

**Borrar disco e instalar Ubuntu.**

Esta opción elimina los datos existentes en el disco seleccionado.

Es importante comprobar que se está seleccionando el disco virtual correcto antes de continuar.

---

### Configuración de las funcionalidades avanzadas

Dentro de la pantalla de tipo de instalación, accedemos a:

**Funcionalidades avanzadas...**

El instalador muestra las siguientes opciones:

- Ninguna.
- Utilizar LVM en la instalación de Ubuntu.
- Borrar disco y utilizar ZFS.
- Cifrar la instalación de Ubuntu por seguridad.

Para configurar el cifrado mediante LUKS, seleccionamos las siguientes opciones:

- Utilizar LVM en la instalación de Ubuntu.
- Cifrar la instalación de Ubuntu por seguridad.

Dejamos sin seleccionar:

- Borrar disco y utilizar ZFS.

### ¿Por qué utilizamos LVM y LUKS?

**LVM (Logical Volume Manager):**

Permite gestionar los volúmenes lógicos del almacenamiento y facilita la administración de las particiones.

**LUKS (Linux Unified Key Setup):**

Es un sistema de cifrado que protege los datos almacenados en el disco.

La combinación de LVM y LUKS permite instalar Ubuntu con el almacenamiento protegido mediante cifrado.

Una vez seleccionadas las opciones, pulsamos «OK» y después «Continuar».

---

### Configuración de la clave de seguridad

![Configuración de la clave de seguridad](<Images/Ubuntu3.png>)

El instalador solicita establecer una contraseña para proteger el disco cifrado.

Se muestran los siguientes campos:

- Elija una clave de seguridad.
- Confirme la clave de seguridad.

Introducimos una contraseña segura y la repetimos para confirmarla.

Esta contraseña será necesaria cada vez que se inicie la máquina virtual para desbloquear el disco cifrado.

### Activación de la clave de recuperación

También aparece la opción:

**Activar la clave de recuperación.**

Se recomienda activar esta opción para disponer de una clave adicional que permita recuperar el acceso al volumen cifrado.

El instalador indica una ubicación para guardar el archivo:

```text
/home/ubuntu/recovery.key
```

Es importante guardar una copia de la clave de recuperación en un dispositivo externo y seguro antes de reiniciar la máquina virtual.

No debemos depender únicamente de una copia almacenada en el propio disco cifrado.

### Sobrescritura del espacio vacío

El instalador también ofrece la opción:

**Sobreescribir el espacio vacío del disco.**

En este ejercicio dejamos esta opción desactivada, ya que no es necesaria para configurar el cifrado y puede aumentar considerablemente el tiempo de instalación.

Una vez configuradas las opciones, pulsamos «Instalar ahora».

---

### Diferencia entre las contraseñas

Durante la instalación se utilizan dos contraseñas diferentes:

**Contraseña LUKS:**

Permite desbloquear el disco cifrado antes de iniciar Ubuntu.

**Contraseña de Laura:**

Permite iniciar sesión en el escritorio y utilizar el sistema operativo.

Ambas contraseñas son independientes.

---

# LUIS

## D-L1 · Qué parámetros del núcleo cerrar

**Medida:** Comprobar las protecciones del sistema y confinar un servicio · **Responsable:** Luis Baena

**Contexto.**
Ubuntu 24.04 trae ya muchas protecciones del núcleo activadas de serie. Aplicar una lista larga de parámetros sin comprobar el estado previo no añade seguridad: solo repite lo que ya venía y deja configuración que nadie sabe explicar.

**Opciones valoradas.**

1. Aplicar una lista genérica de hardening (CIS, o la que propone una IA), de unos 30 parámetros.
2. Comprobar primero el valor de cada parámetro y cerrar solo los que venían abiertos y sabemos explicar.

**Decisión.**
Elegimos la opción 2. Revisamos 17 parámetros. Siete ya protegían de serie y no se tocan: ASLR, `dmesg_restrict`, `perf_event_paranoid`, BPF sin privilegios, `protected_symlinks/hardlinks/regular` y `tcp_syncookies`. Cerramos 8, todos en un fichero propio, `/etc/sysctl.d/99-mareas.conf`:

| Parámetro                             | De serie | Aplicado | Qué protege                                                                            |
| -------------------------------------- | -------- | -------- | --------------------------------------------------------------------------------------- |
| `kernel.kptr_restrict`               | 1        | 2        | Oculta las direcciones del núcleo también a root, lo que dificulta los exploits       |
| `kernel.yama.ptrace_scope`           | 1        | 2        | Solo root puede engancharse a otro proceso para leer su memoria o inyectarle código    |
| `kernel.kexec_load_disabled`         | 0        | 1        | Impide cargar otro núcleo en caliente. No se puede deshacer sin reiniciar              |
| `kernel.sysrq`                       | 176      | 0        | Desactiva las combinaciones de teclado de bajo nivel en la consola                      |
| `fs.suid_dumpable`                   | 2        | 0        | Un programa con privilegios que falla no deja un volcado de memoria con datos sensibles |
| `net.ipv4.conf.all.accept_redirects` | 1        | 0        | El servidor ignora redirecciones ICMP que podrían desviar su tráfico                  |
| `net.ipv4.conf.all.send_redirects`   | 1        | 0        | El servidor no enruta, así que no tiene por qué enviarlas                             |
| `net.ipv4.conf.all.log_martians`     | 0        | 1        | Registra paquetes con direcciones imposibles, señal de suplantación                   |

**Descartados.**

- `ip_forward` y `rp_filter`: no aportan nada en un servidor con una sola interfaz y podrían interferir con la red nueva.
- `fs.protected_fifos=2`: la mejora es marginal en este servidor.

**Consecuencias.**

- Transparente para la plantilla.
- `ptrace_scope=2` impide depurar procesos sin root. En un servidor de producción no hace falta.
- El fichero propio permite ver de un vistazo qué hemos cambiado nosotros y deshacerlo borrando un solo fichero.

---

## D-L2 · Desactivar Apport

**Contexto.**
Tras el primer reinicio, `fs.suid_dumpable` volvió a valer 2. Apport, el sistema de informes de fallos de Ubuntu, fija ese valor cada vez que arranca y anulaba nuestra medida.

**Opciones valoradas.**

1. Quitar `fs.suid_dumpable` de la lista y aceptar el valor 2.
2. Desactivar Apport.

**Decisión.**
Elegimos la opción 2: `systemctl disable --now apport` y `enabled=0` en `/etc/default/apport`. Apport solo sirve para enviar informes de fallos a Canonical. En un servidor sin escritorio no aporta nada a la gestoría, y además encaja con la reducción de servicios innecesarios (7a).

**Consecuencias.**

- Tras el siguiente reinicio, `fs.suid_dumpable` se mantiene a 0.
- Si un programa falla, no se genera un informe automático. El administrador sigue teniendo los logs del sistema.

---

## D-L3 · Qué servicio confinar

**Contexto.**
La rúbrica pide confinar al menos un servicio expuesto. En el servidor hay tres candidatos: Samba (puertos 139 y 445), nginx (puerto 80) y vsftpd (puerto 21, abierto a la asesoría externa).

**Opciones valoradas.**

| Servicio         | A favor                                                                                      | En contra                                          |
| ---------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Samba (`smbd`) | Es el servicio que guarda los documentos de clientes y el que usa toda la plantilla a diario | Si el confinamiento falla, nadie puede trabajar    |
| nginx            | Fácil de confinar y con poco riesgo                                                         | Su uso en la gestoría es menor                    |
| vsftpd           | Es el único accesible desde fuera de la oficina                                             | Su uso está limitado a una sola IP (la asesoría) |

**Decisión.**
Confinamos `smbd`, que es donde está el activo más valioso: los documentos de clientes. Usamos las opciones de aislamiento de systemd en un fichero drop-in (`/etc/systemd/system/smbd.service.d/confinamiento.conf`), que no modifica el unit original y se deshace borrando un fichero. Elegimos systemd en lugar de AppArmor porque `systemd-analyze security` permite medir el antes y el después.

**Consecuencias.**

- La nota de exposición baja de **9.6 UNSAFE a 6.0 MEDIUM**.
- La plantilla sigue accediendo a la carpeta de clientes igual que antes.
- vsftpd queda sin confinar. Lo dejamos como riesgo abierto y mejora futura en `aprendizaje.md`.

---

## D-L4 · Hasta dónde confinar Samba

**Contexto.**
`ProtectSystem=strict` deja todo el sistema en solo lectura. Samba necesita escribir en la carpeta de clientes y en sus propios directorios.

**Opciones valoradas.**

1. Solo `ProtectSystem=strict` y `ProtectHome`, como decía la propuesta.
2. Confinamiento amplio con las rutas de escritura acotadas.
3. Añadir además `CapabilityBoundingSet` y `SystemCallFilter` para bajar más la nota.

**Decisión.**
Elegimos la opción 2:

- `ProtectSystem=strict` con `ReadWritePaths` limitado a `/srv/gestoria/clientes`, `/var/lib/samba`, `/var/log/samba`, `/var/cache/samba` y `/run/samba`.
- `ProtectHome=yes`: no hay recurso `[homes]`, comprobado con `testparm`.
- `PrivateTmp=yes`: cubre el `/var/tmp` que usa `[printers]`.
- `PrivateDevices`, `ProtectKernel*`, `ProtectControlGroups`, `ProtectClock`, `ProtectHostname`, `RestrictRealtime`, `RestrictNamespaces`, `LockPersonality` y `SystemCallArchitectures=native`.

Descartamos la opción 3. Samba necesita cambiar de usuario y de permisos para atender a cada asesor (`CAP_SETUID`, `CAP_SETGID`, `CAP_DAC_OVERRIDE`…). Recortarle capacidades o llamadas al sistema tiene mucho riesgo de romper el acceso, y la regla del cliente es no parar.

**Consecuencias.**

- La nota se queda en 6.0 y no baja más.
- Si alguien explota un fallo de Samba, no puede modificar el sistema, ver las carpetas personales, cargar módulos del núcleo ni tocar el reloj. Solo puede escribir donde Samba ya escribía.
- Si en el futuro se añade otra carpeta compartida, habrá que añadirla a `ReadWritePaths`.

---

## D-L5 · Contraseñas de BIOS/UEFI de cada equipo

**Medida:** Proteger el acceso a BIOS/UEFI y el arranque · **Responsable:** Luis Baena

**Contexto.**
El portátil y el servidor tienen usos distintos. El portátil sale de la oficina y puede robarse, como ya pasó en septiembre. El servidor tiene que volver a arrancar solo después de un corte de luz. Además, la gestoría guardaba las contraseñas en un pósit junto al equipo de la jefa.

**Opciones valoradas.**

| Contraseña             | Portátil             | Servidor   |
| ----------------------- | --------------------- | ---------- |
| Administración (setup) | Sí                   | Sí        |
| Arranque (power-on)     | Valorada y descartada | Descartada |

**Decisión.**

- **Contraseña de administración en los dos equipos.** Impide cambiar el orden de arranque, activar el arranque desde USB o desactivar protecciones.
- **Sin contraseña de arranque en el portátil.** El disco ya está cifrado con LUKS y pide su clave al encender. Una segunda contraseña sería otra molestia para Laura y casi no añade protección.
- **Sin contraseña de arranque en el servidor.** Tras un reinicio o un corte de luz, el servidor se quedaría parado hasta que alguien la escribiera, y la gestoría no podría trabajar.
- **Custodia:** una contraseña distinta en cada equipo, conocida solo por la jefa y el informático y guardada en sobre cerrado o gestor de contraseñas. Nunca en un pósit ni en el repositorio.

**Limitación del laboratorio.**
Las dos máquinas virtuales arrancan con BIOS clásica (SeaBIOS de QEMU). Lo comprobamos porque no existe `/sys/firmware/efi` y porque *Enable UEFI boot mode* está desactivado en GNS3. SeaBIOS no permite contraseña de setup, así que en el laboratorio esta medida queda documentada para el equipo real. La protección equivalente se consigue con la configuración de la VM en GNS3 (D-L6) y con la contraseña de GRUB (D-L7).

**Consecuencias.**

- La plantilla no nota nada. Solo afecta al soporte técnico.
- Si se olvida la contraseña de administración del equipo real, habrá que borrar la CMOS. Por eso se guarda en sobre cerrado.

---

## D-L6 · Arranque solo desde el disco interno

**Contexto.**
Si un equipo puede arrancar desde USB, CD o red, cualquiera con acceso físico puede iniciar otro sistema (por ejemplo Kali) y saltarse el sistema operativo instalado.

**Opciones valoradas.**

1. Equipo real: configurarlo en el setup de la BIOS/UEFI.
2. Laboratorio: configurarlo en las opciones de la máquina virtual en GNS3.
3. Laboratorio: además, cambiar las VM a UEFI y activar Secure Boot y TPM.

**Decisión.**

- **Equipo real (procedimiento documentado):** desactivar el arranque desde USB, CD y PXE, dejar el disco interno como única opción, activar Secure Boot y proteger el menú de arranque (F12) con la contraseña de administración.
- **Laboratorio (implantado):**
  - **Boot priority `HDD`:** ya venía así de serie y lo comprobamos.
  - **Unidad de CD vacía.**
  - **`-boot menu=off,strict=on`** en las opciones de QEMU. `menu=off` desactiva el menú de arranque de la BIOS y `strict=on` impide que, si el disco falla, intente arrancar desde otro dispositivo, como la red.
- **Descartamos la opción 3.** Cambiar el firmware de una VM que ya está instalada puede dejarla sin arrancar, y la regla del cliente es no parar.

**Consecuencias.**

- Las VM solo pueden arrancar desde su disco.
- Sin Secure Boot, en el laboratorio no se verifica la firma del gestor de arranque. Lo dejamos como límite y como mejora para el equipo real.

---

## D-L7 · Contraseña de GRUB

**Contexto.**
GRUB viene sin contraseña. Al arrancar, cualquiera puede pulsar `e`, editar la línea del núcleo y entrar como root sin contraseña, o abrir la consola de GRUB (`c`) y cargar un sistema desde un USB aunque la BIOS lo tenga bloqueado. Además, el menú de recuperación da una shell de root directamente. El menú venía oculto (`GRUB_TIMEOUT_STYLE=hidden`), pero eso no protege nada: pulsando una tecla aparece.

**Opciones valoradas.**

1. Contraseña de GRUB para todo, también para arrancar normalmente.
2. Contraseña solo para editar, para la consola y para las entradas no habituales. El arranque normal queda libre.

**Decisión.**
Elegimos la opción 2, en el servidor y en el portátil:

- **Superusuario `admingrub`** con contraseña cifrada (PBKDF2) en `/etc/grub.d/40_custom`. La contraseña es distinta en cada equipo y no está en el repositorio.
- **`--unrestricted`** en las entradas normales de Ubuntu (`/etc/grub.d/10_linux`). El servidor arranca solo y el portátil no añade ninguna molestia a Laura.
- **`GRUB_DISABLE_RECOVERY="true"`**: se elimina el modo recuperación.
- **Portátil:** se retiran del menú las entradas de memtest86+ (`chmod -x /etc/grub.d/20_memtest86+`). Ya estaban protegidas por la contraseña, pero Laura no las necesita.

Descartamos la opción 1 por los mismos motivos que la contraseña de arranque de la BIOS (D-L5).

**Consecuencias.**

- La plantilla no nota nada: el arranque es igual que antes.
- Editar el arranque, usar la consola de GRUB o entrar en la configuración del firmware desde GRUB exige la contraseña.
- Si se olvida, el sistema sigue arrancando. Se puede volver a generar desde Ubuntu con sudo.

---

## D-L8 · Límites de la protección del arranque y qué los cubre

**Contexto.**
Con acceso físico, toda protección del arranque se puede acabar saltando. Lo importante es saber qué otra capa cubre cada hueco.

| Límite                                                                              | Qué lo cubre                                                                                             |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Quitar la pila de la placa (Clear CMOS) borra la contraseña de la BIOS              | **Cifrado LUKS:** aunque arranquen otro sistema, el disco no se puede leer                          |
| Contraseñas maestras de algunos fabricantes                                         | **LUKS**                                                                                            |
| Sacar el disco y conectarlo a otro equipo                                            | **LUKS**                                                                                            |
| Saltarse GRUB arrancando desde un USB                                                | **Arranque solo desde disco + contraseña de BIOS** (y Secure Boot en el equipo real)               |
| Usar la consola de GRUB para cargar un sistema externo                               | **Contraseña de GRUB**                                                                             |
| Manipular `/boot`, que no va cifrado, para capturar la clave de LUKS ("evil maid") | **Contraseña de GRUB** y Secure Boot en el equipo real. **Riesgo abierto** en el laboratorio |
| Robar el portátil encendido con la sesión abierta                                  | **Ninguna de estas capas.** Hace falta el bloqueo automático de pantalla. **Riesgo abierto** |
| Acceso físico al servidor                                                           | Sala o armario cerrado con llave, con lo que ya hay. Lo decide el cliente                                 |

**Decisión.**
Ninguna capa basta por sí sola. BIOS, GRUB y LUKS se cubren entre sí. Los riesgos que quedan abiertos se recogen en `aprendizaje.md`.

---

# Revisar el acceso desde Internet y acotar el servicio FTP del router

## D-H1 · Acotar el acceso externo por FTP

**Medida:** Revisar el acceso desde Internet y acotar el servicio FTP del router · **Responsable:** Hugo Pérez Arévalo

**Contexto.**
La Asesoría Fiscal necesita acceder al servidor por FTP desde una red exterior. El puerto 21 y el rango pasivo `40000-40050` estaban abiertos sin limitar el origen de las conexiones.

**Opciones valoradas.**

1. Mantener las redirecciones FTP abiertas a cualquier dirección externa.
2. Bloquear completamente el FTP externo.
3. Mantener FTP, pero permitirlo únicamente desde la dirección conocida de la Asesoría Fiscal.
4. Sustituir FTP por SFTP.

Se descartó bloquear completamente el servicio porque impediría el trabajo habitual de la asesoría. SFTP se descartó porque exigiría cambiar los programas y los procedimientos de la asesoría.

**Decisión.**
Se mantienen FTP y el modo pasivo, pero las redirecciones Destination NAT del router se limitan al origen `192.168.122.50`. También se permite el tráfico de conexiones establecidas y relacionadas, así como el tráfico redirigido por NAT.

```routeros
/ip firewall nat
add action=dst-nat chain=dstnat dst-port=21 in-interface=ether1 protocol=tcp src-address=192.168.122.50 to-addresses=192.168.1.10
add action=dst-nat chain=dstnat dst-port=40000-40050 in-interface=ether1 protocol=tcp src-address=192.168.122.50 to-addresses=192.168.1.10
```

```routeros
/ip firewall filter
add action=accept chain=forward connection-state=established,related place-before=0
add action=accept chain=forward connection-nat-state=dstnat place-before=1
```

**Consecuencias.**

- La Asesoría Fiscal conserva el acceso necesario.
- Las direcciones externas distintas de `192.168.122.50` no pueden usar las redirecciones FTP.
- FTP sigue transmitiendo sin cifrado; el riesgo se reduce temporalmente limitando el origen.
- La dirección de origen autorizada deberá actualizarse si cambia.

---

# Eliminar la cuenta del becario y limitar privilegios

## D-H2 · Eliminar la cuenta del becario y retirar privilegios administrativos

**Medida:** Eliminar la cuenta del becario y limitar privilegios · **Responsable:** Hugo Pérez Arévalo

**Contexto.**
La cuenta `becario` ya no debía tener acceso al servidor ni capacidad administrativa. El usuario y cualquier regla de privilegios podían seguir activos aunque el becario hubiese dejado de trabajar en la gestoría.

**Opciones valoradas.**

1. Mantener la cuenta y retirar únicamente el acceso remoto.
2. Mantener la cuenta deshabilitada por si fuese necesaria en el futuro.
3. Eliminar la cuenta y retirar cualquier configuración de privilegios asociada.

**Decisión.**
Se seleccionó la opción 3. Se eliminó la cuenta `becario` del servidor y se retiró su configuración administrativa de `/etc/sudoers.d`.

**Consecuencias.**

- El antiguo becario no puede iniciar sesión con esa cuenta.
- No conserva privilegios de administración mediante una entrada específica en sudoers.
- Cualquier nuevo usuario administrativo deberá crearse según una autorización actual y documentada.

# Registro de Decisiones Técnicas: Segmentación y Seguridad de Red

Este documento recoge las decisiones técnicas tomadas durante la implantación en GNS3 que modifican la propuesta inicial, eligen entre varias alternativas de diseño o asumen un riesgo residual controlado.

---

### Decisión: Reasignar la configuración del router MikroTik a las interfaces `ether6` (WAN) y `ether7` (Trunk)
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** En `propuesta.md` estaban previstas las interfaces `ether1` para la salida exterior (WAN) y `ether2` para el enlace troncal hacia `Switch-oficina`. Al reiniciar el nodo `Router-operadora` en GNS3, el hipervisor reenumeró las tarjetas de red activas desplazándolas a `ether6` (conectada a la nube NAT exterior) y `ether7` (conectada al puerto `Gi0/0` del switch), dejando `ether1` y `ether2` sin enlace físico y asignando por DHCP la IP externa `192.168.122.51/24` sobre `ether6`.
- **Opciones que valoramos:**
  1. Eliminar el nodo MikroTik, crear uno nuevo desde cero y recablear toda la topología para forzar los nombres `ether1` y `ether2`.
  2. Mantener el cableado físico operativo sobre `ether6` y `ether7`, limpiar la dirección IP huérfana y adaptar las subinterfaces VLAN (`vlan10`, `vlan20`, `vlan30`), el cliente DHCP y las reglas NAT a `ether6` y `ether7`.
- **Qué decidimos y por qué:** Elegimos la opción 2 porque evita riesgos de desconfiguración en los enlaces ya validados con el switch, garantiza la estabilidad del proyecto en GNS3 y vincula todo el enrutamiento y el NAT a las interfaces físicas reales del router.
- **Consecuencias:** Cambia respecto a `propuesta.md` (debe anotarse en `propuesta.md` que la implantación final usa `ether6` y `ether7` y que la IP exterior para las pruebas FTP de la Asesoría Fiscal es `192.168.122.51/24`). No introduce ningún riesgo de seguridad adicional.

---

### Decisión: Aplicar direccionamiento VLSM (`/28` para servidores y `/26` para plantilla y clientes) en lugar de subredes de tamaño fijo
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** La gestoría partía de una única red plana `192.168.1.0/24` sin aislamiento entre departamentos. Al dividir la red en tres VLANs (`SERVIDORES`, `PLANTILLA` y `CLIENTES`), era necesario repartir el direccionamiento interno ajustándolo al volumen real de equipos de cada zona.
- **Opciones que valoramos:**
  1. Dividir el bloque `192.168.1.0/24` en tres subredes iguales `/26` (62 direcciones útiles cada una), dejando sin uso cerca de 50 direcciones en la red de servidores.
  2. Aplicar VLSM asignando una máscara `/28` a `VLAN 10` (`192.168.1.0/28`, 14 hosts útiles para servidores), `/26` a `VLAN 20` (`192.168.1.64/26`, 62 hosts útiles para puestos e impresoras) y `/26` a `VLAN 30` (`192.168.1.128/26`, 62 hosts útiles para dispositivos móviles de clientes).
- **Qué decidimos y por qué:** Elegimos la opción 2 (VLSM) porque reduce la superficie de escaneo en la subred crítica de servidores (solo 14 direcciones posibles), ofrece margen suficiente para los dispositivos de los clientes en sala de espera y conserva libre el último bloque `192.168.1.192/26` para futuras ampliaciones de la oficina.
- **Consecuencias:** Obliga a configurar máscaras heterogéneas (`255.255.255.240` en `srv-mareas` y `255.255.255.192` en el resto de equipos). Cualquier error al introducir la máscara en un puesto impide alcanzar su puerta de enlace (`192.168.1.1`, `.65` o `.129`).

---

### Decisión: Bloquear el tráfico ICMP (`ping`) desde `VLAN 20` hacia `VLAN 10` permitiendo únicamente los puertos TCP `80` y `445`
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** Los empleados de la plantilla (`VLAN 20`) necesitan acceder a la aplicación web interna (`HTTP`, puerto `80`) y a las carpetas compartidas (`Samba`, puerto `445`) alojadas en `srv-mareas` (`192.168.1.10`, `VLAN 10`). Sin embargo, dejar abierto todo el tráfico entre `VLAN 20` y `VLAN 10` permitiría que un puesto de empleado comprometido realizara reconocimientos de red (`ping sweeps`) o atacara otros servicios del servidor.
- **Opciones que valoramos:**
  1. Permitir todo el tráfico desde `VLAN 20` hacia `VLAN 10` y bloquear únicamente el acceso procedente de `VLAN 30` (clientes).
  2. Establecer una regla de bloqueo por defecto (`action=drop`) entre `vlan20` y `vlan10` en la cadena `forward` del MikroTik, anteponiendo una única regla de aceptación (`action=accept`) restringida estrictamente a `protocol=tcp dst-port=80,445`.
- **Qué decidimos y por qué:** Elegimos la opción 2 (principio de mínimo privilegio) porque asegura el trabajo diario de los empleados (web y carpetas compartidas) al tiempo que impide sondeos ICMP y conexiones a cualquier otro puerto del servidor.
- **Consecuencias:** Las pruebas diagnósticas con `ping` desde los equipos de plantilla hacia `192.168.1.10` fallan intencionadamente (`100% packet loss`), por lo que la disponibilidad del servidor desde `VLAN 20` debe comprobarse directamente contra los servicios (`http://192.168.1.10` o `smb://192.168.1.10`).

---

### Decisión: Acotar por IP origen (`192.168.122.50`) el reenvío NAT del servicio FTP aceptando temporalmente el intercambio sin cifrar
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** La gestoría colabora con una Asesoría Fiscal externa (`192.168.122.50`) que envía y descarga documentación mediante FTP clásico (puerto de control `21` y rango de datos pasivos `40000-40050`), un protocolo que transmite usuario, contraseña y ficheros en texto claro.
- **Opciones que valoramos:**
  1. Configurar reglas `dst-nat` estándar en los puertos `21` y `40000-40050` abiertas a cualquier IP origen (`0.0.0.0/0`).
  2. Restringir las reglas `dst-nat` en `ether6` añadiendo el filtro `src-address=192.168.122.50` para descartar en el perímetro cualquier conexión FTP que no provenga de la IP fija de la asesoría.
  3. Desactivar el FTP de inmediato y migrar a SFTP, obligando a la asesoría externa a reconfigurar su software cliente antes de poder trabajar.
- **Qué decidimos y por qué:** Elegimos la opción 2 porque garantiza que la gestoría y la asesoría sigan operando sin interrupciones ni cambios en el cliente externo, mientras se oculta el puerto `21` frente a ataques automatizados desde Internet.
- **Consecuencias:** Se acepta a sabiendas el riesgo residual de que las credenciales y ficheros FTP entre `192.168.122.50` y `192.168.1.10` viajen sin cifrar hasta coordinar una migración futura a SFTP/FTPS, y obliga a actualizar la regla NAT si la asesoría cambia de dirección IP pública.

---

### Decisión: Configurar la IP estática de `Portatil` (Ubuntu Desktop) desde NetworkManager gráfico en lugar de comandos `ip addr` / `ip route`
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** En `propuesta.md` se planteaba asignar la dirección `192.168.1.68/26` en `Portatil` mediante comandos `sudo ip addr add` e `ip route add`. Al ejecutarlos en el entorno de escritorio Ubuntu, el demonio `NetworkManager` sobrescribió la interfaz `ens3` a los pocos segundos provocando el error `Error: Nexthop has invalid gateway` y perdiendo la configuración tras reiniciar.
- **Opciones que valoramos:**
  1. Detener o desinstalar `NetworkManager` en el portátil y aplicar la configuración de red por comandos manuales en cada inicio de sesión.
  2. Configurar el perfil de red cableada en modo `Manual` directamente en `NetworkManager` (`192.168.1.68`, máscara `255.255.255.192`, puerta de enlace `192.168.1.65`) y reiniciar el adaptador.
- **Qué decidimos y por qué:** Elegimos la opción 2 porque evita conflictos entre servicios de red, mantiene el funcionamiento estándar de un portátil de usuario en Ubuntu Desktop y asegura que la configuración de `VLAN 20` persista tras apagar o reiniciar el equipo.
- **Consecuencias:** Modifica el procedimiento de implantación documentado en `propuesta.md` para los puestos cliente con escritorio Linux y garantiza la persistencia sin intervención manual.