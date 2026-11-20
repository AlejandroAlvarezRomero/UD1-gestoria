# Memoria Técnica de Implantación: Segmentación de Red y Seguridad

Este documento detalla los comandos y configuraciones aplicados durante la fase de implantación del proyecto en GNS3 para la infraestructura de **Mareas Asesores**.

---

## 1. Configuración del Switch de Acceso
**Dónde se aplica:** Consola del equipo `Switch-oficina`.

### 1.1 Creación de VLANs
Se definen tres dominios de difusión independientes para aislar el tráfico por departamentos.

```cisco
enable
configure terminal

vlan 10
 name SERVIDORES
vlan 20
 name PLANTILLA
vlan 30
 name CLIENTES
exit
```

* **Explicación:** Separar la red lógicamente impide que un equipo comprometido en la sala de clientes (VLAN 30) pueda interceptar el tráfico de los empleados (VLAN 20) o atacar directamente al servidor (VLAN 10) mediante técnicas de Capa 2 (como *ARP Spoofing*).

### 1.2 Configuración del Enlace Troncal (Trunk)
El puerto que conecta con el router debe permitir el paso de todas las VLANs.

```cisco
interface g0/0
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
 exit
```

* **Explicación:** Se configura el puerto en modo `trunk` con encapsulación 802.1Q. Esto etiqueta las tramas Ethernet indicando a qué VLAN pertenecen antes de enviarlas al router, permitiendo que un solo cable físico transporte múltiples redes lógicas (*Router-on-a-stick*).

### 1.3 Asignación de Puertos de Acceso
Se asignan los puertos físicos a sus respectivas VLANs de forma estática y se guarda la configuración en memoria permanente.

```cisco
! Servidor (VLAN 10)
interface g0/1
 switchport mode access
 switchport access vlan 10
 exit

! Empleados e impresoras (VLAN 20)
interface g0/2
 switchport mode access
 switchport access vlan 20
interface g0/3
 switchport mode access
 switchport access vlan 20
interface g1/0
 switchport mode access
 switchport access vlan 20
interface g1/1
 switchport mode access
 switchport access vlan 20
interface g1/2
 switchport mode access
 switchport access vlan 20
 exit

! AP Clientes (VLAN 30)
interface g1/3
 switchport mode access
 switchport access vlan 30
 exit

! Guardar configuración
exit
write memory
```

---

## 2. Configuración del Router (MikroTik)
**Dónde se aplica:** Consola del equipo `Router-operadora`.

### 2.1 Limpieza y Enrutamiento Inter-VLAN
Tras el reinicio del nodo en GNS3, las interfaces activas del router corresponden a `ether6` (enlace exterior/WAN) y `ether7` (enlace troncal hacia `Gi0/0` del switch). Se retira la antigua red plana y se configuran las puertas de enlace virtuales.

```routeros
# 1. Eliminar la red antigua del puerto físico huérfano
/ip address remove [find dynamic=no]

# 2. Crear las interfaces virtuales VLAN en el enlace troncal (ether7)
/interface vlan
add interface=ether7 name=vlan10 vlan-id=10
add interface=ether7 name=vlan20 vlan-id=20
add interface=ether7 name=vlan30 vlan-id=30

# 3. Asignar las direcciones IP calculadas por VLSM
/ip address
add address=192.168.1.1/28 interface=vlan10
add address=192.168.1.65/26 interface=vlan20
add address=192.168.1.129/26 interface=vlan30

# 4. Reasignar el cliente DHCP a la interfaz exterior activa (ether6)
/ip dhcp-client set [find] interface=ether6
/ip dhcp-client enable [find]
```

* **Explicación VLSM:** Se ajustan las máscaras (`/28` para servidores y `/26` para el resto) para no desperdiciar direcciones IP, ciñendo el tamaño de cada subred a sus necesidades reales de *hosts*.

### 2.2 Seguridad Perimetral: NAT y Acceso FTP Acotado
Se actualiza la salida a Internet (`masquerade`) sobre `ether6` (IP dinámica asignada: `192.168.122.51/24`) y se restringe el acceso FTP desde el exterior exclusivamente a la IP de la Asesoría Fiscal.

```routeros
/ip firewall nat
set 0 out-interface=ether6
set 1,2 in-interface=ether6 src-address=192.168.122.50
```

*(En caso de crear las reglas desde cero sobre `ether6`:)*

```routeros
/ip firewall nat
add action=masquerade chain=srcnat out-interface=ether6
add action=dst-nat chain=dstnat comment="FTP-asesoria" dst-port=21 in-interface=ether6 protocol=tcp src-address=192.168.122.50 to-addresses=192.168.1.10
add action=dst-nat chain=dstnat comment="FTP-pasivo-asesoria" dst-port=40000-40050 in-interface=ether6 protocol=tcp src-address=192.168.122.50 to-addresses=192.168.1.10
```

* **Explicación:** En lugar de abrir el puerto 21 a todo Internet, la regla obliga a que la petición provenga exclusivamente de la IP origen `192.168.122.50` (Asesoría Fiscal). Si un atacante intenta conectar desde otra IP, el router ignorará la petición. El rango `40000-40050` permite la transferencia de datos del protocolo FTP en modo pasivo.

### 2.3 Políticas de Cortafuegos (Firewall Filter)
Se aplican las reglas de aislamiento interno entre VLANs en orden estricto de evaluación.

```routeros
/ip firewall filter
# Permitir tráfico de empleados a servidor solo por HTTP (80) y Samba (445)
add action=accept chain=forward dst-port=80,445 in-interface=vlan20 out-interface=vlan10 protocol=tcp

# Bloquear cualquier otro intento desde empleados hacia servidor (incluido ICMP/ping)
add action=drop chain=forward in-interface=vlan20 out-interface=vlan10

# Bloquear tráfico desde clientes WiFi hacia servidor y empleados
add action=drop chain=forward in-interface=vlan30 out-interface=vlan10
add action=drop chain=forward in-interface=vlan30 out-interface=vlan20
```

---

## 3. Configuración de Equipos Finales

### 3.1 Servidor Ubuntu (`srv-mareas`)
**Dónde se aplica:** Terminal de Linux de `srv-mareas` (VLAN 10).

Se configura Netplan para hacer permanente la nueva máscara `/28` y la puerta de enlace.

```bash
sudo nano /etc/netplan/01-gestoria.yaml
```

**Contenido del archivo:**

```yaml
network:
  version: 2
  ethernets:
    ens3:
      addresses:
        - 192.168.1.10/28
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```

```bash
sudo netplan apply
```

### 3.2 Equipos Ligeros (VPCS)
**Dónde se aplica:** Consolas respectivas de `Movil-cliente`, `Impresora-1` e `Impresora-2`.

Se asigna IP, máscara y gateway, y se guardan en la memoria flash virtual.

```text
# Movil-cliente (VLAN 30)
ip 192.168.1.130 255.255.255.192 192.168.1.129
save

# Impresora-1 (VLAN 20)
ip 192.168.1.66 255.255.255.192 192.168.1.65
save

# Impresora-2 (VLAN 20)
ip 192.168.1.67 255.255.255.192 192.168.1.65
save
```

### 3.3 Equipos de Escritorio (VLAN 20)
**Dónde se aplica:** Configuración de red de `Portatil` (Ubuntu Desktop) y puestos Windows (`Puesto-1`, `Puesto-2`).

* **`Portatil` (Ubuntu Desktop — NetworkManager IPv4 Manual):**
  Se configura de forma persistente desde el gestor de red gráfico (`ens3`) para evitar sobrescrituras del servicio de red:
  * **Dirección IP:** `192.168.1.68`
  * **Máscara de red:** `255.255.255.192` (`/26`)
  * **Puerta de enlace:** `192.168.1.65`

* **Puestos Windows (`Puesto-1` y `Puesto-2` — CMD como Administrador / `ncpa.cpl`):**

```cmd
:: Puesto-1 (Windows)
netsh interface ipv4 set address name="Ethernet" static 192.168.1.69 255.255.255.192 192.168.1.65

:: Puesto-2 (Windows)
netsh interface ipv4 set address name="Ethernet" static 192.168.1.70 255.255.255.192 192.168.1.65
```

---

## Verificación y Pruebas de Funcionamiento

Se validan las políticas de segmentación y filtrado mediante pruebas reales en la topología:

1. **Verificación de VLANs y Troncal (`Switch-oficina`):** `show vlan brief` confirma las VLANs `10`, `20` y `30` activas con sus respectivos puertos asignados y `Gi0/0` operando en modo *trunk*.
2. **Conectividad base del servidor (`srv-mareas`):** `ip a show ens3` muestra `192.168.1.10/28` y `ping 192.168.1.1` responde con `0% packet loss`.
3. **Filtrado selectivo Plantilla $\rightarrow$ Servidor (`Portatil`):**
   * `ping 192.168.1.65` responde sin pérdida de paquetes (conectividad con su gateway).
   * `ping 192.168.1.10` devuelve `100% packet loss` (el router bloquea el tráfico ICMP no autorizado hacia servidores).
   * El acceso mediante navegador web a `[http://192.168.1.10](http://192.168.1.10)` carga correctamente la página del servidor **Nginx**, verificando el paso permitido por el puerto TCP `80`.
4. **Aislamiento de Invitados (`Movil-cliente`):** `ping 192.168.1.129` responde dentro de la VLAN 30, mientras que `ping 192.168.1.10` es descartado por el cortafuegos.

## 4. Bastionado Perimetral y Control de Acceso en el Router (MikroTik)

**Dónde se aplica:** Consola del equipo `Router-operadora`.

### 4.1 Permisos de Tráfico NAT y Estado en el Cortafuegos

Se añaden reglas de control de estado en la cadena `forward` del firewall para garantizar que las conexiones legítimas establecidas y el tráfico redirigido mediante NAT hacia el servidor FTP puedan fluir sin ser bloqueados por las políticas de aislamiento entre VLANs.

```routeros
/ip firewall filter
add chain=forward connection-state=established,related action=accept place-before=0 comment="Permitir trafico establecido"
add chain=forward connection-nat-state=dstnat action=accept place-before=1 comment="Permitir trafico redirigido por NAT (FTP Asesoria)"
```

* **Explicación:** Al colocar estas reglas al inicio de la cadena `forward`, el router permite el paso de paquetes pertenecientes a sesiones ya autorizadas y al reenvío de puertos de la Asesoría Fiscal (`dstnat`), manteniendo intacto el bloqueo hacia el resto de intentos de conexión no solicitados.

### 4.2 Deshabilitación de Servicios Inseguros y Acotación de Gestión

Se desactivan los servicios de administración propios del router que transmiten información en texto claro o no son necesarios, y se restringe el acceso a los servicios de gestión activos exclusivamente a las subredes de servidores (`VLAN 10`) y plantilla (`VLAN 20`).

```routeros
/ip service
disable telnet
disable ftp
disable api
disable api-ssl
set www address=192.168.1.0/28,192.168.1.64/26
set ssh address=192.168.1.0/28,192.168.1.64/26
set winbox address=192.168.1.0/28,192.168.1.64/26
```

* **Explicación:** Deshabilitar el servicio `ftp` interno del MikroTik evita conflictos con la redirección NAT del puerto 21 hacia el servidor Ubuntu y protege al router frente a ataques de fuerza bruta. Asimismo, limitar `www`, `ssh` y `winbox` a `192.168.1.0/28` y `192.168.1.64/26` impide que tanto atacantes externos desde Internet (`ether1`) como clientes conectados en la sala de espera (`VLAN 30 - 192.168.1.128/26`) puedan alcanzar las interfaces de administración del router.

---

## 5. Verificación de la Seguridad Perimetral (FTP Acotado)

**Dónde se aplica:** Consola del equipo `Asesoria-fiscal` (`192.168.122.50`), conectado a la red WAN simulada.

### 5.1 Prueba de Acceso Autorizado (Asesoría Fiscal)

Se comprueba que la Asesoría Fiscal puede alcanzar el puerto de control FTP del servidor a través de la IP WAN actual del router (`192.168.122.51`).

```bash
curl -v telnet://192.168.122.51:21
```

**Resultado obtenido:**

```text
* Trying 192.168.122.51:21...
* Connected to 192.168.122.51 (192.168.122.51) port 21
220 (vsFTPd 3.0.5)
```

La conexión desde la IP autorizada llega al puerto TCP/21 y recibe el banner de `vsftpd`. Esta prueba confirma el canal de control, pero no verifica el inicio de sesión ni la transferencia de archivos por el canal pasivo.

### 5.2 Prueba de Bloqueo a una IP no autorizada

Desde `Asesoria-fiscal` se asignó temporalmente `192.168.122.99` a `eth0` para probar el acceso desde una IP distinta de la autorizada. La prueba se dirigió a la IP WAN actual del router (`192.168.122.51`).

```bash
ip addr add 192.168.122.99/24 dev eth0
curl --interface 192.168.122.99 -m 3 -v telnet://192.168.122.51:21
ip addr del 192.168.122.99/24 dev eth0
```

**Resultado obtenido:**

```text
* Trying 192.168.122.51:21...
* connect to 192.168.122.51 port 21 from 192.168.122.99 failed: Connection refused
* Failed to connect to 192.168.122.51 port 21
```

La conexión desde la IP no autorizada fue rechazada. La dirección temporal `192.168.122.99` se retiró al terminar la prueba. Esto verifica el bloqueo desde otro origen en la WAN simulada, no desde cualquier punto de Internet.

### 5.3 Prueba de listado FTP en modo pasivo (verificada)

Se obtuvo el listado del directorio FTP en modo pasivo desde `Asesoria-fiscal`. `curl` solicitó la contraseña de forma interactiva; no se incluye en el comando ni en estas evidencias.

```bash
curl -v --ftp-pasv --user asesoriafiscal ftp://192.168.122.51/
```

**Resultado obtenido:**

```text
< 220 (vsFTPd 3.0.5)
< 230 Login successful.
< 229 Entering Extended Passive Mode (|||40036|)
> LIST
-rw-r--r--    1 1005     1005           93 Oct 11 17:49 remesa-2026-semana39.txt
-rw-r--r--    1 1005     1005           93 Oct 11 17:49 remesa-2026-semana40.txt
-rw-r--r--    1 1005     1005           93 Oct 11 17:49 remesa-2026-semana41.txt
< 226 Directory send OK.
```

El inicio de sesión fue aceptado y el servidor permitió listar el directorio. El puerto pasivo negociado (`40036`) está dentro del rango `40000-40050` configurado en el router, por lo que esta prueba verifica tanto el acceso FTP como el canal de datos pasivo.

**Nota de seguridad:** no incluir contraseñas en el repositorio ni en las capturas. La contraseña apareció en la salida de terminal compartida; debe cambiarse y evitarse volver a exponerla.
---

## 6. Evidencias de la configuración de VLAN y del router

Las siguientes salidas de configuración fueron facilitadas por Hugo desde el laboratorio. Confirman la configuración mostrada, pero por sí solas no demuestran que todas las comunicaciones permitidas y bloqueadas funcionen; esas pruebas de conectividad se indican como pendientes al final de esta sección.

### 6.1 VLAN y puertos del switch

**Comandos ejecutados en `Switch-oficina`:**

```text
show vlan brief
show interfaces trunk
```

**Resultado observado:**

- VLAN 10 `SERVIDORES`, activa en `Gi0/1`.
- VLAN 20 `PLANTILLA`, activa en `Gi0/2`, `Gi0/3`, `Gi1/0`, `Gi1/1` y `Gi1/2`.
- VLAN 30 `CLIENTES`, activa en `Gi1/3`.
- `Gi0/0` está en modo trunk con encapsulación 802.1Q.
- El trunk permite las VLAN 10, 20 y 30, que aparecen activas y en estado de reenvío.

**Conclusión:** La salida confirma que las VLAN están creadas y que los puertos de acceso y el trunk están asignados según el diseño documentado.

### 6.2 Reglas NAT y de filtrado del router

**Comandos ejecutados en `Router-operadora`:**

```routeros
/ip firewall nat print detail
/ip firewall filter print detail
```

**Resultado observado:**

- La regla de `masquerade` proporciona NAT de salida por `ether6`.
- Hay una regla Destination NAT TCP para el puerto 21 hacia `192.168.1.10`, limitada a conexiones entrantes por `ether6` cuyo origen es `192.168.122.50`.
- Hay otra regla equivalente para el rango TCP `40000-40050`, también limitada a `192.168.122.50`.
- La primera regla de `forward` acepta conexiones `established,related`.
- Se permite desde `vlan20` hacia `vlan10` el tráfico TCP a los puertos 80 y 445.
- Se permite el tráfico FTP redirigido desde `ether6` hacia `192.168.1.10` solo desde `192.168.122.50`, por TCP/21 y TCP/40000-40050.
- Se descarta el resto del tráfico de `vlan20` hacia `vlan10` y el tráfico de `vlan30` hacia `vlan10` y `vlan20`.
- No aparece una regla de descarte general al final de la cadena `forward`; el tráfico que no coincide con estas reglas no queda bloqueado por ellas.

**Conclusión:** Las redirecciones NAT y la aceptación del tráfico FTP están limitadas a la IP de la asesoría. Las secciones 5.1 y 5.3 documentan la conexión autorizada, la autenticación y el listado pasivo; la sección 5.2 documenta el rechazo desde una IP distinta dentro de la WAN simulada.

### 6.3 Servicios de administración del router

**Comando ejecutado en `Router-operadora`:**

```routeros
/ip service print
```

**Resultado observado:**

- Deshabilitados: Telnet, FTP, WWW-SSL, API y API-SSL.
- Activos y limitados a `192.168.1.0/28` y `192.168.1.64/26`: WWW, SSH y Winbox.

**Conclusión:** La salida actual confirma que los servicios inseguros o no necesarios están deshabilitados y que los servicios de gestión activos se limitan a las VLAN 10 y 20. La prueba de acceso desde una red no permitida sigue pendiente.

![Servicios del router y rangos de administración permitidos](Images/ftp-servicios-router.png)

### 6.4 Pruebas de conectividad inter-VLAN pendientes

Las salidas anteriores verifican la configuración, no la conectividad efectiva de los equipos. Falta adjuntar resultados de pruebas que confirmen:

- Desde un equipo de VLAN 30, que no se alcanza el servidor ni un puesto de VLAN 20 y que sí se conserva la salida a Internet.
- Desde un equipo de VLAN 20, que HTTP y Samba del servidor funcionan y que otros puertos no autorizados están bloqueados.
- Desde VLAN 30 y desde la red externa, que no se puede administrar el router por WWW, SSH o Winbox.

Añadir el equipo de origen, el destino, el comando usado y el resultado observado para cada prueba realizada.

## 7. Eliminación de la cuenta `becario`

**Dónde se aplica:** Servidor `srv-mareas`.

**Comprobaciones realizadas:**

```text
id becario
id: becario: no such user

ls /etc/sudoers.d
README
```

**Resultado:** La cuenta `becario` ya no existe y no aparece un archivo `becario` en `/etc/sudoers.d`.

**Comprobación pendiente:** ejecutar `sudo visudo -c` para validar la sintaxis completa de sudoers. No se incluye un resultado porque el comando no se pudo ejecutar.
