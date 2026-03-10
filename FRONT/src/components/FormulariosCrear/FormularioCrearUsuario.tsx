import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createUser } from '../../servicios/usuarioService';
import { getRoles } from '../../servicios/rolesService';
import { getFarmacias } from '../../servicios/farmaciaService';
import { getFuncionarios } from '../../servicios/funcionariosService';

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

const FormularioCrearUsuario = ({ handleClose }: { handleClose: () => void }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        roles: { id: '' },
        farmacia: { id: '' },
        funcionario: { id: '' }
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [rolesData, farmaciasData, funcionariosData] = await Promise.all([
                    getRoles(),
                    getFarmacias(),
                    getFuncionarios()
                ]);
                setRoles(rolesData);
                setFarmacias(farmaciasData);
                setFuncionarios(funcionariosData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
        cargarDatos();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (id === 'roles') {
            setFormData(prevData => ({ ...prevData, roles: { id: value } }));
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

        if (!formData.username || !formData.password || !formData.roles.id) {
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
                roles: { id: formData.roles.id },
                farmacia: formData.farmacia.id ? { id: formData.farmacia.id } : null,
                funcionario: formData.funcionario.id ? { id: formData.funcionario.id } : null
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
                roles: { id: '' },
                farmacia: { id: '' },
                funcionario: { id: '' }
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
        <div className="p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="username" className="text-sm font-semibold text-gray-700">Username <span className="text-orange-500">*</span></label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Nombre de usuario"
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password <span className="text-orange-500">*</span></label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Contraseña"
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                        />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="roles" className="text-sm font-semibold text-gray-700">Rol <span className="text-orange-500">*</span></label>
                        <div className="relative">
                            <select
                                id="roles"
                                value={formData.roles.id}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Seleccione un rol...</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <i className="bi bi-chevron-down text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="farmacia" className="text-sm font-semibold text-gray-700">Farmacia</label>
                        <div className="relative">
                            <select
                                id="farmacia"
                                value={formData.farmacia.id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Ninguna</option>
                                {farmacias.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.nombre}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <i className="bi bi-chevron-down text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1.5 md:col-span-2">
                        <label htmlFor="funcionario" className="text-sm font-semibold text-gray-700">Asignar a Funcionario (Opcional)</label>
                        <div className="relative">
                            <select
                                id="funcionario"
                                value={formData.funcionario.id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Ninguno</option>
                                {funcionarios.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.nombre} {f.apellido}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <i className="bi bi-chevron-down text-xs"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => setFormData({
                            username: '',
                            password: '',
                            roles: { id: '' },
                            farmacia: { id: '' },
                            funcionario: { id: '' }
                        })}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                    >
                        <i className="bi bi-trash-fill mr-2"></i>
                        Limpiar
                    </button>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-transparent bg-orange-500 text-white hover:bg-orange-600 font-medium text-sm transition-all shadow-sm shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center"
                    >
                        <i className="bi bi-floppy mr-2"></i>
                        Guardar Usuario
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioCrearUsuario;
