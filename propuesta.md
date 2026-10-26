
# 1. LA RED

# 2. LAS MEDIDAS

### Medida: Aislar la red de clientes mediante VLAN
- Qué problema resuelve y cómo lo sabemos: El móvil de un cliente recibe una IP de la misma red que la oficina (`192.168.1.0/24`) y puede alcanzar el servidor.
- Qué hacemos: endurecer
- Qué cambiamos y en qué equipo: Configurar una VLAN de invitados en el switch y el router existentes, sin adquirir hardware, y permitir desde ella solo el acceso a Internet y a los servicios necesarios para conectarse. Confirmar antes que los equipos actuales admiten esta configuración.
- A quién afecta: A los clientes que usan la red de invitados y a quien administre el router y la infraestructura de red.
- Cómo comprobaremos que protege y que la gestoría sigue trabajando: Desde un móvil de cliente, comprobar que obtiene una IP de otra red, accede a Internet y no alcanza el servidor, las impresoras ni los equipos de oficina. Desde un puesto de trabajo, comprobar que siguen funcionando los servicios necesarios. Pendiente: confirmar qué equipo e interfaces están disponibles y si algún servicio interno debe ofrecerse a los clientes.

### Medida: Segmentar la red interna mediante VLAN
- Qué problema resuelve y cómo lo sabemos: El switch muestra activa la VLAN 1 y los equipos de distintos usos están en la LAN `192.168.1.0/24`.
- Qué hacemos: endurecer
- Qué cambiamos y en qué equipo: Crear VLAN según la función de los equipos —puestos, servidores, impresoras y gestión— y configurar sus puertos de acceso y troncales en el switch. Configurar el enrutamiento en el router para permitir solo las comunicaciones necesarias.
- A quién afecta: Al personal, al servidor, a las impresoras y a quien administre la red.
- Cómo comprobaremos que protege y que la gestoría sigue trabajando: Verificar la VLAN asignada a cada puerto y probar las comunicaciones permitidas y bloqueadas entre segmentos. Confirmar que los puestos siguen accediendo a los servicios de trabajo. Pendiente: identificar qué dispositivo está conectado a cada puerto y confirmar que los equipos de red soportan VLAN.

### Medida: Proteger el acceso a BIOS/UEFI y el arranque
- Qué problema resuelve y cómo lo sabemos: El diagnóstico indica que el portátil no pide credenciales antes del inicio de sesión, pero no especifica si tiene contraseña de BIOS/UEFI ni si permite arrancar desde dispositivos externos. El servidor es una máquina virtual KVM.
- Qué hacemos: endurecer
- Qué cambiamos y en qué equipo: En el portátil, revisar la configuración de BIOS/UEFI, definir una contraseña de administración, deshabilitar el arranque externo no autorizado y fijar un orden de arranque seguro. Para el servidor virtual, revisar con la jefa las medidas disponibles en el equipo anfitrión y el hipervisor. No incluir las contraseñas reales en la documentación.
- A quién afecta: A Laura, a quien administre el portátil y a quien administre el servidor y el hipervisor.
- Cómo comprobaremos que protege y que la gestoría sigue trabajando: Reiniciar y comprobar que se mantiene el orden de arranque, que no se inicia desde un dispositivo externo no autorizado y que el sistema arranca normalmente. Pendiente: confirmar quién custodia las contraseñas y administra el equipo anfitrión. Esta medida no sustituye al cifrado de disco.

### Medida: Documentar una instalación inicial controlada y mínima
- Qué problema resuelve y cómo lo sabemos: El servidor ya está instalado con Ubuntu 24.04.5 en una máquina virtual KVM, pero el diagnóstico no describe cómo se instaló ni documenta un procedimiento repetible.
- Qué hacemos: endurecer
- Qué cambiamos y en qué equipo: Documentar un procedimiento para instalar una máquina de prueba en un entorno aislado o controlado, incluyendo únicamente los componentes necesarios para su uso previsto. No reinstalar el servidor de producción sin autorización.
- A quién afecta: A quien prepare o mantenga el servidor y al personal que dependa de sus servicios.
- Cómo comprobaremos que protege y que la gestoría sigue trabajando: Repetir el procedimiento en una máquina virtual de prueba, revisar los componentes instalados y comprobar que los servicios previstos funcionan. Pendiente: preguntar a la jefa si se puede crear una máquina de prueba y qué funciones debe ofrecer el servidor.

### Medida: Inventariar y reducir los servicios del servidor
- Qué problema resuelve y cómo lo sabemos: El servidor expone FTP (21), SSH (22), el puerto 23 asociado a `inetd` —servicio pendiente de identificar—, nginx (80), Samba (139 y 445) y NetBIOS (UDP 137 y 138). También están activos MariaDB, DNS y otros servicios. Samba permite acceso de invitado con escritura a la carpeta `clientes`.
- Qué hacemos: quitar los servicios innecesarios y acotar los que se deban mantener
- Qué cambiamos y en qué equipo: Elaborar un inventario de programas, servicios, puertos y protocolos de `srv-mareas`. Tras confirmar su uso con la jefa, desactivar lo que no sea necesario. Restringir Samba a usuarios autorizados y quitar el acceso de invitado con escritura. Identificar qué servicio usa el puerto 23 antes de decidir si se elimina.
- A quién afecta: Al personal que accede a documentos y aplicaciones, a los usuarios de los servicios del servidor y a quien administre `srv-mareas`.
- Cómo comprobaremos que protege y que la gestoría sigue trabajando: Comparar el inventario antes y después, reiniciar y comprobar que los servicios retirados no vuelven a arrancar. Probar que los usuarios no autorizados no acceden a los documentos y que los usuarios autorizados siguen trabajando. Pendiente: confirmar qué servicios necesita realmente la gestoría.

### Medida: Revisar el acceso desde Internet y los servicios del router
- Qué problema resuelve y cómo lo sabemos: El router redirige desde Internet los puertos FTP 21 y 40000–40050 al servidor. También tiene habilitados servicios como Telnet, FTP, web, API, SSH y Winbox.
- Qué hacemos: acotar
- Qué cambiamos y en qué equipo: Revisar las reglas del router y deshabilitar los servicios de administración que no se utilicen. Limitar el acceso administrativo a equipos o redes autorizados. Confirmar con la jefa si la asesoría fiscal necesita el FTP antes de modificar las redirecciones.
- A quién afecta: A quien administra el router, a la asesoría fiscal y a las personas que usan los servicios publicados.
- Cómo comprobaremos que protege y que la gestoría sigue trabajando: Comprobar desde una red externa que solo se puede acceder a los servicios autorizados y que los servicios de administración no están disponibles para usuarios no autorizados. Verificar con la asesoría que el intercambio de información necesario sigue funcionando. Pendiente: confirmar si FTP es imprescindible y qué alternativa o acceso restringido se utilizará.

### Medida: Limitar privilegios de las cuentas del servidor
- Qué problema resuelve y cómo lo sabemos: `becario` tiene `NOPASSWD: ALL` en `/etc/sudoers.d/becario`, lo que permite ejecutar acciones administrativas sin contraseña. También existe una cuenta compartida `asesores` con shell.
- Qué hacemos: acotar
- Qué cambiamos y en qué equipo: Revisar los permisos de `sudo` y retirar a `becario` la directiva `NOPASSWD: ALL`, confirmando antes con la jefa qué tareas técnicas necesita realizar. Valorar sustituir la cuenta compartida por cuentas personales, si la gestoría puede trabajar de esa forma.
- A quién afecta: A `becario`, a los asesores, a las personas administradoras y a quienes acceden a los documentos del servidor.
- Cómo comprobaremos que protege y que la gestoría sigue trabajando: Probar qué permisos conserva cada cuenta y confirmar que las personas autorizadas siguen realizando sus tareas. Pendiente: preguntar a la jefa qué tareas requieren privilegios administrativos y si se pueden crear cuentas individuales.

### Medida: Comprobar las protecciones del sistema y confinar un servicio
- Qué problema resuelve y cómo lo sabemos: El servidor ejecuta Ubuntu 24.04.5 y tiene servicios accesibles desde la red, pero el diagnóstico no indica qué protecciones del sistema están activas ni si algún servicio está confinado.
- Qué hacemos: endurecer
- Qué cambiamos y en qué equipo: Registrar el estado inicial de las protecciones del sistema y cerrar de forma permanente las que estén abiertas y no sean necesarias. Confinar un servicio expuesto, por ejemplo nginx si se confirma que la gestoría lo necesita, mediante AppArmor o las opciones de aislamiento de systemd.
- A quién afecta: A las personas que usan el servicio confinado, a la gestoría y a quien administre el servidor.
- Cómo comprobaremos que protege y que la gestoría sigue trabajando: Guardar el estado anterior y posterior, reiniciar y comprobar que los cambios persisten. Probar que el servicio queda bloqueado al intentar una acción que no debería poder realizar y verificar que su función legítima sigue funcionando. Pendiente: confirmar qué necesita hacer nginx y elegir una prueba segura.

# 3. LAS 4 MOLESTIAS

1. Eliminación del acceso de invitado a Samba. Se retirará el acceso sin contraseña a la carpeta de clientes. La cuenta compartida `asesores` se revisará, pero su sustitución por cuentas personales queda pendiente de confirmar.

- A quién afecta: A toda la plantilla de asesores que accede diariamente al servidor.

- Por qué merece la pena: Reduce el riesgo de que alguien que llegue al servicio Samba acceda o modifique los documentos sin autenticarse. Mientras exista una cuenta compartida, no se podrá atribuir con certeza cada acción a una persona concreta.


2. Protección del arranque del portátil. Se revisará la configuración BIOS/UEFI y, si es posible, se establecerá una contraseña administrativa y se impedirá el arranque desde medios externos no autorizados. El diagnóstico no confirma cuál es la configuración actual.

- A quién afecta: A Laura y a cualquier miembro del equipo que deba llevarse el portátil corporativo fuera de la oficina.
- Por qué merece la pena: Dificulta que una persona no autorizada cambie la configuración de arranque o inicie otro sistema operativo. No impide por sí sola extraer los datos del disco; para protegerlos frente a ese riesgo se necesita cifrado.


3. Fin de las ejecuciones de administrador sin contraseña
Derivado de la limitación de privilegios en el servidor, se propone retirar a `becario` la directiva `NOPASSWD: ALL`, tras confirmar qué tareas técnicas necesita realizar.

- A quién afecta: Al becario y a cualquier otra persona que realice tareas técnicas en el servidor.
- Por qué merece la pena: Si la cuenta del becario es vulnerada o deja su sesión abierta, un atacante no podrá tomar el control total del servidor de forma automática y silenciosa, conteniendo el impacto de una brecha.


4. Revisión del intercambio de archivos con la asesoría fiscal. Se comprobará si el FTP está cifrado y si la asesoría lo necesita. Si se decide cerrarlo, primero se acordará una alternativa que permita mantener el intercambio de archivos.

- A quién afecta: Al personal de Mareas Asesores que necesite compartir documentación con la asesoría externa, y a la propia asesoría.

- Por qué merece la pena: Si se confirma que el FTP transmite datos o credenciales sin cifrar, sustituirlo o protegerlo reducirá el riesgo de interceptación. No se cerrará la redirección antes de acordar cómo continuará el intercambio necesario.


# 4. DOS DESCARTES

**Descarte 1:** Bloqueo de puertos USB de almacenamiento en los puestos de trabajo

**Motivo:** El diagnóstico no confirma si la gestoría recibe documentos de clientes en memorias USB. Se descarta bloquearlas de forma general porque podría interferir con ese flujo de trabajo; conviene confirmar su uso antes de implantar restricciones.

**Riesgo que queda abierto:** Si se utilizan memorias USB, permanece el riesgo de introducir malware o copiar documentos fuera de la red. Se pueden valorar controles selectivos sin bloquear los usos legítimos.


**Descarte 2:** Adquisición de un Firewall UTM (Gestión Unificada de Amenazas) físico

**Motivo:** El cliente estableció como regla innegociable "Sin hardware nuevo". La segmentación de la red de clientes se plantea mediante una VLAN y el filtrado del switch y el router existentes, siempre que estos equipos admitan la configuración necesaria.

**Riesgo que queda abierto:** La red queda protegida por un filtrado básico de capa 3 y 4 (IPs y puertos). Al no disponer de un equipo avanzado, se carece de inspección profunda de paquetes, lo que impide detectar intrusiones sofisticadas o analizar el tráfico en busca de malware antes de que llegue a los equipos.