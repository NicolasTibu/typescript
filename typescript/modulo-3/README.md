# Módulo 3: Ecosistemas Modernos

## Tipos de utilidad (Utility Types)

Este módulo explora los **Utility Types** de TypeScript, herramientas esenciales para crear código tipado seguro, reutilizable y mantenible en aplicaciones modernas.

### ¿Qué son los Utility Types?

Los Utility Types son **transformadores de tipos** que permiten crear nuevos tipos basados en tipos existentes. Son la base de las APIs tipadas modernas y el manejo de estados inmutables.

### Utility Types Principales

| Utility Type | Descripción | Caso de Uso |
|-------------|-------------|-------------|
| `Partial<T>` | Todas las propiedades opcionales | Actualizaciones parciales (PATCH) |
| `Readonly<T>` | Todas las propiedades inmutables | Datos que no deben modificarse |
| `Pick<T, K>` | Seleccionar propiedades específicas | Vistas limitadas de datos |
| `Omit<T, K>` | Eliminar propiedades específicas | Ocultar datos sensibles |
| `Record<K, T>` | Diccionarios/mapas tipados | Configuraciones, estadísticas |
| `Awaited<T>` | Tipo desenredado de promesa | Trabajo con async/await |

### Ejemplo Práctico

```typescript
interface Servidor {
  ip: string;
  puerto: number;
  estado: string;
}

// Para actualizaciones parciales
type DatosActualizacion = Partial<Omit<Servidor, "ip">>;
// Resultado: { puerto?: number; estado?: string; }
```

## Estructura del Módulo

```
modulo-3/
├── src/
│   ├── domain/
│   │   └── utility-types.ts    # Re-exportaciones y tipos avanzados
│   ├── index.ts                # Ejemplos básicos de utility types
│   └── laboratorio.ts          # Sistema de gestión de tareas completo
├── docs/
│   ├── README.md               # Documentación teórica
│   └── LABORATORIO.md          # Guía del laboratorio práctico
├── package.json
└── tsconfig.json
```

## Cómo Usar

### 1. Instalar dependencias
```bash
cd modulo-3
npm install
```

### 2. Compilar
```bash
npm run build
```

### 3. Ejecutar ejemplos básicos
```bash
node dist/index.js
```

### 4. Ejecutar laboratorio completo
```bash
node dist/laboratorio.js
```

## Conceptos Clave

### 🔄 **Transformación de Tipos**
Los utility types transforman tipos existentes sin crear nuevos objetos en runtime.

### 🔒 **Inmutabilidad**
`Readonly<T>` previene modificaciones accidentales, crucial para estado global.

### 📦 **Composición**
Los utility types se pueden combinar: `Partial<Pick<T, K>>`.

### 🚀 **Productividad**
Reducen código boilerplate y mejoran la mantenibilidad.

## Próximos Pasos

Después de dominar los utility types básicos, explora:

- **Conditional Types** (`T extends U ? X : Y`)
- **Template Literal Types** (tipos basados en strings)
- **Mapped Types** (transformaciones avanzadas)
- **Utility Types personalizados**

## Recursos

- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Utility Types en GitHub](https://github.com/piotrwitek/utility-types)
- [Effective TypeScript](https://effectivetypescript.com/)