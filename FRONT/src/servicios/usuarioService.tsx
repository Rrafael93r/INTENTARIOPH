import axios from "axios"

const API_URL = "http://localhost:8080/api/users"

export const getUserByUsername = async (username: string) => {
  try {
    const response = await axios.get(`${API_URL}/username/${username}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching user with username ${username}:`, error)
    throw error
  }
}

export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(API_URL, userData)
    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const updateUser = async (id: number, userData: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, userData)
    return response.data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}
