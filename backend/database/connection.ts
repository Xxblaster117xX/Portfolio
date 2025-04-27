import { app, BrowserWindow, ipcMain } from 'electron'; // Importación correcta para Electron
import path from 'path'; // Importación para manejo de rutas
import Database from 'better-sqlite3'; // Importación de sqlite3

// Ruta de la base de datos SQLite
const dbPath = path.join(__dirname, 'almacen.db');

// Crear o abrir la base de datos
export const db = new Database(dbPath, { verbose: console.log });

// Crear las tablas si no existen
const crearTablas = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS materials (
      material_id INTEGER PRIMARY KEY,
      material_name TEXT NOT NULL
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS reagents (
      reagent_id INTEGER PRIMARY KEY,
      reagent_cas TEXT NOT NULL,
      reagent_name TEXT NOT NULL,
      reagent_quantity REAL NOT NULL,
      reagent_unit INTEGER NOT NULL,
      reagent_add_date TEXT NOT NULL,
      reagent_expiration_date TEXT NOT NULL,
      reagent_supplier TEXT NOT NULL,
      reagent_type TEXT NOT NULL,
      reagent_fds TEXT NOT NULL
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY,
      user_name TEXT NOT NULL,
      user_gmail TEXT NOT NULL UNIQUE,
      user_password TEXT NOT NULL,
      rol TEXT NOT NULL
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS movements (
      movement_id INTEGER PRIMARY KEY,
      product_id_movement INTEGER NOT NULL,
      movement_type TEXT NOT NULL,
      movement_quantity REAL NOT NULL,
      movement_date TEXT NOT NULL,
      user_id_movement INTEGER NOT NULL,
      FOREIGN KEY (product_id_movement) REFERENCES products(id),
      FOREIGN KEY (user_id_movement) REFERENCES users(user_id)
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS historical (
      historical_id INTEGER PRIMARY KEY,
      historical_user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      action_date TEXT NOT NULL,
      details TEXT,
      FOREIGN KEY (historical_user_id) REFERENCES users(user_id)
    );
  `).run();
};

// Crear ventana de Electron
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL('http://localhost:5173'); // Cargar la aplicación React
}

app.whenReady().then(() => {
  crearTablas(); // Crear las tablas al iniciar
  createWindow(); // Crear la ventana de Electron

  // Enviar productos al frontend de React cuando se soliciten
  ipcMain.handle('get-productos', () => {
    return db.prepare('SELECT * FROM productos').all();
  });

  // Agregar un producto desde el frontend
  ipcMain.handle('add-producto', (event, nombre, cantidad, precio) => {
    const stmt = db.prepare('INSERT INTO productos (nombre, cantidad, precio) VALUES (?, ?, ?)');
    stmt.run(nombre, cantidad, precio);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
