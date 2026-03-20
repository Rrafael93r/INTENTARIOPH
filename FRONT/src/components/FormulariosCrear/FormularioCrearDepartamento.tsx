import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createDepartamento } from '../../servicios/departamentosService';

const FormularioCrearDepartamento = ({ handleClose }: { handleClose: () => void }) => {
    const [formData, setFormData] = useState({
        nameDepartamento: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.nameDepartamento) {
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
                nameDepartamento: ''
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
        <div className="p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="nameDepartamento" className="text-sm font-semibold text-gray-700">Nombre del Departamento <span className="text-orange-500">*</span></label>
                        <input
                            type="text"
                            id="nameDepartamento"
                            value={formData.nameDepartamento}
                            onChange={handleChange}
                            required
                            placeholder="Ej. Cundinamarca"
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                        />
                    </div>

                </div>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => setFormData({ nameDepartamento: '' })}
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
                        Guardar Departamento
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearDepartamento;
