import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPedidoDetail,
  getHistorial,
  putPedidoEstado,
} from "../services/api";

export default function PedidoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Estados válidos del pedido
  const ESTADOS_PEDIDO = [
    "VENTAS",
    "COBRANZAS",
    "IMPUESTOS",
    "EMBARQUE",
    "LOGISTICA",
    "ENTREGA",
  ];

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  const cargarDetalle = async () => {
    try {
      setLoading(true);
      const pedidoData = await getPedidoDetail(id);
      setPedido(pedidoData);
      await cargarHistorial();
    } catch (err) {
      setError("Error al cargar el pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorial = async () => {
    try {
      const hist = await getHistorial(id);
      setHistorial(hist);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    }
  };

  const avanzarEstado = async () => {
    if (!nuevoEstado) {
      setError("Debe seleccionar un estado");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await putPedidoEstado(id, nuevoEstado);
      setMensaje("Estado actualizado correctamente");
      setNuevoEstado("");
      await cargarDetalle();
    } catch (err) {
      setError("Error al actualizar estado: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener el estado actual (el más reciente del historial)
  const estadoActual =
    historial.length > 0 ? historial[historial.length - 1].estado : "VENTAS";

  // Obtener el índice del estado actual
  const indiceEstadoActual = ESTADOS_PEDIDO.indexOf(estadoActual);

  // Estados disponibles (solo los siguientes al actual)
  const estadosDisponibles = ESTADOS_PEDIDO.slice(indiceEstadoActual + 1);

  if (loading && !pedido) {
    return <div className="card">Cargando...</div>;
  }

  if (error && !pedido) {
    return <div className="card text-red-600">{error}</div>;
  }

  return (
    <div className="card">
      <button
        onClick={() => navigate("/pedidos")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Volver a Pedidos
      </button>

      <h2 className="text-2xl font-bold mb-4">Detalle del Pedido #{id}</h2>

      {pedido && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <p>
            <strong>Número de Pedido:</strong> {pedido.numeroPedido}
          </p>
          <p>
            <strong>Fecha de Creación:</strong>{" "}
            {new Date(pedido.fechaCreacion).toLocaleString()}
          </p>
          <p>
            <strong>Total:</strong> ${pedido.total}
          </p>
          <p>
            <strong>Forma de Pago:</strong> {pedido.formaPago}
          </p>
          <p>
            <strong>Configuración Extra:</strong>{" "}
            {pedido.configuracionExtra || "N/A"}
          </p>
          <p>
            <strong>Estado Actual:</strong>{" "}
            <span className="font-bold text-blue-600">{estadoActual}</span>
          </p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Cambiar Estado</h3>

        {estadosDisponibles.length > 0 ? (
          <div className="flex gap-2">
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="border p-2 rounded flex-1"
              disabled={loading}
            >
              <option value="">-- Seleccionar nuevo estado --</option>
              {estadosDisponibles.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            <button
              onClick={avanzarEstado}
              disabled={loading || !nuevoEstado}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
            >
              {loading ? "Actualizando..." : "Avanzar Estado"}
            </button>
          </div>
        ) : (
          <p className="text-gray-600">
            Este pedido ya está en el estado final (ENTREGA)
          </p>
        )}

        {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Historial de Estados</h3>
        {historial.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {historial.map((h, index) => (
              <li key={h.id || index} className="text-gray-700">
                <strong>{h.estado}</strong> -{" "}
                {new Date(h.fechaCambio).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No hay historial de estados aún</p>
        )}
      </div>
    </div>
  );
}
