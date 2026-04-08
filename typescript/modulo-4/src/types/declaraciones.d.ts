/**
 * Archivo de declaración de tipos .d.ts
 * Ejemplo: tipos para una librería de terceros sin tipos
 */

// Simular una librería como lodash o express sin tipos
// En la práctica, instalas: npm install --save-dev @types/lodash

/**
 * Definición de tipos para una librería de utilidades ficticia
 * Este archivo solo contiene types, interfaces y firmas - NO lógica
 */

declare module "libreria-utilidades" {
  /**
   * Función que procesa arrays
   */
  export function procesarArray<T>(
    items: T[],
    callback: (item: T, index: number) => T
  ): T[];

  /**
   * Función para validar emails
   */
  export function validarEmail(email: string): boolean;

  /**
   * Función para conectar a base de datos
   */
  export function conectarBD(opciones: {
    host: string;
    puerto: number;
    usuario: string;
    contraseña: string;
  }): Promise<ConexionBD>;

  /**
   * Interfaz de conexión a BD
   */
  export interface ConexionBD {
    conectado: boolean;
    ejecutar(query: string): Promise<unknown[]>;
    cerrar(): Promise<void>;
  }

  /**
   * Enumeración de tipos de datos
   */
  export enum TipoDato {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
  }
}

/**
 * Definición de tipos para Express (similar a @types/express)
 */
declare module "express-tipos" {
  export interface Request {
    body: Record<string, any>;
    params: Record<string, string>;
    query: Record<string, string>;
  }

  export interface Response {
    send(datos: any): void;
    json(datos: any): void;
    status(codigo: number): Response;
  }

  export type RequestHandler = (
    req: Request,
    res: Response
  ) => void | Promise<void>;
}

/**
 * Definición de tipos para Node.js (similar a @types/node)
 */
declare namespace NodeJS {
  export interface Timeout {
    ref(): this;
    unref(): this;
  }

  export interface Immediate {
    ref(): this;
    unref(): this;
  }

  export interface Process {
    env: ProcessEnv;
    exit(code?: number): never;
  }

  export interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    [variable: string]: string | undefined;
  }
}

/**
 * Variables globales del navegador (para aplicaciones React)
 */
declare global {
  interface Window {
    APP_VERSION: string;
    API_URL: string;
    DEBUG_MODE: boolean;
  }

  interface Document {
    documentElement: HTMLElement;
  }
}

export {};
