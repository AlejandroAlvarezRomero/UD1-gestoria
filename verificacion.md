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