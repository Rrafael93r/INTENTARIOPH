import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getFarmaciaById, updateFarmacia, getCiudades, getProveedores, getCanalesTransmision } from '../../servicios/api';


interface Ciudad {
  id: number;
  nombre_ciudad: string;
  departamento: {
    id: number;
    nombre: string;
  };
}

interface Proveedor {
  id: number;
  nombre: string;
}

interface CanalTransmision {
  id: number;
  nombre: string;
}

interface FormularioEditarFProps {
  farmaciaId: number;
  onClose: () => void;
  onSuccess: () => void;
}

function FormularioEditarF({ farmaciaId, onClose, onSuccess }: FormularioEditarFProps) {
  const [loading, setLoading] = useState(true);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [canalesTransmision, setCanalesTransmision] = useState<CanalTransmision[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: { id: '' },
    departamento: { id: '' },
    proveedorInternet: { id: '' },
    pertenece: '',
    coordenadas: '',
    canalTransmision: { id: '' },
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        Swal.fire({
          title: 'Cargando...',
          text: 'Por favor espere',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const [farmaciaData, ciudadesData, proveedoresData, canalesData] = await Promise.all([
          getFarmaciaById(farmaciaId),
          getCiudades(),
          getProveedores(),
          getCanalesTransmision()
        ]);

        setCiudades(ciudadesData);
        setProveedores(proveedoresData);
        setCanalesTransmision(canalesData);

        setFormData({
          nombre: farmaciaData.nombre,
          direccion: farmaciaData.direccion,
          ciudad: { id: farmaciaData.ciudad?.id || '' },
          departamento: { id: farmaciaData.departamento?.id || '' },
          proveedorInternet: { id: farmaciaData.proveedorInternet?.id || '' },
          pertenece: farmaciaData.pertenece,
          coordenadas: farmaciaData.coordenadas,
          canalTransmision: { id: farmaciaData.canalTransmision?.id || '' },
        });

        setLoading(false);
        Swal.close();
      } catch (error) {
        setLoading(false);
        console.error('Error al cargar los datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información de la farmacia'
        });
      }
    };

    cargarDatos();
  }, [farmaciaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === 'ciudad') {
      const ciudadSeleccionada = ciudades.find(c => c.id.toString() === value);
      if (ciudadSeleccionada) {
        setFormData(prevData => ({
          ...prevData,
          ciudad: { id: value },
          departamento: { id: ciudadSeleccionada.departamento.id.toString() }
        }));
      }
    } else if (id === 'proveedorInternet') {
      setFormData(prevData => ({
        ...prevData,
        proveedorInternet: { id: value }
      }));
    } else if (id === 'canalTransmision') {
      setFormData(prevData => ({
        ...prevData,
        canalTransmision: { id: value }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [id]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.direccion || !formData.ciudad.id ||
      !formData.proveedorInternet.id || !formData.pertenece || !formData.coordenadas ||
      !formData.canalTransmision.id) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, rellena todos los campos obligatorios marcados con *.',
      });
      return;
    }

    try {
      Swal.fire({
        title: 'Actualizando...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      await updateFarmacia(farmaciaId, formData);

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Farmacia actualizada correctamente'
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la farmacia'
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-4">
      <h5>ID: {farmaciaId}</h5>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="nombre" className="form-label">Nombre*</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="coordenadas" className="form-label">Coordenadas*</label>
          <input
            type="text"
            className="form-control"
            id="coordenadas"
            value={formData.coordenadas}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="direccion" className="form-label">Dirección*</label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="ciudad" className="form-label">Ciudad*</label>
          <select
            id="ciudad"
            className="form-select"
            value={formData.ciudad.id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una ciudad</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>
                {ciudad.nombre_ciudad}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="departamento" className="form-label">Departamento</label>
          <input
            type="text"
            className="form-control"
            id="departamento"
            value={formData.ciudad.id ?
              ciudades.find(c => c.id.toString() === formData.ciudad.id)?.departamento.nombre || ''
              : ''}
            disabled
          />
        </div>
        <div className="col-6">
          <label htmlFor="proveedorInternet" className="form-label">Proveedor*</label>
          <select
            id="proveedorInternet"
            className="form-select"
            value={formData.proveedorInternet.id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map(proveedor => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="canalTransmision" className="form-label">Canal de Transmisión*</label>
          <select
            id="canalTransmision"
            className="form-select"
            value={formData.canalTransmision.id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un canal</option>
            {canalesTransmision.map(canal => (
              <option key={canal.id} value={canal.id}>
                {canal.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="pertenece" className="form-label">Pertenece*</label>
          <select
            id="pertenece"
            className="form-select"
            value={formData.pertenece}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="PHARMASER">PHARMASER</option>
            <option value="CONSORCIO">CONSORCIO</option>
          </select>
        </div>

        <div className="text-center">
          <button
            style={{
              backgroundColor: '#f6952c',
              borderColor: '#f6952c',
              cursor: 'pointer',
              background: isHovered2 ? '#ffff' : '#f6952c',
              color: isHovered2 ? '#f6952c' : '#ffff',
            }}
            onMouseEnter={() => setIsHovered2(true)}
            onMouseLeave={() => setIsHovered2(false)}
            type="submit"
            className="btn btn-secondary me-4">
            <i className="bi bi-box-arrow-up m-1" />ACTUALIZAR
          </button>
          <button
            style={{
              backgroundColor: isHovered ? '#f6952c' : '#ffff',
              color: isHovered ? '#fff' : '#f6952c',
              borderColor: '#f6952c',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            <i className="bi bi-arrow-left m-1" />CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioEditarF;