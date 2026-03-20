import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getCiudadById, updateCiudad } from '../../servicios/ciudadesService';
import { getDepartamentos } from '../../servicios/departamentosService';

interface Departamento {
    id: number;
    nameDepartamento: string;
}

interface FormularioEditarCiudadProps {
    id: number;
    handleClose: () => void;
    onSuccess: () => void;
}

const FormularioEditarCiudad: React.FC<FormularioEditarCiudadProps> = ({ id, handleClose, onSuccess }) => {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [formData, setFormData] = useState({
        nombreCiudad: '',
        departamento: { id: '' }
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [ciudadData, deptosData] = await Promise.all([
                    getCiudadById(id),
                    getDepartamentos()
                ]);

                setDepartamentos(deptosData);
                setFormData({
                    nombreCiudad: ciudadData.nombreCiudad || '',
                    departamento: { id: ciudadData.departamento?.id || '' }
                });

            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos de la ciudad',
                });
            }
        };
        if (id) {
            cargarDatos();
        }
    }, [id]);

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

        if (!formData.nombreCiudad || !formData.departamento.id) {
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
            await updateCiudad(id, dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Ciudad Actualizada',
                text: 'La ciudad fue actualizada correctamente.',
            });

            onSuccess();
            handleClose();

        } catch (error) {
            console.error("Error al actualizar la ciudad:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la ciudad.',
            });
        }
    };

    return (
        <div className="p-2 sm:p-4">
            <div className="mb-4 text-sm font-semibold text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block">
                ID: {id}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="nombreCiudad" className="text-sm font-semibold text-gray-700">Nombre de la Ciudad <span className="text-orange-500">*</span></label>
                        <input
                            type="text"
                            id="nombreCiudad"
                            value={formData.nombreCiudad}
                            onChange={handleChange}
                            required
                            placeholder="Ej. Bogotá"
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="departamento" className="text-sm font-semibold text-gray-700">Departamento <span className="text-orange-500">*</span></label>
                        <select
                            id="departamento"
                            value={formData.departamento.id}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        >
                            <option value="">Seleccione...</option>
                            {departamentos.map((depto) => (
                                <option key={depto.id} value={depto.id}>
                                    {depto.nameDepartamento}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 flex items-center justify-center"
                    >
                        <i className="bi bi-x-circle mr-2"></i>
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-transparent bg-orange-500 text-white hover:bg-orange-600 font-medium text-sm transition-all shadow-sm shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center"
                    >
                        <i className="bi bi-floppy mr-2"></i>
                        Actualizar Ciudad
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioEditarCiudad;
