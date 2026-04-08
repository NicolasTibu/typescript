/**
 * Entidades del sistema de gestión universitario
 * Módulo 2: Modelado de datos complejo
 */

/**
 * Interfaz Asignatura
 * Representa una materia dentro del currículo académico.
 * ID es readonly para garantizar inmutabilidad tras la creación.
 */
export interface Asignatura {
  readonly id: string;        // Identificador único inmutable
  codigo: string;             // Código de la asignatura (ej: "INF-101")
  nombre: string;
  creditos: number;           // Créditos ECTS
  semestre: number;           // Semestre en el que se imparte (1-8)
  docente: string;
}

/**
 * Interfaz Estudiante
 * Representa un alumno matriculado en la institución.
 */
export interface Estudiante {
  readonly id: string;        // Carné estudiantil (inmutable)
  nombreCompleto: string;
  email: string;
  fechaNacimiento: Date;
  carrera: string;            // Nombre de la carrera (ej: "Ingeniería Informática")
  activo: boolean;            // ¿Está activamente matriculado?
}

/**
 * Interfaz de respuesta genérica de API
 * Utilizada para todas las respuestas del servidor.
 */
export interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;
  errores?: string[];
  timestamp?: Date;
}
