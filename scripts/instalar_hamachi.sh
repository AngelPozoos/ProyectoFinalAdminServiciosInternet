#!/bin/bash
# PROYECTO: E-COMMERCE SEGURO 
# SERVICIO: VPN LOGMEIN HAMACHI

echo "--- Iniciando Despliegue de Red (Modo Resiliente) ---"

# 1. LIMPIEZA TOTAL
sudo pkill -9 hamachid
sudo rm -f /var/run/logmein-hamachi/hamachid.pid
sleep 2

# 2. ARRANQUE DEL MOTOR
sudo /opt/logmein-hamachi/bin/hamachid &
echo "[INFO] Esperando 15 segundos para sincronización global..."
sleep 15 # TIEMPO CRÍTICO: No lo bajes, Hamachi es lento en el arranque

# 3. LOGIN Y NICKNAME
sudo hamachi login
sudo hamachi set-nick VM1-Gateway

# 4. BUCLE DE UNIÓN (INTENTARÁ 3 VECES SI SALE 'BUSY')
MAX_RETRIES=3
COUNT=1
SUCCESS=false

while [ $COUNT -le $MAX_RETRIES ]; do
    echo "[INTENTO $COUNT/$MAX_RETRIES] Solicitando unión a Tienda_ASI..."
    OUTPUT=$(sudo hamachi join Tienda_ASI canelo2012)
   
    if [[ $OUTPUT == *"ok"* ]]; then
        echo "[ÉXITO] Vinculación completada correctamente."
        SUCCESS=true
        break
    else
        echo "[ERROR] El servidor respondió: $OUTPUT. Reintentando en 10s..."
        sleep 10
        ((COUNT++))
    fi
done

# 5. VERIFICACIÓN FINAL
if [ "$SUCCESS" = true ]; then
    echo "------------------------------------------------------"
    sudo hamachi list
    echo "------------------------------------------------------"
else
    echo "[!] FALLO CRÍTICO: Revisa si la red en Windows está llena (5/5)."
fi
