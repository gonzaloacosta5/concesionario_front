import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PagoForm({ pedidoId }) {
  const [tipoPago, setTipoPago] = useState("CONTADO");
  const [descuento, setDescuento] = useState("0");
  const [banco, setBanco] = useState("");
  const [cbu, setCbu] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [titular, setTitular] = useState("");
  const [fechaExp, setFechaExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pedidoId) {
      setError("Debe ingresar un ID de pedido válido");
      return;
    }

    let url = `http://localhost:8080/api/pedidos/${pedidoId}/pagos/`;
    let body = {};

    if (tipoPago === "CONTADO") {
      url += "contado";
      body = { descuento: parseFloat(descuento) || 0 };
    } else if (tipoPago === "TRANSFERENCIA") {
      url += "transferencia";
      body = { banco, cbu };
    } else {
      url += "tarjeta";
      body = { numeroTarjeta, titular, fechaExpiracion: fechaExp, cvv };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al registrar pago");
      }

      await res.json();
      setError(null);
      alert("Pago registrado exitosamente");
      // Limpiar formulario
      setDescuento("0");
      setBanco("");
      setCbu("");
      setNumeroTarjeta("");
      setTitular("");
      setFechaExp("");
      setCvv("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">Error: {error}</div>}

      {pedidoId && (
        <div className="text-green-600">
          Registrando pago para pedido ID: {pedidoId}
        </div>
      )}

      <div>
        <label>Tipo de Pago</label>
        <select
          value={tipoPago}
          onChange={(e) => setTipoPago(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="CONTADO">Contado</option>
          <option value="TRANSFERENCIA">Transferencia</option>
          <option value="TARJETA">Tarjeta</option>
        </select>
      </div>

      {tipoPago === "CONTADO" && (
        <div>
          <label>Descuento (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={descuento}
            onChange={(e) => setDescuento(e.target.value)}
            placeholder="0"
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      {tipoPago === "TRANSFERENCIA" && (
        <>
          <div>
            <label>Banco</label>
            <input
              value={banco}
              onChange={(e) => setBanco(e.target.value)}
              required
              placeholder="Ej: Banco Santander"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>CBU</label>
            <input
              value={cbu}
              onChange={(e) => setCbu(e.target.value)}
              required
              placeholder="22 dígitos"
              maxLength="22"
              className="w-full border p-2 rounded"
            />
          </div>
        </>
      )}

      {tipoPago === "TARJETA" && (
        <>
          <div>
            <label>Número de Tarjeta</label>
            <input
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(e.target.value)}
              required
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Titular</label>
            <input
              value={titular}
              onChange={(e) => setTitular(e.target.value)}
              required
              placeholder="JUAN PEREZ"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>Fecha de Expiración</label>
            <input
              type="date"
              value={fechaExp}
              onChange={(e) => setFechaExp(e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label>CVV</label>
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              placeholder="123"
              maxLength="4"
              className="w-full border p-2 rounded"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        disabled={!pedidoId}
      >
        Registrar Pago
      </button>
    </form>
  );
}
