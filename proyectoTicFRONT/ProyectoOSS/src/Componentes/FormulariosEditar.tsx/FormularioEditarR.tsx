import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReporteById, updateReporte } from '../../servicios/reportesService';
import { Card, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

interface ICiudad {
  nombre_ciudad: string;
}

interface IDepartamento {
  name_departamento: string;
}

interface IProveedorInternet {
  nombre: string;
}

interface ICanalTransmision {
  nombre: string;
}

interface IFarmacia {
  id: number;
  nombre: string;
  coordenadas: string;
  direccion: string;
  ciudad: ICiudad;
  departamento: IDepartamento;
  proveedorInternet: IProveedorInternet;
  canalTransmision: ICanalTransmision;
}

interface IMotivo {
  id: number;
  motivo: string;
}

interface IReporte {
  id: string;
  fecha: string;
  farmacia: IFarmacia;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  duracion_incidente: string;
  motivo: IMotivo;
  estado: string;
  observacion: string;
}

const initialReporte: IReporte = {
  id: '',
  fecha: '',
  farmacia: {
    id: 0,
    nombre: '',
    coordenadas: '',
    direccion: '',
    ciudad: { nombre_ciudad: '' },
    departamento: { name_departamento: '' },
    proveedorInternet: { nombre: '' },
    canalTransmision: { nombre: '' }
  },
  fecha_hora_inicio: '',
  fecha_hora_fin: '',
  duracion_incidente: '',
  motivo: { id: 0, motivo: '' },
  estado: '',
  observacion: ''
};

const EditarReporte: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reporte, setReporte] = useState<IReporte>(initialReporte);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarReporte = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error('ID no proporcionado');
        }

        const data = await getReporteById(Number(id));

        if (!data) {
          throw new Error('No se encontró el reporte');
        }

        setReporte(data);
      } catch (error) {
        console.error('Error al cargar el reporte:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar el reporte');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del reporte'
        });
      } finally {
        setLoading(false);
      }
    };

    cargarReporte();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReporte(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await Swal.fire({
        title: 'Actualizando...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const reporteFormateado = {
        ...reporte,
        fecha: reporte.fecha || null,
        fecha_hora_inicio: reporte.fecha_hora_inicio ? new Date(reporte.fecha_hora_inicio).toISOString() : null,
        fecha_hora_fin: reporte.fecha_hora_fin ? new Date(reporte.fecha_hora_fin).toISOString() : null
      };

      await updateReporte(Number(id), reporteFormateado);

      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Reporte actualizado correctamente'
      });

      navigate('/Reportes');
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el reporte'
      });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="card-title mb-4">Editar Reporte #{id}</h5>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha*</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={reporte.fecha}
                    onChange={handleInputChange}
                    required
                  />
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
                  <Form.Label>Hora Fin*</Form.Label>
                  <Form.Control
                    type="time"
                    name="fecha_hora_fin"
                    value={reporte.fecha_hora_fin}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado*</Form.Label>
                  <Form.Select
                    name="estado"
                    value={reporte.estado}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="ABIERTO">ABIERTO</option>
                    <option value="CERRADO">CERRADO</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-4">
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="observacion"
                    value={reporte.observacion}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
          </Form>
        </Card.Body>
      </Card>
      <Card className="shadow-sm mt-4">
        <Card.Body>
          <h5 className="card-title mb-4">Información de la Farmacia</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la Farmacia</Form.Label>
                <Form.Control
                  type="text"
                  value={reporte.farmacia?.nombre || ''}

                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Coordenadas</Form.Label>
                <Form.Control
                  type="text"
                  value={reporte.farmacia?.coordenadas || ''}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  value={reporte.farmacia?.direccion || ''}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  value={reporte.farmacia?.ciudad?.nombre_ciudad || ''}
                  disabled
                />
              </Form.Group>
            </Col>
           
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Proveedor de Internet</Form.Label>
                <Form.Control
                  type="text"
                  value={reporte.farmacia?.proveedorInternet?.nombre || ''}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Canal de Transmisión</Form.Label>
                <Form.Control
                  type="text"
                  value={reporte.farmacia?.canalTransmision?.nombre || ''}
                  disabled
                />
              </Form.Group>
            </Col>
            <br />
            <br />  
            <div className="text-center">
              <Button type="submit" variant="secondary" className="me-2">
                <i className="bi bi-check-circle me-2"></i>
                Actualizar
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate('/Reportes')}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </Button>
            </div>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default EditarReporte;