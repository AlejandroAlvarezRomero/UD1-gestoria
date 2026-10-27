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
  1. **Se quita:** Desinstalar/deshabilitar `inetd`, `avahi-daemon`, DNS innecesario y deshabilitar NetBIOS.
  2. **Se acota:** En `/etc/samba/smb.conf`, restringir el acceso (`hosts allow = 192.168.1.0/26 127.0.0.1`), forzar protocolo SMB3 y deshabilitar el acceso de invitado.
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