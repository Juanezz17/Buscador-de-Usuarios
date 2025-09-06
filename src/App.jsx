import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Si tus archivos están en src/components mantén estas rutas;
// de lo contrario usa './SearchInput' y './UserCard'
import SearchInput from './components/SearchInput'
import UserCard from './components/UserCard'

const API_URL = import.meta.env.VITE_API_URL 

export default function App() {
  const [usuarios, setUsuarios] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const obtenerUsuarios = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get(`${API_URL}/usuarios`)
      setUsuarios(data)
      setFiltrados(data)
      console.log(data)
    } catch (err) {
      console.error(err)
      setError('Error al cargar usuarios')
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    obtenerUsuarios()
  }, [obtenerUsuarios])

  const filtrarUsuarios = useCallback((query) => {
    const q = query.trim().toLowerCase()
    const resultados = usuarios.filter((u) =>
      [u.nombre, u.apellidos, u.perfil, u.intereses, u.correo]
        .some((campo) => String(campo).toLowerCase().includes(q))
    )
    setFiltrados(resultados)
  }, [usuarios])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Buscador Dinámico de Usuarios
      </h1>

      <SearchInput onSearch={filtrarUsuarios} />

      {loading && <p className="mt-6 text-center">Cargando usuarios…</p>}

      {error && !loading && (
        <div className="mt-6 mx-auto max-w-md rounded bg-red-50 border border-red-200 p-3 text-red-700">
          {error} — verifica que el API esté arriba en <code>{API_URL}/usuarios</code>.
          <button className="ml-2 underline" onClick={obtenerUsuarios}>Reintentar</button>
        </div>
      )}

      {!loading && !error && filtrados.length === 0 && (
        <p className="mt-6 text-center text-gray-600">Sin resultados para tu búsqueda.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4 mt-6">
        {filtrados.map((usuario) => (
          <UserCard key={usuario.id} usuario={usuario} />
        ))}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  )
}