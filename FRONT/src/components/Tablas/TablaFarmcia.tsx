import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getFarmacias, deleteFarmacia } from '../../servicios/farmaciaService';
import FormularioCrearF from '../FormulariosCrear/FormularioCrearF';
import FormularioEditarF from '../FormulariosEditar.tsx/FormularioEditarF';

const FarmaciaTabla: React.FC = () => {
  const [farmacias, setFarmacias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedFarmaciaId, setSelectedFarmaciaId] = useState<number | null>(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleShow2 = () => setShowModal2(true);
  const handleClose2 = () => setShowModal2(false);

  const [filterNombre, setFilterNombre] = useState('');
  const [filterDireccion, setFilterDireccion] = useState('');
  const [filterCiudad, setFilterCiudad] = useState('');
  const [filterDepartamento, setFilterDepartamento] = useState('');
  const [filterProveedor, setFilterProveedor] = useState('');
  const [filterPertenece, setFilterPertenece] = useState('');
  const [filterCantidadEquipos, setFilterCantidadEquipos] = useState('');

  useEffect(() => {
    const loadFarmacia = async () => {
      try {
        Swal.fire({
          title: 'Cargando tabla...',
          html: 'Por favor espera un momento.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const data = await getFarmacias();
        setFarmacias(data);
      } catch (error) {
        setError('Error al cargar el listado de farmacias');
        console.error(error);
      } finally {
        setLoading(false);
        Swal.close();
      }
    };

    loadFarmacia();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const normalizedFilterNombre = filterNombre.toLowerCase();
  const normalizedFilterDireccion = filterDireccion.toLowerCase();
  const normalizedFilterCiudad = filterCiudad.toLowerCase();
  const normalizedFilterDepartamento = filterDepartamento.toLowerCase();
  const normalizedFilterProveedor = filterProveedor.toLowerCase();
  const normalizedFilterPertenece = filterPertenece.toLowerCase();
  const normalizedFilterCantidadEquipos = filterCantidadEquipos.toLowerCase();

  const filteredFarmacias = farmacias.filter(farmacia => {
    if (
      (filterNombre && !(farmacia?.nombre || '').toLowerCase().includes(normalizedFilterNombre)) ||
      (filterDireccion && !(farmacia?.direccion || '').toLowerCase().includes(normalizedFilterDireccion)) ||
      (filterCiudad && !(farmacia?.ciudad?.nombre_ciudad || '').toLowerCase().includes(normalizedFilterCiudad)) ||
      (filterDepartamento && !(farmacia?.ciudad?.departamento?.name_departamento || '').toLowerCase().includes(normalizedFilterDepartamento)) ||
      (filterProveedor && !(farmacia?.proveedor?.nombre || '').toLowerCase().includes(normalizedFilterProveedor)) ||
      (filterPertenece && !(farmacia?.pertenece || '').toLowerCase().includes(normalizedFilterPertenece)) ||
      (filterCantidadEquipos && !(String(farmacia?.cantidad_equipo || '')).toLowerCase().includes(normalizedFilterCantidadEquipos))
    ) {
      return false;
    }
    return true;
  });


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
        await deleteFarmacia(id);
        setFarmacias((prev) => prev.filter((farmacia) => farmacia.id !== id));
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFarmacias = filteredFarmacias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFarmacias.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const clearFilters = () => {
    setFilterNombre('');
    setFilterDireccion('');
    setFilterCiudad('');
    setFilterDepartamento('');
    setFilterProveedor('');
    setFilterPertenece('');
    setFilterCantidadEquipos('');
  };

  return (
    <>
      {/* Modal para Nueva Farmacia */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                  <i className="bi bi-building-add mr-2 text-orange-500"></i> Nueva Farmacia
                </h3>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 sm:p-6 bg-gray-50">
                <FormularioCrearF handleClose={handleClose} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Farmacia */}
      {showModal2 && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose2}></div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-semibold text-gray-800 flex items-center">
                  <i className="bi bi-pencil-square mr-2 text-orange-500"></i> Editar Farmacia
                </h3>
                <button onClick={handleClose2} className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 sm:p-6 bg-gray-50">
                {selectedFarmaciaId && (
                  <FormularioEditarF
                    farmaciaId={selectedFarmaciaId}
                    onClose={handleClose2}
                    onSuccess={() => {
                      const loadFarmacia = async () => {
                        try {
                          const data = await getFarmacias();
                          setFarmacias(data);
                        } catch (error) {
                          console.error('Error al recargar farmacias:', error);
                        }
                      };
                      loadFarmacia();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-gray-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold m-0 text-gray-900">Farmacias</h1>
          <nav className="text-sm text-gray-500 mt-1">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">Inicio <span className="mx-2 text-gray-300">/</span></li>
              <li className="flex items-center text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">Proveedores <span className="mx-2 text-gray-300">/</span></li>
              <li className="font-medium text-gray-700">Farmacias</li>
            </ol>
          </nav>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleShow}
            className="flex-1 sm:flex-none flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <i className="bi bi-plus-circle-fill mr-2"></i> Agregar Farmacia
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
                  <div className="flex items-center">NOMBRE</div>
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[200px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar dirección"
                    value={filterDireccion}
                    onChange={(e) => setFilterDireccion(e.target.value)}
                  />
                  <div className="flex items-center">DIRECCIÓN</div>
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar ciudad"
                    value={filterCiudad}
                    onChange={(e) => setFilterCiudad(e.target.value)}
                  />
                  <div className="flex items-center">CIUDAD</div>
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar departamento"
                    value={filterDepartamento}
                    onChange={(e) => setFilterDepartamento(e.target.value)}
                  />
                  <div className="flex items-center">DEPARTAMENTO</div>
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar proveedor"
                    value={filterProveedor}
                    onChange={(e) => setFilterProveedor(e.target.value)}
                  />
                  <div className="flex items-center">PROVEEDOR</div>
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar cantidad"
                    value={filterCantidadEquipos}
                    onChange={(e) => setFilterCantidadEquipos(e.target.value)}
                  />
                  <div className="flex items-center">CANT. EQUIPOS</div>
                </th>
                <th className="p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 align-top min-w-[150px]">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-normal normal-case bg-white"
                    placeholder="Filtrar pertenece"
                    value={filterPertenece}
                    onChange={(e) => setFilterPertenece(e.target.value)}
                  />
                  <div className="flex items-center">PERTENECE</div>
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
              {currentFarmacias.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center mb-2">
                      <i className="bi bi-inbox text-3xl text-gray-300"></i>
                    </div>
                    No se encontraron farmacias con los filtros aplicados
                  </td>
                </tr>
              ) : (
                currentFarmacias.map((farmacia) => (
                  <tr key={farmacia.id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="p-3 align-middle">
                      <div className="flex items-center">
                        <div>
                          <div className="font-semibold text-gray-800">{farmacia?.nombre || '-'}</div>
                          <div className="text-xs text-gray-500 font-mono">ID: {farmacia.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 align-middle text-gray-600">{farmacia?.direccion || '-'}</td>
                    <td className="p-3 align-middle text-gray-700">{farmacia?.ciudad?.nombre_ciudad || '-'}</td>
                    <td className="p-3 align-middle text-gray-700">{farmacia?.ciudad?.departamento?.name_departamento || '-'}</td>
                    <td className="p-3 align-middle">
                      <div className="text-gray-800">{farmacia?.proveedor?.nombre || '-'}</div>
                      <div className="text-xs text-gray-500">NIT: {farmacia?.proveedor?.nit || '-'}</div>
                    </td>
                    <td className="p-3 align-middle text-center font-medium text-gray-700">{farmacia?.cantidad_equipo || '0'}</td>
                    <td className="p-3 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${farmacia?.pertenece === 'PHARMASER'
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                        {farmacia?.pertenece || '-'}
                      </span>
                    </td>
                    <td className="p-3 align-middle">
                      <div className="flex justify-center gap-2">
                        <button
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors border border-transparent hover:border-orange-600"
                          title="Editar"
                          onClick={() => {
                            setSelectedFarmaciaId(farmacia.id);
                            handleShow2();
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

      <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl px-4 py-3 flex items-center justify-between sm:px-6 shadow-sm">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 m-0">
              Mostrando <span className="font-medium">{currentFarmacias.length}</span> de <span className="font-medium">{filteredFarmacias.length}</span> farmacias
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
    </>
  );
};

export default FarmaciaTabla;