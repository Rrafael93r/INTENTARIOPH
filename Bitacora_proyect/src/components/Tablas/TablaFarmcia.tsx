import React, { useState, useEffect } from 'react';
import { Table, Badge, FormControl, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getFarmacias, deleteFarmacia } from '../../servicios/farmaciaService';
import { TitlePage } from './TitlePage';
import { Link } from 'react-router-dom';

const FarmaciaTabla: React.FC = () => {
  const [farmacias, setFarmacias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const filteredFarmacias = farmacias.filter(farmacia => {
    return (
      (farmacia?.nombre || '').toLowerCase().includes(filterNombre.toLowerCase()) &&
      (farmacia?.direccion || '').toLowerCase().includes(filterDireccion.toLowerCase()) &&
      (farmacia?.ciudad?.nombre_ciudad || '').toLowerCase().includes(filterCiudad.toLowerCase()) &&
      (farmacia?.ciudad?.departamento?.nombre || '').toLowerCase().includes(filterDepartamento.toLowerCase()) &&
      (farmacia?.proveedor?.nombre || '').toLowerCase().includes(filterProveedor.toLowerCase()) &&
      (farmacia?.pertenece || '').toLowerCase().includes(filterPertenece.toLowerCase())
    );
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
        Swal.fire('¡Eliminado!', 'La farmacia ha sido eliminada.', 'success');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la farmacia. Por favor, intente nuevamente.',
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
      <TitlePage name="Farmacias" />
      <div className="col-lg-12">
        <Card className="stretch stretch-full">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
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
                      Nombre
                    </th>
                    <th>
                      <FormControl
                        size="sm"
                        type="text"
                        placeholder="Filtrar dirección"
                        value={filterDireccion}
                        onChange={(e) => setFilterDireccion(e.target.value)}
                      />
                      Dirección
                    </th>
                    <th>
                      <FormControl
                        size="sm"
                        type="text"
                        placeholder="Filtrar ciudad"
                        value={filterCiudad}
                        onChange={(e) => setFilterCiudad(e.target.value)}
                      />
                      Ciudad
                    </th>
                    <th>
                      <FormControl
                        size="sm"
                        type="text"
                        placeholder="Filtrar departamento"
                        value={filterDepartamento}
                        onChange={(e) => setFilterDepartamento(e.target.value)}
                      />
                      Departamento
                    </th>
                    <th>
                      <FormControl
                        size="sm"
                        type="text"
                        placeholder="Filtrar proveedor"
                        value={filterProveedor}
                        onChange={(e) => setFilterProveedor(e.target.value)}
                      />
                      Proveedor
                    </th>
                    <th>
                      <FormControl
                        size="sm"
                        type="text"
                        placeholder="Filtrar pertenece"
                        value={filterPertenece}
                        onChange={(e) => setFilterPertenece(e.target.value)}
                      />
                      Pertenece
                    </th>
                    <th className="text-center">
                      <button onClick={clearFilters} type="button" className="btn btn-light btn-sm">
                        <i className='bi bi-brush' />
                      </button>
                      <span style={{ display: 'block', marginTop: '4px' }}>
                        Acciones
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
                            <div className="fw-bold">{farmacia?.nombre || '-'}</div>
                            <small className="text-muted">ID: {farmacia.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>{farmacia?.direccion || '-'}</td>
                      <td>
                        <div className="fw-bold">{farmacia?.ciudad?.nombre_ciudad || '-'}</div>
                        <small className="text-muted">{farmacia?.ciudad?.departamento?.name_departamento || '-'}</small>
                      </td>
                      <td>{farmacia?.ciudad?.departamento?.name_departamento || '-'}</td>
                      <td>
                        <div className="fw-bold">{farmacia?.proveedor?.nombre || '-'}</div>
                        <small className="text-muted">NIT: {farmacia?.proveedor?.nit || '-'}</small>
                      </td>
                      <td>
                        <Badge bg={farmacia?.pertenece === 'PHARMASER' ? 'warning' : 'primary'} className="rounded-pill">
                          {farmacia?.pertenece || '-'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-end">
                          <Link to={`/EditarFarmacia/${farmacia.id}`} className="btn btn-light btn-sm">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-light btn-sm"
                            onClick={() => handleDelete(farmacia.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
          <Card.Footer>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link text-dark bg-white border-secondary" onClick={() => handlePageChange(1)}>
                  <i className="bi bi-chevron-double-left"></i>
                </button>
              </li>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link text-dark bg-white border-secondary" onClick={() => handlePageChange(currentPage - 1)}>
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link text-dark bg-light border-secondary">{currentPage}</span>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link text-dark bg-white border-secondary" onClick={() => handlePageChange(currentPage + 1)}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link text-dark bg-white border-secondary" onClick={() => handlePageChange(totalPages)}>
                  <i className="bi bi-chevron-double-right"></i>
                </button>
              </li>
            </ul>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
};

export default FarmaciaTabla;