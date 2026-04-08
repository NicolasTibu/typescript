/**
 * Uniones Discriminadas para Estados de Matrícula
 * Patrón fundamental de TypeScript: discriminantes tipados
 */

import { Asignatura } from "./entidades";

/**
 * MatriculaActiva: Estudiante actualmente inscrito en asignaturas
 * Discriminante: tipo = "ACTIVA"
 */
export interface MatriculaActiva {
  tipo: "ACTIVA";
  asignaturas: Asignatura[];
  fechaInicio: Date;
  creditosEnCurso: number;
}

/**
 * MatriculaSuspendida: Matrícula en pausa temporal
 * Discriminante: tipo = "SUSPENDIDA"
 */
export interface MatriculaSuspendida {
  tipo: "SUSPENDIDA";
  motivo: string;
  fechaSuspensión: Date;
  duracionSemestres: number;
}

/**
 * MatriculaFinalizada: Estudiante ha completado su carrera
 * Discriminante: tipo = "FINALIZADA"
 */
export interface MatriculaFinalizada {
  tipo: "FINALIZADA";
  notaMedia: number;
  fechaGraduación: Date;
  conDistinción: boolean;
}

/**
 * Unión Discriminada: EstadoMatricula
 * Solo un estado puede ser válido a la vez. TypeScript hace narrowing automático.
 */
export type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

/**
 * ANÁLISIS EXHAUSTIVO (EXHAUSTIVENESS CHECKING) CON EL TIPO NEVER
 *
 * El tipo 'never' representa valores que nunca pueden ocurrir.
 * En uniones discriminadas, se usa para garantizar que TODOS los casos posibles
 * estén manejados en switch statements.
 *
 * Si añades un nuevo estado a EstadoMatricula, el compilador te obligará
 * a actualizar TODAS las funciones que evalúan esta unión.
 */

/**
 * Función generarReporte mejorada
 * Incluye exhaustiveness checking robusto con never.
 * Si añades un nuevo estado a EstadoMatricula, esta función fallará en compilación.
 */
export function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case "ACTIVA":
      return `✅ Matrícula Activa: ${estado.asignaturas.length} asignatura(s) en curso, ${estado.creditosEnCurso} créditos.`;

    case "SUSPENDIDA":
      return `⏸️  Matrícula Suspendida: ${estado.motivo}. Duración: ${estado.duracionSemestres} semestre(s).`;

    case "FINALIZADA":
      const distincion = estado.conDistinción ? "con Distinción" : "aprobada";
      return `🎓 Matrícula Finalizada ${distincion}. Nota Media: ${estado.notaMedia.toFixed(2)}.`;

    // EXHAUSTIVENESS CHECKING: Si falta un caso, el compilador lo detecta
    default:
      // Esta asignación a 'never' forzará un error de compilación si:
      // 1. Se añade un nuevo estado a EstadoMatricula
      // 2. No se añade el case correspondiente arriba
      const _exhaustivo: never = estado;
      throw new Error(`Estado de matrícula no manejado: ${JSON.stringify(_exhaustivo)}`);
  }
}

/**
 * EJEMPLO ADICIONAL: Método de Pago con Exhaustiveness Checking
 * Demuestra cómo el tipo never previene bugs cuando se escala el código.
 */

type MetodoPago = "TARJETA" | "PAYPAL" | "CRIPTOMONEDA";

/**
 * Función procesarPago con exhaustiveness checking
 * Si añades un nuevo método de pago, el compilador te obligará a actualizar esta función.
 */
export function procesarPago(metodo: MetodoPago): string {
  switch (metodo) {
    case "TARJETA":
      return "Conectando con Stripe...";

    case "PAYPAL":
      return "Redirigiendo a PayPal...";

    case "CRIPTOMONEDA":
      return "Procesando transacción blockchain...";

    // Si olvidas manejar un nuevo método, el bloque default capturará el valor
    // y la asignación a 'never' causará un ERROR EN TIEMPO DE COMPILACIÓN
    default:
      const comprobacionExhaustiva: never = metodo;
      // ^ Error: Type 'string' is not assignable to type 'never'.
      throw new Error(`Método de pago no manejado: ${comprobacionExhaustiva}`);
  }
}

/**
 * Función auxiliar para demostrar exhaustiveness checking
 * Útil para validar que una unión está completamente manejada.
 */
export function asegurarExhaustivo(valor: never): never {
  throw new Error(`Valor inesperado: ${JSON.stringify(valor)}`);
}

/**
 * Versión alternativa de generarReporte usando la función auxiliar
 * Más limpia y reutilizable.
 */
export function generarReporteAlternativo(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case "ACTIVA":
      return `✅ Matrícula Activa: ${estado.asignaturas.length} asignatura(s) en curso.`;

    case "SUSPENDIDA":
      return `⏸️  Matrícula Suspendida: ${estado.motivo}.`;

    case "FINALIZADA":
      return `🎓 Matrícula Finalizada. Nota Media: ${estado.notaMedia.toFixed(2)}.`;

    default:
      // Usando la función auxiliar para exhaustiveness checking
      return asegurarExhaustivo(estado);
  }
}

/**
 * EJEMPLO DE ESCALABILIDAD
 * Imagina que añades un nuevo estado: MatriculaCancelada
 *
 * export interface MatriculaCancelada {
 *   tipo: "CANCELADA";
 *   motivoCancelacion: string;
 *   fechaCancelacion: Date;
 * }
 *
 * export type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada | MatriculaCancelada;
 *
 * Al añadir MatriculaCancelada, TODAS las funciones con exhaustiveness checking
 * (generarReporte, generarReporteAlternativo) fallarán en compilación hasta que
 * añadas el case correspondiente. ¡Esto previene bugs en producción!
 */
