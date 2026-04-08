import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

// TypeScript global window augmentation para propósitos educativos
declare global {
  interface Window {
    /**
     * Versión del aplicativo
     * Demuestra cómo extender el objeto window con tipos seguros
     */
    APP_VERSION: string;
    /**
     * Configuración global de la aplicación
     */
    APP_CONFIG: {
      debug: boolean;
      apiUrl: string;
    };
  }
}

// Asignar valores globales con tipos seguros
window.APP_VERSION = '1.0.0-laboratorio3';
window.APP_CONFIG = {
  debug: true,
  apiUrl: 'https://api.ejemplo.com',
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
