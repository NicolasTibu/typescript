// ============================================
// Punto de Entrada: React Application
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Estilos globales (crear si es necesario)

// Tipar window global
declare global {
  interface Window {
    APP_VERSION: string;
    API_URL: string;
  }
}

// Configurar variables globales
window.APP_VERSION = "1.0.0";
window.API_URL = "http://localhost:3000/api";

// Renderizar aplicación
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("No se encontró elemento root");
}
