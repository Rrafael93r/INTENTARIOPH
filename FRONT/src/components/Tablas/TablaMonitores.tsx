import React, { useState, useEffect } from 'react';
import { Badge, FormControl, Card, Modal, Button } from 'react-bootstrap';
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
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, inhabilitar!',
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

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Monitor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormularioCrearMonitor handleClose={() => { handleClose(); loadMonitores(); }} />
                </Modal.Body>
            </Modal>

            <div className="d-flex align-items-center" style={{ color: 'black' }}>
                <div className="pagetitle">
                    <h1>Monitores</h1>
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
                        <i className="bi bi-plus-circle-fill me-2"></i> Agregar Monitor
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
                            {currentMonitores.map((monitor) => (
                                <tr key={monitor.id}>
                                    <td>{monitor.id}</td>
                                    <td>{monitor.marca}</td>
                                    <td>{monitor.modelo}</td>
                                    <td>{monitor.serial}</td>
                                    <td>
                                        <Badge bg={monitor.estado === 'ACTIVO' ? 'success' : 'secondary'} className="rounded-pill">
                                            {monitor.estado}
                                        </Badge>
                                    </td>
                                    <td>{monitor.funcionarios ? `${monitor.funcionarios.nombre} ${monitor.funcionarios.apellido}` : 'Sin asignar'}</td>
                                    <td>
                                        <div className="d-flex justify-content-center btn-group" role="group">
                                            <button
                                                className="btn btn-light btn-sm"
                                                style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }}
                                                onClick={() => {
                                                    setSelectedMonitorId(monitor.id);
                                                    handleShow2();
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm ms-2"
                                                onClick={() => handleDisable(monitor.id)}
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
                    <Modal.Title>Editar Monitor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMonitorId && (
                        <FormularioEditarMonitor
                            id={selectedMonitorId}
                            handleClose={handleClose2}
                            onSuccess={loadMonitores}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TablaMonitores;
