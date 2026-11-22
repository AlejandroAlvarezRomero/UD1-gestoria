export const measures = [
  {
    id: 'red',
    label: 'La red',
    simple:
      'Clientes, empleados y servidor ya no comparten red. El móvil de la sala de espera solo sale a Internet.',
    technical:
      'VLAN 10 (192.168.1.0/28), VLAN 20 (192.168.1.64/26) y VLAN 30 (192.168.1.128/26) en switch y router MikroTik. Troncal 802.1Q en Gi0/0, subinterfaces en ether7 y reglas forward: de VLAN 20 a VLAN 10 solo TCP 80 y 445; VLAN 30 queda aislada.',
  },
  {
    id: 'discos',
    label: 'Los documentos',
    simple:
      'Si roban el portátil o sacan un disco del servidor, los documentos no se pueden leer.',
    technical:
      'LUKS2 en /dev/vdb1 del servidor, montado como EXT4 en /clientes. El portátil de Laura se instaló con LVM y cifrado LUKS, clave de recuperación incluida. Comprobado con lsblk, df -h y cryptsetup status.',
  },
  {
    id: 'arranque',
    label: 'El arranque',
    simple:
      'Arrancar los equipos no cambia, pero nadie puede manipular el arranque ni entrar en modo recuperación.',
    technical:
      'GRUB con superusuario admingrub y contraseña PBKDF2 en /etc/grub.d/40_custom, --unrestricted en las entradas normales y GRUB_DISABLE_RECOVERY=true. En GNS3, arranque solo desde disco con -boot menu=off,strict=on; la contraseña de BIOS/UEFI queda documentada para el equipo real.',
  },
  {
    id: 'carpeta',
    label: 'La carpeta',
    simple:
      'La carpeta de clientes ya no se abre sin usuario y contraseña. Solo entra quien trabaja allí.',
    technical:
      'Samba con map to guest = Never, guest ok = no, hosts allow = 192.168.1.64/26 127.0.0.1, SMB3 y NetBIOS desactivado. smbd confinado con ProtectSystem=strict y ReadWritePaths acotados: la nota de exposición bajó de 9.6 UNSAFE a 6.0 MEDIUM.',
  },
  {
    id: 'cuentas',
    label: 'Las cuentas',
    simple:
      'La cuenta del becario ya no existe y nadie tiene permisos de administrador por error.',
    technical:
      'userdel -r becario y retirada de /etc/sudoers.d/becario. Comprobado con id becario y con la revisión del directorio sudoers.d.',
  },
  {
    id: 'ftp',
    label: 'La asesoría',
    simple:
      'La asesoría fiscal sigue enviando ficheros igual. Nadie más puede usar ese acceso.',
    technical:
      'Dest NAT en ether6 para TCP 21 y 40000-40050 solo desde 192.168.122.50 hacia 192.168.1.10. Telnet, API y Winbox cerrados a la WAN. FTP sigue viajando sin cifrar: es un riesgo aceptado porque cambiar a SFTP obligaría a la asesoría a cambiar su proceso.',
  },
]
