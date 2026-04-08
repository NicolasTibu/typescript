# Módulo 3: Ecosistemas modernos

## Tipos de utilidad (Utility Types)

TypeScript proporciona una biblioteca estándar de transformadores de tipos. Son herramientas indispensables para la refactorización y el manejo de estados inmutables.

### Partial<T>
Retorna un nuevo tipo con todas las propiedades de T marcadas como opcionales. Imprescindible para operaciones de actualización (ej. un método HTTP PATCH).

```typescript
interface Servidor { ip: string; puerto: number; estado: string; }

// Para un formulario de actualización de servidor, no necesitas todos los datos a la vez:
type DatosActualizacionServidor = Partial<Servidor>;
// Resultado: { ip?: string; puerto?: number; estado?: string; }
```

### Readonly<T>
Hace que todas las propiedades de un objeto sean inmutables, previniendo reasignaciones.

```typescript
interface Configuracion { host: string; puerto: number; }

const config: Readonly<Configuracion> = { host: "localhost", puerto: 3000 };
// config.puerto = 4000; // ❌ Error: Cannot assign to 'puerto' because it is a read-only property.
```

### Pick<T, K> y Omit<T, K>
Extraen o eliminan propiedades específicas de una interfaz para crear una nueva vista de los datos (ej. omitir contraseñas o datos sensibles de un objeto de base de datos antes de enviarlo al cliente).

```typescript
interface Usuario { id: string; nombre: string; email: string; password: string; }

// Solo las propiedades públicas
type UsuarioPublico = Omit<Usuario, "password">;
// Resultado: { id: string; nombre: string; email: string; }

// Solo el ID y nombre
type UsuarioBasico = Pick<Usuario, "id" | "nombre">;
// Resultado: { id: string; nombre: string; }
```

### Record<K, T>
Permite construir diccionarios/mapas donde las claves son del tipo K y los valores del tipo T.

```typescript
// Diccionario de traducciones
type Traducciones = Record<string, string>;
const traducciones: Traducciones = {
  "hello": "hola",
  "world": "mundo",
};

// Diccionario con claves específicas
type EstadoServidor = "activo" | "inactivo" | "mantenimiento";
type ConfigServidores = Record<EstadoServidor, string>;
const config: ConfigServidores = {
  activo: "verde",
  inactivo: "rojo",
  mantenimiento: "amarillo",
};
```

### Awaited<T>
Desenreda (unwraps) el tipo devuelto por una promesa.

```typescript
async function obtenerDatos(): Promise<string[]> {
  return ["dato1", "dato2"];
}

// Sin Awaited: Promise<string[]>
type ResultadoSinAwaited = ReturnType<typeof obtenerDatos>;

// Con Awaited: string[]
type ResultadoConAwaited = Awaited<ReturnType<typeof obtenerDatos>>;
```

### Combinación de Utility Types

```typescript
interface Servidor { ip: string; puerto: number; estado: string; }

// Para un formulario de actualización de servidor, no necesitas todos los datos a la vez:
type DatosActualizacionServidor = Partial<Omit<Servidor, "ip">>;
// El resultado es: { puerto?: number; estado?: string; }
```

Estos utility types son fundamentales para crear APIs tipadas seguras y mantener la inmutabilidad en aplicaciones modernas.