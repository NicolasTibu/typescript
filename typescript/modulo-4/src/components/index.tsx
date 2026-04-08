/**
 * Componentes React tipados
 * Módulo 4: Props e Interfaces de Componentes
 */

import React, { FC, ReactNode } from "react";
import { Usuario, Servidor, EstadoCarga } from "../types";

// ============================================
// 1. COMPONENTE SIMPLE CON PROPS TIPADAS
// ============================================

/**
 * Props para PanelUsuario
 * Define un contrato estricto para el componente
 */
interface PanelUsuarioProps {
  usuarioId: string;
  usuario?: Usuario; // Prop opcional
  mostrarMetricas?: boolean;
  onActualizar?: (nuevoEstado: string) => void; // Callback tipado
  children?: ReactNode; // Para contenido anidado
}

/**
 * Componente PanelUsuario
 * Tipado con FC (FunctionComponent) de React
 */
export const PanelUsuario: FC<PanelUsuarioProps> = ({
  usuarioId,
  usuario,
  mostrarMetricas = false,
  onActualizar,
  children,
}) => {
  const manejarClick = () => {
    onActualizar?.("estado_actualizado");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <h2>Panel de Usuario</h2>
      <p>ID: {usuarioId}</p>
      {usuario && (
        <>
          <p>Nombre: {usuario.nombre}</p>
          <p>Email: {usuario.email}</p>
          <p>Rol: {usuario.rol}</p>
        </>
      )}
      {mostrarMetricas && <p>Métricas: En desarrollo</p>}
      {onActualizar && (
        <button onClick={manejarClick}>Actualizar</button>
      )}
      {children && <div>{children}</div>}
    </div>
  );
};

// ============================================
// 2. COMPONENTE CON GENÉRICOS
// ============================================

/**
 * Props genéricas para un componente de lista
 */
interface ListaProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  titulo?: string;
  vacia?: ReactNode;
}

/**
 * Componente genérico de lista
 * Reutilizable para cualquier tipo de datos
 */
export function Lista<T extends { id: string | number }>({
  items,
  renderItem,
  titulo,
  vacia = <p>No hay elementos</p>,
}: ListaProps<T>) {
  return (
    <div>
      {titulo && <h2>{titulo}</h2>}
      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={item.id}>{renderItem(item, index)}</li>
          ))}
        </ul>
      ) : (
        vacia
      )}
    </div>
  );
}

// ============================================
// 3. COMPONENTE CON ESTADO TIPADO
// ============================================

interface TarjetaServidorProps {
  servidor: Servidor;
  onClick?: (id: string) => void;
}

/**
 * Componente que muestra una tarjeta de servidor
 */
export const TarjetaServidor: FC<TarjetaServidorProps> = ({
  servidor,
  onClick,
}) => {
  // Función para determinar color basado en estado
  const obtenerColor = (estado: Servidor["estado"]): string => {
    switch (estado) {
      case "activo":
        return "green";
      case "inactivo":
        return "red";
      case "mantenimiento":
        return "orange";
    }
  };

  return (
    <div
      style={{
        border: `2px solid ${obtenerColor(servidor.estado)}`,
        padding: "10px",
        margin: "5px",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={() => onClick?.(servidor.id)}
    >
      <h3>{servidor.nombre}</h3>
      <p>IP: {servidor.ip}</p>
      <p>Estado: {servidor.estado}</p>
      <p>Carga: {servidor.carga}%</p>
    </div>
  );
};

// ============================================
// 4. COMPONENTE CON UNIÓN DISCRIMINADA
// ============================================

/**
 * Props con discriminante para diferentes estados
 */
type ComponenteEstadoProps =
  | { estado: "cargando" }
  | { estado: "exitoso"; datos: Servidor[] }
  | { estado: "error"; mensaje: string };

/**
 * Componente que maneja diferentes estados
 * Usa exhaustiveness checking automático
 */
export const ComponenteEstado: FC<ComponenteEstadoProps> = (props) => {
  switch (props.estado) {
    case "cargando":
      return <div>⏳ Cargando...</div>;

    case "exitoso":
      return (
        <div>
          <h2>Servidores: {props.datos.length}</h2>
          <ul>
            {props.datos.map((s) => (
              <li key={s.id}>{s.nombre}</li>
            ))}
          </ul>
        </div>
      );

    case "error":
      return <div style={{ color: "red" }}>❌ Error: {props.mensaje}</div>;

    default:
      // Exhaustiveness check - si falta un caso, error de compilación
      const _exhaustivo: never = props;
      return _exhaustivo;
  }
};

// ============================================
// 5. COMPONENTE CON REST PROPS
// ============================================

/**
 * Props que acepta atributos HTML adicionales
 */
interface BotonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario" | "peligro";
  tamaño?: "pequeño" | "medio" | "grande";
  cargando?: boolean;
  children: ReactNode;
}

/**
 * Componente de botón reutilizable y flexible
 */
export const Boton: FC<BotonProps> = ({
  variante = "primario",
  tamaño = "medio",
  cargando = false,
  children,
  disabled,
  ...restoProps
}) => {
  const estilos: Record<string, string> = {
    primario: "background: blue; color: white;",
    secundario: "background: gray; color: white;",
    peligro: "background: red; color: white;",
  };

  const tamaños: Record<string, string> = {
    pequeño: "padding: 5px 10px; font-size: 12px;",
    medio: "padding: 10px 20px; font-size: 14px;",
    grande: "padding: 15px 30px; font-size: 16px;",
  };

  return (
    <button
      style={{
        ...{ cursor: "pointer", border: "none", borderRadius: "4px" },
        ...{ CSS: estilos[variante] + tamaños[tamaño] },
      }}
      disabled={disabled || cargando}
      {...restoProps}
    >
      {cargando ? "⏳ Cargando..." : children}
    </button>
  );
};
