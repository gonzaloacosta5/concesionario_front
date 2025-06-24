import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "./components/ui/UIComponents";

export default function Layout({ children, usuario, onLogout }) {
  // Definir tabs según el rol
  const getTabsByRole = () => {
    const role = usuario?.role;

    if (role === "ADMIN") {
      return [
        { to: "/", label: "Inicio", icon: "🏠" },
        { to: "/clientes", label: "Clientes", icon: "👥" },
        { to: "/vehiculos", label: "Vehículos", icon: "🚗" },
        { to: "/pedidos", label: "Pedidos", icon: "📋" },
        { to: "/pagos", label: "Pagos", icon: "💳" },
        { to: "/reportes", label: "Reportes", icon: "📊" },
      ];
    } else if (role === "CLIENTE") {
      return [
        { to: "/", label: "Inicio", icon: "🏠" },
        { to: "/vehiculos", label: "Vehículos", icon: "🚗" },
        { to: "/pedidos", label: "Mis Pedidos", icon: "📋" },
      ];
    } else if (role === "VENDEDOR") {
      return [
        { to: "/", label: "Inicio", icon: "🏠" },
        { to: "/vehiculos", label: "Vehículos", icon: "🚗" },
      ];
    }
    return [{ to: "/", label: "Inicio", icon: "🏠" }];
  };

  const tabs = getTabsByRole();

  const getRoleBadgeColor = (role) => {
    const colors = {
      ADMIN: "bg-red-500",
      CLIENTE: "bg-blue-500",
      VENDEDOR: "bg-green-500",
    };
    return colors[role] || "bg-gray-500";
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <span className="text-white font-bold text-xl">🚗 AutoMax</span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-1">
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    end
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-orange-500 text-white shadow-md"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`
                    }
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* User section */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-gray-300 text-sm">Bienvenido,</span>
                <span className="text-white font-medium">
                  {usuario?.username}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getRoleBadgeColor(
                    usuario?.role
                  )}`}
                >
                  {usuario?.role}
                </span>
              </div>

              <Button variant="danger" size="sm" onClick={onLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Concesionaria AutoMax S.A. - CUIT: 30-12345678-9
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Sistema de Gestión de Vehículos v1.0
          </p>
        </div>
      </footer>
    </>
  );
}
