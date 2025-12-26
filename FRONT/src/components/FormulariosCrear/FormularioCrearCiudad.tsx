import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createCiudad } from '../../servicios/ciudadesService';
import { getDepartamentos } from '../../servicios/departamentosService';

interface Departamento {
    id: number;
    name_departamento: string;
}

const FormularioCrearCiudad = ({ handleClose }: { handleClose: () => void }) => {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const [formData, setFormData] = useState({
        nombre_ciudad: '',
        departamento: { id: '' }
    });

    useEffect(() => {
        const cargarDepartamentos = async () => {
            try {
                const data = await getDepartamentos();
                setDepartamentos(data);
            } catch (error) {
                console.error('Error al cargar departamentos:', error);
            }
        };
        cargarDepartamentos();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (id === 'departamento') {
            setFormData(prevData => ({
                ...prevData,
                departamento: { id: value }
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

        if (!formData.nombre_ciudad || !formData.departamento.id) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, rellena todos los campos.',
            });
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                departamento: { id: formData.departamento.id }
            };
            await createCiudad(dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Ciudad Creada',
                text: 'La ciudad fue creada correctamente.',
            });

            setFormData({
                nombre_ciudad: '',
                departamento: { id: '' }
            });
            handleClose();

        } catch (error) {
            console.error("Error al crear la ciudad:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear la ciudad.',
            });
        }
    };

    return (
        <div className="p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label htmlFor="nombre_ciudad" className="form-label">Nombre de la Ciudad*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre_ciudad"
                        value={formData.nombre_ciudad}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label htmlFor="departamento" className="form-label">Departamento*</label>
                    <select
                        id="departamento"
                        className="form-select"
                        value={formData.departamento.id}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione...</option>
                        {departamentos.map((depto) => (
                            <option key={depto.id} value={depto.id}>
                                {depto.name_departamento}
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
                        onClick={() => setFormData({ nombre_ciudad: '', departamento: { id: '' } })}
                    >
                        <i className="bi bi-trash-fill m-1" />LIMPIAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearCiudad;
