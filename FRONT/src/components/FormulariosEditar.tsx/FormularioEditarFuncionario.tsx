import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getFuncionarioById, updateFuncionario } from '../../servicios/funcionariosService';
import { getAreas } from '../../servicios/areasService';
import { getFarmacias } from '../../servicios/farmaciaService';

interface Farmacia {
    id: number;
    nombre: string;
}

interface Area {
    id: number;
    nombre: string;
}

interface FormularioEditarFuncionarioProps {
    id: number;
    handleClose: () => void;
    onSuccess: () => void;
}

const FormularioEditarFuncionario: React.FC<FormularioEditarFuncionarioProps> = ({ id, handleClose, onSuccess }) => {
    const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        area: { id: '' },
        correo: '',
        farmacias: { id: '' }
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [funcionarioData, farmaciasData, areasData] = await Promise.all([
                    getFuncionarioById(id),
                    getFarmacias(),
                    getAreas()
                ]);

                setFarmacias(farmaciasData);
                setAreas(areasData);
                setFormData({
                    nombre: funcionarioData.nombre || '',
                    apellido: funcionarioData.apellido || '',
                    area: funcionarioData.area || { id: '' },
                    correo: funcionarioData.correo || '',
                    farmacias: { id: funcionarioData.farmacias?.id || '' }
                });

            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos del funcionario',
                });
            }
        };
        if (id) {
            cargarDatos();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (id === 'farmacias') {
            setFormData(prevData => ({
                ...prevData,
                farmacias: { id: value }
            }));
        } else if (id === 'area') {
            setFormData(prevData => ({
                ...prevData,
                area: { id: value }
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

        if (!formData.nombre || !formData.apellido || !formData.area.id || !formData.correo) {
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
                farmacias: formData.farmacias.id ? formData.farmacias : null
            };

            await updateFuncionario(id, dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Funcionario Actualizado',
                text: 'El funcionario fue actualizado correctamente.',
            });

            onSuccess();
            handleClose();

        } catch (error) {
            console.error("Error al actualizar el funcionario:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el funcionario.',
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
                    <label htmlFor="apellido" className="form-label">Apellido*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="area" className="form-label">Área*</label>
                    <select
                        id="area"
                        className="form-select"
                        value={formData.area.id || (typeof formData.area === 'object' ? (formData.area as any)?.id : '')}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un área</option>
                        {areas.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.nombre}
                            </option>
                        ))}
                    </select>
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
                    <label htmlFor="farmacias" className="form-label">Farmacia</label>
                    <select
                        id="farmacias"
                        className="form-select"
                        value={formData.farmacias.id}
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

export default FormularioEditarFuncionario;
