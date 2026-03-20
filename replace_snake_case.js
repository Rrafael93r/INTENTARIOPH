const fs = require('fs');
const path = require('path');

const map = {
  "fecha_compra": "fechaCompra",
  "fecha_envio": "fechaEnvio",
  "costo_envio": "costoEnvio",
  "estado_envio": "estadoEnvio",
  "proveedor_internet": "proveedorInternet",
  "canal_transmision": "canalTransmision",
  "cantidad_equipos": "cantidadEquipos",
  "nombre_contacto": "nombreContacto",
  "numero_contacto": "numeroContacto",
  "fecha_contratacion": "fechaContratacion",
  "fecha_hora_inicio": "fechaHoraInicio",
  "fecha_hora_fin": "fechaHoraFin",
  "duracion_incidente": "duracionIncidente",
  "fecha_traslado": "fechaTraslado",
  "motivo_traslado": "motivoTraslado",
  "tipo_periferico": "tipoPeriferico",
  "numero_serie": "numeroSerie",
  "nombre_ciudad": "nombreCiudad",
  "name_departamento": "nameDepartamento",
  "disco_duro": "discoDuro",
  "memoria_ram": "memoriaRam",
  "tarjeta_video": "tarjetaVideo",
  "tipo_equipo": "tipoEquipo",
  "nombre_marca": "nombreMarca"
};

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const [snake, camel] of Object.entries(map)) {
        // match exact word boundaries
        const regex = new RegExp(`\\b${snake}\\b`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, camel);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            replaceInFile(fullPath);
        }
    }
}

const targetDirs = [
    path.join(__dirname, 'FRONT', 'src', 'components'),
    path.join(__dirname, 'FRONT', 'src', 'servicios')
];

for (const dir of targetDirs) {
    if (fs.existsSync(dir)) {
        traverseDir(dir);
    } else {
        console.warn(`Directory not found: ${dir}`);
    }
}

console.log('Replacement complete.');
