// Módulo 2: Modelado de datos complejo, Patrones y Genéricos
// Ejercicios prácticos del módulo

// ℹ️  NOTA: El Laboratorio Práctico 2 está en "laboratorio.ts"
// Ahí encontrarás:
// - Modelado del dominio (Estudiante, Asignatura)
// - Uniones Discriminadas (EstadoMatricula)
// - Cliente API Genérico (obtenerRecurso<T>)
// - Documentación en docs/arquitectura/modelo-datos.md

// ============================================
// INTERFACE EXAMPLE
// ============================================

interface UsuarioSistema {
  readonly id: string;      // Inmutable tras la creación
  nombreCompleto: string;
  email: string;
  fechaUltimoAcceso?: Date; // Propiedad opcional
}

// Ejemplo de implementación
const usuario: UsuarioSistema = {
  id: "usr-001",
  nombreCompleto: "Juan Pérez García",
  email: "juan.perez@example.com",
  fechaUltimoAcceso: new Date("2026-03-26"),
};

console.log("Usuario del Sistema:", usuario);

// ============================================
// TYPE ALIAS EXAMPLES
// ============================================

type UUID = string; // Alias semántico
type EstadoTransaccion = "PENDIENTE" | "PROCESANDO" | "COMPLETADA" | "RECHAZADA"; // Tipos literales

// Ejemplo de uso de type alias
const transaccionId: UUID = "txn-12345";
let estadoActual: EstadoTransaccion = "PENDIENTE";

console.log("ID de Transacción:", transaccionId);
console.log("Estado Actual:", estadoActual);

// Cambio de estado
estadoActual = "PROCESANDO";
console.log("Nuevo Estado:", estadoActual);

// ============================================
// REGLA DE DISEÑO
// ============================================
// Emplea interface para el modelo de datos jerárquico y objetos orientados a objetos
// Emplea type para la lógica funcional, uniones y primitivos

console.log("\n--- Fin de Interfaces vs Type Aliases ---\n");

// ============================================
// TIPOS DE UNIÓN E INTERSECCIÓN Y GUARDAS DE TIPO
// ============================================

// UNIÓN (|): Una variable puede adoptar uno de los tipos especificados
type Entrada = string | number;

function procesarEntrada(input: Entrada): string | number {
  if (typeof input === "string") {
    return input.trim().toUpperCase(); // Type guard: TypeScript sabe que es string
  } else {
    return Math.pow(input, 2);         // Type guard: TypeScript sabe que es number
  }
}

console.log("Procesando entrada string:", procesarEntrada("  hola  "));
console.log("Procesando entrada number:", procesarEntrada(5));

// ============================================
// INTERSECCIÓN (&): Combina múltiples estructuras
// ============================================

type EntidadAuditable = {
  creadoEn: Date;
  modificadoPor: string;
};

type Documento = {
  titulo: string;
  contenido: string;
};

type DocumentoAuditable = Documento & EntidadAuditable;

// Ejemplo de implementación
const documentoCompleto: DocumentoAuditable = {
  titulo: "Especificaciones del Proyecto",
  contenido: "Este es el contenido del documento...",
  creadoEn: new Date("2026-03-20"),
  modificadoPor: "admin@corner-studios.com",
};

console.log("Documento Auditable:", documentoCompleto);

console.log("\n--- Fin de Tipos de Unión e Intersección ---\n");

// ============================================
// UNIONES DISCRIMINADAS (TAGGED UNIONS)
// ============================================
// El patrón más importante en TypeScript. Usa una propiedad literal compartida
// (discriminante) para estrechar el tipo de forma 100% segura.

interface CargaPendiente {
  estado: "PENDIENTE";
}

interface CargaExitosa {
  estado: "EXITO";
  datos: string[];
}

interface CargaFallida {
  estado: "ERROR";
  codigoHttp: number;
  mensaje: string;
}

type EstadoPeticion = CargaPendiente | CargaExitosa | CargaFallida;

function procesarPeticion(peticion: EstadoPeticion): void {
  // TypeScript utiliza la propiedad 'estado' como discriminante
  if (peticion.estado === "PENDIENTE") {
    console.log("⏳ Solicitud en espera...");
  } else if (peticion.estado === "EXITO") {
    // Aquí TypeScript sabe al 100% que 'datos' existe.
    console.log(`✅ Éxito: ${peticion.datos.length} elementos cargados`);
    console.log("Datos:", peticion.datos);
  } else if (peticion.estado === "ERROR") {
    // Aquí sabe que 'codigoHttp' y 'mensaje' existen.
    console.warn(`❌ Error ${peticion.codigoHttp}: ${peticion.mensaje}`);
  }
}

// Ejemplos de uso
const peticionPendiente: EstadoPeticion = { estado: "PENDIENTE" };
const peticionExitosa: EstadoPeticion = {
  estado: "EXITO",
  datos: ["usuario1", "usuario2", "usuario3"],
};
const peticionFallida: EstadoPeticion = {
  estado: "ERROR",
  codigoHttp: 404,
  mensaje: "Recurso no encontrado",
};

console.log("Procesando peticiones:");
procesarPeticion(peticionPendiente);
procesarPeticion(peticionExitosa);
procesarPeticion(peticionFallida);

console.log("\n--- Fin de Uniones Discriminadas ---\n");

// ============================================
// ANÁLISIS EXHAUSTIVO (EXHAUSTIVENESS CHECKING) CON NEVER
// ============================================
// El tipo 'never' garantiza que TODOS los casos de una unión estén manejados.
// Si añades un nuevo estado, el compilador te obliga a actualizar el código.

import { procesarPago, generarReporteAlternativo } from "./domain/types/matricula";

// Ejemplo 1: Método de pago con exhaustiveness checking
console.log("🔍 ANÁLISIS EXHAUSTIVO CON NEVER\n");

console.log("Procesando pagos:");
console.log("TARJETA:", procesarPago("TARJETA"));
console.log("PAYPAL:", procesarPago("PAYPAL"));
console.log("CRIPTOMONEDA:", procesarPago("CRIPTOMONEDA"));

// Ejemplo 2: Estados de matrícula con exhaustiveness checking
console.log("\nEstados de matrícula con exhaustiveness checking:");
import { EstadoMatricula, MatriculaActiva, MatriculaSuspendida, MatriculaFinalizada } from "./domain/types/matricula";

const matriculaActiva: EstadoMatricula = {
  tipo: "ACTIVA",
  asignaturas: [],
  fechaInicio: new Date(),
  creditosEnCurso: 0,
};

const matriculaSuspendida: EstadoMatricula = {
  tipo: "SUSPENDIDA",
  motivo: "Baja temporal",
  fechaSuspensión: new Date(),
  duracionSemestres: 1,
};

const matriculaFinalizada: EstadoMatricula = {
  tipo: "FINALIZADA",
  notaMedia: 8.5,
  fechaGraduación: new Date(),
  conDistinción: true,
};

console.log("Activa:", generarReporteAlternativo(matriculaActiva));
console.log("Suspendida:", generarReporteAlternativo(matriculaSuspendida));
console.log("Finalizada:", generarReporteAlternativo(matriculaFinalizada));

// ============================================
// DEMOSTRACIÓN DE ESCALABILIDAD
// ============================================
// Si añades un nuevo estado a EstadoMatricula, el compilador fallará
// hasta que actualices todas las funciones con exhaustiveness checking.

// COMENTADO: Si descomentas esto, verás errores de compilación
// interface MatriculaCancelada {
//   tipo: "CANCELADA";
//   motivoCancelacion: string;
//   fechaCancelacion: Date;
// }
// type EstadoMatriculaExpandido = EstadoMatricula | MatriculaCancelada;
// const matriculaCancelada: EstadoMatriculaExpandido = { tipo: "CANCELADA", ... };
// generarReporteAlternativo(matriculaCancelada); // ❌ Error de compilación

console.log("\n✅ Exhaustiveness checking asegura que el código escala sin bugs");
console.log("Si añades nuevos estados, el compilador te obliga a actualizar todo el código dependiente\n");

// ============================================
// TIPADO ESTRUCTURAL Y COMPROBACIÓN DE EXCESO
// ============================================
// TypeScript usa tipado estructural: si un objeto tiene las propiedades requeridas, es válido.
// Pero hace una excepción estricta al asignar literales de objetos para atrapar errores.

interface PuntoGeografico {
  latitud: number;
  longitud: number;
}

// ❌ COMENTADO: Error - Exceso de propiedades en literal de objeto
// const miPunto: PuntoGeografico = { latitud: 40.4, longitud: -3.7, altitud: 600 };

// ✅ Válido: El objeto pasa por una variable intermedia (Duck Typing puro)
const puntoConAltitud = { latitud: 40.4, longitud: -3.7, altitud: 600 };
const miPuntoAsignado: PuntoGeografico = puntoConAltitud;

console.log("Punto Geográfico (Duck Typing):", miPuntoAsignado);

// Otro ejemplo: Función que acepta PuntoGeografico
function mostrarCoordenadas(punto: PuntoGeografico): void {
  console.log(`Coordenadas: [${punto.latitud}, ${punto.longitud}]`);
}

mostrarCoordenadas(miPuntoAsignado);

// ✅ También funciona con objetos que tienen propiedades adicionales
const puntoCompleto = { latitud: 48.8566, longitud: 2.3522, ciudad: "París", altitud: 35 };
mostrarCoordenadas(puntoCompleto); // TypeScript ignora las propiedades extra aquí

console.log("\n--- Fin de Tipado Estructural ---\n");

// ============================================
// ENUMS: ENUMERACIONES CON NOMBRE
// ============================================
// Útiles para definir diccionarios cerrados de constantes.
// En arquitecturas modernas, a menudo se prefieren type aliases de literales.

enum NivelAcceso {
  Invitado = "GUEST",
  Usuario = "USER",
  Administrador = "ADMIN",
}

// Ejemplo de uso de enum
let permisoActual: NivelAcceso = NivelAcceso.Usuario;
console.log("Permiso actual:", permisoActual);

// Función que acepta enum
function verificarAcceso(nivel: NivelAcceso): string {
  switch (nivel) {
    case NivelAcceso.Invitado:
      return "Acceso limitado (solo lectura)";
    case NivelAcceso.Usuario:
      return "Acceso normal (lectura y escritura)";
    case NivelAcceso.Administrador:
      return "Acceso total (administración completa)";
    default:
      return "Nivel desconocido";
  }
}

console.log("Acceso para Invitado:", verificarAcceso(NivelAcceso.Invitado));
console.log("Acceso para Usuario:", verificarAcceso(NivelAcceso.Usuario));
console.log("Acceso para Admin:", verificarAcceso(NivelAcceso.Administrador));

// ============================================
// ALTERNATIVA MODERNA: Type Alias de Literales
// ============================================
// Más limpio en su transpilación, sin código de índices generado.

type NivelAccesoModerno = "GUEST" | "USER" | "ADMIN";

const miPermiso: NivelAccesoModerno = "ADMIN";
console.log("\nUsando type alias (enfoque moderno):", miPermiso);

// Diccionario de mapeos
const descripcionAcceso: Record<NivelAccesoModerno, string> = {
  GUEST: "Acceso limitado (solo lectura)",
  USER: "Acceso normal (lectura y escritura)",
  ADMIN: "Acceso total (administración completa)",
};

console.log("Descripción:", descripcionAcceso[miPermiso]);

console.log("\n--- Fin de Enums ---\n");

// ============================================
// PROGRAMACIÓN GENÉRICA (<T>)
// ============================================
// Los genéricos crean componentes reutilizables sin perder seguridad de tipos.
// Permiten parametrizar los tipos en interfaces, funciones y clases.

// Respuesta genérica de API
interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;           // El payload dependerá del contexto
  errores?: string[];
}

// Tipos concretos para usar con genéricos
interface Cliente {
  id: number;
  empresa: string;
}

interface Producto {
  sku: string;
  nombre: string;
  precio: number;
}

// Ejemplos de uso con tipos concretos
const respuestaCliente: RespuestaAPI<Cliente> = {
  codigoEstado: 200,
  exito: true,
  datos: { id: 104, empresa: "TechCorp" },
};

const respuestaProductos: RespuestaAPI<Producto[]> = {
  codigoEstado: 200,
  exito: true,
  datos: [
    { sku: "PROD-001", nombre: "Laptop", precio: 999.99 },
    { sku: "PROD-002", nombre: "Mouse", precio: 29.99 },
  ],
};

console.log("Respuesta Cliente:", respuestaCliente);
console.log("Respuesta Productos:", respuestaProductos);

// ============================================
// RESTRICCIONES GENÉRICAS (extends)
// ============================================
// Puedes limitar qué tipos pueden ser usados como genéricos.

interface ConIdentificador {
  id: string;
}

// La función solo acepta tipos que tengan la propiedad 'id'
function procesarConId<T extends ConIdentificador>(item: T): void {
  console.log(`Procesando item con ID: ${item.id}`);
}

interface Usuario extends ConIdentificador {
  id: string;
  nombre: string;
}

const usuario: Usuario = { id: "usr-123", nombre: "Carlos" };
procesarConId(usuario); // ✅ Funciona porque Usuario extiende ConIdentificador

// ============================================
// GENÉRICOS EN FUNCIONES
// ============================================

// Función genérica que invierte un array
function invertir<T>(array: T[]): T[] {
  return array.reverse();
}

const numeros = [1, 2, 3, 4, 5];
const invertidos = invertir(numeros);
console.log("Array invertido:", invertidos);

// Función genérica con múltiples parámetros
function intercambiar<A, B>(a: A, b: B): [B, A] {
  return [b, a];
}

const resultado = intercambiar("Hola", 42);
console.log("Intercambiado:", resultado); // [42, "Hola"]

// ============================================
// GENÉRICOS CON RESTRICCIONES COMPLEJAS
// ============================================

type ConClaveValor = {
  [K in keyof T]: T[K];
};

// Función que imprime las claves de un objeto genérico
function mostrarClaves<T extends object>(obj: T): void {
  const claves = Object.keys(obj);
  console.log("Claves del objeto:", claves);
}

mostrarClaves({ nombre: "Ana", edad: 30, ciudad: "Madrid" });

console.log("\n--- Fin de Programación Genérica ---\n");

export const message = "Hello TypeScript - Modulo 2";
console.log(message);

