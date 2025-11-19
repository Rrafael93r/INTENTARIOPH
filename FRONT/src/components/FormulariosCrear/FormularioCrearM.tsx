"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Form, Button, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { createModems } from "../../servicios/modemService"
import { getProveedor_internet } from "../../servicios/ProveedoresService"
import { getFarmacias } from "../../servicios/farmaciaService"

interface IFormularioCrearModemProps {
  onSuccess?: () => void
  onClose?: () => void
}

const FormularioCrearModem: React.FC<IFormularioCrearModemProps> = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [proveedores, setProveedores] = useState<any[]>([])
  const [farmacias, setFarmacias] = useState<any[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  const [modem, setModem] = useState<any>({
    marca: "",
    modelo: "",
    numero_serie: "",
    numero: "",
    estado: "DISPONIBLE",
    proveedorInternet: null,
    farmacia: null,
  })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true)

        Swal.fire({
          title: "Cargando datos...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        // Cargar proveedores y farmacias en paralelo
        const [proveedoresData, farmaciasData] = await Promise.all([getProveedor_internet(), getFarmacias()])

        setProveedores(proveedoresData)
        setFarmacias(farmaciasData)

        Swal.close()
      } catch (error) {
        console.error("Error al cargar datos:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos necesarios",
        })
      } finally {
        setLoadingData(false)
      }
    }

    cargarDatos()
  }, [])

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
        title: "Creando módem...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar el objeto para enviar al backend
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
        isDeleted: false,
      }

      console.log("Datos a enviar:", JSON.stringify(modemData, null, 2))

      await createModems(modemData)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Módem creado correctamente",
      })

      // Limpiar el formulario
      setModem({
        marca: "",
        modelo: "",
        numero_serie: "",
        numero: "",
        estado: "DISPONIBLE",
        proveedorInternet: null,
        farmacia: null,
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error al crear:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el módem",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
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
                value={modem.numero}
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
                Opcional: Seleccione una farmacia si el módem ya está asignado a una ubicación específica
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {modem.proveedorInternet && (
          <div className="mb-4 p-3 bg-light rounded">
            <h6 className="mb-2">
              <i className="bi bi-info-circle me-2"></i>
              Información del Proveedor Seleccionado
            </h6>
            <Row>
              <Col md={6}>
                <small>
                  <strong>Nombre:</strong> {modem.proveedorInternet.nombre}
                </small>
              </Col>
              <Col md={6}>
                <small>
                  <strong>Contacto:</strong> {modem.proveedorInternet.nombre_contacto}
                </small>
              </Col>
            </Row>
          </div>
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
                Creando...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i>
                Crear Módem
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
            onClick={() => {
              if (onClose) onClose()
            }}
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

export default FormularioCrearModem
