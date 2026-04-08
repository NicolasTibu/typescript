# Laboratorio Práctico 4: Integración con React

## Descripción

Este laboratorio demuestra cómo usar TypeScript en proyectos React modernos, con énfasis en:

✅ **Componentes funcionales** tipados con interfaces de props  
✅ **Hooks personalizados** con tipado completo  
✅ **Componentes genéricos** reutilizables  
✅ **Uniones discriminadas** en props de componentes  
✅ **Archivos .d.ts** para librerías terceros  
✅ **Aplicación completa** integrando todos los conceptos

## Estructura del Proyecto

```
src/
├── types/
│   ├── index.ts              # Interfaces: Usuario, Servidor, RespuestaAPI<T>
│   └── declaraciones.d.ts    # Ejemplos de .d.ts para librerías
├── components/
│   └── index.tsx             # Componentes React tipados
│      ├── PanelUsuario       # Componente simple con props
│      ├── Lista<T>           # Componente genérico
│      ├── TarjetaServidor    # Componente con unión de tipos
│      ├── ComponenteEstado   # Discriminante automático
│      └── Boton              # Componente flexible con REST props
├── hooks/
│   └── index.ts              # Hooks personalizados
│      ├── useUsuario()       # Manejo de usuario
│      ├── useServidores()    # Manejo de lista de servidores
│      ├── useAPI<T>()        # Hook genérico para API
│      ├── useIntervalo()     # Gestión de setInterval tipada
│      └── useFormulario<T>() # Formularios validados
└── App.tsx                   # Aplicación completa
```

## Conceptos Demostrados

### 1. **Componentes con Props Tipadas** 

```typescript
interface PanelUsuarioProps {
  usuarioId: string;
  usuario?: Usuario;
  mostrarMetricas?: boolean;
  onActualizar?: (estado: string) => void;
  children?: ReactNode;
}

export const PanelUsuario: FC<PanelUsuarioProps> = ({
  usuarioId,
  usuario,
  ...
}) => {
  // TypeScript obliga a usar las props correctamente
};
```

**Beneficios:**
- Error en tiempo de compilación si olvidas pasar props requeridas
- Autocompletado en el IDE
- Documentación implícita

### 2. **Componentes Genéricos Reutilizables**

```typescript
interface ListaProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  titulo?: string;
}

export function Lista<T extends { id: string | number}>({ 
  items, 
  renderItem 
}: ListaProps<T>) {
  // Reutilizable para Usuario[], Servidor[], Producto[], etc.
}

// USO:
<Lista<Usuario>
  items={usuarios}
  renderItem={(u) => u.nombre}
/>
```

### 3. **Uniones Discriminadas en Componentes**

```typescript
type ComponenteEstadoProps =
  | { estado: "cargando" }
  | { estado: "exitoso"; datos: Servidor[] }
  | { estado: "error"; mensaje: string };

export const ComponenteEstado: FC<ComponenteEstadoProps> = (props) => {
  switch (props.estado) {
    case "exitoso":
      // TypeScript sabe que props.datos existe
      return <div>{props.datos.length} servidores</div>;
  }
};
```

### 4. **Hooks Personalizados Tipados**

#### useUsuario()
```typescript
function useUsuario(usuarioIdInicial?: string) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(false);

  const cargarUsuario = useCallback(async (usuarioId: string) => {
    // Lógica tipada
  }, []);

  return { usuario, cargando, cargarUsuario, setUsuario };
}
```

#### useServidores()
```typescript
function useServidores {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { servidores, cargando, error, cargar, agregarServidor };
}
```

### 5. **Archivos .d.ts para Librerías Terceros**

```typescript
// types/declaraciones.d.ts

declare module "libreria-utilidades" {
  export function procesar<T>(
    items: T[],
    callback: (item: T) => T
  ): T[];

  export interface ConexionBD {
    conectado: boolean;
    ejecutar(query: string): Promise<unknown[]>;
  }
}
```

## Cómo Crear un Proyecto React + TypeScript

### Opción 1: Vite (Más rápido)

```bash
npm create vite@latest mi-proyecto -- --template react-ts
cd mi-proyecto
npm install
npm run dev
```

### Opción 2: Create React App

```bash
npx create-react-app mi-proyecto --template typescript
cd mi-proyecto
npm start
```

## Instalación de Tipos para Librerías

```bash
# Para Express
npm install --save-dev @types/express @types/node

# Para Lodash
npm install --save-dev @types/lodash

# Para jQuery
npm install --save-dev @types/jquery

# Buscar más en npm
npm search @types/<nombre-libreria>
```

## Archivos Importantes

### **types/index.ts** - Interfaces Compartidas
- `Usuario`: Estructura de usuario
- `Servidor`: Estructura de servidor
- `RespuestaAPI<T>`: Respuesta genérica de API
- `EstadoCarga`: Estados de carga ("idle", "cargando", "exitoso", "error")

### **types/declaraciones.d.ts** - Tipos Terceros
- Ejemplos de definiciones para librerías sin tipos
- Definiciones para Node.js (setTimeout, setInterval)
- Variables globales de window

### **components/index.tsx** - 5 Patrones de Componentes

1. **PanelUsuario** - Componente simple
2. **Lista<T>** - Genérico
3. **TarjetaServidor** - Con switch tipado
4. **ComponenteEstado** - Discriminantes automáticos
5. **Boton** - Props extendidas de HTML

### **hooks/index.ts** - 5 Hooks Reutilizables

1. **useUsuario()** - Gestión de usuario único
2. **useServidores()** - Gestión de lista
3. **useAPI<T>()** - Llamadas genéricas
4. **useIntervalo()** - Timers tipados
5. **useFormulario<T>()** - Formularios validados

## Compilación

```bash
# Compilar TypeScript
tsc

# Con Vite
npm run build

# Con Create React App
npm run build
```

## Tipado Avanzado

### Props con React.ReactNode

```typescript
interface CardProps {
  titulo: React.ReactNode;    // Acepta: string, number, JSX, etc
  contenido: React.ReactNode;
  footer?: React.ReactNode;
}
```

### Extending HTML Attributes

```typescript
interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario";
  children: React.ReactNode;
}

// Hereda: onClick, disabled, className, etc.
```

### Callbacks Tipados

```typescript
interface FormularioProps {
  onEnviar: (datos: FormData) => Promise<void>;  // Async
  onError: (error: Error) => void;               // Sync
  onValidar?: (datos: FormData) => boolean;      // Optional
}
```

## Beneficios de TypeScript + React

| Aspecto | Beneficio |
|--------|----------|
| **Props** | Error si olvidas pasar datos o tipos incorrectos |
| **Hooks** | Autocompletado para estado y callbacks |
| **Componentes** | Reutilizables sin perder seguridad |
| **Librerías** | Tipos para toda librería mediante @types |
| **Rendimiento** | Compilación detecta errores antes de runtime |
| **Documentación** | Las interfaces son documentación viva |

## Próximas Mejoras

- [ ] Agregar gestión de estado global (Redux + TypeScript)
- [ ] Contexto de React tipado (useContext<T>)
- [ ] Pruebas con Jest + TypeScript
- [ ] Integración con APIs reales
- [ ] Componentes con Storybook
- [ ] Validación de formularios con zod/io-ts

## Lectura Adicional

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Handbook - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) - Repositorio de @types
