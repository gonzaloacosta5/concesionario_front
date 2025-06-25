const BASE = "http://localhost:8080/api";

export async function getClientes() {
  const res = await fetch(`${BASE}/clientes`);
  if (!res.ok) throw new Error("Error al cargar clientes");
  return res.json();
}

export async function postCliente(data) {
  const res = await fetch(`${BASE}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear cliente");
  return res.json();
}

export async function getVehiculos() {
  const res = await fetch(`${BASE}/vehiculos`);
  if (!res.ok) throw new Error("Error al cargar vehículos");
  return res.json();
}

export async function postVehiculo(data) {
  const res = await fetch(`${BASE}/vehiculos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear vehículo");
  return res.json();
}

export async function getPedidos() {
  const res = await fetch(`${BASE}/pedidos`);
  if (!res.ok) throw new Error("Error al cargar pedidos");
  const pedidos = await res.json();

  // Para cada pedido, cargar la información del cliente y vehículo si no viene completa
  const pedidosCompletos = await Promise.all(
    pedidos.map(async (pedido) => {
      try {
        // Si el cliente no tiene nombre, es porque solo viene el ID
        if (pedido.cliente && !pedido.cliente.nombre) {
          const cliente = await fetch(
            `${BASE}/clientes/${pedido.cliente.id}`
          ).then((r) => r.json());
          pedido.cliente = cliente;
        }
        // Lo mismo para el vehículo
        if (pedido.vehiculo && !pedido.vehiculo.marca) {
          const vehiculo = await fetch(
            `${BASE}/vehiculos/${pedido.vehiculo.id}`
          ).then((r) => r.json());
          pedido.vehiculo = vehiculo;
        }
      } catch (err) {
        console.error("Error cargando datos adicionales:", err);
      }
      return pedido;
    })
  );

  return pedidosCompletos;
}

export async function postPedido(data) {
  const res = await fetch(`${BASE}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear pedido");
  return res.json();
}

export async function getPedidoDetail(id) {
  const res = await fetch(`${BASE}/pedidos/${id}`);
  if (!res.ok) throw new Error("Error al cargar detalle de pedido");
  return res.json();
}

export async function getHistorial(id) {
  const res = await fetch(`${BASE}/pedidos/${id}/historial`);
  if (!res.ok) throw new Error("Error al cargar historial");
  return res.json();
}

export async function putPedidoEstado(id, nuevoEstado) {
  const res = await fetch(
    `${BASE}/pedidos/${id}/estado?nuevoEstado=${nuevoEstado}`,
    {
      method: "PUT",
    }
  );
  if (!res.ok) throw new Error("Error al avanzar estado");
  return res.json();
}

export async function getPagos(pedidoId) {
  const res = await fetch(`${BASE}/pedidos/${pedidoId}/pagos`);
  if (!res.ok) throw new Error("Error al cargar pagos");
  return res.json();
}

export async function postPago(pedidoId, tipo, data) {
  const url = `${BASE}/pedidos/${pedidoId}/pagos/${tipo}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al registrar pago");
  return res.json();
}

export async function getReportePedidos(desde, estado) {
  const params = new URLSearchParams({ desde, ...(estado ? { estado } : {}) });
  const res = await fetch(`${BASE}/reportes/pedidos?${params}`);
  if (!res.ok) throw new Error("Error al cargar reporte");
  return res.json();
}

export async function getTotales(desde, hasta, incluirImpuestos) {
  const params = new URLSearchParams({ desde, hasta, incluirImpuestos });
  const res = await fetch(`${BASE}/reportes/totales?${params}`);
  if (!res.ok) throw new Error("Error al cargar totales");
  return res.json();
}

export async function exportPedidosCsv(desde, hasta, estado = "") {
  const params = new URLSearchParams({
    desde,
    hasta,
    ...(estado && { estado }),
  }).toString();

  const res = await fetch(`${BASE}/reportes/pedidos/csv?${params}`);

  if (!res.ok) {
    const { message } = await res.json().catch(() => ({}));
    throw new Error(message || "Error al exportar CSV");
  }
  const blob = await res.blob();
  const dispo = res.headers.get("Content-Disposition") || "";
  const match = /filename=\"?([^\";]+)\"?/i.exec(dispo);
  const filename = match ? match[1] : "reporte_pedidos.csv";
  return { blob, filename };
}