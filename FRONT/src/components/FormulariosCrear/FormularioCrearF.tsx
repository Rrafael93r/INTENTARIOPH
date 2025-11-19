import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getCiudades, getProveedores, getCanalesTransmision, createFarmacia } from '../../servicios/api';


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

function FormularioCrearF({ handleClose }: { handleClose: () => void }) {
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
        const [ciudadesData, proveedoresData, canalesData] = await Promise.all([
          getCiudades(),
          getProveedores(),
          getCanalesTransmision()
        ]);
        setCiudades(ciudadesData);
        setProveedores(proveedoresData);
        setCanalesTransmision(canalesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los datos necesarios',
        });
      }
    };

    cargarDatos();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const response = await createFarmacia(formData);
      console.log("Farmacia Creada:", response);

      Swal.fire({
        icon: 'success',
        title: 'Farmacia Creada',
        text: 'La farmacia fue creada correctamente.',
      });

      setFormData({
        nombre: '',
        direccion: '',
        ciudad: { id: '' },
        departamento: { id: '' },
        proveedorInternet: { id: '' },
        pertenece: '',
        coordenadas: '',
        canalTransmision: { id: '' },
      });
    } catch (error) {
      console.error("Error al crear la farmacia:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la farmacia. Por favor, inténtalo nuevamente.',
      });
    }
  };

  return (
    <div className="p-4">
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="nombre" className="form-label">Nombre*</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
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
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="ciudad" className="form-label">Ciudad*</label>
          <select
            id="ciudad"
            className="form-select"
            value={formData.ciudad.id}
            onChange={handleChange}
          >
            <option value="">Seleccione una ciudad</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>
                {ciudad.nombre_ciudad}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="proveedorInternet" className="form-label">Proveedor*</label>
          <select
            id="proveedorInternet"
            className="form-select"
            value={formData.proveedorInternet.id}
            onChange={handleChange}
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
          >
            <option value="">Seleccione una opción</option>
            <option value="PHARMASER">PHARMASER</option>
            <option value="CONSORCIO">CONSORCIO</option>
          </select>
        </div>

        <div className="text-center">
          <button
            style={{
              backgroundColor: '#f6952c', borderColor: '#f6952c',
              cursor: 'pointer',
              background: isHovered2 ? '#ffff' : '#f6952c',

              color: isHovered2 ? '#f6952c' : '#ffff',

            }}
            onClick={handleClose}
            onMouseEnter={() => setIsHovered2(true)}
            onMouseLeave={() => setIsHovered2(false)}
            type="submit" className="btn btn-secondary me-4">
            <i className="bi bi-floppy m-1" />GUARDAR
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
            type="reset"
            className="btn btn-outline-secondary"
            onClick={() => setFormData({
              nombre: '',
              direccion: '',
              ciudad: { id: '' },
              departamento: { id: '' },
              proveedorInternet: { id: '' },
              pertenece: '',
              coordenadas: '',
              canalTransmision: { id: '' },
            })}
          >
            <i className="bi bi-trash-fill m-1" />LIMPIAR
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioCrearF;