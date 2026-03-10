import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getEstados, deleteEstado } from '../../servicios/estadoService';
import FormularioCrearEstado from '../FormulariosCrear/FormularioCrearEstado';
import FormularioEditarEstado from '../FormulariosEditar.tsx/FormularioEditarEstado';

const TablaEstados: React.FC = () => {
    const [estados, setEstados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEstadoId, setSelectedEstadoId] = useState<number | null>(null);
    const [filterNombre, setFilterNombre] = useState('');

    const loadEstados = async () => {
        setLoading(true);
        try {
            const data = await getEstados();
            setEstados(data);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error al cargar los estados', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEstados();
    }, []);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
        });

        if (result.isConfirmed) {
            try {
                await deleteEstado(id);
                setEstados(estados.filter(e => e.id !== id));
                Swal.fire('Eliminado!', 'El estado ha sido eliminado.', 'success');
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar el estado', 'error');
            }
        }
    };

    const handleEdit = (id: number) => {
        setSelectedEstadoId(id);
        setShowEditModal(true);
    };

    const filteredEstados = estados.filter(estado =>
        estado.nombre.toLowerCase().includes(filterNombre.toLowerCase())
    );

    return (
        <>
            {/* Modal para Crear Estado */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-tag-fill mr-2 text-orange-500"></i> Nuevo Estado
                                </h3>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                <FormularioCrearEstado
                                    handleClose={() => setShowCreateModal(false)}
                                    onSuccess={loadEstados}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-800 gap-4">
                <div>
                    <h1 className="text-2xl font-bold m-0 text-gray-900">Gestión de Estados</h1>
                    <nav className="text-sm text-gray-500 mt-1">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">Administración <span className="mx-2 text-gray-300">/</span></li>
                            <li className="font-medium text-gray-700">Estados</li>
                        </ol>
                    </nav>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                    >
                        <i className="bi bi-plus-lg mr-2"></i> Nuevo Estado
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="bi bi-search text-gray-400"></i>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm transition-colors"
                            placeholder="Buscar por nombre..."
                            value={filterNombre}
                            onChange={(e) => setFilterNombre(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            <span className="ml-3 text-gray-500 font-medium">Cargando...</span>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-gray-50/80 sticky top-0 z-10 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">ID</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/2">Descripción</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-28">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEstados.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12 text-gray-500">
                                            <div className="flex justify-center mb-3">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                    <i className="bi bi-inbox text-2xl text-gray-300"></i>
                                                </div>
                                            </div>
                                            <p className="text-base font-medium text-gray-900 mb-1">No hay resultados</p>
                                            <p className="text-sm">No se encontraron estados con los filtros aplicados</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEstados.map((estado) => (
                                        <tr key={estado.id} className="hover:bg-orange-50/30 transition-colors group">
                                            <td className="p-4 align-middle text-sm font-medium text-gray-900">{estado.id}</td>
                                            <td className="p-4 align-middle text-sm text-gray-800 font-semibold">{estado.nombre}</td>
                                            <td className="p-4 align-middle text-sm text-gray-600 whitespace-normal break-words max-w-md">{estado.descripcion}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm"
                                                        title="Editar"
                                                        onClick={() => handleEdit(estado.id)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all shadow-sm"
                                                        title="Eliminar"
                                                        onClick={() => handleDelete(estado.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal para Editar Estado */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Estado
                                </h3>
                                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                {selectedEstadoId && (
                                    <FormularioEditarEstado
                                        estadoId={selectedEstadoId}
                                        onClose={() => setShowEditModal(false)}
                                        onSuccess={loadEstados}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TablaEstados;
