#!/bin/bash
# Definición de variables globales basadas en el File System real de la VM
BACKEND_DIR="/var/www/html/backend"
SCRIPT_JS="$BACKEND_DIR/sincronizar-ahora.js"

clear
echo " Disparo Manual Ejecutado a las: $(date '+%H:%M:%S')"

# 1. Validación de existencia del artefacto lógico
if [ -f "$SCRIPT_JS" ]; then
    node "$SCRIPT_JS"
else
    echo "ERROR: No se encontró el script lógico en la ruta: $SCRIPT_JS"
    exit 1
fi

# 2. Evaluación del código de salida para refresco del Proxy Inverso
if [ $? -eq 0 ]; then
    echo "---------------------------------------------------------"
    echo " Refrescando el proxy inverso (Nginx)..."
    systemctl restart nginx > /dev/null 2>&1
    echo "        ¡DEMOSTRACIÓN BAJO DEMANDA COMPLETA!             "
    echo " Catálogo actualizado. Revisa en tu Windows: app.tienda.local"
fi

