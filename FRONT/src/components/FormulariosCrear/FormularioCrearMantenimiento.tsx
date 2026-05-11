"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { createMantenimiento } from "../../servicios/mantenimientoService"
import { getFuncionarios } from "../../servicios/funcionariosService"

interface Props {
    onSuccess?: () => void
    onClose?: () => void
}

const TIPOS_EQUIPO = [
    { value: "PORTATIL", label: "Portátil" },
    { value: "PC_ESCRITORIO", label: "PC Escritorio" },
    { value: "MONITOR", label: "Monitor" },
    { value: "IMPRESORA", label: "Impresora" },
    { value: "IMPRESORA_POS", label: "Impresora POS" },
    { value: "PERIFERICO", label: "Periférico" },
    { value: "DIADEMA", label: "Diadema" },
];

const TIPOS_MANTENIMIENTO = [
    { value: "PREVENTIVO", label: "Preventivo" },
    { value: "CORRECTIVO", label: "Correctivo" },
    { value: "REPARACION", label: "Reparación" },
];

const RESULTADOS = [
    { value: "EXITOSO", label: "Exitoso" },
    { value: "PARCIAL", label: "Parcial" },
    { value: "FALLIDO", label: "Fallido" },
];

const FormularioCrearMantenimiento: React.FC<Props> = ({ onSuccess, onClose }) => {
    const [loading, setLoading] = useState(false)
    const [tecnicos, setTecnicos] = useState<any[]>([])
    const [form, setForm] = useState({
        tipoEquipo: "",
        equipoId: "",
        tipoMantenimiento: "",
        descripcion: "",
        fecha: new Date().toISOString().split("T")[0],
        tecnico: null as any,
        costo: "",
        resultado: "EXITOSO",
        observaciones: "",
    })

    useEffect(() => {
        getFuncionarios().then(setTecnicos).catch(console.error)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === "tecnico_id") {
            const t = tecnicos.find((f) => f.id === Number(value))
            setForm((prev) => ({ ...prev, tecnico: t || null }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.tipoEquipo || !form.equipoId || !form.tipoMantenimiento || !form.descripcion || !form.fecha) {
            Swal.fire({ icon: "warning", title: "Campos requeridos", text: "Completa todos los campos obligatorios." })
            return
        }
        setLoading(true)
        try {
            await createMantenimiento({
                tipoEquipo: form.tipoEquipo,
                equipoId: Number(form.equipoId),
                tipoMantenimiento: form.tipoMantenimiento,
                descripcion: form.descripcion,
                fecha: form.fecha,
                tecnico: form.tecnico,
                costo: form.costo ? Number(form.costo) : undefined,
                resultado: form.resultado,
                observaciones: form.observaciones || undefined,
            })
            Swal.fire({ icon: "success", title: "Mantenimiento registrado", timer: 1500, showConfirmButton: false })
            onSuccess?.()
            onClose?.()
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo registrar el mantenimiento." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <h5 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <i className="bi bi-tools text-orange-500"></i>
                Registrar Mantenimiento / Reparación
            </h5>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de equipo *</label>
                        <select name="tipoEquipo" value={form.tipoEquipo} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500">
                            <option value="">Seleccionar...</option>
                            {TIPOS_EQUIPO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID del equipo *</label>
                        <input type="number" name="equipoId" value={form.equipoId} onChange={handleChange} required min={1}
                            placeholder="Ej: 12"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de mantenimiento *</label>
                        <select name="tipoMantenimiento" value={form.tipoMantenimiento} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500">
                            <option value="">Seleccionar...</option>
                            {TIPOS_MANTENIMIENTO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Técnico responsable</label>
                        <select name="tecnico_id" onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500">
                            <option value="">Sin asignar</option>
                            {tecnicos.map(t => (
                                <option key={t.id} value={t.id}>{t.nombre} {t.apellido}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
                        <select name="resultado" value={form.resultado} onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500">
                            {RESULTADOS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Costo (COP)</label>
                        <input type="number" name="costo" value={form.costo} onChange={handleChange} min={0} step="0.01"
                            placeholder="Opcional"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required rows={3}
                        placeholder="Describe el trabajo realizado..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 resize-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={2}
                        placeholder="Notas adicionales (opcional)..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 resize-none" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading}
                        className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors">
                        {loading ? "Guardando..." : "Registrar"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioCrearMantenimiento
