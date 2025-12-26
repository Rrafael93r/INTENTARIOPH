import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createUser } from '../../servicios/usuarioService';
import { getRoles } from '../../servicios/rolesService';
import { getFarmacias } from '../../servicios/farmaciaService';

interface Role {
    id: number;
    name: string;
}

interface Farmacia {
    id: number;
    nombre: string;
}

const FormularioCrearUsuario = ({ handleClose }: { handleClose: () => void }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: { id: '' },
        farmacia: { id: '' }
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [rolesData, farmaciasData] = await Promise.all([
                    getRoles(),
                    getFarmacias()
                ]);
                setRoles(rolesData);
                setFarmacias(farmaciasData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
        cargarDatos();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (id === 'role') {
            setFormData(prevData => ({ ...prevData, role: { id: value } }));
        } else if (id === 'farmacia') {
            setFormData(prevData => ({ ...prevData, farmacia: { id: value } }));
        } else {
            setFormData(prevData => ({ ...prevData, [id]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.username || !formData.password || !formData.role.id) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, rellena username, password y rol.',
            });
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                role: { id: formData.role.id },
                farmacia: formData.farmacia.id ? { id: formData.farmacia.id } : null
            };

            await createUser(dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Usuario Creado',
                text: 'El usuario fue creado correctamente.',
            });

            setFormData({
                username: '',
                password: '',
                role: { id: '' },
                farmacia: { id: '' }
            });
            handleClose();

        } catch (error) {
            console.error("Error al crear el usuario:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el usuario.',
            });
        }
    };

    return (
        <div className="p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label htmlFor="username" className="form-label">Username*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Password*</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-6">
                    <label htmlFor="role" className="form-label">Rol*</label>
                    <select
                        id="role"
                        className="form-select"
                        value={formData.role.id}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione...</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label htmlFor="farmacia" className="form-label">Farmacia</label>
                    <select
                        id="farmacia"
                        className="form-select"
                        value={formData.farmacia.id}
                        onChange={handleChange}
                    >
                        <option value="">Ninguna</option>
                        {farmacias.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-center mt-4">
                    <button
                        style={{
                            backgroundColor: '#f6952c', borderColor: '#f6952c',
                            cursor: 'pointer',
                            background: isHovered2 ? '#ffff' : '#f6952c',
                            color: isHovered2 ? '#f6952c' : '#ffff',
                        }}
                        onMouseEnter={() => setIsHovered2(true)}
                        onMouseLeave={() => setIsHovered2(false)}
                        type="submit" className="btn btn-primary me-4">
                        <i className="bi bi-floppy m-1" />GUARDAR
                    </button>
                    <button
                        style={{
                            backgroundColor: isHovered ? '#f6952c' : '#ffff',
                            color: isHovered ? '#fff' : '#f6952c',
                            borderColor: '#f6952c',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setFormData({
                            username: '',
                            password: '',
                            role: { id: '' },
                            farmacia: { id: '' }
                        })}
                    >
                        <i className="bi bi-trash-fill m-1" />LIMPIAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearUsuario;
