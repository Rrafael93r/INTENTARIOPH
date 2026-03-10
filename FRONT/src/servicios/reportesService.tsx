import axios from "axios"

const API_URL = "http://localhost:8080/api"

export const getReporte = async () => {
  try {
    const response = await axios.get(`${API_URL}/reporte`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getReporteById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/reporte/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const createReporte = async (reporte: any) => {
  try {
    const response = await axios.post(`${API_URL}/reporte`, reporte)
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateReporte = async (id: number, reporteActualizado: any) => {
  try {
    const response = await axios.put(`${API_URL}/reporte/${id}`, reporteActualizado, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteReporte = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/reporte/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
