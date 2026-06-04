#!/bin/bash

# --- CONFIGURACIÓN DE RUTAS ---
BACKEND_DIR="/var/www/html/backend"
ENV_FILE="$BACKEND_DIR/.env"
SERVICE_DIR="$BACKEND_DIR/src/transactional"
SERVICE_FILE="$SERVICE_DIR/paypal.service.ts"

echo "========================================================="
echo "   INICIANDO CONFIGURACIÓN AUTOMATIZADA DE PAYPAL        "
echo "========================================================="

cd $BACKEND_DIR

echo "--- [1/4] Instalando cliente HTTP Axios ---"
npm install axios --save > /dev/null 2>&1

echo "--- [2/4] Configurando variables de entorno (.env) ---"
# Evitar duplicados: Solo inyecta si no encuentra la variable en el archivo
if ! grep -q "PAYPAL_CLIENT_ID" "$ENV_FILE"; then
    sudo tee -a $ENV_FILE > /dev/null <<EOF

PAYPAL_CLIENT_ID="TU_CLIENT_ID_DE_SANDBOX"
PAYPAL_CLIENT_SECRET="TU_CLIENT_SECRET_DE_SANDBOX"
PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
EOF
    echo "Variables de PayPal añadidas con éxito al archivo .env"
else
    echo "Las variables de PayPal ya existen en el archivo .env. Omitiendo paso."
fi

echo "--- [3/4] Creando servicio transaccional (paypal.service.ts) ---"
sudo mkdir -p $SERVICE_DIR

sudo tee $SERVICE_FILE > /dev/null << 'EOF'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaypalService {
    private readonly clientId = process.env.PAYPAL_CLIENT_ID;
    private readonly clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    private readonly apiUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

    // 1. Mecanismo de Autenticación Hermética mediante OAuth2
    private async generateAccessToken(): Promise<string> {
        try {
            const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            const response = await axios({
                url: `${this.apiUrl}/v1/oauth2/token`,
                method: 'POST',
                data: 'grant_type=client_credentials',
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data.access_token;
        } catch (error) {
            throw new HttpException(
                'Fallo en la autenticación con la pasarela de PayPal',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // 2. Creación de Orden Transaccional (Genera la URL de aprobación para la página web)
    async createOrder(total: number, nombreMoneda: string = 'MXN') {
        try {
            const accessToken = await this.generateAccessToken();
            const response = await axios({
                url: `${this.apiUrl}/v2/checkout/orders`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: nombreMoneda,
                                value: total.toFixed(2),
                            },
                            description: 'Compra segura en Tienda Virtual UNAM',
                        },
                    ],
                    application_context: {
                        brand_name: 'TIENDA VIRTUAL UNAM',
                        landing_page: 'NO_PREFERENCE',
                        user_action: 'PAY_NOW',
                        return_url: 'http://localhost:3000/checkout/success',
                        cancel_url: 'http://localhost:3000/checkout/cancel',
                    },
                },
            });

            const approvalUrl = response.data.links.find((link: any) => link.rel === 'approve')?.href;

            return {
                id: response.data.id,
                status: response.data.status,
                urlAprobacion: approvalUrl,
            };
        } catch (error) {
            const statusErr = error.response?.status || HttpStatus.BAD_REQUEST;
            throw new HttpException(
                error.response?.data || 'Error al procesar la orden con PayPal',
                statusErr,
            );
        }
    }

    // 3. Captura del Pago (Se ejecuta cuando el cliente vuelve de PayPal tras autorizar el cargo)
    async captureOrder(orderId: string) {
        try {
            const accessToken = await this.generateAccessToken();
            const response = await axios({
                url: `${this.apiUrl}/v2/checkout/orders/${orderId}/capture`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            return {
                estado: response.data.status,
                idTransaccion: response.data.purchase_units[0]?.payments?.captures[0]?.id,
                emailCliente: response.data.payer?.email_address,
            };
        } catch (error) {
            throw new HttpException(
                'No se pudo consolidar la captura del pago en PayPal',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
EOF

echo "--- [4/4] Reconstruyendo entorno de producción ---"
npm run build

echo "========================================================="
echo "   ¡PROCESAMIENTO COMPLETO Y COMPILADO CON ÉXITO!        "
echo "========================================================="
echo "Tip: Recuerda reiniciar pm2 ejecutando: pm2 restart api-tienda"
