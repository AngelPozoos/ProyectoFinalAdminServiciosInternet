'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, CreditCard, Truck } from 'lucide-react';
import FeaturedCarousel from '@/components/FeaturedCarousel';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 50,
      damping: 20,
    },
  },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 50,
      damping: 20,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary overflow-x-hidden">
      {/* Hero Section - Reduced padding */}
      <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight leading-tight"
            variants={itemVariants}
          >
            Descubre el Futuro. <span className="text-accent">Hoy.</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Innovación, rendimiento y diseño minimalista. Explora la tecnología de vanguardia seleccionada por expertos para elevar tu experiencia digital.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link
              href="/catalogo"
              className="inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-accent transform hover:-translate-y-1 transition-all duration-300"
            >
              Explorar Catálogo
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Carousel Section - Moved up */}
      <section className="py-20 bg-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Ofertas Exclusivas de la Semana
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          <FeaturedCarousel />
        </motion.div>
      </section>

      {/* Differentiators Section - Moved down */}
      <section className="py-20 bg-secondary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {/* Card 1: Pagos Seguros */}
            <motion.div
              variants={cardVariants}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 shadow-sm text-primary">
                <CreditCard size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Pagos Seguros</h3>
              <p className="text-gray-600 leading-relaxed">
                Aceptamos todas las tarjetas, PayPal y débito. Transacciones encriptadas y 100% seguras.
              </p>
            </motion.div>

            {/* Card 2: Rendimiento Puro */}
            <motion.div
              variants={cardVariants}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 shadow-sm text-primary">
                <Zap size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Rendimiento Puro</h3>
              <p className="text-gray-600 leading-relaxed">
                Potencia sin compromisos. Dispositivos optimizados para ofrecer la máxima velocidad y eficiencia en cada tarea.
              </p>
            </motion.div>

            {/* Card 3: Envío Confiable */}
            <motion.div
              variants={cardVariants}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 shadow-sm text-primary">
                <Truck size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Envío Confiable</h3>
              <p className="text-gray-600 leading-relaxed">
                Sistema de envíos seguros y rastreados hasta tu puerta. Cancelación flexible en cualquier momento.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
