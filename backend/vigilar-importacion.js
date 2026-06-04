const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Carpeta a vigilar
const WATCH_DIR = path.join(__dirname, '..', 'import');
const SCRIPT_SH = path.join(__dirname, 'ejecutar-carga.sh');

console.log(`=========================================================`);
console.log(`👀 Guardián Activo: Vigilando cambios en: ${WATCH_DIR}`);
console.log(`=========================================================`);

// Evitar disparos dobles seguidos (debounce)
let cambiando = false;

fs.watch(WATCH_DIR, (eventType, filename) => {
  if (filename === 'productos.csv' && !cambiando) {
    cambiando = true;
    setTimeout(() => cambiando = false, 5000); // Bloqueo de 5 segundos

    console.log(`\n🔔 [DETECTADO] El archivo 'productos.csv' ha sido depositado o modificado.`);
    console.log(`🚀 Disparando pipeline de actualización automáticamente...`);

    // Ejecuta tu script de Bash de forma interna
    exec(`bash ${SCRIPT_SH}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error al ejecutar el pipeline: ${error.message}`);
        return;
      }
      console.log(stdout);
    });
  }
});
