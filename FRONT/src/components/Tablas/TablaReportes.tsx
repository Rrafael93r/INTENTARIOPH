"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Swal from "sweetalert2"
import { getReporte, deleteReporte } from "../../servicios/reportesService"
import FormularioCrearR from "../FormulariosCrear/FormularioCrearR"
import FormularioEditarR from "../FormulariosEditar.tsx/FormularioEditarR"
import FormularioEnvioM from "../FormulariosCrear/FormularioEnvioM"
import { format } from "date-fns"
import * as XLSX from "xlsx"
import { getCurrentUser } from "../../servicios/authServices"

const ReporteTable: React.FC = () => {
  const [reportes, setReportes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Filtros
  const [filterFecha, setFilterFecha] = useState<string>("")
  const [filterFarmacia, setFilterFarmacia] = useState<string>("")
  const [filterFechaHoraInicio, setFilterFechaHoraInicio] = useState<string>("")
  const [filterFechaHoraFin, setFilterFechaHoraFin] = useState<string>("")
  const [filterDuracionIncidente, setFilterDuracionIncidente] = useState<string>("")
  const [filterProveedor, setFilterProveedor] = useState<string>("")
  const [filterMotivo, setFilterMotivo] = useState<string>("")
  const [filterEstado, setFilterEstado] = useState<string>("")

  // Estado para ordenamiento
  const [sortField, setSortField] = useState<string>("fecha")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Modales
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [showEnvioModal, setShowEnvioModal] = useState(false)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [selectedReporteId, setSelectedReporteId] = useState<number | null>(null)

  // Referencia para el botón de exportar
  const exportButtonRef = useRef<HTMLButtonElement>(null)

  const handleShow = () => setShowModal(true)
  const handleClose = () => {
    setShowModal(false)
    loadReportes() // Recargar reportes al cerrar el modal de creación
  }

  const handleShow2 = () => setShowModal2(true)
  const handleClose2 = () => setShowModal2(false)

  const handleShowEnvio = () => setShowEnvioModal(true)
  const handleCloseEnvio = () => setShowEnvioModal(false)

  const handleShowDetalle = () => setShowDetalleModal(true)
  const handleCloseDetalle = () => setShowDetalleModal(false)

  useEffect(() => {
    // Obtener el usuario actual al cargar el componente
    const user = getCurrentUser()
    setCurrentUser(user)
    loadReportes()
  }, [])

  const loadReportes = async () => {
    try {
      setLoading(true)
      Swal.fire({
        title: "Cargando tabla...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const data = await getReporte()
      // Ordenar los reportes por fecha (más recientes primero)
      const sortedData = data.sort((a: any, b: any) => {
        return new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime()
      })
      setReportes(sortedData)
    } catch (error) {
      setError("Error al cargar el listado de reportes")
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de reportes",
      })
    } finally {
      setLoading(false)
      Swal.close()
    }
  }

  const handleSort = (field: string) => {
    // Si hacemos clic en el mismo campo, invertimos la dirección
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Si es un nuevo campo, establecemos ese campo y dirección descendente por defecto
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: string) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? (
      <svg className="w-3 h-3 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
    ) : (
      <svg className="w-3 h-3 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    )
  }

  // Filtrar reportes
  const filteredReportes = () => {
    // Normalizamos los filtros para evitar múltiples llamadas a toLowerCase()
    const normalizedFilterFecha = filterFecha.toLowerCase()
    const normalizedFilterFarmacia = filterFarmacia.toLowerCase()
    const normalizedFilterFechaHoraInicio = filterFechaHoraInicio.toLowerCase()
    const normalizedFilterFechaHoraFin = filterFechaHoraFin.toLowerCase()
    const normalizedFilterDuracionIncidente = filterDuracionIncidente.toLowerCase()
    const normalizedFilterProveedor = filterProveedor.toLowerCase()
    const normalizedFilterMotivo = filterMotivo.toLowerCase()
    const normalizedFilterEstado = filterEstado.toLowerCase()

    return reportes.filter((reporte) => {
      // Convertir fechas a formato string para comparación
      const fechaStr = reporte?.fecha?.toLowerCase() || ""
      const farmaciaStr = reporte?.farmacia?.nombre?.toLowerCase() || ""
      const fechaHoraInicioStr = reporte?.fechaHoraInicio
        ? format(new Date(reporte.fechaHoraInicio), "yyyy-MM-dd HH:mm:ss").toLowerCase()
        : ""
      const fechaHoraFinStr = reporte?.fechaHoraFin
        ? format(new Date(reporte.fechaHoraFin), "yyyy-MM-dd HH:mm:ss").toLowerCase()
        : ""
      const duracionStr = reporte?.duracionIncidente?.toLowerCase() || ""
      const proveedorStr = reporte?.farmacia?.proveedorInternet?.nombre?.toLowerCase() || ""
      const motivoStr = reporte?.motivo?.motivo?.toLowerCase() || ""
      const estadoStr = reporte?.estado?.toLowerCase() || ""

      return (
        (!normalizedFilterFecha || fechaStr.includes(normalizedFilterFecha)) &&
        (!normalizedFilterFarmacia || farmaciaStr.includes(normalizedFilterFarmacia)) &&
        (!normalizedFilterFechaHoraInicio || fechaHoraInicioStr.includes(normalizedFilterFechaHoraInicio)) &&
        (!normalizedFilterFechaHoraFin || fechaHoraFinStr.includes(normalizedFilterFechaHoraFin)) &&
        (!normalizedFilterDuracionIncidente || duracionStr.includes(normalizedFilterDuracionIncidente)) &&
        (!normalizedFilterProveedor || proveedorStr.includes(normalizedFilterProveedor)) &&
        (!normalizedFilterMotivo || motivoStr.includes(normalizedFilterMotivo)) &&
        (!normalizedFilterEstado || estadoStr.includes(normalizedFilterEstado))
      )
    })
  }

  // Ordenar reportes
  const sortedReportes = () => {
    if (!sortField) return filteredReportes()

    return [...filteredReportes()].sort((a, b) => {
      let valueA, valueB

      // Determinar qué valores comparar según el campo
      switch (sortField) {
        case "fecha":
          valueA = new Date(a.fecha || 0).getTime()
          valueB = new Date(b.fecha || 0).getTime()
          break
        case "farmacia":
          valueA = a.farmacia?.nombre?.toLowerCase() || ""
          valueB = b.farmacia?.nombre?.toLowerCase() || ""
          break
        case "inicio":
          valueA = new Date(a.fechaHoraInicio || 0).getTime()
          valueB = new Date(b.fechaHoraInicio || 0).getTime()
          break
        case "fin":
          valueA = new Date(a.fechaHoraFin || 0).getTime()
          valueB = new Date(b.fechaHoraFin || 0).getTime()
          break
        case "duracion":
          valueA = a.duracionIncidente?.toLowerCase() || ""
          valueB = b.duracionIncidente?.toLowerCase() || ""
          break
        case "proveedor":
          valueA = a.farmacia?.proveedorInternet?.nombre?.toLowerCase() || ""
          valueB = b.farmacia?.proveedorInternet?.nombre?.toLowerCase() || ""
          break
        case "motivo":
          valueA = a.motivo?.motivo?.toLowerCase() || ""
          valueB = b.motivo?.motivo?.toLowerCase() || ""
          break
        case "estado":
          valueA = a.estado?.toLowerCase() || ""
          valueB = b.estado?.toLowerCase() || ""
          break
        default:
          valueA = ""
          valueB = ""
      }

      // Comparar según la dirección
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentReportes = sortedReportes().slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedReportes().length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber)

  const clearFilters = () => {
    setFilterDuracionIncidente("")
    setFilterEstado("")
    setFilterFarmacia("")
    setFilterFecha("")
    setFilterFechaHoraFin("")
    setFilterFechaHoraInicio("")
    setFilterMotivo("")
    setFilterProveedor("")
  }

  const handleDeleteReporte = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })

      if (result.isConfirmed) {
        await deleteReporte(id)
        await loadReportes()
        Swal.fire("¡Eliminado!", "El reporte ha sido eliminado.", "success")
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el reporte",
      })
    }
  }

  const exportToExcel = () => {
    // Preparar los datos para exportar
    const dataToExport = filteredReportes().map((reporte) => ({
      ID: reporte.id,
      Fecha: reporte.fecha || "",
      Farmacia: reporte.farmacia?.nombre || "",
      "Fecha/Hora Inicio": reporte.fechaHoraInicio
        ? format(new Date(reporte.fechaHoraInicio), "yyyy-MM-dd HH:mm:ss")
        : "",
      "Fecha/Hora Fin": reporte.fechaHoraFin ? format(new Date(reporte.fechaHoraFin), "yyyy-MM-dd HH:mm:ss") : "",
      Duración: reporte.duracionIncidente || "",
      Proveedor: reporte.farmacia?.proveedorInternet?.nombre || "",
      "NIT Proveedor": reporte.farmacia?.proveedorInternet?.nit || "",
      Motivo: reporte.motivo?.motivo || "",
      Estado: reporte.estado || "",
      Observación: reporte.observacion || "",
    }))

    // Crear libro de trabajo y hoja
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(dataToExport)

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Reportes")

    // Guardar el archivo
    XLSX.writeFile(wb, `reportes_internet_${format(new Date(), "yyyyMMdd")}.xlsx`)
  }

  // Función para formatear fechas
  const formatFecha = (fechaStr: string) => {
    try {
      return format(new Date(fechaStr), "yyyy-MM-dd")
    } catch (error) {
      return "Fecha inválida"
    }
  }

  // Función para formatear horas
  const formatHora = (fechaStr: string) => {
    try {
      return format(new Date(fechaStr), "HH:mm:ss")
    } catch (error) {
      return "Hora inválida"
    }
  }

  // Verificar si el usuario es administrador (roleId 1)
  const isAdmin = currentUser?.roleId === 1

  if (loading && reportes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error && reportes.length === 0) {
    return <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>
  }

  return (
    <>
      {/* Modal para Crear Reporte */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                  <i className="bi bi-plus-circle mr-2 text-orange-500"></i> Nuevo Reporte
                </h3>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 sm:p-6 bg-gray-50">
                <FormularioCrearR onSuccess={handleClose} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Reporte */}
      {showModal2 && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose2}></div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                  <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Reporte
                </h3>
                <button onClick={handleClose2} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 sm:p-6 bg-gray-50">
                {selectedReporteId && (
                  <FormularioEditarR
                    reporteId={selectedReporteId}
                    onClose={handleClose2}
                    onSuccess={() => {
                      loadReportes()
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Enviar Modem */}
      {showEnvioModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseEnvio}></div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                  <i className="bi bi-router mr-2 text-orange-500"></i> Enviar Modem
                </h3>
                <button onClick={handleCloseEnvio} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 sm:p-6 bg-gray-50">
                {selectedReporteId && (
                  <FormularioEnvioM
                    farmacia={reportes.find((r) => r.id === selectedReporteId)?.farmacia}
                    onClose={() => {
                      handleCloseEnvio()
                      loadReportes()
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Ver Detalles */}
      {showDetalleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseDetalle}></div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                  <i className="bi bi-info-circle mr-2 text-orange-500"></i> Detalles del Reporte
                </h3>
                <button onClick={handleCloseDetalle} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 sm:p-6 bg-gray-50">
                {selectedReporteId && (
                  <div>
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                    ) : (
                      <>
                        {reportes.find((r) => r.id === selectedReporteId) && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-3 border-b pb-2">Información del Reporte</h5>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <tbody className="divide-y divide-gray-200">
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500 w-1/3">ID</th>
                                        <td className="px-4 py-3 text-gray-900">{reportes.find((r) => r.id === selectedReporteId)?.id}</td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Fecha</th>
                                        <td className="px-4 py-3 text-gray-900">{reportes.find((r) => r.id === selectedReporteId)?.fecha}</td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Inicio</th>
                                        <td className="px-4 py-3 text-gray-900">
                                          {formatFecha(reportes.find((r) => r.id === selectedReporteId)?.fechaHoraInicio)}{" "}
                                          {formatHora(reportes.find((r) => r.id === selectedReporteId)?.fechaHoraInicio)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Fin</th>
                                        <td className="px-4 py-3 text-gray-900">
                                          {reportes.find((r) => r.id === selectedReporteId)?.fechaHoraFin
                                            ? `${formatFecha(
                                              reportes.find((r) => r.id === selectedReporteId)?.fechaHoraFin as string,
                                            )} ${formatHora(
                                              reportes.find((r) => r.id === selectedReporteId)?.fechaHoraFin as string,
                                            )}`
                                            : "No establecido"}
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Duración</th>
                                        <td className="px-4 py-3 text-gray-900">{reportes.find((r) => r.id === selectedReporteId)?.duracionIncidente || "N/A"}</td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Estado</th>
                                        <td className="px-4 py-3">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reportes.find((r) => r.id === selectedReporteId)?.estado === "ABIERTO" ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {reportes.find((r) => r.id === selectedReporteId)?.estado}
                                          </span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Motivo</th>
                                        <td className="px-4 py-3 text-gray-900">
                                          {reportes.find((r) => r.id === selectedReporteId)?.motivo?.motivo || "Sin motivo"}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-3 border-b pb-2">Información de la Farmacia</h5>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <tbody className="divide-y divide-gray-200">
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500 w-1/3">Nombre</th>
                                        <td className="px-4 py-3 text-gray-900">{reportes.find((r) => r.id === selectedReporteId)?.farmacia?.nombre}</td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Dirección</th>
                                        <td className="px-4 py-3 text-gray-900">
                                          {reportes.find((r) => r.id === selectedReporteId)?.farmacia?.direccion || "N/A"}
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Ciudad</th>
                                        <td className="px-4 py-3 text-gray-900">
                                          {reportes.find((r) => r.id === selectedReporteId)?.farmacia?.ciudad?.nombreCiudad ||
                                            "N/A"}
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Proveedor</th>
                                        <td className="px-4 py-3 text-gray-900">
                                          {
                                            reportes.find((r) => r.id === selectedReporteId)?.farmacia?.proveedorInternet
                                              ?.nombre
                                          }
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Coordenadas</th>
                                        <td className="px-4 py-3 text-gray-900">
                                          {reportes.find((r) => r.id === selectedReporteId)?.farmacia?.coordenadas || "N/A"}
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="px-4 py-3 bg-gray-50 text-left font-medium text-gray-500">Cantidad Equipos</th>
                                        <td className="px-4 py-3 text-gray-900">
                                          {reportes.find((r) => r.id === selectedReporteId)?.farmacia?.cantidadEquipos || 0}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-3 border-b pb-2">Observaciones</h5>
                              <div className="p-4 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm">
                                {reportes.find((r) => r.id === selectedReporteId)?.observacion || "Sin observaciones"}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200 rounded-b-xl">
                <button
                  onClick={handleCloseDetalle}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cerrar
                </button>
                {selectedReporteId && (
                  <button
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm flex items-center gap-2"
                    onClick={() => {
                      handleCloseDetalle()
                      handleShow2()
                    }}
                  >
                    <i className="bi bi-pencil"></i>
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold m-0 text-gray-900">Reportes de Internet</h1>
          <nav className="text-sm text-gray-500 mt-1">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">Inicio <span className="mx-2 text-gray-300">/</span></li>
              <li className="font-medium text-gray-700">Reportes</li>
            </ol>
          </nav>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            ref={exportButtonRef}
            title="Exportar a Excel"
            onClick={exportToExcel}
            className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Exportar
          </button>
          <button
            title="Crear nuevo reporte"
            onClick={handleShow}
            className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <i className="bi bi-plus-circle-fill mr-2"></i> Nuevo Reporte
          </button>
        </div>
      </div>

      <div className="bg-white rounded-t-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[60vh] custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  onClick={() => handleSort("fecha")}
                  className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]"
                >
                  <input
                    type="date"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar fecha"
                    value={filterFecha}
                    onChange={(e) => setFilterFecha(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">FECHA <span className="text-gray-400">{getSortIcon("fecha")}</span></div>
                </th>
                <th
                  onClick={() => handleSort("farmacia")}
                  className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[180px]"
                >
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar farmacia"
                    value={filterFarmacia}
                    onChange={(e) => setFilterFarmacia(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">FARMACIA <span className="text-gray-400">{getSortIcon("farmacia")}</span></div>
                </th>
                <th
                  onClick={() => handleSort("inicio")}
                  className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]"
                >
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar inicio"
                    value={filterFechaHoraInicio}
                    onChange={(e) => setFilterFechaHoraInicio(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">INICIO <span className="text-gray-400">{getSortIcon("inicio")}</span></div>
                </th>
                <th
                  onClick={() => handleSort("fin")}
                  className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]"
                >
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar fin"
                    value={filterFechaHoraFin}
                    onChange={(e) => setFilterFechaHoraFin(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">FIN <span className="text-gray-400">{getSortIcon("fin")}</span></div>
                </th>
                <th
                  onClick={() => handleSort("duracion")}
                  className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[120px]"
                >
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar duración"
                    value={filterDuracionIncidente}
                    onChange={(e) => setFilterDuracionIncidente(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">DURACIÓN <span className="text-gray-400">{getSortIcon("duracion")}</span></div>
                </th>
                <th
                  onClick={() => handleSort("proveedor")}
                  className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]"
                >
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar proveedor"
                    value={filterProveedor}
                    onChange={(e) => setFilterProveedor(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">PROVEEDOR <span className="text-gray-400">{getSortIcon("proveedor")}</span></div>
                </th>
                <th
                  onClick={() => handleSort("motivo")}
                  className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]"
                >
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar motivo"
                    value={filterMotivo}
                    onChange={(e) => setFilterMotivo(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">MOTIVO <span className="text-gray-400">{getSortIcon("motivo")}</span></div>
                </th>
                <th
                  onClick={() => handleSort("estado")}
                  className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[120px]"
                >
                  <select
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Todos</option>
                    <option value="ABIERTO">ABIERTO</option>
                    <option value="CERRADO">CERRADO</option>
                  </select>
                  <div className="flex items-center justify-between">ESTADO <span className="text-gray-400">{getSortIcon("estado")}</span></div>
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 text-center align-top w-28">
                  <div className="flex flex-col items-center justify-center">
                    <button
                      className="p-1.5 mb-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded transition-colors tooltip flex items-center justify-center w-8 h-8"
                      title="Limpiar filtros"
                      onClick={clearFilters}
                    >
                      <i className="bi bi-brush"></i>
                    </button>
                    <span>Acciones</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentReportes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center mb-2">
                      <i className="bi bi-inbox text-3xl text-gray-300"></i>
                    </div>
                    No se encontraron reportes con los filtros aplicados
                  </td>
                </tr>
              ) : (
                currentReportes.map((reporte) => (
                  <tr key={reporte.id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="p-3 align-middle">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{reporte.fecha}</span>
                        <span className="text-xs text-gray-500 font-medium">ID: {reporte.id}</span>
                      </div>
                    </td>
                    <td className="p-3 align-middle text-gray-700">{reporte.farmacia?.nombre}</td>
                    <td className="p-3 align-middle">
                      <div className="flex flex-col text-gray-600">
                        <span>{formatFecha(reporte.fechaHoraInicio)}</span>
                        <span className="text-xs text-gray-400">{formatHora(reporte.fechaHoraInicio)}</span>
                      </div>
                    </td>
                    <td className="p-3 align-middle">
                      {reporte.fechaHoraFin ? (
                        <div className="flex flex-col text-gray-600">
                          <span>{formatFecha(reporte.fechaHoraFin)}</span>
                          <span className="text-xs text-gray-400">{formatHora(reporte.fechaHoraFin)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">No establecido</span>
                      )}
                    </td>
                    <td className="p-3 align-middle text-gray-600 font-mono text-sm">{reporte.duracionIncidente || "N/A"}</td>
                    <td className="p-3 align-middle text-gray-600">{reporte.farmacia?.proveedorInternet?.nombre}</td>
                    <td className="p-3 align-middle text-gray-600">
                      <div className="truncate max-w-[150px]" title={reporte.motivo?.motivo || "Sin motivo"}>
                        {reporte.motivo?.motivo || "Sin motivo"}
                      </div>
                    </td>
                    <td className="p-3 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${reporte.estado === "ABIERTO"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                        {reporte.estado === "ABIERTO" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {reporte.estado !== "ABIERTO" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
                        {reporte.estado}
                      </span>
                    </td>
                    <td className="p-3 align-middle">
                      <div className="flex justify-center gap-1.5">
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors border border-transparent hover:border-blue-600"
                          title="Ver detalles"
                          onClick={() => {
                            setSelectedReporteId(reporte.id)
                            handleShowDetalle()
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-transparent hover:border-orange-600"
                          title="Editar reporte"
                          onClick={() => {
                            setSelectedReporteId(reporte.id)
                            handleShow2()
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white transition-colors border border-transparent hover:border-purple-600"
                          title="Enviar Modem"
                          onClick={() => {
                            setSelectedReporteId(reporte.id)
                            handleShowEnvio()
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 13m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                            <path d="M17 17l0 .01" />
                            <path d="M13 17l0 .01" />
                            <path d="M15 13l0 -2" />
                            <path d="M11.75 8.75a4 4 0 0 1 6.5 0" />
                            <path d="M8.5 6.5a8 8 0 0 1 13 0" />
                          </svg>
                        </button>
                        {isAdmin && (
                          <button
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors border border-transparent hover:border-red-600"
                            title="Eliminar reporte"
                            onClick={() => handleDeleteReporte(reporte.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl px-4 py-3 flex items-center justify-between sm:px-6 shadow-sm">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 m-0">
              Mostrando <span className="font-medium">{currentReportes.length}</span> de <span className="font-medium">{filteredReportes().length}</span> reportes
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'
                  }`}
              >
                <i className="bi bi-chevron-double-left"></i>
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'
                  }`}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              <span className="relative inline-flex items-center px-4 py-2 border border-orange-500 bg-orange-50 text-sm font-medium text-orange-600">
                {currentPage}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'
                  }`}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'
                  }`}
              >
                <i className="bi bi-chevron-double-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReporteTable
