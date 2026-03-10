"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { getReporteById, updateReporte } from "../../servicios/reportesService"

interface IFormularioEditarRProps {
  reporteId: number
  onClose: () => void
  onSuccess: () => void
}

const FormularioEditarR: React.FC<IFormularioEditarRProps> = ({ reporteId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true)
  const [reporteOriginal, setReporteOriginal] = useState<any>(null)
  const [reporte, setReporte] = useState<any>({
    id: "",
    fecha: "",
    fecha_cierre: "",
    farmacia: {
      id: 0,
    },
    fecha_hora_inicio: "",
    fecha_hora_fin: "",
    hora_inicio_display: "",
    hora_fin_display: "",
    duracion_incidente: "",
    motivo: {
      id: 0,
    },
    estado: "",
    observacion: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)
  const [duracionCalculada, setDuracionCalculada] = useState("")
  const [estadoOriginal, setEstadoOriginal] = useState("")

  // Función para formatear fechas y horas
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

  const formatearHora = (fechaISO: string | null | undefined): string => {
    if (!fechaISO) return ""
    try {
      const fecha = new Date(fechaISO)
      return `${String(fecha.getHours()).padStart(2, "0")}:${String(fecha.getMinutes()).padStart(2, "0")}`
    } catch (error) {
      console.error("Error al formatear hora:", error)
      return ""
    }
  }

  // Calcular duración cuando cambian las fechas y horas
  useEffect(() => {
    if (reporte.fecha && reporte.hora_inicio_display && reporte.fecha_cierre && reporte.hora_fin_display) {
      try {
        // Crear fechas completas combinando fecha + hora
        const fechaInicio = new Date(reporte.fecha)
        const [horasInicio, minutosInicio] = reporte.hora_inicio_display.split(":").map(Number)
        fechaInicio.setHours(horasInicio, minutosInicio, 0, 0)

        const fechaFin = new Date(reporte.fecha_cierre)
        const [horasFin, minutosFin] = reporte.hora_fin_display.split(":").map(Number)
        fechaFin.setHours(horasFin, minutosFin, 0, 0)

        const diffMs = fechaFin.getTime() - fechaInicio.getTime()

        if (diffMs < 0) {
          setDuracionCalculada("Error: La fecha y hora de fin debe ser posterior a la de inicio")
          return
        }

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

        let duracion = ""
        if (diffDays > 0) {
          duracion += `${diffDays}d `
        }
        duracion += `${diffHrs}h ${diffMins}m`

        const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
        const totalMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

        setDuracionCalculada(`${duracion} (Total: ${totalHours}h ${totalMinutes}m)`)
      } catch (error) {
        console.error("Error al calcular duración:", error)
        setDuracionCalculada("")
      }
    } else {
      setDuracionCalculada("")
    }
  }, [reporte.fecha, reporte.hora_inicio_display, reporte.fecha_cierre, reporte.hora_fin_display])

  useEffect(() => {
    const cargarReporte = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!reporteId) {
          throw new Error("ID no proporcionado")
        }

        Swal.fire({
          title: "Cargando reporte...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const data = await getReporteById(reporteId)

        if (!data) {
          throw new Error("No se encontró el reporte")
        }

        setReporteOriginal(data)
        setEstadoOriginal(data.estado)

        // Formatear las fechas y horas antes de establecer el estado
        const reporteFormateado = {
          ...data,
          fecha: formatearFecha(data.fecha),
          fecha_cierre: formatearFecha(data.fecha_hora_fin) || formatearFecha(data.fecha), // Si no hay fecha fin, usar fecha inicio
          hora_inicio_display: formatearHora(data.fecha_hora_inicio),
          hora_fin_display: formatearHora(data.fecha_hora_fin),
        }

        setReporte(reporteFormateado)
      } catch (error) {
        console.error("Error al cargar el reporte:", error)
        setError(error instanceof Error ? error.message : "Error al cargar el reporte")
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del reporte",
        })
      } finally {
        setLoading(false)
        Swal.close()
      }
    }

    cargarReporte()
  }, [reporteId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReporte((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (reporte.estado === "CERRADO") {
      if (!reporte.fecha_cierre || !reporte.hora_fin_display) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor ingrese la fecha y hora de fin para cerrar el reporte",
        })
        return
      }

      if (duracionCalculada.includes("Error")) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La fecha y hora de fin debe ser posterior a la fecha y hora de inicio",
        })
        return
      }
    }

    // Validación para reabrir caso
    if (estadoOriginal === "CERRADO" && reporte.estado === "ABIERTO") {
      if (!reporte.observacion || reporte.observacion.trim() === "" || reporte.observacion === reporteOriginal.observacion) {
        Swal.fire({
          icon: "warning",
          title: "Observación Requerida",
          text: "Para reabrir un caso cerrado, debe agregar una nueva observación explicando el motivo.",
        })
        return
      }
    }

    try {
      setLoading(true)

      Swal.fire({
        title: "Actualizando reporte...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar datos para enviar - mantener estructura original y actualizar solo lo necesario
      const datosActualizados = {
        ...reporteOriginal, // Mantener todos los datos originales
        estado: reporte.estado,
        observacion: reporte.observacion,
      }

      // Si el estado es CERRADO y tenemos fecha y hora fin, calcular fecha_hora_fin
      if (reporte.estado === "CERRADO" && reporte.fecha_cierre && reporte.hora_fin_display) {
        const fechaFin = new Date(reporte.fecha_cierre)
        const [horasFin, minutosFin] = reporte.hora_fin_display.split(":").map(Number)
        fechaFin.setHours(horasFin, minutosFin, 0, 0)

        datosActualizados.fecha_hora_fin = fechaFin
      }



      await updateReporte(reporteId, datosActualizados)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Reporte actualizado correctamente",
      })

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error al actualizar:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el reporte. Por favor, intente nuevamente.",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Apertura*</label>
            <input
              type="date"
              name="fecha"
              value={reporte.fecha}
              onChange={handleInputChange}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">La fecha de apertura no se puede modificar</p>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio*</label>
            <input
              type="time"
              name="hora_inicio_display"
              value={reporte.hora_inicio_display}
              onChange={handleInputChange}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">La hora de inicio no se puede modificar</p>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Cierre {reporte.estado === "CERRADO" && "*"}
            </label>
            <input
              type="date"
              name="fecha_cierre"
              value={reporte.fecha_cierre}
              onChange={handleInputChange}
              required={reporte.estado === "CERRADO"}
              min={reporte.fecha}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            {reporte.fecha_cierre && reporte.fecha_cierre !== reporte.fecha && (
              <p className="mt-1 text-xs text-blue-600 flex items-center">
                <i className="bi bi-info-circle mr-1"></i>
                La fecha de cierre es diferente a la fecha de apertura
              </p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora Fin {reporte.estado === "CERRADO" && "*"}
            </label>
            <input
              type="time"
              name="hora_fin_display"
              value={reporte.hora_fin_display}
              onChange={handleInputChange}
              required={reporte.estado === "CERRADO"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            {duracionCalculada && (
              <p className={`mt-1 text-xs flex items-center ${duracionCalculada.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                <i className={`bi ${duracionCalculada.includes("Error") ? "bi-exclamation-triangle" : "bi-clock"} mr-1`}></i>
                {duracionCalculada}
              </p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
            <select
              name="estado"
              value={reporte.estado}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="">Seleccione...</option>
              <option value="ABIERTO">ABIERTO</option>
              <option value="CERRADO">CERRADO</option>
            </select>
            {reporte.estado === "CERRADO" && (
              <p className="mt-1 text-xs text-blue-600 flex items-center">
                <i className="bi bi-info-circle mr-1"></i>
                Al cerrar un caso, asegúrese de completar la fecha y hora de fin
              </p>
            )}
            {reporte.estado !== estadoOriginal && (
              <p className="mt-1 text-xs text-yellow-600 flex items-center">
                <i className="bi bi-arrow-right mr-1"></i>
                El estado cambiará de <strong className="mx-1">{estadoOriginal}</strong> a <strong className="ml-1">{reporte.estado}</strong>
              </p>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo*</label>
            <input
              type="text"
              value={reporte.motivo?.motivo || ""}
              disabled
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">El motivo no se puede modificar</p>
          </div>
          <div className="md:col-span-2 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea
              rows={4}
              name="observacion"
              value={reporte.observacion}
              onChange={handleInputChange}
              placeholder="Observaciones generales del caso..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h5 className="m-0 font-semibold text-gray-800 flex items-center">
              <i className="bi bi-building mr-2 text-orange-500"></i>
              Información de la Farmacia
            </h5>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Farmacia</label>
                <input
                  type="text"
                  value={reporte.farmacia?.nombre || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={reporte.farmacia?.direccion || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={reporte.farmacia?.ciudad?.nombre_ciudad || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor de Internet</label>
                <input
                  type="text"
                  value={reporte.farmacia?.proveedorInternet?.nombre || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
            </div>
          </div>
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
                Actualizar Reporte
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

export default FormularioEditarR
