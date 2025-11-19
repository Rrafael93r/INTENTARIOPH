"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createEnvio } from "../../servicios/EnvioModemService"
import { getModems } from "../../servicios/modemService"
import Swal from "sweetalert2"
import { Form, Button, Spinner, Row, Col, Card, Alert } from "react-bootstrap"

interface IModem {
  id: number
  marca: string
  modelo: string
  numero_serie: string
  estado: string
  numero: number
  proveedorInternet: {
    id: number
    nombre: string
  }
}

interface IEnvio {
  farmacia: any
  modemPrincipal: any
  modemSecundario?: any
  fecha_envio: string
  costo_envio: number
  estado_envio: string
}

interface Props {
  farmacia: any
  onClose?: () => void
}

const FormularioEnvioM: React.FC<Props> = ({ farmacia, onClose }) => {
  const [modems, setModems] = useState<IModem[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingModems, setLoadingModems] = useState(true)

  const [envio, setEnvio] = useState<IEnvio>({
    farmacia: farmacia,
    modemPrincipal: null,
    fecha_envio: new Date().toISOString().split("T")[0],
    costo_envio: 0,
    estado_envio: "PENDIENTE",
  })

  useEffect(() => {
    const cargarModems = async () => {
      try {
        setLoadingModems(true)
        console.log("Cargando modems disponibles...")

        const modemsData = await getModems()
        console.log("Modems obtenidos:", modemsData)

        // Filtrar solo modems disponibles
        const modemsDisponibles = modemsData.filter((modem: IModem) => modem.estado === "DISPONIBLE")
        console.log("Modems disponibles:", modemsDisponibles)

        setModems(modemsDisponibles)

        if (modemsDisponibles.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "Sin modems disponibles",
            text: "No hay modems disponibles para envío en este momento.",
          })
        }
      } catch (error) {
        console.error("Error al cargar modems:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cargar los modems disponibles",
        })
      } finally {
        setLoadingModems(false)
      }
    }

    cargarModems()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "modemPrincipal") {
      const modemSeleccionado = modems.find((m) => m.id === Number(value))
      setEnvio((prev) => ({
        ...prev,
        modemPrincipal: modemSeleccionado || null,
      }))
    } else if (name === "modemSecundario") {
      if (value === "") {
        setEnvio((prev) => ({
          ...prev,
          modemSecundario: null,
        }))
      } else {
        const modemSeleccionado = modems.find((m) => m.id === Number(value))
        setEnvio((prev) => ({
          ...prev,
          modemSecundario: modemSeleccionado || null,
        }))
      }
    } else if (name === "costo_envio") {
      setEnvio((prev) => ({
        ...prev,
        [name]: Number(value),
      }))
    } else {
      setEnvio((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!envio.modemPrincipal) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe seleccionar al menos un módem principal",
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
        title: "Creando envío...",
        text: "Por favor espere",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar datos para enviar
      const envioData = {
        farmacia: {
          id: farmacia.id,
        },
        modemPrincipal: {
          id: envio.modemPrincipal.id,
        },
        modemSecundario: envio.modemSecundario
          ? {
              id: envio.modemSecundario.id,
            }
          : null,
        fecha_envio: new Date(envio.fecha_envio).toISOString(),
        costo_envio: envio.costo_envio,
        estado_envio: envio.estado_envio,
      }

      console.log("Enviando datos:", envioData)

      // Crear el envío (el backend se encarga de actualizar los estados de los modems)
      const envioCreado = await createEnvio(envioData)

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Envío creado correctamente y módem(s) actualizado(s) a 'EN USO'",
        timer: 2000,
      })

      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error("Error al crear el envío:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el envío. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingModems) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando modems...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className="p-3" style={{ color: "black", backgroundColor: "white", borderRadius: "0.6rem" }}>
      <Form onSubmit={handleSubmit}>
        {/* Información de la farmacia */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">
              <i className="bi bi-building me-2"></i>
              Farmacia Destino
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" value={farmacia?.nombre || ""} disabled readOnly className="bg-light" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    value={farmacia?.ciudad?.nombre_ciudad || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control type="text" value={farmacia?.direccion || ""} disabled readOnly className="bg-light" />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Selección de modems */}
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label htmlFor="modemPrincipal" className="form-label">
                <i className="bi bi-router me-2"></i>
                Módem Principal*
              </Form.Label>
              <Form.Select
                name="modemPrincipal"
                value={envio.modemPrincipal?.id || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un módem</option>
                {modems.map((modem) => (
                  <option key={modem.id} value={modem.id}>
                    {modem.marca} - {modem.modelo} | Serie: {modem.numero_serie} | {modem.proveedorInternet?.nombre} |
                    Tel: {modem.numero}
                  </option>
                ))}
              </Form.Select>
              {modems.length === 0 && (
                <Form.Text className="text-warning">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  No hay modems disponibles
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label htmlFor="modemSecundario" className="form-label">
                <i className="bi bi-router me-2"></i>
                Módem Secundario (Opcional)
              </Form.Label>
              <Form.Select name="modemSecundario" value={envio.modemSecundario?.id || ""} onChange={handleInputChange}>
                <option value="">Ninguno</option>
                {modems
                  .filter((modem) => modem.id !== envio.modemPrincipal?.id)
                  .map((modem) => (
                    <option key={modem.id} value={modem.id}>
                      {modem.marca} - {modem.modelo} | Serie: {modem.numero_serie} | {modem.proveedorInternet?.nombre} |
                      Tel: {modem.numero}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Información del envío */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
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
          <Col md={4}>
            <Form.Group>
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
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                <i className="bi bi-truck me-2"></i>
                Estado del Envío*
              </Form.Label>
              <Form.Select name="estado_envio" value={envio.estado_envio} onChange={handleInputChange} required>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="EN CAMINO">EN CAMINO</option>
                <option value="ENTREGADO">ENTREGADO</option>
                <option value="DEVUELTO">DEVUELTO</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Resumen del envío */}
        {envio.modemPrincipal && (
          <Alert variant="info" className="mb-4">
            <Alert.Heading>
              <i className="bi bi-info-circle me-2"></i>
              Resumen del Envío
            </Alert.Heading>
            <p className="mb-2">
              <strong>Destino:</strong> {farmacia?.nombre} - {farmacia?.ciudad?.nombre_ciudad}
            </p>
            <p className="mb-2">
              <strong>Módem Principal:</strong> {envio.modemPrincipal.marca} {envio.modemPrincipal.modelo} (Serie:{" "}
              {envio.modemPrincipal.numero_serie})
            </p>
            {envio.modemSecundario && (
              <p className="mb-2">
                <strong>Módem Secundario:</strong> {envio.modemSecundario.marca} {envio.modemSecundario.modelo} (Serie:{" "}
                {envio.modemSecundario.numero_serie})
              </p>
            )}
            <p className="mb-0">
              <strong>Costo Total:</strong> ${envio.costo_envio.toLocaleString("es-CO")}
            </p>
          </Alert>
        )}

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
            className="btn btn-secondary m-2 p-2"
            disabled={loading || modems.length === 0}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Procesando...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                CREAR ENVÍO
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
            className="m-2 p-2"
            onClick={onClose}
            disabled={loading}
          >
            <i className="bi bi-x-circle me-2"></i>
            CANCELAR
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default FormularioEnvioM
