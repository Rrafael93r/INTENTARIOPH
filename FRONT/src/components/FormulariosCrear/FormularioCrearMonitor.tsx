import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createMonitor } from '../../servicios/monitoresService';
import { getFuncionarios } from '../../servicios/funcionariosService';
import { getMarcas } from '../../servicios/marcasService';

interface Funcionario {
    id: number;
    nombre: string;
    apellido: string;
}

interface Marca {
    id: number;
    nombre: string;
}

const FormularioCrearMonitor = ({ handleClose }: { handleClose: () => void }) => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);

    const [formData, setFormData] = useState({
        marca: { id: '' },
        modelo: '',
        serial: '',
        estado: '',
        fecha_compra: '',
        funcionario: { id: '' },
        descripcion: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const funcionariosData = await getFuncionarios();
                setFuncionarios(funcionariosData);
                const marcasData = await getMarcas();
                setMarcas(marcasData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos',
                });
            }
        };
        cargarDatos();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (id === 'funcionario') {
            setFormData(prevData => ({
                ...prevData,
                funcionario: { id: value }
            }));
        } else if (id === 'marca') {
            setFormData(prevData => ({
                ...prevData,
                marca: { id: value }
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

        if (!formData.marca.id || !formData.modelo || !formData.serial || !formData.estado) {
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
                funcionario: formData.funcionario.id ? formData.funcionario : null,
                marca: formData.marca.id ? formData.marca : null
            };

            await createMonitor(dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Monitor Creado',
                text: 'El monitor fue creado correctamente.',
            });

            setFormData({
                marca: { id: '' },
                modelo: '',
                serial: '',
                estado: '',
                fecha_compra: '',
                funcionario: { id: '' },
                descripcion: ''
            });
            handleClose();

        } catch (error) {
            console.error("Error al crear el monitor:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el monitor.',
            });
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                    <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca*</label>
                    <select
                        id="marca"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        value={formData.marca.id}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una marca</option>
                        {marcas.map(marca => (
                            <option key={marca.id} value={marca.id}>
                                {marca.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo*</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        id="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        placeholder="Ej: ProDisplay P223"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="serial" className="block text-sm font-medium text-gray-700">Serial*</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        id="serial"
                        value={formData.serial}
                        onChange={handleChange}
                        placeholder="Número de serie"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado*</label>
                    <select
                        id="estado"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
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

                <div className="space-y-1">
                    <label htmlFor="fecha_compra" className="block text-sm font-medium text-gray-700">Fecha de Compra</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        id="fecha_compra"
                        value={formData.fecha_compra}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="funcionario" className="block text-sm font-medium text-gray-700">Asignado a</label>
                    <select
                        id="funcionario"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        value={formData.funcionario.id}
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

                <div className="md:col-span-2 space-y-1">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-y"
                        id="descripcion"
                        rows={3}
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Detalles adicionales sobre el monitor..."
                    ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-center gap-4 mt-6">
                    <button
                        type="submit"
                        className="flex items-center justify-center px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition-all duration-200"
                    >
                        <i className="bi bi-floppy mr-2" /> GUARDAR
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({
                            marca: { id: '' },
                            modelo: '',
                            serial: '',
                            estado: '',
                            fecha_compra: '',
                            funcionario: { id: '' },
                            descripcion: ''
                        })}
                        className="flex items-center justify-center px-6 py-2.5 bg-white text-orange-500 border border-orange-500 font-medium rounded-lg hover:bg-orange-50 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                    >
                        <i className="bi bi-trash-fill mr-2" /> LIMPIAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearMonitor;
