# Bloque 1 . El mapa y las direcciones

## ¿Qué equipos hay y cómo están conectados?
![Captura 1](<Images/Captura 1.png>)
## ¿Qué direcciones tiene el router y en qué interfaz?
![Captura 1](<Images/Captura 2.png>)
## ¿Qué direcciones reparte y a quién se las ha dado?
![Captura 1](<Images/Captura 3.png>)
![Captura 1](<Images/Captura 4.png>)
## ¿Por dónde sale a Internet?
![Captura 1](<Images/Captura 5.png>)
## ¿Cómo está configurado el switch?
![Captura 1](<Images/Captura 6.png>) 	 	
## ¿Qué dirección tiene cada impresora?
![Captura 1](<Images/Captura 7.png>)
![Captura 1](<Images/Captura 8.png>)
## ¿Qué equipos tienen dirección fija y cuáles la reciben del router?

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

# Bloque 3. El portátil y los puestos (CONTRASEÑA : Laura2026)

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

