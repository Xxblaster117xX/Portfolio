# Quimisan

Aplicación de escritorio para la gestión del almacén de reactivos químicos de un centro educativo: alta, edición, búsqueda y control de caducidad/stock de reactivos, con registro de movimientos, historial de acciones y control de acceso por roles (administrador, profesor, alumno).

Construida con **Electron + React + TypeScript**, con persistencia en **SQLite** y verificación de cuenta por correo electrónico.

## Funcionalidades

- **Autenticación**: registro con verificación de código por email, inicio de sesión y recuperación de contraseña.
- **Gestión de reactivos**: alta, edición, baja y búsqueda de reactivos (nº CAS, cantidad, unidad, proveedor, fecha de caducidad, ficha de seguridad FDS...).
- **Roles de usuario**: administrador, profesor y alumno, con rutas privadas protegidas.
- **Historial y movimientos**: registro de entradas/salidas de reactivos y de acciones relevantes sobre el almacén.
- **Interfaz con fondos animados 3D** (Vanta.js / Three.js) en las pantallas de bienvenida, login, registro y recuperación de contraseña.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Escritorio | [Electron](https://www.electronjs.org/) |
| Frontend | React 19, TypeScript, React Router, Vite, Tailwind CSS |
| Animaciones | Framer Motion, Vanta.js, Three.js |
| Backend / lógica | Node.js (proceso principal de Electron vía IPC) |
| Base de datos | SQLite |
| Email | Nodemailer (verificación de cuenta y recuperación de contraseña) |

## Puesta en marcha

### Requisitos

- Node.js 18+
- Una cuenta de Gmail con una [contraseña de aplicación](https://support.google.com/accounts/answer/185833) para el envío de correos

### Instalación

```bash
git clone https://github.com/Xxblaster117xX/Quimisan.git
cd Quimisan
npm install
cd frontend && npm install && cd ..
```

Crea un archivo `.env` en la raíz del proyecto con:

```
CORREO_ORIGEN=tu_correo@gmail.com
CORREO_PASSWORD=tu_contraseña_de_aplicación
```

### Ejecutar en desarrollo

```bash
npm run electron:dev
```

Esto levanta el servidor de desarrollo de Vite y abre la aplicación de escritorio con Electron.

## Estructura del proyecto

```
├── backend/          # Servicios de dominio (TypeScript)
├── dist/backend/      # Servicios compilados que usa el proceso principal
├── frontend/          # Aplicación React (Vite + TypeScript)
├── main/               # Proceso principal de Electron (main.js, preload.js)
```

## Autor

Desarrollado como proyecto final de DAM2 por [Xxblaster117xX](https://github.com/Xxblaster117xX).
