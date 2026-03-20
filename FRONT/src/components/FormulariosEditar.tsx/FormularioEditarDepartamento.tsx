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
        nameDepartamento: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const departamentoData = await getDepartamentoById(id);
                setFormData({
                    nameDepartamento: departamentoData.nameDepartamento || ''
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

        if (!formData.nameDepartamento) {
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
        <div className="p-2 sm:p-4">
            <div className="mb-4 text-sm font-semibold text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block">
                ID: {id}
            </div>

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
                        Actualizar Departamento
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioEditarDepartamento;
