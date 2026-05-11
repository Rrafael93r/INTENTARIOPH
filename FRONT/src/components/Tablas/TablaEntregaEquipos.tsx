"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"
import axios from "../../servicios/axiosConfig"
import { getFuncionarios } from "../../servicios/funcionariosService"

const BASE_URL = `${import.meta.env.VITE_API_URL}/acta`

interface Acta {
    id?: number
    titulo: string
    descripcion: string
    fecha: string
    urlArchivo?: string
}

const TablaEntregaEquipos: React.FC = () => {
    const [actas, setActas] = useState<Acta[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [busqueda, setBusqueda] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [showCreate, setShowCreate] = useState(false)
    const [funcionarios, setFuncionarios] = useState<any[]>([])

    // Formulario nuevo acta
    const [form, setForm] = useState({ titulo: "", descripcion: "", fecha: new Date().toISOString().split("T")[0], urlArchivo: "" })
    const [savingActa, setSavingActa] = useState(false)

    const cargar = async () => {
        try {
            setLoading(true)
            const res = await axios.get(BASE_URL)
            setActas(res.data)
        } catch {
            setError("Error al cargar las actas.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargar()
        getFuncionarios().then(setFuncionarios).catch(console.error)
    }, [])

    const handleEliminar = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Eliminar acta?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
        if (!result.isConfirmed) return
        try {
            await axios.delete(`${BASE_URL}/${id}`)
            Swal.fire({ icon: "success", title: "Acta eliminada", timer: 1200, showConfirmButton: false })
            cargar()
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el acta." })
        }
    }

    const handleCrear = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.titulo || !form.descripcion || !form.fecha) {
            Swal.fire({ icon: "warning", title: "Campos requeridos", text: "Completa todos los campos obligatorios." })
            return
        }
        setSavingActa(true)
        try {
            await axios.post(BASE_URL, form)
            Swal.fire({ icon: "success", title: "Acta creada", timer: 1400, showConfirmButton: false })
            setShowCreate(false)
            setForm({ titulo: "", descripcion: "", fecha: new Date().toISOString().split("T")[0], urlArchivo: "" })
            cargar()
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el acta." })
        } finally {
            setSavingActa(false)
        }
    }

    const exportarExcel = () => {
        const rows = filtrados.map(a => ({
            ID: a.id,
            Título: a.titulo,
            Descripción: a.descripcion,
            Fecha: a.fecha,
            "URL / Archivo": a.urlArchivo || "—",
        }))
        const ws = XLSX.utils.json_to_sheet(rows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Actas")
        XLSX.writeFile(wb, `Actas_${new Date().toISOString().split("T")[0]}.xlsx`)
    }

    const filtrados = actas.filter(a => {
        const q = busqueda.toLowerCase()
        return !q || a.titulo?.toLowerCase().includes(q) || a.descripcion?.toLowerCase().includes(q)
    })

    const totalPages = Math.ceil(filtrados.length / itemsPerPage)
    const paginados = filtrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 m-0 flex items-center gap-2">
                            <i className="bi bi-file-earmark-text text-orange-500"></i>
                            Actas de Entrega / Recepción de Equipos
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 mb-0">Registro de actas de ingreso y egreso de activos tecnológicos</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={exportarExcel}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm flex items-center gap-2 transition-colors">
                            <Download size={16} />
                            <span className="hidden sm:inline">Exportar</span>
                        </button>
                        <button onClick={() => setShowCreate(true)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-orange-600 transition-colors w-full sm:w-auto justify-center">
                            <i className="bi bi-plus-circle"></i>
                            <span>Nueva Acta</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtro */}
            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="bi bi-search text-gray-400"></i>
                    </div>
                    <input type="text" value={busqueda} onChange={e => { setBusqueda(e.target.value); setCurrentPage(1) }}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        placeholder="Buscar por título o descripción..." />
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-orange-500 mx-auto mb-3"></div>
                        <p>Cargando actas...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-3">ID</th>
                                <th className="p-3">Título</th>
                                <th className="p-3">Descripción</th>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Archivo</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {paginados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <i className="bi bi-file-earmark-x text-4xl text-gray-300 mb-2"></i>
                                            <p>No hay actas registradas.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginados.map(a => (
                                <tr key={a.id} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="p-3 font-medium text-gray-700">#{a.id}</td>
                                    <td className="p-3 font-semibold text-gray-800">{a.titulo}</td>
                                    <td className="p-3 text-sm text-gray-600 max-w-xs">
                                        <span className="line-clamp-2">{a.descripcion}</span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-600">{a.fecha}</td>
                                    <td className="p-3">
                                        {a.urlArchivo
                                            ? <a href={a.urlArchivo} target="_blank" rel="noreferrer"
                                                className="text-orange-500 hover:text-orange-700 text-sm font-medium flex items-center gap-1">
                                                <i className="bi bi-file-earmark-arrow-down"></i> Ver
                                              </a>
                                            : <span className="text-gray-400 text-sm">—</span>}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleEliminar(a.id!)}
                                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar">
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                    <p className="text-sm text-gray-700 m-0">
                        Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filtrados.length)}–{Math.min(currentPage * itemsPerPage, filtrados.length)} de {filtrados.length}
                    </p>
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">‹</button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i))
                            return (
                                <button key={page} onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border rounded-lg text-sm ${currentPage === page ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 hover:bg-gray-50"}`}>
                                    {page}
                                </button>
                            )
                        })}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">›</button>
                    </div>
                </div>
            )}

            {/* Modal Crear */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="p-6">
                            <h5 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <i className="bi bi-file-earmark-plus text-orange-500"></i>
                                Nueva Acta de Entrega / Recepción
                            </h5>
                            <form onSubmit={handleCrear} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                                    <input type="text" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} required
                                        placeholder="Ej: Acta de entrega portátil Dell - Juan Pérez"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                                    <input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                                    <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} required rows={4}
                                        placeholder="Detalla el equipo entregado/recibido, serial, condición, funcionario, sede..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 resize-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL del archivo (opcional)</label>
                                    <input type="url" value={form.urlArchivo} onChange={e => setForm(p => ({ ...p, urlArchivo: e.target.value }))}
                                        placeholder="https://..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowCreate(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={savingActa}
                                        className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors">
                                        {savingActa ? "Guardando..." : "Crear Acta"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TablaEntregaEquipos
