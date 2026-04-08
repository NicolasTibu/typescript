/**
 * Utility Types personalizados y re-exportaciones
 * Módulo 3: Ecosistemas Modernos
 */

// Re-exportar utility types built-in de TypeScript para claridad
export type {
  Partial,
  Readonly,
  Pick,
  Omit,
  Record,
  Awaited,
  Required,
  Exclude,
  Extract,
  NonNullable,
} from "typescript";

// Ejemplos de utility types personalizados avanzados

/**
 * Hace opcionales solo algunas propiedades específicas
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Hace requeridas solo algunas propiedades específicas
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Unión de valores de un objeto
 */
export type ValueOf<T> = T[keyof T];

/**
 * Crea un tipo con propiedades opcionales excepto las especificadas
 */
export type AtLeastOne<T, K extends keyof T = keyof T> = Partial<T> & Pick<T, K>;

/**
 * Tipo que representa una función
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * Extrae el tipo de retorno de una función
 */
export type ReturnTypeOf<T extends AnyFunction> = T extends (...args: any[]) => infer R ? R : never;

/**
 * Extrae los tipos de parámetros de una función
 */
export type ParametersOf<T extends AnyFunction> = T extends (...args: infer P) => any ? P : never;