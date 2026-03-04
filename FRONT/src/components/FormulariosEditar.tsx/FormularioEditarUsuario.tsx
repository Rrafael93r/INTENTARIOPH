import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getUserByUsername, updateUser } from '../../servicios/usuarioService';

import { getRoles } from '../../servicios/rolesService';
import { getFarmacias } from '../../servicios/farmaciaService';
import { getFuncionarios } from '../../servicios/funcionariosService';
import axios from 'axios';

// Adding inline fetch for ID if service missing
const getUserById = async (id: number) => {
    // Trying standard endpoint
    const response = await axios.get(`http://localhost:8080/api/users/${id}`);
    return response.data;
}

interface Role {
    id: number;
    name: string;
}

interface Farmacia {
    id: number;
    nombre: string;
}

interface Funcionario {
    id: number;
    nombre: string;
    apellido: string;
}

interface FormularioEditarUsuarioProps {
    id: number;
    handleClose: () => void;
    onSuccess: () => void;
}

const FormularioEditarUsuario: React.FC<FormularioEditarUsuarioProps> = ({ id, handleClose, onSuccess }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: { id: '' },
        farmacia: { id: '' },
        funcionario: { id: '' },
        status: true
    });
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [userData, rolesData, farmaciasData, funcionariosData] = await Promise.all([
                    getUserById(id),
                    getRoles(),
                    getFarmacias(),
                    getFuncionarios()
                ]);

                setRoles(rolesData);
                setFarmacias(farmaciasData);
                setFuncionarios(funcionariosData);

                setFormData({
                    username: userData.username || '',
                    password: '', // Don't preload password
                    role: { id: userData.role?.id || '' },
                    farmacia: { id: userData.farmacia?.id || '' },
                    funcionario: { id: userData.funcionario?.id || '' },
                    status: userData.status
                });

            } catch (error) {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los datos del usuario',
                });
            }
        };
        if (id) {
            cargarDatos();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (id === 'role') {
            setFormData(prevData => ({ ...prevData, role: { id: value } }));
        } else if (id === 'farmacia') {
            setFormData(prevData => ({ ...prevData, farmacia: { id: value } }));
        } else if (id === 'funcionario') {
            setFormData(prevData => ({ ...prevData, funcionario: { id: value } }));
        } else {
            setFormData(prevData => ({ ...prevData, [id]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const dataToSend: any = {
                username: formData.username,
                role: { id: formData.role.id },
                farmacia: formData.farmacia.id ? { id: formData.farmacia.id } : null,
                funcionario: formData.funcionario.id ? { id: formData.funcionario.id } : null,
                status: formData.status
            };

            // Only send password if updated
            if (formData.password) {
                dataToSend.password = formData.password;
            }

            await updateUser(id, dataToSend);

            Swal.fire({
                icon: 'success',
                title: 'Usuario Actualizado',
                text: 'El usuario fue actualizado correctamente.',
            });

            onSuccess();
            handleClose();

        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el usuario.',
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
                    <label htmlFor="password" className="form-label">Password (Dejar vacío para no cambiar)</label>
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

                <div className="col-md-6">
                    <label htmlFor="funcionario" className="form-label">Asignar a Funcionario (Opcional)</label>
                    <select
                        id="funcionario"
                        className="form-select"
                        value={formData.funcionario.id}
                        onChange={handleChange}
                    >
                        <option value="">Ninguno</option>
                        {funcionarios.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.nombre} {f.apellido}
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
                        <i className="bi bi-floppy m-1" />ACTUALIZAR
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
                        onClick={handleClose}
                    >
                        <i className="bi bi-x-circle m-1" />CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioEditarUsuario;
