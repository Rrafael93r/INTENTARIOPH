import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createDepartamento } from '../../servicios/departamentosService';

const FormularioCrearDepartamento = ({ handleClose }: { handleClose: () => void }) => {
    const [formData, setFormData] = useState({
        name_departamento: ''
    });
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name_departamento) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, rellena el nombre del departamento.',
            });
            return;
        }

        try {
            await createDepartamento(formData);

            Swal.fire({
                icon: 'success',
                title: 'Departamento Creado',
                text: 'El departamento fue creado correctamente.',
            });

            setFormData({
                name_departamento: ''
            });
            handleClose();

        } catch (error) {
            console.error("Error al crear el departamento:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el departamento.',
            });
        }
    };

    return (
        <div className="p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-12">
                    <label htmlFor="name_departamento" className="form-label">Nombre del Departamento*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name_departamento"
                        value={formData.name_departamento}
                        onChange={handleChange}
                    />
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
                        onClick={() => setFormData({ name_departamento: '' })}
                    >
                        <i className="bi bi-trash-fill m-1" />LIMPIAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearDepartamento;
