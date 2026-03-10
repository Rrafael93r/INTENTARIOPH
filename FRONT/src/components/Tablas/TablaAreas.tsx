import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getAreas, deleteArea } from '../../servicios/areasService';
import FormularioCrearArea from '../FormulariosCrear/FormularioCrearArea';
import FormularioEditarArea from '../FormulariosEditar.tsx/FormularioEditarArea';

const TablaAreas: React.FC = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleShow2 = () => setShowModal2(true);
    const handleClose2 = () => setShowModal2(false);

    // Filters
    const [filterNombre, setFilterNombre] = useState('');

    const loadItems = async () => {
        try {
            const data = await getAreas();
            setItems(data);
        } catch (err) {
            setError('Error al cargar Áreas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "El área será eliminada permanentemente.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!',
            });

            if (result.isConfirmed) {
                await deleteArea(id);
                setItems((prev) => prev.filter((item) => item.id !== id));
                Swal.fire('¡Eliminado!', 'El área ha sido eliminada.', 'success');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el área. Puede que esté asignada a un funcionario.', 'error');
        }
    };

    const normalizedFilterNombre = filterNombre.toLowerCase();

    const filteredItems = items.filter(item => {
        return (
            (!filterNombre || (item.nombre || '').toLowerCase().includes(normalizedFilterNombre))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setFilterNombre('');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            {/* Modal para Nueva Área */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-briefcase-fill mr-2 text-orange-500"></i> Nueva Área
                                </h3>
                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                <FormularioCrearArea handleClose={() => { handleClose(); loadItems(); }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-800 gap-4">
                <div>
                    <h1 className="text-2xl font-bold m-0 text-gray-900">Áreas</h1>
                    <nav className="text-sm text-gray-500 mt-1">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">Administración <span className="mx-2 text-gray-300">/</span></li>
                            <li className="font-medium text-gray-700">Áreas</li>
                        </ol>
                    </nav>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleShow}
                        className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                    >
                        <i className="bi bi-plus-circle-fill mr-2"></i> Agregar Área
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-t-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[60vh] custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top w-20">
                                    <div className="flex items-center h-full">ID</div>
                                </th>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[300px]">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                                        placeholder="Filtrar Nombre"
                                        value={filterNombre}
                                        onChange={(e) => setFilterNombre(e.target.value)}
                                    />
                                    <div className="flex items-center">NOMBRE</div>
                                </th>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 text-center align-top w-24">
                                    <div className="flex flex-col items-center justify-center">
                                        <button
                                            className="p-1.5 mb-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded transition-colors tooltip flex items-center justify-center w-8 h-8"
                                            title="Limpiar filtros"
                                            onClick={clearFilters}
                                        >
                                            <i className="bi bi-brush"></i>
                                        </button>
                                        <span>ACCIONES</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-gray-500">
                                        <div className="flex justify-center mb-2">
                                            <i className="bi bi-inbox text-3xl text-gray-300"></i>
                                        </div>
                                        No se encontraron áreas con los filtros aplicados
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="p-3 align-middle text-sm font-medium text-gray-900">{item.id}</td>
                                        <td className="p-3 align-middle text-sm text-gray-800 font-medium">{item.nombre}</td>
                                        <td className="p-3 align-middle">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-transparent hover:border-orange-600"
                                                    title="Editar"
                                                    onClick={() => {
                                                        setSelectedId(item.id);
                                                        handleShow2();
                                                    }}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-colors border border-transparent hover:border-red-600"
                                                    title="Eliminar"
                                                    onClick={() => handleDelete(item.id)}
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
                </div>
            </div>

            <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl px-4 py-3 flex items-center justify-between sm:px-6 shadow-sm">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 m-0">
                            Mostrando <span className="font-medium">{currentItems.length}</span> de <span className="font-medium">{filteredItems.length}</span> áreas
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'
                                    }`}
                            >
                                <i className="bi bi-chevron-double-left"></i>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'
                                    }`}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>

                            <span className="relative inline-flex items-center px-4 py-2 border border-orange-500 bg-orange-50 text-sm font-medium text-orange-600">
                                {currentPage}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'
                                    }`}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'
                                    }`}
                            >
                                <i className="bi bi-chevron-double-right"></i>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Modal para Editar Área */}
            {showModal2 && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose2}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Área
                                </h3>
                                <button onClick={handleClose2} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                {selectedId && (
                                    <FormularioEditarArea
                                        id={selectedId}
                                        handleClose={handleClose2}
                                        onSuccess={loadItems}
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

export default TablaAreas;
