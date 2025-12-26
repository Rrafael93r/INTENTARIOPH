import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getDepartamentoById, updateDepartamento } from '../../servicios/departamentosService';

interface FormularioEditarDepartamentoProps {
    id: number;
    handleClose: () => void;
    onSuccess: () => void;
}

const FormularioEditarDepartamento: React.FC<FormularioEditarDepartamentoProps> = ({ id, handleClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name_departamento: ''
    });
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const departamentoData = await getDepartamentoById(id);
                setFormData({
                    name_departamento: departamentoData.name_departamento || ''
                });

            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos del departamento',
                });
            }
        };
        if (id) {
            cargarDatos();
        }
    }, [id]);

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
            await updateDepartamento(id, formData);

            Swal.fire({
                icon: 'success',
                title: 'Departamento Actualizado',
                text: 'El departamento fue actualizado correctamente.',
            });

            onSuccess();
            handleClose();

        } catch (error) {
            console.error("Error al actualizar el departamento:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el departamento.',
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
                        <i className="bi bi-floppy m-1" />ACTUALIZAR
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
                        onClick={handleClose}
                    >
                        <i className="bi bi-x-circle m-1" />CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioEditarDepartamento;
