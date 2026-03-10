import React, { useState } from 'react';
import Swal from 'sweetalert2';

function FormularioCrear() {
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    nombre_contacto: '',
    numero_contacto: '',
    correo: '',
    estado: 'EN SERVICIO',
    fecha_contratacion: '',
    observacion: '',
    isDeleted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const { nombre, nit, nombre_contacto, numero_contacto, correo, fecha_contratacion } = formData;
    if (!nombre || !nit || !nombre_contacto || !numero_contacto || !correo || !fecha_contratacion) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, rellena todos los campos obligatorios marcados con *.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/proveedorinternet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const nuevoProveedor = await response.json();


        Swal.fire({
          icon: 'success',
          title: 'Proveedor creado',
          text: 'El proveedor se ha creado correctamente.',
        });


        setFormData({
          nombre: '',
          nit: '',
          nombre_contacto: '',
          numero_contacto: '',
          correo: '',
          estado: 'EN SERVICIO',
          fecha_contratacion: '',
          observacion: '',
          isDeleted: false,
        });
      } else {
        console.error("Error al crear el proveedor");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el proveedor. Por favor, inténtalo nuevamente.',
        });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Hubo un problema al conectar con el servidor.',
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div className="md:col-span-1">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="nit" className="block text-sm font-medium text-gray-700 mb-1">Nit*</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            id="nit"
            value={formData.nit}
            onChange={handleChange}
            min="0"
            max="99999999999"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="nombre_contacto" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la persona encargada*</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            id="nombre_contacto"
            value={formData.nombre_contacto}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="numero_contacto" className="block text-sm font-medium text-gray-700 mb-1">Número de contacto*</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            id="numero_contacto"
            placeholder="+57"
            value={formData.numero_contacto}
            onChange={handleChange}
            min="0"
            max="99999999999"
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">Correo*</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            id="correo"
            placeholder="Example@gmail.com"
            value={formData.correo}
            onChange={handleChange}
            min="0"
            max="99999999999"
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="fecha_contratacion" className="block text-sm font-medium text-gray-700 mb-1">Fecha de contratación*</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            id="fecha_contratacion"
            value={formData.fecha_contratacion}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="observacion" className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            id="observacion"
            rows={3}
            value={formData.observacion}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2 flex justify-center gap-4 mt-4">
          <button
            type="submit"
            className="flex items-center justify-center px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition-colors"
          >
            <i className="bi bi-floppy mr-2" />
            GUARDAR
          </button>
          <button
            type="button"
            className="flex items-center justify-center px-6 py-2.5 border-2 border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-50 focus:ring-4 focus:ring-orange-200 transition-colors"
            onClick={() => setFormData({
              nombre: '',
              nit: '',
              nombre_contacto: '',
              numero_contacto: '',
              correo: '',
              estado: 'EN SERVICIO',
              fecha_contratacion: '',
              observacion: '',
              isDeleted: false,
            })}
          >
            <i className="bi bi-trash-fill mr-2" />
            LIMPIAR
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioCrear;
