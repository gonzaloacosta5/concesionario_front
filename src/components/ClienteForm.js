import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Button, Alert } from "./ui/UIComponents";

export default function ClienteForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, documento, email, telefono }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear cliente");
      }

      await res.json();
      navigate("/clientes");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {okMsg && <Alert type="success">{okMsg}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Juan"
        />

        <Input
          label="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
          placeholder="Pérez"
        />
      </div>

      <Input
        label="Documento"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
        required
        placeholder="12345678"
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="juan@email.com"
      />

      <Input
        label="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        required
        placeholder="011-1234-5678"
      />

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear Cliente"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/clientes")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
