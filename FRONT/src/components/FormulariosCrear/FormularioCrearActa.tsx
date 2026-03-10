import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createActa } from '../../servicios/actaService';

const FormularioCrearActa = ({ handleClose }: { handleClose: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        url_archivo: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.titulo || !formData.fecha) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, rellena los campos obligatorios.',
            });
            return;
        }

        try {
            await createActa(formData);

            Swal.fire({
                icon: 'success',
                title: 'Acta Creada',
                text: 'El acta fue creada correctamente.',
            });

            setFormData({
                titulo: '',
                descripcion: '',
                fecha: '',
                url_archivo: ''
            });
            handleClose();

        } catch (error) {
            console.error("Error al crear el acta:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el acta.',
            });
        }
    };

    return (
        <div className="p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                    <div className="flex flex-col space-y-1.5 md:col-span-2">
                        <label htmlFor="titulo" className="text-sm font-semibold text-gray-700">Título <span className="text-orange-500">*</span></label>
                        <input
                            type="text"
                            id="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            placeholder="Título del acta"
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="fecha" className="text-sm font-semibold text-gray-700">Fecha <span className="text-orange-500">*</span></label>
                        <input
                            type="date"
                            id="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="url_archivo" className="text-sm font-semibold text-gray-700">URL del Archivo</label>
                        <input
                            type="text"
                            id="url_archivo"
                            value={formData.url_archivo}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/archivo.pdf"
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5 md:col-span-2">
                        <label htmlFor="descripcion" className="text-sm font-semibold text-gray-700">Descripción</label>
                        <textarea
                            id="descripcion"
                            rows={4}
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción detallada del acta..."
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 resize-y"
                        ></textarea>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => setFormData({
                            titulo: '',
                            descripcion: '',
                            fecha: '',
                            url_archivo: ''
                        })}
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
                        Guardar Acta
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearActa;
