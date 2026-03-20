"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { createReporte } from "../../servicios/reportesService"
import { getMotivos } from "../../servicios/motivoreporteService"
import { getCurrentUser } from "../../servicios/authServices"
import { getUserByUsername } from "../../servicios/usuarioService"

const FormularioReporteUser: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [motivos, setMotivos] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  const [reporte, setReporte] = useState<any>({
    fecha: new Date().toISOString().split("T")[0],
    fechaHoraInicio: new Date().toTimeString().slice(0, 5),
    motivo: null,
    observacion: "",
  })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true)

        // Obtener usuario actual
        const user = getCurrentUser()
        if (!user) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener la información del usuario",
          })
          return
        }

        setCurrentUser(user)

        Swal.fire({
          title: "Cargando datos...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        // Cargar detalles del usuario y motivos en paralelo
        const [userDetailsData, motivosData] = await Promise.all([getUserByUsername(user.username), getMotivos()])

        if (!userDetailsData || !userDetailsData.farmacia) {
          throw new Error("El usuario no tiene una farmacia asignada")
        }

        setUserDetails(userDetailsData)
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

    if (name === "motivo_id") {
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

    if (!reporte.motivo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor seleccione un motivo para el reporte",
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
      const mes = fechaBase.getMonth() + 1

      let fechaHoraInicio = null
      if (reporte.fecha && reporte.fechaHoraInicio) {
        const [horasInicio, minutosInicio] = reporte.fechaHoraInicio.split(":")
        fechaHoraInicio = new Date(fechaBase)
        fechaHoraInicio.setHours(Number(horasInicio), Number(minutosInicio), 0, 0)
      }

      // Preparar el objeto para enviar al backend
      const reporteFormateado = {
        fecha: fechaBase,
        ano: ano,
        mes: mes,
        farmacia: userDetails.farmacia, // Usar la farmacia del usuario
        fechaHoraInicio: fechaHoraInicio,
        fechaHoraFin: null,
        duracionIncidente: null,
        estado: "ABIERTO",
        motivo: reporte.motivo,
        observacion: reporte.observacion || "",
        isDeleted: false,
      }



      await createReporte(reporteFormateado)

      await Swal.fire({
        icon: "success",
        title: "¡Reporte Creado!",
        text: "Su reporte ha sido enviado correctamente al sistema",
        timer: 3000,
        showConfirmButton: false,
      })

      // Limpiar el formulario
      setReporte({
        fecha: new Date().toISOString().split("T")[0],
        fechaHoraInicio: new Date().toTimeString().slice(0, 5),
        motivo: null,
        observacion: "",
      })
    } catch (error) {
      console.error("Error al crear:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el reporte. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <div className="mt-3">
            <h5 className="text-lg font-medium text-gray-800">Cargando información...</h5>
            <p className="text-gray-500">Por favor espere un momento</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userDetails || !userDetails.farmacia) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2">
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-center">
              <h4 className="flex items-center justify-center text-lg font-bold mb-2">
                <i className="bi bi-exclamation-triangle mr-2"></i>
                Error de Configuración
              </h4>
              <p>Su usuario no tiene una farmacia asignada.</p>
              <p className="mb-0">Por favor contacte al administrador del sistema.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-center">
        <div className="w-full lg:w-2/3">
          {/* Header de bienvenida */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold flex items-center justify-center text-orange-500 mb-2">
              <i className="bi bi-plus-circle mr-2"></i>
              Crear Reporte de Incidente
            </h2>
            <p className="text-gray-500">Complete la información del incidente que está reportando</p>
          </div>

          {/* Información de la farmacia */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h6 className="m-0 font-semibold text-gray-800 flex items-center">
                <i className="bi bi-building mr-2 text-orange-500"></i>
                Mi Farmacia Asignada
              </h6>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-2">
                  <strong className="block text-sm text-gray-600 mb-1">Nombre:</strong>
                  <div className="text-gray-800">{userDetails.farmacia.nombre}</div>
                </div>
                <div className="mb-2">
                  <strong className="block text-sm text-gray-600 mb-1">Ciudad:</strong>
                  <div className="text-gray-800">{userDetails.farmacia.ciudad?.nombreCiudad}</div>
                </div>
                <div className="md:col-span-2 mb-2">
                  <strong className="block text-sm text-gray-600 mb-1">Dirección:</strong>
                  <div className="text-gray-800">{userDetails.farmacia.direccion}</div>
                </div>
                <div className="md:col-span-2 mb-0">
                  <strong className="block text-sm text-gray-600 mb-1">Proveedor de Internet:</strong>
                  <div className="text-gray-800">{userDetails.farmacia.proveedorInternet?.nombre}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de reporte */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h6 className="m-0 font-semibold text-gray-800 flex items-center">
                <i className="bi bi-file-text mr-2 text-orange-500"></i>
                Información del Reporte
              </h6>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                        <i className="bi bi-calendar mr-1 text-gray-500"></i>
                        Fecha*
                      </label>
                      <input
                        type="date"
                        name="fecha"
                        value={reporte.fecha}
                        onChange={handleInputChange}
                        required
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500 flex items-center">
                        <i className="bi bi-info-circle mr-1"></i>
                        La fecha se establece automáticamente
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                        <i className="bi bi-clock mr-1 text-gray-500"></i>
                        Hora de Inicio del Incidente*
                      </label>
                      <input
                        type="time"
                        name="fechaHoraInicio"
                        value={reporte.fechaHoraInicio}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">¿A qué hora comenzó el problema?</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                        <i className="bi bi-exclamation-triangle mr-1 text-gray-500"></i>
                        Motivo del Reporte*
                      </label>
                      <select
                        name="motivo_id"
                        value={reporte.motivo?.id || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white"
                      >
                        <option value="">Seleccione el tipo de problema...</option>
                        {motivos.map((motivo) => (
                          <option key={motivo.id} value={motivo.id}>
                            {motivo.motivo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                        <i className="bi bi-chat-text mr-1 text-gray-500"></i>
                        Descripción del Problema
                      </label>
                      <textarea
                        rows={4}
                        name="observacion"
                        value={reporte.observacion}
                        onChange={handleInputChange}
                        placeholder="Describa con detalle qué está sucediendo..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 resize-y"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition-colors
                      ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'}
                    `}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send mr-2"></i>
                        Enviar Reporte
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReporte({
                        fecha: new Date().toISOString().split("T")[0],
                        fechaHoraInicio: new Date().toTimeString().slice(0, 5),
                        motivo: null,
                        observacion: "",
                      })
                    }}
                    disabled={loading}
                    className="flex items-center justify-center px-6 py-3 border border-orange-500 text-orange-500 rounded-md shadow-sm text-lg font-medium hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <i className="bi bi-arrow-clockwise mr-2"></i>
                    Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormularioReporteUser
