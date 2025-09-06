import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CircularProgress } from '@mui/material'
import ReactModal from 'react-modal'

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
  const [buscando, setBuscando] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)

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

  const filtrarUsuarios = useCallback(
    (query) => {
      setBuscando(true)

      setTimeout(() => {
        if (query.trim() === '') {
          setFiltrados(usuarios)
        } else {
          const q = query.trim().toLowerCase()
          const resultados = usuarios.filter((u) =>
            [u.nombre, u.apellidos, u.perfil, u.intereses, u.correo].some(
              (campo) => String(campo).toLowerCase().includes(q)
            )
          )
          setFiltrados(resultados)
        }
        setBuscando(false)
      }, 1000) // Simula un retardo de búsqueda
    },
    [usuarios]
  )

  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setUsuarioSeleccionado(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Buscador Dinámico de Usuarios
      </h1>

      <SearchInput onSearch={filtrarUsuarios} />

      {loading && <p className="mt-6 text-center">Cargando usuarios…</p>}

      {error && !loading && (
        <div className="mt-6 mx-auto max-w-md rounded bg-red-50 border border-red-200 p-3 text-red-700">
          {error} — verifica que el API esté arriba en{' '}
          <code>{API_URL}/usuarios</code>.
          <button className="ml-2 underline" onClick={obtenerUsuarios}>
            Reintentar
          </button>
        </div>
      )}

      {buscando && !loading && !error && (
        <div className="mt-6 text-center">
          <CircularProgress size={32} />
          <span className="ml-2 text-gray-600">Buscando…</span>
        </div>
      )}

      {!loading && !error && filtrados.length === 0 && (
        <p className="mt-6 text-center text-gray-600">
          Sin resultados para tu búsqueda.
        </p>
      )}

      {!buscando && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4 mt-6"
          role="grid"
        >
          {filtrados.map((usuario) => (
            <div onClick={() => abrirModal(usuario)} key={usuario.id}>
              <UserCard usuario={usuario} />
            </div>
          ))}
        </div>
      )}

      <ReactModal
        isOpen={modalAbierto}
        onRequestClose={cerrarModal}
        contentLabel="Detalles del Usuario"
        className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center"
      >
        {usuarioSeleccionado && (
          <div>
            <img
            className='w-32 h-32 rounded-full mx-auto mb-4'
              src={usuarioSeleccionado.foto}
              alt={usuarioSeleccionado.nombre}
            />
            <h2 className="text-2xl font-bold mb-4">
              {usuarioSeleccionado.nombre}
            </h2>
            <p className="mb-2">
              <strong>Apellidos:</strong> {usuarioSeleccionado.apellidos}
            </p>
            <p className="mb-2">
              <strong>Perfil:</strong> {usuarioSeleccionado.perfil}
            </p>
            <p className="mb-2">
              <strong>Intereses:</strong>
              {usuarioSeleccionado.intereses}
            </p>
            <p className="mb-2">
              <strong>Correo:</strong> {usuarioSeleccionado.correo}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={cerrarModal}
            >
              Cerrar
            </button>
          </div>
        )}
      </ReactModal>

      <ToastContainer position="bottom-right" />
    </div>
  )
}