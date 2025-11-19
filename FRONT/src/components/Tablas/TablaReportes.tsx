"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Badge, FormControl, Card, Modal, Button, Spinner, Row, Col, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import { getReporte, deleteReporte } from "../../servicios/reportesService"
import FormularioCrearR from "../FormulariosCrear/FormularioCrearR"
import FormularioEditarR from "../FormulariosEditar.tsx/FormularioEditarR"
import FormularioEnvioM from "../FormulariosCrear/FormularioEnvioM"
import { format } from "date-fns"
import { Download, ArrowUp, ArrowDown } from "react-bootstrap-icons"
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
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc") // Por defecto ordenamos descendente (más recientes primero)

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
        return new Date(b.fecha_hora_inicio).getTime() - new Date(a.fecha_hora_inicio).getTime()
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
    return sortDirection === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
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
      const fechaHoraInicioStr = reporte?.fecha_hora_inicio
        ? format(new Date(reporte.fecha_hora_inicio), "yyyy-MM-dd HH:mm:ss").toLowerCase()
        : ""
      const fechaHoraFinStr = reporte?.fecha_hora_fin
        ? format(new Date(reporte.fecha_hora_fin), "yyyy-MM-dd HH:mm:ss").toLowerCase()
        : ""
      const duracionStr = reporte?.duracion_incidente?.toLowerCase() || ""
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
          valueA = new Date(a.fecha_hora_inicio || 0).getTime()
          valueB = new Date(b.fecha_hora_inicio || 0).getTime()
          break
        case "fin":
          valueA = new Date(a.fecha_hora_fin || 0).getTime()
          valueB = new Date(b.fecha_hora_fin || 0).getTime()
          break
        case "duracion":
          valueA = a.duracion_incidente?.toLowerCase() || ""
          valueB = b.duracion_incidente?.toLowerCase() || ""
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
      "Fecha/Hora Inicio": reporte.fecha_hora_inicio
        ? format(new Date(reporte.fecha_hora_inicio), "yyyy-MM-dd HH:mm:ss")
        : "",
      "Fecha/Hora Fin": reporte.fecha_hora_fin ? format(new Date(reporte.fecha_hora_fin), "yyyy-MM-dd HH:mm:ss") : "",
      Duración: reporte.duracion_incidente || "",
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
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    )
  }

  if (error && reportes.length === 0) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <>
      {/* Modal para Crear Reporte */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Reporte
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioCrearR onSuccess={handleClose} />
        </Modal.Body>
      </Modal>

      {/* Modal para Editar Reporte */}
      <Modal show={showModal2} onHide={handleClose2} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Reporte
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReporteId && (
            <FormularioEditarR
              reporteId={selectedReporteId}
              onClose={handleClose2}
              onSuccess={() => {
                loadReportes()
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para Enviar Modem */}
      <Modal show={showEnvioModal} onHide={handleCloseEnvio} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-router me-2"></i>
            Enviar Modem
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReporteId && (
            <FormularioEnvioM
              farmacia={reportes.find((r) => r.id === selectedReporteId)?.farmacia}
              onClose={() => {
                handleCloseEnvio()
                loadReportes()
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para Ver Detalles */}
      <Modal show={showDetalleModal} onHide={handleCloseDetalle} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-info-circle me-2"></i>
            Detalles del Reporte
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReporteId && (
            <div>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  {reportes.find((r) => r.id === selectedReporteId) && (
                    <div>
                      <Row className="mb-4">
                        <Col md={6}>
                          <h5>Información del Reporte</h5>
                          <table className="table table-bordered">
                            <tbody>
                              <tr>
                                <th>ID</th>
                                <td>{reportes.find((r) => r.id === selectedReporteId)?.id}</td>
                              </tr>
                              <tr>
                                <th>Fecha</th>
                                <td>{reportes.find((r) => r.id === selectedReporteId)?.fecha}</td>
                              </tr>
                              <tr>
                                <th>Inicio</th>
                                <td>
                                  {formatFecha(reportes.find((r) => r.id === selectedReporteId)?.fecha_hora_inicio)}{" "}
                                  {formatHora(reportes.find((r) => r.id === selectedReporteId)?.fecha_hora_inicio)}
                                </td>
                              </tr>
                              <tr>
                                <th>Fin</th>
                                <td>
                                  {reportes.find((r) => r.id === selectedReporteId)?.fecha_hora_fin
                                    ? `${formatFecha(
                                      reportes.find((r) => r.id === selectedReporteId)?.fecha_hora_fin,
                                    )} ${formatHora(
                                      reportes.find((r) => r.id === selectedReporteId)?.fecha_hora_fin,
                                    )}`
                                    : "No establecido"}
                                </td>
                              </tr>
                              <tr>
                                <th>Duración</th>
                                <td>{reportes.find((r) => r.id === selectedReporteId)?.duracion_incidente || "N/A"}</td>
                              </tr>
                              <tr>
                                <th>Estado</th>
                                <td>
                                  <Badge
                                    bg={
                                      reportes.find((r) => r.id === selectedReporteId)?.estado === "ABIERTO"
                                        ? "success"
                                        : "danger"
                                    }
                                    className="rounded-pill"
                                  >
                                    {reportes.find((r) => r.id === selectedReporteId)?.estado}
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <th>Motivo</th>
                                <td>
                                  {reportes.find((r) => r.id === selectedReporteId)?.motivo?.motivo || "Sin motivo"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                        <Col md={6}>
                          <h5>Información de la Farmacia</h5>
                          <table className="table table-bordered">
                            <tbody>
                              <tr>
                                <th>Nombre</th>
                                <td>{reportes.find((r) => r.id === selectedReporteId)?.farmacia?.nombre}</td>
                              </tr>
                              <tr>
                                <th>Dirección</th>
                                <td>
                                  {reportes.find((r) => r.id === selectedReporteId)?.farmacia?.direccion || "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <th>Ciudad</th>
                                <td>
                                  {reportes.find((r) => r.id === selectedReporteId)?.farmacia?.ciudad?.nombre_ciudad ||
                                    "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <th>Proveedor</th>
                                <td>
                                  {
                                    reportes.find((r) => r.id === selectedReporteId)?.farmacia?.proveedorInternet
                                      ?.nombre
                                  }
                                </td>
                              </tr>
                              <tr>
                                <th>Coordenadas</th>
                                <td>
                                  {reportes.find((r) => r.id === selectedReporteId)?.farmacia?.coordenadas || "N/A"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <h5>Observaciones</h5>
                          <div className="p-3 bg-light rounded">
                            {reportes.find((r) => r.id === selectedReporteId)?.observacion || "Sin observaciones"}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetalle}>
            Cerrar
          </Button>
          {selectedReporteId && (
            <Button
              style={{ backgroundColor: "#f6952c", borderColor: "#f6952c" }}
              onClick={() => {
                handleCloseDetalle()
                handleShow2()
              }}
            >
              <i className="bi bi-pencil me-2"></i>
              Editar
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <div className="d-flex align-items-center mb-3" style={{ color: "black" }}>
        <div className="pagetitle">
          <h1>Reportes de Internet</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Inicio</li>
              <li className="breadcrumb-item active">Reportes</li>
            </ol>
          </nav>
        </div>
        <div className="ms-auto">
          <Button
            ref={exportButtonRef}
            title="Exportar a Excel"
            onClick={exportToExcel}
            className="btn me-2"
            variant="success"
          >
            <Download className="me-1" /> Exportar
          </Button>
          <Button
            title="Crear nuevo reporte"
            onClick={handleShow}
            className="btn"
            style={{ backgroundColor: "#f6952c", borderColor: "#f6952c" }}
          >
            <i className="bi bi-plus-circle-fill me-2"></i> Nuevo Reporte
          </Button>
        </div>
      </div>

      <div className="p-2" style={{ backgroundColor: "#ffff", borderRadius: "0.6rem" }}>
        <Row className="mb-2">
          <Col>
            <small className="text-muted">
              Mostrando {currentReportes.length} de {sortedReportes().length} reportes
            </small>
          </Col>
        </Row>

        <div className="table-responsive" style={{ maxHeight: "50vh" }}>
          <table className="table table-hover text-nowrap">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("fecha")}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  className="user-select-none"
                >
                  <FormControl
                    size="sm"
                    type="date"
                    placeholder="Filtrar fecha"
                    value={filterFecha}
                    onChange={(e) => setFilterFecha(e.target.value)}
                    className="form-control-sm"
                  />
                  Fecha {getSortIcon("fecha")}
                </th>
                <th
                  onClick={() => handleSort("farmacia")}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  className="user-select-none"
                >
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar farmacia"
                    value={filterFarmacia}
                    onChange={(e) => setFilterFarmacia(e.target.value)}
                  />
                  Farmacia {getSortIcon("farmacia")}
                </th>
                <th
                  onClick={() => handleSort("inicio")}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  className="user-select-none"
                >
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar inicio"
                    value={filterFechaHoraInicio}
                    onChange={(e) => setFilterFechaHoraInicio(e.target.value)}
                  />
                  Fecha/Hora Inicio {getSortIcon("inicio")}
                </th>
                <th
                  onClick={() => handleSort("fin")}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  className="user-select-none"
                >
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar fin"
                    value={filterFechaHoraFin}
                    onChange={(e) => setFilterFechaHoraFin(e.target.value)}
                  />
                  Fecha/Hora Fin {getSortIcon("fin")}
                </th>
                <th
                  onClick={() => handleSort("duracion")}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  className="user-select-none"
                >
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar duración"
                    value={filterDuracionIncidente}
                    onChange={(e) => setFilterDuracionIncidente(e.target.value)}
                  />
                  Duración {getSortIcon("duracion")}
                </th>
                <th
                  onClick={() => handleSort("proveedor")}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  className="user-select-none"
                >
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar proveedor"
                    value={filterProveedor}
                    onChange={(e) => setFilterProveedor(e.target.value)}
                  />
                  Proveedor {getSortIcon("proveedor")}
                </th>
                <th
                  onClick={() => handleSort("motivo")}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  className="user-select-none"
                >
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar motivo"
                    value={filterMotivo}
                    onChange={(e) => setFilterMotivo(e.target.value)}
                  />
                  Motivo {getSortIcon("motivo")}
                </th>
                <th
                  onClick={() => handleSort("estado")}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  className="user-select-none"
                >
                  <Form.Select size="sm" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="ABIERTO">ABIERTO</option>
                    <option value="CERRADO">CERRADO</option>
                  </Form.Select>
                  Estado {getSortIcon("estado")}
                </th>
                <th className="text-center">
                  <button
                    title="Limpiar filtros"
                    style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
                    onClick={clearFilters}
                    type="button"
                    className="btn btn-light btn-sm"
                  >
                    <i className="bi bi-brush" />
                  </button>
                  <span style={{ display: "block", marginTop: "4px" }}>Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReportes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-3">
                    No se encontraron reportes con los filtros aplicados
                  </td>
                </tr>
              ) : (
                currentReportes.map((reporte) => (
                  <tr key={reporte.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <div>{reporte.fecha}</div>
                          <small className="text-muted">ID: {reporte.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{reporte.farmacia?.nombre}</div>
                    </td>
                    <td>
                      <div>{formatFecha(reporte.fecha_hora_inicio)}</div>
                      <small className="text-muted">{formatHora(reporte.fecha_hora_inicio)}</small>
                    </td>
                    <td>
                      {reporte.fecha_hora_fin ? (
                        <>
                          <div>{formatFecha(reporte.fecha_hora_fin)}</div>
                          <small className="text-muted">{formatHora(reporte.fecha_hora_fin)}</small>
                        </>
                      ) : (
                        <span className="text-muted">No establecido</span>
                      )}
                    </td>
                    <td>{reporte.duracion_incidente || "N/A"}</td>
                    <td>
                      <div>{reporte.farmacia?.proveedorInternet?.nombre}</div>
                    </td>
                    <td>{reporte.motivo?.motivo || "Sin motivo"}</td>
                    <td>
                      <Badge bg={reporte.estado === "ABIERTO" ? "success" : "danger"} className="rounded-pill">
                        {reporte.estado}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end btn-group" role="group">
                        <button
                          title="Ver detalles"
                          className="btn btn-light btn-sm"
                          style={{ backgroundColor: "#f8f9fa", color: "#212529", borderColor: "#f8f9fa" }}
                          onClick={() => {
                            setSelectedReporteId(reporte.id)
                            handleShowDetalle()
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          title="Editar reporte"
                          className="btn btn-light btn-sm"
                          style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
                          onClick={() => {
                            setSelectedReporteId(reporte.id)
                            handleShow2()
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          title="Enviar Modem"
                          className="btn btn-sm"
                          style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
                          onClick={() => {
                            setSelectedReporteId(reporte.id)
                            handleShowEnvio()
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-router"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 13m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                            <path d="M17 17l0 .01" />
                            <path d="M13 17l0 .01" />
                            <path d="M15 13l0 -2" />
                            <path d="M11.75 8.75a4 4 0 0 1 6.5 0" />
                            <path d="M8.5 6.5a8 8 0 0 1 13 0" />
                          </svg>
                        </button>
                        {/* Solo mostrar el botón de eliminar para administradores */}
                        {isAdmin && (
                          <button
                            title="Eliminar reporte"
                            className="btn btn-light btn-sm"
                            style={{ backgroundColor: "#dc3545", color: "#fff", borderColor: "#dc3545" }}
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
            Página {currentPage} de {totalPages}
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
          <li className=" m-1 page-item active">
            <span className="page-link" style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}>
              {currentPage}
            </span>
          </li>
          <li className={` m-1 page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              style={{ backgroundColor: "#ffb361", color: "#fff", borderColor: "#ffb361" }}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
          <li className={` m-1 page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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

export default ReporteTable
