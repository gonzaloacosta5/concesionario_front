import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Button, Alert } from "./ui/UIComponents";

export default function VehiculoForm() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [chasis, setChasis] = useState("");
  const [motor, setMotor] = useState("");
  const [precioBase, setPrecioBase] = useState("");
  const [tipo, setTipo] = useState("AUTO");
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marca,
          modelo,
          color,
          chasis,
          motor,
          precioBase: parseFloat(precioBase),
          tipo,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear vehículo");
      }

      await res.json();
      navigate("/vehiculos");
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
          label="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          required
          placeholder="Toyota, Ford, etc."
        />

        <Input
          label="Modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          required
          placeholder="Corolla, Focus, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
          placeholder="Rojo, Azul, Negro, etc."
        />

        <Select
          label="Tipo de Vehículo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="AUTO">Auto</option>
          <option value="CAMIONETA">Camioneta</option>
          <option value="MOTO">Moto</option>
          <option value="CAMION">Camión</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Número de Chasis"
          value={chasis}
          onChange={(e) => setChasis(e.target.value)}
          required
          placeholder="Ej: 1HGBH41JXMN109186"
        />

        <Input
          label="Número de Motor"
          value={motor}
          onChange={(e) => setMotor(e.target.value)}
          required
          placeholder="Ej: 52WVC10338"
        />
      </div>

      <Input
        label="Precio Base"
        type="number"
        step="0.01"
        value={precioBase}
        onChange={(e) => setPrecioBase(e.target.value)}
        required
        placeholder="50000.00"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Los impuestos se calcularán automáticamente
          según el tipo de vehículo:
        </p>
        <ul className="text-sm text-blue-700 mt-2">
          <li>• Auto: 27% (21% nacional + 5% provincial + 1% adicional)</li>
          <li>
            • Camioneta: 17% (10% nacional + 5% provincial + 2% adicional)
          </li>
          <li>• Moto/Camión: 5% (solo provincial)</li>
        </ul>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear Vehículo"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/vehiculos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
