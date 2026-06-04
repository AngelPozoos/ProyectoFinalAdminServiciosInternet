const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Ruta unificada y validada según la topología real de tu servidor
const CSV_PATH = path.join(__dirname, '..', 'import', 'productos.csv');

async function main() {
  console.log(`[Node.js] 🔍 Buscando tu archivo en: ${CSV_PATH}`);

  if (!fs.existsSync(CSV_PATH)) {
    console.log('❌ ERROR: El archivo productos.csv no se encuentra en: ' + CSV_PATH);
    process.exit(1);
  }

  const contenido = fs.readFileSync(CSV_PATH, 'utf-8');
  const lineas = contenido.split('\n').filter(l => l.trim() !== '');
  
  if (lineas.length === 0) {
    console.log('⚠️ El archivo productos.csv está vacío.');
    process.exit(1);
  }

  const tieneCabecera = lineas[0].toLowerCase().includes('precio') || lineas[0].toLowerCase().includes('sku');
  const filasAProcesar = tieneCabecera ? lineas.slice(1) : lineas;

  console.log(`[Prisma] Procesando ${filasAProcesar.length} productos en MariaDB...`);
  let sincronizados = 0;

  for (const fila of filasAProcesar) {
    // Expresión regular avanzada para segmentar por comas respetando comillas internas
    const columnas = fila.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    if (columnas.length < 4) continue;

    // Sanitización y limpieza absoluta de comillas y espacios para cada campo
    const nombre = columnas[0].replace(/^"|"$/g, '').trim();
    const descripcion = columnas[1].replace(/^"|"$/g, '').trim();
    
    // Forzar limpieza de comillas extras en los números antes de transformarlos
    const precioLimpio = columnas[2].replace(/^"|"$/g, '').trim();
    const precio = parseFloat(precioLimpio);
    
    const sku = columnas[3].replace(/^"|"$/g, '').trim();
    
    const stockLimpio = columnas[4].replace(/^"|"$/g, '').trim();
    const stock = parseInt(stockLimpio, 10);
    
    const categoria = columnas[5] ? columnas[5].replace(/^"|"$/g, '').trim() : 'General';
    const imagenes = columnas[6] ? columnas[6].replace(/^"|"$/g, '').trim() : '';

    // Validación de seguridad para evitar enviar NaNs a MariaDB
    if (isNaN(precio) || isNaN(stock)) {
      console.log(`⚠️ Saltando registro con formato numérico inválido (SKU: ${sku})`);
      continue;
    }

    // Identificación dinámica del modelo relacional
    const modelos = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'));
    const modeloProducto = modelos.find(m => m.toLowerCase().includes('product') || m.toLowerCase().includes('prod'));

    await prisma[modeloProducto].upsert({
      where: { sku: sku },
      update: { 
        stock: stock, 
        precio: precio, 
        descripcion: descripcion,
        categoria: categoria,
        imagenes: imagenes
      },
      create: { 
        nombre: nombre, 
        descripcion: descripcion, 
        precio: precio, 
        sku: sku, 
        stock: stock, 
        categoria: categoria, 
        imagenes: imagenes 
      }
    });
    sincronizados++;
  }
  console.log(`\n ✅ Sincronización exitosa. Registros afectados en MariaDB: ${sincronizados}`);
}

main()
  .catch(e => { 
    console.log('❌ Error crítico de ejecución:', e.message); 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
  });
