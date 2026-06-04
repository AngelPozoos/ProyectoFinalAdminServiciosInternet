#!/bin/bash
# Script NGINX (VM2) para la instalación, limpieza de puertos y Proxy Inverso

IP_HAMACHI="25.0.149.144"

echo "[$(date)] >>> INICIANDO PROVISIÓN INTEGRAL EN VM2..."

# 1. ADQUISICIÓN DE PAQUETES
echo "[$(date)] Instalando Nginx desde repositorios oficiales..."
sudo yum install nginx -y

# 2. RESOLUCIÓN DE CONFLICTOS DE PUERTO 80
echo "[$(date)] Liberando puerto 80 (Stop httpd)..."
sudo systemctl stop httpd > /dev/null 2>&1
sudo systemctl disable httpd > /dev/null 2>&1

# 3. REESTRUCTURACIÓN DE CONFIGURACIÓN MAESTRA
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
sudo tee /etc/nginx/nginx.conf > /dev/null <<EOF
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
events { worker_connections 1024; }
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    include /etc/nginx/conf.d/*.conf;
}
EOF

# 4. CONFIGURACIÓN DEL PROXY INVERSO
sudo tee /etc/nginx/conf.d/tienda.conf > /dev/null <<EOF
server {
    listen 80;
    server_name $IP_HAMACHI app.tienda.local;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 5. HARDENING Y SEGURIDAD DEL SISTEMA
echo "[$(date)] Aplicando políticas de SELinux y Firewall..."
sudo setsebool -P httpd_can_network_connect 1
sudo firewall-cmd --permanent --add-service=http > /dev/null 2>&1
sudo firewall-cmd --reload > /dev/null 2>&1

# 6. ACTIVACIÓN Y VERIFICACIÓN
echo "[$(date)] Validando y activando servicio..."
if sudo nginx -t && sudo systemctl restart nginx; then
    sudo systemctl enable nginx
    echo "[$(date)] >>> DESPLIEGUE EXITOSO: http://$IP_HAMACHI"
else
    echo "[$(date)] >>> ERROR CRÍTICO EN LA PROVISIÓN."
    exit 1
fi

