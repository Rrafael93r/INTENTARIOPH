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
            <form className="form-grid" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre" className="label-base">Nombre*</label>
                    <input
                        type="text"
                        className="input-base"
                        id="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="apellido" className="label-base">Apellido*</label>
                    <input
                        type="text"
                        className="input-base"
                        id="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="area" className="label-base">Área*</label>
                    <select
                        id="area"
                        className="input-base"
                        value={formData.area.id || (typeof formData.area === 'object' ? (formData.area as any)?.id : '')}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un área</option>
                        {areas.map(a => (
                            <option key={a.id} value={a.id}>{a.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="correo" className="label-base">Correo*</label>
                    <input
                        type="email"
                        className="input-base"
                        id="correo"
                        value={formData.correo}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="farmacias" className="label-base">Farmacia</label>
                    <select
                        id="farmacias"
                        className="input-base"
                        value={formData.farmacias.id}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una farmacia</option>
                        {farmacias.map(f => (
                            <option key={f.id} value={f.id}>{f.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-2 flex justify-center gap-3 pt-2">
                    <button type="submit" className="btn-brand">
                        <i className="bi bi-floppy" /> ACTUALIZAR
                    </button>
                    <button
                        type="button"
                        className="btn-ghost"
                        onClick={handleClose}
                    >
                        <i className="bi bi-x-circle" /> CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioEditarFuncionario;
