import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve(__dirname, '../../almacen.db');
export const db = new Database(dbPath, { verbose: console.log });

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
      rol TEXT NOT NULL,
      isVerified BOOLEAN DEFAULT FALSE
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
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL,
      cantidad REAL NOT NULL,
      precio REAL NOT NULL
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS historical (
      historical_id INTEGER PRIMARY KEY,
      historical_user_id INTEGER NOT NULL,
       historical_user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      action_date TEXT NOT NULL,
      details TEXT,
      FOREIGN KEY (historical_user_id) REFERENCES users(user_id)
    );
  `).run();
};

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  try {
    crearTablas();
    createWindow();

    ipcMain.handle('get-productos', () => {
      return db.prepare('SELECT * FROM productos').all();
    });

    ipcMain.handle('add-producto', (event, nombre, cantidad, precio) => {
      if (!nombre || typeof nombre !== 'string') {
        throw new Error('El nombre del producto es inválido.');
      }
      if (typeof cantidad !== 'number' || cantidad <= 0) {
        throw new Error('La cantidad debe ser un número positivo.');
      }
      if (typeof precio !== 'number' || precio <= 0) {
        throw new Error('El precio debe ser un número positivo.');
      }

      const stmt = db.prepare('INSERT INTO productos (nombre, cantidad, precio) VALUES (?, ?, ?)');
      stmt.run(nombre, cantidad, precio);
    });
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  db.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});