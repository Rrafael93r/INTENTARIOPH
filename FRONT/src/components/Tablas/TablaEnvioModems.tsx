"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Badge, FormControl, Card, Button, Spinner, Row, Col, Modal } from "react-bootstrap"
import Swal from "sweetalert2"
import { getEnvios, deleteEnvio } from "../../servicios/EnvioModemService"
import { format } from "date-fns"
import { Download } from "react-bootstrap-icons"
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
    numero_serie: string
  }
  modemSecundario?: {
    id: number
    marca: string
    modelo: string
    numero_serie: string
  }
  fecha_envio: string
  costo_envio: number
  estado_envio: string
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
    const matchModem = (envio?.modemPrincipal?.numero_serie || "").toLowerCase().includes(filterModem.toLowerCase())
    const matchFecha = envio?.fecha_envio
      ? format(new Date(envio.fecha_envio), "yyyy-MM-dd").includes(filterFecha)
      : true
    const matchEstado = (envio?.estado_envio || "").toLowerCase().includes(filterEstado.toLowerCase())

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
          valueA = a.modemPrincipal?.numero_serie?.toLowerCase() || ""
          valueB = b.modemPrincipal?.numero_serie?.toLowerCase() || ""
          break
        case "fecha":
          valueA = new Date(a.fecha_envio || 0).getTime()
          valueB = new Date(b.fecha_envio || 0).getTime()
          break
        case "costo":
          valueA = a.costo_envio || 0
          valueB = b.costo_envio || 0
          break
        case "estado":
          valueA = a.estado_envio?.toLowerCase() || ""
          valueB = b.estado_envio?.toLowerCase() || ""
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
      "Número Serie": envio.modemPrincipal?.numero_serie || "",
      "Fecha Envío": envio.fecha_envio ? format(new Date(envio.fecha_envio), "dd/MM/yyyy") : "",
      "Costo Envío": envio.costo_envio || 0,
      Estado: envio.estado_envio || "",
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
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    )
  }

  if (error && envios.length === 0) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <>
      {/* Modal para Editar Envío */}
      <Modal show={showEditModal} onHide={handleCloseEdit} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Envío
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEnvioId && (
            <FormularioEditarEnvio
              envioId={selectedEnvioId}
              onClose={handleCloseEdit}
              onSuccess={() => {
                loadEnvios()
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      <div className="d-flex align-items-center mb-3" style={{ color: "black" }}>
        <div className="pagetitle">
          <h1>Envíos de Módems</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Inicio</li>
              <li className="breadcrumb-item active">Envíos</li>
            </ol>
          </nav>
        </div>
        <div className="ms-auto">
          <Button title="Exportar a Excel" onClick={exportToExcel} className="btn me-2" variant="success">
            <Download className="me-1" /> Exportar
          </Button>
          
        </div>
      </div>

      <div className="p-2" style={{ backgroundColor: "#ffff", borderRadius: "0.6rem" }}>
        <Row className="mb-2">
          <Col>
            <small className="text-muted">
              Mostrando {currentEnvios.length} de {filteredEnvios.length} envíos
            </small>
          </Col>
        </Row>

        <div className="table-responsive" style={{ maxHeight: "50vh" }}>
          <table className="table table-hover text-nowrap">
            <thead>
              <tr>
                <th onClick={() => handleSort("farmacia")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar farmacia"
                    value={filterFarmacia}
                    onChange={(e) => setFilterFarmacia(e.target.value)}
                  />
                  FARMACIA {getSortIcon("farmacia")}
                </th>
                <th onClick={() => handleSort("modem")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar módem"
                    value={filterModem}
                    onChange={(e) => setFilterModem(e.target.value)}
                  />
                  MÓDEM {getSortIcon("modem")}
                </th>
                <th onClick={() => handleSort("fecha")} style={{ cursor: "pointer" }}>
                  <FormControl
                    size="sm"
                    type="date"
                    value={filterFecha}
                    onChange={(e) => setFilterFecha(e.target.value)}
                  />
                  FECHA ENVÍO {getSortIcon("fecha")}
                </th>
                <th onClick={() => handleSort("costo")} style={{ cursor: "pointer" }}>
                  COSTO ENVÍO {getSortIcon("costo")}
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
              {currentEnvios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-3">
                    No se encontraron envíos con los filtros aplicados
                  </td>
                </tr>
              ) : (
                currentEnvios.map((envio) => (
                  <tr key={envio?.id || Math.random()}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <div>{envio?.farmacia?.nombre}</div>
                          <small className="text-muted">ID: {envio?.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        {envio?.modemPrincipal?.marca} - {envio?.modemPrincipal?.modelo}
                      </div>
                      <small className="text-muted">Serie: {envio?.modemPrincipal?.numero_serie}</small>
                      {envio?.modemSecundario && (
                        <div>
                          <small className="text-info">
                            + {envio.modemSecundario.marca} - {envio.modemSecundario.modelo}
                          </small>
                        </div>
                      )}
                    </td>
                    <td>{envio?.fecha_envio ? format(new Date(envio.fecha_envio), "dd/MM/yyyy") : "N/A"}</td>
                    <td>${envio?.costo_envio?.toLocaleString("es-CO") ?? ""}</td>
                    <td>
                      <Badge
                        bg={
                          envio?.estado_envio === "ENTREGADO"
                            ? "success"
                            : envio?.estado_envio === "DEVUELTO"
                              ? "danger"
                              : envio?.estado_envio === "EN CAMINO"
                                ? "primary"
                                : "warning"
                        }
                      >
                        {envio?.estado_envio || "Desconocido"}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end btn-group">
                        <button
                          className="btn btn-light btn-sm"
                          style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
                          onClick={() => handleShowEdit(envio?.id)}
                          title="Editar envío"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        {/* Solo mostrar el botón de eliminar para administradores */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(envio?.id)}
                            className="btn btn-light btn-sm"
                            style={{ backgroundColor: "#dc3545", color: "#fff", borderColor: "#dc3545" }}
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
            Mostrando {currentEnvios.length} de {filteredEnvios.length} envíos
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

export default EnviosTable
