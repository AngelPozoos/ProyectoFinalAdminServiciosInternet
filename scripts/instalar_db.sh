#!/bin/bash
# SERVICIO: MARIADB SERVER (CAPA DE PERSISTENCIA)
# NODO: VM2-APP-SERVER (25.37.52.47)

# 1. Instalación de paquetería y dependencias
sudo dnf install -y mariadb-server

# 2. Inicialización y persistencia del servicio
systemctl enable mariadb --now

# 3. Protocolo de Hardening Automático
# Credencial administrativa
DB_ROOT_PASS="canelo2012"

mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_ROOT_PASS';"
mysql -u root -p"$DB_ROOT_PASS" -e "DELETE FROM mysql.user WHERE User='';"
mysql -u root -p"$DB_ROOT_PASS" -e "DROP DATABASE IF EXISTS test;"
mysql -u root -p"$DB_ROOT_PASS" -e "FLUSH PRIVILEGES;"

# 4. Creación de Esquema Lógico y Gestión de Privilegios
mysql -u root -p"$DB_ROOT_PASS" <<EOF
CREATE DATABASE ecommerce_db;

-- Usuario para la aplicación local y auditoría remota (Gateway)
CREATE USER 'user_tienda'@'localhost' IDENTIFIED BY 'canelo2012';
CREATE USER 'user_tienda'@'25.37.103.223' IDENTIFIED BY 'canelo2012';

GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'user_tienda'@'localhost';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'user_tienda'@'25.37.103.223';

USE ecommerce_db;

-- Tabla para gestión masiva de inventario (Requisito CSV)
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para trazabilidad de ventas (Requisito Comprobante)
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(100) UNIQUE NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

FLUSH PRIVILEGES;
EOF

# 5. Configuración Perimetral (FirewallD)
sudo firewall-cmd --add-port=3306/tcp --permanent
sudo firewall-cmd --reload

