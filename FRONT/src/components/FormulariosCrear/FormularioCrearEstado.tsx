import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createEstado } from '../../servicios/estadoService';

interface FormularioCrearEstadoProps {
    handleClose: () => void;
    onSuccess: () => void;
}

const FormularioCrearEstado: React.FC<FormularioCrearEstadoProps> = ({ handleClose, onSuccess }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre) {
            Swal.fire('Error', 'El nombre es obligatorio', 'error');
            return;
        }

        setLoading(true);
        try {
            await createEstado({ nombre, descripcion });
            Swal.fire('Éxito', 'Estado creado correctamente', 'success');
            onSuccess();
            handleClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo crear el estado', 'error');
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
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ backgroundColor: '#f6952c', borderColor: '#f6952c' }}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    );
};

export default FormularioCrearEstado;
