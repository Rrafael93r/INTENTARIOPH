import React, { useState, useEffect } from 'react';
import { FormControl, Card, Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getAllUsers, updateUser } from '../../servicios/usuarioService';
import FormularioCrearUsuario from '../FormulariosCrear/FormularioCrearUsuario';
import FormularioEditarUsuario from '../FormulariosEditar.tsx/FormularioEditarUsuario';

const TablaUsuarios: React.FC = () => {
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
    const [filterUsername, setFilterUsername] = useState('');
    const [filterFarmacia, setFilterFarmacia] = useState('');
    const [filterRole, setFilterRole] = useState('');

    const loadItems = async () => {
        try {
            const data = await getAllUsers();
            setItems(data);
        } catch (err) {
            setError('Error al cargar Usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const normalizedFilterUsername = filterUsername.toLowerCase();
    const normalizedFilterFarmacia = filterFarmacia.toLowerCase();
    const normalizedFilterRole = filterRole.toLowerCase();

    const filteredItems = items.filter(item => {
        return (
            (!filterUsername || (item.username || '').toLowerCase().includes(normalizedFilterUsername)) &&
            (!filterFarmacia || (item.farmacia ? item.farmacia.nombre : '').toLowerCase().includes(normalizedFilterFarmacia)) &&
            (!filterRole || (item.role ? item.role.name : '').toLowerCase().includes(normalizedFilterRole))
        );
    });

    const handleToggleStatus = async (item: any) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: `Vas a ${item.status ? 'deshabilitar' : 'habilitar'} a ${item.username}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: item.status ? 'Sí, deshabilitar!' : 'Sí, habilitar!'
            });

            if (result.isConfirmed) {
                // Ensure password not required if backend allows null, or handle differently
                // Assuming backend updates only non-null fields or we send current data
                // Need to construct object. Ideally service has specific toggle endpoint or we send minimal packet
                // Using generic update for now
                const updatedUser = {
                    ...item,
                    status: !item.status,
                    farmacia: item.farmacia ? { id: item.farmacia.id } : null, // Flatten for backend if needed
                    role: { id: item.role.id }, // Flatten
                    // Watch out for password. If backend requires it, this might fail.
                    // Ideally backend handles 'password': null or ignore if empty string.
                };

                await updateUser(item.id, updatedUser);

                setItems(prev => prev.map(u => u.id === item.id ? { ...u, status: !u.status } : u));
                Swal.fire('¡Actualizado!', 'El estado del usuario ha sido actualizado.', 'success');
            }
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el estado.',
            });
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setFilterUsername('');
        setFilterFarmacia('');
        setFilterRole('');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormularioCrearUsuario handleClose={() => { handleClose(); loadItems(); }} />
                </Modal.Body>
            </Modal>

            <div className="d-flex align-items-center" style={{ color: 'black' }}>
                <div className="pagetitle">
                    <h1>Usuarios</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">Administración</li>
                            <li className="breadcrumb-item active">Usuarios</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <Button
                        onClick={handleShow}
                        className="btn" style={{ backgroundColor: '#f6952c', borderColor: '#f6952c' }}>
                        <i className="bi bi-plus-circle-fill me-2"></i> Agregar Usuario
                    </Button>
                </div>
            </div>

            <div className='p-2' style={{ backgroundColor: '#ffff' }}>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Username"
                                        value={filterUsername}
                                        onChange={(e) => setFilterUsername(e.target.value)}
                                    />
                                    USERNAME
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Rol"
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                    />
                                    ROL
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Farmacia"
                                        value={filterFarmacia}
                                        onChange={(e) => setFilterFarmacia(e.target.value)}
                                    />
                                    FARMACIA
                                </th>
                                <th>STATUS</th>
                                <th className="text-center">
                                    <button style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }} onClick={clearFilters} type="button" className="btn btn-sm">
                                        <i className='bi bi-brush' />
                                    </button>
                                    <span style={{ display: 'block', marginTop: '4px' }}>ACCIONES</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.username}</td>
                                    <td>{item.role ? item.role.name : 'N/A'}</td>
                                    <td>{item.farmacia ? item.farmacia.nombre : 'N/A'}</td>
                                    <td>{item.status ? 'Activo' : 'Inactivo'}</td>
                                    <td>
                                        <div className="d-flex justify-content-center btn-group" role="group">
                                            <button
                                                className="btn btn-light btn-sm"
                                                style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }}
                                                onClick={() => {
                                                    setSelectedId(item.id);
                                                    handleShow2();
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className={`btn btn-sm ${item.status ? 'btn-outline-danger' : 'btn-outline-success'} ms-2`}
                                                title={item.status ? 'Deshabilitar' : 'Habilitar'}
                                                onClick={() => handleToggleStatus(item)}
                                            >
                                                <i className={`bi ${item.status ? 'bi-slash-circle' : 'bi-check-circle'}`}></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '#ffff' }}>
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
            </div>

            <Modal show={showModal2} onHide={handleClose2} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedId && (
                        <FormularioEditarUsuario
                            id={selectedId}
                            handleClose={handleClose2}
                            onSuccess={loadItems}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TablaUsuarios;