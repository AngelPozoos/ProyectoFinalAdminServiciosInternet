#!/bin/bash
# script de  balanceador de cargas (VM1) con el propósito de Gateway y Balanceo de Carga hacia VM2

# IP del nodo de aplicación (VM2)
APP_SERVER_IP="25.0.149.144"

echo "[$(date)] >>> INICIANDO PROVISIÓN DE BALANCEADOR EN VM1..."

# 1. INSTALACIÓN DE DEPENDENCIAS
sudo yum install nginx -y

# 2. LIMPIEZA DE CONFLICTOS
sudo systemctl stop httpd > /dev/null 2>&1
sudo systemctl disable httpd > /dev/null 2>&1

# 3. CONFIGURACIÓN DEL CLÚSTER Y BALANCEO
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
sudo tee /etc/nginx/nginx.conf > /dev/null <<EOF
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
events { worker_connections 1024; }
http {
    include /etc/nginx/mime.types;
   
    # Definición del clúster de servidores
    upstream backend_cluster {
        server $APP_SERVER_IP:80; # VM2
        # server 25.x.x.x:80;      # Futura VM3
    }

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://backend_cluster;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        }
    }
}
EOF

# 4. SEGURIDAD Y PERMISOS DE RED
# Permitir que el balanceador haga 'relay' de las peticiones
sudo setsebool -P httpd_can_network_connect 1
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload

# 5. ACTIVACIÓN
if sudo nginx -t && sudo systemctl restart nginx; then
    sudo systemctl enable nginx
    echo "[$(date)] >>> GATEWAY VM1 ACTIVO. Apuntando a $APP_SERVER_IP"
else
    echo "[$(date)] >>> ERROR EN LA CONFIGURACIÓN DEL BALANCEADOR."
    exit 1
fi

