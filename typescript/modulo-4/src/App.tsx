/**
 * Ejemplo de Aplicación React Completa con TypeScript
 * Integra componentes, hooks, tipos y manejo de estado
 */

import React, { useEffect } from "react";
import {
  PanelUsuario,
  Lista,
  TarjetaServidor,
  ComponenteEstado,
  Boton,
} from "../components";
import { useUsuario, useServidores } from "../hooks";
import { Usuario, Servidor, EstadoCarga } from "../types";

/**
 * Componente principal de la aplicación
 */
export const App: React.FC = () => {
  // Hooks personalizados con tipado completo
  const {
    usuario,
    cargando: cargandoUsuario,
    cargarUsuario,
  } = useUsuario("usr-001");

  const {
    servidores,
    cargando: cargandoServidores,
    error: errorServidores,
    cargar: cargarServidores,
    agregarServidor,
  } = useServidores();

  // Cargar servidores al montar
  useEffect(() => {
    cargarServidores();
  }, [cargarServidores]);

  // Manejador tipado para actualizar usuario
  const manejarActualizarUsuario = (nuevoEstado: string) => {
    console.log("Usuario actualizado:", nuevoEstado);
    if (usuario) {
      cargarUsuario(usuario.id);
    }
  };

  // Manejador tipado para agregar servidor
  const agregarNuevoServidor = () => {
    const nuevoServidor: Servidor = {
      id: `srv-${Date.now()}`,
      nombre: "Nuevo Servidor",
      ip: "192.168.1.100",
      estado: "activo",
      carga: 0,
    };
    agregarServidor(nuevoServidor);
  };

  // Estado tipado para la demostración
  let estadoComponente: ComponenteEstado;

  if (cargandoServidores) {
    estadoComponente = <ComponenteEstado estado="cargando" />;
  } else if (errorServidores) {
    estadoComponente = (
      <ComponenteEstado estado="error" mensaje={errorServidores} />
    );
  } else {
    estadoComponente = (
      <ComponenteEstado estado="exitoso" datos={servidores} />
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📱 Aplicación React + TypeScript</h1>

      {/* Sección 1: Panel de Usuario */}
      <section style={{ marginBottom: "30px" }}>
        <h2>👤 Sección de Usuario</h2>
        <PanelUsuario
          usuarioId="usr-001"
          usuario={usuario}
          mostrarMetricas={true}
          onActualizar={manejarActualizarUsuario}
        >
          <p>Panel del usuario: {usuario?.nombre || "Cargando..."}</p>
        </PanelUsuario>
      </section>

      {/* Sección 2: Lista Genérica de Usuarios */}
      <section style={{ marginBottom: "30px" }}>
        <h2>📋 Lista de Usuarios</h2>
        {usuario && (
          <Lista<Usuario>
            items={[usuario]}
            titulo="Usuarios Activos"
            renderItem={(u) => `${u.nombre} (${u.email})`}
          />
        )}
      </section>

      {/* Sección 3: Estados de Carga */}
      <section style={{ marginBottom: "30px" }}>
        <h2>📊 Estado de Servidores</h2>
        {estadoComponente}
      </section>

      {/* Sección 4: Lista de Servidores */}
      <section style={{ marginBottom: "30px" }}>
        <h2>🖥️  Gestión de Servidores</h2>
        <Boton
          variante="primario"
          tamaño="medio"
          onClick={agregarNuevoServidor}
        >
          + Agregar Servidor
        </Boton>

        <div style={{ marginTop: "10px" }}>
          {servidores.map((servidor) => (
            <TarjetaServidor
              key={servidor.id}
              servidor={servidor}
              onClick={(id) => console.log("Servidor seleccionado:", id)}
            />
          ))}
        </div>
      </section>

      {/* Sección 5: Información Tipada */}
      <section
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
        }}
      >
        <h3>✅ TypeScript Benefits en React</h3>
        <ul>
          <li>
            ✓ Props fuertemente tipadas - error si olvidas pasar datos
          </li>
          <li>✓ Hooks con tipado automático - IntelliSense en el IDE</li>
          <li>
            ✓ Componentes genéricos reutilizables sin perder seguridad
          </li>
          <li>✓ Exhaustiveness checking en componentes discriminados</li>
          <li>✓ Autocomplete para objetos complejos</li>
        </ul>
      </section>
    </div>
  );
};

export default App;
