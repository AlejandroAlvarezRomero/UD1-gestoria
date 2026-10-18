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

