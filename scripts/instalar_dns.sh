#!/bin/bash
# ==========================================================
# SERVICIO: DNS BIND9 (RESOLUCIÓN LOCAL)
# NODO: VM1-GATEWAY (25.37.103.223)
# ==========================================================

# 1. Instalación de paquetería
sudo dnf install -y bind bind-utils

# 2. Generación dinámica de la configuración principal (/etc/named.conf)
cat <<EOF > /etc/named.conf
options {
    listen-on port 53 { 127.0.0.1; 25.37.103.223; };
    directory       "/var/named";
    allow-query     { localhost; 25.0.0.0/8; }; # Red Hamachi
    recursion yes;
};

zone "tienda.local" IN {
    type master;
    file "tienda.local.db";
};

zone "37.25.in-addr.arpa" IN {
    type master;
    file "tienda.local.rev";
};
EOF

# 3. Creación de registros de Zona Directa e Inversa
# [Configuración de registros A y PTR para Gateway y App]
cat <<EOF > /var/named/tienda.local.db
\$TTL 86400
@   IN  SOA gateway.tienda.local. admin.tienda.local. ( $(date +%Y%m%d)01 3600 1800 604800 86400 )
@       IN  NS      gateway.tienda.local.
gateway IN  A       25.37.103.223
app     IN  A       25.37.52.47
www     IN  CNAME   app
EOF

cat <<EOF > /var/named/tienda.local.rev
\$TTL 86400
@   IN  SOA gateway.tienda.local. admin.tienda.local. ( $(date +%Y%m%d)01 3600 1800 604800 86400 )
@       IN  NS      gateway.tienda.local.
223.103 IN  PTR     gateway.tienda.local.
47.52   IN  PTR     app.tienda.local.
EOF

# 4. Seguridad y Persistencia
chown named:named /var/named/tienda.local.*
sudo firewall-cmd --add-service=dns --permanent
sudo firewall-cmd --reload
systemctl enable named --now
systemctl restart named
