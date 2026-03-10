"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { createModems } from "../../servicios/modemService"
import { getProveedor_internet } from "../../servicios/ProveedoresService"
import { getFarmacias } from "../../servicios/farmaciaService"

interface IFormularioCrearModemProps {
  onSuccess?: () => void
  onClose?: () => void
}

const FormularioCrearModem: React.FC<IFormularioCrearModemProps> = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [proveedores, setProveedores] = useState<any[]>([])
  const [farmacias, setFarmacias] = useState<any[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)

  const [modem, setModem] = useState<any>({
    marca: "",
    modelo: "",
    numero_serie: "",
    numero: "",
    estado: "DISPONIBLE",
    proveedorInternet: null,
    farmacia: null,
  })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true)

        Swal.fire({
          title: "Cargando datos...",
          html: "Por favor espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })

        // Cargar proveedores y farmacias en paralelo
        const [proveedoresData, farmaciasData] = await Promise.all([getProveedor_internet(), getFarmacias()])

        setProveedores(proveedoresData)
        setFarmacias(farmaciasData)

        Swal.close()
      } catch (error) {
        console.error("Error al cargar datos:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos necesarios",
        })
      } finally {
        setLoadingData(false)
      }
    }

    cargarDatos()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "proveedor_id") {
      const proveedorSeleccionado = proveedores.find((p) => p.id === Number(value))
      setModem((prev: any) => ({
        ...prev,
        proveedorInternet: proveedorSeleccionado,
      }))
    } else if (name === "farmacia_id") {
      if (value === "") {
        setModem((prev: any) => ({
          ...prev,
          farmacia: null,
        }))
      } else {
        const farmaciaSeleccionada = farmacias.find((f) => f.id === Number(value))
        setModem((prev: any) => ({
          ...prev,
          farmacia: farmaciaSeleccionada,
        }))
      }
    } else if (name === "numero") {
      setModem((prev: any) => ({
        ...prev,
        [name]: value ? Number(value) : null,
      }))
    } else {
      setModem((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!modem.marca || !modem.modelo || !modem.numero_serie || !modem.proveedorInternet) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor complete todos los campos obligatorios",
      })
      return
    }

    try {
      setLoading(true)

      Swal.fire({
        title: "Creando módem...",
        html: "Por favor espera un momento.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar el objeto para enviar al backend
      const modemData = {
        marca: modem.marca,
        modelo: modem.modelo,
        numero_serie: modem.numero_serie,
        numero: modem.numero || null,
        estado: modem.estado,
        proveedorInternet: {
          id: modem.proveedorInternet.id,
        },
        farmacia: modem.farmacia
          ? {
            id: modem.farmacia.id,
          }
          : null,
        isDeleted: false,
      }



      await createModems(modemData)

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Módem creado correctamente",
      })

      // Limpiar el formulario
      setModem({
        marca: "",
        modelo: "",
        numero_serie: "",
        numero: "",
        estado: "DISPONIBLE",
        proveedorInternet: null,
        farmacia: null,
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error al crear:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el módem",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Marca <span className="text-orange-500">*</span></label>
            <input
              type="text"
              name="marca"
              value={modem.marca}
              onChange={handleInputChange}
              required
              placeholder="Ej: Huawei, ZTE, TP-Link"
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Modelo <span className="text-orange-500">*</span></label>
            <input
              type="text"
              name="modelo"
              value={modem.modelo}
              onChange={handleInputChange}
              required
              placeholder="Ej: B315s-22, MF286R"
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Número de Serie <span className="text-orange-500">*</span></label>
            <input
              type="text"
              name="numero_serie"
              value={modem.numero_serie}
              onChange={handleInputChange}
              required
              placeholder="Número de serie único"
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 font-mono"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Número de Teléfono</label>
            <input
              type="number"
              name="numero"
              value={modem.numero}
              onChange={handleInputChange}
              placeholder="Número de línea telefónica"
              min="0"
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Proveedor de Internet <span className="text-orange-500">*</span></label>
            <div className="relative">
              <select
                name="proveedor_id"
                value={modem.proveedorInternet?.id || ""}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Seleccione un proveedor...</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="bi bi-chevron-down text-xs"></i>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Estado <span className="text-orange-500">*</span></label>
            <div className="relative">
              <select
                name="estado"
                value={modem.estado}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer font-medium"
              >
                <option value="DISPONIBLE" className="text-emerald-600 font-medium">DISPONIBLE</option>
                <option value="EN USO" className="text-blue-600 font-medium">EN USO</option>
                <option value="MANTENIMIENTO" className="text-orange-600 font-medium">MANTENIMIENTO</option>
                <option value="DAÑADO" className="text-red-600 font-medium">DAÑADO</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="bi bi-chevron-down text-xs"></i>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Ubicación (Farmacia)</label>
            <div className="relative">
              <select
                name="farmacia_id"
                value={modem.farmacia?.id || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Sin asignar (Mantener en inventario)</option>
                {farmacias.map((farmacia) => (
                  <option key={farmacia.id} value={farmacia.id}>
                    {farmacia.nombre} - {farmacia.ciudad?.nombre_ciudad}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="bi bi-chevron-down text-xs"></i>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Opcional: Seleccione una farmacia si el módem ya se encuentra desplegado en una sede.
            </p>
          </div>
        </div>

        {modem.proveedorInternet && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl">
            <h6 className="text-sm font-semibold text-orange-800 mb-3 flex items-center">
              <i className="bi bi-info-circle mr-2"></i>
              Información del Proveedor Seleccionado
            </h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Nombre</span>
                <span className="font-medium text-gray-900">{modem.proveedorInternet.nombre}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Contacto</span>
                <span className="font-medium text-gray-900">{modem.proveedorInternet.nombre_contacto || 'No disponible'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose()
            }}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            <i className="bi bi-x-circle mr-2"></i>
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-transparent bg-orange-500 text-white hover:bg-orange-600 font-medium text-sm transition-all shadow-sm shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle mr-2"></i>
                Crear Módem
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioCrearModem
