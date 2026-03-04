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
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ backgroundColor: '#f6952c', borderColor: '#f6952c' }}>
                    {loading ? 'Actualizando...' : 'Actualizar'}
                </button>
            </div>
        </form>
    );
};

export default FormularioEditarEstado;
