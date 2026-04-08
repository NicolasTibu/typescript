// Práctica 4 - Módulo 1: tipos primitivos, inferencia y tipos especiales
import { calcularMedia, calcularMediana, filtrarAtipicos } from "./math-utils.js";

// Primitivos
const identificador: string = "USR-492";
const iteraciones: number = 10;
const procesoActivo: boolean = true;

// Inferencia de tipo
const timestamp = new Date().getTime(); // TypeScript infiere que es `number`

// Ausencia de valor (con `strictNullChecks`)
const posibleNombre: string | null = null;
const posibleAlias: string | undefined = undefined;

function longitudSeguro(valor: string | null | undefined): number {
  // `== null` es intencional: cubre tanto `null` como `undefined`
  if (valor == null) return 0;
  return valor.length;
}

// Tipos especiales

// `any` desactiva el sistema de tipos (no recomendado). Lo dejamos solo como referencia:
// let cualquier: any = 123; // Desaconsejado en un entorno académico/profesional

// `unknown` obliga a verificar el tipo antes de operar
function manejarValor(valor: unknown): void {
  if (typeof valor === "string") {
    console.log("string:", valor.toUpperCase());
    return;
  }

  if (typeof valor === "number") {
    console.log("number:", valor.toFixed(2));
    return;
  }

  if (typeof valor === "boolean") {
    console.log("boolean:", valor ? "true" : "false");
    return;
  }

  if (valor == null) {
    // cubre `null` y `undefined`
    console.log("vacío:", String(valor));
    return;
  }

  if (Array.isArray(valor)) {
    console.log("array:", `len=${valor.length}`);
    return;
  }

  console.log("otro tipo:", Object.prototype.toString.call(valor));
}

// `void` indica que no se retorna ningún valor
function registrarProceso(): void {
  console.log(
    "registrado:",
    identificador,
    iteraciones,
    procesoActivo,
    "timestamp=",
    timestamp,
  );
}

// `never` se usa en exhaustividad y en flujos que no deberían ocurrir
type Proceso = "inicio" | "enProceso" | "fin";

function assertNever(value: never): never {
  throw new Error(`Estado no exhaustivo: ${String(value)}`);
}

function descripcionProceso(proceso: Proceso): string {
  switch (proceso) {
    case "inicio":
      return "Inicio del proceso";
    case "enProceso":
      return "El proceso está en ejecución";
    case "fin":
      return "Proceso finalizado";
  }

  // Si se añade un nuevo caso a `Proceso`, TypeScript fallará aquí
  return assertNever(proceso);
}

// Ejecución de ejemplo (solo demostración)
registrarProceso();
console.log("longitudSeguro:", longitudSeguro(posibleNombre), longitudSeguro(posibleAlias));
manejarValor("hola");
manejarValor(12.345);
manejarValor(true);
manejarValor(null);
manejarValor(undefined);
manejarValor([1, 2, 3]);
console.log(descripcionProceso("inicio"));
console.log(descripcionProceso("enProceso"));
console.log(descripcionProceso("fin"));

// Práctica 4 - Módulo 1: Estructuras de datos secuenciales (arrays y tuplas)

// Arrays: colecciones homogéneas
const metricas: number[] = [12.4, 8.9, 15.0];
const logs: Array<string> = ["INFO: Inicio", "ERROR: Timeout"];

function promedio(valores: readonly number[]): number {
  if (valores.length === 0) return 0;
  const suma: number = valores.reduce((acc, v) => acc + v, 0);
  return suma / valores.length;
}

const promedioMetricas = promedio(metricas);
const soloErrores = logs.filter((log) => log.startsWith("ERROR"));
console.log({ promedioMetricas, soloErrores });

// Tuplas: longitud estricta y tipos heterogéneos por posición
const coordenadaEspacial: [number, number, number] = [40.4168, -3.7038, 600]; // [Latitud, Longitud, Altitud]

const [latitud, longitud, altitud] = coordenadaEspacial;
console.log(`Coordenadas -> lat=${latitud}, lon=${longitud}, alt=${altitud}`);

function obtenerMinMax(valores: readonly number[]): [number, number] {
  if (valores.length === 0) return [0, 0];

  let min: number = valores[0];
  let max: number = valores[0];

  for (const v of valores) {
    if (v < min) min = v;
    if (v > max) max = v;
  }

  // Tupla [min, max] para retornos múltiples tipados
  return [min, max];
}

const [minMetricas, maxMetricas] = obtenerMinMax(metricas);
console.log({ minMetricas, maxMetricas });

// Práctica 4 - Módulo 1: Firmas de funciones (function signatures)

// Parámetros obligatorios y retorno estricto
function calcularDesviacionEstandar(datos: readonly number[], media: number): number {
  if (datos.length === 0) return 0;

  const sumaCuadrados: number = datos.reduce((acc, x) => {
    const diferencia: number = x - media;
    return acc + diferencia * diferencia;
  }, 0);

  // Desviación estándar poblacional (dividiendo entre N)
  return Math.sqrt(sumaCuadrados / datos.length);
}

// Parámetros opcionales (?) y parámetros con valor por defecto
function registrarEvento(mensaje: string, nivelError: number = 1, metadatos?: unknown): void {
  console.log(`[Nivel ${nivelError}] ${mensaje}`);

  // Con `unknown`, para hacer operaciones necesitamos comprobar el tipo
  if (metadatos === undefined) return;

  if (typeof metadatos === "string") {
    console.log("metadatos(string):", metadatos);
    return;
  }

  if (typeof metadatos === "number") {
    console.log("metadatos(number):", metadatos);
    return;
  }

  if (metadatos && typeof metadatos === "object") {
    console.log("metadatos(object):", metadatos);
    return;
  }

  console.log("metadatos(otro):", String(metadatos));
}

const mediaMetricas = promedio(metricas);
const desviacionMetricas = calcularDesviacionEstandar(metricas, mediaMetricas);
console.log({ mediaMetricas, desviacionMetricas });

registrarEvento("Evento registrado", 2);
registrarEvento("Evento con metadatos", 3, { usuario: "USR-492", intentos: 4 });

// Práctica 4 - Módulo 1: Declaraciones vs. Aserciones de tipo (`as`)

interface Configuracion {
  timeout: number;
  reintentos: number;
}

function usarConfiguracion(config: Configuracion): void {
  console.log(`timeout=${config.timeout}, reintentos=${config.reintentos}`);
}

// ❌ MAL: `as` le dice a TypeScript que confíe en nosotros y salta la verificación
// (compila, pero falta `reintentos` en el objeto real)
const configMal = { timeout: 5000 } as Configuracion;
console.log("configMal (peligroso):", configMal);
console.log("configMal.reintentos (podría ser undefined):", (configMal as Configuracion).reintentos);

// ✅ BIEN: declaración explícita (TypeScript detecta el error en compilación)
// const configBien: Configuracion = { timeout: 5000 };
// Error esperado: Property 'reintentos' is missing

// Alternativa recomendada cuando el valor viene de runtime: usar `unknown` + type guard
function isConfiguracion(valor: unknown): valor is Configuracion {
  if (valor == null || typeof valor !== "object") return false;

  const v = valor as Record<string, unknown>;
  return typeof v.timeout === "number" && typeof v.reintentos === "number";
}

const configRuntime: unknown = { timeout: 5000, reintentos: 3 };

if (isConfiguracion(configRuntime)) {
  usarConfiguracion(configRuntime);
} else {
  console.log("configRuntime no cumple con Configuracion");
}

// Práctica 4 - Módulo 1: Ensanchamiento de tipos (Type Widening) y `as const`

// Con `let`, TypeScript infiere un tipo más general porque el valor podría cambiar.
let estado: string = "ACTIVO";
estado = "INACTIVO"; // permitido

// Con `const` (primitivos), infiere el literal exacto.
const estadoFijo = "ACTIVO"; // tipo literal '"ACTIVO"'
// estadoFijo = "INACTIVO"; // error (estadoFijo es constante)

// Para estructuras complejas, sin `as const` se asume mutabilidad (y se ensanchan los tipos).
const permisosMutables = { admin: true, nivel: 1 };
// Tipo inferido (conceptualmente): { admin: boolean; nivel: number }
console.log("permisosMutables:", permisosMutables);

// Con `as const` se congela profundamente y se mantienen literales:
const permisosInmutables = { admin: true, nivel: 1 } as const;
// Tipo inferido (conceptualmente): { readonly admin: true; readonly nivel: 1 }
console.log("permisosInmutables:", permisosInmutables);

// permisosInmutables.nivel = 2; // error (readonly)

function aceptarNivelExacto(nivel: 1): void {
  console.log(`Nivel exacto recibido: ${nivel}`);
}

// Acepta solo el literal `1`, útil para configuraciones estáticas.
aceptarNivelExacto(permisosInmutables.nivel);

// Práctica 4 - Módulo 1: Laboratorio práctico 1 (Inicialización y lógica pura)

// Datos de prueba
const datosEjemplo: number[] = [10, 12, 12, 13, 100, 11, 9, 14];

const mediaEjemplo: number | null = calcularMedia(datosEjemplo);
const medianaEjemplo: number | null = calcularMediana(datosEjemplo);
const sinAtipicosEjemplo: number[] = filtrarAtipicos(datosEjemplo, 1.5);

console.log("mediaEjemplo:", mediaEjemplo);
console.log("medianaEjemplo:", medianaEjemplo);
console.log("sinAtipicosEjemplo:", sinAtipicosEjemplo);

// Casos límite
const datosVacios: number[] = [];
console.log("mediaVacia:", calcularMedia(datosVacios)); // null
console.log("medianaVacia:", calcularMediana(datosVacios)); // null
console.log("sinAtipicosVacio:", filtrarAtipicos(datosVacios, 1.5)); // []

