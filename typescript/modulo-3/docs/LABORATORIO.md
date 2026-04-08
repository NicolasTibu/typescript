# Laboratorio Práctico 3: Utility Types en Acción

## Sistema de Gestión de Tareas

Este laboratorio demuestra el uso práctico de **Utility Types** en un sistema real de gestión de tareas, mostrando cómo estos tipos transforman la forma de escribir código TypeScript seguro y mantenible.

## Arquitectura

```
src/
├── domain/
│   └── utility-types.ts    # Re-exportaciones y tipos personalizados
├── laboratorio.ts          # Demostración completa del sistema
└── index.ts                # Ejemplos básicos de utility types
```

## Utility Types en Acción

### 1. **Partial<T>** - Actualizaciones Parciales

```typescript
type ActualizacionTarea = Partial<Omit<Tarea, "id" | "fechaCreacion">>;
```

**Caso de uso**: Permite actualizar solo algunos campos de una tarea sin requerir todos los datos.

```typescript
servicio.actualizarTarea("task-001", {
  estado: "completada",
  prioridad: "urgente",
  // No necesito enviar todos los campos
});
```

### 2. **Pick<T, K>** y **Omit<T, K>** - Vistas Específicas

```typescript
type VistaTareaBasica = Pick<Tarea, "id" | "titulo" | "estado" | "prioridad">;
type VistaTareaPublica = Omit<Tarea, "asignadoA">;
```

**Caso de uso**: Crear diferentes vistas de los datos según el contexto.

- **Vista básica**: Para listados rápidos
- **Vista pública**: Para APIs públicas (sin datos sensibles)

### 3. **Record<K, T>** - Diccionarios Tipados

```typescript
type EstadisticasPorEstado = Record<EstadoTarea, number>;
type ConfiguracionEstados = Record<EstadoTarea, { color: string; icono: string }>;
type TareasPorUsuario = Record<string, Tarea[]>;
```

**Caso de uso**: Estructuras de datos complejas con claves tipadas.

### 4. **Readonly<T>** - Inmutabilidad

```typescript
type TareaInmutable = Readonly<Tarea>;
```

**Caso de uso**: Garantizar que ciertos objetos no puedan modificarse después de su creación.

### 5. **Awaited<T>** - Promesas Desenredadas

```typescript
async function obtenerTareaAsync(id: string): Promise<TareaInmutable | null> {
  // ...
}

const tarea: Awaited<ReturnType<typeof obtenerTareaAsync>> = await obtenerTareaAsync("id");
```

**Caso de uso**: Trabajar con el tipo real devuelto por una promesa, no con la promesa misma.

## Beneficios de los Utility Types

### 🔒 **Seguridad de Tipos**
- Previenen errores en tiempo de compilación
- Garantizan contratos de datos consistentes
- Reducen bugs relacionados con tipos

### 🔄 **Reutilización**
- Tipos genéricos reutilizables
- Composición de tipos complejos
- DRY (Don't Repeat Yourself) en definiciones de tipos

### 📦 **Mantenibilidad**
- Cambios en interfaces se propagan automáticamente
- Refactorización segura
- Documentación implícita en tipos

### 🚀 **Productividad**
- IntelliSense mejorado
- Menos código boilerplate
- APIs más expresivas

## Ejecutar el Laboratorio

```bash
# Compilar
npm run build

# Ejecutar laboratorio
node dist/laboratorio.js
```

## Salida Esperada

```
=======================================================================
LABORATORIO PRÁCTICO 3: UTILITY TYPES EN ACCIÓN
Sistema de Gestión de Tareas
=======================================================================

1️⃣ PARTIAL<T> - Actualización parcial de tareas

Antes de actualizar:
{ id: 'task-001', titulo: 'Implementar autenticación', estado: 'en_progreso', prioridad: 'alta' }

Después de actualizar (solo estado y prioridad):
{ id: 'task-001', titulo: 'Implementar autenticación', estado: 'completada', prioridad: 'urgente' }
Actualización exitosa: true

2️⃣ PICK<T, K> y OMIT<T, K> - Vistas específicas
...
```

## Extensiones Futuras

- [ ] **Required<T>**: Hacer propiedades requeridas
- [ ] **Exclude<T, U>**: Excluir tipos de una unión
- [ ] **Extract<T, U>**: Extraer tipos de una unión
- [ ] **NonNullable<T>**: Excluir null y undefined
- [ ] Utility types personalizados para casos específicos

## Lectura Recomendada

- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Effective TypeScript - Item 31: Push Null Values to the Perimeter](https://effectivetypescript.com/)
- [Advanced TypeScript Patterns](https://github.com/antonioru/advanced-typescript-patterns)