# Documentación de Arquitectura - Módulo 2

## Laboratorio Práctico: Sistema de Gestión Universitario

### 1. Modelado del Dominio

#### Estructura de Carpetas
```
src/
├── domain/
│   └── types/
│       ├── entidades.ts      # Interfaces Estudiante, Asignatura, RespuestaAPI
│       └── matricula.ts       # Unión Discriminada EstadoMatricula
├── services/
│   └── api-client.ts         # Cliente genérico de API
└── index.ts                   # Punto de entrada
```

#### Entidades Principales

##### 1.1 **Interfaz `Asignatura`**

```typescript
interface Asignatura {
  readonly id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  docente: string;
}
```

**Decisiones de diseño:**
- `readonly id`: Garantiza inmutabilidad del identificador tras la creación. Previene errores de modificación accidental.
- **Interface sobre Type Alias**: Es una estructura OOP que será implementada por clases en módulos posteriores.
- **Propiedades específicas**: Cada atributo es esencial para el currículo académico.

##### 1.2 **Interfaz `Estudiante`**

```typescript
interface Estudiante {
  readonly id: string;
  nombreCompleto: string;
  email: string;
  fechaNacimiento: Date;
  carrera: string;
  activo: boolean;
}
```

**Decisiones de diseño:**
- `readonly id`: Carné estudiantil inmutable.
- `activo: boolean`: Permite queries rápidas sin consultar el estado de matrícula.
- Propiedad `carrera`: Texto, no una referencia a una entidad. Simplifica consultas comunes.

---

### 2. Unión Discriminada: `EstadoMatricula`

Este es el patrón más importante del módulo. Define tres estados excluyentes usando un discriminante (`tipo`).

#### 2.1 Estados Definidos

```typescript
type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;
```

| Estado | Discriminante | Propiedades Exclusivas | Caso de Uso |
|--------|---------------|----------------------|-----------|
| **MatriculaActiva** | `tipo: "ACTIVA"` | `asignaturas`, `creditosEnCurso` | Estudiante inscrito actualmente |
| **MatriculaSuspendida** | `tipo: "SUSPENDIDA"` | `motivo`, `duracionSemestres` | Pausa temporal (baja/incapacidad) |
| **MatriculaFinalizada** | `tipo: "FINALIZADA"` | `notaMedia`, `conDistinción` | Egresado exitoso |

#### 2.2 ¿Por qué Unión Discriminada?

Sin discriminantes, tendríamos propiedades opcionales ambiguas:

```typescript
// ❌ ANTI-PATRÓN: Propiedades opcionales sin claridad
interface MatriculaAntigua {
  estado: "ACTIVA" | "SUSPENDIDA" | "FINALIZADA";
  asignaturas?: Asignatura[];        // ¿Cuándo obligatorio?
  motivo?: string;                    // ¿Cuándo obligatorio?
  notaMedia?: number;                 // ¿Cuándo obligatorio?
}

// Lógica desordenada:
if (matricula.notaMedia) { /* assume finalizada */ }  // Error proclive
```

Con discriminantes, **TypeScript hace narrowing automático**:

```typescript
// ✅ CORRECTO: Discriminante + Type Guard
function procesar(estado: EstadoMatricula) {
  if (estado.tipo === "ACTIVA") {
    // TypeScript garantiza: estado.asignaturas existe
    console.log(estado.asignaturas.length);
    // estado.notaMedia ❌ no existe (compile error)
  }
}
```

#### 2.3 Función `generarReporte()`

Demuestra exhaustiveness checking: el compilador obliga a manejar todos los casos.

```typescript
function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case "ACTIVA":
      return `✅ Matrícula Activa: ${estado.asignaturas.length} asignatura(s)...`;
    case "SUSPENDIDA":
      return `⏸️  Suspendida: ${estado.motivo}...`;
    case "FINALIZADA":
      return `🎓 Finalizada. Nota Media: ${estado.notaMedia}...`;
    // Si agregas un nuevo caso a EstadoMatricula, TypeScript obligará
    // a que agregues un case aquí. ← Esta es la magia del type system.
    default:
      const _exhaustivo: never = estado; // Compile error si falta un caso
      return _exhaustivo;
  }
}
```

---

### 3. Cliente API Genérico

#### 3.1 Interfaz `RespuestaAPI<T>`

```typescript
interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;                    // ← El genérico T
  errores?: string[];
  timestamp?: Date;
}
```

**¿Por qué es genérica?**
- El payload (`datos`) varía según el endpoint.
- `obtenerEstudiantes()` retorna `RespuestaAPI<Estudiante[]>`
- `obtenerAsignatura(id)` retorna `RespuestaAPI<Asignatura>`
- Una única interfaz, múltiples tipos seguros.

#### 3.2 Método Genérico `obtenerRecurso<T>()`

```typescript
export async function obtenerRecurso<T>(endpoint: string): Promise<RespuestaAPI<T>> {
  // Simula latencia de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const datos = baseDatos[endpoint] as T | undefined;

  if (!datos) {
    return {
      codigoEstado: 404,
      exito: false,
      datos: null as unknown as T,
      errores: [`El endpoint ${endpoint} no existe`],
      timestamp: new Date(),
    };
  }

  return {
    codigoEstado: 200,
    exito: true,
    datos: datos as T,
    timestamp: new Date(),
  };
}
```

**Decisiones de diseño:**
- **Genérico `<T>`**: Reutilizable para cualquier tipo.
- **Promesa**: Simula la naturaleza asíncrona de llamadas reales.
- **Validación integrada**: Retorna `codigoEstado: 404` si falla.

#### 3.3 Restricciones Genéricas: `obtenerRecursoPorId<T extends { id: string }>()`

No todos los tipos son válidos. Limitar a `T extends { id: string }` garantiza:

```typescript
export async function obtenerRecursoPorId<T extends { id: string }>(
  endpoint: string,
  id: string
): Promise<RespuestaAPI<T>> {
  // Ahora sabemos que T tiene una propiedad id
  const todos = baseDatos[endpoint] as T[];
  const recurso = todos.find((item) => item.id === id);
  // ...
}

// USO:
obtenerRecursoPorId<Estudiante>("/api/estudiantes", "EST-001"); // ✅ Válido
obtenerRecursoPorId<string>("/api/nombres", "x"); // ❌ Compile error: string no tiene id
```

---

### 4. Principios Aplicados

| Principio | Aplicación | Beneficio |
|-----------|-----------|----------|
| **Inmutabilidad** | `readonly id` | Previene bugs de estado compartido |
| **Tipos Exhaustivos** | Uniones discriminadas | Fuerce manejar todos los casos |
| **Genéricos** | `RespuestaAPI<T>` | Reutilizable, sin duplicación |
| **Restricciones** | `T extends { id }` | Previene misuso en compilación |
| **Tipado Estructural** | Interfaces sin classes | Flexible, enfocado en contratos |

---

### 5. Extensiones Futuras (Módulo 3)

- **Validación en runtime**: Usar `zod` o `io-ts` para validar respuestas del servidor.
- **Manejo de errores**: Mejorar `generarReporte()` con patrones Result<T, E>.
- **Caching**: Decoradores para cachear respuestas.
- **Interceptores**: Logging, autenticación, reintentos automáticos.

---

**Conclusión**: Este laboratorio demuestra cómo TypeScript permite modelar dominios complejos de forma **segura, reutilizable y explícita**, evitando trampas comunes en JavaScript dinámico.
