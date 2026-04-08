# Módulo 2: Modelado de datos complejo, Patrones y Genéricos

## Interfaces vs. Type Aliases

Para modelar entidades de dominio y estructuras de objetos, TypeScript ofrece dos construcciones.

### Interface
Define contratos estructurales. Se utiliza primordialmente para definir la forma de los objetos o las clases. Permiten "declaration merging" (si declaras la misma interfaz dos veces, se fusionan sus propiedades).

```typescript
interface UsuarioSistema {
  readonly id: string;      // Inmutable tras la creación
  nombreCompleto: string;
  email: string;
  fechaUltimoAcceso?: Date; // Propiedad opcional
}
```

### Type (Type Alias)
Es un alias para cualquier tipo válido en TypeScript. A diferencia de las interfaces, permite definir uniones, primitivos y tuplas.

```typescript
type UUID = string; // Alias semántico
type EstadoTransaccion = "PENDIENTE" | "PROCESANDO" | "COMPLETADA" | "RECHAZADA"; // Tipos literales
```

### Regla de Diseño
Emplea **interface** para el modelo de datos jerárquico y objetos orientados a objetos; emplea **type** para la lógica funcional, uniones y primitivos.

---

## Tipos de Unión e Intersección y Guardas de Tipo

### Unión (|)
Operador lógico OR a nivel de tipos. Una variable puede adoptar uno de los tipos especificados.

```typescript
function procesarEntrada(input: string | number) {
  if (typeof input === "string") {
    return input.trim().toUpperCase(); // Aquí TypeScript sabe que es string
  } else {
    return Math.pow(input, 2);         // Aquí TypeScript sabe que es number
  }
}
```

### Guardas de Tipo (Type Guards)
Para operar con un tipo de unión, debes "estrechar" (narrowing) el tipo en tiempo de ejecución mediante comprobaciones dinámicas: `typeof`, `instanceof` o comprobación de propiedades.

### Intersección (&)
Operador lógico AND. Combina múltiples estructuras en un solo tipo que debe cumplir todos los contratos.

```typescript
type EntidadAuditable = { creadoEn: Date; modificadoPor: string; };
type Documento = { titulo: string; contenido: string; };

type DocumentoAuditable = Documento & EntidadAuditable;
```

---

## Uniones Discriminadas (Tagged Unions)

Este es, posiblemente, el patrón de diseño más importante en TypeScript. Basado en el ítem 28 del libro "Effective TypeScript" ("Prefiere código que represente estados válidos"), una unión discriminada utiliza una propiedad literal compartida (el "discriminante") para que TypeScript pueda estrechar el tipo de forma 100% segura. Es el estándar de la industria para manejar respuestas de red o estados de interfaces de usuario.

```typescript
// En lugar de tener propiedades opcionales ambiguas, separamos los estados reales:
interface CargaPendiente { estado: "PENDIENTE"; }
interface CargaExitosa { estado: "EXITO"; datos: string[]; }
interface CargaFallida { estado: "ERROR"; codigoHttp: number; mensaje: string; }

type EstadoPeticion = CargaPendiente | CargaExitosa | CargaFallida;

function procesarPeticion(peticion: EstadoPeticion) {
  // TypeScript utiliza la propiedad 'estado' como discriminante
  if (peticion.estado === "EXITO") {
    // Aquí TypeScript sabe al 100% que 'datos' existe.
    console.log(peticion.datos.length); 
  } else if (peticion.estado === "ERROR") {
    // Aquí sabe que 'codigoHttp' existe.
    console.warn(`Fallo con código ${peticion.codigoHttp}`);
  }
}
```

---

## Análisis Exhaustivo (Exhaustiveness Checking) con el Tipo Never

Conectando con las Uniones Discriminadas vistas anteriormente, el tipo `never` es la herramienta definitiva para asegurar que tu código escala sin romperse en el futuro. Si añades un nuevo estado a una unión, quieres que el compilador te obligue a actualizar todas las funciones que evalúan esa unión.

```typescript
type MetodoPago = "TARJETA" | "PAYPAL" | "CRIPTOMONEDA"; // Imaginemos que añadimos "CRIPTOMONEDA" hoy

function procesarPago(metodo: MetodoPago) {
  switch (metodo) {
    case "TARJETA":
      return "Conectando con Stripe...";
    case "PAYPAL":
      return "Redirigiendo a PayPal...";
    // Si olvidamos manejar "CRIPTOMONEDA", el bloque 'default' capturará el valor.
    default:
      // Asignar el valor no manejado a una variable tipo 'never' forzará un ERROR EN TIEMPO DE COMPILACIÓN.
      const comprobacionExhaustiva: never = metodo; 
      // ^ Error: Type 'string' is not assignable to type 'never'.
      throw new Error(`Método no manejado: ${comprobacionExhaustiva}`);
  }
}
```

### ¿Por qué es importante?

1. **Prevención de Bugs**: Garantiza que todos los casos posibles estén manejados
2. **Refactorización Segura**: Al añadir nuevos estados, el compilador te obliga a actualizar el código
3. **Mantenibilidad**: El código se mantiene consistente cuando escala
4. **Type Safety Máxima**: No hay caminos no manejados en runtime

### En Uniones Discriminadas

```typescript
type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case "ACTIVA":
      return `✅ Matrícula Activa...`;
    case "SUSPENDIDA":
      return `⏸️  Matrícula Suspendida...`;
    case "FINALIZADA":
      return `🎓 Matrícula Finalizada...`;
    default:
      // Si añades MatriculaCancelada, esto fallará en compilación
      const _exhaustivo: never = estado;
      throw new Error(`Estado no manejado: ${JSON.stringify(_exhaustivo)}`);
  }
}
```

### Función Auxiliar para Exhaustiveness

```typescript
function asegurarExhaustivo(valor: never): never {
  throw new Error(`Valor inesperado: ${JSON.stringify(valor)}`);
}

// Uso más limpio
function procesarPago(metodo: MetodoPago): string {
  switch (metodo) {
    case "TARJETA": return "Stripe...";
    case "PAYPAL": return "PayPal...";
    case "CRIPTOMONEDA": return "Blockchain...";
    default: return asegurarExhaustivo(metodo);
  }
}
```

---

## Tipado Estructural y Comprobación de Exceso de Propiedades

El tipado estructural dicta que si un objeto tiene al menos las propiedades requeridas, es válido. Sin embargo, TypeScript tiene una excepción estricta para atrapar errores ortográficos al asignar literales de objetos.

```typescript
interface PuntoGeografico { latitud: number; longitud: number; }

// ❌ Error: TypeScript hace una comprobación de "exceso de propiedades" en literales nuevos.
// Se da cuenta de que 'altitud' no está en el contrato de PuntoGeografico.
const miPunto: PuntoGeografico = { latitud: 40.4, longitud: -3.7, altitud: 600 }; 

// ✅ Válido: Si el objeto pasa por una variable intermedia, TypeScript vuelve al "Duck Typing" puro.
const puntoConAltitud = { latitud: 40.4, longitud: -3.7, altitud: 600 };
const miPuntoAsignado: PuntoGeografico = puntoConAltitud; // Compila sin error
```

---

## Enums: Enumeraciones con Nombre

Útiles para definir diccionarios cerrados de constantes. Sin embargo, en arquitecturas modernas, a menudo se prefieren los type aliases de literales por ser más limpios en su transpilación.

```typescript
enum NivelAcceso {
  Invitado = "GUEST",
  Usuario = "USER",
  Administrador = "ADMIN"
}
// Uso: let permiso = NivelAcceso.Administrador;
```

---

## Programación Genérica (<T>)

Los genéricos son fundamentales en la ingeniería de software para crear componentes reutilizables sin sacrificar la seguridad de tipos. Permiten parametrizar los tipos.

Imagina una estructura de datos tipo pila (stack) o una respuesta estándar de una API.

```typescript
// La <T> representa una variable de tipo que se definirá al instanciar.
interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;          // El payload dependerá del contexto
  errores?: string[];
}

// Implementación con una interfaz concreta
interface Cliente { id: number; empresa: string; }

const respuestaCliente: RespuestaAPI<Cliente> = {
  codigoEstado: 200,
  exito: true,
  datos: { id: 104, empresa: "TechCorp" }
};
```

### Restricciones Genéricas

Puedes obligar a que el genérico `T` cumpla con ciertos requisitos usando `extends`. Por ejemplo: `function procesar<T extends { id: string }>(item: T)`.

