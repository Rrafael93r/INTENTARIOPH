"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Form, Button, Spinner, Card, Alert } from "react-bootstrap"
import Swal from "sweetalert2"
import { getEnvioById, updateEnvio } from "../../servicios/EnvioModemService"

interface IFormularioEditarEnvioProps {
  envioId: number
  onClose: () => void
  onSuccess: () => void
}

const FormularioEditarEnvio: React.FC<IFormularioEditarEnvioProps> = ({ envioId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true)
  const [envio, setEnvio] = useState<any>({
    id: "",
    farmacia: null,
    modemPrincipal: null,
    modemSecundario: null,
    fecha_envio: "",
    costo_envio: 0,
    estado_envio: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  // Función para formatear fecha
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

  useEffect(() => {
    const cargarEnvio = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!envioId) {
          throw new Error("ID no proporcionado")
        }

        Swal.fire({
          title: "Cargando envío...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const data = await getEnvioById(envioId)

        if (!data) {
          throw new Error("No se encontró el envío")
        }

        // Formatear las fechas antes de establecer el estado
        const envioFormateado = {
          ...data,
          fecha_envio: formatearFecha(data.fecha_envio),
        }

        setEnvio(envioFormateado)
      } catch (error) {
        console.error("Error al cargar el envío:", error)
        setError(error instanceof Error ? error.message : "Error al cargar el envío")
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del envío",
        })
      } finally {
        setLoading(false)
        Swal.close()
      }
    }

    cargarEnvio()
  }, [envioId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "costo_envio") {
      setEnvio((prev: any) => ({
        ...prev,
        [name]: Number(value),
      }))
    } else {
      setEnvio((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!envio.fecha_envio || !envio.estado_envio) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos obligatorios",
      })
      return
    }

    if (envio.costo_envio < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El costo de envío no puede ser negativo",
      })
      return
    }

    try {
      setLoading(true)

      Swal.fire({
        title: "Actualizando envío...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar datos para enviar
      const envioData = {
        fecha_envio: new Date(envio.fecha_envio).toISOString(),
        costo_envio: envio.costo_envio,
        estado_envio: envio.estado_envio,
      }

      console.log("Enviando datos:", envioData)

      await updateEnvio(envioId, envioData)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Envío actualizado correctamente",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el envío. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="p-4">
      <Form onSubmit={handleSubmit}>
        {/* Información del envío */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-calendar me-2"></i>
                Fecha de Envío*
              </Form.Label>
              <Form.Control
                type="date"
                name="fecha_envio"
                value={envio.fecha_envio}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-currency-dollar me-2"></i>
                Costo de Envío*
              </Form.Label>
              <div className="input-group">
                <div className="input-group-text">$</div>
                <Form.Control
                  type="number"
                  name="costo_envio"
                  value={envio.costo_envio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-truck me-2"></i>
                Estado del Envío*
              </Form.Label>
              <Form.Select name="estado_envio" value={envio.estado_envio} onChange={handleInputChange} required>
                <option value="">Seleccione un estado...</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="EN CAMINO">EN CAMINO</option>
                <option value="ENTREGADO">ENTREGADO</option>
                <option value="DEVUELTO">DEVUELTO</option>
                <option value="CANCELADO">CANCELADO</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Información de la farmacia destino */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              <i className="bi bi-building me-2"></i>
              Farmacia Destino
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={envio.farmacia?.nombre || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    value={envio.farmacia?.ciudad?.nombre_ciudad || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    value={envio.farmacia?.direccion || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Información del módem principal */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">
              <i className="bi bi-router me-2"></i>
              Módem Principal
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    value={envio.modemPrincipal?.marca || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    type="text"
                    value={envio.modemPrincipal?.modelo || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Serie</Form.Label>
                  <Form.Control
                    type="text"
                    value={envio.modemPrincipal?.numero_serie || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Información del módem secundario si existe */}
        {envio.modemSecundario && (
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">
                <i className="bi bi-router me-2"></i>
                Módem Secundario
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Marca</Form.Label>
                    <Form.Control
                      type="text"
                      value={envio.modemSecundario?.marca || ""}
                      disabled
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control
                      type="text"
                      value={envio.modemSecundario?.modelo || ""}
                      disabled
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de Serie</Form.Label>
                    <Form.Control
                      type="text"
                      value={envio.modemSecundario?.numero_serie || ""}
                      disabled
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Resumen del envío */}
        <Alert variant="info" className="mb-4">
          <Alert.Heading>
            <i className="bi bi-info-circle me-2"></i>
            Resumen del Envío
          </Alert.Heading>
          <p className="mb-2">
            <strong>ID del Envío:</strong> {envio.id}
          </p>
          <p className="mb-2">
            <strong>Destino:</strong> {envio.farmacia?.nombre} - {envio.farmacia?.ciudad?.nombre_ciudad}
          </p>
          <p className="mb-2">
            <strong>Módem(s):</strong> {envio.modemPrincipal?.marca} {envio.modemPrincipal?.modelo}
            {envio.modemSecundario && ` + ${envio.modemSecundario?.marca} ${envio.modemSecundario?.modelo}`}
          </p>
          <p className="mb-0">
            <strong>Costo Total:</strong> ${envio.costo_envio?.toLocaleString("es-CO")}
          </p>
        </Alert>

        <div className="text-center mt-4">
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
            variant="secondary"
            className="me-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Actualizando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Actualizar Envío
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
            onClick={onClose}
            disabled={loading}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default FormularioEditarEnvio
