# SOURCE FILE: README.md

# Proyecto UD1: La maldición de la gestoría

**Equipo:** Alejandro, Raúl, Luis y Hugo  
**Objetivo:** documentar el diagnóstico, las medidas de seguridad, su implantación y verificación.

## Documentación
- [Diagnóstico](diagnostico.md)
- [Propuesta](propuesta.md)
- [Decisiones](decisiones.md)
- [Verificación](verificacion.md)
- [Responsables](responsables.md)
- [Aprendizaje](aprendizaje.md)

## GitHub Page
[Ver la página del proyecto](PEGA_AQUÍ_LA_URL_CUANDO_ESTÉ_PUBLICADA)


---

# SOURCE FILE: diagnostico.md

# Bloque 1 . El mapa y las direcciones

## ¿Qué equipos hay y cómo están conectados?
La red está formada por el operador externo, el router de la operadora, un switch de oficina, varios equipos de la LAN (servidor, portatil, puestos, impresoras y clientes móviles) y el acceso a Internet. La topología muestra cómo todos los dispositivos quedan conectados a la misma infraestructura interna.

![Captura 1](<Images/Captura 1.png>)
## ¿Qué direcciones tiene el router y en qué interfaz?
El router principal tiene dos redes principales: ether2 para la LAN interna (192.168.1.0/24) y ether1 para la red externa del operador (192.168.122.0/24). Se observa también la dirección por defecto de la puerta de enlace y la interfaz asignada a cada segmento.

![Captura 1](<Images/Captura 2.png>)
## ¿Qué direcciones reparte y a quién se las ha dado?
El DHCP tiene concesiones activas para estos equipos: el móvil, con la dirección 192.168.1.197; dos equipos identificados como `MSEDGEWIN10`, con 192.168.1.196 y 192.168.1.198; y el portátil de Laura (`portatil-laura`), con 192.168.1.200.

![Captura 1](<Images/Captura 3.png>)
![Captura 1](<Images/Captura 4.png>)

## ¿Por dónde sale a Internet?
La ruta por defecto del router apunta a la red externa del operador mediante la interfaz ether1, mientras que la red local se mantiene en ether2. Esto confirma que el tráfico saliente hacia Internet pasa por el router de la operadora antes de salir al exterior.

![Captura 1](<Images/Captura 5.png>)
## ¿Cómo está configurado el switch?
El switch tiene la VLAN 1 activa y los puertos Gi0/0 a Gi3/3 conectados a la LAN con estado “connected”. Se muestran también las direcciones MAC aprendidas por cada puerto, lo que confirma la infraestructura de acceso y la numeración de interfaces.

![Captura 1](<Images/Captura 6.png>) 	 	
## ¿Qué dirección tiene cada impresora?
Cada impresora tiene una IP fija dentro de la subred 192.168.1.0/24, con gateway 192.168.1.1 y configuración de red similar. La captura muestra que ambas están en la misma red local y accesibles desde la oficina.

![Captura 1](<Images/Captura 7.png>)
![Captura 1](<Images/Captura 8.png>)
## ¿Qué equipos tienen dirección fija y cuáles la reciben del router?

Los equipos que reciben IP por DHCP aparecen en el pool del router; los que tienen configuración fija se identifican porque no se muestran como concesiones del servidor DHCP. La diferencia entre ambos tipos de equipos queda reflejada en la asignación de direcciones dentro de la red local.

# Bloque 2 · El servidor por dentro

Diagnóstico de `srv-mareas`, en solo lectura.

## ¿Cómo se llama, qué sistema es y qué dirección tiene?

`srv-mareas`, Ubuntu 24.04.5 LTS (kernel 6.8.0-147) en una VM KVM. IP fija 192.168.1.10/24 en `ens3`, puerta de enlace 192.168.1.1.

## ¿Qué servicios están escuchando en la red y en qué puertos?

Abiertos a toda la red, FTP (21), SSH (22), puerto 23 (inetd; falta confirmar qué servicio sirve, normalmente Telnet), nginx (80), Samba (139 y 445) y NetBIOS (UDP 137 y 138). Solo en local, MariaDB (3306) y DNS (53).

## ¿Qué servicios están en marcha?

23 servicios en marcha. Además de los del sistema, corren inetd, nginx, MariaDB, Samba, vsftpd, ModemManager, multipathd y udisks2..

## ¿Qué usuarios existen?

`administrador` (la jefa), `informatico` (externo), `asesores` (cuenta compartida, con bash), `becario` (con bash) y `asesoriafiscal` (externa, sin shell).

## ¿Quién puede administrar el servidor?

`administrador` e `informatico` por el grupo `sudo`. Además, `becario` tiene `NOPASSWD: ALL` en `/etc/sudoers.d/becario`, permisos de root sin contraseña.

## ¿Quién ha entrado últimamente?

`last` solo muestra reinicios desde el 11 de octubre, ninguna sesión de usuario.

## ¿Qué carpetas se comparten, y con quién?

Samba comparte `[clientes]` (`/srv/gestoria/clientes`) con `guest ok = Yes` y `read only = No`: la configuración permite entrar sin contraseña a cualquiera que llegue al puerto 445.

## ¿Dónde están los documentos de los clientes y qué permisos tienen?

En `/srv/gestoria/clientes`.

## ¿Hay tareas programadas? ¿Qué hacen?

`root` no tiene crontab. En `/etc/cron.d` hay `e2scrub_all` y `sysstat` (de serie) y `gestoria` (personalizado). 

## ¿Cómo están organizados los discos?

`vda` con `vda1` (19 GB, ext4, `/`), `vda15` (EFI) y `vda16` (`/boot`). Sin cifrado LUKS en `vda` y con `/srv` en la misma partición que el sistema. 

# Bloque 3. El portátil y los puestos 

### Al encender el portátil, ¿pide algo antes de llegar  al      inicio de sesión?	

No, la consola inicia sesión hasta llegar a los diferentes usuarios que te pide las credenciales.

### ¿Quién lo usa y qué permisos tiene?

Laura Medina, tiene permisos de usuario normal ya que tiene ID 1001

### ¿Qué documentos hay guardados en él?	

Una carpeta clientes y dentro de la carpeta, declaración-caleta.txt , nomina-puerto-real.txt y notas-populo.txt.

### ¿Cómo están sus discos?	

Están perfectos, el disco principal tiene 217gb total y le falta por ocupar 199gb

### ¿Qué dirección tiene y de dónde la saca?	

El portátil tiene dirección IP es 192.168.1.200/24 y viene de la dirección de red de 192.168.1.0/24

### ¿Qué dirección tiene el puesto y de dónde la saca?	

La dirección que tiene el puesto es la 192.168.1.198/24 y la saca de la dirección de red 192.168.1.0/24

### ¿Cómo llega el puesto a los documentos de los clientes?	

No hay entradas en la lista, la nuevas conexiones serán recordadas.

### ¿Qué usuarios hay en el puesto?	

Esta Administrador, DefaultAccount, Guest, IEUser, sshd y WDAGUtilityAccount.

### ¿Está cifrado el disco del puesto?	

No reconoce el comando y por lo que he estado investigando es porque la herramienta de BitLocker no esta instalada o el sistema operativo no es compatible con la herramienta, pero en resumidas cuentas, el disco no esta cifrado.


# Bloque 4

 ###  ¿Qué dirección recibe el móvil de un cliente?
    Movil> ip dhcp 
    DORRA IP 192.168.1.197/24 GW 192.168.1.1

    Movil> show ip
    NAME        : Movil[1]  
    IP/MASK     : 192.168.1.197/24  
    GATEWAY     : 192.168.1.1  
    DNS         : 192.168.1.1  
    DHCP SERVER : 192.168.1.1  
    DHCP LEASE  : 86391, 86400/43200/75600  
    MAC         : 00:50:79:66:68:00  
    LPORT       : 20108  
    RHOST:PORT  : 127.0.0.1:20109  
    MTU         : 1500

	

###  Desde ese móvil, ¿se llega al servidor? ¿A las impresoras? ¿Al router? ¿A Internet?

- **Servidor:** Si.
- **Impresoras:** No.
- **Router:** Si.
- **Internet:** Si.



###  ¿Qué dirección tiene la asesoría fiscal y dónde está respecto a la oficina?
- 192.168.122.50/24
- Ubicación respecto a la oficina: Está situada en el exterior (WAN / red de la operadora), conectada directamente al switch Operadora. Se encuentra fuera del perímetro de la LAN de Mareas Asesores, simulando un servicio o sede remota accesible únicamente a través del enlace de Internet.

###  ¿Qué se deja pasar desde fuera hacia la oficina?
Canal de control FTP:

1. Regla 1 (FTP-asesoria): Todo el tráfico TCP entrante por ether1 al puerto 21 se redirige a la IP interna 192.168.1.10:21.

Canal de datos FTP en modo pasivo:

2. Regla 2 (FTP-pasivo-asesoria): Todo el tráfico TCP entrante por ether1 en el rango de puertos 40000 al 40050 se redirige a la IP interna 192.168.1.10 a ese mismo rango de puertos.

###  ¿Qué servicios ofrece el propio router?
         NAME     PORT  CERTIFICATE  VRF  
      0   telnet     23               main  
      1   ftp        21  
      2   www        80               main  
      3   ssh        22               main  
      4 X www-ssl   443  none         main  
      5   api      8728               main  
      6   winbox   8291               main  
      7   api-ssl  8729  none         main  


###  Desde la asesoría, ¿se llega a la dirección exterior del router?

Si se llega.


---

# SOURCE FILE: propuesta.md

# 1. LA RED

#### 1.1 Esquema Nueva Red.

![Dibujo_RED](./Images/cambio%20red.jpg)

#### 1.2 ¿Porqué hacemos así la Red?.

Para segmentar la infraestructura de forma segura, implementaremos tres redes locales virtuales (VLAN). La primera de ellas es la VLAN 10, dedicada en exclusiva al servidor, a la cual se accederá desde la red interna de los empleados y, de forma controlada, desde el exterior.

**¿Cómo funciona la comunicación con el exterior?**
Para cumplir con la premisa de no alterar la forma de trabajar de clientes externos, mantendremos el protocolo FTP que utiliza la Asesoría Fiscal. Sin embargo, para mitigar el riesgo de exponer este servicio en texto claro a todo Internet, se acotará estrictamente en el firewall del router: la regla de redirección (NAT) hacia el servidor solo admitirá peticiones de conexión que provengan de la IP pública conocida de la Asesoría Fiscal (`192.168.122.50`). Cualquier otro intento de conexión al puerto 21 desde el exterior será descartado automáticamente.

Por otro lado, configuraremos la VLAN 20 para albergar a toda la plantilla de la gestoría (puestos e impresoras). Desde esta red, los empleados tendrán salida a Internet y acceso controlado al servidor.

Finalmente, se habilitará la VLAN 30 para aislar la red inalámbrica que se ofrece a los clientes en la sala de espera, limitando su conexión estrictamente a Internet. El equipo de auditoría y pruebas (Kali) se mantendrá fuera del entorno de producción.

<br>

#### 1.3 Reparto de Direcciones.

Se ha modificado el orden de asignación en la VLAN 10 para garantizar que el servidor reciba la dirección IP más pequeña disponible en su subred.

| Segmento y función | VLAN | Red / prefijo | Rango utilizable | Puerta de enlace (Gateway) |
| --- | --- | --- | --- | --- |
| Servidores y Gestión | VLAN 10 | 192.168.1.0/28 | 192.168.1.1 - 192.168.1.14 | 192.168.1.1 |
| Empleados (Plantilla) | VLAN 20 | 192.168.1.64/26 | 192.168.1.65 - 192.168.1.126 | 192.168.1.65 |
| Clientes (WiFi) | VLAN 30 | 192.168.1.128/26 | 192.168.1.129 - 192.168.1.190 | 192.168.1.129 |

<br>

#### 1.4 ¿Qué se permite y qué se bloquea?

- **Bloqueo hacia recursos internos desde la sala de espera:** Se deniega cualquier intento de conexión desde la VLAN 30 (Clientes) hacia la red de los empleados o hacia el servidor. Los clientes solo dispondrán de salida a Internet.
- **Acceso externo confinado (FTP acotado):** La Asesoría Fiscal externa tiene permitido el acceso FTP (puertos 21 y 40000-40050) hacia el servidor en la VLAN 10, pero el router bloqueará cualquier intento de conexión a estos puertos que no provenga de la IP específica de la asesoría (`192.168.122.50`).
- **Acceso interno acotado:** La plantilla (VLAN 20) tiene permitido el acceso a Internet y la comunicación con el servidor (VLAN 10) restringida a los puertos 445 (Samba) y 80 (HTTP).

# 2. LAS MEDIDAS

### Medida: Aislar la red de clientes mediante VLAN
- **Qué problema resuelve y cómo lo sabemos:** El móvil de un cliente recibe una IP de la misma red que la oficina (`192.168.1.0/24`) y puede alcanzar el servidor.
- **Qué hacemos:** endurecer
- **Qué cambiamos y en qué equipo:** Configurar la VLAN 30 en el switch y router existentes. Permitir desde ella solo acceso a Internet.
- **A quién afecta:** A los clientes en la sala de espera.
- **Cómo comprobaremos que protege y que la gestoría sigue trabajando:** Desde el móvil del cliente, comprobar que recibe IP de la nueva red, sale a Internet y el ping al servidor o impresoras es rechazado.

### Medida: Segmentar la red interna mediante VLAN
- **Qué problema resuelve y cómo lo sabemos:** El switch muestra activa la VLAN 1 y todos conviven en el mismo dominio de difusión.
- **Qué hacemos:** endurecer
- **Qué cambiamos y en qué equipo:** Crear VLAN 10 y 20 en el switch. Configurar enrutamiento y reglas de firewall en el router MikroTik para permitir a la VLAN 20 alcanzar solo puertos específicos de la VLAN 10.
- **A quién afecta:** Transparente para la plantilla.
- **Cómo comprobaremos que protege y que la gestoría sigue trabajando:** Verificar que un puesto de la VLAN 20 accede a la carpeta compartida, pero no puede lanzar tráfico no autorizado a otras subredes.

### Medida: Proteger el acceso a BIOS/UEFI y el arranque
- **Qué problema resuelve y cómo lo sabemos:** El portátil no pide credenciales antes del inicio y permite modificar el arranque.
- **Qué hacemos:** endurecer
- **Qué cambiamos y en qué equipo:** Definir contraseña de administrador en BIOS/UEFI del portátil, deshabilitar arranque por USB/PXE y fijar el disco interno como única opción.
- **A quién afecta:** A quien intente formatear o arrancar el equipo con un Live USB.
- **Cómo comprobaremos que protege y que la gestoría sigue trabajando:** Entrar al menú de la BIOS o presionar F12 en el arranque y confirmar que se exige contraseña.

### Medida: Cifrado de disco (LUKS) en portátil y servidor
- **Qué problema resuelve y cómo lo sabemos:** En septiembre se robó un portátil y se desconoce si leyeron los datos. El servidor actual almacena documentos en texto claro en sus discos. La contraseña de BIOS no impide que extraigan el disco físico.
- **Qué hacemos:** endurecer
- **Qué cambiamos y en qué equipo:** Aplicar cifrado LUKS en el disco del portátil (Ubuntu Desktop) y en la partición de datos del servidor (`/srv/samba/clientes`).
- **A quién afecta:** A Laura (deberá poner la clave al encender el portátil) y al administrador (deberá desbloquear el volumen de datos del servidor tras un reinicio total).
- **Cómo comprobaremos que protege y que la gestoría sigue trabajando:** Arrancar un Live CD/Kali, intentar montar la partición del portátil o del servidor y comprobar que el sistema de archivos es ilegible sin la clave de descifrado.

### Medida: Documentar una instalación inicial controlada y mínima
- **Qué problema resuelve y cómo lo sabemos:** El servidor se instaló "con de todo por si acaso" en una KVM sin proceso repetible.
- **Qué hacemos:** endurecer
- **Qué cambiamos y en qué equipo:** Documentar la instalación de un Ubuntu Server Minimal en entorno aislado, añadiendo solo los paquetes estrictamente necesarios.
- **A quién afecta:** A quien administre la infraestructura.
- **Cómo comprobaremos que protege y que la gestoría sigue trabajando:** Desplegar una máquina virtual de prueba siguiendo la documentación y verificar que el sistema es funcional y carece de bloatware.

### Medida: Inventariar, reducir y acotar los servicios del servidor
- **Qué problema resuelve y cómo lo sabemos:** El servidor expone servicios innecesarios (`inetd` en puerto 23, NetBIOS 137/138, DNS, etc.) y Samba permite acceso de invitado a toda la LAN.
- **Qué hacemos:** quitar y acotar
- **Qué cambiamos y en qué equipo:** En el servidor:
  1. **Se quita:** Deshabilitar `inetd`, `avahi-daemon` y el servicio DNS que se confirme innecesario, sin afectar al resolvedor local de Ubuntu; deshabilitar NetBIOS.
  2. **Se acota:** En `/etc/samba/smb.conf`, restringir el acceso a la VLAN 20 (`hosts allow = 192.168.1.64/26 127.0.0.1`), forzar protocolo SMB3 y deshabilitar el acceso de invitado.
- **A quién afecta:** A toda la plantilla, que ahora debe usar su usuario y contraseña para entrar a Samba.
- **Cómo comprobaremos que protege y que la gestoría sigue trabajando:** `ss -tulpn` mostrará una reducción drástica de puertos a la escucha. Los puestos de trabajo Windows accederán a Samba introduciendo credenciales.

### Medida: Revisar el acceso desde Internet y acotar el servicio FTP del router
- **Qué problema resuelve y cómo lo sabemos:** El router redirige los puertos 21 y 40000-40050 (FTP) a todo Internet sin filtro, permitiendo intentos de intrusión globales.
- **Qué hacemos:** acotar
- **Qué cambiamos y en qué equipo:** En el `Router-operadora`, modificar las reglas de Destination NAT (Port Forwarding) del FTP, añadiendo el parámetro `src-address=192.168.122.50` para que solo la Asesoría Fiscal pueda alcanzar el servidor FTP interno. Se cerrarán servicios de administración del router (`Telnet`, `Winbox`, `API`) hacia la WAN.
- **A quién afecta:** A atacantes externos. La Asesoría Fiscal no notará ningún cambio, ya que su IP está permitida.
- **Cómo comprobaremos que protege y que la gestoría sigue trabajando:** Escanear la IP pública del router desde una IP externa distinta a la de la asesoría y confirmar que el puerto 21 aparece como filtrado/cerrado.

### Medida: Eliminar la cuenta del becario y limitar privilegios
- **Qué problema resuelve y cómo lo sabemos:** El usuario `becario` tiene `NOPASSWD: ALL` en `/etc/sudoers.d/becario`, otorgando acceso root sin restricciones. Existe una cuenta compartida "asesores".
- **Qué hacemos:** quitar y acotar
- **Qué cambiamos y en qué equipo:** En el servidor, se eliminará permanentemente la cuenta del `becario` (`userdel -r becario`) por suponer una brecha de seguridad inaceptable y no ser necesaria para la producción. Se sustituirá la cuenta compartida por cuentas individuales estándar.
- **A quién afecta:** A quien usara la cuenta del becario y a la plantilla, que usará cuentas propias.
- **Cómo comprobaremos que protege y que la gestoría sigue trabajando:** Ejecutar `id becario` para confirmar que no existe. Revisar `/etc/sudoers.d/` para asegurar que no hay archivos residuales.

### Medida: Comprobar las protecciones del sistema y confinar un servicio
- **Qué problema resuelve y cómo lo sabemos:** El diagnóstico no indica protecciones activas ni confinamiento de servicios clave.
- **Qué hacemos:** endurecer
- **Qué cambiamos y en qué equipo:** Activar protecciones del núcleo en `/etc/sysctl.conf` (ej. ocultar punteros del kernel). Confinar el servicio Samba (`smbd.service`) mediante directivas de systemd (`ProtectSystem=strict`, `ProtectHome=read-only`).
- **A quién afecta:** Transparente para la gestoría.
- **Cómo comprobaremos que protege y que la gestoría sigue trabajando:** Ejecutar `systemd-analyze security smbd` antes y después de aplicar la medida para evidenciar la reducción matemática del nivel de exposición.

# 3. LAS 4 MOLESTIAS

1. **Autenticación personal en Samba (Fin del acceso de invitado/compartido).** Se retirará el acceso libre a la carpeta de clientes y se eliminará la cuenta compartida.
   - **A quién afecta:** A toda la plantilla de asesores que accede diariamente al servidor.
   - **Por qué merece la pena:** Permite la trazabilidad exigida por la auditoría y asegura que solo el personal autorizado accede a la información tributaria.

2. **Protección del arranque en BIOS/UEFI.** Se establece contraseña administrativa para acceder al setup o menú de arranque.
   - **A quién afecta:** Al soporte técnico o a cualquiera que intente usar dispositivos de arranque externos.
   - **Por qué merece la pena:** Dificulta la manipulación del orden de arranque para eludir la seguridad del SO instalado.

3. **Cifrado de disco (LUKS) en portátil y servidor.** Requerirá introducir una clave de desbloqueo criptográfico antes de que cargue el sistema operativo (en el portátil) o montar el volumen de datos (en el servidor).
   - **A quién afecta:** A Laura (al encender su portátil) y a la jefa/administrador (al reiniciar el servidor físicamente).
   - **Por qué merece la pena:** Es la única garantía técnica que cumple el requisito de que "si nos roban otro portátil [o los discos del servidor], nadie puede leer lo que hay dentro".

4. **Despliegue de VLANs y segmentación estricta.** La separación física y lógica obliga a los equipos a pasar por el firewall del router para comunicarse.
   - **A quién afecta:** A quien administre la red (al tener que mantener el enrutamiento y las reglas).
   - **Por qué merece la pena:** Evita que un malware en un puesto de trabajo comprometa automáticamente al servidor o que un cliente en la sala de espera escanee la red corporativa.

# 4. DOS DESCARTES

**Descarte 1:** Bloqueo de puertos USB de almacenamiento en los puestos de trabajo
- **Motivo:** No se bloquean las unidades extraíbles mediante GPO de Windows porque se asume (a falta de confirmación) que los clientes pueden aportar documentación fiscal o certificados digitales en memorias USB durante la campaña de la renta.
- **Riesgo que queda abierto:** Permanece el riesgo de infección por malware introducido físicamente por un asesor o de fuga de datos mediante copia directa a un pendrive personal.

**Descarte 2:** Sustitución del FTP externo por SFTP
- **Motivo:** Modificar el protocolo de FTP a SFTP exigiría que la Asesoría Fiscal externa cambiase sus programas o flujos de trabajo, lo cual vulnera la regla de impacto limitado dictada por el cliente.
- **Riesgo que queda abierto:** Al mantener FTP, las transferencias entre el servidor y la asesoría siguen viajando sin cifrado. Este riesgo se asume, pero se acota el vector de ataque externo permitiendo la conexión exclusivamente desde la IP estática de la asesoría.

---

# SOURCE FILE: decisiones.md

# 1. Cifrado del portatil y de la partición del servidor

## 1.1 Configuración de un disco cifrado con LUKS en Ubuntu Server

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

## 1.2 Instalación de Ubuntu Desktop con cifrado LUKS en QEMU (GNS3)

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

# 2. Protección del sistema y confinamiento de servicios

## 2.1 D-L1 · Qué parámetros del núcleo cerrar

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

## 2.2 D-L2 · Desactivar Apport

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

## 2.3 D-L3 · Qué servicio confinar

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

## 2.4 D-L4 · Hasta dónde confinar Samba

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

# 3. Protección del acceso a BIOS/UEFI y del arranque

## 3.1 D-L5 · Contraseñas de BIOS/UEFI de cada equipo

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

## 3.2 D-L6 · Arranque solo desde el disco interno

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

## 3.3 D-L7 · Contraseña de GRUB

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

## 3.4 D-L8 · Límites de la protección del arranque y qué los cubre

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

# 4. Revisar el acceso desde Internet y acotar el servicio FTP del router

## 4.1 D-H1 · Acotar el acceso externo por FTP

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

# 5. Eliminar la cuenta del becario y limitar privilegios

## 5.1 D-H2 · Eliminar la cuenta del becario y retirar privilegios administrativos

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

# 6. Segmentación y seguridad de red

Este documento recoge las decisiones técnicas tomadas durante la implantación en GNS3 que modifican la propuesta inicial, eligen entre varias alternativas de diseño o asumen un riesgo residual controlado.

---

### 6.1 Decisión: Reasignar la configuración del router MikroTik a las interfaces `ether6` (WAN) y `ether7` (Trunk)
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** En `propuesta.md` estaban previstas las interfaces `ether1` para la salida exterior (WAN) y `ether2` para el enlace troncal hacia `Switch-oficina`. Al reiniciar el nodo `Router-operadora` en GNS3, el hipervisor reenumeró las tarjetas de red activas desplazándolas a `ether6` (conectada a la nube NAT exterior) y `ether7` (conectada al puerto `Gi0/0` del switch), dejando `ether1` y `ether2` sin enlace físico y asignando por DHCP la IP externa `192.168.122.51/24` sobre `ether6`.
- **Opciones que valoramos:**
  1. Eliminar el nodo MikroTik, crear uno nuevo desde cero y recablear toda la topología para forzar los nombres `ether1` y `ether2`.
  2. Mantener el cableado físico operativo sobre `ether6` y `ether7`, limpiar la dirección IP huérfana y adaptar las subinterfaces VLAN (`vlan10`, `vlan20`, `vlan30`), el cliente DHCP y las reglas NAT a `ether6` y `ether7`.
- **Qué decidimos y por qué:** Elegimos la opción 2 porque evita riesgos de desconfiguración en los enlaces ya validados con el switch, garantiza la estabilidad del proyecto en GNS3 y vincula todo el enrutamiento y el NAT a las interfaces físicas reales del router.
- **Consecuencias:** Cambia respecto a `propuesta.md` (debe anotarse en `propuesta.md` que la implantación final usa `ether6` y `ether7` y que la IP exterior para las pruebas FTP de la Asesoría Fiscal es `192.168.122.51/24`). No introduce ningún riesgo de seguridad adicional.

---

### 6.2 Decisión: Aplicar direccionamiento VLSM (`/28` para servidores y `/26` para plantilla y clientes) en lugar de subredes de tamaño fijo
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** La gestoría partía de una única red plana `192.168.1.0/24` sin aislamiento entre departamentos. Al dividir la red en tres VLANs (`SERVIDORES`, `PLANTILLA` y `CLIENTES`), era necesario repartir el direccionamiento interno ajustándolo al volumen real de equipos de cada zona.
- **Opciones que valoramos:**
  1. Dividir el bloque `192.168.1.0/24` en tres subredes iguales `/26` (62 direcciones útiles cada una), dejando sin uso cerca de 50 direcciones en la red de servidores.
  2. Aplicar VLSM asignando una máscara `/28` a `VLAN 10` (`192.168.1.0/28`, 14 hosts útiles para servidores), `/26` a `VLAN 20` (`192.168.1.64/26`, 62 hosts útiles para puestos e impresoras) y `/26` a `VLAN 30` (`192.168.1.128/26`, 62 hosts útiles para dispositivos móviles de clientes).
- **Qué decidimos y por qué:** Elegimos la opción 2 (VLSM) porque reduce la superficie de escaneo en la subred crítica de servidores (solo 14 direcciones posibles), ofrece margen suficiente para los dispositivos de los clientes en sala de espera y conserva libre el último bloque `192.168.1.192/26` para futuras ampliaciones de la oficina.
- **Consecuencias:** Obliga a configurar máscaras heterogéneas (`255.255.255.240` en `srv-mareas` y `255.255.255.192` en el resto de equipos). Cualquier error al introducir la máscara en un puesto impide alcanzar su puerta de enlace (`192.168.1.1`, `.65` o `.129`).

---

### 6.3 Decisión: Bloquear el tráfico ICMP (`ping`) desde `VLAN 20` hacia `VLAN 10` permitiendo únicamente los puertos TCP `80` y `445`
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** Los empleados de la plantilla (`VLAN 20`) necesitan acceder a la aplicación web interna (`HTTP`, puerto `80`) y a las carpetas compartidas (`Samba`, puerto `445`) alojadas en `srv-mareas` (`192.168.1.10`, `VLAN 10`). Sin embargo, dejar abierto todo el tráfico entre `VLAN 20` y `VLAN 10` permitiría que un puesto de empleado comprometido realizara reconocimientos de red (`ping sweeps`) o atacara otros servicios del servidor.
- **Opciones que valoramos:**
  1. Permitir todo el tráfico desde `VLAN 20` hacia `VLAN 10` y bloquear únicamente el acceso procedente de `VLAN 30` (clientes).
  2. Establecer una regla de bloqueo por defecto (`action=drop`) entre `vlan20` y `vlan10` en la cadena `forward` del MikroTik, anteponiendo una única regla de aceptación (`action=accept`) restringida estrictamente a `protocol=tcp dst-port=80,445`.
- **Qué decidimos y por qué:** Elegimos la opción 2 (principio de mínimo privilegio) porque asegura el trabajo diario de los empleados (web y carpetas compartidas) al tiempo que impide sondeos ICMP y conexiones a cualquier otro puerto del servidor.
- **Consecuencias:** Las pruebas diagnósticas con `ping` desde los equipos de plantilla hacia `192.168.1.10` fallan intencionadamente (`100% packet loss`), por lo que la disponibilidad del servidor desde `VLAN 20` debe comprobarse directamente contra los servicios (`http://192.168.1.10` o `smb://192.168.1.10`).

---

### 6.4 Decisión: Acotar por IP origen (`192.168.122.50`) el reenvío NAT del servicio FTP aceptando temporalmente el intercambio sin cifrar
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** La gestoría colabora con una Asesoría Fiscal externa (`192.168.122.50`) que envía y descarga documentación mediante FTP clásico (puerto de control `21` y rango de datos pasivos `40000-40050`), un protocolo que transmite usuario, contraseña y ficheros en texto claro.
- **Opciones que valoramos:**
  1. Configurar reglas `dst-nat` estándar en los puertos `21` y `40000-40050` abiertas a cualquier IP origen (`0.0.0.0/0`).
  2. Restringir las reglas `dst-nat` en `ether6` añadiendo el filtro `src-address=192.168.122.50` para descartar en el perímetro cualquier conexión FTP que no provenga de la IP fija de la asesoría.
  3. Desactivar el FTP de inmediato y migrar a SFTP, obligando a la asesoría externa a reconfigurar su software cliente antes de poder trabajar.
- **Qué decidimos y por qué:** Elegimos la opción 2 porque garantiza que la gestoría y la asesoría sigan operando sin interrupciones ni cambios en el cliente externo, mientras se oculta el puerto `21` frente a ataques automatizados desde Internet.
- **Consecuencias:** Se acepta a sabiendas el riesgo residual de que las credenciales y ficheros FTP entre `192.168.122.50` y `192.168.1.10` viajen sin cifrar hasta coordinar una migración futura a SFTP/FTPS, y obliga a actualizar la regla NAT si la asesoría cambia de dirección IP pública.

---

### 6.5 Decisión: Configurar la IP estática de `Portatil` (Ubuntu Desktop) desde NetworkManager gráfico en lugar de comandos `ip addr` / `ip route`
- **Fecha:** 3 de noviembre de 2026
- **Contexto:** En `propuesta.md` se planteaba asignar la dirección `192.168.1.68/26` en `Portatil` mediante comandos `sudo ip addr add` e `ip route add`. Al ejecutarlos en el entorno de escritorio Ubuntu, el demonio `NetworkManager` sobrescribió la interfaz `ens3` a los pocos segundos provocando el error `Error: Nexthop has invalid gateway` y perdiendo la configuración tras reiniciar.
- **Opciones que valoramos:**
  1. Detener o desinstalar `NetworkManager` en el portátil y aplicar la configuración de red por comandos manuales en cada inicio de sesión.
  2. Configurar el perfil de red cableada en modo `Manual` directamente en `NetworkManager` (`192.168.1.68`, máscara `255.255.255.192`, puerta de enlace `192.168.1.65`) y reiniciar el adaptador.
- **Qué decidimos y por qué:** Elegimos la opción 2 porque evita conflictos entre servicios de red, mantiene el funcionamiento estándar de un portátil de usuario en Ubuntu Desktop y asegura que la configuración de `VLAN 20` persista tras apagar o reiniciar el equipo.
- **Consecuencias:** Modifica el procedimiento de implantación documentado en `propuesta.md` para los puestos cliente con escritorio Linux y garantiza la persistencia sin intervención manual.

---

# SOURCE FILE: verificacion.md

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

---

# SOURCE FILE: responsables.md

# Responsables de las medidas

## Equipo

- Alejandro Álvarez Romero
- Raúl Toledo Procopio
- Luis Baena Utrera
- Hugo Pérez Arévalo

Cada medida tiene una persona que la implanta y otra que la verifica. La persona que verifica debe conocer el trabajo realizado y poder explicar cómo se comprobó el funcionamiento y la seguridad.

| Medida                                                               | Implanta  | Verifica  | Estado     |
| -------------------------------------------------------------------- | --------- | --------- | ---------- |
| Revisar el acceso desde Internet y acotar el servicio FTP del router | Hugo      | Luis      | Verificado |
| Eliminar la cuenta del becario y limitar privilegios                 | Hugo      | Alejandro | Verificado |
| Comprobar las protecciones del sistema y confinar un servicio        | Luis      | Raúl     | Verificado |
| Proteger el acceso a BIOS/UEFI y el arranque                         | Luis      | Hugo      | Verificado |
| Cifrado de disco (LUKS) en portátil y servidor                      | Raúl     | Alejandro | Verificado |
| Documentar una instalación inicial controlada y mínima             | Raúl     | Luis      | Verificado |
| Inventariar, reducir y acotar los servicios del servidor             | Raúl    | Hugo      | Pendiente  |
| Aislar la red de clientes mediante VLAN                              | Alejandro | Raúl     | Verificado |
| Segmentar la red interna mediante VLAN                               | Alejandro | Luis      | Verificado |


---

# SOURCE FILE: aprendizaje.md

# Aprendizaje del proyecto

## Qué hemos aprendido

### Segmentación de redes

Hemos aprendido que una red plana permite que los equipos accedan a más recursos de los necesarios. Para separar la infraestructura sin comprar hardware adicional, hemos utilizado VLAN y hemos hecho llegar todas ellas al mismo switch y al router mediante un enlace troncal.

Las VLAN necesitan configurar correctamente los puertos de acceso, el puerto troncal y las interfaces virtuales del router. También es necesario utilizar máscaras y puertas de enlace diferentes para que cada segmento funcione correctamente.

### VLSM y direccionamiento

Hemos trabajado con subredes de tamaños diferentes:

- Una `/28` para los servidores.
- Una `/26` para la plantilla.
- Una `/26` para los clientes.

Este reparto evita desperdiciar direcciones y permite que la red pueda crecer hasta 40 personas sin rehacer completamente el direccionamiento.

### NAT y cortafuegos

Hemos comprobado que el NAT no debe abrirse sin restricciones. En el caso del FTP, el puerto externo puede redirigir el tráfico hacia el servidor interno, pero la regla también puede limitar qué dirección puede iniciarlo.

Un firewall debe utilizar reglas explícitas y tener en cuenta:

- La interfaz por la que entra la conexión.
- El protocolo y el puerto.
- La dirección origen.
- La dirección y el puerto de destino.
- Las sesiones ya establecidas.
- El tráfico relacionado con una conexión anterior.

También hemos aprendido que una medida puede restringir el tráfico externo, pero mantener una capacidad insegura si el servicio interno sigue usando texto claro o si el router conserva servicios innecesarios.

### Bastionado del router

Hemos aprendido que los servicios del propio router forman parte de la superficie de ataque. Telnet y FTP transmiten información en texto claro, mientras que servicios como API o API-SSL solo son necesarios si se utilizan.

La desactivación de servicios y la limitación de SSH, WWW y Winbox a las VLAN internas reducen los equipos desde los que se puede administrar el MikroTik. Esta protección debe comprobarse desde cada segmento y desde Internet.

### Endurecimiento del núcleo

Hemos aprendido que antes de aplicar parámetros de seguridad hay que comprobar cómo viene el sistema. Ubuntu 24.04 ya trae activadas muchas protecciones (ASLR, `dmesg_restrict`, protección de enlaces…), y volver a ponerlas no añade nada. De los 17 parámetros que revisamos, solo cerramos los 8 que venían abiertos y que sabemos explicar.

También hemos visto que no basta con aplicar un cambio: hay que comprobarlo después de reiniciar. Así descubrimos que Apport devolvía `fs.suid_dumpable` a su valor de serie en cada arranque y anulaba la medida.

### Confinamiento de servicios

Hemos aprendido a confinar un servicio con las opciones de aislamiento de systemd y a medir el resultado con `systemd-analyze security`. Con `ProtectSystem=strict` y una lista acotada de rutas de escritura, Samba sigue funcionando, pero si alguien explota un fallo no puede modificar el resto del sistema.

Confinar tiene un límite: cuanto más se restringe un servicio, más fácil es romperlo. No recortamos las capacidades de Samba porque las necesita para atender a cada usuario, y preferimos una exposición media que funciona a una baja que impide trabajar a la gestoría.

### Protección del arranque

Hemos aprendido que GRUB viene abierto por defecto: cualquiera con acceso físico puede editar el arranque y entrar como root, o usar su consola para arrancar desde un USB aunque la BIOS lo tenga bloqueado. Con la opción `--unrestricted` se puede proteger la edición sin que el equipo deje de arrancar solo.

También hemos visto que cada capa cubre los huecos de otra: la BIOS se borra quitando la pila, GRUB se salta arrancando otro sistema y el cifrado no protege un equipo con la sesión abierta. Ninguna basta por sí sola.

### Límites de las medidas

Una VLAN no sustituye por sí sola al cifrado, al control de cuentas ni al control físico. El router puede bloquear tráfico entre redes, pero no protege automáticamente los datos almacenados en un equipo robado.

Del mismo modo, una contraseña de BIOS o UEFI puede impedir cambios habituales en el arranque, pero no evita todos los ataques físicos.

## Qué haríamos de otra forma

- Crearíamos primero un inventario completo con el número real de equipos por VLAN y sus puertos necesarios.
- Comprobaciones con una lista más detallada de origen, destino, protocolo y resultado esperado.
- Configuraríamos reglas de firewall con una política predeterminada de denegación y registraríamos las excepciones necesarias.
- Añadiríamos fotografías o capturas a cada comprobación, identificando el equipo y la fecha.
- Verificaríamos el acceso desde Internet después de aplicar cada cambio, para evitar errores al cambiar varias reglas a la vez.
- Mantendríamos actualizada una copia de seguridad de las configuraciones del router y el switch.
- Sustituiríamos FTP por SFTP si el cliente pudiera cambiar el flujo de trabajo sin interrupciones.
- Implementaríamos cuentas individuales en Samba antes de retirar el acceso compartido.
- Haríamos un snapshot de las máquinas antes de cada cambio que afecte al arranque o a un servicio crítico.
- Comprobaríamos el tipo de firmware (BIOS o UEFI) de cada equipo durante el diagnóstico, antes de proponer medidas que dependen de él.
- Tendríamos preparada una imagen ISO de prueba para comprobar que los equipos no arrancan desde medios externos.

## Problemas encontrados

Al principio, el diagnóstico mostraba una red plana y equipos que podían comunicarse sin pasar por políticas de separación. Además, algunos dispositivos recibían direcciones por DHCP mientras otros tenían configuraciones fijas.

También hemos identificado que el servidor tiene una configuración demasiado amplia de servicios y que Samba permitía acceso de invitado. El servidor necesitaba reducir su superficie de red y limitar los privilegios de las cuentas locales.

Durante el desarrollo hemos tenido que comprobar que las reglas no impiden el acceso legítimo de la asesoría fiscal ni el trabajo de la plantilla.

En el bastionado del servidor y del portátil encontramos varios problemas: una errata en un parámetro del núcleo que solo se detectó al comprobar su valor, Apport anulando una de las medidas al reiniciar, y que las máquinas virtuales arrancan con BIOS clásica en lugar de UEFI, lo que impide poner contraseña de BIOS y activar Secure Boot en el laboratorio. Además, el menú de GRUB está oculto y con tiempo cero, y para probar la contraseña en el portátil tuvimos que mostrarlo temporalmente y volver a ocultarlo después.

## Riesgos que quedan abiertos

- FTP sigue utilizando texto claro.
- Un USB con malware puede seguir usándose en los puestos de trabajo.
- La contraseña de BIOS/UEFI no se ha podido aplicar en el laboratorio: las máquinas virtuales usan SeaBIOS, que no la permite. Queda documentada para el equipo real.
- Sin Secure Boot, la partición `/boot` del portátil (sin cifrar) podría manipularse con acceso físico para capturar la clave de LUKS. La contraseña de GRUB lo dificulta, pero no lo elimina.
- Si roban el portátil encendido y con la sesión abierta, ni la BIOS, ni GRUB, ni LUKS protegen los datos. Haría falta el bloqueo automático de pantalla.
- `vsftpd`, el servicio que usa la asesoría externa, sigue sin confinar. Sería el siguiente servicio que confinar.
- El servidor tiene actualizaciones de seguridad pendientes.
- LUKS no protege los datos mientras el sistema está desbloqueado y el usuario ha iniciado sesión.
- La contraseña de cifrado puede perderse si no existe una gestión segura de claves o de recuperación.
- La configuración de VLAN no sustituye las actualizaciones del sistema ni el mantenimiento de antivirus y parches.
- Una dirección pública o una red externa mal configurada puede afectar al acceso remoto del cliente.

## Riesgos aceptados por el cliente

Hasta recibir una decisión expresa del cliente, se consideran aceptados los siguientes puntos:

- Mantener FTP mientras la asesoría fiscal no pueda cambiar su flujo de trabajo.
- Conservar temporalmente el uso de memorias USB para aportar documentación fiscal.
- No sustituir todavía hardware que ya funciona.
- Mantener las interfaces internas necesarias para que la gestoría continúe trabajando.

El equipo debe confirmar por escrito con el cliente qué riesgos acepta definitivamente.

## Aspectos pendientes de verificar

- Comprobar desde VLAN 30 que no se alcanza el servidor ni la VLAN 20.
- Comprobar desde VLAN 20 que HTTP y Samba funcionan y que otros puertos están bloqueados.
- Comprobar que el servidor responde solo por los servicios imprescindibles.
- Comprobar el acceso FTP desde `192.168.122.50`.
- Comprobar el bloqueo FTP desde una dirección externa distinta.
- Verificar que las reglas siguen funcionando después de reiniciar el router y el servidor.
- Verificar el cifrado LUKS desde un sistema externo.
- Comprobar que la eliminación del usuario `becario` es permanente y no quedan privilegios residuales.
- Comprobar la seguridad del núcleo y el aislamiento de un servicio.