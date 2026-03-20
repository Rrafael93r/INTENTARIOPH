import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getTiposPerifericos, deleteTipoPeriferico } from '../../servicios/tiposPerifericosService';
import FormularioCrearTipoPeriferico from '../FormulariosCrear/FormularioCrearTipoPeriferico';
import FormularioEditarTipoPeriferico from '../FormulariosEditar.tsx/FormularioEditarTipoPeriferico';

const TablaTiposPerifericos: React.FC = () => {
    const [tipos, setTipos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const loadTipos = async () => {
        try {
            const data = await getTiposPerifericos();
            setTipos(data);
        } catch (err) {
            setError('Error al cargar tipos de periféricos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTipos();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esto eliminará el tipo de periférico definitivamente.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await deleteTipoPeriferico(id);
                setTipos((prev) => prev.filter((item) => item.id !== id));
                Swal.fire('¡Eliminado!', 'El tipo ha sido eliminado.', 'success');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el tipo. Puede que esté en uso.', 'error');
        }
    };

    if (loading) return <div className="flex justify-center items-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div><span className="ml-2 text-gray-600">Cargando tipos...</span></div>;
    if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-tags mr-2 text-orange-500"></i> Nuevo Tipo
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                <FormularioCrearTipoPeriferico handleClose={() => { setShowModal(false); loadTipos(); }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-800 gap-4">
                <div>
                    <h1 className="text-2xl font-bold m-0 text-gray-900">Tipos de Periféricos</h1>
                    <nav className="text-sm text-gray-500 mt-1">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">Administración <span className="mx-2 text-gray-300">/</span></li>
                            <li className="font-medium text-gray-700">Tipos de Periféricos</li>
                        </ol>
                    </nav>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                    >
                        <i className="bi bi-plus-circle-fill mr-2"></i> Agregar Tipo
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-3 w-24">ID</th>
                                <th className="p-3">NOMBRE DEL TIPO</th>
                                <th className="p-3 text-center w-32">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {tipos.length > 0 ? (
                                tipos.map((tipo) => (
                                    <tr key={tipo.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 align-middle text-sm font-medium text-gray-900">{tipo.id}</td>
                                        <td className="p-3 align-middle text-sm text-gray-800 font-bold">{tipo.nombre}</td>
                                        <td className="p-3 align-middle">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedId(tipo.id);
                                                        setShowModal2(true);
                                                    }}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-transparent hover:border-orange-600"
                                                    title="Editar"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tipo.id)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-transparent hover:border-red-600"
                                                    title="Eliminar"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <i className="bi bi-inbox text-4xl text-gray-300 mb-2"></i>
                                            <p>No se encontraron tipos de periféricos.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                </table>
            </div>
        </div>

            {showModal2 && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal2(false)}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Tipo
                                </h3>
                                <button onClick={() => setShowModal2(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                {selectedId && (
                                    <FormularioEditarTipoPeriferico
                                        id={selectedId}
                                        handleClose={() => setShowModal2(false)}
                                        onSuccess={loadTipos}
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

export default TablaTiposPerifericos;
