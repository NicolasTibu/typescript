/**
 * Tipos centrales para la aplicación
 * Demostración de genéricos y uniones discriminadas
 */

/**
 * Usuario: Entidad de dominio
 * Usaremos Partial<Usuario> para el estado de edición
 */
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  departamento: string;
  fechaIngreso: Date;
  activo: boolean;
}

/**
 * Producto: Otra entidad para demostrar genericidad de DataTable
 */
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  fechaCreacion: Date;
  categoria: string;
}

/**
 * Configuración de columna para DataTable
 * Usa keyof para garantizar que la clave existe en T
 */
export interface ConfiguracionColumna<T> {
  clave: keyof T;
  etiqueta: string;
  ancho?: number;
  formato?: string; // "fecha" | "moneda" | "texto"
}

/**
 * Estado de edición: Partial<T> para permitir ediciones parciales
 * El usuario no necesita llenar TODOS los campos
 */
export interface EstadoEdicion<T> {
  habilitado: boolean;
  filaEnEdicion: number | null;
  datosTemporales: Partial<T>;
}

/**
 * Métodos de acción en la tabla (unión discriminada)
 */
export type AccionTabla<T> = 
  | { tipo: "EDITAR"; fila: number; datos: T }
  | { tipo: "ELIMINAR"; fila: number }
  | { tipo: "CANCELAR_EDICION" }
  | { tipo: "GUARDAR_EDICION"; datos: Partial<T> };

/**
 * Props genéricos para DataTable
 */
export interface PropsDataTable<T> {
  datos: T[];
  columnas: ConfiguracionColumna<T>[];
  titulo?: string;
  permiteEdicion?: boolean;
  onGuardar?: (fila: number, datos: T) => void;
  onEliminar?: (fila: number) => void;
}
