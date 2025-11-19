"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Form, Button, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { getProveedorInternetById, updateProveedorInternet } from "../../servicios/ProveedoresService"

interface IFormularioEditarPProps {
  proveedorId: number
  onClose: () => void
  onSuccess: () => void
}

const FormularioEditarP: React.FC<IFormularioEditarPProps> = ({ proveedorId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true)
  const [proveedor, setProveedor] = useState<any>({
    id: "",
    nombre: "",
    nit: "",
    nombre_contacto: "",
    numero_contacto: "",
    correo: "",
    estado: "",
    fecha_contratacion: "",
    observacion: "",
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
    const cargarProveedor = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!proveedorId) {
          throw new Error("ID no proporcionado")
        }

        Swal.fire({
          title: "Cargando proveedor...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const data = await getProveedorInternetById(proveedorId)

        if (!data) {
          throw new Error("No se encontró el proveedor")
        }

        // Formatear las fechas antes de establecer el estado
        const proveedorFormateado = {
          ...data,
          fecha_contratacion: formatearFecha(data.fecha_contratacion),
        }

        setProveedor(proveedorFormateado)
      } catch (error) {
        console.error("Error al cargar el proveedor:", error)
        setError(error instanceof Error ? error.message : "Error al cargar el proveedor")
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del proveedor",
        })
      } finally {
        setLoading(false)
        Swal.close()
      }
    }

    cargarProveedor()
  }, [proveedorId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProveedor((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!proveedor.nombre || !proveedor.nit || !proveedor.nombre_contacto || !proveedor.correo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos obligatorios",
      })
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(proveedor.correo)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor ingrese un correo electrónico válido",
      })
      return
    }


    
    try {
      setLoading(true)

      Swal.fire({
        title: "Actualizando proveedor...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar datos para enviar
      const proveedorData = {
        ...proveedor,
        fecha_contratacion: proveedor.fecha_contratacion ? new Date(proveedor.fecha_contratacion).toISOString() : null,
        nit: Number(proveedor.nit),
        numero_contacto: Number(proveedor.numero_contacto),
      }

      console.log("Enviando datos:", proveedorData)

      await updateProveedorInternet(proveedorId, proveedorData)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Proveedor actualizado correctamente",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el proveedor. Por favor, intente nuevamente.",
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
              <Form.Label>Nombre*</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={proveedor.nombre}
                onChange={handleInputChange}
                required
                placeholder="Nombre del proveedor"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>NIT*</Form.Label>
              <Form.Control
                type="number"
                name="nit"
                value={proveedor.nit}
                onChange={handleInputChange}
                required
                min="0"
                max="99999999999"
                placeholder="Número de identificación tributaria"
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la persona encargada*</Form.Label>
              <Form.Control
                type="text"
                name="nombre_contacto"
                value={proveedor.nombre_contacto}
                onChange={handleInputChange}
                required
                placeholder="Nombre del contacto principal"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Número de contacto*</Form.Label>
              <Form.Control
                type="number"
                name="numero_contacto"
                value={proveedor.numero_contacto}
                onChange={handleInputChange}
                required
                min="0"
                max="99999999999"
                placeholder="+57"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Correo*</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={proveedor.correo}
                onChange={handleInputChange}
                required
                placeholder="ejemplo@gmail.com"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Estado*</Form.Label>
              <Form.Select name="estado" value={proveedor.estado} onChange={handleInputChange} required>
                <option value="">Seleccione un estado</option>
                <option value="ACTIVO">ACTIVO</option>
                <option value="NO ACTIVO">NO ACTIVO</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de contratación</Form.Label>
              <Form.Control
                type="date"
                name="fecha_contratacion"
                value={proveedor.fecha_contratacion}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-4">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observacion"
                value={proveedor.observacion}
                onChange={handleInputChange}
                placeholder="Observaciones adicionales..."
              />
            </Form.Group>
          </Col>
        </Row>

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
                Actualizar Proveedor
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

export default FormularioEditarP
