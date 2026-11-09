# Memoria Técnica de Implantación: Segmentación de Red y Seguridad

Este documento detalla los comandos y configuraciones aplicados durante la fase de implantación del proyecto en GNS3.

---

## 1. Configuración del Switch de Acceso 
**Dónde se aplica:** Consola del equipo `Switch-oficina`.

### 1.1 Creación de VLANs
Se definen tres dominios de difusión independientes para aislar el tráfico por departamentos.


enable
configure terminal

vlan 10
 name SERVIDORES
vlan 20
 name PLANTILLA
vlan 30
 name CLIENTES
exit

* **Explicación:** Separar la red lógicamente impide que un equipo comprometido en la sala de clientes (VLAN 30) pueda interceptar el tráfico de los empleados (VLAN 20) o atacar directamente al servidor (VLAN 10) mediante técnicas de Capa 2 (como ARP Spoofing).

### 1.2 Configuración del Enlace Troncal (Trunk)
El puerto que conecta con el router debe permitir el paso de todas las VLANs.


interface g0/0
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
 exit

* **Explicación:** Se configura el puerto en modo `trunk` con encapsulación 802.1Q. Esto etiqueta las tramas Ethernet indicando a qué VLAN pertenecen antes de enviarlas al router, permitiendo que un solo cable físico transporte múltiples redes lógicas ("Router-on-a-stick").

### 1.3 Asignación de Puertos de Acceso
Se asignan los puertos físicos a sus respectivas VLANs de forma estática.


 Servidor (VLAN 10)
interface g0/1
 switchport mode access
 switchport access vlan 10
 exit

 Empleados e impresoras (VLAN 20)
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

 AP Clientes (VLAN 30)
interface g1/3
 switchport mode access
 switchport access vlan 30
 exit

 Guardar configuración
exit
write memory

---

## 2. Configuración del Router (MikroTik)
**Dónde se aplica:** Consola del equipo `Router-operadora`.

### 2.1 Limpieza y Enrutamiento Inter-VLAN
Se retira la IP de la antigua red plana y se configuran las puertas de enlace (Gateways) virtuales.


 1. Eliminar la red antigua del puerto físico
/ip address remove 0

 2. Crear las interfaces virtuales VLAN en el cable que va al switch (ether2)
/interface vlan
add interface=ether2 name=vlan10 vlan-id=10
add interface=ether2 name=vlan20 vlan-id=20
add interface=ether2 name=vlan30 vlan-id=30

 3. Asignar las direcciones IP calculadas por VLSM
/ip address
add address=192.168.1.1/28 interface=vlan10
add address=192.168.1.65/26 interface=vlan20
add address=192.168.1.129/26 interface=vlan30

* **Explicación VLSM:** Se ajustan las máscaras (`/28` para servidores y /26 para el resto) para no desperdiciar direcciones IP, ciñendo el tamaño de cada subred a sus necesidades reales de hosts.

### 2.2 Seguridad Perimetral: NAT Acotado (FTP)
Se permite el acceso desde el exterior para la Asesoría Fiscal, pero de forma restrictiva.


/ip firewall nat
add action=dst-nat chain=dstnat dst-port=21 in-interface=ether1 protocol=tcp src-address=192.168.122.50 to-addresses=192.168.1.10
add action=dst-nat chain=dstnat dst-port=40000-40050 in-interface=ether1 protocol=tcp src-address=192.168.122.50 to-addresses=192.168.1.10

* **Explicación:** En lugar de abrir el puerto 21 a todo Internet (lo que expondría el servidor a ataques de fuerza bruta constantes), la regla obliga a que la petición provenga exclusivamente de la IP origen `192.168.122.50` (Asesoría Fiscal). Si un atacante intenta conectar desde otra IP, el router ignorará la petición. El rango 40000-40050 se abre para permitir la transferencia de datos del protocolo FTP en modo pasivo.

### 2.3 Políticas de Cortafuegos (Firewall Filter)
Se aplican las reglas de aislamiento interno.


/ip firewall filter
 Permitir tráfico de empleados a servidor solo por HTTP y Samba
add action=accept chain=forward dst-port=80,445 in-interface=vlan20 out-interface=vlan10 protocol=tcp

 Bloquear cualquier otro intento desde empleados hacia servidor
add action=drop chain=forward in-interface=vlan20 out-interface=vlan10

 Bloquear tráfico desde clientes WiFi hacia servidor y empleados
add action=drop chain=forward in-interface=vlan30 out-interface=vlan10
add action=drop chain=forward in-interface=vlan30 out-interface=vlan20


---

## 3. Configuración de Equipos Finales

### 3.1 Servidor Ubuntu (`srv-mareas`)
**Dónde se aplica:** Terminal de Linux de `srv-mareas`.

Se configura Netplan para hacer permanente la nueva máscara y puerta de enlace.

bash
sudo nano /etc/netplan/01-gestoria.yaml

**Contenido del archivo:**
yaml
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

bash
sudo netplan apply


### 3.2 Equipos Ligeros (VPCS)
**Dónde se aplica:** Consolas respectivas de `Movil-cliente`, `Impresora-1`, `Impresora-2`.

Se asigna IP, máscara y gateway, y se guardan en la memoria flash virtual.

text
 Movil-cliente (VLAN 30)
ip 192.168.1.130 255.255.255.192 192.168.1.129
save

 Impresora-1 (VLAN 20)
ip 192.168.1.66 255.255.255.192 192.168.1.65
save

 Impresora-2 (VLAN 20)
ip 192.168.1.67 255.255.255.192 192.168.1.65
save


### 3.3 Equipos de Escritorio
**Dónde se aplica:** Terminal de Linux (`Portatil`) y CMD como Administrador (`Puesto-1`, `Puesto-2`).

bash
 Portatil (Linux)
sudo ip addr flush dev ens3
sudo ip addr add 192.168.1.68/26 dev ens3
sudo ip route add default via 192.168.1.65


cmd
 Puesto-1 (Windows)
netsh interface ipv4 set address name="Ethernet" static 192.168.1.69 255.255.255.192 192.168.1.65

 Puesto-2 (Windows)
netsh interface ipv4 set address name="Ethernet" static 192.168.1.70 255.255.255.192 192.168.1.65



---
