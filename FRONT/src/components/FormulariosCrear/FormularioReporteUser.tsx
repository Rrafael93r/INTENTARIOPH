"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Form, Button, Spinner, Card, Alert } from "react-bootstrap"
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
    fecha_hora_inicio: new Date().toTimeString().slice(0, 5),
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
      if (reporte.fecha && reporte.fecha_hora_inicio) {
        const [horasInicio, minutosInicio] = reporte.fecha_hora_inicio.split(":")
        fechaHoraInicio = new Date(fechaBase)
        fechaHoraInicio.setHours(Number(horasInicio), Number(minutosInicio), 0, 0)
      }

      // Preparar el objeto para enviar al backend
      const reporteFormateado = {
        fecha: fechaBase,
        ano: ano,
        mes: mes,
        farmacia: userDetails.farmacia, // Usar la farmacia del usuario
        fecha_hora_inicio: fechaHoraInicio,
        fecha_hora_fin: null,
        duracion_incidente: null,
        estado: "ABIERTO",
        motivo: reporte.motivo,
        observacion: reporte.observacion || "",
        isDeleted: false,
      }

      console.log("Datos a enviar:", JSON.stringify(reporteFormateado, null, 2))

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
        fecha_hora_inicio: new Date().toTimeString().slice(0, 5),
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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" style={{ color: "#f6952c" }}>
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <div className="mt-3">
            <h5>Cargando información...</h5>
            <p className="text-muted">Por favor espere un momento</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userDetails || !userDetails.farmacia) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Alert variant="danger" className="text-center">
              <Alert.Heading>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Error de Configuración
              </Alert.Heading>
              <p>Su usuario no tiene una farmacia asignada.</p>
              <p className="mb-0">Por favor contacte al administrador del sistema.</p>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header de bienvenida */}
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#f6952c" }}>
              <i className="bi bi-plus-circle me-2"></i>
              Crear Reporte de Incidente
            </h2>
            <p className="text-muted">Complete la información del incidente que está reportando</p>
          </div>

          {/* Información de la farmacia */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0">
                <i className="bi bi-building me-2"></i>
                Mi Farmacia Asignada
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Nombre:</strong>
                    <div>{userDetails.farmacia.nombre}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Ciudad:</strong>
                    <div>{userDetails.farmacia.ciudad?.nombre_ciudad}</div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-2">
                    <strong>Dirección:</strong>
                    <div>{userDetails.farmacia.direccion}</div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-0">
                    <strong>Proveedor de Internet:</strong>
                    <div>{userDetails.farmacia.proveedorInternet?.nombre}</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Formulario de reporte */}
          <Card className="shadow-sm">
            <Card.Header>
              <h6 className="mb-0">
                <i className="bi bi-file-text me-2"></i>
                Información del Reporte
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-calendar me-1"></i>
                        Fecha*
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="fecha"
                        value={reporte.fecha}
                        onChange={handleInputChange}
                        required
                        readOnly
                        className="bg-light"
                      />
                      <Form.Text className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        La fecha se establece automáticamente
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-clock me-1"></i>
                        Hora de Inicio del Incidente*
                      </Form.Label>
                      <Form.Control
                        type="time"
                        name="fecha_hora_inicio"
                        value={reporte.fecha_hora_inicio}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Text className="text-muted">¿A qué hora comenzó el problema?</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Motivo del Reporte*
                      </Form.Label>
                      <Form.Select
                        name="motivo_id"
                        value={reporte.motivo?.id || ""}
                        onChange={handleInputChange}
                        required
                        size="lg"
                      >
                        <option value="">Seleccione el tipo de problema...</option>
                        {motivos.map((motivo) => (
                          <option key={motivo.id} value={motivo.id}>
                            {motivo.motivo}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-chat-text me-1"></i>
                        Descripción del Problema
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="observacion"
                        value={reporte.observacion}
                        onChange={handleInputChange}
                        placeholder="Describa con detalle qué está sucediendo..."
                        style={{ resize: "vertical" }}
                      />
                      
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center">
                  <Button
                    style={{
                      backgroundColor: "#f6952c",
                      borderColor: "#f6952c",
                      cursor: "pointer",
                      background: isHovered2 ? "#ffff" : "#f6952c",
                      color: isHovered2 ? "#f6952c" : "#ffff",
                    }}
                    onMouseEnter={() => setIsHovered2(true)}
                    onMouseLeave={() => setIsHovered2(false)}
                    type="submit"
                    size="lg"
                    className="me-3 px-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Enviar Reporte
                      </>
                    )}
                  </Button>
                  <Button
                    style={{
                      backgroundColor: isHovered ? "#f6952c" : "#ffff",
                      color: isHovered ? "#fff" : "#f6952c",
                      borderColor: "#f6952c",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    type="button"
                    size="lg"
                    className="px-4"
                    onClick={() => {
                      setReporte({
                        fecha: new Date().toISOString().split("T")[0],
                        fecha_hora_inicio: new Date().toTimeString().slice(0, 5),
                        motivo: null,
                        observacion: "",
                      })
                    }}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Limpiar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default FormularioReporteUser
