import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createImpresoraPos } from '../../servicios/impresoraPosService';
import { getFuncionarios } from '../../servicios/funcionariosService';

interface Funcionario {
    id: number;
    nombre: string;
    apellido: string;
}

const FormularioCrearImpresoraPos = ({ handleClose }: { handleClose: () => void }) => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

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

            await createImpresoraPos(dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Impresora POS Creada',
                text: 'La impresora POS fue creada correctamente.',
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
            console.error("Error al crear la impresora POS:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear la impresora POS.',
            });
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="mb-4 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 m-0">Registro de Nueva Impresora POS</h3>
                <p className="text-sm text-gray-500 m-0 mt-1">Complete los datos para ingresar una nueva impresora de punto de venta</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                            id="marca"
                            value={formData.marca}
                            onChange={handleChange}
                            placeholder="Ej. Epson, Bixolon"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                            id="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                            placeholder="Ej. TM-T20III"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="serial" className="block text-sm font-medium text-gray-700">Serial <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                            id="serial"
                            value={formData.serial}
                            onChange={handleChange}
                            placeholder="Número de serie"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado <span className="text-red-500">*</span></label>
                        <select
                            id="estado"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                            value={formData.estado}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un estado</option>
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                            <option value="DAÑADO">DAÑADO</option>
                            <option value="EN SOPORTE">EN SOPORTE</option>
                            <option value="ASIGNADO">ASIGNADO</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="fecha_compra" className="block text-sm font-medium text-gray-700">Fecha de Compra</label>
                        <input
                            type="date"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                            id="fecha_compra"
                            value={formData.fecha_compra}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="funcionarios" className="block text-sm font-medium text-gray-700">Asignado a</label>
                        <select
                            id="funcionarios"
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                            value={formData.funcionarios.id}
                            onChange={handleChange}
                        >
                            <option value="">Ninguno / Sin asignar</option>
                            {funcionarios.map(func => (
                                <option key={func.id} value={func.id}>
                                    {func.nombre} {func.apellido}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción / Detalles adicionales</label>
                    <textarea
                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                        id="descripcion"
                        rows={3}
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Observaciones sobre el estado, características, etc."
                    ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors flex items-center"
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
                        <i className="bi bi-trash-fill mr-2" /> Limpiar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors flex items-center"
                    >
                        <i className="bi bi-floppy mr-2" /> Guardar Impresora POS
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearImpresoraPos;
