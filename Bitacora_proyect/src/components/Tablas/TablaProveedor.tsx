import React, { useState, useEffect } from 'react';
import { Badge, FormControl, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getProveedor_internet, deleteProveedor } from '../../servicios/ProveedoresService';
import { Link } from 'react-router-dom';

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
      <div className='p-2' style={{ backgroundColor: '#ffff', borderBlockEndColor: '10px' }}>
        <div className="table-responsive hv-100" style={{ maxHeight: '50vh' }}>
          <table className='table table-hover text-nowarp'>
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
                    placeholder="Filtrar correo"
                    value={filterCorreo}
                    onChange={(e) => setFilterCorreo(e.target.value)}
                  />
                  Correo
                </th>
                <th>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar contacto"
                    value={filterNombreContacto}
                    onChange={(e) => setFilterNombreContacto(e.target.value)}
                  />
                  Contacto
                </th>
                <th>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar número"
                    value={filterNumeroContacto}
                    onChange={(e) => setFilterNumeroContacto(e.target.value)}
                  />
                  Número
                </th>
                <th>
                  <FormControl
                    size="sm"
                    type="text"
                    placeholder="Filtrar estado"
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                  />
                  Estado
                </th>
                <th className="text-center">
                  <button style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }} onClick={clearFilters} type="button" className="btn btn-light btn-sm">
                    <i className='bi bi-brush' />
                  </button>
                  <span style={{ display: 'block', marginTop: '4px' }}>
                    Acciones
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProveedor_internet.map((proveedor) => (
                <tr key={proveedor.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div>
                        <div >{proveedor.nombre}</div>
                        <small className="text-muted">ID: {proveedor.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>{proveedor.correo}</td>
                  <td>
                    <div >{proveedor.nombre_contacto}</div>
                  </td>
                  <td>{proveedor.numero_contacto}</td>
                  <td>
                    <Badge bg={proveedor.estado === 'NO ACTIVO' ? 'danger' : 'success'} className="rounded-pill">
                      {proveedor.estado}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-end btn-group" role="group">
                      <Link to={`/EditarProveedor/${proveedor.id}`} className="btn btn-light btn-sm" style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }}>
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }}
                        onClick={() => handleDelete(proveedor.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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

export default ProveedorTable;