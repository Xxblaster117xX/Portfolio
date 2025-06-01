import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/App.css";
//import VantaBackground from "../components/Effects/VantaBackground"; // importa el fondo animado

import VantaGlobe from "./Effects/VantaRings";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Fondo animado fijo detrás */}
      <VantaGlobe />
      {/* Contenido encima del fondo */}
      <motion.div
        className="app-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: "relative", zIndex: 1 }} // para que esté encima
      >
        <nav className="navbar">
          <h1>Quimisan: Gestión de almacén</h1>
          <div className="nav-buttons">
            <button onClick={() => navigate("/LoginForm")}>Iniciar Sesión</button>
            <button onClick={() => navigate("/RegisterForm")}>Registro</button>
          </div>
        </nav>

        <div className="main-content">
          <h1>Bienvenido al sistema de almacén</h1>
        </div>
      </motion.div>
    </>
  );
}
