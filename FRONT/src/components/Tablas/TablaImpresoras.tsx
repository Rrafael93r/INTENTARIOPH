import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getImpresoras, updateImpresora } from '../../servicios/impresoraService';
import FormularioCrearImpresora from '../FormulariosCrear/FormularioCrearImpresora';
import FormularioEditarImpresora from '../FormulariosEditar.tsx/FormularioEditarImpresora';

const TablaImpresoras: React.FC = () => {
    const [impresoras, setImpresoras] = useState<any[]>([]);
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
    const [filterMarca, setFilterMarca] = useState('');
    const [filterModelo, setFilterModelo] = useState('');
    const [filterSerial, setFilterSerial] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterFuncionario, setFilterFuncionario] = useState('');

    const loadImpresoras = async () => {
        try {
            const data = await getImpresoras();
            setImpresoras(data);
        } catch (err) {
            setError('Error al cargar impresoras');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadImpresoras();
    }, []);

    const handleDisable = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "La impresora será inhabilitada (Estado: INACTIVO) pero no eliminada.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f97316',
                cancelButtonColor: '#ef4444',
                confirmButtonText: 'Sí, inhabilitar!',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const itemToDisable = impresoras.find(m => m.id === id);
                if (itemToDisable) {
                    const updatedItem = { ...itemToDisable, estado: 'INACTIVO' };
                    await updateImpresora(id, updatedItem);
                    setImpresoras((prev) => prev.map((item) => item.id === id ? { ...item, estado: 'INACTIVO' } : item));
                    Swal.fire('¡Inhabilitada!', 'La impresora ha sido marcada como INACTIVO.', 'success');
                }
            }
        } catch (error) {
            console.error('Error al inhabilitar:', error);
            Swal.fire('Error', 'No se pudo inhabilitar la impresora.', 'error');
        }
    };

    const normalizedFilterMarca = filterMarca.toLowerCase();
    const normalizedFilterModelo = filterModelo.toLowerCase();
    const normalizedFilterSerial = filterSerial.toLowerCase();
    const normalizedFilterEstado = filterEstado.toLowerCase();
    const normalizedFilterFuncionario = filterFuncionario.toLowerCase();

    const filteredImpresoras = impresoras.filter(impresora => {
        return (
            (!filterMarca || (impresora.marca || '').toLowerCase().includes(normalizedFilterMarca)) &&
            (!filterModelo || (impresora.modelo || '').toLowerCase().includes(normalizedFilterModelo)) &&
            (!filterSerial || (impresora.serial || '').toLowerCase().includes(normalizedFilterSerial)) &&
            (!filterEstado || (impresora.estado || '').toLowerCase().includes(normalizedFilterEstado)) &&
            (!filterFuncionario || (impresora.funcionarios ? `${impresora.funcionarios.nombre} ${impresora.funcionarios.apellido}` : '').toLowerCase().includes(normalizedFilterFuncionario))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentImpresoras = filteredImpresoras.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredImpresoras.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setFilterMarca('');
        setFilterModelo('');
        setFilterSerial('');
        setFilterEstado('');
        setFilterFuncionario('');
    };

    if (loading) return (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-printer mr-2 text-orange-500"></i> Nueva Impresora
                                </h3>
                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                <FormularioCrearImpresora handleClose={() => { handleClose(); loadImpresoras(); }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-800 gap-4">
                <div>
                    <h1 className="text-2xl font-bold m-0 text-gray-900">Impresoras</h1>
                    <nav className="text-sm text-gray-500 mt-1">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">Inicio <span className="mx-2 text-gray-300">/</span></li>
                            <li className="flex items-center text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">Equipos <span className="mx-2 text-gray-300">/</span></li>
                            <li className="font-medium text-gray-700">Impresoras</li>
                        </ol>
                    </nav>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleShow}
                        className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                    >
                        <i className="bi bi-plus-circle-fill mr-2"></i> Nueva Impresora
                    </button>
                    <button
                        onClick={clearFilters}
                        title="Limpiar filtros"
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center shrink-0 w-10 sm:w-auto"
                    >
                        <i className="bi bi-eraser-fill"></i>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-t-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[60vh] custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top w-20">
                                    <div className="h-8 mb-2"></div>
                                    <div className="flex items-center">ID</div>
                                </th>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                                        placeholder="Filtrar Marca"
                                        value={filterMarca}
                                        onChange={(e) => setFilterMarca(e.target.value)}
                                    />
                                    <div className="flex items-center">MARCA</div>
                                </th>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                                        placeholder="Filtrar Modelo"
                                        value={filterModelo}
                                        onChange={(e) => setFilterModelo(e.target.value)}
                                    />
                                    <div className="flex items-center">MODELO</div>
                                </th>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                                        placeholder="Filtrar Serial"
                                        value={filterSerial}
                                        onChange={(e) => setFilterSerial(e.target.value)}
                                    />
                                    <div className="flex items-center">SERIAL</div>
                                </th>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                                        placeholder="Filtrar Estado"
                                        value={filterEstado}
                                        onChange={(e) => setFilterEstado(e.target.value)}
                                    />
                                    <div className="flex items-center">ESTADO</div>
                                </th>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[200px]">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                                        placeholder="Filtrar Funcionario"
                                        value={filterFuncionario}
                                        onChange={(e) => setFilterFuncionario(e.target.value)}
                                    />
                                    <div className="flex items-center">FUNCIONARIO</div>
                                </th>
                                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top text-center w-24">
                                    <div className="h-8 mb-2"></div>
                                    <div className="flex items-center justify-center">ACCIONES</div>
                                </th>
                            </tr>
                        </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {currentImpresoras.length > 0 ? (
                            currentImpresoras.map((impresora) => (
                                <tr key={impresora.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 align-middle text-sm font-medium text-gray-900">{impresora.id}</td>
                                    <td className="p-3 align-middle text-sm text-gray-800">
                                        {typeof impresora.marca === 'object' && impresora.marca !== null ? impresora.marca.nombre : impresora.marca}
                                    </td>
                                    <td className="p-3 align-middle text-sm text-gray-800">{impresora.modelo}</td>
                                    <td className="p-3 align-middle text-sm text-gray-800">{impresora.serial}</td>
                                    <td className="p-3 align-middle">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${impresora.estado === 'ACTIVO'
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-gray-50 text-gray-700 border-gray-200"
                                            }`}>
                                            {impresora.estado === 'ACTIVO' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                                            {impresora.estado !== 'ACTIVO' && <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>}
                                            {impresora.estado}
                                        </span>
                                    </td>
                                    <td className="p-3 align-middle text-sm text-gray-800">
                                        {impresora.funcionarios ? `${impresora.funcionarios.nombre} ${impresora.funcionarios.apellido}` : <span className="text-gray-400 italic">Sin asignar</span>}
                                    </td>
                                    <td className="p-3 align-middle">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-transparent hover:border-orange-600"
                                                title="Editar"
                                                onClick={() => {
                                                    setSelectedId(impresora.id);
                                                    handleShow2();
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-transparent hover:border-red-600"
                                                title="Inhabilitar"
                                                onClick={() => handleDisable(impresora.id)}
                                            >
                                                <i className="bi bi-slash-circle"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <i className="bi bi-inbox text-4xl text-gray-300 mb-2"></i>
                                        <p>No se encontraron impresoras que coincidan con la búsqueda.</p>
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
                                    <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Impresora
                                </h3>
                                <button onClick={handleClose2} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                {selectedId && (
                                    <FormularioEditarImpresora
                                        id={selectedId}
                                        handleClose={handleClose2}
                                        onSuccess={loadImpresoras}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 m-0">
                            Mostrando <span className="font-medium">{indexOfFirstItem + 1 > filteredImpresoras.length ? 0 : indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, filteredImpresoras.length)}</span> de <span className="font-medium">{filteredImpresoras.length}</span> resultados
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${currentPage === 1 ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className="sr-only">Anterior</span>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                                            ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className="sr-only">Siguiente</span>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default TablaImpresoras;
