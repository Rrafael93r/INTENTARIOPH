"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Row, Col, Form, Button, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { createReporte } from "../../servicios/reportesService"
import { getFarmacias } from "../../servicios/farmaciaService"
import { getMotivos } from "../../servicios/motivoreporteService"

interface IFormularioCrearRProps {
  onSuccess?: () => void
}

const FormularioCrearR: React.FC<IFormularioCrearRProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [farmacias, setFarmacias] = useState<any[]>([])
  const [motivos, setMotivos] = useState<any[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  const [reporte, setReporte] = useState<any>({
    fecha: new Date().toISOString().split("T")[0],
    farmacia: null,
    fecha_hora_inicio: new Date().toTimeString().slice(0, 5),
    fecha_hora_fin: "",
    duracion_incidente: "",
    estado: "ABIERTO",
    motivo: null,
    observacion: "",
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

        // Cargar farmacias y motivos en paralelo
        const [farmaciasData, motivosData] = await Promise.all([getFarmacias(), getMotivos()])

        setFarmacias(farmaciasData)
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

    if (name === "farmacia_id") {
      const farmaciaSeleccionada = farmacias.find((f) => f.id === Number(value))
      setReporte((prev: any) => ({
        ...prev,
        farmacia: farmaciaSeleccionada,
      }))
    } else if (name === "motivo_id") {
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

    if (!reporte.farmacia || !reporte.motivo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor seleccione una farmacia y un motivo",
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
      const mes = fechaBase.getMonth() + 1 // getMonth() devuelve 0-11, necesitamos 1-12

      let fechaHoraInicio = null
      if (reporte.fecha && reporte.fecha_hora_inicio) {
        const [horasInicio, minutosInicio] = reporte.fecha_hora_inicio.split(":")
        fechaHoraInicio = new Date(fechaBase)
        fechaHoraInicio.setHours(Number(horasInicio), Number(minutosInicio), 0, 0)
      }

      // Preparar el objeto para enviar al backend
      const reporteFormateado = {
        fecha: fechaBase, // Enviar como objeto Date
        ano: ano,
        mes: mes,
        farmacia: reporte.farmacia, // Enviar el objeto completo
        fecha_hora_inicio: fechaHoraInicio, // Enviar como objeto Date
        fecha_hora_fin: null, // Nuevo reporte no tiene fecha fin
        duracion_incidente: null, // Se calculará cuando se cierre
        estado: "ABIERTO", // Siempre ABIERTO para reportes nuevos
        motivo: reporte.motivo, // Enviar el objeto completo
        observacion: reporte.observacion || "",
        isDeleted: false,
      }

      console.log("Datos a enviar:", JSON.stringify(reporteFormateado, null, 2))

      await createReporte(reporteFormateado)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Reporte creado correctamente",
      })

      // Limpiar el formulario
      setReporte({
        fecha: new Date().toISOString().split("T")[0],
        farmacia: null,
        fecha_hora_inicio: new Date().toTimeString().slice(0, 5),
        fecha_hora_fin: "",
        duracion_incidente: "",
        estado: "ABIERTO",
        motivo: null,
        observacion: "",
      })

      // Limpiar el formulario o cerrar el modal
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error al crear:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el reporte",
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
              <Form.Label>Fecha*</Form.Label>
              <Form.Control type="date" name="fecha" value={reporte.fecha} onChange={handleInputChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Hora Inicio*</Form.Label>
              <Form.Control
                type="time"
                name="fecha_hora_inicio"
                value={reporte.fecha_hora_inicio}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Farmacia*</Form.Label>
              <Form.Select name="farmacia_id" value={reporte.farmacia?.id || ""} onChange={handleInputChange} required>
                <option value="">Seleccione una farmacia...</option>
                {farmacias.map((farmacia) => (
                  <option key={farmacia.id} value={farmacia.id}>
                    {farmacia.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Motivo*</Form.Label>
              <Form.Select name="motivo_id" value={reporte.motivo?.id || ""} onChange={handleInputChange} required>
                <option value="">Seleccione un motivo...</option>
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
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observacion"
                value={reporte.observacion}
                onChange={handleInputChange}
                placeholder="Observaciones generales del caso..."
              />
            </Form.Group>
          </Col>
        </Row>

        {reporte.farmacia && (
          <div className="mb-4">
            <h5 className="mb-3">Información de la Farmacia Seleccionada</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={reporte.farmacia?.nombre || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    value={reporte.farmacia?.direccion || ""}
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
                    value={reporte.farmacia?.ciudad?.nombre_ciudad || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Proveedor de Internet</Form.Label>
                  <Form.Control
                    type="text"
                    value={reporte.farmacia?.proveedorInternet?.nombre || ""}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
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
                Crear Reporte
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
              if (onSuccess) onSuccess()
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

export default FormularioCrearR
