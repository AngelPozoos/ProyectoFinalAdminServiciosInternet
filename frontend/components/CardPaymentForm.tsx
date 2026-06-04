'use client';

import { useState } from 'react';
import { useNotification } from '@/app/context/NotificationContext';

interface CardPaymentFormProps {
    onApprove: (orderId: string, cardholderName: string) => Promise<void>;
    onError: (error: any) => void;
    amount: number;
    disabled?: boolean;
}

export default function CardPaymentForm({ onApprove, onError, amount, disabled }: CardPaymentFormProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const { showNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!cardNumber || !expiry || !cvv || !cardholderName) {
            showNotification({
                type: 'warning',
                title: 'Por favor completa todos los campos de la tarjeta',
            });
            return;
        }

        setIsProcessing(true);

        try {
            // SIMULATION FOR DEMO PURPOSES
            // Instead of calling PayPal API, we simulate a successful processing delay
            console.log('Processing demo payment...');
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Card details (demo):', { cardNumber, expiry, cvv, cardholderName });

            // Pass a fake order ID to the parent component
            // The parent component will then create the order in our local DB
            await onApprove('DEMO-ORDER-' + Date.now(), cardholderName);

        } catch (error) {
            console.error('Card payment error:', error);
            onError(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Tarjeta
                </label>
                <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={disabled || isProcessing}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Expiración
                    </label>
                    <input
                        type="text"
                        value={expiry}
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setExpiry(value);
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={disabled || isProcessing}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                    </label>
                    <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={disabled || isProcessing}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Titular
                </label>
                <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="JUAN PEREZ"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                    disabled={disabled || isProcessing}
                />
            </div>

            <button
                type="submit"
                disabled={disabled || isProcessing}
                className="btn btn-primary w-full py-3 text-lg"
            >
                {isProcessing ? 'Procesando pago...' : 'Pagar con Tarjeta'}
            </button>
        </form>
    );
}
