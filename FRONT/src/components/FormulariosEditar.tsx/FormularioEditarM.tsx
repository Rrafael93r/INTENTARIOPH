"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Form, Button, Spinner, Card } from "react-bootstrap"
import Swal from "sweetalert2"
import { getModemById, updateModem } from "../../servicios/modemService"
import { getProveedor_internet } from "../../servicios/ProveedoresService"
import { getFarmacias } from "../../servicios/farmaciaService"

interface IFormularioEditarModemProps {
  modemId: number
  onClose: () => void
  onSuccess: () => void
}

const FormularioEditarModem: React.FC<IFormularioEditarModemProps> = ({ modemId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true)
  const [proveedores, setProveedores] = useState<any[]>([])
  const [farmacias, setFarmacias] = useState<any[]>([])
  const [modem, setModem] = useState<any>({
    id: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    numero: "",
    estado: "",
    proveedorInternet: null,
    farmacia: null,
  })
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!modemId) {
          throw new Error("ID no proporcionado")
        }

        Swal.fire({
          title: "Cargando módem...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        // Cargar datos en paralelo
        const [modemData, proveedoresData, farmaciasData] = await Promise.all([
          getModemById(modemId),
          getProveedor_internet(),
          getFarmacias(),
        ])

        if (!modemData) {
          throw new Error("No se encontró el módem")
        }

        setModem(modemData)
        setProveedores(proveedoresData)
        setFarmacias(farmaciasData)
      } catch (error) {
        console.error("Error al cargar el módem:", error)
        setError(error instanceof Error ? error.message : "Error al cargar el módem")
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del módem",
        })
      } finally {
        setLoading(false)
        Swal.close()
      }
    }

    cargarDatos()
  }, [modemId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "proveedor_id") {
      const proveedorSeleccionado = proveedores.find((p) => p.id === Number(value))
      setModem((prev: any) => ({
        ...prev,
        proveedorInternet: proveedorSeleccionado,
      }))
    } else if (name === "farmacia_id") {
      if (value === "") {
        setModem((prev: any) => ({
          ...prev,
          farmacia: null,
        }))
      } else {
        const farmaciaSeleccionada = farmacias.find((f) => f.id === Number(value))
        setModem((prev: any) => ({
          ...prev,
          farmacia: farmaciaSeleccionada,
        }))
      }
    } else if (name === "numero") {
      setModem((prev: any) => ({
        ...prev,
        [name]: value ? Number(value) : null,
      }))
    } else {
      setModem((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!modem.marca || !modem.modelo || !modem.numero_serie || !modem.proveedorInternet) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos obligatorios",
      })
      return
    }

    try {
      setLoading(true)

      Swal.fire({
        title: "Actualizando módem...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar datos para enviar
      const modemData = {
        marca: modem.marca,
        modelo: modem.modelo,
        numero_serie: modem.numero_serie,
        numero: modem.numero || null,
        estado: modem.estado,
        proveedorInternet: {
          id: modem.proveedorInternet.id,
        },
        farmacia: modem.farmacia
          ? {
              id: modem.farmacia.id,
            }
          : null,
      }

      console.log("Enviando datos:", modemData)

      await updateModem(modemId, modemData)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Módem actualizado correctamente",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el módem. Por favor, intente nuevamente.",
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
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marca*</Form.Label>
              <Form.Control
                type="text"
                name="marca"
                value={modem.marca}
                onChange={handleInputChange}
                required
                placeholder="Ej: Huawei, ZTE, TP-Link"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Modelo*</Form.Label>
              <Form.Control
                type="text"
                name="modelo"
                value={modem.modelo}
                onChange={handleInputChange}
                required
                placeholder="Ej: B315s-22, MF286R"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Número de Serie*</Form.Label>
              <Form.Control
                type="text"
                name="numero_serie"
                value={modem.numero_serie}
                onChange={handleInputChange}
                required
                placeholder="Número de serie único"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Número de Teléfono</Form.Label>
              <Form.Control
                type="number"
                name="numero"
                value={modem.numero || ""}
                onChange={handleInputChange}
                placeholder="Número de línea telefónica"
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Proveedor de Internet*</Form.Label>
              <Form.Select
                name="proveedor_id"
                value={modem.proveedorInternet?.id || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un proveedor...</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Estado*</Form.Label>
              <Form.Select name="estado" value={modem.estado} onChange={handleInputChange} required>
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="EN USO">EN USO</option>
                <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                <option value="DAÑADO">DAÑADO</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación (Farmacia)</Form.Label>
              <Form.Select name="farmacia_id" value={modem.farmacia?.id || ""} onChange={handleInputChange}>
                <option value="">Sin asignar</option>
                {farmacias.map((farmacia) => (
                  <option key={farmacia.id} value={farmacia.id}>
                    {farmacia.nombre} - {farmacia.ciudad?.nombre_ciudad}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Opcional: Seleccione una farmacia si el módem está asignado a una ubicación específica
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {/* Información del proveedor seleccionado */}
        {modem.proveedorInternet && (
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Información del Proveedor
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <small>
                    <strong>Nombre:</strong> {modem.proveedorInternet.nombre}
                  </small>
                </Col>
                <Col md={4}>
                  <small>
                    <strong>Contacto:</strong> {modem.proveedorInternet.nombre_contacto}
                  </small>
                </Col>
                <Col md={4}>
                  <small>
                    <strong>Teléfono:</strong> {modem.proveedorInternet.numero_contacto}
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Información de la farmacia si está asignada */}
        {modem.farmacia && (
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">
                <i className="bi bi-building me-2"></i>
                Ubicación Actual
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <small>
                    <strong>Farmacia:</strong> {modem.farmacia.nombre}
                  </small>
                </Col>
                <Col md={6}>
                  <small>
                    <strong>Ciudad:</strong> {modem.farmacia.ciudad?.nombre_ciudad}
                  </small>
                </Col>
                <Col md={12}>
                  <small>
                    <strong>Dirección:</strong> {modem.farmacia.direccion}
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
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
                Actualizar Módem
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

export default FormularioEditarModem
