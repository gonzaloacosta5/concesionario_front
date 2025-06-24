import React, { useState, useEffect } from "react";
import { getClientes } from "../services/api";
import ClienteForm from "../components/ClienteForm";
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

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      setError("Error al cargar clientes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    await cargarClientes(); // Recarga automática después de crear
  };

  if (loading) {
    return (
      <Card>
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-500 mt-4">Cargando clientes...</p>
      </Card>
    );
  }

  return (
    <Card>
      <PageHeader
        title="Gestión de Clientes"
        action={
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancelar" : "+ Nuevo Cliente"}
          </Button>
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
            Registrar Nuevo Cliente
          </h3>
          <ClienteForm onSubmit={handleFormSubmit} />
        </Card>
      )}

      {clientes.length === 0 ? (
        <Alert type="info">
          No hay clientes registrados. Haz clic en "Nuevo Cliente" para agregar
          uno.
        </Alert>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Nombre Completo</TableHeaderCell>
              <TableHeaderCell>Documento</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Teléfono</TableHeaderCell>
              <TableHeaderCell>Pedidos</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium text-gray-900">
                  {cliente.id}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {cliente.nombre} {cliente.apellido}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">
                  {cliente.documento}
                </TableCell>
                <TableCell className="text-gray-500">{cliente.email}</TableCell>
                <TableCell className="text-gray-500">
                  {cliente.telefono}
                </TableCell>
                <TableCell>
                  <Badge variant="info">
                    {cliente.pedidos?.length || 0} pedidos
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
