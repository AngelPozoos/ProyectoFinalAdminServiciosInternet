#!/bin/bash
# configuración
EMAIL_TEST="admin.tienda@unam.mx"
PASS_PLANA="UnamGlobal2026$"
NOMBRE_USER="Luis Enrique Zavala"

echo "--- [1/3] Verificando dependencias de bcrypt ---"
npm install bcrypt --save > /dev/null 2>&1

echo "--- [2/3] Creando script adaptativo para MariaDB ---"
cat << 'EOF' > insertar-usuario-seguro.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Escaneo dinámico de modelos cargados en el cliente de Prisma
  const modelosDisponibles = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'));
 
  // Resolución del nombre de la tabla de identidades
  const tablaUsuarios = modelosDisponibles.find(m =>
    m.toLowerCase().includes('user') || m.toLowerCase().includes('usuario')
  );

  if (!tablaUsuarios) {
    console.log('\n ERROR: No se detectó ninguna tabla de usuarios en tu schema.prisma.');
    process.exit(1);
  }

  console.log(`    [Prisma] Introspección exitosa. Usando modelo: prisma.${tablaUsuarios}`);

  const emailTest = 'admin.tienda@unam.mx';
  const contrasenaPlana = 'UnamGlobal2026$';
 
  console.log('    [Bcrypt] Generando hash para la contraseña...');
  const salt = await bcrypt.genSalt(10);
  const contrasenaCifrada = await bcrypt.hash(contrasenaPlana, salt);
 
  console.log(`    [MariaDB] Insertando/Actualizando credenciales en la tabla...`);
 
  // Operación idempotente (Upsert) adaptada al diccionario de datos
  const usuario = await prisma[tablaUsuarios].upsert({
    where: { email: emailTest },
    update: { password: contrasenaCifrada },
    create: {
      email: emailTest,
      password: contrasenaCifrada,
      nombre: 'Luis Enrique Zavala',
    },
  });
  console.log('\n=========================================================');
  console.log('   ¡CONFIGURACIÓN EXITOSA DE BCRYPT Y USUARIO BASE!     ');
  console.log('=========================================================');
  console.log(`Tabla utilizada:  prisma.${tablaUsuarios}`);
  console.log(`Correo insertado:  ${usuario.email}`);
  console.log(`Hash encriptado:  ${usuario.password}`);
  console.log(`Contraseña plana:  ${contrasenaPlana}`);
  console.log('=========================================================\n');
}

main()
  .catch((e) => {
    console.error('\nError de validación en los campos:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

echo "--- [3/3] Ejecutando inyección segura de datos ---"
node insertar-usuario-seguro.js

rm -f insertar-usuario-seguro.js