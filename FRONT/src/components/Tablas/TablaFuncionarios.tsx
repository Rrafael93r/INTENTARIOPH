import React, { useState, useEffect } from 'react';
import { FormControl, Card, Modal, Button } from 'react-bootstrap';
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

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Funcionario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormularioCrearFuncionario handleClose={() => { handleClose(); loadItems(); }} />
                </Modal.Body>
            </Modal>

            <div className="d-flex align-items-center" style={{ color: 'black' }}>
                <div className="pagetitle">
                    <h1>Funcionarios</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">Inicio</li>
                            <li className="breadcrumb-item active">Funcionarios</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <Button
                        onClick={handleShow}
                        className="btn" style={{ backgroundColor: '#f6952c', borderColor: '#f6952c' }}>
                        <i className="bi bi-plus-circle-fill me-2"></i> Agregar Funcionario
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
                                        placeholder="Filtrar Nombre"
                                        value={filterNombre}
                                        onChange={(e) => setFilterNombre(e.target.value)}
                                    />
                                    NOMBRE
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Apellido"
                                        value={filterApellido}
                                        onChange={(e) => setFilterApellido(e.target.value)}
                                    />
                                    APELLIDO
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Área"
                                        value={filterArea}
                                        onChange={(e) => setFilterArea(e.target.value)}
                                    />
                                    ÁREA
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Correo"
                                        value={filterCorreo}
                                        onChange={(e) => setFilterCorreo(e.target.value)}
                                    />
                                    CORREO
                                </th>
                                <th style={{ display: 'none' }}>
                                    FARMACIA
                                </th>
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
                                    <td>{item.nombre}</td>
                                    <td>{item.apellido}</td>
                                    <td>{item.area?.nombre || item.area}</td>
                                    <td>{item.correo}</td>
                                    <td style={{ display: 'none' }}>{item.farmacias ? item.farmacias.nombre : 'Sin farmacia'}</td>
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
                                                className="btn btn-danger btn-sm ms-2"
                                                onClick={() => handleDelete(item.id)}
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
                    <Modal.Title>Editar Funcionario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedId && (
                        <FormularioEditarFuncionario
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

export default TablaFuncionarios;
