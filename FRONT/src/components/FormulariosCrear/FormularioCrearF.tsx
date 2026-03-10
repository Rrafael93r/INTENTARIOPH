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
      !formData.canalTransmision.id || formData.cantidadEquipos === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, rellena todos los campos obligatorios marcados con *.',
      });
      return;
    }

    try {
      const response = await createFarmacia(formData);


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
        cantidadEquipos: 0,
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
    <div className="p-2 sm:p-4">
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
            onClick={() => setFormData({
              nombre: '',
              direccion: '',
              ciudad: { id: '' },
              departamento: { id: '' },
              proveedorInternet: { id: '' },
              pertenece: '',
              coordenadas: '',
              canalTransmision: { id: '' },
              cantidadEquipos: 0,
            })}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 flex items-center justify-center"
          >
            <i className="bi bi-trash-fill mr-2"></i>
            Limpiar
          </button>
          <button
            type="submit"
            onClick={handleClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-transparent bg-orange-500 text-white hover:bg-orange-600 font-medium text-sm transition-all shadow-sm shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center"
          >
            <i className="bi bi-floppy mr-2"></i>
            Guardar Farmacia
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioCrearF;