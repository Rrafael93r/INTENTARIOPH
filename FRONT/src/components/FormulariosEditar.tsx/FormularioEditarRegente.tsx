import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getRegenteById, updateRegente } from '../../servicios/regenteService';
import { getFarmacias } from '../../servicios/farmaciaService';

interface Farmacia {
    id: number;
    nombre: string;
}

interface FormularioEditarRegenteProps {
    id: number;
    handleClose: () => void;
    onSuccess: () => void;
}

const FormularioEditarRegente: React.FC<FormularioEditarRegenteProps> = ({ id, handleClose, onSuccess }) => {
    const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        numero: '',
        farmacia: { id: '' }
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [regenteData, farmaciasData] = await Promise.all([
                    getRegenteById(id),
                    getFarmacias()
                ]);

                setFarmacias(farmaciasData);
                setFormData({
                    nombre: regenteData.nombre || '',
                    correo: regenteData.correo || '',
                    numero: regenteData.numero || '',
                    farmacia: { id: regenteData.farmacia?.id || '' }
                });

            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos del regente',
                });
            }
        };
        if (id) {
            cargarDatos();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (id === 'farmacia') {
            setFormData(prevData => ({
                ...prevData,
                farmacia: { id: value }
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

        if (!formData.nombre || !formData.correo || !formData.numero) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, rellena todos los campos obligatorios.',
            });
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                farmacia: formData.farmacia.id ? formData.farmacia : null
            };

            await updateRegente(id, dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Regente Actualizado',
                text: 'El regente fue actualizado correctamente.',
            });

            onSuccess();
            handleClose();

        } catch (error) {
            console.error("Error al actualizar el regente:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el regente.',
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
                    <label htmlFor="correo" className="form-label">Correo*</label>
                    <input
                        type="email"
                        className="form-control"
                        id="correo"
                        value={formData.correo}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="numero" className="form-label">Número*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="numero"
                        value={formData.numero}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label htmlFor="farmacia" className="form-label">Farmacia</label>
                    <select
                        id="farmacia"
                        className="form-select"
                        value={formData.farmacia.id}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una farmacia</option>
                        {farmacias.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.nombre}
                            </option>
                        ))}
                    </select>
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

export default FormularioEditarRegente;
