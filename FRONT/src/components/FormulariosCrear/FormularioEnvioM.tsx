"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createEnvio } from "../../servicios/EnvioModemService"
import { getModems } from "../../servicios/modemService"
import Swal from "sweetalert2"

interface IModem {
  id: number
  marca: string
  modelo: string
  numeroSerie: string
  estado: string
  numero: number
  proveedorInternet: {
    id: number
    nombre: string
  }
}

interface IEnvio {
  farmacia: any
  modemPrincipal: any
  modemSecundario?: any
  fechaEnvio: string
  costoEnvio: number
  estadoEnvio: string
}

interface Props {
  farmacia: any
  onClose?: () => void
}

const FormularioEnvioM: React.FC<Props> = ({ farmacia, onClose }) => {
  const [modems, setModems] = useState<IModem[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isHovered2, setIsHovered2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingModems, setLoadingModems] = useState(true)

  const [envio, setEnvio] = useState<IEnvio>({
    farmacia: farmacia,
    modemPrincipal: null,
    fechaEnvio: new Date().toISOString().split("T")[0],
    costoEnvio: 0,
    estadoEnvio: "PENDIENTE",
  })

  useEffect(() => {
    const cargarModems = async () => {
      try {
        setLoadingModems(true)
        console.log("Cargando modems disponibles...")

        const modemsData = await getModems()
        console.log("Modems obtenidos:", modemsData)

        // Filtrar solo modems disponibles
        const modemsDisponibles = modemsData.filter((modem: IModem) => modem.estado === "DISPONIBLE")
        console.log("Modems disponibles:", modemsDisponibles)

        setModems(modemsDisponibles)

        if (modemsDisponibles.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "Sin modems disponibles",
            text: "No hay modems disponibles para envío en este momento.",
          })
        }
      } catch (error) {
        console.error("Error al cargar modems:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cargar los modems disponibles",
        })
      } finally {
        setLoadingModems(false)
      }
    }

    cargarModems()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "modemPrincipal") {
      const modemSeleccionado = modems.find((m) => m.id === Number(value))
      setEnvio((prev) => ({
        ...prev,
        modemPrincipal: modemSeleccionado || null,
      }))
    } else if (name === "modemSecundario") {
      if (value === "") {
        setEnvio((prev) => ({
          ...prev,
          modemSecundario: null,
        }))
      } else {
        const modemSeleccionado = modems.find((m) => m.id === Number(value))
        setEnvio((prev) => ({
          ...prev,
          modemSecundario: modemSeleccionado || null,
        }))
      }
    } else if (name === "costoEnvio") {
      setEnvio((prev) => ({
        ...prev,
        [name]: Number(value),
      }))
    } else {
      setEnvio((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!envio.modemPrincipal) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe seleccionar al menos un módem principal",
      })
      return
    }

    if (envio.costoEnvio < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El costo de envío no puede ser negativo",
      })
      return
    }

    try {
      setLoading(true)
      Swal.fire({
        title: "Creando envío...",
        text: "Por favor espere",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Preparar datos para enviar
      const envioData = {
        farmacia: {
          id: farmacia.id,
        },
        modemPrincipal: {
          id: envio.modemPrincipal.id,
        },
        modemSecundario: envio.modemSecundario
          ? {
            id: envio.modemSecundario.id,
          }
          : null,
        fechaEnvio: new Date(envio.fechaEnvio).toISOString(),
        costoEnvio: envio.costoEnvio,
        estadoEnvio: envio.estadoEnvio,
      }



      // Crear el envío (el backend se encarga de actualizar los estados de los modems)
      const envioCreado = await createEnvio(envioData)

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Envío creado correctamente y módem(s) actualizado(s) a 'EN USO'",
        timer: 2000,
      })

      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error("Error al crear el envío:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el envío. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingModems) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="sr-only">Cargando modems...</span>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg text-gray-800">
      <form onSubmit={handleSubmit}>
        {/* Información de la farmacia */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h5 className="m-0 font-semibold text-gray-800 flex items-center text-lg">
              <i className="bi bi-building mr-2 text-orange-500"></i>
              Farmacia Destino
            </h5>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={farmacia?.nombre || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={farmacia?.ciudad?.nombreCiudad || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
              <div className="md:col-span-2 mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={farmacia?.direccion || ""}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selección de modems */}
        <div className="mb-4">
          <div className="mb-3">
            <label htmlFor="modemPrincipal" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <i className="bi bi-router mr-2 text-orange-500"></i>
              Módem Principal*
            </label>
            <select
              name="modemPrincipal"
              value={envio.modemPrincipal?.id || ""}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="">Seleccione un módem</option>
              {modems.map((modem) => (
                <option key={modem.id} value={modem.id}>
                  {modem.marca} - {modem.modelo} | Serie: {modem.numeroSerie} | {modem.proveedorInternet?.nombre} |
                  Tel: {modem.numero}
                </option>
              ))}
            </select>
            {modems.length === 0 && (
              <p className="mt-1 text-sm text-yellow-600 flex items-center">
                <i className="bi bi-exclamation-triangle mr-1"></i>
                No hay modems disponibles
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-3">
            <label htmlFor="modemSecundario" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <i className="bi bi-router mr-2 text-gray-400"></i>
              Módem Secundario (Opcional)
            </label>
            <select
              name="modemSecundario"
              value={envio.modemSecundario?.id || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="">Ninguno</option>
              {modems
                .filter((modem) => modem.id !== envio.modemPrincipal?.id)
                .map((modem) => (
                  <option key={modem.id} value={modem.id}>
                    {modem.marca} - {modem.modelo} | Serie: {modem.numeroSerie} | {modem.proveedorInternet?.nombre} |
                    Tel: {modem.numero}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Información del envío */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <i className="bi bi-calendar mr-2 text-orange-500"></i>
              Fecha de Envío*
            </label>
            <input
              type="date"
              name="fechaEnvio"
              value={envio.fechaEnvio}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <i className="bi bi-currency-dollar mr-2 text-orange-500"></i>
              Costo de Envío*
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="costoEnvio"
                value={envio.costoEnvio}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <i className="bi bi-truck mr-2 text-orange-500"></i>
              Estado del Envío*
            </label>
            <select
              name="estadoEnvio"
              value={envio.estadoEnvio}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="EN CAMINO">EN CAMINO</option>
              <option value="ENTREGADO">ENTREGADO</option>
              <option value="DEVUELTO">DEVUELTO</option>
            </select>
          </div>
        </div>

        {/* Resumen del envío */}
        {envio.modemPrincipal && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
            <h4 className="flex items-center text-lg font-medium mb-3 text-blue-900">
              <i className="bi bi-info-circle mr-2"></i>
              Resumen del Envío
            </h4>
            <p className="mb-2">
              <strong className="font-semibold">Destino:</strong> {farmacia?.nombre} - {farmacia?.ciudad?.nombreCiudad}
            </p>
            <p className="mb-2">
              <strong className="font-semibold">Módem Principal:</strong> {envio.modemPrincipal.marca} {envio.modemPrincipal.modelo} (Serie:{" "}
              {envio.modemPrincipal.numeroSerie})
            </p>
            {envio.modemSecundario && (
              <p className="mb-2">
                <strong className="font-semibold">Módem Secundario:</strong> {envio.modemSecundario.marca} {envio.modemSecundario.modelo} (Serie:{" "}
                {envio.modemSecundario.numeroSerie})
              </p>
            )}
            <p className="mb-0">
              <strong className="font-semibold">Costo Total:</strong> ${envio.costoEnvio.toLocaleString("es-CO")}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-3 mt-6">
          <button
            type="submit"
            disabled={loading || modems.length === 0}
            className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors
              ${loading || modems.length === 0 ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'}
            `}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <i className="bi bi-send mr-2"></i>
                CREAR ENVÍO
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md shadow-sm text-sm font-medium hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <i className="bi bi-x-circle mr-2"></i>
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioEnvioM
