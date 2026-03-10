"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { createReporte } from "../../servicios/reportesService"
import { getFarmacias } from "../../servicios/farmaciaService"
import { getMotivos } from "../../servicios/motivoreporteService"

interface IFormularioCrearRProps {
  onSuccess?: () => void
}

const FormularioCrearR: React.FC<IFormularioCrearRProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [farmacias, setFarmacias] = useState<any[]>([])
  const [motivos, setMotivos] = useState<any[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  const [reporte, setReporte] = useState<any>({
    fecha: new Date().toISOString().split("T")[0],
    farmacia: null,
    fecha_hora_inicio: new Date().toTimeString().slice(0, 5),
    fecha_hora_fin: "",
    duracion_incidente: "",
    estado: "ABIERTO",
    motivo: null,
    observacion: "",
  })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true)

        Swal.fire({
          title: "Cargando datos...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        // Cargar farmacias y motivos en paralelo
        const [farmaciasData, motivosData] = await Promise.all([getFarmacias(), getMotivos()])

        setFarmacias(farmaciasData)
        setMotivos(motivosData)

        Swal.close()
      } catch (error) {
        console.error("Error al cargar datos:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos necesarios para crear el reporte",
        })
      } finally {
        setLoadingData(false)
      }
    }

    cargarDatos()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "farmacia_id") {
      const farmaciaSeleccionada = farmacias.find((f) => f.id === Number(value))
      setReporte((prev: any) => ({
        ...prev,
        farmacia: farmaciaSeleccionada,
      }))
    } else if (name === "motivo_id") {
      const motivoSeleccionado = motivos.find((m) => m.id === Number(value))
      setReporte((prev: any) => ({
        ...prev,
        motivo: motivoSeleccionado,
      }))
    } else {
      setReporte((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reporte.farmacia || !reporte.motivo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor seleccione una farmacia y un motivo",
      })
      return
    }

    try {
      setLoading(true)

      Swal.fire({
        title: "Creando reporte...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Combinar fecha con hora para crear fechas ISO completas
      const fechaBase = new Date(reporte.fecha)
      const ano = fechaBase.getFullYear()
      const mes = fechaBase.getMonth() + 1 // getMonth() devuelve 0-11, necesitamos 1-12

      let fechaHoraInicio = null
      if (reporte.fecha && reporte.fecha_hora_inicio) {
        const [horasInicio, minutosInicio] = reporte.fecha_hora_inicio.split(":")
        fechaHoraInicio = new Date(fechaBase)
        fechaHoraInicio.setHours(Number(horasInicio), Number(minutosInicio), 0, 0)
      }

      // Preparar el objeto para enviar al backend
      const reporteFormateado = {
        fecha: fechaBase, // Enviar como objeto Date
        ano: ano,
        mes: mes,
        farmacia: reporte.farmacia, // Enviar el objeto completo
        fecha_hora_inicio: fechaHoraInicio, // Enviar como objeto Date
        fecha_hora_fin: null, // Nuevo reporte no tiene fecha fin
        duracion_incidente: null, // Se calculará cuando se cierre
        estado: "ABIERTO", // Siempre ABIERTO para reportes nuevos
        motivo: reporte.motivo, // Enviar el objeto completo
        observacion: reporte.observacion || "",
        isDeleted: false,
      }



      await createReporte(reporteFormateado)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Reporte creado correctamente",
      })

      // Limpiar el formulario
      setReporte({
        fecha: new Date().toISOString().split("T")[0],
        farmacia: null,
        fecha_hora_inicio: new Date().toTimeString().slice(0, 5),
        fecha_hora_fin: "",
        duracion_incidente: "",
        estado: "ABIERTO",
        motivo: null,
        observacion: "",
      })

      // Limpiar el formulario o cerrar el modal
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error al crear:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el reporte",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="sr-only">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha*</label>
            <input
              type="date"
              name="fecha"
              value={reporte.fecha}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio*</label>
            <input
              type="time"
              name="fecha_hora_inicio"
              value={reporte.fecha_hora_inicio}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Farmacia*</label>
            <select
              name="farmacia_id"
              value={reporte.farmacia?.id || ""}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="">Seleccione una farmacia...</option>
              {farmacias.map((farmacia) => (
                <option key={farmacia.id} value={farmacia.id}>
                  {farmacia.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo*</label>
            <select
              name="motivo_id"
              value={reporte.motivo?.id || ""}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="">Seleccione un motivo...</option>
              {motivos.map((motivo) => (
                <option key={motivo.id} value={motivo.id}>
                  {motivo.motivo}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea
              rows={3}
              name="observacion"
              value={reporte.observacion}
              onChange={handleInputChange}
              placeholder="Observaciones generales del caso..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {reporte.farmacia && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h5 className="mb-4 text-lg font-medium text-gray-800 border-b pb-2">Información de la Farmacia Seleccionada</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
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
        )}

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
                Creando...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle mr-2"></i>
                Crear Reporte
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              if (onSuccess) onSuccess()
            }}
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

export default FormularioCrearR
