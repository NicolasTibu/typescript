# Laboratorio Práctico 2: Arquitectura de Acceso a Datos + Exhaustiveness Checking

## Descripción

Sistema de gestión universitario que demuestra los conceptos principales del Módulo 2 de TypeScript:

✅ Modelado de entidades con `readonly` para inmutabilidad  
✅ Uniones Discriminadas (Tagged Unions) para estados seguros  
✅ Programación Genérica con restricciones  
✅ Cliente API genérico con promesas tipadas  
✅ **Análisis Exhaustivo (Exhaustiveness Checking) con `never`**  

## Estructura de Archivos

```
src/
├── domain/types/
│   ├── index.ts           # Índice de exportaciones
│   ├── entidades.ts       # Interfaces: Asignatura, Estudiante, RespuestaAPI<T>
│   └── matricula.ts       # Unión discriminada: EstadoMatricula + generarReporte()
├── services/
│   └── api-client.ts      # Cliente genérico: obtenerRecurso<T>(), etc.
└── laboratorio.ts         # Demostración completa (punto de entrada)

docs/
└── arquitectura/
    └── modelo-datos.md    # Documentación detallada de decisiones
```

## Conceptos Demostrados

### 1. **Modelado de Entidades**

**Archivo**: `src/domain/types/entidades.ts`

Dos interfaces principales:

```typescript
interface Asignatura {
  readonly id: string;     // Inmutable
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  docente: string;
}

interface Estudiante {
  readonly id: string;     // Carné inmutable
  nombreCompleto: string;
  email: string;
  // ...
}
```

**Por qué `readonly id`?**
- Previene modificaciones accidentales
- Garantiza que el Id nunca cambie
- Mejora el análisis de flujo de datos

### 2. **Unión Discriminada: EstadoMatricula**

**Archivo**: `src/domain/types/matricula.ts`

```typescript
type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;
```

Cada estado tiene una propiedad `tipo` única (discriminante):

| Estado | Discriminante | Propiedades Específicas |
|--------|---------------|----------------------|
| ACTIVA | `tipo: "ACTIVA"` | `asignaturas`, `creditosEnCurso` |
| SUSPENDIDA | `tipo: "SUSPENDIDA"` | `motivo`, `duracionSemestres` |
| FINALIZADA | `tipo: "FINALIZADA"` | `notaMedia`, `conDistinción` |

**Función `generarReporte(estado)`**:

```typescript
function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case "ACTIVA":
      // TypeScript garantiza: estado.asignaturas existe
      return `✅ Matrícula Activa: ${estado.asignaturas.length}...`;
    case "SUSPENDIDA":
      return `⏸️  Suspendida: ${estado.motivo}...`;
    case "FINALIZADA":
      return `🎓 Finalizada. Nota Media: ${estado.notaMedia}...`;
  }
}
```

### 3. **Programación Genérica**

**Archivo**: `src/services/api-client.ts`

Interfaz genérica de respuesta:

```typescript
interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;                // ← El genérico
  errores?: string[];
}
```

Método genérico:

```typescript
export async function obtenerRecurso<T>(endpoint: string): Promise<RespuestaAPI<T>> {
  // Simula latencia de red
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const datos = baseDatos[endpoint] as T | undefined;
  
  return datos
    ? { codigoEstado: 200, exito: true, datos }
    : { codigoEstado: 404, exito: false, datos: null as T, errores: [...] };
}
```

**Uso**:

```typescript
// Obtener lista de estudiantes
const resp = await obtenerRecurso<Estudiante[]>("/api/estudiantes");

// Obtener una sola asignatura
const resp = await obtenerRecurso<Asignatura>("/api/asignatura/1");
```

### 4. **Restricciones Genéricas**

```typescript
async function obtenerRecursoPorId<T extends { id: string }>(
  endpoint: string,
  id: string
): Promise<RespuestaAPI<T>> {
  // Ahora sabemos que T siempre tiene la propiedad 'id'
  const todos = baseDatos[endpoint] as T[];
  return todos.find(item => item.id === id);
}
```

### 4. **Análisis Exhaustivo (Exhaustiveness Checking) con Never**

**Archivo**: `src/domain/types/matricula.ts`

El tipo `never` garantiza que **TODOS** los casos de una unión estén manejados. Si añades un nuevo estado, el compilador te obliga a actualizar el código.

```typescript
type MetodoPago = "TARJETA" | "PAYPAL" | "CRIPTOMONEDA";

function procesarPago(metodo: MetodoPago): string {
  switch (metodo) {
    case "TARJETA":
      return "Conectando con Stripe...";
    case "PAYPAL":
      return "Redirigiendo a PayPal...";
    case "CRIPTOMONEDA":
      return "Procesando blockchain...";
    default:
      // Si olvidas un caso, esto causa ERROR DE COMPILACIÓN
      const comprobacionExhaustiva: never = metodo;
      throw new Error(`Método no manejado: ${comprobacionExhaustiva}`);
  }
}
```

**Beneficios**:
- ✅ **Prevención de bugs**: Todos los casos deben estar manejados
- 🔄 **Escalabilidad**: Añadir nuevos estados requiere actualizar todo el código dependiente
- 🛡️ **Type Safety**: No hay caminos no manejados en runtime
- 📈 **Mantenibilidad**: El código se mantiene consistente al escalar

## Cómo Ejecutar

### Compilar el código

```bash
npm run build
# o
tsc
```

### Ejecutar el laboratorio

```bash
npx ts-node src/laboratorio.ts
```

### Salida esperada

```
============================================================
LABORATORIO PRÁCTICO 2: ARQUITECTURA DE ACCESO A DATOS
Sistema de Gestión Universitario
============================================================

📚 PARTE 1: MODELADO DE ENTIDADES

Estudiante registrado: { id: 'EST-001', nombreCompleto: 'María García López', ... }
ID inmutable: EST-001

🎓 PARTE 2: ESTADOS DE MATRÍCULA

Estado 1 - Matrícula Activa:
✅ Matrícula Activa: 2 asignatura(s) en curso, 12 créditos.

Estado 2 - Matrícula Suspendida:
⏸️  Matrícula Suspendida: Baja voluntaria por problemas de salud. Duración: 2 semestre(s).

Estado 3 - Matrícula Finalizada:
🎓 Matrícula Finalizada con Distinción. Nota Media: 8.50.

🌐 PARTE 3: CLIENTE API GENÉRICO

Haciendo llamadas a la API simulada...

1. Obteniendo lista de estudiantes:
Status: 200
Éxito: true
Estudiantes: 2

...
```

## Extensiones Futuras (Módulo 3)

- [ ] Validación en runtime con `zod` o `io-ts`
- [ ] Manejo de errores con patrón `Result<T, E>`
- [ ] Caching de respuestas
- [ ] Interceptores para logging/autenticación
- [ ] Decoradores para operaciones comunes

## Lectura Recomendada

- **Effective TypeScript**, Item 28: "Prefer Code That Reflects Reality"
- **TypeScript Handbook**: Advanced Types → Tagged Unions

## Documentación Completa

Ver [docs/arquitectura/modelo-datos.md](../arquitectura/modelo-datos.md) para una explicación detallada de todas las decisiones de diseño.
