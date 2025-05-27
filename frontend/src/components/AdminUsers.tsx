import React, { useEffect, useState } from 'react';

type Usuario = {
  user_id: number;
  user_name: string;
  user_gmail: string;
  rol: string;
};

type ObtenerUsuariosResponse = {
  success: boolean;
  data: Usuario[];
  message?: string;
};

type EliminarUsuarioResponse = {
  success: boolean;
  message?: string;
};

const AdminUsers: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const res = await window.electron.obtenerUsuarios() as ObtenerUsuariosResponse;

      if (res.success && Array.isArray(res.data)) {
        setUsuarios(res.data);
        setError('');
      } else {
        setError(res.message || 'Error al obtener los usuarios');
        setUsuarios([]);
      }
    } catch (e) {
      console.error(e);
      setError('Error inesperado al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  const eliminarUsuario = async (userId: number) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmar) return;

    try {
      const res = await window.electron.eliminarUsuario(userId) as EliminarUsuarioResponse;

      if (res.success) {
        setMensaje('Usuario eliminado correctamente');
        setError('');
        cargarUsuarios();
      } else {
        setError(res.message || 'No se pudo eliminar el usuario');
        setMensaje('');
      }
    } catch (e) {
      console.error(e);
      setError('Error inesperado al eliminar usuario');
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      {mensaje && <p className="text-green-600 font-semibold mb-2">{mensaje}</p>}
      {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}

      {cargando ? (
        <p className="text-gray-700">Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Correo</th>
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={usuario.user_id} className="hover:bg-gray-50 border-t">
                    <td className="px-4 py-2">{usuario.user_name}</td>
                    <td className="px-4 py-2">{usuario.user_gmail}</td>
                    <td className="px-4 py-2 capitalize">{usuario.rol}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => eliminarUsuario(usuario.user_id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
