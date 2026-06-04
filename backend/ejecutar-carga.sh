#!/bin/bash

BACKEND_DIR="/var/www/html/backend"
SCRIPT_JS="$BACKEND_DIR/sincronizar-ahora.js"

clear
echo "========================================================="
echo "   FACULTAD DE INGENIERÍA - UNAM: PIPELINE DE INGESTA    "
echo "========================================================="
echo " Disparo Manual Ejecutado a las: $(date '+%H:%M:%S')"
echo "---------------------------------------------------------"

# 1. Ejecutar el script lógico de Node.js
if [ -f "$SCRIPT_JS" ]; then
    node "$SCRIPT_JS"
else
    echo "❌ ERROR: No se encontró el script en: $SCRIPT_JS"
    exit 1
fi

# 2. Si todo sale bien, refrescar Nginx
if [ $? -eq 0 ]; then
    echo "---------------------------------------------------------"
    echo "🔄 Refrescando el proxy inverso (Nginx)..."
    systemctl restart nginx > /dev/null 2>&1
    echo "========================================================="
    echo "        ¡DEMOSTRACIÓN BAJO DEMANDA COMPLETA!             "
    echo "========================================================="
    echo " Catálogo actualizado. Revisa en tu Windows: app.tienda.local"
    echo "=========================================================\n"
fi
