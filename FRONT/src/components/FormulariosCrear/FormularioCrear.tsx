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
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

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
        console.log("Proveedor creado:", nuevoProveedor);

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
          <label htmlFor="nit" className="form-label">Nit*</label>
          <input
            type="number"
            className="form-control"
            id="nit"
            value={formData.nit}
            onChange={handleChange}
            min="0"
            max="99999999999"
          />
        </div>
        <div className="col-md-12">
          <label htmlFor="encargado" className="form-label">Nombre de la persona encargada*</label>
          <input
            type="text"
            className="form-control"
            id="nombre_contacto"
            value={formData.nombre_contacto}
            onChange={handleChange}
          />
        </div>
        <div className="col-6">
          <label htmlFor="contacto" className="form-label">Número de contacto*</label>
          <input
            type="number"
            className="form-control"
            id="numero_contacto"
            placeholder="+57"
            value={formData.numero_contacto}
            onChange={handleChange}
            min="0"
            max="99999999999"
          />
        </div>
        <div className="col-6">
          <label htmlFor="correo" className="form-label">Correo*</label>
          <input
            type="email"
            className="form-control"
            id="correo"
            placeholder="Example@gmail.com"
            value={formData.correo}
            onChange={handleChange}
            min="0"
            max="99999999999"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="fechaContratacion" className="form-label">Fecha de contratación*</label>
          <input
            type="date"
            className="form-control"
            id="fecha_contratacion"
            value={formData.fecha_contratacion}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <label htmlFor="observacion" className="form-label">Observación</label>
          <textarea
            className="form-control"
            id="observacion"
            value={formData.observacion}
            onChange={handleChange}
          />
        </div>

        <div className="text-center">
          <button
            style={{
              backgroundColor: '#f6952c', borderColor: '#f6952c',
              cursor: 'pointer',
              background: isHovered2 ? '#ffff' : '#f6952c',

              color: isHovered2 ? '#f6952c' : '#ffff',

            }}
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
            <i className="bi bi-trash-fill m-1" />LIMPIAR
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioCrear;
