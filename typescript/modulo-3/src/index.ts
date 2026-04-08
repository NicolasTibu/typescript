// Módulo 3: Ecosistemas modernos
// Tipos de utilidad (Utility Types)

console.log("\n" + "=".repeat(60));
console.log("MÓDULO 3: ECOSISTEMAS MODERNOS");
console.log("Tipos de utilidad (Utility Types)");
console.log("=".repeat(60) + "\n");

// ============================================
// INTERFACES DE EJEMPLO
// ============================================

interface Servidor {
  ip: string;
  puerto: number;
  estado: string;
}

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  activo: boolean;
}

interface Configuracion {
  host: string;
  puerto: number;
  debug: boolean;
}

// ============================================
// 1. PARTIAL<T>
// ============================================

console.log("1️⃣ PARTIAL<T> - Hace todas las propiedades opcionales\n");

type DatosActualizacionServidor = Partial<Servidor>;
type DatosActualizacionUsuario = Partial<Usuario>;

const actualizacionParcial: DatosActualizacionServidor = {
  estado: "mantenimiento", // Solo actualizo el estado
};

console.log("Actualización parcial de servidor:", actualizacionParcial);

// Ejemplo práctico: Función de actualización
function actualizarServidor(id: string, cambios: Partial<Servidor>): Servidor {
  // Simulación de servidor existente
  const servidorExistente: Servidor = {
    ip: "192.168.1.100",
    puerto: 8080,
    estado: "activo",
  };

  // Aplicar cambios parciales
  return { ...servidorExistente, ...cambios };
}

const servidorActualizado = actualizarServidor("srv-001", { estado: "mantenimiento" });
console.log("Servidor actualizado:", servidorActualizado);
console.log();

// ============================================
// 2. READONLY<T>
// ============================================

console.log("2️⃣ READONLY<T> - Hace todas las propiedades inmutables\n");

type ConfiguracionInmutable = Readonly<Configuracion>;

const config: ConfiguracionInmutable = {
  host: "localhost",
  puerto: 3000,
  debug: true,
};

// ❌ Esto daría error en compilación:
// config.puerto = 4000; // Error: Cannot assign to 'puerto' because it is a read-only property.

console.log("Configuración inmutable:", config);

// Ejemplo: Función que garantiza inmutabilidad
function crearConfigInmutable(config: Configuracion): Readonly<Configuracion> {
  return { ...config }; // Retorna una copia inmutable
}

const configInmutable = crearConfigInmutable({ host: "prod.example.com", puerto: 443, debug: false });
console.log("Config inmutable creada:", configInmutable);
console.log();

// ============================================
// 3. PICK<T, K> Y OMIT<T, K>
// ============================================

console.log("3️⃣ PICK<T, K> y OMIT<T, K> - Seleccionar/eliminar propiedades\n");

// PICK: Seleccionar solo ciertas propiedades
type UsuarioBasico = Pick<Usuario, "id" | "nombre">;
type ServidorBasico = Pick<Servidor, "ip" | "estado">;

// OMIT: Eliminar ciertas propiedades (útil para datos sensibles)
type UsuarioPublico = Omit<Usuario, "password">;
type ServidorSinIP = Omit<Servidor, "ip">;

const usuarioBasico: UsuarioBasico = {
  id: "usr-001",
  nombre: "Juan Pérez",
};

const usuarioPublico: UsuarioPublico = {
  id: "usr-001",
  nombre: "Juan Pérez",
  email: "juan@example.com",
  activo: true,
  // password está omitido - no existe en este tipo
};

console.log("Usuario básico (Pick):", usuarioBasico);
console.log("Usuario público (Omit password):", usuarioPublico);

// Ejemplo práctico: API response sin datos sensibles
function enviarUsuarioPublico(usuario: Usuario): UsuarioPublico {
  const { password, ...usuarioSinPassword } = usuario; // Destructuring para omitir
  return usuarioSinPassword;
}

const usuarioCompleto: Usuario = {
  id: "usr-002",
  nombre: "María García",
  email: "maria@example.com",
  password: "secret123",
  activo: true,
};

const usuarioParaAPI = enviarUsuarioPublico(usuarioCompleto);
console.log("Usuario para API (sin password):", usuarioParaAPI);
console.log();

// ============================================
// 4. RECORD<K, T>
// ============================================

console.log("4️⃣ RECORD<K, T> - Diccionarios/mapas tipados\n");

// Record con claves string
type Traducciones = Record<string, string>;
const traducciones: Traducciones = {
  "hello": "hola",
  "world": "mundo",
  "typescript": "TypeScript",
};

// Record con claves específicas (union type)
type EstadoServidor = "activo" | "inactivo" | "mantenimiento";
type ConfigEstados = Record<EstadoServidor, string>;

const coloresEstados: ConfigEstados = {
  activo: "🟢 verde",
  inactivo: "🔴 rojo",
  mantenimiento: "🟡 amarillo",
};

// Record con valores complejos
type ConfigServidores = Record<string, Servidor>;
const servidores: ConfigServidores = {
  "web-01": { ip: "10.0.0.1", puerto: 80, estado: "activo" },
  "db-01": { ip: "10.0.0.2", puerto: 5432, estado: "activo" },
};

console.log("Traducciones:", traducciones);
console.log("Colores por estado:", coloresEstados);
console.log("Servidores registrados:", Object.keys(servidores));

// Ejemplo práctico: Función que usa Record
function obtenerColorEstado(estado: EstadoServidor): string {
  return coloresEstados[estado];
}

console.log("Color para 'activo':", obtenerColorEstado("activo"));
console.log();

// ============================================
// 5. AWAITED<T>
// ============================================

console.log("5️⃣ AWAITED<T> - Desenredar tipos de promesas\n");

// Función que retorna una promesa
async function obtenerListaUsuarios(): Promise<Usuario[]> {
  // Simulación de llamada a API
  return [
    { id: "usr-001", nombre: "Ana", email: "ana@test.com", password: "pass", activo: true },
    { id: "usr-002", nombre: "Carlos", email: "carlos@test.com", password: "pass", activo: false },
  ];
}

// Sin Awaited: el tipo es Promise<Usuario[]>
type TipoSinAwaited = ReturnType<typeof obtenerListaUsuarios>;

// Con Awaited: el tipo es Usuario[]
type TipoConAwaited = Awaited<ReturnType<typeof obtenerListaUsuarios>>;

// Ejemplo práctico: Función que procesa el resultado awaited
async function procesarUsuarios(): Promise<void> {
  const usuarios: TipoConAwaited = await obtenerListaUsuarios();

  // Ahora TypeScript sabe que 'usuarios' es Usuario[], no Promise<Usuario[]>
  console.log(`Procesando ${usuarios.length} usuarios:`);
  usuarios.forEach(user => {
    console.log(`  - ${user.nombre} (${user.activo ? 'activo' : 'inactivo'})`);
  });
}

procesarUsuarios();
console.log();

// ============================================
// 6. COMBINACIÓN DE UTILITY TYPES
// ============================================

console.log("6️⃣ COMBINACIÓN DE UTILITY TYPES\n");

// Ejemplo del enunciado: Partial<Omit<Servidor, "ip">>
type DatosActualizacionServidor2 = Partial<Omit<Servidor, "ip">>;
// Resultado: { puerto?: number; estado?: string; }

const actualizacion2: DatosActualizacionServidor2 = {
  puerto: 9000, // Solo puerto, sin IP (omitida) y opcional
};

console.log("Actualización combinada:", actualizacion2);

// Otro ejemplo: Readonly<Pick<Usuario, "id" | "email">>
type UsuarioIdentidad = Readonly<Pick<Usuario, "id" | "email">>;

const identidad: UsuarioIdentidad = {
  id: "usr-003",
  email: "test@example.com",
};

// identidad.id = "nuevo"; // ❌ Error: read-only

console.log("Identidad inmutable:", identidad);

// Ejemplo avanzado: Record con Partial
type ConfiguracionParcial = Record<string, Partial<Configuracion>>;
const configsParciales: ConfiguracionParcial = {
  "dev": { host: "localhost", debug: true },
  "prod": { host: "prod.example.com", puerto: 443 },
};

console.log("Configuraciones parciales:", configsParciales);

console.log("\n" + "=".repeat(60));
console.log("✅ MÓDULO 3 COMPLETADO");
console.log("Los utility types son esenciales para APIs tipadas y refactorización segura");
console.log("=".repeat(60));