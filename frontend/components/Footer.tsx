'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-primary text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">AetherTech</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Innovación, rendimiento y diseño minimalista. Tu destino para la tecnología del futuro.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href="/catalogo" className="text-gray-300 hover:text-white transition-colors">
                                    Catálogo
                                </Link>
                            </li>
                            <li>
                                <Link href="/checkout" className="text-gray-300 hover:text-white transition-colors">
                                    Carrito
                                </Link>
                            </li>
                            <li>
                                <Link href="/mis-pedidos" className="text-gray-300 hover:text-white transition-colors">
                                    Mis Pedidos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-gray-300" />
                                <span className="text-gray-300">contacto@aethertech.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-gray-300" />
                                <span className="text-gray-300">+52 (55) 1234-5678</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MapPin size={18} className="text-gray-300" />
                                <span className="text-gray-300">Ciudad de México, México</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 pt-8 text-center">
                    <p className="text-gray-300 text-sm">
                        © {new Date().getFullYear()} AetherTech. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
