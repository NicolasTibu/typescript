/**
 * Laboratorio Práctico 2: Arquitectura de Acceso a Datos
 * Sistema de Gestión Universitario
 */

import { Asignatura, Estudiante } from "./domain/types/entidades";
import {
  EstadoMatricula,
  MatriculaActiva,
  MatriculaSuspendida,
  MatriculaFinalizada,
  generarReporte,
} from "./domain/types/matricula";
import { obtenerRecurso, obtenerRecursoPorId } from "./services/api-client";

console.log("\n" + "=".repeat(60));
console.log("LABORATORIO PRÁCTICO 2: ARQUITECTURA DE ACCESO A DATOS");
console.log("Sistema de Gestión Universitario");
console.log("=".repeat(60) + "\n");

// ============================================
// PARTE 1: DEMOSTRACION DE ENTIDADES
// ============================================

console.log("📚 PARTE 1: MODELADO DE ENTIDADES\n");

const estudiante: Estudiante = {
  id: "EST-001",
  nombreCompleto: "María García López",
  email: "maria@universidad.edu",
  fechaNacimiento: new Date("2003-05-15"),
  carrera: "Ingeniería Informática",
  activo: true,
};

console.log("Estudiante registrado:", estudiante);
console.log(`ID inmutable: ${estudiante.id}\n`);

// ============================================
// PARTE 2: UNIONES DISCRIMINADAS
// ============================================

console.log("🎓 PARTE 2: ESTADOS DE MATRÍCULA\n");

// Estado 1: Matrícula Activa
const matriculaActiva: MatriculaActiva = {
  tipo: "ACTIVA",
  asignaturas: [
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
  fechaInicio: new Date("2026-01-15"),
  creditosEnCurso: 12,
};

console.log("Estado 1 - Matrícula Activa:");
console.log(generarReporte(matriculaActiva));

// Estado 2: Matrícula Suspendida
const matriculaSuspendida: MatriculaSuspendida = {
  tipo: "SUSPENDIDA",
  motivo: "Baja voluntaria por problemas de salud",
  fechaSuspensión: new Date("2026-02-01"),
  duracionSemestres: 2,
};

console.log("\nEstado 2 - Matrícula Suspendida:");
console.log(generarReporte(matriculaSuspendida));

// Estado 3: Matrícula Finalizada
const matriculaFinalizada: MatriculaFinalizada = {
  tipo: "FINALIZADA",
  notaMedia: 8.5,
  fechaGraduación: new Date("2026-06-15"),
  conDistinción: true,
};

console.log("\nEstado 3 - Matrícula Finalizada:");
console.log(generarReporte(matriculaFinalizada));

// ============================================
// PARTE 3: CLIENTE API GENÉRICO
// ============================================

console.log("\n🌐 PARTE 3: CLIENTE API GENÉRICO\n");

async function demostrarAPI() {
  console.log("Haciendo llamadas a la API simulada...\n");

  // Obtener lista de estudiantes
  console.log("1. Obteniendo lista de estudiantes:");
  const respuestaEstudiantes = await obtenerRecurso<Estudiante[]>("/api/estudiantes");
  console.log(`Status: ${respuestaEstudiantes.codigoEstado}`);
  console.log(`Éxito: ${respuestaEstudiantes.exito}`);
  console.log(`Estudiantes: ${respuestaEstudiantes.datos.length}\n`);

  // Obtener lista de asignaturas
  console.log("2. Obteniendo lista de asignaturas:");
  const respuestaAsignaturas = await obtenerRecurso<Asignatura[]>("/api/asignaturas");
  console.log(`Status: ${respuestaAsignaturas.codigoEstado}`);
  console.log(`Asignaturas: ${respuestaAsignaturas.datos.length}`);
  respuestaAsignaturas.datos.forEach((asig) => {
    console.log(`   - ${asig.codigo}: ${asig.nombre}`);
  });
  console.log();

  // Obtener un estudiante por ID
  console.log("3. Obteniendo un estudiante específico (EST-001):");
  const respuestaEstudianteId = await obtenerRecursoPorId<Estudiante>(
    "/api/estudiantes",
    "EST-001"
  );
  if (respuestaEstudianteId.exito) {
    const est = respuestaEstudianteId.datos;
    console.log(`   ${est.nombreCompleto} - ${est.carrera}\n`);
  }

  // Intentar obtener un recurso inexistente
  console.log("4. Intentando obtener un endpoint inexistente:");
  const respuestaError = await obtenerRecurso<unknown>("/api/inexistente");
  console.log(`Status: ${respuestaError.codigoEstado}`);
  console.log(`Éxito: ${respuestaError.exito}`);
  console.log(`Errores: ${respuestaError.errores?.join(", ")}\n`);

  console.log("=".repeat(60));
  console.log("✅ LABORATORIO COMPLETADO");
  console.log("=".repeat(60));
}

// ============================================
// PARTE 4: ANÁLISIS EXHAUSTIVO CON NEVER
// ============================================

function demostrarExhaustiveness() {
  console.log("\n🔍 PARTE 4: ANÁLISIS EXHAUSTIVO (EXHAUSTIVENESS CHECKING)\n");

  import { procesarPago, generarReporteAlternativo } from "./domain/types/matricula";

  // Demostración de métodos de pago
  console.log("Procesando diferentes métodos de pago:");
  console.log("💳 TARJETA:", procesarPago("TARJETA"));
  console.log("🅿️  PAYPAL:", procesarPago("PAYPAL"));
  console.log("₿ CRIPTOMONEDA:", procesarPago("CRIPTOMONEDA"));

  // Demostración con estados de matrícula
  console.log("\nEstados de matrícula con exhaustiveness checking:");

  const matriculaActiva: EstadoMatricula = {
    tipo: "ACTIVA",
    asignaturas: [],
    fechaInicio: new Date(),
    creditosEnCurso: 0,
  };

  const matriculaSuspendida: EstadoMatricula = {
    tipo: "SUSPENDIDA",
    motivo: "Baja por enfermedad",
    fechaSuspensión: new Date(),
    duracionSemestres: 1,
  };

  const matriculaFinalizada: EstadoMatricula = {
    tipo: "FINALIZADA",
    notaMedia: 9.2,
    fechaGraduación: new Date(),
    conDistinción: true,
  };

  console.log("📚", generarReporteAlternativo(matriculaActiva));
  console.log("⏸️ ", generarReporteAlternativo(matriculaSuspendida));
  console.log("🎓", generarReporteAlternativo(matriculaFinalizada));

  console.log("\n💡 BENEFICIO: Si añades un nuevo estado a EstadoMatricula,");
  console.log("   el compilador te obligará a actualizar TODAS las funciones");
  console.log("   que manejan esta unión. ¡Prevención de bugs garantizada!\n");
}

// Ejecutar demostraciones
async function ejecutarLaboratorioCompleto() {
  await demostrarAPI();
  demostrarExhaustiveness();
}

ejecutarLaboratorioCompleto().catch(console.error);
