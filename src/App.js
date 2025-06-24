import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import InicioPage from "./pages/InicioPage";
import ClientesPage from "./pages/ClientesPage";
import VehiculosPage from "./pages/VehiculosPage";
import PedidosPage from "./pages/PedidosPage";
import PedidoDetail from "./pages/PedidoDetail";
import PagosPage from "./pages/PagosPage";
import ReportesPage from "./pages/ReportesPage";

export default function App() {
  // Intentar recuperar el usuario del sessionStorage
  const [usuario, setUsuario] = useState(() => {
    const savedUser = sessionStorage.getItem("usuario");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Guardar usuario en sessionStorage cuando cambie
  useEffect(() => {
    if (usuario) {
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      sessionStorage.removeItem("usuario");
    }
  }, [usuario]);

  const handleLogin = (userData) => {
    setUsuario(userData);
  };

  const handleLogout = () => {
    setUsuario(null);
    sessionStorage.removeItem("usuario");
  };

  if (!usuario) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout usuario={usuario} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<InicioPage usuario={usuario} />} />

          {/* Rutas solo para ADMIN */}
          <Route
            path="/clientes"
            element={
              <ProtectedRoute usuario={usuario} allowedRoles={["ADMIN"]}>
                <ClientesPage usuario={usuario} />
              </ProtectedRoute>
            }
          />

          {/* Rutas para ADMIN y VENDEDOR */}
          <Route
            path="/vehiculos"
            element={
              <ProtectedRoute
                usuario={usuario}
                allowedRoles={["ADMIN", "VENDEDOR", "CLIENTE"]}
              >
                <VehiculosPage usuario={usuario} />
              </ProtectedRoute>
            }
          />

          {/* Rutas para ADMIN y CLIENTE */}
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute
                usuario={usuario}
                allowedRoles={["ADMIN", "CLIENTE"]}
              >
                <PedidosPage usuario={usuario} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos/:id"
            element={
              <ProtectedRoute
                usuario={usuario}
                allowedRoles={["ADMIN", "CLIENTE"]}
              >
                <PedidoDetail usuario={usuario} />
              </ProtectedRoute>
            }
          />

          {/* Rutas solo para ADMIN */}
          <Route
            path="/pagos"
            element={
              <ProtectedRoute usuario={usuario} allowedRoles={["ADMIN"]}>
                <PagosPage usuario={usuario} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute usuario={usuario} allowedRoles={["ADMIN"]}>
                <ReportesPage usuario={usuario} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
