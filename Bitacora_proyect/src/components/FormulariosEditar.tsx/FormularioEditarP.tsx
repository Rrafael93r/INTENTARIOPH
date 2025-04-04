import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProveedorInternetById, updateProveedorInternet } from '../../servicios/ProveedoresService';
import Swal from 'sweetalert2';

interface Proveedor {
  id: string;
  nombre: string;
  nit: string;
  nombre_contacto: string;
  numero_contacto: string;
  correo: string;
  fecha_contratacion: string;
  estado: string;
  observacion: string;
  isDeleted: boolean;
}

interface FormularioEditarPProps {
  ProveedorID: number;
  onClose: () => void;
  onSuccess: () => void;
}


function EditarProveedor({ ProveedorID, onClose, onSuccess }: FormularioEditarPProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [proveedor, setProveedor] = useState<Proveedor>({
    id: '',
    nombre: '',
    nit: '',
    nombre_contacto: '',
    numero_contacto: '',
    correo: '',
    fecha_contratacion: '',
    estado: '',
    observacion: '',
    isDeleted: false
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!id) return;

        setLoading(true);
        Swal.fire({
          title: 'Cargando...',
          text: 'Por favor espere',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const proveedorData = await getProveedorInternetById(Number(id));
        setProveedor({
          id: proveedorData.id?.toString() || '',
          nombre: proveedorData.nombre || '',
          nit: proveedorData.nit?.toString() || '',
          nombre_contacto: proveedorData.nombre_contacto || '',
          numero_contacto: proveedorData.numero_contacto || '',
          correo: proveedorData.correo || '',
          fecha_contratacion: proveedorData.fecha_contratacion || '',
          estado: proveedorData.estado || '',
          observacion: proveedorData.observacion || '',
          isDeleted: proveedorData.isDeleted || false
        });

        setLoading(false);
        Swal.close();
      } catch (error) {
        setLoading(false);
        console.error('Error al cargar el proveedor:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del proveedor'
        });
      }
    };

    cargarDatos();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProveedor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      Swal.fire({
        title: 'Actualizando...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });


      const proveedorToUpdate = {
        ...proveedor,
        id: Number(proveedor.id),
        nit: Number(proveedor.nit)
      };

      await updateProveedorInternet(Number(id), proveedorToUpdate);

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Proveedor actualizado correctamente'
      });

      navigate('/proveedores');
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el proveedor'
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="card card-body shadow-sm">
      <h5>ID: {id}</h5>
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="nombre" className="form-label">Nombre*</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={proveedor.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="nit" className="form-label">Nit*</label>
          <input
            type="number"
            className="form-control"
            name="nit"
            value={proveedor.nit}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="nombre_contacto" className="form-label">Nombre de la persona encargada*</label>
          <input
            type="text"
            className="form-control"
            name="nombre_contacto"
            value={proveedor.nombre_contacto}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-6">
          <label htmlFor="numero_contacto" className="form-label">Número de contacto*</label>
          <input
            type="tel"
            className="form-control"
            name="numero_contacto"
            value={proveedor.numero_contacto}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-6">
          <label htmlFor="correo" className="form-label">Correo*</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={proveedor.correo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="fecha_contratacion" className="form-label">Fecha de contratación*</label>
          <input
            type="date"
            className="form-control"
            name="fecha_contratacion"
            value={proveedor.fecha_contratacion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="estado" className="form-label">Estado</label>
          <select
            name="estado"
            className="form-select"
            value={proveedor.estado}
            onChange={handleInputChange}
            required
          >
            <option value="">--</option>
            <option value="EN SERVICIO">EN SERVICIO</option>
            <option value="NO ACTIVO">NO ACTIVO</option>
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="observacion" className="form-label">Observación</label>
          <textarea
            className="form-control"
            name="observacion"
            value={proveedor.observacion}
            onChange={handleInputChange}
          />
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
            className="btn btn-secondary m-2"
          >
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
            onClick={() => navigate('/proveedores')}
          >
            <i className="bi bi-arrow-left m-1" />CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarProveedor;