import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import '../styles/AdminUsers.css';

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
    const [busqueda, setBusqueda] = useState<string>('');

    const cargarUsuarios = async () => {
        if (!window.electron || !window.electron.ObtenerUsuariosExceptoAdmin) {
            setError('Funcionalidad no disponible.');
            setCargando(false);
            return;
        }

        try {
            setCargando(true);
            const res = (await window.electron.ObtenerUsuariosExceptoAdmin()) as ObtenerUsuariosResponse;

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
            setUsuarios([]);
        } finally {
            setCargando(false);
        }
    };

    const eliminarUsuario = async (userId: number) => {
        const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
        if (!confirmar) return;

        if (!window.electron || !window.electron.eliminarUsuario) {
            setError('Funcionalidad no disponible.');
            return;
        }

        try {
            const res = (await window.electron.eliminarUsuario(userId)) as EliminarUsuarioResponse;

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

    const usuariosFiltrados = usuarios.filter((usuario) => {
        const textoBusqueda = busqueda.toLowerCase();
        return (
            usuario.user_name.toLowerCase().includes(textoBusqueda) ||
            usuario.user_gmail.toLowerCase().includes(textoBusqueda) ||
            usuario.rol.toLowerCase().includes(textoBusqueda)
        );
    });

    const exportarCSV = () => {
        if (usuariosFiltrados.length === 0) {
            alert('No hay usuarios para exportar.');
            return;
        }

        const datos = usuariosFiltrados.map((u) => ({
            ID: u.user_id,
            Nombre: u.user_name,
            Correo: u.user_gmail,
            Rol: u.rol,
        }));

        const csv = Papa.unparse(datos);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'usuarios.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="admin-users-container">
            <h2 className="admin-users-title">Gestión de Usuarios</h2>

            {mensaje && <p className="message-success">{mensaje}</p>}
            {error && <p className="message-error">{error}</p>}
            <div className='admincontrol'>
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o rol..."
                    className="search-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    aria-label="Buscar usuarios"
                />

                <button onClick={exportarCSV} className="btn-export">
                    Exportar CSV
                </button>
            </div>
            {cargando ? (
                <p>Cargando usuarios...</p>
            ) : (
                <div className="table-container" role="table" aria-label="Lista de usuarios">
                    <table className="admin-users-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length > 0 ? (
                                usuariosFiltrados.map((usuario) => (
                                    <tr key={usuario.user_id} tabIndex={0}>
                                        <td>{usuario.user_name}</td>
                                        <td>{usuario.user_gmail}</td>
                                        <td className="capitalize">{usuario.rol}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => eliminarUsuario(usuario.user_id)}
                                                className="btn-delete"
                                                aria-label={`Eliminar usuario ${usuario.user_name}`}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-500 py-4">
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
