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

## Problemas encontrados

Al principio, el diagnóstico mostraba una red plana y equipos que podían comunicarse sin pasar por políticas de separación. Además, algunos dispositivos recibían direcciones por DHCP mientras otros tenían configuraciones fijas.

También hemos identificado que el servidor tiene una configuración demasiado amplia de servicios y que Samba permitía acceso de invitado. El servidor necesitaba reducir su superficie de red y limitar los privilegios de las cuentas locales.

Durante el desarrollo hemos tenido que comprobar que las reglas no impiden el acceso legítimo de la asesoría fiscal ni el trabajo de la plantilla.

## Riesgos que quedan abiertos

- FTP sigue utilizando texto claro.
- Un USB con malware puede seguir usándose en los puestos de trabajo.
- La protección de BIOS/UEFI puede dejarse sin validar hasta tener las evidencias reales.
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
- Verificar la contraseña de BIOS/UEFI y el orden seguro de arranque.
- Verificar el cifrado LUKS desde un sistema externo.
- Comprobar que la eliminación del usuario `becario` es permanente y no quedan privilegios residuales.
- Comprobar la seguridad del núcleo y el aislamiento de un servicio.