#!/bin/bash
# SERVICIO: APACHE HTTPD + PHP 8 (CAPA DE APLICACIÓN)
# NODO: VM2-APP-SERVER (25.0.149.144)

# 1. Instalación de servidor web y motor PHP con extensiones críticas
sudo dnf install -y httpd php php-mysqlnd php-gd php-json

# 2. Configuración de Seguridad Perimetral (Apertura de puertos web)
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --reload

# 3. Activación y persistencia del demonio de Apache
systemctl enable httpd --now

# 4. Ajuste de Propiedad y Permisos (Seguridad del Directorio Raíz)
# Permite que el proceso de Apache gestione correctamente los archivos del repositorio
chown -R apache:apache /var/www/html/
chmod -R 755 /var/www/html/

# 5. Generación del Script de Validación de Infraestructura (Integridad Web-DB)
cat <<EOF > /var/www/html/check_infra.php
<?php
// Parámetros de conexión homologados
\$conn = new mysqli("localhost", "user_tienda", "canelo2012", "ecommerce_db");

if (\$conn->connect_error) {
    echo "Error de infraestructura: " . \$conn->connect_error;
} else {
    echo "Capa de Aplicación conectada exitosamente a la Capa de Persistencia (MariaDB).";
    echo "<br>Estado: Operativo | Nodo: VM2-App Server";
}
?>
EOF

echo "--- Despliegue de Capa de Aplicación Finalizado ---"