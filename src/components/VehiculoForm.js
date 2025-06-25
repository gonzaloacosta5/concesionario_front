import React, { useState } from "react";
import { Input, Select, Button, Alert } from "./ui/UIComponents";

/**
 * Formulario para registrar un vehículo. Mantiene la funcionalidad previa
 * (validaciones, props `onSubmit`, `onCancel`, `isSubmitting`) y añade:
 *   • Estado okMsg para mensaje de éxito.
 *   • Limpieza de marcadores de conflicto Git.
 */
export default function VehiculoForm({ onSubmit, onCancel, isSubmitting }) {
  /* ───────────── States ───────────── */
  const [marca,      setMarca]      = useState("");
  const [modelo,     setModelo]     = useState("");
  const [color,      setColor]      = useState("");
  const [chasis,     setChasis]     = useState("");
  const [motor,      setMotor]      = useState("");
  const [precioBase, setPrecioBase] = useState("");
  const [tipo,       setTipo]       = useState("AUTO");
  const [error,      setError]      = useState(null);
  const [okMsg,      setOkMsg]      = useState(null);

  /* ───────────── Handlers ─────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setOkMsg(null);

    // Validación de campos vacíos
    const campos = [marca, modelo, color, chasis, motor, precioBase];
    if (campos.some((v) => !v)) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (Number(precioBase) <= 0) {
      setError("El precio base debe ser mayor a 0");
      return;
    }

    const vehiculoData = {
      marca: marca.trim(),
      modelo: modelo.trim(),
      color: color.trim(),
      chasis: chasis.trim(),
      motor: motor.trim(),
      precioBase: Number(precioBase),
      tipo,
    };

    try {
      await onSubmit(vehiculoData);
      setOkMsg("Vehículo creado correctamente");
      resetForm();
    } catch (err) {
      setError(err.message || "Error al crear vehículo");
    }
  };

  const resetForm = () => {
    setMarca("");
    setModelo("");
    setColor("");
    setChasis("");
    setMotor("");
    setPrecioBase("");
    setTipo("AUTO");
    setError(null);
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  /* ───────────── UI ──────────────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mensajes globales */}
      {okMsg && <Alert type="success">{okMsg}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      {isSubmitting && (
        <Alert type="info">
          <span className="animate-spin mr-2">⏳</span>
          Enviando vehículo...
        </Alert>
      )}

      {/* Grupo 1: Marca / Modelo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Toyota, Ford, etc."
        />
        <Input
          label="Modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Corolla, Focus, etc."
        />
      </div>

      {/* Grupo 2: Color / Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Rojo, Azul, Negro, etc."
        />
        <Select
          label="Tipo de Vehículo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="AUTO">Auto</option>
          <option value="CAMIONETA">Camioneta</option>
          <option value="MOTO">Moto</option>
          <option value="CAMION">Camión</option>
        </Select>
      </div>

      {/* Grupo 3: Chasis / Motor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Número de Chasis"
          value={chasis}
          onChange={(e) => setChasis(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Ej: 1HGBH41JXMN109186"
        />
        <Input
          label="Número de Motor"
          value={motor}
          onChange={(e) => setMotor(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Ej: 52WVC10338"
        />
      </div>

      {/* Precio */}
      <Input
        label="Precio Base"
        type="number"
        step="0.01"
        value={precioBase}
        onChange={(e) => setPrecioBase(e.target.value)}
        required
        disabled={isSubmitting}
        placeholder="50000.00"
      />

      {/* Nota de impuestos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Los impuestos se calcularán automáticamente según el tipo de vehículo:
        </p>
        <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
          <li>Auto: 27% (21% nacional + 5% provincial + 1% adicional)</li>
          <li>Camioneta: 17% (10% nacional + 5% provincial + 2% adicional)</li>
          <li>Moto/Camión: 5% (solo provincial)</li>
        </ul>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Crear Vehículo"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
