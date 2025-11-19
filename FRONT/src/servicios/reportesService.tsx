import axios from "axios"

const API_URL = "http://localhost:8080/api"

export const getReporte = async () => {
  try {
    const response = await axios.get(`${API_URL}/reporte`)
    return response.data
  } catch (error) {
    console.error("Error fetching reportes:", error)
    throw error
  }
}

export const getReporteById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/reporte/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching reporte with id ${id}:`, error)
    throw error
  }
}

export const createReporte = async (reporte: any) => {
  try {
    const response = await axios.post(`${API_URL}/reporte`, reporte)
    return response.data
  } catch (error) {
    console.error("Error creating reporte:", error)
    throw error
  }
}

export const updateReporte = async (id: number, reporteActualizado: any) => {
  try {
    console.log("Actualizando reporte con ID:", id)
    console.log("Datos a enviar:", JSON.stringify(reporteActualizado, null, 2))

    const response = await axios.put(`${API_URL}/reporte/${id}`, reporteActualizado, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("Respuesta del servidor:", response.data)
    return response.data
  } catch (error) {
    console.error("Error updating reporte:", error)
    if (axios.isAxiosError(error) && error.response) {
      console.error("Detalles del error:", error.response.data)
      console.error("Status:", error.response.status)
    }
    throw error
  }
}

export const deleteReporte = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/reporte/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting reporte with id ${id}:`, error)
    throw error
  }
}
