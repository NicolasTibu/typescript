// Práctica 4 - Módulo 1: Inicialización y lógica pura

// Nota: funciones puras -> no modifican la entrada y no dependen de estado externo.

function ordenarAscendente(datos: readonly number[]): number[] {
  return [...datos].sort((a, b) => a - b);
}

export function calcularMedia(datos: readonly number[]): number | null {
  if (datos.length === 0) return null;

  const suma: number = datos.reduce((acc, x) => acc + x, 0);
  return suma / datos.length;
}

export function calcularMediana(datos: readonly number[]): number | null {
  if (datos.length === 0) return null;

  const ordenados: number[] = ordenarAscendente(datos);
  const n: number = ordenados.length;
  const mid: number = Math.floor(n / 2);

  if (n % 2 === 1) {
    // Longitud impar -> valor central exacto
    return ordenados[mid];
  }

  // Longitud par -> promedio de los dos valores centrales
  return (ordenados[mid - 1] + ordenados[mid]) / 2;
}

function calcularQ1Q3(datos: readonly number[]): { q1: number | null; q3: number | null } {
  if (datos.length < 2) return { q1: null, q3: null };

  const ordenados: number[] = ordenarAscendente(datos);
  const n: number = ordenados.length;
  const mid: number = Math.floor(n / 2);

  // IQR con mediana: excluir el elemento central si n es impar
  const lower: number[] = n % 2 === 0 ? ordenados.slice(0, mid) : ordenados.slice(0, mid);
  const upper: number[] = n % 2 === 0 ? ordenados.slice(mid) : ordenados.slice(mid + 1);

  const q1: number | null = calcularMediana(lower);
  const q3: number | null = calcularMediana(upper);

  return { q1, q3 };
}

export function filtrarAtipicos(datos: readonly number[], limite: number): number[] {
  if (datos.length === 0) return [];

  if (!Number.isFinite(limite)) return [...datos];

  const k: number = Math.abs(limite);

  const { q1, q3 } = calcularQ1Q3(datos);
  if (q1 == null || q3 == null) return [...datos];

  const iqr: number = q3 - q1;
  if (iqr === 0) return [...datos]; // no hay dispersión -> no se detectan outliers por IQR

  const inferior: number = q1 - k * iqr;
  const superior: number = q3 + k * iqr;

  // Conservamos el orden original del array de entrada
  return datos.filter((x) => x >= inferior && x <= superior);
}

