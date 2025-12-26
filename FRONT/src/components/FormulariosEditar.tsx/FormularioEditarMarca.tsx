import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getMarcaById, updateMarca } from '../../servicios/marcasService';

interface FormularioEditarMarcaProps {
    id: number;
    handleClose: () => void;
    onSuccess: () => void;
}

const FormularioEditarMarca: React.FC<FormularioEditarMarcaProps> = ({ id, handleClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: ''
    });
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const marcaData = await getMarcaById(id);
                setFormData({
                    nombre: marcaData.nombre || ''
                });

            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos de la marca',
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

        if (!formData.nombre) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, rellena el nombre de la marca.',
            });
            return;
        }

        try {
            await updateMarca(id, formData);

            Swal.fire({
                icon: 'success',
                title: 'Marca Actualizada',
                text: 'La marca fue actualizada correctamente.',
            });

            onSuccess();
            handleClose();

        } catch (error) {
            console.error("Error al actualizar la marca:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la marca.',
            });
        }
    };

    return (
        <div className="p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-12">
                    <label htmlFor="nombre" className="form-label">Nombre de la Marca*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        value={formData.nombre}
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

export default FormularioEditarMarca;
