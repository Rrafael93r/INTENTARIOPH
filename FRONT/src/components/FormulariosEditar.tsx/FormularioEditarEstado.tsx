import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateEstado, getEstadoById } from '../../servicios/estadoService';

interface FormularioEditarEstadoProps {
    estadoId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const FormularioEditarEstado: React.FC<FormularioEditarEstadoProps> = ({ estadoId, onClose, onSuccess }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadEstado = async () => {
            try {
                const data = await getEstadoById(estadoId);
                setNombre(data.nombre);
                setDescripcion(data.descripcion);
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo cargar la información del estado', 'error');
                onClose();
            }
        };
        loadEstado();
    }, [estadoId, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre) {
            Swal.fire('Error', 'El nombre es obligatorio', 'error');
            return;
        }

        setLoading(true);
        try {
            await updateEstado(estadoId, { nombre, descripcion });
            Swal.fire('Éxito', 'Estado actualizado correctamente', 'success');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4 text-sm font-semibold text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block">
                ID: {estadoId}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Nombre <span className="text-orange-500">*</span></label>
                    <input
                        type="text"
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Descripción</label>
                    <textarea
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all min-h-[100px] resize-y"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100">
                <button
                    type="button"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-transparent bg-orange-500 text-white hover:bg-orange-600 font-medium text-sm transition-all shadow-sm shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Actualizando...
                        </>
                    ) : (
                        'Actualizar'
                    )}
                </button>
            </div>
        </form>
    );
};

export default FormularioEditarEstado;
