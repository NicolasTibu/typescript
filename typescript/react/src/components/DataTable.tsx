/**
 * DataTable<T>: Componente genérico fuertemente tipado
 * 
 * Características:
 * - Genérico con constrainst T extends Record<string, any>
 * - Usa keyof T para asegurar claves válidas
 * - Partial<T> para edición de filas
 * - Props discriminadas con uniones tipadas
 * - Exhaustiveness checking en reducedor de acciones
 */

import React, { useReducer, useState } from 'react';
import type { ConfiguracionColumna, EstadoEdicion, AccionTabla, PropsDataTable } from '../types/index';

/**
 * Reductor para manejar el estado de edición
 * Demuestra exhaustiveness checking con discriminated unions
 */
function reductorEdicion<T extends Record<string, any>>(
  estado: EstadoEdicion<T>,
  accion: AccionTabla<T>
): EstadoEdicion<T> {
  // Exhaustiveness checking: TypeScript verifica que todos los casos estén cubiertos
  switch (accion.tipo) {
    case "EDITAR":
      return {
        habilitado: true,
        filaEnEdicion: accion.fila,
        datosTemporales: { ...accion.datos } as Partial<T>,
      };

    case "CANCELAR_EDICION":
      return {
        habilitado: false,
        filaEnEdicion: null,
        datosTemporales: {},
      };

    case "GUARDAR_EDICION":
      return {
        habilitado: false,
        filaEnEdicion: null,
        datosTemporales: accion.datos,
      };

    case "ELIMINAR":
      return {
        habilitado: false,
        filaEnEdicion: null,
        datosTemporales: {},
      };

    // Si se añade un nuevo acción a AccionTabla, el compilador forzará actualizar todos los cases
    default:
      // Exhaustiveness checking con never
      const _agotado: never = accion;
      throw new Error(`Acción no manejada: ${JSON.stringify(_agotado)}`);
  }
}

/**
 * Componente DataTable genérico
 * @template T - Tipo de datos que la tabla renderiza
 */
export const DataTable = React.forwardRef<
  HTMLTableElement,
  PropsDataTable<T>
>(function DataTable<T extends Record<string, any>>(
  {
    datos,
    columnas,
    titulo,
    permiteEdicion = true,
    onGuardar,
    onEliminar,
  }: PropsDataTable<T>,
  ref: React.Ref<HTMLTableElement>
) {
  const [edicion, dispatch] = useReducer(reductorEdicion<T>, {
    habilitado: false,
    filaEnEdicion: null,
    datosTemporales: {},
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Renderiza el valor de una celda según su formato
  const renderizarCelda = (valor: any, formato?: string): React.ReactNode => {
    if (valor instanceof Date) {
      return valor.toLocaleDateString('es-ES');
    }

    if (typeof valor === 'boolean') {
      return valor ? '✅ Sí' : '❌ No';
    }

    if (valor === null || valor === undefined) {
      return '-';
    }

    if (formato === 'moneda' && typeof valor === 'number') {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
      }).format(valor);
    }

    return String(valor);
  };

  // Manejar edición de una fila
  const iniciarEdicion = (indice: number, fila: T) => {
    if (!permiteEdicion) return;
    
    dispatch({ tipo: "EDITAR", fila, datos: fila });
    setMostrarFormulario(true);
  };

  // Guardar edición
  const guardarEdicion = () => {
    if (!edicion.filaEnEdicion || !onGuardar) {
      dispatch({ tipo: "CANCELAR_EDICION" });
      setMostrarFormulario(false);
      return;
    }

    const datosActualizados = {
      ...datos[edicion.filaEnEdicion],
      ...edicion.datosTemporales,
    } as T;

    onGuardar(edicion.filaEnEdicion, datosActualizados);
    dispatch({ tipo: "CANCELAR_EDICION" });
    setMostrarFormulario(false);
  };

  // Eliminar una fila
  const eliminarFila = (indice: number) => {
    if (!onEliminar) return;
    
    onEliminar(indice);
    dispatch({ tipo: "ELIMINAR" });
  };

  return (
    <div style={{ padding: '20px' }}>
      {titulo && <h2>{titulo}</h2>}

      <div style={{ overflowX: 'auto' }}>
        <table
          ref={ref}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ddd',
            backgroundColor: '#f9f9f9',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
              {columnas.map((col) => (
                <th
                  key={String(col.clave)}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #ddd',
                    width: col.ancho ? `${col.ancho}px` : 'auto',
                  }}
                >
                  {col.etiqueta}
                </th>
              ))}
              {permiteEdicion && (
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {datos.map((fila, indice) => (
              <tr
                key={indice}
                style={{
                  backgroundColor: indice % 2 === 0 ? '#f2f2f2' : 'white',
                  borderBottom: '1px solid #ddd',
                  ':hover': { backgroundColor: '#e8f5e9' },
                }}
              >
                {columnas.map((col) => (
                  <td
                    key={`${indice}-${String(col.clave)}`}
                    style={{
                      padding: '10px 12px',
                      borderRight: '1px solid #ddd',
                    }}
                  >
                    {renderizarCelda(fila[col.clave], col.formato)}
                  </td>
                ))}
                {permiteEdicion && (
                  <td
                    style={{
                      padding: '10px 12px',
                      textAlign: 'center',
                    }}
                  >
                    <button
                      onClick={() => iniciarEdicion(indice, fila)}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarFila(indice)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {permiteEdicion && mostrarFormulario && edicion.filaEnEdicion !== null && (
        <FormularioEdicion
          datosTemporales={edicion.datosTemporales}
          columnas={columnas}
          onGuardar={guardarEdicion}
          onCancelar={() => {
            dispatch({ tipo: "CANCELAR_EDICION" });
            setMostrarFormulario(false);
          }}
        />
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';

/**
 * Componente formulario para editar una fila
 * Demuestra el uso de Partial<T> para edición parcial
 */
interface PropsFormularioEdicion<T extends Record<string, any>> {
  datosTemporales: Partial<T>;
  columnas: ConfiguracionColumna<T>[];
  onGuardar: () => void;
  onCancelar: () => void;
}

function FormularioEdicion<T extends Record<string, any>>({
  datosTemporales,
  columnas,
  onGuardar,
  onCancelar,
}: PropsFormularioEdicion<T>) {
  return (
    <div
      style={{
        marginTop: '20px',
        padding: '20px',
        border: '2px solid #2196F3',
        borderRadius: '8px',
        backgroundColor: '#f3f7ff',
      }}
    >
      <h3>Editar fila</h3>
      <div style={{ marginBottom: '16px' }}>
        {columnas.slice(0, 3).map((col) => (
          <div key={String(col.clave)} style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              {col.etiqueta}
            </label>
            <input
              type="text"
              defaultValue={String(datosTemporales[col.clave] || '')}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={onGuardar}
          style={{
            marginRight: '8px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ✅ Guardar
        </button>
        <button
          onClick={onCancelar}
          style={{
            padding: '10px 20px',
            backgroundColor: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ❌ Cancelar
        </button>
      </div>
    </div>
  );
}
