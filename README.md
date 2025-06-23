
Para poder ver todo en profundida te recomiedo visualizar el manual de técnico y de usuario pero aquí te dejo un breve resumen


🧪 Quimisan
Aplicación de escritorio desarrollada con Electron, React (TypeScript), Node.js y SQLite para la gestión de reactivos químicos en laboratorio.

🚀 Tecnologías utilizadas
Capa : Tecnología →  Descripción

Frontend: React + TypeScript → Interfaz de usuario moderna y reactiva

Lógica del render: Electron + preload → Comunicación segura entre frontend y backend

Backend: Node.js → Lógica de negocio y gestión de archivos / base de datos

Base de datos: SQLite → Almacenamiento local de los datos de reactivos

🧱 Estructura de la aplicación

Copiar
Editar
📁 src
 ┣ 📁 pages       → Interfaz gráfica con React
 ┣ 📁 main           → Lógica de Electron (ventanas, procesos)
 ┣ 📄 preload.ts     → Puente seguro entre Electron y el frontend
 ┣ 📄 global.d.ts    → Tipado global para los canales de comunicación IPC
 ┣ 📁 database       → Conexión y queries con SQLite
 ┣ 📁 interfaces     → Interfaces TypeScript
 ┣ 📁 styles         → Estilos CSS/SCSS

⚙️ Funcionalidades
Buscar y filtrar reactivos

Añadir nuevos reactivos

Editar reactivos existentes

Eliminar reactivos

Gestión de proveedores, tipos, CAS, fichas de seguridad, etc.

Almacenamiento local con SQLite

🖥️ ¿Cómo ejecutar?
1. Clona el repositorio
git clone https://github.com/Xxblaster_117xX/Quimisan.git
cd reactivos-app
2. Instala las dependencias
npm install
3. Ejecuta la aplicación en modo desarrollo
npm run dev
Esto levantará el proceso de Electron y el servidor de React.

📁 Archivos clave
preload.ts: Exposición de funciones seguras al frontend (contextBridge + ipcRenderer)

global.d.ts: Tipado global de los canales IPC utilizados por preload

main.ts: Configuración principal de Electron y creación de ventanas

SearchReagent.tsx: Componente React para listar y buscar reactivos

database.ts: Conexión a SQLite e implementación de queries


📚 Aprendizajes
Durante este proyecto, se ha trabajado la arquitectura en capas con separación de responsabilidades, el uso de Electron para crear la aplicación de escritorio, la integración de frontend moderno con React y la manipulación local de datos con SQLite.


Para terminar explicar que la aplicación no es la mejor pero es la primera vez utilizando estas tecnologías y se me ocurren muchas mejoras que implementar
Seguiré actualizando el repositorio con más proyectos
