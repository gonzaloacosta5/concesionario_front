import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClientes, getVehiculos } from "../services/api";
import { Select, Input, Button, Alert } from "./ui/UIComponents";

export default function PedidoForm() {
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");
  const [configuracionExtra, setConfiguracionExtra] = useState("");
  const [formaPago, setFormaPago] = useState("CONTADO");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getClientes(), getVehiculos()])
      .then(([clientesData, vehiculosData]) => {
        setClientes(clientesData);
        setVehiculos(vehiculosData);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const numeroPedido = `PED-${Date.now()}`;

      const res = await fetch("http://localhost:8080/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroPedido: numeroPedido,
          cliente: { id: parseInt(clienteId) },
          vehiculo: { id: parseInt(vehiculoId) },
          configuracionExtra: configuracionExtra,
          formaPago: formaPago,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear pedido");
      }

      await res.json();
      navigate("/pedidos");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const vehiculoSeleccionado = vehiculos.find(
    (v) => v.id === parseInt(vehiculoId)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}

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

      <Select
        label="Vehículo"
        value={vehiculoId}
        onChange={(e) => setVehiculoId(e.target.value)}
        required
      >
        <option value="">Selecciona un vehículo...</option>
        {vehiculos.map((v) => (
          <option key={v.id} value={v.id}>
            {v.marca} {v.modelo} ({v.tipo}) - ${v.precioBase.toLocaleString()}
          </option>
        ))}
      </Select>

      {vehiculoSeleccionado && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-green-800 mb-2">
            Vehículo seleccionado:
          </p>
          <div className="text-sm text-green-700">
            <p>
              {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}
            </p>
            <p>Color: {vehiculoSeleccionado.color}</p>
            <p>Tipo: {vehiculoSeleccionado.tipo}</p>
            <p>
              Precio base: ${vehiculoSeleccionado.precioBase.toLocaleString()}
            </p>
            <p className="font-semibold mt-2">
              El precio final con impuestos se calculará automáticamente
            </p>
          </div>
        </div>
      )}

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

      <Select
        label="Forma de Pago"
        value={formaPago}
        onChange={(e) => setFormaPago(e.target.value)}
      >
        <option value="CONTADO">Contado</option>
        <option value="TRANSFERENCIA">Transferencia</option>
        <option value="TARJETA">Tarjeta</option>
      </Select>

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
