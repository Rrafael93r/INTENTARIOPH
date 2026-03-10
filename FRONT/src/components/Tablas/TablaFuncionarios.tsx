import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getFuncionarios, deleteFuncionario } from '../../servicios/funcionariosService';
import FormularioCrearFuncionario from '../FormulariosCrear/FormularioCrearFuncionario';
import FormularioEditarFuncionario from '../FormulariosEditar.tsx/FormularioEditarFuncionario';

const TablaFuncionarios: React.FC = () => {
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
    const [filterApellido, setFilterApellido] = useState('');
    const [filterArea, setFilterArea] = useState('');
    const [filterCorreo, setFilterCorreo] = useState('');
    const [filterFarmacia, setFilterFarmacia] = useState('');

    const loadItems = async () => {
        try {
            const data = await getFuncionarios();
            setItems(data);
        } catch (err) {
            setError('Error al cargar Funcionarios');
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
                text: "El funcionario será eliminado permanentemente.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!',
            });

            if (result.isConfirmed) {
                await deleteFuncionario(id);
                setItems((prev) => prev.filter((item) => item.id !== id));
                Swal.fire('¡Eliminado!', 'El funcionario ha sido eliminado.', 'success');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el funcionario.', 'error');
        }
    };

    const normalizedFilterNombre = filterNombre.toLowerCase();
    const normalizedFilterApellido = filterApellido.toLowerCase();
    const normalizedFilterArea = filterArea.toLowerCase();
    const normalizedFilterCorreo = filterCorreo.toLowerCase();
    const normalizedFilterFarmacia = filterFarmacia.toLowerCase();

    const filteredItems = items.filter(item => {
        return (
            (!filterNombre || (item.nombre || '').toLowerCase().includes(normalizedFilterNombre)) &&
            (!filterApellido || (item.apellido || '').toLowerCase().includes(normalizedFilterApellido)) &&
            (!filterArea || (item.area?.nombre || item.area || '').toLowerCase().includes(normalizedFilterArea)) &&
            (!filterCorreo || (item.correo || '').toLowerCase().includes(normalizedFilterCorreo)) &&
            (!filterFarmacia || (item.farmacias ? item.farmacias.nombre : '').toLowerCase().includes(normalizedFilterFarmacia))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setFilterNombre('');
        setFilterApellido('');
        setFilterArea('');
        setFilterCorreo('');
        setFilterFarmacia('');
    };

    if (loading) return (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-person-plus mr-2 text-orange-500"></i> Nuevo Funcionario
                                </h3>
                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                <FormularioCrearFuncionario handleClose={() => { handleClose(); loadItems(); }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-5 border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 m-0 flex items-center gap-2">
                            <i className="bi bi-people text-orange-500"></i>
                            Funcionarios
                        </h2>
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3 mt-1 text-sm text-gray-500">
                                <li className="inline-flex items-center">Inicio</li>
                                <li>
                                    <div className="flex items-center">
                                        <i className="bi bi-chevron-right mx-2 text-gray-400"></i>
                                        <span className="font-semibold text-gray-800">Funcionarios</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleShow}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
                        >
                            <i className="bi bi-plus-circle-fill"></i>
                            <span>Agregar Funcionario</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar Nombre..."
                        value={filterNombre}
                        onChange={(e) => setFilterNombre(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar Apellido..."
                        value={filterApellido}
                        onChange={(e) => setFilterApellido(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar Área..."
                        value={filterArea}
                        onChange={(e) => setFilterArea(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                            placeholder="Filtrar Correo..."
                            value={filterCorreo}
                            onChange={(e) => setFilterCorreo(e.target.value)}
                        />
                        <button
                            onClick={clearFilters}
                            title="Limpiar filtros"
                            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                        >
                            <i className='bi bi-eraser-fill'></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                            <th className="p-3">ID</th>
                            <th className="p-3">NOMBRE</th>
                            <th className="p-3">APELLIDO</th>
                            <th className="p-3">ÁREA</th>
                            <th className="p-3">CORREO</th>
                            <th className="p-3 text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 align-middle text-sm text-gray-900 font-medium">{item.id}</td>
                                    <td className="p-3 align-middle text-sm text-gray-800">{item.nombre}</td>
                                    <td className="p-3 align-middle text-sm text-gray-800">{item.apellido}</td>
                                    <td className="p-3 align-middle text-sm text-gray-800">{item.area?.nombre || item.area}</td>
                                    <td className="p-3 align-middle text-sm text-gray-800">{item.correo}</td>
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
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-transparent hover:border-red-600"
                                                title="Eliminar"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <i className="bi bi-inbox text-4xl text-gray-300 mb-2"></i>
                                        <p>No se encontraron funcionarios que coincidan con la búsqueda.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal2 && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose2}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Funcionario
                                </h3>
                                <button onClick={handleClose2} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                {selectedId && (
                                    <FormularioEditarFuncionario
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

            <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 m-0">
                            Mostrando <span className="font-medium">{currentItems.length}</span> de <span className="font-medium">{filteredItems.length}</span> funcionarios
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'}`}
                            >
                                <i className="bi bi-chevron-double-left"></i>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'}`}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <span className="relative inline-flex items-center px-4 py-2 border border-orange-500 bg-orange-50 text-sm font-medium text-orange-600">
                                {currentPage}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'}`}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 text-orange-500'}`}
                            >
                                <i className="bi bi-chevron-double-right"></i>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablaFuncionarios;
