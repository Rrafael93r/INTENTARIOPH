import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getDiademas, updateDiadema } from '../../servicios/DiademaService';
import FormularioEditarDiadema from '../FormulariosEditar.tsx/FormularioEditarDiadema';
import { format } from 'date-fns';

interface Diadema {
    id: number;
    serial: string;
    marca: string;
    modelo: string;
    fecha_compra: string;
    descripcion: string;
    estado: string;
}

const TablaDiademas: React.FC = () => {
    const [diademas, setDiademas] = useState<Diadema[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [filterDescripcion, setFilterDescripcion] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterFechaCompra, setFilterFechaCompra] = useState('');
    const [filterMarca, setFilterMarca] = useState('');
    const [filterModelo, setFilterModelo] = useState('');
    const [filterSerial, setFilterSerial] = useState('');

    const handleClose2 = () => setShowModal2(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedDiademasId, setSelectedDiademasId] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    useEffect(() => {
        const loadDiademas = async () => {
            try {
                // Remove loading for smoother UX or use a subtle spinner, kept original logic but removed full-screen block
                setLoading(true);

                const response = await getDiademas();
                const data = Array.isArray(response) ? response : response.data;

                if (Array.isArray(data)) {
                    setDiademas(data);
                } else {
                    console.error('Datos recibidos:', data);
                    throw new Error('Los datos recibidos no tienen el formato esperado');
                }
            } catch (error) {
                setError('Error al cargar el listado de Diademas');
                console.error('Error detallado:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDiademas();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    const handleDisable = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "El activo será inhabilitado (Estado: INACTIVO) pero no eliminado.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f97316',
                cancelButtonColor: '#ef4444',
                confirmButtonText: 'Sí, inhabilitar!',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const itemToDisable = diademas.find(m => m.id === id);
                if (itemToDisable) {
                    const updatedItem = { ...itemToDisable, estado: 'INACTIVO' };
                    await updateDiadema(id, updatedItem);
                    setDiademas((prev) => prev.map((item) => item.id === id ? { ...item, estado: 'INACTIVO' } : item));
                    Swal.fire('¡Inhabilitado!', 'El activo ha sido marcado como INACTIVO.', 'success');
                }
            }
        } catch (error) {
            console.error('Error al inhabilitar:', error);
            Swal.fire('Error', 'No se pudo inhabilitar el activo.', 'error');
        }
    };

    const filteredDiademas = diademas.filter((diadema) => {
        const serialMatch = !filterSerial || diadema.serial?.toLowerCase().includes(filterSerial.toLowerCase());
        const marcaMatch = !filterMarca || (typeof diadema.marca === 'object' && diadema.marca !== null ? diadema.marca.nombre.toLowerCase().includes(filterMarca.toLowerCase()) : diadema.marca?.toLowerCase().includes(filterMarca.toLowerCase()));
        const modeloMatch = !filterModelo || diadema.modelo?.toLowerCase().includes(filterModelo.toLowerCase());
        const fechaMatch = !filterFechaCompra || diadema.fecha_compra?.includes(filterFechaCompra);
        const descripcionMatch = !filterDescripcion || diadema.descripcion?.toLowerCase().includes(filterDescripcion.toLowerCase());
        const estadoMatch = !filterEstado || diadema.estado?.toLowerCase().includes(filterEstado.toLowerCase());

        return serialMatch && marcaMatch && modeloMatch && fechaMatch && descripcionMatch && estadoMatch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDiademas = filteredDiademas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDiademas.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setFilterMarca('');
        setFilterModelo('');
        setFilterFechaCompra('');
        setFilterDescripcion('');
        setFilterEstado('');
        setFilterSerial('');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                                    <i className="bi bi-headset mr-2 text-orange-500"></i> Nueva Diadema
                                </h3>
                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                {/* Add form here eventually */}
                                <p>Formulario para Nueva Diadema</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-5 border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 m-0 flex items-center gap-2">
                            <i className="bi bi-headset text-orange-500"></i>
                            Diademas
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 mb-0">Gestión de diademas y auriculares</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleShow}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
                        >
                            <i className="bi bi-plus-circle"></i>
                            <span>Nueva Diadema</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar serial..."
                        value={filterSerial}
                        onChange={(e) => setFilterSerial(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar marca..."
                        value={filterMarca}
                        onChange={(e) => setFilterMarca(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar modelo..."
                        value={filterModelo}
                        onChange={(e) => setFilterModelo(e.target.value)}
                    />
                    <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        value={filterFechaCompra}
                        onChange={(e) => setFilterFechaCompra(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Filtrar descripción..."
                        value={filterDescripcion}
                        onChange={(e) => setFilterDescripcion(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                            placeholder="Filtrar estado..."
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
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
                            <th className="p-3">SERIAL</th>
                            <th className="p-3">MARCA</th>
                            <th className="p-3">MODELO</th>
                            <th className="p-3">FECHA DE COMPRA</th>
                            <th className="p-3">DESCRIPCIÓN</th>
                            <th className="p-3">ESTADO</th>
                            <th className="p-3 text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {currentDiademas.length > 0 ? (
                            currentDiademas.map((diadema) => (
                                <tr key={diadema.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{diadema.serial}</span>
                                            <span className="text-xs text-gray-500">ID: {diadema.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 align-middle text-sm text-gray-800">
                                        {typeof diadema.marca === 'object' && diadema.marca !== null ? (diadema.marca as any).nombre : diadema.marca}
                                    </td>
                                    <td className="p-3 align-middle text-sm text-gray-800">{diadema.modelo}</td>
                                    <td className="p-3 align-middle text-sm text-gray-800">{format(new Date(diadema.fecha_compra), 'yyyy-MM-dd')}</td>
                                    <td className="p-3 align-middle text-sm text-gray-800 max-w-xs truncate" title={diadema.descripcion}>{diadema.descripcion}</td>
                                    <td className="p-3 align-middle">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${diadema.estado === 'ASIGNADO'
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : diadema.estado === 'INACTIVO'
                                                ? "bg-gray-50 text-gray-700 border-gray-200"
                                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            }`}>
                                            {diadema.estado === 'ASIGNADO' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
                                            {diadema.estado === 'INACTIVO' && <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>}
                                            {diadema.estado !== 'ASIGNADO' && diadema.estado !== 'INACTIVO' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                                            {diadema.estado}
                                        </span>
                                    </td>
                                    <td className="p-3 align-middle">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-transparent hover:border-orange-600"
                                                title="Editar"
                                                onClick={() => {
                                                    setSelectedDiademasId(diadema.id);
                                                    setShowModal2(true);
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-transparent hover:border-red-600"
                                                title="Inhabilitar"
                                                onClick={() => handleDisable(diadema.id)}
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
                                        <p>No se encontraron diademas que coincidan con la búsqueda.</p>
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
                                    <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Diadema
                                </h3>
                                <button onClick={handleClose2} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="px-6 py-5 sm:p-6 bg-gray-50">
                                {selectedDiademasId && (
                                    <FormularioEditarDiadema
                                        id={selectedDiademasId}
                                        handleClose={handleClose2}
                                        onSuccess={() => {
                                            const loadDiademas = async () => {
                                                try {
                                                    const response = await getDiademas();
                                                    const data = Array.isArray(response) ? response : response.data;

                                                    if (Array.isArray(data)) {
                                                        setDiademas(data);
                                                        handleClose2();
                                                        Swal.fire({
                                                            icon: 'success',
                                                            title: '¡Actualizado!',
                                                            text: 'La diadema ha sido actualizada exitosamente',
                                                            timer: 1500
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.error('Error al recargar diademas:', error);
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Error',
                                                        text: 'No se pudieron recargar las diademas'
                                                    });
                                                }
                                            };
                                            loadDiademas();
                                        }}
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
                            Mostrando <span className="font-medium">{currentDiademas.length}</span> de <span className="font-medium">{filteredDiademas.length}</span> diademas
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

export default TablaDiademas;