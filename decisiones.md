# 1. Cifrado del portatil y de la partición del servidor

## Configuración de un disco cifrado con LUKS en Ubuntu Server

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

## Instalación de Ubuntu Desktop con cifrado LUKS en QEMU (GNS3)

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