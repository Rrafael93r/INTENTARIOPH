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

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: { id: '' },
    departamento: { id: '' },
    proveedorInternet: { id: '' },
    pertenece: '',
    coordenadas: '',
    canalTransmision: { id: '' },
    cantidadEquipos: 0,
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
          cantidadEquipos: farmaciaData.cantidadEquipos || 0,
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
      !formData.canalTransmision.id || formData.cantidadEquipos === undefined) {
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
    <div className="p-2 sm:p-4">
      <div className="mb-4 text-sm font-semibold text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block">
        ID: {farmaciaId}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="nombre" className="text-sm font-semibold text-gray-700">Nombre <span className="text-orange-500">*</span></label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Nombre de la farmacia"
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="coordenadas" className="text-sm font-semibold text-gray-700">Coordenadas <span className="text-orange-500">*</span></label>
            <input
              type="text"
              id="coordenadas"
              value={formData.coordenadas}
              onChange={handleChange}
              required
              placeholder="Ej: 4.6097, -74.0817"
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label htmlFor="direccion" className="text-sm font-semibold text-gray-700">Dirección <span className="text-orange-500">*</span></label>
            <input
              type="text"
              id="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              placeholder="Dirección completa"
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="ciudad" className="text-sm font-semibold text-gray-700">Ciudad <span className="text-orange-500">*</span></label>
            <div className="relative">
              <select
                id="ciudad"
                value={formData.ciudad.id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Seleccione una ciudad...</option>
                {ciudades.map(ciudad => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre_ciudad}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="bi bi-chevron-down text-xs"></i>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="departamento" className="text-sm font-semibold text-gray-700">Departamento</label>
            <input
              type="text"
              id="departamento"
              value={formData.ciudad.id ?
                ciudades.find(c => c.id.toString() === formData.ciudad.id)?.departamento.nombre || ''
                : ''}
              disabled
              className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-not-allowed focus:outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="cantidadEquipos" className="text-sm font-semibold text-gray-700">Cantidad Equipos</label>
            <input
              type="number"
              id="cantidadEquipos"
              value={formData.cantidadEquipos}
              onChange={handleChange}
              placeholder="0"
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="proveedorInternet" className="text-sm font-semibold text-gray-700">Proveedor de Internet <span className="text-orange-500">*</span></label>
            <div className="relative">
              <select
                id="proveedorInternet"
                value={formData.proveedorInternet.id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Seleccione un proveedor...</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="bi bi-chevron-down text-xs"></i>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="canalTransmision" className="text-sm font-semibold text-gray-700">Canal de Transmisión <span className="text-orange-500">*</span></label>
            <div className="relative">
              <select
                id="canalTransmision"
                value={formData.canalTransmision.id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Seleccione un canal...</option>
                {canalesTransmision.map(canal => (
                  <option key={canal.id} value={canal.id}>
                    {canal.nombre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="bi bi-chevron-down text-xs"></i>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label htmlFor="pertenece" className="text-sm font-semibold text-gray-700">Pertenece <span className="text-orange-500">*</span></label>
            <div className="relative">
              <select
                id="pertenece"
                value={formData.pertenece}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Seleccione una opción...</option>
                <option value="PHARMASER">PHARMASER</option>
                <option value="CONSORCIO">CONSORCIO</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="bi bi-chevron-down text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 flex items-center justify-center"
          >
            <i className="bi bi-arrow-left mr-2"></i>
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-transparent bg-orange-500 text-white hover:bg-orange-600 font-medium text-sm transition-all shadow-sm shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center"
          >
            <i className="bi bi-box-arrow-up mr-2"></i>
            Actualizar Farmacia
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioEditarF;