import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


// Para compatibilidad con __dirname en ESM
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta de la base de datos
const dbPath = path.resolve(__dirname, '../../almacen.db');

// Creamos una instancia de la base de datos
let db;

async function openDb() {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    db.on('trace', console.log); // Para logging similar al verbose de better-sqlite3
}

async function crearTablas() {
    // Creamos las tablas solo si no existen

    await db.exec(`
        CREATE TABLE IF NOT EXISTS reagents (
            reagent_id INTEGER PRIMARY KEY AUTOINCREMENT,
            reagent_cas TEXT NOT NULL,
            reagent_name TEXT NOT NULL,
            reagent_quantity REAL NOT NULL,
            reagent_unit TEXT NOT NULL,
            reagent_add_date TEXT NOT NULL,
            reagent_expiration_date TEXT NOT NULL,
            reagent_supplier TEXT NOT NULL,
            reagent_type TEXT NOT NULL,
            reagent_fds TEXT NOT NULL,
            reagent_state TEXT NOT NULL DEFAULT 'disponible'
        );
    `);
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY,
            user_name TEXT NOT NULL,
            user_gmail TEXT NOT NULL UNIQUE,
            user_password TEXT NOT NULL,
            rol TEXT NOT NULL,
            isVerified BOOLEAN DEFAULT FALSE
        );
    `);
    await db.exec(`
        CREATE TABLE IF NOT EXISTS movements (
            movement_id INTEGER PRIMARY KEY AUTOINCREMENT,
            reagent_id INTEGER NOT NULL,
            movement_type TEXT NOT NULL CHECK (movement_type IN ('entrada', 'salida')),
            movement_quantity REAL NOT NULL,
            unit TEXT NOT NULL,
            quantity_before REAL NOT NULL,
            quantity_after REAL NOT NULL,
            movement_date TEXT NOT NULL, 
            user_id INTEGER NOT NULL,
            description TEXT,
            FOREIGN KEY (reagent_id) REFERENCES reagents(reagent_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id) 
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS historical (
            historical_id INTEGER PRIMARY KEY,
            historical_user_id INTEGER NOT NULL,
            historical_user_name TEXT NOT NULL,
            action TEXT NOT NULL,
            action_date TEXT NOT NULL,
            details TEXT,
            FOREIGN KEY (historical_user_id) REFERENCES users(user_id)
        );
    `);

}

// Crear la ventana principal


app.whenReady().then(async () => {
    try {
        await openDb(); // Abre la base de datos (ahora es async)
        await crearTablas(); // Crea las tablas
         

        // Manejo de la solicitud para obtener productos
        ipcMain.handle('get-productos', async () => {
            return await db.all('SELECT * FROM productos');
        });

        // Manejo de la solicitud para añadir un producto
        ipcMain.handle('add-producto', async (event, nombre, cantidad, precio) => {
            if (!nombre || typeof nombre !== 'string') {
                throw new Error('El nombre del producto es inválido.');
            }
            if (typeof cantidad !== 'number' || cantidad <= 0) {
                throw new Error('La cantidad debe ser un número positivo.');
            }
            if (typeof precio !== 'number' || precio <= 0) {
                throw new Error('El precio debe ser un número positivo.');
            }
            await db.run(
                'INSERT INTO productos (nombre, cantidad, precio) VALUES (?, ?, ?)',
                [nombre, cantidad, precio]
            );
        });
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        app.quit();
    }
});

// Cerrar la base de datos y la aplicación
app.on('window-all-closed', async () => {
    if (db) await db.close();
    if (process.platform !== 'darwin') app.quit();
});


// Exporta la instancia de la base de datos para que otros archivos puedan usarla
export { db };