# Laboratorio 3: Desarrollo de UI Estricta y Documentación Final

## 📋 Project Overview

Este proyecto demuestra patrones avanzados de TypeScript aplicados a React:

- **DataTable<T>**: Componente genérico fuertemente tipado
- **Exhaustiveness Checking**: Validación de uniones discriminadas con `never`
- **Utility Types**: Uso de `Partial<T>` para edición de datos
- **Integración de librerías externas**: date-fns con tipos estrictos
- **Type Safety**: Garantía de tipos en tiempo de compilación

## 🏗️ Estructura del Proyecto

```
react/
├── src/
│   ├── types/
│   │   └── index.ts              # Tipos centrales: Usuario, Producto, AccionTabla
│   ├── utils/
│   │   └── dateDifference.ts     # Función utilitaria con date-fns
│   ├── components/
│   │   └── DataTable.tsx         # Componente genérico con reductor
│   ├── App.tsx                   # Aplicación principal
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Estilos globales
├── docs/
│   ├── README.md                 # Este archivo
│   ├── LABORATORIO.md            # Guía del laboratorio
│   └── arquitectura-final.md     # Análisis arquitectónico
├── package.json                  # Dependencias
├── tsconfig.json                 # Configuración TypeScript strict
├── vite.config.ts                # Configuración de Vite
└── index.html                    # HTML raíz
```

## 🔧 Características Principales

### 1. **DataTable<T> Genérico**

```typescript
// Componente reutilizable para cualquier tipo T
<DataTable<Usuario>
  datos={usuarios}
  columnas={columnasUsuarios}
  titulo="📋 Tabla de Usuarios"
  permiteEdicion={true}
  onGuardar={handleGuardar}
  onEliminar={handleEliminar}
/>
```

**Características:**
- Genérico con constraint: `T extends Record<string, any>`
- Sistema de tipos para columnas: `ConfiguracionColumna<T>`
- Props discriminadas con uniones tipadas
- Reductor con exhaustiveness checking

### 2. **Análisis Exhaustivo en Reductor**

```typescript
function reductorEdicion<T>(estado, accion: AccionTabla<T>) {
  switch (accion.tipo) {
    case "EDITAR":
      return { /* ... */ };
    case "CANCELAR_EDICION":
      return { /* ... */ };
    case "GUARDAR_EDICION":
      return { /* ... */ };
    case "ELIMINAR":
      return { /* ... */ };
    default:
      const _agotado: never = accion;  // Exhaustiveness checking
      throw new Error(`Acción no manejada: ${JSON.stringify(_agotado)}`);
  }
}
```

**Beneficio:** Si añades un nuevo case a `AccionTabla`, el compilador forzará actualizar esta función.

### 3. **Partial<T> para Edición**

```typescript
interface EstadoEdicion<T> {
  habilitado: boolean;
  filaEnEdicion: number | null;
  datosTemporales: Partial<T>;  // ✅ Solo propiedades necesarias
}
```

**Ventaja:** El usuario puede editar solo algunos campos, no todos a la vez.

### 4. **Función Utilitaria: Diferencia de Fechas**

```typescript
export type ResultadoDiferencia = 
  | { tipo: "EXITO"; dias: number; /* ... */ }
  | { tipo: "ERROR"; mensaje: string };

export function calcularDiferenciaDias(
  fechaInicio: Date,
  fechaFin: Date
): ResultadoDiferencia {
  // Validación estricta con types
  if (!(fechaInicio instanceof Date)) {
    return { tipo: "ERROR", mensaje: "..." };
  }
  // ...
}
```

**Características:**
- Discriminated union para manejo de errores
- Integración con date-fns
- Tipos de entrada y salida estrictos
- Sin `any` en ningún lugar

## 📦 Instalación y Uso

### Instalación de dependencias

```bash
cd "C:\Corner Studios\typescript\react"
npm install
```

### Compilación sin errores

```bash
# Verificar tipos sin compilar
npm run type-check
# Salida esperada: 0 errores

# O manualmente:
npx tsc --noEmit
```

### Desarrollo

```bash
npm run dev
# Abre http://localhost:3000
```

### Build para producción

```bash
npm run build
```

## 🧬 Patrones TypeScript Avanzados

### 1. **keyof para Claves de Tipo**

```typescript
interface ConfiguracionColumna<T> {
  clave: keyof T;  // ✅ Solo claves válidas de T
  etiqueta: string;
}

// ✅ Correcto
columnas.push({ clave: 'nombre', etiqueta: 'Nombre' });

// ❌ Error en compilación
columnas.push({ clave: 'nombreInvalido', etiqueta: '...' });
```

### 2. **Genéricos con Constraints**

```typescript
export function DataTable<T extends Record<string, any>>(
  { datos, columnas }: PropsDataTable<T>
) {
  // T debe ser un objeto con propiedades
}
```

### 3. **Discriminated Unions**

```typescript
type AccionTabla<T> = 
  | { tipo: "EDITAR"; fila: number; datos: T }
  | { tipo: "ELIMINAR"; fila: number }
  | { tipo: "GUARDAR_EDICION"; datos: Partial<T> };

// TypeScript hace narrowing automático en switch
```

### 4. **Generic Utility Types**

```typescript
export type ResultadoOperacion<T> = 
  | { estado: "exito"; datos: T }
  | { estado: "error"; error: Error };
```

## 🎯 Ventajas sobre JavaScript Puro

| Característica | JavaScript | TypeScript |
|---|---|---|
| Validación de tipos | ❌ Runtime | ✅ Compilación |
| Autocomplete | ⚠️ Limitado | ✅ Completo |
| Refactorización | ⚠️ Riesgosa | ✅ Segura |
| Props de componentes | ❌ Sin validación | ✅ Tipado |
| Genéricos | ❌ No disponible | ✅ Poderoso |
| Errores tempranos | ⚠️ En producción | ✅ En desarrollo |

## 📊 Análisis de Reducción de Bugs

Ver [arquitectura-final.md](./arquitectura-final.md) para un análisis detallado de cómo los tipos han reducido la carga de errores en tiempo de ejecución.

## 🚀 Próximos Pasos

1. Agregar validación de datos con `zod` o `io-ts`
2. Implementar paginación tipada
3. Añadir sorting y filtering con tipos
4. Integrar Redux con TypeScript
5. Agregar tests con Jest + @types/jest

## 📚 Referencias

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript patterns](https://react-typescript-cheatsheet.netlify.app/)
- [date-fns documentation](https://date-fns.org/)
- [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

---

**Laboratorio 3 - TypeScript Avanzado**
Desarrollado: Abril 2026
