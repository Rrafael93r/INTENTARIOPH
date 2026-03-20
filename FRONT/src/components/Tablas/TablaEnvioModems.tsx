"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { getEnvios, deleteEnvio } from "../../servicios/EnvioModemService"
import { format } from "date-fns"
import * as XLSX from "xlsx"
import { getCurrentUser } from "../../servicios/authServices"
import FormularioEditarEnvio from "../FormulariosEditar.tsx/FormularioEditarEnvioM"

interface IEnvio {
  id: number
  farmacia: {
    id: number
    nombre: string
  }
  modemPrincipal: {
    id: number
    marca: string
    modelo: string
    numeroSerie: string
  }
  modemSecundario?: {
    id: number
    marca: string
    modelo: string
    numeroSerie: string
  }
  fechaEnvio: string
  costoEnvio: number
  estadoEnvio: string
}

const EnviosTable: React.FC = () => {
  const [envios, setEnvios] = useState<IEnvio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Modales
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEnvioId, setSelectedEnvioId] = useState<number | null>(null)

  // Filtros
  const [filterFarmacia, setFilterFarmacia] = useState<string>("")
  const [filterModem, setFilterModem] = useState<string>("")
  const [filterFecha, setFilterFecha] = useState<string>("")
  const [filterEstado, setFilterEstado] = useState<string>("")

  // Estado para ordenamiento
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleShowEdit = (envioId: number) => {
    setSelectedEnvioId(envioId)
    setShowEditModal(true)
  }

  const handleCloseEdit = () => {
    setShowEditModal(false)
    setSelectedEnvioId(null)
    loadEnvios() // Recargar envíos al cerrar el modal de edición
  }

  useEffect(() => {
    // Obtener el usuario actual al cargar el componente
    const user = getCurrentUser()
    setCurrentUser(user)
    loadEnvios()
  }, [])

  const loadEnvios = async () => {
    try {
      Swal.fire({
        title: "Cargando tabla...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const data = await getEnvios()
      setEnvios(data)
    } catch (error) {
      setError("Error al cargar el listado de envíos")
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de envíos",
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
      // Si es un nuevo campo, establecemos ese campo y dirección ascendente
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? "↑" : "↓"
  }

  const filteredEnvios = envios.filter((envio) => {
    const matchFarmacia = (envio?.farmacia?.nombre || "").toLowerCase().includes(filterFarmacia.toLowerCase())
    const matchModem = (envio?.modemPrincipal?.numeroSerie || "").toLowerCase().includes(filterModem.toLowerCase())
    const matchFecha = envio?.fechaEnvio
      ? format(new Date(envio.fechaEnvio), "yyyy-MM-dd").includes(filterFecha)
      : true
    const matchEstado = (envio?.estadoEnvio || "").toLowerCase().includes(filterEstado.toLowerCase())

    return matchFarmacia && matchModem && matchFecha && matchEstado
  })

  const sortedEnvios = () => {
    if (!sortField) return filteredEnvios

    return [...filteredEnvios].sort((a, b) => {
      let valueA, valueB

      // Determinar qué valores comparar según el campo
      switch (sortField) {
        case "farmacia":
          valueA = a.farmacia?.nombre?.toLowerCase() || ""
          valueB = b.farmacia?.nombre?.toLowerCase() || ""
          break
        case "modem":
          valueA = a.modemPrincipal?.numeroSerie?.toLowerCase() || ""
          valueB = b.modemPrincipal?.numeroSerie?.toLowerCase() || ""
          break
        case "fecha":
          valueA = new Date(a.fechaEnvio || 0).getTime()
          valueB = new Date(b.fechaEnvio || 0).getTime()
          break
        case "costo":
          valueA = a.costoEnvio || 0
          valueB = b.costoEnvio || 0
          break
        case "estado":
          valueA = a.estadoEnvio?.toLowerCase() || ""
          valueB = b.estadoEnvio?.toLowerCase() || ""
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
  const currentEnvios = sortedEnvios().slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEnvios.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber)

  const clearFilters = () => {
    setFilterFarmacia("")
    setFilterModem("")
    setFilterFecha("")
    setFilterEstado("")
  }

  const handleDelete = async (id: number) => {
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
        await deleteEnvio(id)
        await loadEnvios()

        Swal.fire("¡Eliminado!", "El envío ha sido eliminado.", "success")
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el envío",
      })
    }
  }

  const exportToExcel = () => {
    // Preparar los datos para exportar
    const dataToExport = filteredEnvios.map((envio) => ({
      ID: envio.id,
      Farmacia: envio.farmacia?.nombre || "",
      "Módem Marca": envio.modemPrincipal?.marca || "",
      "Módem Modelo": envio.modemPrincipal?.modelo || "",
      "Número Serie": envio.modemPrincipal?.numeroSerie || "",
      "Fecha Envío": envio.fechaEnvio ? format(new Date(envio.fechaEnvio), "dd/MM/yyyy") : "",
      "Costo Envío": envio.costoEnvio || 0,
      Estado: envio.estadoEnvio || "",
    }))

    // Crear libro de trabajo y hoja
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(dataToExport)

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Envíos")

    // Guardar el archivo
    XLSX.writeFile(wb, `envios_${format(new Date(), "yyyyMMdd")}.xlsx`)
  }

  // Verificar si el usuario es administrador (roleId 1)
  const isAdmin = currentUser?.roleId === 1

  if (loading && envios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error && envios.length === 0) {
    return <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseEdit}></div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                  <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Envío
                </h3>
                <button onClick={handleCloseEdit} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 sm:p-6 bg-gray-50">
                {selectedEnvioId && (
                  <FormularioEditarEnvio
                    envioId={selectedEnvioId}
                    onClose={handleCloseEdit}
                    onSuccess={() => {
                      loadEnvios()
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-5 border-b border-gray-100 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 m-0 flex items-center gap-2">
              Envíos de Módems
            </h2>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3 mt-1 text-sm text-gray-500">
                <li className="inline-flex items-center">Inicio</li>
                <li>
                  <div className="flex items-center">
                    <i className="bi bi-chevron-right mx-2 text-gray-400"></i>
                    <span className="font-semibold text-gray-800">Envíos</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={exportToExcel}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
            >
              <i className="bi bi-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
            placeholder="Filtrar Farmacia..."
            value={filterFarmacia}
            onChange={(e) => setFilterFarmacia(e.target.value)}
          />
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
            placeholder="Filtrar Módem..."
            value={filterModem}
            onChange={(e) => setFilterModem(e.target.value)}
          />
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
          />
          <div className="flex gap-2 lg:col-span-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
              placeholder="Filtrar Estado..."
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            />
            <button
              onClick={clearFilters}
              title="Limpiar filtros"
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              <i className='bi bi-eraser-fill'></i>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold cursor-pointer">
              <th className="p-3 hover:bg-gray-100" onClick={() => handleSort("farmacia")}>FARMACIA {getSortIcon("farmacia")}</th>
              <th className="p-3 hover:bg-gray-100" onClick={() => handleSort("modem")}>MÓDEM {getSortIcon("modem")}</th>
              <th className="p-3 hover:bg-gray-100" onClick={() => handleSort("fecha")}>FECHA ENVÍO {getSortIcon("fecha")}</th>
              <th className="p-3 hover:bg-gray-100" onClick={() => handleSort("costo")}>COSTO ENVÍO {getSortIcon("costo")}</th>
              <th className="p-3 hover:bg-gray-100" onClick={() => handleSort("estado")}>ESTADO {getSortIcon("estado")}</th>
              <th className="p-3 text-center cursor-default">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {currentEnvios.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <i className="bi bi-inbox text-4xl text-gray-300 mb-2"></i>
                    <p>No se encontraron envíos con los filtros aplicados.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentEnvios.map((envio) => (
                <tr key={envio?.id || Math.random()} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 align-middle text-sm text-gray-800">
                    <div className="font-medium text-gray-900">{envio?.farmacia?.nombre}</div>
                    <div className="text-xs text-gray-500">ID: {envio?.id}</div>
                  </td>
                  <td className="p-3 align-middle text-sm text-gray-800">
                    <div>{envio?.modemPrincipal?.marca} - {envio?.modemPrincipal?.modelo}</div>
                    <div className="text-xs text-gray-500">Serie: {envio?.modemPrincipal?.numeroSerie}</div>
                    {envio?.modemSecundario && (
                      <div className="text-xs text-blue-600 mt-1">
                        + {envio.modemSecundario.marca} - {envio.modemSecundario.modelo}
                      </div>
                    )}
                  </td>
                  <td className="p-3 align-middle text-sm text-gray-800">{envio?.fechaEnvio ? format(new Date(envio.fechaEnvio), "dd/MM/yyyy") : "N/A"}</td>
                  <td className="p-3 align-middle text-sm text-gray-800">${envio?.costoEnvio?.toLocaleString("es-CO") ?? ""}</td>
                  <td className="p-3 align-middle">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${envio?.estadoEnvio === "ENTREGADO" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        envio?.estadoEnvio === "DEVUELTO" ? "bg-red-50 text-red-700 border-red-200" :
                          envio?.estadoEnvio === "EN CAMINO" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                      {envio?.estadoEnvio || "Desconocido"}
                    </span>
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex justify-center gap-2">
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-transparent hover:border-orange-600"
                        onClick={() => handleShowEdit(envio?.id)}
                        title="Editar envío"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(envio?.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-transparent hover:border-red-600"
                          title="Eliminar envío"
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

      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 m-0">
              Mostrando <span className="font-medium">{currentEnvios.length}</span> de <span className="font-medium">{filteredEnvios.length}</span> envíos
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'}`}
              >
                <i className="bi bi-chevron-double-left"></i>
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'}`}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-orange-500 bg-orange-50 text-sm font-medium text-orange-600">
                {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'}`}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'}`}
              >
                <i className="bi bi-chevron-double-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnviosTable
