import React, { useState, useEffect } from 'react';
import { Badge, FormControl, Card, Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getMouses, updateMouse } from '../../servicios/mousesService';
import FormularioCrearMouse from '../FormulariosCrear/FormularioCrearMouse';
import FormularioEditarMouse from '../FormulariosEditar.tsx/FormularioEditarMouse';

const TablaMouses: React.FC = () => {
    const [mouses, setMouses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedMouseId, setSelectedMouseId] = useState<number | null>(null);

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

    const loadMouses = async () => {
        try {
            const data = await getMouses();
            setMouses(data);
        } catch (err) {
            setError('Error al cargar mouses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMouses();
    }, []);

    const handleDisable = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "El mouse será inhabilitado (Estado: INACTIVO) pero no eliminado.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, inhabilitar!',
            });

            if (result.isConfirmed) {
                const mouseToDisable = mouses.find(m => m.id === id);
                if (mouseToDisable) {
                    const updatedMouse = { ...mouseToDisable, estado: 'INACTIVO' };
                    await updateMouse(id, updatedMouse);
                    setMouses((prev) => prev.map((item) => item.id === id ? { ...item, estado: 'INACTIVO' } : item));
                    Swal.fire('¡Inhabilitado!', 'El mouse ha sido marcado como INACTIVO.', 'success');
                }
            }
        } catch (error) {
            console.error('Error al inhabilitar:', error);
            Swal.fire('Error', 'No se pudo inhabilitar el mouse.', 'error');
        }
    };

    const normalizedFilterMarca = filterMarca.toLowerCase();
    const normalizedFilterModelo = filterModelo.toLowerCase();
    const normalizedFilterSerial = filterSerial.toLowerCase();
    const normalizedFilterEstado = filterEstado.toLowerCase();
    const normalizedFilterFuncionario = filterFuncionario.toLowerCase();

    const filteredMouses = mouses.filter(mouse => {
        return (
            (!filterMarca || (mouse.marca || '').toLowerCase().includes(normalizedFilterMarca)) &&
            (!filterModelo || (mouse.modelo || '').toLowerCase().includes(normalizedFilterModelo)) &&
            (!filterSerial || (mouse.serial || '').toLowerCase().includes(normalizedFilterSerial)) &&
            (!filterEstado || (mouse.estado || '').toLowerCase().includes(normalizedFilterEstado)) &&
            (!filterFuncionario || (mouse.funcionarios ? `${mouse.funcionarios.nombre} ${mouse.funcionarios.apellido}` : '').toLowerCase().includes(normalizedFilterFuncionario))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMouses = filteredMouses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMouses.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setFilterMarca('');
        setFilterModelo('');
        setFilterSerial('');
        setFilterEstado('');
        setFilterFuncionario('');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Mouse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormularioCrearMouse handleClose={() => { handleClose(); loadMouses(); }} />
                </Modal.Body>
            </Modal>

            <div className="d-flex align-items-center" style={{ color: 'black' }}>
                <div className="pagetitle">
                    <h1>Mouses</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">Inicio</li>
                            <li className="breadcrumb-item active">Inventario</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <Button
                        onClick={handleShow}
                        className="btn" style={{ backgroundColor: '#f6952c', borderColor: '#f6952c' }}>
                        <i className="bi bi-plus-circle-fill me-2"></i> Agregar Mouse
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
                                        placeholder="Filtrar Marca"
                                        value={filterMarca}
                                        onChange={(e) => setFilterMarca(e.target.value)}
                                    />
                                    MARCA
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Modelo"
                                        value={filterModelo}
                                        onChange={(e) => setFilterModelo(e.target.value)}
                                    />
                                    MODELO
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Serial"
                                        value={filterSerial}
                                        onChange={(e) => setFilterSerial(e.target.value)}
                                    />
                                    SERIAL
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Estado"
                                        value={filterEstado}
                                        onChange={(e) => setFilterEstado(e.target.value)}
                                    />
                                    ESTADO
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Funcionario"
                                        value={filterFuncionario}
                                        onChange={(e) => setFilterFuncionario(e.target.value)}
                                    />
                                    FUNCIONARIO
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
                            {currentMouses.map((mouse) => (
                                <tr key={mouse.id}>
                                    <td>{mouse.id}</td>
                                    <td>{mouse.marca}</td>
                                    <td>{mouse.modelo}</td>
                                    <td>{mouse.serial}</td>
                                    <td>
                                        <Badge bg={mouse.estado === 'ACTIVO' ? 'success' : 'secondary'} className="rounded-pill">
                                            {mouse.estado}
                                        </Badge>
                                    </td>
                                    <td>{mouse.funcionarios ? `${mouse.funcionarios.nombre} ${mouse.funcionarios.apellido}` : 'Sin asignar'}</td>
                                    <td>
                                        <div className="d-flex justify-content-center btn-group" role="group">
                                            <button
                                                className="btn btn-light btn-sm"
                                                style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }}
                                                onClick={() => {
                                                    setSelectedMouseId(mouse.id);
                                                    handleShow2();
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm ms-2"
                                                onClick={() => handleDisable(mouse.id)}
                                                title="Inhabilitar"
                                            >
                                                <i className="bi bi-slash-circle"></i>
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
                    <Modal.Title>Editar Mouse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMouseId && (
                        <FormularioEditarMouse
                            id={selectedMouseId}
                            handleClose={handleClose2}
                            onSuccess={loadMouses}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TablaMouses;
