import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClientes, getVehiculos } from "../services/api";
import { Input, Select, Button, Alert } from "./ui/UIComponents";

/**
 * Formatea valores numéricos en formato moneda de manera segura.
 * Devuelve "-" si el valor es nulo, undefined o no numérico.
 */
const formatMoney = (value, locale = "es-AR") => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString(locale) : "-";
};

export default function PedidoForm() {
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");
  const [configuracionExtra, setConfiguracionExtra] = useState("");
  const [formaPago, setFormaPago] = useState("CONTADO");
  const [error , setError ] = useState(null);
  const [okMsg , setOkMsg ] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ───────────────────── Carga inicial de datos ──────────────────── */
  useEffect(() => {
    Promise.all([getClientes(), getVehiculos()])
      .then(([clientesData, vehiculosData]) => {
        setClientes(clientesData);
        setVehiculos(vehiculosData);
      })
      .catch((err) => setError(err.message));
  }, []);

  /* ───────────────────── Envío del formulario ────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Evitar envío si faltan datos
    if (!clienteId || !vehiculoId) {
      setError("Debes seleccionar un cliente y un vehículo");
      return;
    }

    setLoading(true);
    setError(null);
    setOkMsg("Vehículo creado correctamente");

    try {
      const numeroPedido = `PED-${Date.now()}`;

      const res = await fetch("http://localhost:8080/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroPedido,
          cliente: { id: Number(clienteId) },
          vehiculo: { id: Number(vehiculoId) },
          configuracionExtra,
          formaPago,
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Error al crear pedido");
      }

      await res.json();
      setOkMsg("Pedido creado correctamente");
      setTimeout(() => navigate("/pedidos"), 1200);
      navigate("/pedidos");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────── Helpers derivados ───────────────────────── */
  const vehiculoSeleccionado = vehiculos.find(
    (v) => v.id === Number(vehiculoId)
  );

  /* ────────────────────────── Render ─────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {okMsg && <Alert type="success">{okMsg}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {/* Selección de cliente */}
      <Select
        label="Cliente"
        value={clienteId}
        onChange={(e) => setClienteId(e.target.value)}
        required
      >
        <option value="">Selecciona un cliente...</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre} {c.apellido} - DNI: {c.documento}
          </option>
        ))}
      </Select>

      {/* Selección de vehículo */}
      <Select
        label="Vehículo"
        value={vehiculoId}
        onChange={(e) => setVehiculoId(e.target.value)}
        required
      >
        <option value="">Selecciona un vehículo...</option>
        {vehiculos.map((v) => (
          <option key={v.id} value={v.id}>
            {v.marca} {v.modelo} ({v.tipo}) - ${formatMoney(v.precioBase)}
          </option>
        ))}
      </Select>

      {/* Resumen del vehículo seleccionado */}
      {vehiculoSeleccionado && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-green-800 mb-2">
            Vehículo seleccionado:
          </p>
          <div className="text-sm text-green-700 space-y-1">
            <p>
              {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}
            </p>
            <p>Color: {vehiculoSeleccionado.color}</p>
            <p>Tipo: {vehiculoSeleccionado.tipo}</p>
            <p>
              Precio base: ${formatMoney(vehiculoSeleccionado.precioBase)}
            </p>
            <p className="font-semibold mt-2">
              El precio final con impuestos se calculará automáticamente
            </p>
          </div>
        </div>
      )}

      {/* Configuración extra */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Configuración Extra (opcional)
        </label>
        <textarea
          value={configuracionExtra}
          onChange={(e) => setConfiguracionExtra(e.target.value)}
          placeholder="Ej: Aire acondicionado, llantas de aleación, sistema de navegación..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          rows="3"
        />
      </div>

      {/* Forma de pago */}
      <Select
        label="Forma de Pago"
        value={formaPago}
        onChange={(e) => setFormaPago(e.target.value)}
      >
        <option value="CONTADO">Contado</option>
        <option value="TRANSFERENCIA">Transferencia</option>
        <option value="TARJETA">Tarjeta</option>
      </Select>

      {/* Acciones */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Creando pedido..." : "Crear Pedido"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/pedidos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
