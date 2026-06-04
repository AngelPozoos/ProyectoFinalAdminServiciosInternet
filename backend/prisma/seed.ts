import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const products = [
        {
            nombre: 'Laptop Gamer Asus TUF F15',
            descripcion: 'Potente laptop con procesador i9, RTX 4080 y 32GB RAM. Ideal para gaming y trabajo pesado.',
            precio: 26800.00,
            sku: 'TECH-LAP-001',
            stock: 15,
            categoria: 'Computación',
            imagenes: 'https://www.asus.com/media/global/gallery/63nq57jtwcnkqduo_setting_xxx_0_90_end_800.png',
        },
        {
            nombre: 'Samsung S25 Ultra 5G',
            descripcion: 'Pantalla AMOLED 120Hz, cámara de 200MP y batería de larga duración.',
            precio: 22999.00,
            sku: 'TECH-PHN-002',
            stock: 50,
            categoria: 'Telefonía',
            imagenes: 'https://images.samsung.com/is/image/samsung/p6pim/mx/2501/gallery/mx-galaxy-s25-s938-sm-s938bzbvltm-544706905?imbypass=true',
        },
        {
            nombre: 'Sony WH-1000XM5',
            descripcion: 'Sonido de alta fidelidad con cancelación de ruido activa y 30 horas de batería.',
            precio: 5499.00,
            sku: 'TECH-AUD-003',
            stock: 80,
            categoria: 'Audio',
            imagenes: 'https://www.wirelessplace.com/cdn/shop/files/103379_original_local_1200x1050_v3_converted_800x700.webp?v=1725380739',
        },
        {
            nombre: 'Apple Watch Series 10 42 mm',
            descripcion: 'Monitoreo de salud avanzado, GPS integrado y resistencia al agua.',
            precio: 8999.00,
            sku: 'TECH-WCH-004',
            stock: 30,
            categoria: 'Wearables',
            imagenes: 'https://www.applex.com.bd/cdn/shop/files/Apple_Watch_Series_10_Silver_1.webp?v=1738426312&width=1946',
        },
        {
            nombre: 'Monitor Gamer ASUS 4K UltraWide',
            descripcion: 'Monitor curvo WQHD (3440x1440) 1500R de 34 pulgadas con frecuencia de actualización ultrarrápida de 165Hz diseñado para jugadores profesionales y juegos inmersivos',
            precio: 8500.00,
            sku: 'TECH-MON-005',
            stock: 20,
            categoria: 'Periféricos',
            imagenes: 'https://dlcdnwebimgs.asus.com/gain/221f99c6-cbe7-473e-a23a-4b7295b651c8/1725380739/1725380739_1200x1050_v3_converted_800x700.webp',
        },
        {
            nombre: 'Teclado HyperX Alloy Origins 65',
            descripcion: 'Teclado mecánico para gaming duradero y extremadamente portátil con factor de forma al 65 % que brinda más espacio para mover el mouse con gran alcance.',
            precio: 3200.00,
            sku: 'TECH-KBD-006',
            stock: 75,
            categoria: 'Periféricos',
            imagenes: 'https://hp.widen.net/content/7gz8jlzkar/png/7gz8jlzkar.png?w=800&h=600&dpi=72&color=ffffff00',
        }
    ];

    for (const product of products) {
        await prisma.producto.upsert({
            where: { sku: product.sku },
            create: product,
            update: product,  // aquí se actualizan nombre, descripcion, imagenes, etc.
        });
    }

    // Create Client User
    const clientEmail = 'cliente@aether.com';
    const clientUser = await prisma.usuario.findUnique({ where: { email: clientEmail } });
    if (!clientUser) {
        // Simple hash for demo purposes (In production use bcrypt/argon2)
        const crypto = require('crypto');
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync('cliente123', salt, 1000, 64, 'sha512').toString('hex');
        const password = `${salt}:${hash}`;

        await prisma.usuario.create({
            data: {
                email: clientEmail,
                nombre: 'Cliente Aether',
                password: password,
                rol: 'CLIENTE',
            },
        });
        console.log('Client user created: cliente@aether.com / cliente123');
    }

    // Create Admin User
    const adminEmail = 'admin@aether.com';
    const adminUser = await prisma.usuario.findUnique({ where: { email: adminEmail } });
    if (!adminUser) {
        const crypto = require('crypto');
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync('admin123', salt, 1000, 64, 'sha512').toString('hex');
        const password = `${salt}:${hash}`;

        await prisma.usuario.create({
            data: {
                email: adminEmail,
                nombre: 'Administrador Aether',
                password: password,
                rol: 'ADMINISTRADOR',
            },
        });
        console.log('Admin user created: admin@aether.com / admin123');
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

