/**
 * App.tsx: Aplicación principal
 * 
 * Demuestra:
 * - Uso del componente DataTable<T> genérico
 * - Manejo de múltiples tipos (Usuario, Producto)
 * - Integración de date-fns para fechas
 * - Función utilitaria de cálculo de diferencia de fechas
 */

import React, { useState } from 'react';
import { DataTable } from './components/DataTable';
import { calcularDiferenciaDias, calcularEdad } from './utils/dateDifference';
import type { Usuario, Producto, ConfiguracionColumna } from './types/index';

// Datos de ejemplo
const usuariosIniciales: Usuario[] = [
  {
    id: 1,
    nombre: 'Juan García',
    email: 'juan.garcia@empresa.com',
    departamento: 'Ingeniería',
    fechaIngreso: new Date('2022-01-15'),
    activo: true,
  },
  {
    id: 2,
    nombre: 'María López',
    email: 'maria.lopez@empresa.com',
    departamento: 'Recursos Humanos',
    fechaIngreso: new Date('2023-06-20'),
    activo: true,
  },
  {
    id: 3,
    nombre: 'Pedro Martínez',
    email: 'pedro.martinez@empresa.com',
    departamento: 'Ventas',
    fechaIngreso: new Date('2021-03-10'),
    activo: false,
  },
];

const productosIniciales: Producto[] = [
  {
    id: 'P001',
    nombre: 'Laptop Dell XPS',
    precio: 1299.99,
    stock: 15,
    fechaCreacion: new Date('2023-01-10'),
    categoria: 'Electrónica',
  },
  {
    id: 'P002',
    nombre: 'Monitor LG 27"',
    precio: 349.99,
    stock: 32,
    fechaCreacion: new Date('2023-02-05'),
    categoria: 'Periféricos',
  },
  {
    id: 'P003',
    nombre: 'Teclado Mecánico',
    precio: 129.99,
    stock: 50,
    fechaCreacion: new Date('2023-03-15'),
    categoria: 'Periféricos',
  },
];

// Configuración de columnas para Usuarios
const columnasUsuarios: ConfiguracionColumna<Usuario>[] = [
  { clave: 'id' as const, etiqueta: 'ID', ancho: 50 },
  { clave: 'nombre' as const, etiqueta: 'Nombre', ancho: 200 },
  { clave: 'email' as const, etiqueta: 'Email', ancho: 250 },
  { clave: 'departamento' as const, etiqueta: 'Departamento', ancho: 150 },
  { clave: 'fechaIngreso' as const, etiqueta: 'Fecha Ingreso', ancho: 150 },
  { clave: 'activo' as const, etiqueta: 'Activo' },
];

// Configuración de columnas para Productos
const columnasProductos: ConfiguracionColumna<Producto>[] = [
  { clave: 'id' as const, etiqueta: 'ID Producto', ancho: 100 },
  { clave: 'nombre' as const, etiqueta: 'Nombre', ancho: 200 },
  { clave: 'precio' as const, etiqueta: 'Precio', ancho: 100, formato: 'moneda' },
  { clave: 'stock' as const, etiqueta: 'Stock', ancho: 80 },
  { clave: 'fechaCreacion' as const, etiqueta: 'Creado', ancho: 120 },
  { clave: 'categoria' as const, etiqueta: 'Categoría', ancho: 120 },
];

export function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [pestanaActiva, setPestanaActiva] = useState<'usuarios' | 'productos' | 'utilidades'>('usuarios');

  // Manejadores para Usuarios
  const handleGuardarUsuario = (fila: number, datosActualizados: Usuario) => {
    const nuevosUsuarios = [...usuarios];
    nuevosUsuarios[fila] = datosActualizados;
    setUsuarios(nuevosUsuarios);
    console.log('Usuario guardado:', datosActualizados);
  };

  const handleEliminarUsuario = (fila: number) => {
    const nuevosUsuarios = usuarios.filter((_, i) => i !== fila);
    setUsuarios(nuevosUsuarios);
    console.log('Usuario eliminado:', usuarios[fila]);
  };

  // Manejadores para Productos
  const handleGuardarProducto = (fila: number, datosActualizados: Producto) => {
    const nuevosProductos = [...productos];
    nuevosProductos[fila] = datosActualizados;
    setProductos(nuevosProductos);
    console.log('Producto guardado:', datosActualizados);
  };

  const handleEliminarProducto = (fila: number) => {
    const nuevosProductos = productos.filter((_, i) => i !== fila);
    setProductos(nuevosProductos);
    console.log('Producto eliminado:', productos[fila]);
  };

  // Calcular diferencias de fechas (función utilitaria)
  const usuarioConMasAntiguedad = usuarios.reduce((prev, actual) => {
    return prev.fechaIngreso < actual.fechaIngreso ? prev : actual;
  });

  const diferencia = calcularDiferenciaDias(usuarioConMasAntiguedad.fechaIngreso, new Date());
  const diasDesdeIngreso = diferencia.tipo === "EXITO" ? diferencia.dias : 0;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <h1>🧪 Laboratorio 3: React + TypeScript - DataTable Genérico</h1>

      <nav style={{ marginBottom: '20px', borderBottom: '2px solid #333' }}>
        {(['usuarios', 'productos', 'utilidades'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setPestanaActiva(tab)}
            style={{
              marginRight: '10px',
              padding: '12px 20px',
              backgroundColor: pestanaActiva === tab ? '#4CAF50' : '#ddd',
              color: pestanaActiva === tab ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontWeight: pestanaActiva === tab ? 'bold' : 'normal',
              fontSize: '16px',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Pestaña Usuarios */}
      {pestanaActiva === 'usuarios' && (
        <div>
          <DataTable<Usuario>
            datos={usuarios}
            columnas={columnasUsuarios}
            titulo="📋 Tabla de Usuarios"
            permiteEdicion={true}
            onGuardar={handleGuardarUsuario}
            onEliminar={handleEliminarUsuario}
          />
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <p>
              <strong>👤 Usuario con más antigüedad:</strong> {usuarioConMasAntiguedad.nombre}
            </p>
            <p>
              <strong>📅 Días desde ingreso:</strong> {diasDesdeIngreso} días
            </p>
          </div>
        </div>
      )}

      {/* Pestaña Productos */}
      {pestanaActiva === 'productos' && (
        <div>
          <DataTable<Producto>
            datos={productos}
            columnas={columnasProductos}
            titulo="🛍️ Tabla de Productos"
            permiteEdicion={true}
            onGuardar={handleGuardarProducto}
            onEliminar={handleEliminarProducto}
          />
        </div>
      )}

      {/* Pestaña Utilidades */}
      {pestanaActiva === 'utilidades' && (
        <div style={{ padding: '20px' }}>
          <h2>🛠️ Funciones Utilitarias de Fechas</h2>

          <section style={{ marginBottom: '20px' }}>
            <h3>Diferencia entre Fechas</h3>
            <p>Selecciona dos fechas para calcular la diferencia en días:</p>
            <DemoCalculadoraFechas />
          </section>

          <section>
            <h3>Información de Usuarios</h3>
            <div style={{ marginTop: '15px' }}>
              {usuarios.map((usuario) => {
                const edad = calcularEdad(new Date(usuario.fechaIngreso));
                return (
                  <div key={usuario.id} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                    <strong>{usuario.nombre}</strong> - Trabajando aquí hace {edad} años
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd', fontSize: '12px', color: '#666' }}>
        <p>Laboratorio 3: TypeScript Avanzado - React + Genéricos + Utility Types</p>
        <p>© 2026 - Demostración de patrones type-safe en React</p>
      </footer>
    </div>
  );
}

/**
 * Componente demo para la calculadora de fechas
 * Demuestra el uso de la función utilitaria calcularDiferenciaDias
 */
function DemoCalculadoraFechas() {
  const [fecha1, setFecha1] = useState('2024-01-01');
  const [fecha2, setFecha2] = useState('2024-01-15');

  const resultado = calcularDiferenciaDias(
    new Date(fecha1),
    new Date(fecha2)
  );

  return (
    <div style={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Fecha 1:</label>
        <input
          type="date"
          value={fecha1}
          onChange={(e) => setFecha1(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Fecha 2:</label>
        <input
          type="date"
          value={fecha2}
          onChange={(e) => setFecha2(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </div>

      {resultado.tipo === 'EXITO' && (
        <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px', color: '#2e7d32' }}>
          <p><strong>✅ Resultado:</strong> {resultado.dias} días</p>
          <p><strong>Del:</strong> {resultado.fechaInicio}</p>
          <p><strong>Al:</strong> {resultado.fechaFin}</p>
        </div>
      )}

      {resultado.tipo === 'ERROR' && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px', color: '#c62828' }}>
          <p><strong>❌ Error:</strong> {resultado.mensaje}</p>
        </div>
      )}
    </div>
  );
}
