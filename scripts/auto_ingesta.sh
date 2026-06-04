#!/bin/bash
# auto_ingesta.sh - Servicio de Vigilancia de Datos

DIRECTORIO="/var/www/html/import"
ARCHIVO_CSV="productos.csv"
DB_USER="user_tienda"
DB_PASS="canelo2012"
DB_NAME="ecommerce_db"

echo "[$(date)] >>> Vigilante iniciado en $DIRECTORIO"

# Monitoreo de eventos en el kernel de Linux
inotifywait -m -e close_write "$DIRECTORIO" --format '%f' | while read FILENAME
do
    # Validar que el archivo detectado es el objetivo
    if [ "$FILENAME" == "$ARCHIVO_CSV" ]; then
        echo "[$(date)] INFO: Detectado archivo $FILENAME. Iniciando ingesta..."

        # Ejecución de carga masiva con lógica de REPLACE (Upsert)
        RESULTADO=$(mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
            LOAD DATA INFILE '$DIRECTORIO/$FILENAME'
            REPLACE INTO TABLE Product
            FIELDS TERMINATED BY ','
            ENCLOSED BY '\"'
            LINES TERMINATED BY '\r\n'
            IGNORE 1 ROWS
            (nombre, descripcion, precio, sku, stock, categoria, imagenes)
            SET id = UUID();
            SHOW WARNINGS;
        " 2>&1)

        # Verificación de integridad del proceso
        if [ $? -eq 0 ]; then
            echo "[$(date)] ÉXITO: Sincronización completada con MariaDB."
            echo "Detalle: $RESULTADO"
        else
            echo "[$(date)] ERROR: Fallo en la carga masiva."
            echo "Detalle: $RESULTADO"
        fi
    fi
done
