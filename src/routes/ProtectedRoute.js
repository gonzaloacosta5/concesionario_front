import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, usuario, allowedRoles }) {
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Acceso Denegado
        </h2>
        <p>No tienes permisos para acceder a esta sección.</p>
        <p className="mt-2">
          Tu rol actual es: <strong>{usuario.role}</strong>
        </p>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver al inicio
        </a>
      </div>
    );
  }

  return children;
}
