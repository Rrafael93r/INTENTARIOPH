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
        <div className="p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="nombre_ciudad" className="text-sm font-semibold text-gray-700">Nombre de la Ciudad <span className="text-orange-500">*</span></label>
                        <input
                            type="text"
                            id="nombre_ciudad"
                            value={formData.nombre_ciudad}
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
                                    {depto.name_departamento}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => setFormData({ nombre_ciudad: '', departamento: { id: '' } })}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 flex items-center justify-center"
                    >
                        <i className="bi bi-trash-fill mr-2"></i>
                        Limpiar
                    </button>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-transparent bg-orange-500 text-white hover:bg-orange-600 font-medium text-sm transition-all shadow-sm shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center"
                    >
                        <i className="bi bi-floppy mr-2"></i>
                        Guardar Ciudad
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearCiudad;
