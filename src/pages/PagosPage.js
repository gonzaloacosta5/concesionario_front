import React, { useState, useEffect } from "react";
import { getPedidos, getPagos } from "../services/api";
import PagoForm from "../components/PagoForm";
import {
  Card,
  Button,
  Select,
  Badge,
  Alert,
  LoadingSpinner,
  PageHeader,
} from "../components/ui/UIComponents";

export default function PagosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedidoId, setSelectedPedidoId] = useState("");
  const [pagos, setPagos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch (err) {
      setError("Error al cargar pedidos: " + err.message);
    }
  };

  const handlePedidoSelect = async (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    setShowForm(false);
    setPagos([]);

    if (pedidoId) {
      await loadPagos(pedidoId);
    }
  };

  const loadPagos = async (pedidoId) => {
    setLoading(true);
    setError("");
    try {
      const data = await getPagos(pedidoId);
      setPagos(data);
    } catch (err) {
      setError("Error al cargar pagos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePagoCreated = () => {
    loadPagos(selectedPedidoId);
    setShowForm(false);
  };

  const selectedPedido = pedidos.find(
    (p) => p.id === parseInt(selectedPedidoId)
  );

  const getTipoPagoBadgeVariant = (tipo) => {
    const variants = {
      CONTADO: "success",
      TRANSFERENCIA: "info",
      TARJETA: "warning",
    };
    return variants[tipo] || "default";
  };

  return (
    <Card>
      <PageHeader title="Gestión de Pagos" />

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-6">
        <Select
          label="Seleccionar Pedido"
          value={selectedPedidoId}
          onChange={(e) => handlePedidoSelect(e.target.value)}
        >
          <option value="">-- Selecciona un pedido --</option>
          {pedidos.map((pedido) => (
            <option key={pedido.id} value={pedido.id}>
              {pedido.numeroPedido} - Cliente: {pedido.cliente?.nombre}{" "}
              {pedido.cliente?.apellido} - Total: ${pedido.total} - Estado:{" "}
              {pedido.formaPago}
            </option>
          ))}
        </Select>
      </div>

      {selectedPedido && (
        <Card className="mb-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-lg mb-4 text-blue-900">
            Información del Pedido
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Número de Pedido</p>
              <p className="font-semibold">{selectedPedido.numeroPedido}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="font-semibold">
                {selectedPedido.cliente?.nombre}{" "}
                {selectedPedido.cliente?.apellido}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vehículo</p>
              <p className="font-semibold">
                {selectedPedido.vehiculo?.marca}{" "}
                {selectedPedido.vehiculo?.modelo}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-semibold text-xl text-green-600">
                ${selectedPedido.total}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant={pagos.length > 0 ? "secondary" : "primary"}
              onClick={() => setShowForm(!showForm)}
              disabled={pagos.length > 0}
            >
              {pagos.length > 0 ? "✓ Pago ya registrado" : "💳 Registrar Pago"}
            </Button>
          </div>
        </Card>
      )}

      {showForm && selectedPedidoId && (
        <Card className="mb-6 bg-gray-50">
          <h3 className="font-semibold text-lg mb-4">Registrar Nuevo Pago</h3>
          <PagoForm pedidoId={selectedPedidoId} onSuccess={handlePagoCreated} />
        </Card>
      )}

      {loading && <LoadingSpinner />}

      {pagos.length > 0 && (
        <Card>
          <h3 className="font-semibold text-lg mb-4">Pagos Registrados</h3>
          <div className="space-y-3">
            {pagos.map((pago) => (
              <div key={pago.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant={getTipoPagoBadgeVariant(pago.tipoPago)}>
                      {pago.tipoPago || "N/A"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {pago.descuento !== undefined && (
                      <span>Descuento: {pago.descuento}%</span>
                    )}
                    {pago.banco && <span>Banco: {pago.banco}</span>}
                    {pago.numeroTarjeta && (
                      <span>Tarjeta: ***{pago.numeroTarjeta.slice(-4)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Card>
  );
}
