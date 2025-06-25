import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // Esto incluye cookies en todas las peticiones
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
