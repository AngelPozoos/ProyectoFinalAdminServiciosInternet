'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface Product {
    id: string;
    nombre: string;
    descripcion: string;
    precio: string;
    imagenes: string | string[];
    categoria: string;
}

export default function FeaturedCarousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products from the API
        api.get('/catalog')
            .then((res) => {
                // Take only the first 4 products for the carousel
                const featuredProducts = res.data.slice(0, 4);
                setProducts(featuredProducts);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch products', err);
                setLoading(false);
            });
    }, []);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = products.length - 1;
            if (nextIndex >= products.length) nextIndex = 0;
            return nextIndex;
        });
    };

    // Auto-advance
    useEffect(() => {
        if (products.length === 0) return;

        const timer = setInterval(() => {
            paginate(1);
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, products.length]);

    if (loading || products.length === 0) {
        return (
            <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl bg-white flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    const product = products[currentIndex];
    const imageList = typeof product.imagenes === 'string'
        ? product.imagenes.split(',')
        : (Array.isArray(product.imagenes) ? product.imagenes : []);
    const productImage = imageList.length > 0 ? imageList[0] : '';

    return (
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl bg-white">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring" as const, stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute w-full h-full flex flex-col md:flex-row"
                    >
                        {/* Image Section */}
                        <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden bg-gray-100">
                            {productImage ? (
                                <img
                                    src={productImage}
                                    alt={product.nombre}
                                    className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-700 hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Sin Imagen
                                </div>
                            )}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                                {product.categoria}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-center bg-white">
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-4xl font-bold text-primary mb-4"
                            >
                                {product.nombre}
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-600 text-lg mb-8 leading-relaxed line-clamp-3"
                            >
                                {product.descripcion}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center justify-between"
                            >
                                <span className="text-3xl font-bold text-primary">
                                    ${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <Link
                                    href={`/catalogo/${product.id}`}
                                    className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-accent transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <ShoppingBag size={20} />
                                    <span>Ver Detalles</span>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg backdrop-blur-sm transition-all z-10"
                    onClick={() => paginate(-1)}
                    aria-label="Producto anterior"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg backdrop-blur-sm transition-all z-10"
                    onClick={() => paginate(1)}
                    aria-label="Siguiente producto"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {products.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Ir al producto ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
