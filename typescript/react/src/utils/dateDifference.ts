/**
 * Función utilitaria: Calcular diferencia en días entre dos fechas
 * Integración con date-fns con tipos estrictos
 */

import { differenceInDays, format, isValid } from 'date-fns';

/**
 * Resultado tipado para la diferencia de fechas
 * Usa discriminated union para manejar éxito y error
 */
export type ResultadoDiferencia = 
  | { tipo: "EXITO"; dias: number; fechaInicio: string; fechaFin: string }
  | { tipo: "ERROR"; mensaje: string };

/**
 * Calcula la diferencia en días entre dos fechas
 * @param fechaInicio - Fecha inicial
 * @param fechaFin - Fecha final
 * @returns ResultadoDiferencia con tipo discriminado
 * 
 * @ejemplo
 * const resultado = calcularDiferenciaDias(new Date('2024-01-01'), new Date('2024-01-10'));
 * if (resultado.tipo === "EXITO") {
 *   console.log(`Diferencia: ${resultado.dias} días`);
 * }
 */
export function calcularDiferenciaDias(
  fechaInicio: Date,
  fechaFin: Date
): ResultadoDiferencia {
  // Validación estricta de tipos
  if (!(fechaInicio instanceof Date) || !(fechaFin instanceof Date)) {
    return {
      tipo: "ERROR",
      mensaje: "Las fechas deben ser instancias de Date"
    };
  }

  // Validación de que las fechas sean válidas
  if (!isValid(fechaInicio) || !isValid(fechaFin)) {
    return {
      tipo: "ERROR",
      mensaje: "Una o ambas fechas son inválidas"
    };
  }

  try {
    const dias = differenceInDays(fechaFin, fechaInicio);
    
    return {
      tipo: "EXITO",
      dias: Math.abs(dias),
      fechaInicio: format(fechaInicio, 'dd/MM/yyyy'),
      fechaFin: format(fechaFin, 'dd/MM/yyyy')
    };
  } catch (error) {
    return {
      tipo: "ERROR",
      mensaje: `Error al calcular diferencia: ${error instanceof Error ? error.message : 'Desconocido'}`
    };
  }
}

/**
 * Función auxiliar: Obtener edad en años
 * Usa calcularDiferenciaDias internamente
 */
export function calcularEdad(fechaNacimiento: Date): number | null {
  const resultado = calcularDiferenciaDias(fechaNacimiento, new Date());
  
  if (resultado.tipo === "EXITO") {
    return Math.floor(resultado.dias / 365.25);
  }
  
  return null;
}

/**
 * Función auxiliar: Verificar si una fecha está dentro de un rango
 */
export function estaEnRango(fecha: Date, inicio: Date, fin: Date): boolean {
  if (!(fecha instanceof Date) || !(inicio instanceof Date) || !(fin instanceof Date)) {
    throw new Error("Todos los parámetros deben ser instancias de Date");
  }

  const diferenciaDesdeFin = calcularDiferenciaDias(fin, fecha);
  const diferenciaDesdeInicio = calcularDiferenciaDias(inicio, fecha);

  if (diferenciaDesdeFin.tipo === "ERROR" || diferenciaDesdeInicio.tipo === "ERROR") {
    return false;
  }

  // La fecha está en rango si es después del inicio y antes del fin
  return diferenciaDesdeInicio.dias >= 0 && diferenciaDesdeFin.dias >= 0;
}
