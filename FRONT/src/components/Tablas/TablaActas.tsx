import React, { useState, useEffect } from 'react';
import { FormControl, Card, Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getActas, deleteActa } from '../../servicios/actaService';
import FormularioCrearActa from '../FormulariosCrear/FormularioCrearActa';
import FormularioEditarActa from '../FormulariosEditar.tsx/FormularioEditarActa';

const TablaActas: React.FC = () => {
    const [actas, setActas] = useState<any[]>([]);
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
    const [filterTitulo, setFilterTitulo] = useState('');
    const [filterFecha, setFilterFecha] = useState('');

    const loadActas = async () => {
        try {
            const data = await getActas();
            setActas(data);
        } catch (err) {
            setError('Error al cargar actas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActas();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "El acta será eliminada permanentemente.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!',
            });

            if (result.isConfirmed) {
                await deleteActa(id);
                setActas((prev) => prev.filter((item) => item.id !== id));
                Swal.fire('¡Eliminada!', 'El acta ha sido eliminada.', 'success');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el acta.', 'error');
        }
    };

    const normalizedFilterTitulo = filterTitulo.toLowerCase();
    const normalizedFilterFecha = filterFecha.toLowerCase();

    const filteredActas = actas.filter(acta => {
        return (
            (!filterTitulo || (acta.titulo || '').toLowerCase().includes(normalizedFilterTitulo)) &&
            (!filterFecha || (acta.fecha || '').toLowerCase().includes(normalizedFilterFecha))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentActas = filteredActas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredActas.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setFilterTitulo('');
        setFilterFecha('');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nueva Acta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormularioCrearActa handleClose={() => { handleClose(); loadActas(); }} />
                </Modal.Body>
            </Modal>

            <div className="d-flex align-items-center" style={{ color: 'black' }}>
                <div className="pagetitle">
                    <h1>Actas</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">Inicio</li>
                            <li className="breadcrumb-item">Documentación</li>
                            <li className="breadcrumb-item active">Actas</li>
                        </ol>
                    </nav>
                </div>
                <div className="ms-auto">
                    <Button
                        onClick={handleShow}
                        className="btn" style={{ backgroundColor: '#f6952c', borderColor: '#f6952c' }}>
                        <i className="bi bi-plus-circle-fill me-2"></i> Agregar Acta
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
                                        placeholder="Filtrar Título"
                                        value={filterTitulo}
                                        onChange={(e) => setFilterTitulo(e.target.value)}
                                    />
                                    TÍTULO
                                </th>
                                <th>
                                    <FormControl
                                        size="sm"
                                        type="text"
                                        placeholder="Filtrar Fecha"
                                        value={filterFecha}
                                        onChange={(e) => setFilterFecha(e.target.value)}
                                    />
                                    FECHA
                                </th>
                                <th>DESCRIPCIÓN</th>
                                <th>ARCHIVO</th>
                                <th className="text-center">
                                    <button style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }} onClick={clearFilters} type="button" className="btn btn-sm">
                                        <i className='bi bi-brush' />
                                    </button>
                                    <span style={{ display: 'block', marginTop: '4px' }}>ACCIONES</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentActas.map((acta) => (
                                <tr key={acta.id}>
                                    <td>{acta.id}</td>
                                    <td>{acta.titulo}</td>
                                    <td>{acta.fecha}</td>
                                    <td>{acta.descripcion}</td>
                                    <td>
                                        {acta.url_archivo ? (
                                            <a href={acta.url_archivo} target="_blank" rel="noopener noreferrer">Ver Archivo</a>
                                        ) : 'N/A'}
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center btn-group" role="group">
                                            <button
                                                className="btn btn-light btn-sm"
                                                style={{ backgroundColor: "#ffb361", color: '#fff', borderColor: '#ffb361' }}
                                                onClick={() => {
                                                    setSelectedId(acta.id);
                                                    handleShow2();
                                                }}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm ms-2"
                                                onClick={() => handleDelete(acta.id)}
                                                title="Eliminar"
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
                    <Modal.Title>Editar Acta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedId && (
                        <FormularioEditarActa
                            id={selectedId}
                            handleClose={handleClose2}
                            onSuccess={loadActas}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TablaActas;
