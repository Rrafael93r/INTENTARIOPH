import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createImpresora } from '../../servicios/impresoraService';
import { getFuncionarios } from '../../servicios/funcionariosService';

interface Funcionario {
    id: number;
    nombre: string;
    apellido: string;
}

const FormularioCrearImpresora = ({ handleClose }: { handleClose: () => void }) => {
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
                const funcionariosData = await getFuncionarios();
                setFuncionarios(funcionariosData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los funcionarios',
                });
            }
        };
        cargarDatos();
    }, []);

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

            await createImpresora(dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Impresora Creada',
                text: 'La impresora fue creada correctamente.',
            });

            setFormData({
                marca: '',
                modelo: '',
                serial: '',
                estado: '',
                fecha_compra: '',
                funcionarios: { id: '' },
                descripcion: ''
            });
            handleClose();

        } catch (error) {
            console.error("Error al crear la impresora:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear la impresora.',
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
                        <i className="bi bi-floppy m-1" />GUARDAR
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
                        onClick={() => setFormData({
                            marca: '',
                            modelo: '',
                            serial: '',
                            estado: '',
                            fecha_compra: '',
                            funcionarios: { id: '' },
                            descripcion: ''
                        })}
                    >
                        <i className="bi bi-trash-fill m-1" />LIMPIAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearImpresora;
