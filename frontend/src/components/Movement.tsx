import { useEffect, useState, useCallback } from 'react';
import { Reagents } from '../interface/IReagents';
import '../styles/Movement.css';


export default function Movement() {
    const [reactivos, setReactivos] = useState<Reagents[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [reactivoSeleccionado, setReactivoSeleccionado] = useState<Reagents | null>(null);
    const [cantidadGastada, setCantidadGastada] = useState<string>('');
    const [usuarioId] = useState<number>(1); // Simulado

    const cargarReactivos = useCallback(async () => {
        if (!window.electron) return;
        try {
            const disponibles = await window.electron.obtenerReactivosPorEstado('disponible');
            const escogidos = await window.electron.obtenerReactivosPorEstado('escogido');
            setReactivos([...disponibles, ...escogidos]);
        } catch (error) {
            console.error('Error al cargar reactivos:', error);
        }
    }, []);

    useEffect(() => {
        cargarReactivos();
    }, [cargarReactivos]);

    const manejarEscoger = useCallback(async (productId: number) => {
        if (!window.electron) return;
        try {
            await window.electron.marcarReactivoComoEscogido(productId);
            await cargarReactivos();
        } catch (error) {
            console.error('Error al marcar reactivo como escogido:', error);
        }
    }, [cargarReactivos]);

    const manejarAbrirModal = useCallback((reactivo: Reagents) => {
        setReactivoSeleccionado(reactivo);
        setCantidadGastada('');
        setModalAbierto(true);
    }, []);

    const manejarIntroducir = useCallback(async () => {
    if (!reactivoSeleccionado) return;

    const cantidadNumerica = parseFloat(cantidadGastada.replace(',', '.'));
    const cantidadDisponible = parseFloat(
        String(reactivoSeleccionado.reagentQuantity).replace(',', '.')
    );

    console.log('🧪 Valor introducido:', cantidadNumerica);
    console.log('📦 Cantidad disponible:', cantidadDisponible);

    if (
        isNaN(cantidadNumerica) ||
        cantidadNumerica <= 0 ||
        cantidadNumerica > cantidadDisponible
    ) {
        alert('Por favor, introduce una cantidad válida.');
        return;
    }

    if (!window.electron) {
        alert('Funcionalidad no disponible');
        return;
    }

    try {
        console.log('➡ Enviando a Electron:', {
            reagentId: reactivoSeleccionado.reagentId,
            cantidad: cantidadNumerica,
            usuarioId
        });

        await window.electron.introducirReactivo(
            reactivoSeleccionado.reagentId,
            cantidadNumerica,
            usuarioId
        );

        setReactivos((prev) =>
            prev.map((r) =>
                r.reagentId === reactivoSeleccionado.reagentId
                    ? {
                          ...r,
                          reagentQuantity: cantidadDisponible - cantidadNumerica
                      }
                    : r
            )
        );

        alert('Movimiento registrado correctamente');
        setModalAbierto(false);
        setCantidadGastada('');
    } catch (error) {
        console.error('Error al introducir reactivo:', error);
        alert('Error al registrar el movimiento');
    }
}, [reactivoSeleccionado, cantidadGastada, usuarioId]);


    const reactivosFiltrados = reactivos.filter((r) =>
        r.reagentName.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="movement-container">
            <h1 className="title">Gestión de Movimientos de Reactivos</h1>
            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
            />

            <div className="table-wrapper">
                <table className="reactivos-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>CAS</th>
                            <th>Cantidad</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reactivosFiltrados.map((reactivo) => (
                            <tr key={reactivo.reagentId}>
                                <td>{reactivo.reagentName}</td>
                                <td>{reactivo.reagentCas || '—'}</td>
                                <td>{reactivo.reagentQuantity} {reactivo.reagentUnit}</td>
                                <td className="capitalize">{reactivo.reagentState || 'desconocido'}</td>
                                <td>
                                    {reactivo.reagentState === 'disponible' && (
                                        <button
                                            onClick={() => manejarEscoger(reactivo.reagentId)}
                                            className="btn btn-primary"
                                        >
                                            Escoger
                                        </button>
                                    )}
                                    {reactivo.reagentState === 'escogido' && (
                                        <button
                                            onClick={() => manejarAbrirModal(reactivo)}
                                            className="btn btn-success"
                                        >
                                            Introducir
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalAbierto && reactivoSeleccionado && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Reactivo: {reactivoSeleccionado.reagentName}</h2>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={cantidadGastada}
                            onChange={(e) => {
                                const raw = e.target.value;
                                // Solo números, puntos o comas
                                if (/^(\d+([.,]\d*)?)?$/.test(raw)) {
                                    setCantidadGastada(raw);
                                }
                            }}
                            className="modal-input"
                            placeholder="Cantidad gastada (ej. 2.5)"
                        />
                        <div className="modal-buttons">
                            <button onClick={() => setModalAbierto(false)} className="btn btn-cancel">
                                Cancelar
                            </button>
                            <button onClick={manejarIntroducir} className="btn btn-confirm">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
