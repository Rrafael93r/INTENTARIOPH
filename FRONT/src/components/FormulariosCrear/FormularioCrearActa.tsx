import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createActa } from '../../servicios/actaService';

const FormularioCrearActa = ({ handleClose }: { handleClose: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        url_archivo: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.titulo || !formData.fecha) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, rellena los campos obligatorios.',
            });
            return;
        }

        try {
            await createActa(formData);

            Swal.fire({
                icon: 'success',
                title: 'Acta Creada',
                text: 'El acta fue creada correctamente.',
            });

            setFormData({
                titulo: '',
                descripcion: '',
                fecha: '',
                url_archivo: ''
            });
            handleClose();

        } catch (error) {
            console.error("Error al crear el acta:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el acta.',
            });
        }
    };

    return (
        <div className="p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                    <label htmlFor="titulo" className="form-label">Título*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="fecha" className="form-label">Fecha*</label>
                    <input
                        type="date"
                        className="form-control"
                        id="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="url_archivo" className="form-label">URL del Archivo</label>
                    <input
                        type="text"
                        className="form-control"
                        id="url_archivo"
                        value={formData.url_archivo}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/archivo.pdf"
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        id="descripcion"
                        rows={3}
                        value={formData.descripcion}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="text-center mt-4">
                    <button
                        style={{
                            backgroundColor: '#f6952c', borderColor: '#f6952c',
                            cursor: 'pointer',
                            background: isHovered2 ? '#ffff' : '#f6952c',
                            color: isHovered2 ? '#f6952c' : '#ffff',
                        }}
                        onMouseEnter={() => setIsHovered2(true)}
                        onMouseLeave={() => setIsHovered2(false)}
                        type="submit" className="btn btn-primary me-4">
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
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setFormData({
                            titulo: '',
                            descripcion: '',
                            fecha: '',
                            url_archivo: ''
                        })}
                    >
                        <i className="bi bi-trash-fill m-1" />LIMPIAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearActa;
