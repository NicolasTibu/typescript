/**
 * Hooks más comunes tipados con TypeScript
 * Módulo 4: Tipado de Hooks
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { Usuario, Servidor, EstadoCarga, RespuestaAPI } from "../types";

// ============================================
// 1. HOOK PERSONALIZADO PARA ESTADO TIPADO
// ============================================

/**
 * Hook para manejar usuarios con tipado completo
 */
export function useUsuario(usuarioIdInicial?: string) {
  // Tipado explícito: puede ser Usuario o null
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(false);

  // Función callback tipada
  const cargarUsuario = useCallback(async (usuarioId: string) => {
    setCargando(true);
    try {
      // Simulación de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const usuarioMock: Usuario = {
        id: usuarioId,
        nombre: "Juan Pérez",
        email: "juan@example.com",
        rol: "usuario",
        activo: true,
      };

      setUsuario(usuarioMock);
    } catch (error) {
      console.error("Error cargando usuario:", error);
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  // Cargar usuario inicial si se proporciona
  useEffect(() => {
    if (usuarioIdInicial) {
      cargarUsuario(usuarioIdInicial);
    }
  }, [usuarioIdInicial, cargarUsuario]);

  return { usuario, cargando, cargarUsuario, setUsuario };
}

// ============================================
// 2. HOOK PARA ESTADO COMPLEJO TIPADO
// ============================================

/**
 * Hook para gestionar servidores con tipado genérico
 */
interface UseServidoresRet {
  servidores: Servidor[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  agregarServidor: (servidor: Servidor) => void;
  eliminarServidor: (id: string) => void;
}

export function useServidores(): UseServidoresRet {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      // Simulación de API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const servidoresMock: Servidor[] = [
        {
          id: "srv-001",
          nombre: "Web Server 1",
          ip: "192.168.1.10",
          estado: "activo",
          carga: 45,
        },
        {
          id: "srv-002",
          nombre: "Database Server",
          ip: "192.168.1.20",
          estado: "activo",
          carga: 78,
        },
      ];

      setServidores(servidoresMock);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, []);

  const agregarServidor = useCallback((servidor: Servidor) => {
    setServidores((prev) => [...prev, servidor]);
  }, []);

  const eliminarServidor = useCallback((id: string) => {
    setServidores((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    servidores,
    cargando,
    error,
    cargar,
    agregarServidor,
    eliminarServidor,
  };
}

// ============================================
// 3. HOOK GENÉRICO PARA APICALLS
// ============================================

/**
 * Hook genérico para llamadas a API
 * Reutilizable para cualquier tipo de datos
 */
export function useAPI<T>(url: string) {
  const [estado, setEstado] = useState<EstadoCarga>("idle");
  const [datos, setDatos] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const llamar = useCallback(async () => {
    setEstado("cargando");
    setError(null);

    try {
      // Simulación de fetch
      await new Promise((resolve) => setTimeout(resolve, 500));

      // En una aplicación real:
      // const respuesta = await fetch(url);
      // const resultado: RespuestaAPI<T> = await respuesta.json();

      setDatos({} as T);
      setEstado("exitoso");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setEstado("error");
    }
  }, [url]);

  return {
    estado,
    datos,
    error,
    llamar,
    resetear: () => {
      setEstado("idle");
      setDatos(null);
      setError(null);
    },
  };
}

// ============================================
// 4. HOOK CON useRef TIPADO
// ============================================

/**
 * Hook para manejar temporizadores con referencias tipadas
 */
export function useIntervalo(callback: () => void, delay: number | null) {
  const idRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (delay === null) return;

    idRef.current = setInterval(callback, delay);

    return () => {
      if (idRef.current) clearInterval(idRef.current);
    };
  }, [delay, callback]);

  const detener = () => {
    if (idRef.current) {
      clearInterval(idRef.current);
      idRef.current = null;
    }
  };

  return { detener };
}

// ============================================
// 5. HOOK PERSONALIZADO AVANZADO
// ============================================

/**
 * Hook para gestionar formularios con validación tipada
 */
interface ConfiguracionFormulario<T> {
  valoresIniciales: T;
  onEnviar: (valores: T) => Promise<void>;
  validar?: (valores: T) => Record<keyof T, string>;
}

export function useFormulario<T extends Record<string, any>>({
  valoresIniciales,
  onEnviar,
  validar,
}: ConfiguracionFormulario<T>) {
  const [valores, setValores] = useState<T>(valoresIniciales);
  const [errores, setErrores] = useState<Partial<Record<keyof T, string>>>({});
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = useCallback(
    (nombre: keyof T, valor: any) => {
      setValores((prev) => ({
        ...prev,
        [nombre]: valor,
      }));

      // Limpiar error si existe
      if (errores[nombre]) {
        setErrores((prev) => {
          const nuevoErrores = { ...prev };
          delete nuevoErrores[nombre];
          return nuevoErrores;
        });
      }
    },
    [errores]
  );

  const manejarEnvio = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validar si existe validador
      if (validar) {
        const nuevosErrores = validar(valores);
        if (Object.keys(nuevosErrores).length > 0) {
          setErrores(nuevosErrores);
          return;
        }
      }

      setEnviando(true);
      try {
        await onEnviar(valores);
      } catch (error) {
        console.error("Error en formulario:", error);
      } finally {
        setEnviando(false);
      }
    },
    [valores, validar, onEnviar]
  );

  return {
    valores,
    errores,
    enviando,
    manejarCambio,
    manejarEnvio,
    resetear: () => setValores(valoresIniciales),
  };
}
