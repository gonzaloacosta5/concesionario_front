import React from 'react'

export default function InicioPage() {
  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-4">Sistema de Gestión para Concesionaria de Vehículos</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contexto</h2>
        <p>
          Se nos ha encargado el diseño y desarrollo de un sistema de gestión para una
          concesionaria de vehículos en Argentina.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Descripción General</h2>
        <p>
          Los clientes podrán realizar pedidos de compra de vehículos a través del sistema.
          El proceso abarcará ventas, cobranzas, impuestos, embarque, logística, entrega y seguimiento.
        </p>
        <p>
          El catálogo en línea permitirá configurar modelo, color y equipamiento adicional.
          Se generará una orden de compra y se notificará a las áreas correspondientes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Alcance y Requerimientos</h2>
        <ul className="list">
          <li>Registrar y gestionar clientes (nombre, apellido, documento, email, teléfono).</li>
          <li>Evitar duplicados de clientes, vehículos y pedidos (con excepción).</li>
          <li>Manejo de errores mediante excepciones en validaciones y procesamiento.</li>
          <li>Cargar catálogo de vehículos (marca, modelo, color, chasis, motor, precio).</li>
          <li>Registrar pedidos con personalización y forma de pago.</li>
          <li>Gestionar etapas del pedido: ventas, cobranzas, impuestos, embarque, logística y entrega.</li>
          <li>Mantener historial de cambios de estado y notificar a áreas responsables.</li>
          <li>Generar reportes filtrables por fecha y estado, exportables para análisis.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Cálculo de Impuestos y Forma de Pago</h2>
        <ul className="list">
          <li>
            Impuesto Nacional: Autos 21%, Camionetas 10%, Motos/Camiones exentos.
          </li>
          <li>Impuesto Provincial General: 5% a todos los vehículos.</li>
          <li>
            Impuesto Provincial Adicional: Camiones/Camionetas 2%, Autos/Motos 1%.
          </li>
          <li>
            Cada tipo de vehículo define su propia estrategia de cálculo (polimorfismo).
          </li>
          <li>
            Formas de pago: contado, transferencia, tarjeta (herencia para extender).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Gestión de Vistas y Roles</h2>
        <ul className="list">
          <li>
            <b>Administrador:</b> acceso completo a clientes, vehículos, pedidos e informes.
          </li>
          <li>
            <b>Comprador:</b> ve solo sus pedidos y catálogo sin vehículos en proceso de venta.
          </li>
          <li>
            <b>Vendedor:</b> ve catálogo sin pedidos ni clientes; vehículos fuera de venta.
          </li>
        </ul>
      </section>
    </div>
  )
}
