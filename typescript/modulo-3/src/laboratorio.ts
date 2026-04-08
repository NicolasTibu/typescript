/**
 * Laboratorio Práctico 3: Ecosistemas Modernos
 * Utility Types en acción: API de Gestión de Tareas
 */

import { Partial, Readonly, Pick, Omit, Record, Awaited } from "./domain/utility-types";

// ============================================
// DOMINIO: SISTEMA DE GESTIÓN DE TAREAS
// ============================================

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  estado: EstadoTarea;
  prioridad: Prioridad;
  asignadoA: string;
  fechaCreacion: Date;
  fechaLimite?: Date;
  etiquetas: string[];
}

type EstadoTarea = "pendiente" | "en_progreso" | "completada" | "cancelada";
type Prioridad = "baja" | "media" | "alta" | "urgente";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

type RolUsuario = "admin" | "manager" | "developer";

// ============================================
// UTILITY TYPES EN ACCIÓN
// ============================================

// 1. Partial<T>: Para actualizaciones parciales
type ActualizacionTarea = Partial<Omit<Tarea, "id" | "fechaCreacion">>;

// 2. Readonly<T>: Para datos inmutables
type TareaInmutable = Readonly<Tarea>;

// 3. Pick<T, K>: Para vistas específicas
type VistaTareaBasica = Pick<Tarea, "id" | "titulo" | "estado" | "prioridad">;
type VistaTareaPublica = Omit<Tarea, "asignadoA">; // Sin datos sensibles

// 4. Record<K, T>: Para diccionarios
type EstadisticasPorEstado = Record<EstadoTarea, number>;
type TareasPorUsuario = Record<string, Tarea[]>; // clave: userId
type ConfiguracionEstados = Record<EstadoTarea, { color: string; icono: string }>;

// ============================================
// SERVICIO DE TAREAS CON UTILITY TYPES
// ============================================

class ServicioTareas {
  private tareas: Map<string, Tarea> = new Map();
  private usuarios: Map<string, Usuario> = new Map();

  // Inicializar datos de ejemplo
  constructor() {
    this.inicializarDatos();
  }

  private inicializarDatos() {
    // Usuarios
    const usuarios: Usuario[] = [
      { id: "usr-001", nombre: "Ana García", email: "ana@empresa.com", rol: "admin" },
      { id: "usr-002", nombre: "Carlos López", email: "carlos@empresa.com", rol: "developer" },
      { id: "usr-003", nombre: "María Rodríguez", email: "maria@empresa.com", rol: "manager" },
    ];

    usuarios.forEach(user => this.usuarios.set(user.id, user));

    // Tareas
    const tareas: Tarea[] = [
      {
        id: "task-001",
        titulo: "Implementar autenticación",
        descripcion: "Sistema de login con JWT",
        estado: "en_progreso",
        prioridad: "alta",
        asignadoA: "usr-002",
        fechaCreacion: new Date("2026-04-01"),
        fechaLimite: new Date("2026-04-15"),
        etiquetas: ["backend", "seguridad"],
      },
      {
        id: "task-002",
        titulo: "Diseñar UI del dashboard",
        descripcion: "Interfaz de usuario para métricas",
        estado: "pendiente",
        prioridad: "media",
        asignadoA: "usr-003",
        fechaCreacion: new Date("2026-04-02"),
        etiquetas: ["frontend", "ui/ux"],
      },
    ];

    tareas.forEach(task => this.tareas.set(task.id, task));
  }

  // ============================================
  // MÉTODOS QUE USAN UTILITY TYPES
  // ============================================

  // Actualizar tarea (usa Partial<T>)
  actualizarTarea(id: string, cambios: ActualizacionTarea): boolean {
    const tarea = this.tareas.get(id);
    if (!tarea) return false;

    // Aplicar cambios parciales
    const tareaActualizada = { ...tarea, ...cambios };
    this.tareas.set(id, tareaActualizada);
    return true;
  }

  // Obtener vista básica (usa Pick<T, K>)
  obtenerVistaBasica(id: string): VistaTareaBasica | null {
    const tarea = this.tareas.get(id);
    if (!tarea) return null;

    // Pick solo las propiedades necesarias
    const { id: taskId, titulo, estado, prioridad } = tarea;
    return { id: taskId, titulo, estado, prioridad };
  }

  // Obtener vista pública (usa Omit<T, K>)
  obtenerVistaPublica(id: string): VistaTareaPublica | null {
    const tarea = this.tareas.get(id);
    if (!tarea) return null;

    // Omitir datos sensibles
    const { asignadoA, ...tareaPublica } = tarea;
    return tareaPublica;
  }

  // Estadísticas por estado (usa Record<K, T>)
  obtenerEstadisticas(): EstadisticasPorEstado {
    const stats: EstadisticasPorEstado = {
      pendiente: 0,
      en_progreso: 0,
      completada: 0,
      cancelada: 0,
    };

    for (const tarea of this.tareas.values()) {
      stats[tarea.estado]++;
    }

    return stats;
  }

  // Configuración de estados (usa Record<K, T>)
  obtenerConfiguracionEstados(): ConfiguracionEstados {
    return {
      pendiente: { color: "gray", icono: "⏳" },
      en_progreso: { color: "blue", icono: "🔄" },
      completada: { color: "green", icono: "✅" },
      cancelada: { color: "red", icono: "❌" },
    };
  }

  // Tareas por usuario (usa Record<K, T>)
  obtenerTareasPorUsuario(): TareasPorUsuario {
    const tareasPorUsuario: TareasPorUsuario = {};

    for (const tarea of this.tareas.values()) {
      if (!tareasPorUsuario[tarea.asignadoA]) {
        tareasPorUsuario[tarea.asignadoA] = [];
      }
      tareasPorUsuario[tarea.asignadoA].push(tarea);
    }

    return tareasPorUsuario;
  }

  // Método asíncrono (para demostrar Awaited<T>)
  async obtenerTareaAsync(id: string): Promise<TareaInmutable | null> {
    // Simular latencia
    await new Promise(resolve => setTimeout(resolve, 100));

    const tarea = this.tareas.get(id);
    return tarea ? { ...tarea } : null; // Retornar copia inmutable
  }
}

// ============================================
// DEMOSTRACIÓN DEL LABORATORIO
// ============================================

async function ejecutarLaboratorio() {
  console.log("\n" + "=".repeat(70));
  console.log("LABORATORIO PRÁCTICO 3: UTILITY TYPES EN ACCIÓN");
  console.log("Sistema de Gestión de Tareas");
  console.log("=".repeat(70) + "\n");

  const servicio = new ServicioTareas();

  // 1. DEMOSTRACIÓN DE PARTIAL<T>
  console.log("1️⃣ PARTIAL<T> - Actualización parcial de tareas\n");

  console.log("Antes de actualizar:");
  const vistaAntes = servicio.obtenerVistaBasica("task-001");
  console.log(vistaAntes);

  // Actualizar solo el estado y prioridad
  const exito = servicio.actualizarTarea("task-001", {
    estado: "completada",
    prioridad: "urgente",
  });

  console.log("\nDespués de actualizar (solo estado y prioridad):");
  const vistaDespues = servicio.obtenerVistaBasica("task-001");
  console.log(vistaDespues);
  console.log(`Actualización exitosa: ${exito}\n`);

  // 2. DEMOSTRACIÓN DE PICK<T, K> Y OMIT<T, K>
  console.log("2️⃣ PICK<T, K> y OMIT<T, K> - Vistas específicas\n");

  console.log("Vista básica (Pick):");
  console.log(servicio.obtenerVistaBasica("task-002"));

  console.log("\nVista pública (Omit asignadoA):");
  console.log(servicio.obtenerVistaPublica("task-002"));
  console.log();

  // 3. DEMOSTRACIÓN DE RECORD<K, T>
  console.log("3️⃣ RECORD<K, T> - Diccionarios tipados\n");

  console.log("Estadísticas por estado:");
  const stats = servicio.obtenerEstadisticas();
  Object.entries(stats).forEach(([estado, cantidad]) => {
    console.log(`  ${estado}: ${cantidad} tareas`);
  });

  console.log("\nConfiguración visual de estados:");
  const configEstados = servicio.obtenerConfiguracionEstados();
  Object.entries(configEstados).forEach(([estado, config]) => {
    console.log(`  ${estado}: ${config.icono} ${config.color}`);
  });

  console.log("\nTareas agrupadas por usuario:");
  const tareasPorUsuario = servicio.obtenerTareasPorUsuario();
  Object.entries(tareasPorUsuario).forEach(([userId, tareas]) => {
    console.log(`  Usuario ${userId}: ${tareas.length} tareas`);
    tareas.forEach(tarea => console.log(`    - ${tarea.titulo}`));
  });
  console.log();

  // 4. DEMOSTRACIÓN DE AWAITED<T>
  console.log("4️⃣ AWAITED<T> - Trabajo con promesas\n");

  console.log("Obteniendo tarea de forma asíncrona...");
  const tareaAsync: Awaited<ReturnType<typeof servicio.obtenerTareaAsync>> =
    await servicio.obtenerTareaAsync("task-001");

  if (tareaAsync) {
    console.log("Tarea obtenida:", {
      id: tareaAsync.id,
      titulo: tareaAsync.titulo,
      estado: tareaAsync.estado,
    });
    // tareaAsync.estado = "cancelada"; // ❌ Error: read-only property
    console.log("✅ La tarea es inmutable (Readonly<T>)");
  } else {
    console.log("Tarea no encontrada");
  }

  console.log("\n" + "=".repeat(70));
  console.log("✅ LABORATORIO 3 COMPLETADO");
  console.log("Los utility types transforman cómo escribimos código TypeScript");
  console.log("=".repeat(70));
}

// Ejecutar laboratorio
ejecutarLaboratorio().catch(console.error);