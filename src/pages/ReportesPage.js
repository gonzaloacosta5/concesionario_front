import React, { useState } from "react";
import {getReportePedidos,getTotales,exportPedidosCsv,} from "../services/api";
import { Alert, Button } from "../components/ui/UIComponents";

export default function ReportesPage() {
  const [desde, setDesde] = useState('2025-01-01');
  const [hasta, setHasta] = useState('2025-06-18');
  const [estado, setEstado] = useState('');
  const [pedidos, setPedidos]     = useState([]);
  const [totales, setTotales]     = useState({});
  const [okMsg , setOkMsg]        = useState("");
  const [errMsg, setErrMsg]       = useState("");

  const loadReporte = () => {
    setOkMsg(""); setErrMsg("");
    getReportePedidos(desde, estado)
      .then((data) => { setPedidos(data); setOkMsg("Pedidos cargados"); })
      .catch((e)   => setErrMsg(e.message));
  };
  const loadTotales = () => {
    setOkMsg(""); setErrMsg("");
    getTotales(desde, hasta, false)
      .then((data) => { setTotales(data); setOkMsg("Totales cargados"); })
      .catch((e)   => setErrMsg(e.message));
  };

const downloadCsv = () => {
  setOkMsg("");
  setErrMsg("");

  exportPedidosCsv(desde, hasta, estado || undefined)
    .then(({ blob, filename }) => {        
      const url  = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href     = url;
      link.download = filename;           
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 150);                   

      setOkMsg("CSV descargado correctamente");
    })
    .catch((e) => setErrMsg(e.message));
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

      <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem' }}>
        <Button variant="primary" onClick={loadReporte}>Cargar Pedidos</Button>
        <Button variant="primary" onClick={loadTotales}>Cargar Totales</Button>
        <Button variant="outline" onClick={downloadCsv}>Exportar CSV</Button>
      </div>

      {errMsg && <Alert type="error"   className="mb-4">{errMsg}</Alert>}
      {okMsg  && <Alert type="success" className="mb-4">{okMsg}</Alert>}
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
