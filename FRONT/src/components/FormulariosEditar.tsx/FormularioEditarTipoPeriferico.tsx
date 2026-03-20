import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getTipoPerifericoById, updateTipoPeriferico } from '../../servicios/tiposPerifericosService';

interface Props {
    id: number;
    handleClose: () => void;
    onSuccess: () => void;
}

const FormularioEditarTipoPeriferico: React.FC<Props> = ({ id, handleClose, onSuccess }) => {
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getTipoPerifericoById(id);
                setNombre(data.nombre);
            } catch (err) {
                console.error('Error', err);
                Swal.fire('Error', 'No se pudo cargar el tipo', 'error');
            }
        };
        if (id) load();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nombre.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'El nombre es obligatorio.',
            });
            return;
        }

        try {
            await updateTipoPeriferico(id, { nombre: nombre.toUpperCase() });

            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'El tipo fue actualizado correctamente.',
            });

            onSuccess();
            handleClose();

        } catch (error) {
            console.error("Error al actualizar:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar.',
            });
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Tipo*</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition-all duration-200"
                    >
                        <i className="bi bi-floppy mr-2" /> ACTUALIZAR
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex items-center justify-center px-6 py-2.5 bg-white text-orange-500 border border-orange-500 font-medium rounded-lg hover:bg-orange-50 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                    >
                        <i className="bi bi-x-circle mr-2" /> CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioEditarTipoPeriferico;
