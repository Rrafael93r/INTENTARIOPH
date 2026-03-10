import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getMonitores, updateMonitor } from '../../servicios/monitoresService';
import FormularioCrearMonitor from '../FormulariosCrear/FormularioCrearMonitor';
import FormularioEditarMonitor from '../FormulariosEditar.tsx/FormularioEditarMonitor';

const TablaMonitores: React.FC = () => {
    const [monitores, setMonitores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedMonitorId, setSelectedMonitorId] = useState<number | null>(null);

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

    const loadMonitores = async () => {
        try {
            // setLoading(true); // removed to avoid flickering on reload
            const data = await getMonitores();
            setMonitores(data);
        } catch (err) {
            setError('Error al cargar monitores');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMonitores();
    }, []);

    const handleDisable = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "El monitor será inhabilitado (Estado: INACTIVO) pero no eliminado.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f97316',
                cancelButtonColor: '#ef4444',
                confirmButtonText: 'Sí, inhabilitar!',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const monitorToDisable = monitores.find(m => m.id === id);
                if (monitorToDisable) {
                    const updatedMonitor = { ...monitorToDisable, estado: 'INACTIVO' };
                    await updateMonitor(id, updatedMonitor);
                    setMonitores((prev) => prev.map((item) => item.id === id ? { ...item, estado: 'INACTIVO' } : item));
                    Swal.fire('¡Inhabilitado!', 'El monitor ha sido marcado como INACTIVO.', 'success');
                }
            }
        } catch (error) {
            console.error('Error al inhabilitar:', error);
            Swal.fire('Error', 'No se pudo inhabilitar el monitor.', 'error');
        }
    };

    const normalizedFilterMarca = filterMarca.toLowerCase();
    const normalizedFilterModelo = filterModelo.toLowerCase();
    const normalizedFilterSerial = filterSerial.toLowerCase();
    const normalizedFilterEstado = filterEstado.toLowerCase();
    const normalizedFilterFuncionario = filterFuncionario.toLowerCase();

    const filteredMonitores = monitores.filter(monitor => {
        return (
            (!filterMarca || (monitor.marca || '').toLowerCase().includes(normalizedFilterMarca)) &&
            (!filterModelo || (monitor.modelo || '').toLowerCase().includes(normalizedFilterModelo)) &&
            (!filterSerial || (monitor.serial || '').toLowerCase().includes(normalizedFilterSerial)) &&
            (!filterEstado || (monitor.estado || '').toLowerCase().includes(normalizedFilterEstado)) &&
            (!filterFuncionario || (monitor.funcionarios ? `${monitor.funcionarios.nombre} ${monitor.funcionarios.apellido}` : '').toLowerCase().includes(normalizedFilterFuncionario))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMonitores = filteredMonitores.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMonitores.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setFilterMarca('');
        setFilterModelo('');
        setFilterSerial('');
        setFilterEstado('');
        setFilterFuncionario('');
    };

    if (loading) return <div className="flex justify-center items-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div><span className="ml-2 text-gray-600">Cargando monitores...</span></div>;
    if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-display mr-2 text-orange-500"></i> Nuevo Monitor
                                </h3>
                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                <FormularioCrearMonitor handleClose={() => { handleClose(); loadMonitores(); }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-5 border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 m-0 flex items-center gap-2">
                            <i className="bi bi-display text-orange-500"></i>
                            Monitores
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 mb-0">Gestión de inventario de monitores</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleShow}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
                        >
                            <i className="bi bi-plus-circle"></i>
                            <span>Nuevo Monitor</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar Marca..."
                        value={filterMarca}
                        onChange={(e) => setFilterMarca(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar Modelo..."
                        value={filterModelo}
                        onChange={(e) => setFilterModelo(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar Serial..."
                        value={filterSerial}
                        onChange={(e) => setFilterSerial(e.target.value)}
                    />
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                    >
                        <option value="">Todos los estados</option>
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                        <option value="ASIGNADO">Asignado</option>
                        <option value="DAÑADO">Dañado</option>
                    </select>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                            placeholder="Filtrar Funcionario..."
                            value={filterFuncionario}
                            onChange={(e) => setFilterFuncionario(e.target.value)}
                        />
                        <button
                            onClick={clearFilters}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center shrink-0"
                            title="Limpiar filtros"
                        >
                            <i className="bi bi-eraser-fill"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-semibold">ID</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Marca</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Modelo</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Serial</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Estado</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Funcionario</th>
                            <th scope="col" className="px-6 py-3 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMonitores.length > 0 ? (
                            currentMonitores.map((monitor) => (
                                <tr key={monitor.id} className="bg-white border-b border-gray-100 hover:bg-orange-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{monitor.id}</td>
                                    <td className="px-6 py-4">{typeof monitor.marca === 'object' && monitor.marca !== null ? monitor.marca.nombre : monitor.marca}</td>
                                    <td className="px-6 py-4">{monitor.modelo}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{monitor.serial}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${monitor.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
                                            monitor.estado === 'ASIGNADO' ? 'bg-blue-100 text-blue-800' :
                                                monitor.estado === 'DAÑADO' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {monitor.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {monitor.funcionarios ? (
                                            <div className="flex items-center text-gray-900">
                                                <i className="bi bi-person-badge text-orange-400 mr-2 text-lg"></i>
                                                {`${monitor.funcionarios.nombre} ${monitor.funcionarios.apellido}`}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">Sin asignar</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedMonitorId(monitor.id);
                                                    handleShow2();
                                                }}
                                                className="p-1.5 bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white rounded transition-colors"
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDisable(monitor.id)}
                                                className="p-1.5 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white rounded transition-colors"
                                                title="Inhabilitar"
                                            >
                                                <i className="bi bi-slash-circle"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <i className="bi bi-inbox text-4xl text-gray-300 mb-2"></i>
                                        <p>No se encontraron monitores que coincidan con los filtros.</p>
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
                                    <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Monitor
                                </h3>
                                <button onClick={handleClose2} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                {selectedMonitorId && (
                                    <FormularioEditarMonitor
                                        id={selectedMonitorId}
                                        handleClose={handleClose2}
                                        onSuccess={loadMonitores}
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
                            Mostrando <span className="font-medium">{currentMonitores.length}</span> de <span className="font-medium">{filteredMonitores.length}</span> monitores
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

export default TablaMonitores;
