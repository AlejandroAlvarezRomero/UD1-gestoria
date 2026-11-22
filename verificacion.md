# 1. Verificación del cifrado del portatil y la partición del servidor

## 1.1 Verificación del cifrado del servidor

![Verificación del volumen cifrado](<Images/Server5.png>)

Después de completar todos los pasos, la configuración del servidor queda de la siguiente manera:

| Elemento                 | Configuración                   |
| ------------------------ | -------------------------------- |
| Servidor                 | Ubuntu Server                    |
| Disco secundario         | `/dev/vdb`                     |
| Tamaño del disco        | 4 GB                             |
| Partición               | `/dev/vdb1`                    |
| Tipo de cifrado          | LUKS2                            |
| Dispositivo desbloqueado | `/dev/mapper/clientes_cifrado` |
| Sistema de archivos      | EXT4                             |
| Punto de montaje         | `/clientes`                    |

### Estructura final

```text
/dev/vdb
    |
    └── /dev/vdb1
            |
            └── LUKS2
                  |
                  └── /dev/mapper/clientes_cifrado
                            |
                            └── EXT4
                                  |
                                  └── /clientes
```

### Conclusión

Se ha configurado correctamente el segundo disco del servidor Ubuntu Server para almacenar los documentos de los clientes.

Se ha creado una partición de 4 GB, se ha protegido mediante cifrado LUKS2, se ha creado un sistema de archivos EXT4 y se ha montado en el directorio `/clientes`.

Las comprobaciones realizadas con `lsblk`, `df -h` y `cryptsetup status` confirman que la partición está cifrada, desbloqueada y montada correctamente.

**Nota final:** El montaje realizado es temporal. Si se reinicia el servidor, será necesario volver a desbloquear el volumen e iniciar el montaje. Para automatizar este proceso habría que configurar `/etc/crypttab` y `/etc/fstab`.

## 1.2 Verificación del portátil

La verificación consiste en comprobar que nos pide una contraseña para el cifrado el encender la máquina virutal y que el usuario para Laura está creado con su propia contraseña.

Al finalizar el ejercicio se obtiene una máquina virtual con las siguientes características:

| Elemento | Configuración |
|---|---|
| Plataforma de virtualización | QEMU |
| Entorno de virtualización | GNS3 |
| Sistema operativo | Ubuntu Desktop 22.04.5 LTS |
| Gestor de volúmenes | LVM |
| Sistema de cifrado | LUKS |
| Usuario creado | Laura |
| Nombre de usuario | laura |
| Clave de seguridad | Contraseña LUKS |ç
| Clave de usuario | Contraseña segura |
| Clave adicional | Clave de recuperación |

### Esquema de funcionamiento

```text
          MÁQUINA VIRTUAL QEMU
                  |
                  |
          DISCO VIRTUAL
                  |
                  |
             CIFRADO LUKS
                  |
                  |
                 LVM
                  |
                  |
          VOLÚMENES LÓGICOS
                  |
                  |
           SISTEMA UBUNTU
                  |
                  |
          USUARIO: LAURA
   
```

---

### Conclusión

Se ha realizado la instalación de Ubuntu Desktop 22.04.5 LTS en una máquina virtual QEMU dentro de GNS3.

Durante la instalación se ha seleccionado el uso de LVM y el cifrado mediante LUKS para proteger los datos almacenados en el disco virtual.

También se ha configurado una contraseña de seguridad para desbloquear el disco y se ha activado la opción de generar una clave de recuperación.

Finalmente, se ha creado la cuenta de usuario de Laura con su contraseña segura correspondiente.

El resultado es una instalación de Ubuntu con almacenamiento cifrado, preparada para proteger la información en caso de pérdida o acceso no autorizado a la máquina virtual.

# 2. Protección del sistema y confinamiento de servicios

## 2.1 Medida: Comprobar las protecciones del sistema y confinar un servicio

**Equipo:** `srv-mareas` (Ubuntu 24.04.5 LTS, kernel 6.8) · **Implanta:** Luis Baena · **Comprueba:** Raúl

### 2.1.1 Punto de partida: qué traía el sistema

Antes de cambiar nada, revisamos 17 parámetros de protección del núcleo:

![sysctl antes](Images/sysctl-antes.png)

| Parámetro | De serie | Estado |
|---|---|---|
| `kernel.randomize_va_space` | 2 |  Ya protege (ASLR completo) |
| `kernel.dmesg_restrict` | 1 |  Ya protege |
| `kernel.perf_event_paranoid` | 4 |  Ya protege |
| `kernel.unprivileged_bpf_disabled` | 2 |  Ya protege |
| `fs.protected_symlinks` / `hardlinks` | 1 / 1 |  Ya protege |
| `fs.protected_regular` | 2 |  Ya protege |
| `net.ipv4.tcp_syncookies` | 1 |  Ya protege |
| `kernel.kptr_restrict` | 1 |  Parcial |
| `kernel.yama.ptrace_scope` | 1 |  Parcial |
| `kernel.kexec_load_disabled` | 0 |  Abierto |
| `kernel.sysrq` | 176 |  Abierto |
| `fs.suid_dumpable` | 2 |  Abierto |
| `net.ipv4.conf.all.accept_redirects` | 1 |  Abierto |
| `net.ipv4.conf.all.send_redirects` | 1 |  Abierto |
| `net.ipv4.conf.all.log_martians` | 0 |  Abierto |

Ningún servicio expuesto venía confinado: AppArmor está activo, pero `vsftpd`, `nginx` y `smbd` aparecen como `unconfined`.

![AppArmor antes](Images/apparmor-antes.png)

### 2.1.2 Núcleo: parámetros cerrados de forma permanente

Los 8 parámetros abiertos se fijan en un fichero propio, `/etc/sysctl.d/99-mareas.conf` (los motivos están en `decisiones.md`, D-L1), y se aplican con `sudo sysctl --system`.

Tras reiniciar el servidor, los 8 mantienen el valor nuevo:

| Parámetro | Esperado | Obtenido |
|---|---|---|
| `kernel.kptr_restrict` | 2 | 2  |
| `kernel.yama.ptrace_scope` | 2 | 2  |
| `kernel.kexec_load_disabled` | 1 | 1  |
| `kernel.sysrq` | 0 | 0  |
| `fs.suid_dumpable` | 0 | 0  |
| `net.ipv4.conf.all.accept_redirects` | 0 | 0  |
| `net.ipv4.conf.all.send_redirects` | 0 | 0  |
| `net.ipv4.conf.all.log_martians` | 1 | 1  |

![sysctl tras reinicio](Images/sysctl-tras-reinicio.png)

**Incidencias encontradas al comprobar:**
- Una errata en el nombre (`kexec_load_disablde`) impedía aplicar ese parámetro. Se detectó comprobando su valor y se corrigió.
- Tras el primer reinicio, `fs.suid_dumpable` volvía a valer 2 porque Apport lo restablece al arrancar. Se desactivó Apport (`decisiones.md`, D-L2) y, tras el siguiente reinicio, el valor se mantiene a 0.

![Apport desactivado](Images/apport-desactivado.png)

### 2.1.3 Confinamiento de Samba (`smbd`)

Antes de confinarlo, revisamos la configuración con `testparm -s`: la carpeta compartida es `/srv/gestoria/clientes`, no hay recurso `[homes]` y `[printers]` usa `/var/tmp`. Con eso se decidieron las rutas de escritura permitidas.

El confinamiento se aplica con un drop-in en `/etc/systemd/system/smbd.service.d/confinamiento.conf`, que no toca el servicio original (motivos en `decisiones.md`, D-L3 y D-L4). `systemctl status smbd` muestra el drop-in cargado y el servicio `active (running)`.

**Nivel de exposición, antes y después:**

| Antes | Después |
|---|---|
| **9.6 UNSAFE** | **6.0 MEDIUM** |

![nota antes](Images/smbd-nota-antes.png)
![nota después](Images/smbd-nota-despues.png)

**Bloquea una acción.** Antes del confinamiento, un proceso dentro del espacio de Samba podía crear ficheros en `/etc`. Después:

| Prueba | Resultado |
|---|---|
| `nsenter -t <PID smbd> -m touch /etc/prueba-luis` | `Read-only file system` → **bloqueado** |
| `nsenter -t <PID smbd> -m ls /home` | Vacío: Samba no ve las carpetas personales |

![bloqueado](Images/smbd-bloqueado.png)

### 2.1.4 La gestoría sigue trabajando

Con Samba ya confinado, se crea una carpeta en el recurso de clientes, se lista y se borra sin errores:

```bash
smbclient //127.0.0.1/clientes -N -c "mkdir prueba-luis; ls; rmdir prueba-luis"
```

![samba funciona](Images/samba-funciona.png)

Tras reiniciar el servidor se repitieron las pruebas con el mismo resultado: el drop-in se carga, la escritura en `/etc` sigue bloqueada y la carpeta de clientes sigue accesible.

---

# 3. Protección del acceso a BIOS/UEFI y del arranque

## 3.1 Medida: Proteger el acceso a BIOS/UEFI y el arranque

**Equipos:** `srv-mareas` y `Portatil` · **Implanta:** Luis Baena · **Comprueba:** Hugo

### 3.1.1 Punto de partida (igual en los dos equipos)

| Comprobación | Resultado |
|---|---|
| `GRUB_TIMEOUT_STYLE` / `GRUB_TIMEOUT` | `hidden` / `0`: el menú está oculto, pero aparece pulsando una tecla |
| `GRUB_DISABLE_RECOVERY` | Comentado: **modo recuperación activo** (shell de root sin contraseña) |
| `superusers` / `password` en `grub.cfg` | Nada: **GRUB sin contraseña** |

![grub antes](Images/grub-antes.png)

Las dos máquinas virtuales arrancan con **BIOS clásica (SeaBIOS)**, no con UEFI: no existe `/sys/firmware/efi` y en GNS3 la opción *Enable UEFI boot mode* está desactivada. SeaBIOS no permite contraseña de setup, así que la contraseña de BIOS queda documentada para el equipo real (`decisiones.md`, D-L5).

![bios legacy](Images/bios-legacy.png)

### 3.1.2 Configuración aplicada en GRUB (servidor y portátil)

1. Superusuario `admingrub` con la contraseña cifrada (PBKDF2) en `/etc/grub.d/40_custom`. La contraseña es distinta en cada equipo.
2. `--unrestricted` en las entradas normales de Ubuntu (`/etc/grub.d/10_linux`).
3. `GRUB_DISABLE_RECOVERY="true"` en `/etc/default/grub`.
4. Solo en el portátil: se retiran del menú las entradas de memtest86+.
5. `sudo update-grub`.

En `grub.cfg` aparecen `superusers` y `password_pbkdf2`, las entradas de Ubuntu llevan `--unrestricted` y no hay ninguna entrada de recuperación. El hash de la contraseña está tapado en la captura.

![update-grub](Images/update-grub.png)

### 3.1.3 GRUB protege lo que no es el arranque normal

Al intentar editar una entrada (`e`) o arrancar una entrada no habitual, GRUB pide usuario y contraseña. Con credenciales incorrectas vuelve al menú sin dejar hacer nada; con las correctas se abre el editor. Se probó en los dos equipos con el mismo resultado.

![grub pide usuario](Images/portatil-memtest-protegido.png)

### 3.1.4 El arranque normal no pide nada

- **Servidor:** se reinicia sin tocar nada y llega solo al login. Samba sigue dando servicio.
- **Portátil:** GRUB pasa sin pedir nada y lo siguiente que aparece es la petición de la clave LUKS (`Please unlock disk vda4_crypt`). Esto confirma además que `/boot` no va cifrado, y por eso la contraseña de GRUB es necesaria también con el disco cifrado (`decisiones.md`, D-L8).

![portátil sin pedir](Images/portatil-grub-pasa-sin-pedir.png)

### 3.1.5 Arranque solo desde disco (GNS3)

| Ajuste | Servidor | Portátil |
|---|---|---|
| Boot priority | `HDD` (ya venía así) | `HDD` |
| Unidad de CD | Vacía | Vacía |
| Options | `-boot menu=off,strict=on` | `-vga qxl -boot menu=off,strict=on` |
| ¿Arranca después del cambio? | Sí ✅ | Sí ✅ |

`menu=off` desactiva el menú de arranque de la BIOS y `strict=on` impide que intente arrancar desde otro dispositivo si el disco falla.

![advanced](Images/gns3-advanced.png)

No se pudo probar a arrancar con una ISO, porque el servidor GNS3 no tiene ninguna imagen ISO disponible. En el equipo real, la prueba sería conectar un USB con Kali y comprobar que el equipo arranca igualmente desde su disco.

### 3.1.6 La gestoría sigue trabajando

- El servidor arranca sin intervención y Samba sigue sirviendo la carpeta de clientes.
- Laura arranca su portátil igual que antes: solo la clave de LUKS (medida de cifrado) y su login.
- Ninguna de estas medidas cambia la forma de trabajar de la plantilla.

---

# 4. Revisar el acceso desde Internet y acotar el servicio FTP del router

## 4.1 Verificación del FTP limitado desde Internet

**Equipo de origen:** `Asesoria-fiscal` (`192.168.122.50`).

**Prueba 1: acceso desde la dirección autorizada.**

Desde `Asesoria-fiscal` se comprobó el puerto FTP del router:

```bash
curl -v telnet://192.168.122.51:21
```

Resultado:

```text
* Connected to 192.168.122.51 (192.168.122.51) port 21
220 (vsFTPd 3.0.5)
```

La dirección autorizada recibió el banner de `vsftpd`, por lo que el canal de control TCP/21 estaba accesible.

![Acceso FTP autorizado](Images/ftp-acceso-autorizado.png)

**Prueba 2: bloqueo desde una dirección no autorizada.**

Se asignó temporalmente `192.168.122.99/24` a `Asesoria-fiscal`, se volvió a probar el puerto 21 y se retiró la dirección.

```bash
ip addr add 192.168.122.99/24 dev eth0
curl --interface 192.168.122.99 -m 3 -v telnet://192.168.122.51:21
ip addr del 192.168.122.99/24 dev eth0
```

Resultado: la conexión fue rechazada con `Connection refused`.

![FTP bloqueado desde una dirección no autorizada](Images/hugo-ftp-bloqueado-final.png)

**Prueba 3: transferencia en modo pasivo.**

```bash
curl -v --ftp-pasv --user asesoriafiscal ftp://192.168.122.51/
```

El servidor respondió `230 Login successful` y permitió listar archivos. Negoció el puerto pasivo `40036`, dentro del rango `40000-40050` configurado en el router.

**Configuración verificada en el router:**

- Las reglas Destination NAT permiten TCP/21 y TCP/40000-40050 solamente desde `192.168.122.50`.
- Las reglas de forward permiten las sesiones establecidas y relacionadas.
- Los servicios Telnet, FTP, API y API-SSL están deshabilitados.
- WWW, SSH y Winbox están limitados a las redes de administración VLAN 10 y VLAN 20.

![Redirecciones FTP](Images/ftp-nat-router.png)
![Reglas de firewall](Images/ftp-firewall-router.png)
![Servicios del router](Images/ftp-servicios-router.png)

# 5. Eliminar la cuenta del becario y limitar privilegios

## 5.1 Verificación de la eliminación de la cuenta `becario`

**Equipo comprobado:** `srv-mareas`.

Se comprobó que la cuenta ya no existía y que no quedaba una entrada de sudoers específica para ella:

```text
id becario
id: becario: no such user

ls /etc/sudoers.d
README
```

Resultado:

- La cuenta `becario` no existe.
- No aparece ningún archivo `becario` en `/etc/sudoers.d`.
- El acceso administrativo asociado a esa cuenta quedó retirado.

La comprobación completa de la sintaxis de sudoers queda pendiente de ejecutar `sudo visudo -c`, porque no se pudo realizar durante la implantación documentada.

# 6. Segmentación y seguridad de red

**Sesión de verificación:** Martes, 3 de noviembre de 2026  
**Entorno:** Maqueta GNS3 — Infraestructura de red de **Mareas Asesores** (`Switch-oficina`, `Router-operadora`, `srv-mareas` y puestos cliente).

---

### 6.1 Medida: Segmentación de red en Capa 2 mediante VLANs y enlace troncal 802.1Q
- **Qué se comprueba:** Que los puertos físicos de `Switch-oficina` quedan separados en tres dominios de difusión independientes (`VLAN 10 SERVIDORES`, `VLAN 20 PLANTILLA` y `VLAN 30 CLIENTES`) y que el puerto `Gi0/0` opera en modo `trunk` 802.1Q hacia el router, impidiendo que un equipo conectado en la sala de espera (`VLAN 30`) intercepte tráfico de Capa 2 de los empleados (`VLAN 20`) o del servidor (`VLAN 10`).
- **Cómo se ha comprobado (orden, desde qué equipo):** Ejecución de `show vlan brief` y `show interfaces trunk` en la consola de `Switch-oficina`, más prueba de conectividad directa en Capa 2 desde `Movil-cliente` (`192.168.1.130`, `VLAN 30`) hacia `Puesto-1` (`192.168.1.69`, `VLAN 20`).
- **Antes:**
  ```text
  Switch-oficina# show vlan brief
  VLAN Name                             Status    Ports
  ---- -------------------------------- --------- -------------------------------
  1    default                          active    Gi0/0, Gi0/1, Gi0/2, Gi0/3,
                                                  Gi1/0, Gi1/1, Gi1/2, Gi1/3
  ```
  Todos los equipos de la oficina compartían la `VLAN 1` por defecto sin aislamiento ni etiquetado troncal.
- **Después:**
  ```text
  Switch-oficina# show vlan brief
  VLAN Name                             Status    Ports
  ---- -------------------------------- --------- -------------------------------
  1    default                          active    
  10   SERVIDORES                       active    Gi0/1
  20   PLANTILLA                        active    Gi0/2, Gi0/3, Gi1/0, Gi1/1, Gi1/2
  30   CLIENTES                         active    Gi1/3

  Switch-oficina# show interfaces trunk
  Port        Mode             Encapsulation  Status        Native vlan
  Gi0/0       on               802.1q         trunking      1
  Port        Vlans allowed on trunk
  Gi0/0       10,20,30
  ```
- **¿Sigue funcionando tras reiniciar?:** Sí. Se guardó la configuración en memoria NVRAM con `write memory` (`Building configuration... [OK]`) y tras reiniciar `Switch-oficina` en GNS3 se mantiene intacta la asignación de puertos y el enlace troncal.
- **¿La gestoría sigue trabajando? Qué se ha probado:** Sí. Los puestos de empleados (`Gi0/2`, `Gi0/3`, `Gi1/0`) y las impresoras de red (`Gi1/1`, `Gi1/2`) mantienen conectividad interna dentro de la `VLAN 20` (`ping 192.168.1.65` desde `Portatil` con `0% packet loss`).
- **Comprobado por:** Alejandro Álvarez Romero

---

### 6.2 Medida: Direccionamiento IP mediante VLSM y Enrutamiento Inter-VLAN
- **Qué se comprueba:** Que cada departamento utiliza una subred ajustada a sus necesidades reales (`/28` para servidores con 14 hosts útiles; `/26` para plantilla y clientes con 62 hosts útiles cada una), que las subinterfaces `vlan10`, `vlan20` y `vlan30` enrutadas en `ether7` de `Router-operadora` actúan como puertas de enlace y que todos los nodos finales tienen su IP estática y máscara configuradas sin solapamientos.
- **Cómo se ha comprobado (orden, desde qué equipo):** Ejecución de `/ip address print` en `Router-operadora`, `ip a show ens3` y `ping 192.168.1.1` en `srv-mareas`, `ip a show ens3` y `ping 192.168.1.65` en `Portatil`, `ipconfig` en `Puesto-1` y `Puesto-2`, y `show ip` en `Impresora-1`, `Impresora-2` y `Movil-cliente`.
- **Antes:**
  ```text
  administrador@srv-mareas:~$ ip a show ens3
      inet 192.168.1.10/24 brd 192.168.1.255 scope global ens3
  ```
  Toda la red operaba bajo una única máscara `/24` sin subinterfaces VLAN en `Router-operadora`.
- **Después:**
  ```text
  [admin@Router-operadora] > /ip address print
  Flags: D - DYNAMIC
  Columns: ADDRESS, NETWORK, INTERFACE
  #   ADDRESS            NETWORK        INTERFACE
  0   192.168.1.1/28     192.168.1.0    vlan10
  1   192.168.1.65/26    192.168.1.64   vlan20
  2   192.168.1.129/26   192.168.1.128  vlan30
  3 D 192.168.122.51/24  192.168.122.0  ether6

  administrador@srv-mareas:/etc/netplan$ ip a show ens3
  2: ens3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
      inet 192.168.1.10/28 brd 192.168.1.15 scope global ens3

  administrador@srv-mareas:/etc/netplan$ ping 192.168.1.1
  PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.
  64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=12.5 ms
  64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=9.13 ms
  ```
  *(Evidencia adjunta en capturas de `Router-operadora`, `srv-mareas` y `Portatil` mostrando `inet 192.168.1.68/26 brd 192.168.1.127` y `ping 192.168.1.65` con `6 packets transmitted, 6 received, 0% packet loss`).*
- **¿Sigue funcionando tras reiniciar?:** Sí. RouterOS guarda automáticamente; `srv-mareas` carga `/etc/netplan/01-gestoria.yaml` al arrancar; los VPCS (`Impresora-1`, `Impresora-2`, `Movil-cliente`) guardaron su estado con `save`; `Portatil` conserva su perfil `Manual` en NetworkManager; y `Puesto-1`/`Puesto-2` mantienen sus direcciones estáticas en Windows.
- **¿La gestoría sigue trabajando? Qué se ha probado:** Sí. Cada equipo alcanza su puerta de enlace (`192.168.1.1`, `192.168.1.65` y `192.168.1.129`) y dispone de salida a Internet mediante NAT (`masquerade`) por `ether6`.
- **Comprobado por:** Alejandro Álvarez Romero

---

### 6.3 Medida: Aislamiento de la red WiFi de clientes/sala de espera (`VLAN 30`) mediante cortafuegos
- **Qué se comprueba:** Que ningún dispositivo conectado en la red de clientes/invitados (`VLAN 30`, `192.168.1.128/26`) puede iniciar tráfico hacia la subred de servidores (`VLAN 10`, `192.168.1.0/28`) ni hacia los equipos e impresoras de la plantilla (`VLAN 20`, `192.168.1.64/26`).
- **Cómo se ha comprobado (orden, desde qué equipo):** Desde `Movil-cliente` (`192.168.1.130`, situado en la red de riesgo `VLAN 30`), ejecución de `ping 192.168.1.129` (su puerta de enlace), `ping 192.168.1.10` (servidor) y `ping 192.168.1.69` (`Puesto-1`), junto con la revisión de `/ip firewall filter print` en `Router-operadora`.
- **Antes:**
  ```text
  [admin@Router-operadora] > /ip firewall filter print
  Flags: X - disabled, I - invalid; D - dynamic
  (tabla vacía: el router enrutaba paquetes entre todas las VLANs sin restricciones)
  ```
- **Después:**
  ```text
  [admin@Router-operadora] > /ip firewall filter print
   2   chain=forward action=drop in-interface=vlan30 out-interface=vlan10
   3   chain=forward action=drop in-interface=vlan30 out-interface=vlan20

  Movil-cliente> ping 192.168.1.129
  84 bytes from 192.168.1.129 icmp_seq=1 ttl=64 time=1.421 ms

  Movil-cliente> ping 192.168.1.10
  192.168.1.10 icmp_seq=1 timeout
  192.168.1.10 icmp_seq=2 timeout
  192.168.1.10 icmp_seq=3 timeout

  Movil-cliente> ping 192.168.1.69
  192.168.1.69 icmp_seq=1 timeout
  192.168.1.69 icmp_seq=2 timeout
  ```
- **¿Sigue funcionando tras reiniciar?:** Sí. Las reglas `2` y `3` en `/ip firewall filter` persisten tras reiniciar `Router-operadora` y los intentos de conexión desde `Movil-cliente` hacia `VLAN 10` y `VLAN 20` siguen devolviendo `timeout`.
- **¿La gestoría sigue trabajando? Qué se ha probado:** Sí. Los clientes de la sala de espera conservan conectividad con su gateway (`192.168.1.129`) y salida a Internet por `ether6`, sin interferir en la operativa interna de `VLAN 20` ni `VLAN 10`.
- **Comprobado por:** Alejandro Álvarez Romero

---

### 6.4 Medida: Filtrado selectivo de servicios entre Plantilla y Servidores (`VLAN 20` -> `VLAN 10`)
- **Qué se comprueba:** Que los puestos de empleados (`VLAN 20`) solo pueden comunicarse con el servidor `srv-mareas` (`192.168.1.10`, `VLAN 10`) mediante los puertos autorizados de trabajo (**TCP 80 HTTP** y **TCP 445 Samba**), descartándose cualquier otro protocolo o sondeo (como paquetes ICMP `ping` o puertos administrativos no permitidos).
- **Cómo se ha comprobado (orden, desde qué equipo):** Desde `Portatil` (`192.168.1.68`, `VLAN 20`), ejecución de `ping 192.168.1.10` (intento de tráfico ICMP bloqueado) y acceso mediante navegador Firefox a `http://192.168.1.10` (tráfico permitido en puerto TCP `80`).
- **Antes:**
  ```text
  laura@laura-Standard-PC-i440FX-PIIX-1996:~$ ping 192.168.1.10
  64 bytes from 192.168.1.10: icmp_seq=1 ttl=63 time=4.12 ms
  ```
  Antes de aplicar las reglas en la cadena `forward`, cualquier equipo de `VLAN 20` podía realizar sondeos ICMP y alcanzar todos los puertos del servidor.
- **Después:**
  ```text
  [admin@Router-operadora] > /ip firewall filter print
   0   chain=forward action=accept protocol=tcp in-interface=vlan20
       out-interface=vlan10 dst-port=80,445
   1   chain=forward action=drop in-interface=vlan20 out-interface=vlan10

  laura@laura-Standard-PC-i440FX-PIIX-1996:~$ ping 192.168.1.10
  PING 192.168.1.10 (192.168.1.10) 56(84) bytes of data.
  ^C
  --- 192.168.1.10 ping statistics ---
  58 packets transmitted, 0 received, 100% packet loss, time 58362ms
  ```
  *(Evidencia visual en captura de Firefox desde `Portatil` en `http://192.168.1.10`: carga correcta de la página **«Welcome to nginx!»**).*
- **¿Sigue funcionando tras reiniciar?:** Sí. El orden de evaluación (`0` `accept` antes de `1` `drop`) permanece guardado en MikroTik tras reiniciar; el `ping` sigue dando `100% packet loss` y la web interna sigue accesible.
- **¿La gestoría sigue trabajando? Qué se ha probado:** Sí. Desde `Portatil` (`192.168.1.68`) carga correctamente el servicio web interno en `http://192.168.1.10` (puerto `80`) y permanece habilitado el puerto `445` para las carpetas compartidas Samba.
- **Comprobado por:** Alejandro Álvarez Romero

---

### 6.5 Medida: Acceso externo acotado por IP origen para la Asesoría Fiscal (`NAT / FTP`)
- **Qué se comprueba:** Que la redirección de puertos FTP (`dst-nat` en TCP `21` y rango pasivo `40000-40050`) hacia `srv-mareas` (`192.168.1.10`) en la interfaz exterior `ether6` (`192.168.122.51`) acepta exclusivamente conexiones procedentes de la IP autorizada de la Asesoría Fiscal (`192.168.122.50`), descartando peticiones de cualquier otra dirección externa.
- **Cómo se ha comprobado (orden, desde qué equipo):** Revisión de `/ip firewall nat print` en `Router-operadora` y prueba de conexión `ftp 192.168.122.51` desde `Asesoria-fiscal` (`192.168.122.50`) frente a un intento desde otra IP externa no autorizada.
- **Antes:**
  ```text
  [admin@Router-operadora] > /ip firewall nat print
   0   chain=srcnat action=masquerade out-interface=ether1
  ```
  No existía redirección de entrada operativa en `ether6`, impidiendo el intercambio de ficheros con la asesoría.
- **Después:**
  ```text
  [admin@Router-operadora] > /ip firewall nat print
  Flags: X - disabled, I - invalid; D - dynamic
   0   chain=srcnat action=masquerade out-interface=ether6

   1   ;;; FTP-asesoria
       chain=dstnat action=dst-nat to-addresses=192.168.1.10 protocol=tcp
       src-address=192.168.122.50 in-interface=ether6 dst-port=21

   2   ;;; FTP-pasivo-asesoria
       chain=dstnat action=dst-nat to-addresses=192.168.1.10 protocol=tcp
       src-address=192.168.122.50 in-interface=ether6 dst-port=40000-40050
  ```
  Desde `Asesoria-fiscal` (`192.168.122.50`), la conexión `ftp 192.168.122.51` alcanza el servicio FTP de `srv-mareas`, mientras que desde cualquier otra dirección IP externa la petición no obtiene respuesta.
- **¿Sigue funcionando tras reiniciar?:** Sí. Las reglas `0`, `1` y `2` de `/ip firewall nat` sobre `ether6` permanecen guardadas en `Router-operadora` tras reiniciar el entorno.
- **¿La gestoría sigue trabajando? Qué se ha probado:** Sí. La Asesoría Fiscal mantiene el intercambio de documentación mediante FTP activo y pasivo (`40000-40050`) contra `192.168.122.51` sin exponer el puerto `21` a todo Internet.
- **Comprobado por:** Alejandro Álvarez Romero

---

## 7. Inventariar, reducir y acotar los servicios del servidor (7a)

**Estado:** Pendiente de ejecutar y verificar en GNS3.
**Equipo:** `srv-mareas` (Ubuntu Server, `192.168.1.10`, VLAN 10).
**Implanta:** Raúl Toledo Procopio · **Comprueba:** Hugo Pérez Arévalo.

Esta ficha es el procedimiento de trabajo. Los comandos y resultados que aparecen aquí son los que se deben ejecutar el lunes; todavía no son resultados obtenidos. Al terminar, sustituir los marcadores de captura por las imágenes reales y actualizar el estado en `responsables.md`.

### 7.1 Abrir el servidor y registrar el estado inicial

1. En GNS3, abrir el proyecto y arrancar `srv-mareas` si está apagado.
2. Abrir la consola del nodo e iniciar sesión con una cuenta con permisos `sudo`.
3. Confirmar que se está trabajando en el servidor correcto y que conserva su dirección:

   ```bash
   hostname
   ip -br address
   ```

4. Guardar el inventario inicial de puertos y servicios:

   ```bash
   sudo ss -tulpn
   systemctl --type=service --state=running
   systemctl list-unit-files --type=service | grep -Ei 'inetd|avahi|bind9|named|dnsmasq|nmbd|smbd'
   ```

   La última orden puede no mostrar resultados si no hay unidades con esos nombres; en ese caso, revisar también el inventario completo. Anotar qué servicios aparecen y qué procesos escuchan en cada puerto. No desactivar un servicio solo por su nombre: confirmar antes que no lo necesita el servidor.

![7A-1: Consola de `srv-mareas` con hostname, IP e inventario inicial de puertos y servicios](Images/captura-7a-1.png)

### 7.2 Identificar qué servicios se pueden retirar

Revisar el inventario del paso anterior y decidir:

- **`inetd`:** si está instalado y no presta ningún servicio necesario, identificar el nombre exacto de su unidad y detenerla/deshabilitarla. Por ejemplo, usar `inetd.service` solo si ese es el nombre que muestra el sistema:

  ```bash
  sudo systemctl disable --now inetd.service
  ```

- **`avahi-daemon`:** si está instalado y no se usa para descubrir servicios en la red, deshabilitarlo:

  ```bash
  sudo systemctl disable --now avahi-daemon.service
  ```

- **DNS:** deshabilitar únicamente un servidor DNS (por ejemplo, `bind9`, `named` o `dnsmasq`) si se confirma que no lo usa ningún equipo. No deshabilitar `systemd-resolved` por esta medida: suele ser el resolvedor local del propio Ubuntu, no un servicio DNS que se ofrezca a la red.
- **NetBIOS:** se deshabilitará para Samba en el paso 7.3. Si existe `nmbd.service`, detenerlo y deshabilitarlo después de comprobar que los puestos pueden acceder al recurso por IP y SMB:

  ```bash
  sudo systemctl disable --now nmbd.service
  ```

Si una unidad no existe, no ejecutar a ciegas el ejemplo: usar el nombre exacto encontrado en el inventario o anotar que ese servicio no está instalado. No desinstalar paquetes en esta práctica; deshabilitar el servicio permite revertir el cambio si se detecta una dependencia. Para recuperar un servicio que se haya deshabilitado y resulte necesario, usar su nombre exacto:

```bash
sudo systemctl enable --now nombre-de-la-unidad.service
```

![7A-2: Inventario de unidades y decisión de cuáles deshabilitar o mantener](Images/captura-7a-2.png)

### 7.3 Hacer copia y limitar Samba a la VLAN de empleados

1. Revisar la configuración actual del recurso y crear una copia antes de editar:

   ```bash
   sudo testparm -s
   sudo cp -a /etc/samba/smb.conf /etc/samba/smb.conf.bak-7a
   sudo nano /etc/samba/smb.conf
   ```

   Si `/etc/samba/smb.conf.bak-7a` ya existe de un intento anterior, conservarlo y crear la copia actual con otro nombre; usar esa copia si hay que revertir.

2. En la sección `[global]`, actualizar las opciones existentes —sin dejar valores duplicados o contradictorios— para que queden así:

   ```ini
   [global]
   hosts allow = 192.168.1.64/26 127.0.0.1
   map to guest = Never
   server min protocol = SMB3_00
   disable netbios = yes
   smb ports = 445
   ```

   `192.168.1.64/26` corresponde a la VLAN 20 (`192.168.1.64`–`192.168.1.127`); `192.168.1.0/26` no es la red de empleados. Mantener el nombre y la ruta actuales del recurso `[clientes]`; no sustituirlos por datos de ejemplo.

3. En la sección existente `[clientes]`, establecer:

   ```ini
   guest ok = no
   ```

   Mantener las opciones de escritura y la ruta actuales si son necesarias para el trabajo de la gestoría. No añadir una segunda sección `[clientes]`.

4. Validar la sintaxis antes de reiniciar Samba:

   ```bash
   sudo testparm
   ```

   Si `testparm` muestra errores, no reiniciar el servicio: corregir el archivo y volver a validar. Si la validación es correcta, aplicar los cambios:

   ```bash
   sudo systemctl restart smbd
   sudo systemctl status smbd --no-pager
   ```

   Si el servicio no vuelve a arrancar, restaurar la copia y comprobarla antes de volver a intentarlo:

   ```bash
   sudo cp -a /etc/samba/smb.conf.bak-7a /etc/samba/smb.conf
   sudo testparm
   sudo systemctl restart smbd
   ```

![7A-3: Configuración efectiva de Samba y resultado satisfactorio de testparm](Images/captura-7a-3.png)

### 7.4 Comprobar la reducción de puertos

Después de los cambios, ejecutar:

```bash
sudo ss -tulpn
```

Comparar con la captura inicial. Comprobar que ya no escuchan los servicios que se hayan deshabilitado. Samba debe seguir disponible por TCP `445`; NetBIOS (`137/udp`, `138/udp` y `139/tcp`) no debe estar expuesto. No exigir que desaparezcan servicios que se hayan identificado y justificado como necesarios.

![7A-4: Puertos tras los cambios, con Samba en TCP 445 y sin los servicios retirados](Images/captura-7a-4.png)

### 7.5 Verificar el acceso de la plantilla y el bloqueo de invitados

Desde un equipo de la plantilla conectado a VLAN 20 (por ejemplo, `Portatil`, `192.168.1.68`):

1. Abrir `\\192.168.1.10\clientes` en el explorador de archivos.
2. Cuando se solicite, iniciar sesión con una cuenta autorizada de Samba; comprobar que se puede abrir el recurso y realizar las operaciones de trabajo previstas.
3. Comprobar que el acceso sin credenciales no permite entrar. Si Windows reutiliza credenciales guardadas, realizar esta prueba desde un cliente sin una sesión previa de Samba o usar una sesión de invitado explícita.

No usar `ping` como prueba de disponibilidad del servidor desde VLAN 20: el firewall de la maqueta bloquea ICMP entre VLAN 20 y VLAN 10. La prueba válida para esta medida es el acceso al recurso por SMB/TCP 445.

![7A-5: Acceso correcto al recurso clientes desde VLAN 20 con una cuenta autorizada](Images/captura-7a-5.png)

![7A-6: Intento de acceso de invitado o sin credenciales rechazado](Images/captura-7a-6.png)

### 7.6 Comprobar persistencia y documentar el resultado

Cuando las pruebas anteriores hayan sido satisfactorias y se pueda interrumpir el servidor, reiniciar `srv-mareas` desde GNS3. Después del arranque:

```bash
sudo ss -tulpn
sudo systemctl is-enabled smbd
sudo systemctl is-active smbd
```

Confirmar que Samba continúa activo, que los servicios deshabilitados siguen detenidos y que el equipo de VLAN 20 mantiene acceso al recurso. Si el servidor pide desbloquear o montar un volumen cifrado al arrancar, hacerlo conforme al procedimiento del proyecto antes de probar los documentos.

![7A-7: Comprobaciones posteriores al reinicio y acceso SMB restaurado](Images/captura-7a-7.png)

**Resultado real (completar el lunes):**
- Servicios deshabilitados y motivo: `[anotar]`
- Puertos que siguen escuchando y motivo: `[anotar]`
- Acceso autenticado desde VLAN 20: `[correcto / incorrecto; describir]`
- Acceso de invitado: `[bloqueado / no comprobado; describir]`
- Persistencia tras reiniciar: `[correcta / incorrecta / no comprobada; describir]`
- Incidencias o cambios revertidos: `[anotar o indicar “ninguno”]`
- Fecha de ejecución: `[completar]`
- Comprobado por: `[completar]`

**Criterio para marcar la medida como verificada:** la configuración pasa `testparm`, los servicios innecesarios seleccionados ya no escuchan, Samba sigue activo solo en los puertos previstos, una cuenta autorizada de VLAN 20 accede al recurso, el acceso de invitado queda bloqueado y los cambios persisten tras reiniciar. Si alguna comprobación no se realiza, dejarla indicada como pendiente y no marcar la medida como verificada.

---

## Criterios de Aceptación del Cliente

| Criterio de aceptación | Dónde se comprueba |
| :--- | :--- |
| **1. Si nos roban otro portátil…** *(que la sustracción o conexión de un equipo no comprometa el servidor ni el resto de la red)* | Ficha **«Segmentación de red en Capa 2 mediante VLANs y enlace troncal 802.1Q»** y Ficha **«Filtrado selectivo de servicios entre Plantilla y Servidores (`VLAN 20` -> `VLAN 10`)»** (aislamiento entre departamentos y acceso limitado solo a puertos TCP `80,445`). |
| **2. Que los clientes de la sala de espera (WiFi) no puedan ver ni atacar los equipos de la oficina ni el servidor** | Ficha **«Segmentación de red en Capa 2 mediante VLANs y enlace troncal 802.1Q»** (`Gi1/3` en `VLAN 30`) y Ficha **«Aislamiento de la red WiFi de clientes/sala de espera (`VLAN 30`) mediante cortafuegos»** (`ping` desde `Movil-cliente` hacia `192.168.1.10` y `192.168.1.69` con `timeout`). |
| **3. Que los clientes de la sala de espera sigan teniendo salida a Internet** | Ficha **«Aislamiento de la red WiFi de clientes/sala de espera (`VLAN 30`) mediante cortafuegos»** (`Movil-cliente` alcanza `192.168.1.129` y navega mediante `masquerade` en `ether6`). |
| **4. Que la Asesoría Fiscal externa pueda enviar y recibir ficheros por FTP sin abrir el servidor a todo Internet** | Ficha **«Acceso externo acotado por IP origen para la Asesoría Fiscal (`NAT / FTP`)»** (`dst-nat` en `ether6` puertos `21` y `40000-40050` acotado a `src-address=192.168.122.50`). |
| **5. Que la plantilla pueda seguir trabajando con normalidad (web interna, carpetas compartidas e impresoras)** | Ficha **«Filtrado selectivo de servicios entre Plantilla y Servidores (`VLAN 20` -> `VLAN 10`)»** (acceso web a `http://192.168.1.10` en Firefox y apertura de TCP `445`) y Ficha **«Direccionamiento IP mediante VLSM y Enrutamiento Inter-VLAN»** (comunicación con `Impresora-1` e `Impresora-2` en `VLAN 20`). |
| **6. Que la red esté ordenada por departamentos y sin desperdicio de direcciones IP** | Ficha **«Direccionamiento IP mediante VLSM y Enrutamiento Inter-VLAN»** (subredes `/28` en `VLAN 10` y `/26` en `VLAN 20` y `VLAN 30`). |
| **7. Que las configuraciones sean persistentes tras reiniciar y no interrumpan el servicio** | Campo **«¿Sigue funcionando tras reiniciar?»** de las fichas de red y la ficha **«Inventariar, reducir y acotar los servicios del servidor»** (persistencia de servicios y acceso Samba tras reiniciar `srv-mareas`). |