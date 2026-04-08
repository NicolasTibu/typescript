# Módulo 4: React + TypeScript

## Introducción e Integración con React

Este módulo cubre la integración de TypeScript con React, una de las combinaciones más poderosas en desarrollo web moderno.

### ¿Por qué React + TypeScript?

- ✅ **Seguridad de Tipos**: El compilador detecta errores antes de runtime
- ✅ **Props Tipadas**: Asegura que pasas los datos correctos a componentes
- ✅ **Hooks Tipados**: Autocompletado y validación de estado
- ✅ **Componentes Genéricos**: Reutilización sin perder seguridad
- ✅ **Mejor IDE**: IntelliSense completo
- ✅ **Refactorización Segura**: Cambiar tipos no rompe el app silenciosamente

## Paso 1: Crear un Proyecto React + TypeScript

### Con Vite (Recomendado - más rápido)

```bash
npm create vite@latest mi-proyecto-ui -- --template react-ts
cd mi-proyecto-ui
npm install
npm run dev
```

### Con Create React App

```bash
npx create-react-app mi-proyecto-ui --template typescript
cd mi-proyecto-ui
npm start
```

## Paso 2: Extensión .tsx

Los componentes React usan `.tsx`:
- `.ts` → TypeScript puro
- `.tsx` → TypeScript + JSX (componentes React)

```tsx
// ✅ Correcto: componente.tsx
import React from 'react';

interface Props {
  nombre: string;
}

export const MiComponente: React.FC<Props> = ({ nombre }) => {
  return <h1>Hola {nombre}</h1>;
};
```

## Paso 3: Tipado de Props

Define un contrato estricto para las props:

```typescript
interface BotonProps {
  texto: string;
  onClick: () => void;
  color?: "rojo" | "azul" | "verde";
  deshabilitado?: boolean;
}

export const Boton: React.FC<BotonProps> = ({
  texto,
  onClick,
  color = "azul",
  deshabilitado = false,
}) => (
  <button
    onClick={onClick}
    disabled={deshabilitado}
    style={{ background: color }}
  >
    {texto}
  </button>
);

// USO:
<Boton texto="Presiona" onClick={() => alert("Hola")} />  // ✅
<Boton text="Error" />  // ❌ Error: prop es "texto", no "text"
```

## Paso 4: Tipado de Hooks

```typescript
import { useState, useEffect } from 'react';

interface Usuario {
  id: string;
  nombre: string;
}

// useState con tipado explícito
const [usuario, setUsuario] = useState<Usuario | null>(null);
const [cargando, setCargando] = useState(false);

// useEffect con callbacks
useEffect(() => {
  const cargar = async () => {
    setCargando(true);
    // Lógica de carga tipada
  };
  cargar();
}, []);
```

## Paso 5: Componentes Genéricos

```typescript
interface ListaProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function Lista<T extends { id: string | number }>({
  items,
  renderItem,
}: ListaProps<T>) {
  return <ul>
    {items.map(item => (
      <li key={item.id}>{renderItem(item)}</li>
    ))}
  </ul>;
}

// Reutilizable:
<Lista<Usuario> items={usuarios} renderItem={u => u.nombre} />
<Lista<Producto> items={productos} renderItem={p => p.titulo} />
```

## Paso 6: Archivos .d.ts para Librerías Terceros

Si usas librerías sin tipos, instala definiciones:

```bash
npm install --save-dev @types/express @types/lodash @types/node
```

O crea tu propio `.d.ts`:

```typescript
// types/libreria-customizada.d.ts
declare module 'mi-libreria' {
  export function procesar(datos: string[]): Promise<string>;
  
  export interface Config {
    host: string;
    puerto: number;
  }
}
```

## Estructura de Proyecto Recomendada

```
src/
├── types/
│   ├── index.ts              # Interfaces compartidas
│   └── api.d.ts              # Definiciones de API
├── components/
│   ├── Layout.tsx            # Componentes de layout
│   ├── Boton.tsx
│   └── Modal.tsx
├── hooks/
│   ├── useUsuario.ts         # Hooks personalizados
│   └── useAPI.ts
├── services/
│   └── api.ts                # Lógica de llamadas
├── App.tsx                   # Componente raíz
├── main.tsx                  # Entry point
└── index.css
```

## Configuración tsconfig.json para React

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strict": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

## Ejemplo Completo: Aplicación de Usuarios

Ver `src/App.tsx` en este módulo para una aplicación completa que integra:
- Componentes tipados
- Hooks personalizados
- Gestión de estado
- Manejo de errores
- Tipos compartidos

## Archivos de Este Módulo

| Archivo | Descripción |
|---------|-------------|
| `src/types/index.ts` | Interfaces: Usuario, Servidor, RespuestaAPI<T> |
| `src/types/declaraciones.d.ts` | Ejemplos de .d.ts para librerías terceros |
| `src/components/index.tsx` | 5 patrones de componentes diferentes |
| `src/hooks/index.ts` | 5 hooks personalizados reutilizables |
| `src/App.tsx` | Aplicación completa demostrativa |
| `src/main.tsx` | Punto de entrada con tipado global |

## Instalando @types Populares

```bash
# Librería | Comando
# Express | npm install --save-dev @types/express @types/node
# Lodash  | npm install --save-dev @types/lodash
# jQuery  | npm install --save-dev @types/jquery
# Jest    | npm install --save-dev @types/jest
# React   | npm install --save-dev @types/react @types/react-dom
```

## Próximas Etapas

1. ✅ Componentes básicos tipados
2. ✅ Hooks personalizados
3. 🔄 Estado global (Redux, Context API)
4. 🔄 Formularios con validación
5. 🔄 Pruebas con Jest + Testing Library
6. 🔄 Deployment y buenas prácticas

## Lectura y Recursos

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Handbook - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [Vite Docs](https://vitejs.dev/)
- [DefinitelyTyped - Repositorio de @types](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [Create React App TypeScript](https://create-react-app.dev/docs/adding-typescript/)

## Conclusión

React + TypeScript es la combinación estándar en la industria moderna. Con los conceptos de este módulo, puedes:
- ✅ Tipear componentes correctamente
- ✅ Crear hooks personalizados seguros
- ✅ Usar componentes genéricos
- ✅ Integrar librerías terceros con tipos
- ✅ Escribir aplicaciones React robustas y mantenibles
