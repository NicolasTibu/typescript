# Módulo 4: Integración con React

## Introducción

Hasta ahora has trabajado en entornos de consola o lógica pura. React es la librería líder de JavaScript para construir interfaces de usuario (UI) mediante una arquitectura basada en **componentes reutilizables**.

Cuando unes React con TypeScript, el resultado es un código extremadamente robusto donde el compilador te avisa de inmediato si:
- Olvidas pasar un dato (prop) a un componente visual
- Mutas el estado incorrectamente
- Los tipos no coinciden en callbacks

## Estructura del Módulo

```
modulo-4/
├── src/
│   ├── types/
│   │   ├── index.ts          # Interfaces compartidas (Usuario, Servidor, etc)
│   │   └── declaraciones.d.ts # Definiciones .d.ts para librerías terceros
│   ├── components/
│   │   └── index.tsx          # Componentes React tipados
│   ├── hooks/
│   │   └── index.ts           # Hooks personalizados con tipado
│   └── App.tsx                # Aplicación completa ejemplo
├── package.json
├── tsconfig.json
└── docs/
    └── README.md
```

## Configuración para Iniciar un Proyecto React

### Opción 1: Usar Vite (Recomendado)

```bash
npm create vite@latest mi-proyecto-ui -- --template react-ts
cd mi-proyecto-ui
npm install
npm run dev
```

### Opción 2: Usar Create React App

```bash
npx create-react-app mi-proyecto-ui --template typescript
cd mi-proyecto-ui
npm install
npm start
```

## Extensión .tsx

Los archivos terminan en `.tsx`. Esta extensión le indica al compilador que el archivo contiene:
- **Sintaxis JSX**: HTML dentro de JavaScript
- **TypeScript**: Tipado estático

### Diferencias:
- `.ts` = TypeScript puro
- `.tsx` = TypeScript + JSX (componentes React)
- `.js` = JavaScript puro
- `.jsx` = JavaScript + JSX

## Tipado de Props y Componentes

En lugar de adivinar qué datos necesita un componente, defines un contrato estricto:

```typescript
import React, { FC } from 'react';

interface PanelUsuarioProps {
  usuarioId: string;
  mostrarMetricas?: boolean;      // Prop opcional
  onActualizar: (nuevoEstado: string) => void; // Función tipada
  children?: React.ReactNode;     // Contenido anidado
}

// El componente exige cumplir con la interfaz
export const PanelUsuario: FC<PanelUsuarioProps> = ({
  usuarioId,
  mostrarMetricas = false,
  onActualizar,
  children,
}) => {
  return (
    <div>
      <h2>Usuario: {usuarioId}</h2>
      {mostrarMetricas && <p>Métricas: ...</p>}
      <button onClick={() => onActualizar("actualizado")}>
        Actualizar
      </button>
      {children}
    </div>
  );
};
```

### Uso:

```typescript
// ✅ Correcto
<PanelUsuario
  usuarioId="123"
  mostrarMetricas={true}
  onActualizar={(estado) => console.log(estado)}
>
  Contenido adicional
</PanelUsuario>

// ❌ Error: "onActualizar" es obligatorio
<PanelUsuario usuarioId="123" />

// ❌ Error: "mostrarMetricas" debe ser booleano
<PanelUsuario usuarioId="123" mostrarMetricas="si" onActualizar={...} />
```

## Tipado de Hooks (Estado Local)

TypeScript infiere el tipo de `useState` perfectamente si lo inicializas con un valor:

```typescript
import { useState } from 'react';

// Inferencia automática: sabe que es boolean
const [cargando, setCargando] = useState(true);

// Para estados complejos o nulos al inicio, usa genéricos:
interface Usuario { id: string; nombre: string; }

const [usuario, setUsuario] = useState<Usuario | null>(null);

// Hook personalizado tipado
function useUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);

  return { usuario, error };
}
```

## Componentes Genéricos

Crea componentes reutilizables sin perder seguridad de tipos:

```typescript
interface ListaProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  titulo?: string;
}

export function Lista<T extends { id: string | number }>({
  items,
  renderItem,
  titulo,
}: ListaProps<T>) {
  return (
    <div>
      {titulo && <h2>{titulo}</h2>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{renderItem(item)}</li>
        ))}
      </ul>
    </div>
  );
}

// USO:
interface Producto { id: number; nombre: string; }

<Lista<Producto>
  items={productos}
  renderItem={(p) => `${p.nombre}`}
  titulo="Productos"
/>
```

## Archivos de Declaración de Tipos (.d.ts)

Si integras librerías escritas en JavaScript puro (como lodash, express), el compilador no entenderá sus firmas. Los archivos `.d.ts` solo contienen:
- Interfaces
- Types
- Firmas de funciones
- Declaraciones

**SIN lógica de ejecución**.

### Ejemplo: Definición de tipos para librería terceros

```typescript
// arquivo/mi-libreria.d.ts

declare module "mi-libreria" {
  export function procesar(datos: string[]): string;
  
  export interface ConfiguracionAPI {
    url: string;
    puerto: number;
  }

  export async function conectar(config: ConfiguracionAPI): Promise<void>;
}
```

### Uso:

```typescript
import { procesar, conectar } from "mi-libreria";

const resultado = procesar(["a", "b"]); // TypeScript sabe que retorna string
await conectar({ url: "localhost", puerto: 3000 }); // Props tipadas
```

## Instalando @types para Librerías Populares

La comunidad mantiene definiciones de tipos en NPM bajo `@types`:

```bash
# Express
npm install --save-dev @types/express @types/node

# Lodash
npm install --save-dev @types/lodash

# Jest
npm install --save-dev @types/jest

# jQuery
npm install --save-dev @types/jquery
```

### Archivo tsconfig.json típico para React

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Cambium de Tema: Variables Globales y window

En aplicaciones React, a menudo necesitas tipos para variables globales del navegador:

```typescript
// types/global.d.ts
declare global {
  interface Window {
    APP_VERSION: string;
    API_URL: string;
    DEBUG_MODE: boolean;
  }
}

export {};

// Uso en componente:
const apiUrl = window.API_URL; // TypeScript sabe que es string
```

## Patrones Comunes con TypeScript + React

### 1. Props con Discriminantes

```typescript
type ButtonProps = 
  | { variante: "simple"; label: string }
  | { variante: "con-icono"; label: string; icono: React.ReactNode };

// TypeScript obliga a pasar "icono" si variante es "con-icono"
```

### 2. Callbacks Tipados

```typescript
interface FormProps {
  onEnviar: (datos: FormData) => Promise<void>;
  onError: (error: Error) => void;
}
```

### 3. React.ReactNode para Flexibilidad

```typescript
interface PanelProps {
  titulo: React.ReactNode;     // Acepta string, número, elemento, etc.
  contenido: React.ReactNode;
  footer?: React.ReactNode;
}
```

## Lectura Recomendada

- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Handbook - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [Vite Documentation](https://vitejs.dev/)
- [@types en NPM](https://www.npmjs.com/search?q=%40types)

## Próximos Pasoss

- ✅ Componentes funcionales con tipado
- ✅ Hooks personalizados
- ✅ Gestión de estado con TypeScript
- 🔄 useState, useEffect, useContext avanzado
- 🔄 Librerías como Redux + TypeScript
- 🔄 Pruebas unitarias con Jest + TypeScript
