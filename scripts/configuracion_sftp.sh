#!/bin/bash
USER_SFTP="operador_sftp"
PASS_SFTP="canelo2012"
DIR_BASE="/var/www/html"
DIR_IMPORT="$DIR_BASE/import"
SSHD_CONFIG="/etc/ssh/sshd_config"

echo "--- [1/5] Respaldo de archivos de sistema ---"
sudo cp $SSHD_CONFIG "${SSHD_CONFIG}.bak_$(date +%F)"
echo "Respaldo de sshd_config creado."

echo "--- [2/5] Configuración de Usuario y Jaula (Chroot) ---"
# Crear usuario con shell restringido si no existe
if ! id "$USER_SFTP" &>/dev/null; then
    sudo useradd -m -s /sbin/nologin $USER_SFTP
    echo "$USER_SFTP:$PASS_SFTP" | sudo chpasswd
fi

# Permisos para Chroot 
sudo chown root:root $DIR_BASE
sudo chmod 755 $DIR_BASE
sudo mkdir -p $DIR_IMPORT
sudo chown $USER_SFTP:$USER_SFTP $DIR_IMPORT
sudo chmod 775 $DIR_IMPORT

echo "--- [3/5] Configurando SSH para SFTP Seguro ---"

sudo sed -i "/Match User $USER_SFTP/,\$d" $SSHD_CONFIG

# Cambiar el subsistema a internal-sftp y añadir reglas al final
sudo sed -i 's|^Subsystem.*sftp.*|Subsystem sftp internal-sftp|' $SSHD_CONFIG

sudo tee -a $SSHD_CONFIG > /dev/null <<EOF

Match User $USER_SFTP
    ChrootDirectory $DIR_BASE
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
    PasswordAuthentication yes
EOF

sudo systemctl restart sshd

echo "--- [4/5] Configurando MariaDB (secure_file_priv) ---"
sudo mkdir -p /etc/my.cnf.d/
sudo tee /etc/my.cnf.d/import_config.cnf > /dev/null <<EOF
[mariadb]
secure_file_priv="$DIR_IMPORT"
EOF

sudo systemctl restart mariadb

echo "--- [5/5] Verificación Final ---"
echo "Estado SSH: $(systemctl is-active sshd)"
echo "Estado MariaDB: $(systemctl is-active mariadb)"
echo "------------------------------------------------"
echo "¡LISTO! Intenta conectar FileZilla usando sftp://$USER_SFTP@25.0.149.144"

