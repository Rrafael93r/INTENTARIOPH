import React, { useState, useEffect } from 'react';
import { Badge, FormControl, Card, Modal, Button } from 'react-bootstrap';
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

  const filteredFarmacias = farmacias.filter(farmacia => {
    if (
      (filterNombre && !(farmacia?.nombre || '').toLowerCase().includes(normalizedFilterNombre)) ||
      (filterDireccion && !(farmacia?.direccion || '').toLowerCase().includes(normalizedFilterDireccion)) ||
      (filterCiudad && !(farmacia?.ciudad?.nombre_ciudad || '').toLowerCase().includes(normalizedFilterCiudad)) ||
      (filterDepartamento && !(farmacia?.ciudad?.departamento?.nombre || '').toLowerCase().includes(normalizedFilterDepartamento)) ||
      (filterProveedor && !(farmacia?.proveedor?.nombre || '').toLowerCase().includes(normalizedFilterProveedor)) ||
      (filterPertenece && !(farmacia?.pertenece || '').toLowerCase().includes(normalizedFilterPertenece))
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
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nueva Farmacia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioCrearF />
        </Modal.Body>
      </Modal>

      <div className="d-flex align-items-center" style={{ color: 'black' }}>
        <div className="pagetitle">
          <h1>Farmacias</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Inicio</li>

              <li className="breadcrumb-item active">
                <a className="text-decoration-none" href="/Proveedores">Proveedores</a>
              </li>
            </ol>
          </nav>
        </div>
        <div className="ms-auto">

          <Button
            onClick={handleShow}
            className="btn" style={{ backgroundColor: '#f6952c', borderColor: '#f6952c' }}>
            <i className="bi bi-plus-circle-fill me-2"></i> Agregar Farmacia
          </Button>

        </div>
      </div>
      <div className='p-2' style={{ backgroundColor: '#ffff', borderBlockEndColor: '10px' }}>
        <div className="table-responsive hv-100" style={{ maxHeight: '50vh' }}>
          <table className="table table-hover text-nowrap" >
            <thead>
              <tr>
                <th>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar nombre"
                    value={filterNombre}
                    onChange={(e) => setFilterNombre(e.target.value)}
                  />
                  NOMBRE
                </th>
                <th>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar dirección"
                    value={filterDireccion}
                    onChange={(e) => setFilterDireccion(e.target.value)}
                  />
                  DIRECCIÓN
                </th>
                <th>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar ciudad"
                    value={filterCiudad}
                    onChange={(e) => setFilterCiudad(e.target.value)}
                  />
                  CIUDAD
                </th>
                <th>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar departamento"
                    value={filterDepartamento}
                    onChange={(e) => setFilterDepartamento(e.target.value)}
                  />
                  DEPARTAMENTO
                </th>
                <th>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar proveedor"
                    value={filterProveedor}
                    onChange={(e) => setFilterProveedor(e.target.value)}
                  />
                  PROVEEDOR
                </th>
                <th>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar pertenece"
                    value={filterPertenece}
                    onChange={(e) => setFilterPertenece(e.target.value)}
                  />
                  PERTENECE
                </th>
                <th className="text-center">
                  <button style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }} onClick={clearFilters} type="button" className="btn btn-sm">
                    <i className='bi bi-brush' />
                  </button>
                  <span style={{ display: 'block', marginTop: '4px' }}>
                    ACCIONES
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentFarmacias.map((farmacia) => (
                <tr key={farmacia.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div>
                        <div>{farmacia?.nombre || '-'}</div>
                        <small className="text-muted">ID: {farmacia.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>{farmacia?.direccion || '-'}</td>
                  <td>
                    <div>{farmacia?.ciudad?.nombre_ciudad || '-'}</div>
                  </td>
                  <td>{farmacia?.ciudad?.departamento?.name_departamento || '-'}</td>
                  <td>
                    <div>{farmacia?.proveedor?.nombre || '-'}</div>
                    <small className="text-muted">NIT: {farmacia?.proveedor?.nit || '-'}</small>
                  </td>
                  <td>
                    <Badge bg={farmacia?.pertenece === 'PHARMASER' ? 'warning' : 'primary'} className="rounded-pill">
                      {farmacia?.pertenece || '-'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-end btn-group" role="group">
                      <button
                        className="btn btn-light btn-sm"
                        style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }}
                        onClick={() => {
                          setSelectedFarmaciaId(farmacia.id); // Guardamos el ID de la farmacia
                          handleShow2(); // Abrimos el modal
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div >
      </div >

      <Modal show={showModal2} onHide={handleClose2} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Farmacia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>

      <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#ffff', borderBottom: '20px' }}>
        <ul className="pagination pagination-sm" >
          <li className={`m-1 page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }} onClick={() => handlePageChange(1)}>
              <i className="bi bi-chevron-double-left"></i>
            </button>
          </li>
          <li className={`m-1 page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }} onClick={() => handlePageChange(currentPage - 1)}>
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>
          <li className=" m-1 page-item active">
            <span className="page-link" style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }}>{currentPage}</span>
          </li>
          <li className={` m-1 page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }} onClick={() => handlePageChange(currentPage + 1)}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
          <li className={` m-1 page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }} onClick={() => handlePageChange(totalPages)}>
              <i className="bi bi-chevron-double-right"></i>
            </button>
          </li>
        </ul>
      </Card.Footer>
    </>
  );
};

export default FarmaciaTabla;