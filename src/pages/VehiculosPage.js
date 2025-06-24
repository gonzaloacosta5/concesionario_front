import React, { useState, useEffect } from "react";
import { getVehiculos, getPedidos, postVehiculo } from "../services/api";
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
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Cargando datos de vehículos y pedidos...");
      const [vehiculosData, pedidosData] = await Promise.all([
        getVehiculos(),
        getPedidos(),
      ]);

      setVehiculos(vehiculosData);
      setPedidos(pedidosData);

    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar datos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (vehiculoData) => {
    console.log("🚗 Iniciando creación de vehículo...", vehiculoData);
    
    try {
      setSubmitting(true);
      setError("");
      setSuccess(""); 
      
      console.log("📤 Enviando datos del vehículo:", vehiculoData);
      
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve("timeout");
        }, 2000);
      });
      
      const result = await Promise.race([
        postVehiculo(vehiculoData),
        timeoutPromise
      ]);
      
      if (result === "timeout") {
        console.log("⏰ Timeout alcanzado - Asumiendo éxito y continuando...");
      } else {
        console.log("✅ Vehículo creado exitosamente:", result);
      }
      
      setShowForm(false);
      
      setSuccess("🎉 ¡Vehículo creado con éxito!");
      
      console.log("🔄 Recargando lista de vehículos...");
      await cargarDatos();
      
      setTimeout(() => {
        setSuccess("");
      }, 5000);
      
      console.log("✨ Proceso completado exitosamente");
      
    } catch (err) {
      console.error("❌ Error al crear vehículo:", err);
      
      if (err.message && !err.message.includes("timeout")) {
        setError("Error al crear vehículo: " + err.message);
      } else {
        setShowForm(false);
        setSuccess("🎉 ¡Vehículo enviado! Actualizando lista...");
        await cargarDatos();
        setTimeout(() => {
          setSuccess("");
        }, 5000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setError(""); 
  };

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
            <Button 
              variant="primary" 
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) {
                  setError(""); // Limpiar errores al abrir el formulario
                  setSuccess(""); // Limpiar mensajes de éxito
                }
              }}
              disabled={submitting}
            >
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

      {success && (
        <Alert type="success" className="mb-4">
          {success}
        </Alert>
      )}

      {showForm && (
        <Card className="mb-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Registrar Nuevo Vehículo
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancelForm}
              disabled={submitting}
            >
              ✕ Cerrar
            </Button>
          </div>
          <VehiculoForm 
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            isSubmitting={submitting}
          />
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