/**
 * Cliente API Genérico
 * Simula llamadas a una base de datos con promesas y tipado fuerte.
 * Módulo 2: Programación Genérica y Servicio de Datos
 */

import { RespuestaAPI } from "../domain/types/entidades";

/**
 * Simula un retraso de red (en ms)
 */
const LATENCIA_Red = 300;

/**
 * Base de datos simulada en memoria
 */
const baseDatos: Record<string, unknown[]> = {
  "/api/estudiantes": [
    {
      id: "EST-001",
      nombreCompleto: "María García López",
      email: "maria@universidad.edu",
      fechaNacimiento: new Date("2003-05-15"),
      carrera: "Ingeniería Informática",
      activo: true,
    },
    {
      id: "EST-002",
      nombreCompleto: "Carlos Rodríguez Pérez",
      email: "carlos@universidad.edu",
      fechaNacimiento: new Date("2002-11-22"),
      carrera: "Ingeniería Informática",
      activo: true,
    },
  ],
  "/api/asignaturas": [
    {
      id: "ASG-001",
      codigo: "INF-101",
      nombre: "Introducción a la Programación",
      creditos: 6,
      semestre: 1,
      docente: "Dr. Juan López",
    },
    {
      id: "ASG-002",
      codigo: "INF-102",
      nombre: "Estructuras de Datos",
      creditos: 6,
      semestre: 1,
      docente: "Dra. Ana García",
    },
  ],
};

/**
 * Cliente API genérico
 * Método principal que retorna promesas tipadas fuertemente.
 */
export async function obtenerRecurso<T>(endpoint: string): Promise<RespuestaAPI<T>> {
  // Simulación de latencia de red
  await new Promise((resolve) => setTimeout(resolve, LATENCIA_Red));

  // Obtener datos de la base de datos simulada
  const datos = baseDatos[endpoint] as T | undefined;

  if (!datos) {
    // Error: recurso no encontrado
    return {
      codigoEstado: 404,
      exito: false,
      datos: null as unknown as T,
      errores: [`El endpoint ${endpoint} no existe en la base de datos.`],
      timestamp: new Date(),
    };
  }

  // Respuesta exitosa
  return {
    codigoEstado: 200,
    exito: true,
    datos: datos as T,
    timestamp: new Date(),
  };
}

/**
 * Método para obtener un único recurso por ID
 * Demuestra uso de genéricos con restricciones.
 */
export async function obtenerRecursoPorId<T extends { id: string }>(
  endpoint: string,
  id: string
): Promise<RespuestaAPI<T>> {
  await new Promise((resolve) => setTimeout(resolve, LATENCIA_Red));

  const todos = baseDatos[endpoint] as T[] | undefined;

  if (!todos) {
    return {
      codigoEstado: 404,
      exito: false,
      datos: null as unknown as T,
      errores: [`Endpoint ${endpoint} no encontrado.`],
      timestamp: new Date(),
    };
  }

  const recurso = todos.find((item) => item.id === id);

  if (!recurso) {
    return {
      codigoEstado: 404,
      exito: false,
      datos: null as unknown as T,
      errores: [`Recurso con ID ${id} no encontrado en ${endpoint}.`],
      timestamp: new Date(),
    };
  }

  return {
    codigoEstado: 200,
    exito: true,
    datos: recurso,
    timestamp: new Date(),
  };
}

/**
 * Método para crear un nuevo recurso
 * Simula inserción en la BD.
 */
export async function crearRecurso<T extends { id: string }>(
  endpoint: string,
  datos: T
): Promise<RespuestaAPI<T>> {
  await new Promise((resolve) => setTimeout(resolve, LATENCIA_Red));

  if (!baseDatos[endpoint]) {
    baseDatos[endpoint] = [];
  }

  (baseDatos[endpoint] as T[]).push(datos);

  return {
    codigoEstado: 201,
    exito: true,
    datos: datos,
    timestamp: new Date(),
  };
}
