import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getProveedor_internet, deleteProveedor } from '../../servicios/ProveedoresService';
import FormularioCrear from '../FormulariosCrear/FormularioCrear';
import FormularioEditarP from '../FormulariosEditar.tsx/FormularioEditarP';

const ProveedorTable: React.FC = () => {
  const [Proveedor_internet, setProveedor_internet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filterNombre, setFilterNombre] = useState('');
  const [filterCorreo, setFilterCorreo] = useState('');
  const [filterNombreContacto, setFilterNombreContacto] = useState('');
  const [filterNumeroContacto, setFilterNumeroContacto] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const handleClose2 = () => setShowModal2(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedProveedorId, setSelectedProveedorId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);


  useEffect(() => {
    const loadProveedor_internet = async () => {
      try {
        Swal.fire({
          title: 'Cargando tabla...',
          html: 'Por favor espera un momento.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const data = await getProveedor_internet();
        setProveedor_internet(data);
      } catch (error) {
        setError('Error al cargar el listado de proveedores');
        console.error(error);
      } finally {
        setLoading(false);
        Swal.close();
      }
    };

    loadProveedor_internet();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Este cambio no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
      });

      if (result.isConfirmed) {
        await deleteProveedor(id);
        setProveedor_internet((prev) => prev.filter((proveedor) => proveedor.id !== id));
        Swal.fire('¡Eliminado!', 'El proveedor ha sido eliminado.', 'success');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el proveedor. Por favor, intente nuevamente.',
      });
    }
  };

  const filteredProveedor_internet = Proveedor_internet.filter((proveedor) => {
    return (
      (proveedor.nombre?.toLowerCase().includes(filterNombre.toLowerCase()) || !filterNombre) &&
      (proveedor.correo?.toLowerCase().includes(filterCorreo.toLowerCase()) || !filterCorreo) &&
      (proveedor.nombreContacto?.toLowerCase().includes(filterNombreContacto.toLowerCase()) || !filterNombreContacto) &&
      (proveedor.numeroContacto?.toLowerCase().includes(filterNumeroContacto.toLowerCase()) || !filterNumeroContacto) &&
      (proveedor.estado?.toLowerCase().includes(filterEstado.toLowerCase()) || !filterEstado)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProveedor_internet = filteredProveedor_internet.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProveedor_internet.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const clearFilters = () => {
    setFilterNombre('');
    setFilterCorreo('');
    setFilterNombreContacto('');
    setFilterNumeroContacto('');
    setFilterEstado('');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-800 gap-4">
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>
              <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                    <i className="bi bi-plus-circle mr-2 text-orange-500"></i> Nueva Farmacia
                  </h3>
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="px-6 py-5 sm:p-6 bg-gray-50">
                  <FormularioCrear />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-800 gap-4">
          <div>
            <h1 className="text-2xl font-bold m-0 text-gray-900">Proveedores</h1>
            <nav className="text-sm text-gray-500 mt-1">
              <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">Inicio <span className="mx-2 text-gray-300">/</span></li>
                <li className="font-medium text-gray-700">Farmacias</li>
              </ol>
            </nav>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleShow}
              className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
            >
              <i className="bi bi-plus-circle-fill mr-2"></i> Agregar Proveedor
            </button>
          </div>
        </div>

        <div className="bg-white rounded-t-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[60vh] custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[200px]">
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                      placeholder="Filtrar nombre"
                      value={filterNombre}
                      onChange={(e) => setFilterNombre(e.target.value)}
                    />
                    <div className="flex items-center">Nombre</div>
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[200px]">
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                      placeholder="Filtrar correo"
                      value={filterCorreo}
                      onChange={(e) => setFilterCorreo(e.target.value)}
                    />
                    <div className="flex items-center">Correo</div>
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[200px]">
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                      placeholder="Filtrar contacto"
                      value={filterNombreContacto}
                      onChange={(e) => setFilterNombreContacto(e.target.value)}
                    />
                    <div className="flex items-center">Contacto</div>
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                      placeholder="Filtrar número"
                      value={filterNumeroContacto}
                      onChange={(e) => setFilterNumeroContacto(e.target.value)}
                    />
                    <div className="flex items-center">Número</div>
                  </th>
                  <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                      placeholder="Filtrar estado"
                      value={filterEstado}
                      onChange={(e) => setFilterEstado(e.target.value)}
                    />
                    <div className="flex items-center">Estado</div>
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
                      <span>Acciones</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentProveedor_internet.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      <div className="flex justify-center mb-2">
                        <i className="bi bi-inbox text-3xl text-gray-300"></i>
                      </div>
                      No se encontraron proveedores con los filtros aplicados
                    </td>
                  </tr>
                ) : (
                  currentProveedor_internet.map((proveedor) => (
                    <tr key={proveedor.id} className="hover:bg-orange-50/30 transition-colors group">
                      <td className="p-3 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{proveedor.nombre}</span>
                          <span className="text-xs text-gray-500">ID: {proveedor.id}</span>
                        </div>
                      </td>
                      <td className="p-3 align-middle text-sm text-gray-800">{proveedor.correo}</td>
                      <td className="p-3 align-middle text-sm text-gray-800">{proveedor.nombre_contacto}</td>
                      <td className="p-3 align-middle text-sm text-gray-800">{proveedor.numero_contacto}</td>
                      <td className="p-3 align-middle">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${proveedor.estado === 'NO ACTIVO'
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}>
                          {proveedor.estado !== "NO ACTIVO" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                          {proveedor.estado === "NO ACTIVO" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
                          {proveedor.estado}
                        </span>
                      </td>
                      <td className="p-3 align-middle">
                        <div className="flex justify-center gap-2">
                          <button
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-transparent hover:border-orange-600"
                            title="Editar"
                            onClick={() => {
                              setSelectedProveedorId(proveedor.id);
                              setShowModal2(true);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
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

        {showModal2 && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose2}></div>
              <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                    <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Proveedor
                  </h3>
                  <button onClick={handleClose2} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="px-6 py-5 sm:p-6 bg-gray-50">
                  {selectedProveedorId && (
                    <FormularioEditarP
                      proveedorId={selectedProveedorId}
                      onClose={handleClose2}
                      onSuccess={() => {
                        const loadProveedor = async () => {
                          try {
                            const data = await getProveedor_internet();
                            setProveedor_internet(data);
                            handleClose2();
                            Swal.fire({
                              icon: 'success',
                              title: '¡Actualizado!',
                              text: 'El proveedor ha sido actualizado exitosamente',
                              timer: 1500
                            });
                          } catch (error) {
                            console.error('Error al recargar proveedores:', error);
                            Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'No se pudieron recargar los proveedores'
                            });
                          }
                        };
                        loadProveedor();
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl px-4 py-3 flex items-center justify-between sm:px-6 shadow-sm">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 m-0">
                Mostrando <span className="font-medium">{currentProveedor_internet.length}</span> de <span className="font-medium">{filteredProveedor_internet.length}</span> proveedores
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
      </div>
    </>
  );
};

export default ProveedorTable;