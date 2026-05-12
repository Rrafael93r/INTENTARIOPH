"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { getBajasEquipos, deleteBajaEquipo, type BajaEquipo } from "../../servicios/bajaEquipoService"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"
import FormularioCrearBaja from "../FormulariosCrear/FormularioCrearBaja"

const LABEL_TIPO: Record<string, string> = {
    PORTATIL: "Portátil",
    PC_ESCRITORIO: "PC Escritorio",
    MONITOR: "Monitor",
    IMPRESORA: "Impresora",
    IMPRESORA_POS: "Impresora POS",
    PERIFERICO: "Periférico",
    DIADEMA: "Diadema",
}

const TablaBajaEquipos: React.FC = () => {
    const [registros, setRegistros] = useState<BajaEquipo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [busqueda, setBusqueda] = useState("")
    const [filtroTipo, setFiltroTipo] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [showCreate, setShowCreate] = useState(false)

    const cargar = async () => {
        try {
            setLoading(true)
            const data = await getBajasEquipos()
            setRegistros(data)
        } catch {
            setError("Error al cargar las bajas de equipos.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargar() }, [])

    const handleEliminar = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Eliminar registro?",
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
            await deleteBajaEquipo(id)
            Swal.fire({ icon: "success", title: "Eliminado", timer: 1200, showConfirmButton: false })
            cargar()
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el registro." })
        }
    }

    const exportarExcel = () => {
        const rows = filtrados.map(r => ({
            ID: r.id,
            "Tipo Equipo": LABEL_TIPO[r.tipoEquipo] || r.tipoEquipo,
            "ID Equipo": r.equipoId ?? "—",
            Serial: r.serial || "—",
            Marca: r.marca || "—",
            Modelo: r.modelo || "—",
            Motivo: r.motivoBaja,
            "Fecha Baja": r.fechaBaja,
            "Último Funcionario": r.ultimoFuncionario
                ? `${r.ultimoFuncionario.nombre} ${r.ultimoFuncionario.apellido}`
                : "—",
            Descripción: r.descripcion || "—",
        }))
        const ws = XLSX.utils.json_to_sheet(rows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Bajas de Equipos")
        XLSX.writeFile(wb, `BajasEquipos_${new Date().toISOString().split("T")[0]}.xlsx`)
    }

    const filtrados = registros.filter(r => {
        const q = busqueda.toLowerCase()
        const matchBusqueda = !q ||
            (r.serial?.toLowerCase().includes(q)) ||
            (r.marca?.toLowerCase().includes(q)) ||
            (r.modelo?.toLowerCase().includes(q)) ||
            (r.motivoBaja?.toLowerCase().includes(q)) ||
            (r.tipoEquipo?.toLowerCase().includes(q))
        const matchTipo = !filtroTipo || r.tipoEquipo === filtroTipo
        return matchBusqueda && matchTipo
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
                            <i className="bi bi-pc-display-horizontal text-brand-500"></i>
                            Baja de Equipos
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 mb-0">Registro de activos tecnológicos dados de baja</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={exportarExcel}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm flex items-center gap-2 transition-colors">
                            <Download size={16} />
                            <span className="hidden sm:inline">Exportar</span>
                        </button>
                        <button onClick={() => setShowCreate(true)}
                            className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-brand-600 transition-colors w-full sm:w-auto justify-center">
                            <i className="bi bi-plus-circle"></i>
                            <span>Nueva Baja</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="bi bi-search text-gray-400"></i>
                        </div>
                        <input type="text" value={busqueda} onChange={e => { setBusqueda(e.target.value); setCurrentPage(1) }}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
                            placeholder="Buscar por equipo, serial, marca o motivo..." />
                    </div>
                    <select value={filtroTipo} onChange={e => { setFiltroTipo(e.target.value); setCurrentPage(1) }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white">
                        <option value="">Todos los tipos</option>
                        {Object.entries(LABEL_TIPO).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-brand-500 mx-auto mb-3"></div>
                        <p>Cargando registros...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-3">ID</th>
                                <th className="p-3">Tipo</th>
                                <th className="p-3">Serial / Marca</th>
                                <th className="p-3">Modelo</th>
                                <th className="p-3">Motivo</th>
                                <th className="p-3">Fecha Baja</th>
                                <th className="p-3">Último Responsable</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {paginados.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <i className="bi bi-info-circle text-4xl text-gray-300 mb-2"></i>
                                            <p>No hay equipos dados de baja registrados.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginados.map(r => (
                                <tr key={r.id} className="hover:bg-brand-50/30 transition-colors">
                                    <td className="p-3 font-medium text-gray-700">#{r.id}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-semibold">
                                            {LABEL_TIPO[r.tipoEquipo] || r.tipoEquipo}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className="font-medium text-sm text-gray-800">{r.serial || <span className="text-gray-400">—</span>}</span>
                                        {r.marca && <span className="text-xs text-gray-500 block">{r.marca}</span>}
                                    </td>
                                    <td className="p-3 text-sm text-gray-600">{r.modelo || <span className="text-gray-400">—</span>}</td>
                                    <td className="p-3 text-sm text-gray-700">{r.motivoBaja}</td>
                                    <td className="p-3 text-sm text-gray-600">{r.fechaBaja}</td>
                                    <td className="p-3 text-sm text-gray-600">
                                        {r.ultimoFuncionario
                                            ? `${r.ultimoFuncionario.nombre} ${r.ultimoFuncionario.apellido}`
                                            : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleEliminar(r.id!)}
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
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">‹</button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i))
                            return (
                                <button key={page} onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border rounded-lg text-sm transition-colors ${currentPage === page ? "bg-brand-500 text-white border-brand-500" : "border-gray-300 hover:bg-gray-50"}`}>
                                    {page}
                                </button>
                            )
                        })}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">›</button>
                    </div>
                </div>
            )}

            {/* Modal Crear */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <FormularioCrearBaja onSuccess={cargar} onClose={() => setShowCreate(false)} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default TablaBajaEquipos
