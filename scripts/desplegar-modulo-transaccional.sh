#!/bin/bash
echo "--- [1/4] Estructurando Módulo Transaccional Canónico (NestJS) ---"
cat << 'EOF' > /var/www/html/backend/src/transactional/transactional.module.ts
import { Module } from '@nestjs/common';
import { PayPalService } from './paypal.service';
import { MailService } from './mail.service';
import { TransactionalController } from './transactional.controller';
import { TransactionalService } from './transactional.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [TransactionalController],
  providers: [PayPalService, MailService, TransactionalService, PrismaService],
  exports: [PayPalService, MailService],
})
export class TransactionalModule {}
EOF

echo "--- [2/4] Ejecutando compilación estática del proyecto (Build AOT) ---"
cd /var/www/html/backend
rm -rf dist tsconfig.tsbuildinfo node_modules/.cache
npm run build

echo "--- [3/4] Purga crítica de sockets e hilos huérfanos en puerto 3005 ---"
pm2 kill
fuser -k 3005/tcp > /dev/null 2>&1
kill -9 $(lsof -t -i:3005) > /dev/null 2>&1

echo "--- [4/4] Inicializando Daemon de Producción en PM2 ---"
MAIN_PATH=$(find /var/www/html/backend/dist -name "main.js" | head -n 1)

if [ -z "$MAIN_PATH" ]; then
    echo " ERROR: No se localizó el artefacto compilado main.js en el árbol dist."
    exit 1
fi

pm2 start "$MAIN_PATH" --name "api-tienda"
pm2 save > /dev/null
echo "  ¡DESPLIEGUE NOMINAL COMPLETADO EN ROUTE: $MAIN_PATH!"

