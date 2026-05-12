"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { createBajaEquipo } from "../../servicios/bajaEquipoService"
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
]

const MOTIVOS = [
    "Daño irreparable",
    "Obsolescencia tecnológica",
    "Pérdida o robo",
    "Costo de reparación no viable",
    "Fin de vida útil",
    "Otro",
]

const FormularioCrearBaja: React.FC<Props> = ({ onSuccess, onClose }) => {
    const [loading, setLoading] = useState(false)
    const [funcionarios, setFuncionarios] = useState<any[]>([])
    const [form, setForm] = useState({
        tipoEquipo: "",
        equipoId: "",
        serial: "",
        marca: "",
        modelo: "",
        motivoBaja: "",
        fechaBaja: new Date().toISOString().split("T")[0],
        descripcion: "",
        ultimoFuncionario: null as any,
    })

    useEffect(() => {
        getFuncionarios().then(setFuncionarios).catch(console.error)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === "funcionario_id") {
            const f = funcionarios.find(f => f.id === Number(value))
            setForm(prev => ({ ...prev, ultimoFuncionario: f || null }))
        } else {
            setForm(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.tipoEquipo || !form.motivoBaja || !form.fechaBaja) {
            Swal.fire({ icon: "warning", title: "Campos requeridos", text: "Completa todos los campos obligatorios." })
            return
        }
        setLoading(true)
        try {
            await createBajaEquipo({
                tipoEquipo: form.tipoEquipo,
                equipoId: form.equipoId ? Number(form.equipoId) : undefined,
                serial: form.serial || undefined,
                marca: form.marca || undefined,
                modelo: form.modelo || undefined,
                motivoBaja: form.motivoBaja,
                fechaBaja: form.fechaBaja,
                descripcion: form.descripcion || undefined,
                ultimoFuncionario: form.ultimoFuncionario,
            })
            Swal.fire({ icon: "success", title: "Baja registrada", timer: 1500, showConfirmButton: false })
            onSuccess?.()
            onClose?.()
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo registrar la baja." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <h5 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <i className="bi bi-pc-display-horizontal text-brand-500"></i>
                Registrar Baja de Equipo
            </h5>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de equipo *</label>
                        <select name="tipoEquipo" value={form.tipoEquipo} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500">
                            <option value="">Seleccionar...</option>
                            {TIPOS_EQUIPO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID del equipo</label>
                        <input type="number" name="equipoId" value={form.equipoId} onChange={handleChange} min={1}
                            placeholder="Opcional"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Serial</label>
                        <input type="text" name="serial" value={form.serial} onChange={handleChange}
                            placeholder="Número de serie"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                        <input type="text" name="marca" value={form.marca} onChange={handleChange}
                            placeholder="Ej: Dell, HP, Lenovo"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                        <input type="text" name="modelo" value={form.modelo} onChange={handleChange}
                            placeholder="Ej: Latitude 5420"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de baja *</label>
                        <input type="date" name="fechaBaja" value={form.fechaBaja} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Motivo *</label>
                        <select name="motivoBaja" value={form.motivoBaja} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500">
                            <option value="">Seleccionar...</option>
                            {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Último funcionario asignado</label>
                        <select name="funcionario_id" onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500">
                            <option value="">Sin asignar</option>
                            {funcionarios.map(f => (
                                <option key={f.id} value={f.id}>{f.nombre} {f.apellido}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Observaciones</label>
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
                        placeholder="Detalla el motivo de la baja, estado del equipo, etc."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 resize-none" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading}
                        className="px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 disabled:opacity-50 transition-colors">
                        {loading ? "Guardando..." : "Registrar Baja"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioCrearBaja
