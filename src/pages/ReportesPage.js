import React, { useState } from 'react';
import { getReportePedidos, getTotales } from '../services/api';

export default function ReportesPage() {
  const [desde, setDesde] = useState('2025-01-01');
  const [hasta, setHasta] = useState('2025-06-18');
  const [estado, setEstado] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [totales, setTotales] = useState({});

  const loadReporte = () => {
    getReportePedidos(desde, estado).then(setPedidos).catch(console.error);
  };
  const loadTotales = () => {
    getTotales(desde, hasta, false).then(setTotales).catch(console.error);
  };

  return (
    <div className="card">
      <h2>Reportes</h2>

      <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem' }}>
        <div>
          <label>Desde</label>
          <input className="input" type="date" value={desde} onChange={e=>setDesde(e.target.value)} />
        </div>
        <div>
          <label>Hasta</label>
          <input className="input" type="date" value={hasta} onChange={e=>setHasta(e.target.value)} />
        </div>
        <div>
          <label>Estado (opcional)</label>
          <input className="input" value={estado} onChange={e=>setEstado(e.target.value)} />
        </div>
      </div>

      <button className="button" onClick={loadReporte}>Cargar Pedidos</button>
      <button className="button" onClick={loadTotales}>Cargar Totales</button>

      <h3 style={{ marginTop:'1rem' }}>Pedidos</h3>
      <ul className="list">
        {pedidos.map(p=>(
          <li key={p.id}>{p.numeroPedido} — {p.formaPago}</li>
        ))}
      </ul>

      <h3 style={{ marginTop:'1rem' }}>Totales</h3>
      <ul className="list">
        {Object.entries(totales).map(([f,t])=>(
          <li key={f}>{f}: ${t}</li>
        ))}
      </ul>
    </div>
  );
}
