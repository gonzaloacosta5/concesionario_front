import React, { useState, useEffect } from "react";
import { getPedidos } from "../services/api";
import PedidoForm from "../components/PedidoForm";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Badge,
  Alert,
  LoadingSpinner,
  PageHeader,
} from "../components/ui/UIComponents";

export default function PedidosPage({ usuario }) {
  const [pedidos, setPedidos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    cargarPedidos();
  }, [usuario]);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPedidos();

      if (usuario?.role === "CLIENTE") {
        const misPedidos = data.filter(
          (p) =>
            p.cliente?.email === usuario.email ||
            p.cliente?.username === usuario.username
        );
        setPedidos(misPedidos);
      } else {
        setPedidos(data);
      }
    } catch (err) {
      setError("Error al cargar pedidos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    await cargarPedidos(); // Recarga automática después de crear
  };

  const getEstadoActual = (pedido) => {
    if (pedido.historial && pedido.historial.length > 0) {
      return pedido.historial[pedido.historial.length - 1].estado;
    }
    return "VENTAS";
  };

  const getEstadoBadgeVariant = (estado) => {
    const variants = {
      VENTAS: "info",
      COBRANZAS: "warning",
      IMPUESTOS: "primary",
      EMBARQUE: "purple",
      LOGISTICA: "default",
      ENTREGA: "success",
    };
    return variants[estado] || "default";
  };

  const getFormaPagoBadgeVariant = (formaPago) => {
    const variants = {
      CONTADO: "success",
      TRANSFERENCIA: "info",
      TARJETA: "warning",
    };
    return variants[formaPago] || "default";
  };

  if (loading) {
    return (
      <Card>
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-500 mt-4">Cargando pedidos...</p>
      </Card>
    );
  }

  return (
    <Card>
      <PageHeader
        title={
          usuario?.role === "CLIENTE" ? "Mis Pedidos" : "Gestión de Pedidos"
        }
        action={
          (usuario.role === "ADMIN" || usuario.role === "CLIENTE") && (
            <Button variant="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "✕ Cancelar" : "+ Nuevo Pedido"}
            </Button>
          )
        }
      />

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      {showForm && (
        <Card className="mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Crear Nuevo Pedido</h3>
          <PedidoForm onSubmit={handleFormSubmit} />
        </Card>
      )}

      {pedidos.length === 0 ? (
        <Alert type="info">
          {usuario?.role === "CLIENTE"
            ? "No tienes pedidos registrados."
            : "No hay pedidos registrados en el sistema."}
        </Alert>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Número</TableHeaderCell>
              <TableHeaderCell>Fecha</TableHeaderCell>
              <TableHeaderCell>Cliente</TableHeaderCell>
              <TableHeaderCell>Vehículo</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
              <TableHeaderCell>Forma de Pago</TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => {
              const estadoActual = getEstadoActual(pedido);
              return (
                <TableRow key={pedido.id}>
                  <TableCell className="font-medium text-gray-900">
                    {pedido.numeroPedido}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(pedido.fechaCreacion).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {pedido.cliente?.nombre} {pedido.cliente?.apellido}
                      </div>
                      <div className="text-gray-500">
                        {pedido.cliente?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {pedido.vehiculo?.marca} {pedido.vehiculo?.modelo}
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">
                    ${pedido.total?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getFormaPagoBadgeVariant(pedido.formaPago)}>
                      {pedido.formaPago}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadgeVariant(estadoActual)}>
                      {estadoActual}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/pedidos/${pedido.id}`)}
                    >
                      Ver detalle →
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
