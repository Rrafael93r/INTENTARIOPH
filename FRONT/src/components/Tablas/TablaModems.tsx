"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Badge, FormControl, Card, Button, Spinner, Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import { getModems, deleteModems, updateModemStatus } from "../../servicios/modemService"
import { getCurrentUser } from "../../servicios/authServices"
import { Download } from "react-bootstrap-icons"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import FormularioCrearModem from "../FormulariosCrear/FormularioCrearM"
import FormularioEditarModem from "../FormulariosEditar.tsx/FormularioEditarM"

interface iModems {
  id: number
  estado: string
  marca: string
  modelo: string
  numero_serie: string
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
      Swal.fire({
        title: "Cargando tabla...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const data = await getModems()
      setModems(data)
    } catch (error) {
      setError("Error al cargar el listado de Módems")
      console.error(error)
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
    const matchEstado = modem.estado?.toLowerCase().includes(filterEstado.toLowerCase())
    const matchOperador = modem.proveedorInternet?.nombre?.toLowerCase().includes(filterOperador.toLowerCase())
    const matchMarca = modem.marca?.toLowerCase().includes(filterMarca.toLowerCase())
    const matchModelo = modem.modelo?.toLowerCase().includes(filterModelo.toLowerCase())
    const matchNumeroSerie = modem.numero_serie?.toLowerCase().includes(filterNumeroSerie.toLowerCase())
    const matchUbicacion = modem.farmacia?.nombre?.toLowerCase().includes(filterUbicacion.toLowerCase())
    const matchNumero = modem.numero?.toString().includes(filterNumero)

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
          valueA = a.numero_serie?.toLowerCase() || ""
          valueB = b.numero_serie?.toLowerCase() || ""
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
      console.error("Error al eliminar:", error)
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
      console.error("Error al actualizar estado:", error)
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
      "Número Serie": modem.numero_serie || "",
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
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <>
      {/* Modal para Crear Módem */}
      <Modal show={showCreateModal} onHide={handleCloseCreate} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Módem
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioCrearModem onSuccess={handleCloseCreate} onClose={handleCloseCreate} />
        </Modal.Body>
      </Modal>

      {/* Modal para Editar Módem */}
      <Modal show={showEditModal} onHide={handleCloseEdit} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Módem
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedModemId && (
            <FormularioEditarModem
              modemId={selectedModemId}
              onClose={handleCloseEdit}
              onSuccess={() => {
                loadModems()
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      <div className="d-flex align-items-center mb-3" style={{ color: "black" }}>
        <div className="pagetitle">
          <h1>Gestión de Módems</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Inicio</li>
              <li className="breadcrumb-item active">Módems</li>
            </ol>
          </nav>
        </div>
        <div className="ms-auto">
          <Button title="Exportar a Excel" onClick={exportToExcel} className="btn me-2" variant="success">
            <Download className="me-1" /> Exportar
          </Button>
          <Button
            onClick={handleShowCreate}
            className="btn"
            style={{ backgroundColor: "#f6952c", borderColor: "#f6952c", color: "#fff" }}
          >
            <i className="bi bi-plus-circle-fill me-2"></i> Nuevo Módem
          </Button>
        </div>
      </div>

      <div className="p-2" style={{ backgroundColor: "#ffff", borderRadius: "0.6rem" }}>
        <div className="table-responsive" style={{ maxHeight: "50vh" }}>
          <table className="table table-hover text-nowrap">
            <thead>
              <tr>
                <th onClick={() => handleSort("marca")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar marca"
                    value={filterMarca}
                    onChange={(e) => setFilterMarca(e.target.value)}
                  />
                  MARCA {getSortIcon("marca")}
                </th>
                <th onClick={() => handleSort("modelo")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar modelo"
                    value={filterModelo}
                    onChange={(e) => setFilterModelo(e.target.value)}
                  />
                  MODELO {getSortIcon("modelo")}
                </th>
                <th onClick={() => handleSort("serial")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar serial"
                    value={filterNumeroSerie}
                    onChange={(e) => setFilterNumeroSerie(e.target.value)}
                  />
                  SERIAL {getSortIcon("serial")}
                </th>
                <th onClick={() => handleSort("ubicacion")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar ubicación"
                    value={filterUbicacion}
                    onChange={(e) => setFilterUbicacion(e.target.value)}
                  />
                  UBICACIÓN {getSortIcon("ubicacion")}
                </th>
                <th onClick={() => handleSort("operador")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar operador"
                    value={filterOperador}
                    onChange={(e) => setFilterOperador(e.target.value)}
                  />
                  OPERADOR {getSortIcon("operador")}
                </th>
                <th onClick={() => handleSort("numero")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar número"
                    value={filterNumero}
                    onChange={(e) => setFilterNumero(e.target.value)}
                  />
                  NÚMERO {getSortIcon("numero")}
                </th>
                <th onClick={() => handleSort("estado")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar estado"
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                  />
                  ESTADO {getSortIcon("estado")}
                </th>
                <th className="text-center">
                  <button
                    className="btn btn-light btn-sm"
                    style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
                    onClick={clearFilters}
                  >
                    <i className="bi bi-brush" />
                  </button>
                  <span style={{ display: "block", marginTop: "4px" }}>Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentModems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-3">
                    No se encontraron módems con los filtros aplicados
                  </td>
                </tr>
              ) : (
                currentModems.map((modem) => (
                  <tr key={modem.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <div>{modem.marca}</div>
                          <small className="text-muted">ID: {modem.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{modem.modelo}</td>
                    <td>{modem.numero_serie}</td>
                    <td>{modem.farmacia?.nombre || "No asignado"}</td>
                    <td>{modem.proveedorInternet?.nombre}</td>
                    <td>{modem.numero}</td>
                    <td>
                      <Badge bg={modem.estado === "DISPONIBLE" ? "success" : "danger"}>{modem.estado}</Badge>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end btn-group">
                        <button
                          className="btn btn-light btn-sm"
                          style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
                          onClick={() => handleShowEdit(modem.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* Botón para cambiar estado */}
                        <button
                          className="btn btn-light btn-sm"
                          style={{
                            backgroundColor: modem.estado === "DISPONIBLE" ? "#dc3545" : "#28a745",
                            color: "#fff",
                            borderColor: modem.estado === "DISPONIBLE" ? "#dc3545" : "#28a745",
                          }}
                          onClick={() =>
                            handleChangeStatus(modem.id, modem.estado === "DISPONIBLE" ? "EN USO" : "DISPONIBLE")
                          }
                        >
                          <i className={`bi bi-${modem.estado === "DISPONIBLE" ? "x-circle" : "check-circle"}`}></i>
                        </button>

                        {/* Solo mostrar el botón de eliminar para administradores */}
                        {isAdmin && (
                          <button
                            className="btn btn-light btn-sm"
                            style={{ backgroundColor: "#dc3545", color: "#fff", borderColor: "#dc3545" }}
                            onClick={() => handleDelete(modem.id)}
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
      <Card.Footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#ffff",
          borderRadius: "0 0 0.6rem 0.6rem",
        }}
      >
        <div>
          <small className="text-muted">
            Mostrando {currentModems.length} de {filteredModems.length} módems
          </small>
        </div>
        <ul className="pagination pagination-sm">
          <li className={`m-1 page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
              onClick={() => handlePageChange(1)}
            >
              <i className="bi bi-chevron-double-left"></i>
            </button>
          </li>
          <li className={`m-1 page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>
          <li className="m-1 page-item active">
            <span className="page-link" style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}>
              {currentPage}
            </span>
          </li>
          <li className={`m-1 page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
          <li className={`m-1 page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
              onClick={() => handlePageChange(totalPages)}
            >
              <i className="bi bi-chevron-double-right"></i>
            </button>
          </li>
        </ul>
      </Card.Footer>
    </>
  )
}

export default ModemsTable
