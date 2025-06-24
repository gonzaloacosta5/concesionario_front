import React, { useState, useEffect } from "react";
import { getVehiculos, getPedidos } from "../services/api";
import VehiculoForm from "../components/VehiculoForm";
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

export default function VehiculosPage({ usuario }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      const [vehiculosData, pedidosData] = await Promise.all([
        getVehiculos(),
        getPedidos(),
      ]);
      setVehiculos(vehiculosData);
      setPedidos(pedidosData);
    } catch (err) {
      setError("Error al cargar datos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    await cargarDatos(); // Recarga automática después de crear
  };

  // Verificar si un vehículo está vendido
  const estaVendido = (vehiculoId) => {
    return pedidos.some((pedido) => pedido.vehiculo?.id === vehiculoId);
  };

  const getTipoBadgeVariant = (tipo) => {
    const variants = {
      AUTO: "info",
      CAMIONETA: "success",
      MOTO: "warning",
      CAMION: "purple",
    };
    return variants[tipo] || "default";
  };

  const calcularImpuestos = (tipo, precioBase) => {
    const porcentajes = {
      AUTO: 0.27,
      CAMIONETA: 0.17,
      MOTO: 0.05,
      CAMION: 0.05,
    };
    return precioBase * (porcentajes[tipo] || 0);
  };

  // Filtrar vehículos según el rol
  const vehiculosFiltrados =
    usuario?.role === "VENDEDOR" || usuario?.role === "CLIENTE"
      ? vehiculos.filter((v) => !estaVendido(v.id))
      : vehiculos;

  if (loading) {
    return (
      <Card>
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-500 mt-4">Cargando vehículos...</p>
      </Card>
    );
  }

  return (
    <Card>
      <PageHeader
        title="Catálogo de Vehículos"
        action={
          usuario?.role === "ADMIN" && (
            <Button variant="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "✕ Cancelar" : "+ Nuevo Vehículo"}
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
          <h3 className="text-lg font-semibold mb-4">
            Registrar Nuevo Vehículo
          </h3>
          <VehiculoForm onSubmit={handleFormSubmit} />
        </Card>
      )}

      {vehiculosFiltrados.length === 0 ? (
        <Alert type="info">
          {usuario?.role === "ADMIN"
            ? "No hay vehículos registrados en el catálogo."
            : "No hay vehículos disponibles en este momento."}
        </Alert>
      ) : (
        <>
          {(usuario?.role === "VENDEDOR" || usuario?.role === "CLIENTE") && (
            <Alert type="info" className="mb-4">
              Mostrando solo vehículos disponibles para la venta
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Marca</TableHeaderCell>
                <TableHeaderCell>Modelo</TableHeaderCell>
                <TableHeaderCell>Color</TableHeaderCell>
                <TableHeaderCell>Tipo</TableHeaderCell>
                <TableHeaderCell>Chasis</TableHeaderCell>
                <TableHeaderCell>Motor</TableHeaderCell>
                <TableHeaderCell>Precio Base</TableHeaderCell>
                <TableHeaderCell>Impuestos</TableHeaderCell>
                <TableHeaderCell>Precio Final</TableHeaderCell>
                {usuario?.role === "ADMIN" && (
                  <TableHeaderCell>Estado</TableHeaderCell>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehiculosFiltrados.map((vehiculo) => {
                const impuestos = calcularImpuestos(
                  vehiculo.tipo,
                  vehiculo.precioBase
                );
                const precioFinal = vehiculo.precioBase + impuestos;
                const vendido = estaVendido(vehiculo.id);

                return (
                  <TableRow
                    key={vehiculo.id}
                    className={vendido ? "opacity-60" : ""}
                  >
                    <TableCell className="font-medium text-gray-900">
                      {vehiculo.id}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {vehiculo.marca}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {vehiculo.modelo}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {vehiculo.color}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTipoBadgeVariant(vehiculo.tipo)}>
                        {vehiculo.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 font-mono text-xs">
                      {vehiculo.chasis}
                    </TableCell>
                    <TableCell className="text-gray-500 font-mono text-xs">
                      {vehiculo.motor}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      ${vehiculo.precioBase.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      ${impuestos.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      ${precioFinal.toLocaleString()}
                    </TableCell>
                    {usuario?.role === "ADMIN" && (
                      <TableCell>
                        <Badge variant={vendido ? "danger" : "success"}>
                          {vendido ? "VENDIDO" : "DISPONIBLE"}
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </Card>
  );
}
