"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { getModems, deleteModems, updateModemStatus } from "../../servicios/modemService"
import { getCurrentUser } from "../../servicios/authServices"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import FormularioCrearModem from "../FormulariosCrear/FormularioCrearM"
import FormularioEditarModem from "../FormulariosEditar.tsx/FormularioEditarM"

interface iModems {
  id: number
  estado: string
  marca: string
  modelo: string
  numeroSerie: string
  farmacia: {
    id: number
    nombre: string
  }
  proveedorInternet: {
    id: number
    nombre: string
  }
  numero: number
  isDeleted: boolean
}

const ModemsTable: React.FC = () => {
  const [modems, setModems] = useState<iModems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedModemId, setSelectedModemId] = useState<number | null>(null)

  // Filtros
  const [filterEstado, setFilterEstado] = useState<string>("")
  const [filterMarca, setFilterMarca] = useState<string>("")
  const [filterModelo, setFilterModelo] = useState<string>("")
  const [filterNumeroSerie, setFilterNumeroSerie] = useState<string>("")
  const [filterUbicacion, setFilterUbicacion] = useState<string>("")
  const [filterOperador, setFilterOperador] = useState<string>("")
  const [filterNumero, setFilterNumero] = useState<string>("")

  // Estado para ordenamiento
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleShowCreate = () => setShowCreateModal(true)
  const handleCloseCreate = () => {
    setShowCreateModal(false)
    loadModems() // Recargar modems al cerrar el modal de creación
  }

  const handleShowEdit = (modemId: number) => {
    setSelectedModemId(modemId)
    setShowEditModal(true)
  }
  const handleCloseEdit = () => {
    setShowEditModal(false)
    setSelectedModemId(null)
    loadModems() // Recargar modems al cerrar el modal de edición
  }

  useEffect(() => {
    // Obtener el usuario actual al cargar el componente
    const user = getCurrentUser()
    setCurrentUser(user)
    loadModems()
  }, [])

  const loadModems = async () => {
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

      const data = await getModems()

      if (Array.isArray(data)) {
        setModems(data)
      } else {
        setError("Los datos recibidos no son válidos")
      }
    } catch (error) {
      setError("Error al cargar el listado de Módems")
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la lista de módems",
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

  const filteredModems = modems.filter((modem) => {
    const matchEstado = (modem.estado || "").toLowerCase().includes(filterEstado.toLowerCase())
    const matchOperador = (modem.proveedorInternet?.nombre || "").toLowerCase().includes(filterOperador.toLowerCase())
    const matchMarca = (modem.marca || "").toLowerCase().includes(filterMarca.toLowerCase())
    const matchModelo = (modem.modelo || "").toLowerCase().includes(filterModelo.toLowerCase())
    const matchNumeroSerie = (modem.numeroSerie || "").toLowerCase().includes(filterNumeroSerie.toLowerCase())
    const matchUbicacion = (modem.farmacia?.nombre || "").toLowerCase().includes(filterUbicacion.toLowerCase())
    const matchNumero = (modem.numero?.toString() || "").includes(filterNumero)

    return (
      matchEstado && matchOperador && matchMarca && matchModelo && matchNumeroSerie && matchUbicacion && matchNumero
    )
  })

  const sortedModems = () => {
    if (!sortField) return filteredModems

    return [...filteredModems].sort((a, b) => {
      let valueA, valueB

      // Determinar qué valores comparar según el campo
      switch (sortField) {
        case "marca":
          valueA = a.marca?.toLowerCase() || ""
          valueB = b.marca?.toLowerCase() || ""
          break
        case "modelo":
          valueA = a.modelo?.toLowerCase() || ""
          valueB = b.modelo?.toLowerCase() || ""
          break
        case "serial":
          valueA = a.numeroSerie?.toLowerCase() || ""
          valueB = b.numeroSerie?.toLowerCase() || ""
          break
        case "ubicacion":
          valueA = a.farmacia?.nombre?.toLowerCase() || ""
          valueB = b.farmacia?.nombre?.toLowerCase() || ""
          break
        case "operador":
          valueA = a.proveedorInternet?.nombre?.toLowerCase() || ""
          valueB = b.proveedorInternet?.nombre?.toLowerCase() || ""
          break
        case "numero":
          valueA = a.numero || 0
          valueB = b.numero || 0
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
  const currentModems = sortedModems().slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedModems().length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber)

  const clearFilters = () => {
    setFilterEstado("")
    setFilterMarca("")
    setFilterModelo("")
    setFilterNumeroSerie("")
    setFilterUbicacion("")
    setFilterOperador("")
    setFilterNumero("")
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
        await deleteModems(id)
        await loadModems()

        Swal.fire("¡Eliminado!", "El Módem ha sido eliminado.", "success")
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el Módem",
      })
    }
  }

  const handleChangeStatus = async (id: number, newStatus: string) => {
    try {
      Swal.fire({
        title: "Actualizando estado...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      await updateModemStatus(id, newStatus)

      // Actualizar el estado en la lista local
      setModems((prevModems) => prevModems.map((modem) => (modem.id === id ? { ...modem, estado: newStatus } : modem)))

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Estado actualizado correctamente",
        timer: 1500,
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el estado del módem",
      })
    }
  }

  const exportToExcel = () => {
    // Preparar los datos para exportar
    const dataToExport = filteredModems.map((modem) => ({
      ID: modem.id,
      Marca: modem.marca || "",
      Modelo: modem.modelo || "",
      "Número Serie": modem.numeroSerie || "",
      Ubicación: modem.farmacia?.nombre || "",
      Operador: modem.proveedorInternet?.nombre || "",
      Número: modem.numero || "",
      Estado: modem.estado || "",
    }))

    // Crear libro de trabajo y hoja
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(dataToExport)

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Modems")

    // Guardar el archivo
    XLSX.writeFile(wb, `modems_${format(new Date(), "yyyyMMdd")}.xlsx`)
  }

  // Verificar si el usuario es administrador (roleId 1)
  const isAdmin = currentUser?.roleId === 1

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <>
      {/* Modal para Crear Módem */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseCreate}></div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                  <i className="bi bi-plus-circle mr-2 text-orange-500"></i> Nuevo Módem
                </h3>
                <button onClick={handleCloseCreate} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 sm:p-6 bg-gray-50">
                <FormularioCrearModem onSuccess={handleCloseCreate} onClose={handleCloseCreate} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Módem */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseEdit}></div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                  <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Módem
                </h3>
                <button onClick={handleCloseEdit} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 sm:p-6 bg-gray-50">
                {selectedModemId && (
                  <FormularioEditarModem
                    modemId={selectedModemId}
                    onClose={handleCloseEdit}
                    onSuccess={() => {
                      loadModems()
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold m-0 text-gray-900">Gestión de Módems</h1>
          <nav className="text-sm text-gray-500 mt-1">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">Inicio <span className="mx-2 text-gray-300">/</span></li>
              <li className="font-medium text-gray-700">Módems</li>
            </ol>
          </nav>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            title="Exportar a Excel"
            onClick={exportToExcel}
            className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <Download className="mr-2" size={16} /> Exportar
          </button>
          <button
            onClick={handleShowCreate}
            className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <i className="bi bi-plus-circle-fill mr-2"></i> Nuevo Módem
          </button>
        </div>
      </div>

      <div className="bg-white rounded-t-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[60vh] custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th onClick={() => handleSort("marca")} className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar marca"
                    value={filterMarca}
                    onChange={(e) => setFilterMarca(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">MARCA <span className="text-gray-400">{getSortIcon("marca")}</span></div>
                </th>
                <th onClick={() => handleSort("modelo")} className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar modelo"
                    value={filterModelo}
                    onChange={(e) => setFilterModelo(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">MODELO <span className="text-gray-400">{getSortIcon("modelo")}</span></div>
                </th>
                <th onClick={() => handleSort("serial")} className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar serial"
                    value={filterNumeroSerie}
                    onChange={(e) => setFilterNumeroSerie(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">SERIAL <span className="text-gray-400">{getSortIcon("serial")}</span></div>
                </th>
                <th onClick={() => handleSort("ubicacion")} className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[180px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar ubicación"
                    value={filterUbicacion}
                    onChange={(e) => setFilterUbicacion(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">UBICACIÓN <span className="text-gray-400">{getSortIcon("ubicacion")}</span></div>
                </th>
                <th onClick={() => handleSort("operador")} className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar operador"
                    value={filterOperador}
                    onChange={(e) => setFilterOperador(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">OPERADOR <span className="text-gray-400">{getSortIcon("operador")}</span></div>
                </th>
                <th onClick={() => handleSort("numero")} className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar número"
                    value={filterNumero}
                    onChange={(e) => setFilterNumero(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">NÚMERO <span className="text-gray-400">{getSortIcon("numero")}</span></div>
                </th>
                <th onClick={() => handleSort("estado")} className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar estado"
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center justify-between">ESTADO <span className="text-gray-400">{getSortIcon("estado")}</span></div>
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 text-center align-top w-24">
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
              {currentModems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center mb-2">
                      <i className="bi bi-inbox text-3xl text-gray-300"></i>
                    </div>
                    No se encontraron módems con los filtros aplicados
                  </td>
                </tr>
              ) : (
                currentModems.map((modem) => (
                  <tr key={modem.id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="p-3 align-middle">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{modem.marca}</span>
                        <span className="text-xs text-gray-500 font-medium">ID: {modem.id}</span>
                      </div>
                    </td>
                    <td className="p-3 align-middle text-gray-600">{modem.modelo}</td>
                    <td className="p-3 align-middle font-mono text-sm text-gray-600">{modem.numeroSerie}</td>
                    <td className="p-3 align-middle text-gray-700">{modem.farmacia?.nombre || "No asignado"}</td>
                    <td className="p-3 align-middle text-gray-600">{modem.proveedorInternet?.nombre}</td>
                    <td className="p-3 align-middle text-gray-600">{modem.numero}</td>
                    <td className="p-3 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${modem.estado === "DISPONIBLE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                        {modem.estado === "DISPONIBLE" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {modem.estado !== "DISPONIBLE" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
                        {modem.estado}
                      </span>
                    </td>
                    <td className="p-3 align-middle">
                      <div className="flex justify-center gap-2">
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-transparent hover:border-orange-600"
                          title="Editar"
                          onClick={() => handleShowEdit(modem.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors border ${modem.estado === "DISPONIBLE"
                            ? "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border-transparent hover:border-red-600"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border-transparent hover:border-emerald-600"
                            }`}
                          title={modem.estado === "DISPONIBLE" ? "Marcar en uso" : "Marcar disponible"}
                          onClick={() =>
                            handleChangeStatus(modem.id, modem.estado === "DISPONIBLE" ? "EN USO" : "DISPONIBLE")
                          }
                        >
                          <i className={`bi bi-${modem.estado === "DISPONIBLE" ? "x-circle" : "check-circle"}`}></i>
                        </button>
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
              Mostrando <span className="font-medium">{currentModems.length}</span> de <span className="font-medium">{filteredModems.length}</span> módems
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

export default ModemsTable
