"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { getProveedorInternetById, updateProveedorInternet } from "../../servicios/ProveedoresService"

interface IFormularioEditarPProps {
  proveedorId: number
  onClose: () => void
  onSuccess: () => void
}

const FormularioEditarP: React.FC<IFormularioEditarPProps> = ({ proveedorId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true)
  const [proveedor, setProveedor] = useState<any>({
    id: "",
    nombre: "",
    nit: "",
    nombreContacto: "",
    numeroContacto: "",
    correo: "",
    estado: "",
    fechaContratacion: "",
    observacion: "",
  })
  const [error, setError] = useState<string | null>(null)

  // Función para formatear fecha
  const formatearFecha = (fechaISO: string | null | undefined): string => {
    if (!fechaISO) return ""
    try {
      const fecha = new Date(fechaISO)
      return fecha.toISOString().split("T")[0]
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return ""
    }
  }

  useEffect(() => {
    const cargarProveedor = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!proveedorId) {
          throw new Error("ID no proporcionado")
        }

        Swal.fire({
          title: "Cargando proveedor...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        const data = await getProveedorInternetById(proveedorId)

        if (!data) {
          throw new Error("No se encontró el proveedor")
        }

        // Formatear las fechas antes de establecer el estado
        const proveedorFormateado = {
          ...data,
          fechaContratacion: formatearFecha(data.fechaContratacion),
        }

        setProveedor(proveedorFormateado)
      } catch (error) {
        console.error("Error al cargar el proveedor:", error)
        setError(error instanceof Error ? error.message : "Error al cargar el proveedor")
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del proveedor",
        })
      } finally {
        setLoading(false)
        Swal.close()
      }
    }

    cargarProveedor()
  }, [proveedorId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProveedor((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!proveedor.nombre || !proveedor.nit || !proveedor.nombreContacto || !proveedor.correo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos obligatorios",
      })
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(proveedor.correo)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor ingrese un correo electrónico válido",
      })
      return
    }

    try {
      setLoading(true)

      Swal.fire({
        title: "Actualizando proveedor...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar datos para enviar
      const proveedorData = {
        ...proveedor,
        fechaContratacion: proveedor.fechaContratacion ? new Date(proveedor.fechaContratacion).toISOString() : null,
        nit: Number(proveedor.nit),
        numeroContacto: Number(proveedor.numeroContacto),
      }

      await updateProveedorInternet(proveedorId, proveedorData)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Proveedor actualizado correctamente",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el proveedor. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 text-sm text-gray-500 mb-2">
          <strong>ID G-TIC:</strong> {proveedor.id}
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
          <input
            type="text"
            name="nombre"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            value={proveedor.nombre}
            onChange={handleInputChange}
            required
            placeholder="Nombre del proveedor"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">NIT*</label>
          <input
            type="number"
            name="nit"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            value={proveedor.nit}
            onChange={handleInputChange}
            required
            min="0"
            max="99999999999"
            placeholder="Número de identificación tributaria"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la persona encargada*</label>
          <input
            type="text"
            name="nombreContacto"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            value={proveedor.nombreContacto}
            onChange={handleInputChange}
            required
            placeholder="Nombre del contacto principal"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de contacto*</label>
          <input
            type="number"
            name="numeroContacto"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            value={proveedor.numeroContacto}
            onChange={handleInputChange}
            required
            min="0"
            max="99999999999"
            placeholder="+57"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo*</label>
          <input
            type="email"
            name="correo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            value={proveedor.correo}
            onChange={handleInputChange}
            required
            placeholder="ejemplo@gmail.com"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
          <select
            name="estado"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            value={proveedor.estado}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione un estado</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="NO ACTIVO">NO ACTIVO</option>
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de contratación</label>
          <input
            type="date"
            name="fechaContratacion"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            value={proveedor.fechaContratacion}
            onChange={handleInputChange}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <textarea
            name="observacion"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            rows={3}
            value={proveedor.observacion}
            onChange={handleInputChange}
            placeholder="Observaciones adicionales..."
          />
        </div>

        <div className="md:col-span-2 flex justify-center gap-4 mt-4">
          <button
            type="submit"
            className="flex items-center justify-center px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Actualizando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle mr-2"></i>
                Actualizar Proveedor
              </>
            )}
          </button>
          <button
            type="button"
            className="flex items-center justify-center px-6 py-2.5 border-2 border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-50 focus:ring-4 focus:ring-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            <i className="bi bi-x-circle mr-2"></i>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioEditarP
