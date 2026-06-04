import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

async function main() {
    const email = 'manager@aether.com';
    const password = 'admin123';
    const hashedPassword = hashPassword(password);

    console.log(`Creating admin user: ${email}`);

    const user = await prisma.usuario.upsert({
        where: { email },
        update: {
            rol: 'ADMINISTRADOR',
            password: hashedPassword
        },
        create: {
            email,
            nombre: 'Manager Aether',
            password: hashedPassword,
            rol: 'ADMINISTRADOR',
        },
    });

    console.log(`User ${user.email} created/updated with role ${user.rol}`);
    console.log(`Password: ${password}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
