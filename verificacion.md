# 1. Verificación del cifrado del portatil y la partición del servidor

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

## Verificación Portatil

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

# Luis

## Medida: Comprobar las protecciones del sistema y confinar un servicio

**Equipo:** `srv-mareas` (Ubuntu 24.04.5 LTS, kernel 6.8) · **Implanta:** Luis Baena · **Comprueba:** resto del equipo

### 1. Punto de partida: qué traía el sistema

Antes de cambiar nada, revisamos el estado de las protecciones del núcleo:

```bash
sysctl kernel.randomize_va_space kernel.kptr_restrict kernel.yama.ptrace_scope \
  kernel.dmesg_restrict kernel.perf_event_paranoid kernel.unprivileged_bpf_disabled \
  kernel.kexec_load_disabled kernel.sysrq fs.suid_dumpable fs.protected_symlinks \
  fs.protected_hardlinks fs.protected_fifos fs.protected_regular \
  net.ipv4.conf.all.accept_redirects net.ipv4.conf.all.send_redirects \
  net.ipv4.conf.all.log_martians net.ipv4.tcp_syncookies
```

![sysctl antes](Images/7b-01-sysctl-antes.png)

| Parámetro | De serie | Estado |
|---|---|---|
| `kernel.randomize_va_space` | 2 | Ya protege (ASLR completo) |
| `kernel.dmesg_restrict` | 1 | Ya protege |
| `kernel.perf_event_paranoid` | 4 | Ya protege |
| `kernel.unprivileged_bpf_disabled` | 2 | Ya protege |
| `fs.protected_symlinks` / `hardlinks` | 1 / 1 | Ya protege |
| `fs.protected_regular` | 2 | Ya protege |
| `net.ipv4.tcp_syncookies` | 1 | Ya protege |
| `kernel.kptr_restrict` | 1 | Parcial |
| `kernel.yama.ptrace_scope` | 1 | Parcial |
| `kernel.kexec_load_disabled` | 0 | Abierto |
| `kernel.sysrq` | 176 | Abierto |
| `fs.suid_dumpable` | 2 | Abierto |
| `net.ipv4.conf.all.accept_redirects` | 1 | Abierto |
| `net.ipv4.conf.all.send_redirects` | 1 | Abierto |
| `net.ipv4.conf.all.log_martians` | 0 | Abierto |

Ningún servicio expuesto venía confinado: AppArmor está activo, pero ni `smbd`, ni `nginx`, ni `vsftpd` tienen perfil.

![AppArmor antes](Images/7b-02-apparmor-antes.png)

### 2. Núcleo: parámetros cerrados

Se crea `/etc/sysctl.d/99-mareas.conf` con los 8 parámetros abiertos (motivos en `decisiones.md`, D-L1) y se aplica con `sudo sysctl --system`. La salida muestra cómo `99-mareas.conf` se carga después de los ficheros de serie y sobrescribe sus valores:

![sysctl aplicado](Images/7b-03-sysctl-aplicado.png)

**Incidencia 1:** por una errata en el nombre (`kexec_load_disablde`), ese parámetro no se aplicó al principio. Se detectó al comprobar su valor, se corrigió y se verificó:

![kexec corregido](Images/7b-03b-kexec-ok.png)

**Incidencia 2:** tras el primer reinicio, `fs.suid_dumpable` volvió a valer 2 porque Apport lo restablece al arrancar. Se desactivó Apport (`decisiones.md`, D-L2):

![Apport desactivado](Images/7b-11b-apport-desactivado.png)

**Resultado tras reiniciar** (`uptime` = 5 min):

| Parámetro | Esperado | Obtenido |
|---|---|---|
| `kernel.kptr_restrict` | 2 | 2 |
| `kernel.yama.ptrace_scope` | 2 | 2 |
| `kernel.kexec_load_disabled` | 1 | 1 |
| `kernel.sysrq` | 0 | 0 |
| `fs.suid_dumpable` | 0 | 0 |
| `net.ipv4.conf.all.accept_redirects` | 0 | 0 |
| `net.ipv4.conf.all.send_redirects` | 0 | 0 |
| `net.ipv4.conf.all.log_martians` | 1 | 1 |

![sysctl tras reinicio](Images/7b-11-sysctl-tras-reinicio.png)

### 3. Confinamiento de Samba (`smbd`)

**Comprobación previa de la configuración** (`testparm -s`): la carpeta compartida es `/srv/gestoria/clientes`, no hay recurso `[homes]` y `[printers]` usa `/var/tmp`.

![testparm](Images/7b-04a-testparm.png)

**Antes:**

| Prueba | Resultado |
|---|---|
| `systemd-analyze security smbd` | **9.6 UNSAFE** |
| `nsenter -t <PID smbd> -m touch /etc/prueba-luis` | El fichero se crea: Samba puede escribir en `/etc` |

![nota antes](Images/7b-04b-smbd-nota-antes.png)
![escribe antes](Images/7b-05-smbd-escribe-antes.png)

**Cambio aplicado:** drop-in en `/etc/systemd/system/smbd.service.d/confinamiento.conf` (motivos en `decisiones.md`, D-L3 y D-L4).

![confinamiento](Images/7b-06-confinamiento.png)

`systemctl status smbd` muestra el drop-in cargado y el servicio `active (running)`:

![status](Images/7b-07-smbd-status.png)

**Después:**

| Prueba | Resultado |
|---|---|
| `systemd-analyze security smbd` | **6.0 MEDIUM** |
| `nsenter -t <PID smbd> -m touch /etc/prueba-luis` | `Read-only file system` → **bloqueado** |
| `nsenter -t <PID smbd> -m ls /home` | Vacío: Samba no ve las carpetas personales (un `ls /home` normal sí las muestra) |

![nota después](Images/7b-08-smbd-nota-despues.png)
![bloqueado](Images/7b-09-smbd-bloqueado.png)

### 4. La gestoría sigue trabajando

Prueba local con el servicio ya confinado: crear una carpeta en el recurso de clientes, listarla y borrarla.

```bash
smbclient //127.0.0.1/clientes -N -c "mkdir prueba-luis; ls; rmdir prueba-luis"
```

Resultado: se crea `prueba-luis` junto a las carpetas de los clientes y se borra sin errores.

![samba funciona](Images/7b-10-samba-funciona.png)

**Tras reiniciar el servidor:** el drop-in se sigue cargando, el `touch` en `/etc` sigue bloqueado y la carpeta de clientes sigue accesible.

![status tras reinicio](Images/7b-12a-smbd-status-tras-reinicio.png)
![bloqueado tras reinicio](Images/7b-12b-smbd-bloqueado-tras-reinicio.png)
![samba tras reinicio](Images/7b-13-samba-tras-reinicio.png)

**Pendiente:** prueba desde un puesto Windows de la VLAN 20 (`\\192.168.1.10\clientes`: crear, editar y borrar un fichero) cuando estén aplicadas la segmentación y la autenticación personal en Samba.

---

## Medida: Proteger el acceso a BIOS/UEFI y el arranque

**Equipos:** `srv-mareas` y `Portatil` · **Implanta:** Luis Baena · **Comprueba:** resto del equipo

### 1. Punto de partida (igual en los dos equipos)

| Comprobación | Resultado |
|---|---|
| `GRUB_TIMEOUT_STYLE` / `GRUB_TIMEOUT` | `hidden` / `0`: el menú está oculto, pero aparece pulsando una tecla |
| `GRUB_DISABLE_RECOVERY` | Comentado: **modo recuperación activo** (shell de root sin contraseña) |
| `superusers` / `password` en `grub.cfg` | Nada: **GRUB sin contraseña** |
| Firmware de la VM | BIOS clásica (SeaBIOS): no existe `/sys/firmware/efi` y *Enable UEFI boot mode* está desactivado |

![grub antes servidor](Images/6a-01-grub-antes.png)
![grub antes portátil](Images/6a-20-portatil-grub-antes.png)
![bios legacy](Images/6a-13-bios-legacy.png)

### 2. Configuración aplicada en GRUB (servidor y portátil)

1. Hash PBKDF2 de la contraseña, generado con `grub-mkpasswd-pbkdf2`. Se guarda en una variable para no tener que copiarlo a mano, y después se borra la variable.
2. `/etc/grub.d/40_custom`: `set superusers="admingrub"` y `password_pbkdf2 admingrub grub.pbkdf2.sha512...`.
3. `/etc/grub.d/10_linux`: `--unrestricted` en `CLASS=`, para que el arranque normal no pida contraseña.
4. `/etc/default/grub`: `GRUB_DISABLE_RECOVERY="true"`.
5. Solo en el portátil: `chmod -x /etc/grub.d/20_memtest86+`.
6. `sudo update-grub`.

Comprobación en `grub.cfg`: aparecen `superusers` y `password_pbkdf2`, las entradas de Ubuntu llevan `--unrestricted` y no hay ninguna entrada de recuperación.

![grub config servidor](Images/6a-03-grub-config.png)
![update-grub servidor](Images/6a-04-update-grub.png)
![grub config portátil](Images/6a-21a-portatil-grub-config.png)
![update-grub portátil](Images/6a-21b-portatil-update-grub.png)

### 3. Prueba: GRUB protege la edición

| Prueba | Servidor | Portátil |
|---|---|---|
| Pulsar `e` en el menú | Pide usuario | Pide usuario |
| Credenciales incorrectas | Vuelve al menú sin editar | Vuelve al menú sin editar |
| `admingrub` + contraseña correcta | Abre el editor | Abre el editor |
| Arrancar memtest86+ | — | Pide usuario (después se retiró del menú) |

![grub pide usuario](Images/6a-05-grub-pide-usuario.png)
![grub deniega](Images/6a-06-grub-deniega.png)
![portátil deniega](Images/6a-24a-portatil-grub-deniega.png)
![portátil editor](Images/6a-24b-portatil-grub-editor.png)
![memtest protegido](Images/6a-24c-portatil-memtest-protegido.png)

En el portátil, el menú se mostró temporalmente para poder hacer la prueba (`GRUB_TIMEOUT_STYLE=menu`, `GRUB_TIMEOUT=15`) y después se restauró oculto (`hidden`, `0`):

![grub restaurado](Images/6a-26-portatil-grub-restaurado.png)

### 4. Prueba: el arranque normal no pide nada

- **Servidor:** se reinicia sin tocar nada y llega solo al login. Samba sigue dando servicio.
- **Portátil:** GRUB pasa sin pedir nada y lo siguiente que aparece es la petición de la clave LUKS (`Please unlock disk vda4_crypt`). Después llega al login.

![arranque normal servidor](Images/6a-07-arranque-normal.png)
![portátil sin pedir](Images/6a-25-portatil-grub-pasa-sin-pedir.png)

### 5. Arranque solo desde disco (GNS3)

| Ajuste | Servidor | Portátil |
|---|---|---|
| Boot priority | `HDD` (ya venía así) | `HDD` |
| Unidad de CD | Vacía | Vacía |
| Options | `-boot menu=off,strict=on` | `-vga qxl -boot menu=off,strict=on` |
| ¿Arranca después del cambio? | Sí | Sí |

![boot priority](Images/6a-09-gns3-boot-priority.png)
![cdrom](Images/6a-10-gns3-cdrom.png)
![advanced](Images/6a-11-gns3-advanced.png)
![portátil boot priority](Images/6a-22-portatil-boot-priority.png)
![portátil advanced](Images/6a-23-portatil-advanced.png)

**No se pudo probar con una ISO arrancable:** el servidor GNS3 no tiene ninguna imagen ISO (solo discos vacíos y ficheros OVMF). La protección se demuestra con la configuración de la VM. En el equipo real, la prueba sería conectar un USB con Kali y comprobar que el equipo arranca igualmente desde su disco.

### 6. La gestoría sigue trabajando

- El servidor arranca sin intervención y Samba sigue sirviendo la carpeta de clientes.
- Laura arranca su portátil igual que antes: solo la clave de LUKS, que es la medida de cifrado, y su login.
- Ninguna de estas medidas cambia la forma de trabajar de la plantilla.
