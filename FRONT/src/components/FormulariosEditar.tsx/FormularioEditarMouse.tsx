import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getMouseById, updateMouse } from '../../servicios/mousesService';
import { getFuncionarios } from '../../servicios/funcionariosService';

interface Funcionario {
    id: number;
    nombre: string;
    apellido: string;
}

interface FormularioEditarMouseProps {
    id: number;
    handleClose: () => void;
    onSuccess: () => void;
}

const FormularioEditarMouse: React.FC<FormularioEditarMouseProps> = ({ id, handleClose, onSuccess }) => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        serial: '',
        estado: '',
        fecha_compra: '',
        funcionarios: { id: '' },
        descripcion: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [mouseData, funcionariosData] = await Promise.all([
                    getMouseById(id),
                    getFuncionarios()
                ]);

                setFuncionarios(funcionariosData);
                setFormData({
                    marca: mouseData.marca || '',
                    modelo: mouseData.modelo || '',
                    serial: mouseData.serial || '',
                    estado: mouseData.estado || '',
                    fecha_compra: mouseData.fecha_compra || '',
                    funcionarios: { id: mouseData.funcionarios?.id || '' },
                    descripcion: mouseData.descripcion || ''
                });

            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos del mouse',
                });
            }
        };
        if (id) {
            cargarDatos();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (id === 'funcionarios') {
            setFormData(prevData => ({
                ...prevData,
                funcionarios: { id: value }
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

        if (!formData.marca || !formData.modelo || !formData.serial || !formData.estado) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, rellena todos los campos obligatorios.',
            });
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                funcionarios: formData.funcionarios.id ? formData.funcionarios : null
            };

            await updateMouse(id, dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Mouse Actualizado',
                text: 'El mouse fue actualizado correctamente.',
            });

            onSuccess();
            handleClose();

        } catch (error) {
            console.error("Error al actualizar el mouse:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el mouse.',
            });
        }
    };

    return (
        <div className="p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label htmlFor="marca" className="form-label">Marca*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="marca"
                        value={formData.marca}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="modelo" className="form-label">Modelo*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="serial" className="form-label">Serial*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="serial"
                        value={formData.serial}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="estado" className="form-label">Estado*</label>
                    <select
                        id="estado"
                        className="form-select"
                        value={formData.estado}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un estado</option>
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="INACTIVO">INACTIVO</option>
                        <option value="DAÑADO">DAÑADO</option>
                        <option value="EN SOPORTE">EN SOPORTE</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label htmlFor="fecha_compra" className="form-label">Fecha de Compra</label>
                    <input
                        type="date"
                        className="form-control"
                        id="fecha_compra"
                        value={formData.fecha_compra}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label htmlFor="funcionarios" className="form-label">Asignado a</label>
                    <select
                        id="funcionarios"
                        className="form-select"
                        value={formData.funcionarios.id}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un funcionario</option>
                        {funcionarios.map(func => (
                            <option key={func.id} value={func.id}>
                                {func.nombre} {func.apellido}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-12">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        id="descripcion"
                        rows={3}
                        value={formData.descripcion}
                        onChange={handleChange}
                    ></textarea>
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
                        <i className="bi bi-floppy m-1" />ACTUALIZAR
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
                        onClick={handleClose}
                    >
                        <i className="bi bi-x-circle m-1" />CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioEditarMouse;
