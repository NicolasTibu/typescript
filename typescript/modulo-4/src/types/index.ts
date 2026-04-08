/**
 * Tipos compartidos para la aplicación React
 * Módulo 4: Integración con React + TypeScript
 */

/**
 * Interfaz de Usuario tipada
 */
export interface Usuario {
  readonly id: string;
  nombre: string;
  email: string;
  rol: "admin" | "usuario" | "invitado";
  activo: boolean;
  avatar?: string;
}

/**
 * Interfaz de Servidor/Recurso
 */
export interface Servidor {
  readonly id: string;
  nombre: string;
  ip: string;
  estado: "activo" | "inactivo" | "mantenimiento";
  carga: number; // Porcentaje 0-100
}

/**
 * Interfaz de respuesta API tipada (Genérica)
 */
export interface RespuestaAPI<T> {
  exito: boolean;
  datos: T;
  error?: string;
  timestamp: Date;
}

/**
 * Tipo para manejadores de eventos
 */
export type EventoActualizacion = {
  tipo: "usuario" | "servidor" | "config";
  datos: unknown;
  timestamp: Date;
};

/**
 * Tipo para estados de carga
 */
export type EstadoCarga = "idle" | "cargando" | "exitoso" | "error";
