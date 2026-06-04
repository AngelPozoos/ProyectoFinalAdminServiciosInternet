'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Package, Home, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { getTotalItems } = useCart();
    const { user, logout, isAuthenticated } = useAuth();

    const navLinks = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/catalogo', label: 'Catálogo', icon: Package },
        { href: '/checkout', label: 'Carrito', icon: ShoppingCart },
        { href: '/mis-pedidos', label: 'Mis Pedidos', icon: Package },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-md">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <span className="text-xl font-bold text-primary hidden sm:block tracking-tight">AetherTech</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {!user || user.rol !== 'ADMINISTRADOR' ? navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            const isCart = link.href === '/checkout';
                            const totalItems = getTotalItems();

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative
                    ${active
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                        }
                  `}
                                >
                                    <div className="relative">
                                        <Icon className="w-4 h-4" />
                                        {isCart && totalItems > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                                                {totalItems > 99 ? '99+' : totalItems}
                                            </span>
                                        )}
                                    </div>
                                    <span>{link.label}</span>
                                </Link>
                            );
                        }) : null}

                        {/* Auth Section */}
                        {isAuthenticated && user ? (
                            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                                <span className="text-sm font-medium text-gray-700">
                                    Bienvenido, <span className="font-bold text-primary">{user.nombre}</span>
                                </span>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="ml-4 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all shadow-md"
                            >
                                <User className="w-4 h-4" />
                                <span>Iniciar Sesión</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {!user || user.rol !== 'ADMINISTRADOR' ? navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            const isCart = link.href === '/checkout';
                            const totalItems = getTotalItems();

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${active
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                        }
                  `}
                                >
                                    <div className="relative">
                                        <Icon className="w-5 h-5" />
                                        {isCart && totalItems > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                                                {totalItems > 99 ? '99+' : totalItems}
                                            </span>
                                        )}
                                    </div>
                                    <span>{link.label}</span>
                                </Link>
                            );
                        }) : null}

                        {/* Mobile Auth Section */}
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            {isAuthenticated && user ? (
                                <div className="space-y-3">
                                    <div className="px-4 text-sm font-medium text-gray-700">
                                        Bienvenido, <span className="font-bold text-primary">{user.nombre}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all shadow-md"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Iniciar Sesión</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
