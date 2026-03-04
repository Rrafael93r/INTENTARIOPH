import React, { useState, useEffect } from 'react';
import { Button, Modal, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getEstados, deleteEstado } from '../../servicios/estadoService';
import FormularioCrearEstado from '../FormulariosCrear/FormularioCrearEstado';
import FormularioEditarEstado from '../FormulariosEditar.tsx/FormularioEditarEstado';

const TablaEstados: React.FC = () => {
    const [estados, setEstados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEstadoId, setSelectedEstadoId] = useState<number | null>(null);
    const [filterNombre, setFilterNombre] = useState('');

    const loadEstados = async () => {
        setLoading(true);
        try {
            const data = await getEstados();
            setEstados(data);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error al cargar los estados', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEstados();
    }, []);

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
        });

        if (result.isConfirmed) {
            try {
                await deleteEstado(id);
                setEstados(estados.filter(e => e.id !== id));
                Swal.fire('Eliminado!', 'El estado ha sido eliminado.', 'success');
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar el estado', 'error');
            }
        }
    };

    const handleEdit = (id: number) => {
        setSelectedEstadoId(id);
        setShowEditModal(true);
    };

    const filteredEstados = estados.filter(estado =>
        estado.nombre.toLowerCase().includes(filterNombre.toLowerCase())
    );

    return (
        <div className="container-fluid p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Gestión de Estados</h2>
                <Button onClick={() => setShowCreateModal(true)} style={{ backgroundColor: '#f6952c', borderColor: '#f6952c' }}>
                    <i className="bi bi-plus-lg me-2"></i> Nuevo Estado
                </Button>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="mb-3">
                        <FormControl
                            placeholder="Buscar por nombre..."
                            value={filterNombre}
                            onChange={(e) => setFilterNombre(e.target.value)}
                        />
                    </div>
                    {loading ? (
                        <div className="text-center">Cargando...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEstados.map(estado => (
                                        <tr key={estado.id}>
                                            <td>{estado.id}</td>
                                            <td>{estado.nombre}</td>
                                            <td>{estado.descripcion}</td>
                                            <td className="text-end">
                                                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(estado.id)}>
                                                    <i className="bi bi-pencil"></i>
                                                </Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(estado.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredEstados.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted">No se encontraron estados</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Crear */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Estado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormularioCrearEstado
                        handleClose={() => setShowCreateModal(false)}
                        onSuccess={loadEstados}
                    />
                </Modal.Body>
            </Modal>

            {/* Modal Editar */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Estado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEstadoId && (
                        <FormularioEditarEstado
                            estadoId={selectedEstadoId}
                            onClose={() => setShowEditModal(false)}
                            onSuccess={loadEstados}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TablaEstados;
