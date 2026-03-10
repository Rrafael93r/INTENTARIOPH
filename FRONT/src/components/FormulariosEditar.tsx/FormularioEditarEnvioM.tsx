"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { getEnvioById, updateEnvio } from "../../servicios/EnvioModemService"

interface IFormularioEditarEnvioProps {
  envioId: number
  onClose: () => void
  onSuccess: () => void
}

const FormularioEditarEnvio: React.FC<IFormularioEditarEnvioProps> = ({ envioId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true)
  const [envio, setEnvio] = useState<any>({
    id: "",
    farmacia: null,
    modemPrincipal: null,
    modemSecundario: null,
    fecha_envio: "",
    costo_envio: 0,
    estado_envio: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  // Función para formatear fecha
  const formatearFecha = (fechaISO: string | null | undefined): string => {
    if (!fechaISO) return ""
    try {
      const fecha = new Date(fechaISO)
      return fecha.toISOString().split("T")[0]
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return ""
    }
  }

  useEffect(() => {
    const cargarEnvio = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!envioId) {
          throw new Error("ID no proporcionado")
        }

        Swal.fire({
          title: "Cargando envío...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const data = await getEnvioById(envioId)

        if (!data) {
          throw new Error("No se encontró el envío")
        }

        // Formatear las fechas antes de establecer el estado
        const envioFormateado = {
          ...data,
          fecha_envio: formatearFecha(data.fecha_envio),
        }

        setEnvio(envioFormateado)
      } catch (error) {
        console.error("Error al cargar el envío:", error)
        setError(error instanceof Error ? error.message : "Error al cargar el envío")
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del envío",
        })
      } finally {
        setLoading(false)
        Swal.close()
      }
    }

    cargarEnvio()
  }, [envioId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "costo_envio") {
      setEnvio((prev: any) => ({
        ...prev,
        [name]: Number(value),
      }))
    } else {
      setEnvio((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!envio.fecha_envio || !envio.estado_envio) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos obligatorios",
      })
      return
    }

    if (envio.costo_envio < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El costo de envío no puede ser negativo",
      })
      return
    }

    try {
      setLoading(true)

      Swal.fire({
        title: "Actualizando envío...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar datos para enviar
      const envioData = {
        fecha_envio: new Date(envio.fecha_envio).toISOString(),
        costo_envio: envio.costo_envio,
        estado_envio: envio.estado_envio,
      }



      await updateEnvio(envioId, envioData)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Envío actualizado correctamente",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el envío. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="sr-only">Cargando...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg text-gray-800">
      <form onSubmit={handleSubmit}>
        {/* Información del envío */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <i className="bi bi-calendar mr-2 text-orange-500"></i>
              Fecha de Envío*
            </label>
            <input
              type="date"
              name="fecha_envio"
              value={envio.fecha_envio}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <i className="bi bi-currency-dollar mr-2 text-orange-500"></i>
              Costo de Envío*
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="costo_envio"
                value={envio.costo_envio}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="md:col-span-2 mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <i className="bi bi-truck mr-2 text-orange-500"></i>
              Estado del Envío*
            </label>
            <select
              name="estado_envio"
              value={envio.estado_envio}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="">Seleccione un estado...</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="EN CAMINO">EN CAMINO</option>
              <option value="ENTREGADO">ENTREGADO</option>
              <option value="DEVUELTO">DEVUELTO</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
          </div>
        </div>

        {/* Información de la farmacia destino */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h6 className="m-0 font-semibold text-gray-800 flex items-center">
              <i className="bi bi-building mr-2 text-orange-500"></i>
              Farmacia Destino
            </h6>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={envio.farmacia?.nombre || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={envio.farmacia?.ciudad?.nombre_ciudad || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div className="md:col-span-2 mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={envio.farmacia?.direccion || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información del módem principal */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h6 className="m-0 font-semibold text-gray-800 flex items-center">
              <i className="bi bi-router mr-2 text-orange-500"></i>
              Módem Principal
            </h6>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  value={envio.modemPrincipal?.marca || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  value={envio.modemPrincipal?.modelo || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                <input
                  type="text"
                  value={envio.modemPrincipal?.numero_serie || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información del módem secundario si existe */}
        {envio.modemSecundario && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h6 className="m-0 font-semibold text-gray-800 flex items-center">
                <i className="bi bi-router mr-2 text-gray-400"></i>
                Módem Secundario
              </h6>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input
                    type="text"
                    value={envio.modemSecundario?.marca || ""}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    value={envio.modemSecundario?.modelo || ""}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                  <input
                    type="text"
                    value={envio.modemSecundario?.numero_serie || ""}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen del envío */}
        <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
          <h4 className="flex items-center text-lg font-medium mb-3 text-blue-900">
            <i className="bi bi-info-circle mr-2"></i>
            Resumen del Envío
          </h4>
          <p className="mb-2">
            <strong className="font-semibold">ID del Envío:</strong> {envio.id}
          </p>
          <p className="mb-2">
            <strong className="font-semibold">Destino:</strong> {envio.farmacia?.nombre} - {envio.farmacia?.ciudad?.nombre_ciudad}
          </p>
          <p className="mb-2">
            <strong className="font-semibold">Módem(s):</strong> {envio.modemPrincipal?.marca} {envio.modemPrincipal?.modelo}
            {envio.modemSecundario && ` + ${envio.modemSecundario?.marca} ${envio.modemSecundario?.modelo}`}
          </p>
          <p className="mb-0">
            <strong className="font-semibold">Costo Total:</strong> ${envio.costo_envio?.toLocaleString("es-CO")}
          </p>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors
              ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'}
            `}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Actualizando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle mr-2"></i>
                Actualizar Envío
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md shadow-sm text-sm font-medium hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <i className="bi bi-x-circle mr-2"></i>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioEditarEnvio
