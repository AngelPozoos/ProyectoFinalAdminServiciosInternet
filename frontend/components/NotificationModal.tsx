'use client';

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'confirm';

interface NotificationModalProps {
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message?: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function NotificationModal({
    isOpen,
    type,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
}: NotificationModalProps) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-8 h-8 text-green-600" />;
            case 'error':
                return <AlertCircle className="w-8 h-8 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
            case 'confirm':
                return <AlertTriangle className="w-8 h-8 text-blue-600" />;
            case 'info':
            default:
                return <Info className="w-8 h-8 text-blue-600" />;
        }
    };

    const getIconBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-100';
            case 'error':
                return 'bg-red-100';
            case 'warning':
                return 'bg-yellow-100';
            case 'confirm':
                return 'bg-blue-100';
            case 'info':
            default:
                return 'bg-blue-100';
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={type === 'confirm' ? undefined : onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scaleIn">
                {/* Close Button - Only show for non-confirm types */}
                {type !== 'confirm' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 ${getIconBgColor()} rounded-full flex items-center justify-center`}>
                        {getIcon()}
                    </div>
                </div>

                {/* Text */}
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    {title}
                </h2>
                {message && (
                    <p className="text-center text-gray-600 mb-8">
                        {message}
                    </p>
                )}

                {/* Action Buttons */}
                <div className={`flex ${type === 'confirm' ? 'flex-row-reverse' : 'flex-col'} gap-3`}>
                    <button
                        onClick={handleConfirm}
                        className={`${type === 'confirm' ? 'flex-1' : 'w-full'} bg-slate-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-800 transition-all shadow-lg`}
                    >
                        {confirmText}
                    </button>
                    {type === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all"
                        >
                            {cancelText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
