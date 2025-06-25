import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "CLIENTE",
    // Campos extra para registro de Cliente
    nombre: "",
    apellido: "",
    documento: "",
    email: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const API = "http://localhost:8080";

    try {
      // 1) Registro o login
      const authEndpoint = isRegister
        ? `${API}/api/auth/register`
        : `${API}/api/auth/login`;

      const authRes = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!authRes.ok) {
        let be = "";
        try { be = (await authRes.json()).message || ""; } catch {}
        throw new Error(be || (isRegister ? "Error al registrar" : "Credenciales inválidas"));
      }
      const userData = await authRes.json();

      // 2) Si registramos, creamos también el Cliente
      if (isRegister) {
        const clienteBody = {
          nombre: form.nombre,
          apellido: form.apellido,
          documento: form.documento,
          email: form.email,
          telefono: form.telefono,
        };
        const cliRes = await fetch(`${API}/api/clientes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Si tu endpoint requiere token:
            // "Authorization": `Bearer ${userData.token}`
          },
          body: JSON.stringify(clienteBody),
        });
        if (!cliRes.ok) {
          console.warn("Warning: no se creó Cliente en BD", await cliRes.text());
        }
      }

      // 3) Llamamos onLogin para guardar el usuario en App.js
      onLogin(userData);

    } catch (err) {
      setError(err.message || "Error de red o servidor");
      console.error("Login/Register error:", err);
    }
  }

  return (
    <div className="login-bg">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>{isRegister ? "Registro de Usuario" : "Login de Usuario"}</h2>

        {/* Campos comunes */}
        <input
          className="input"
          name="username"
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Selector de rol */}
        {isRegister && (
          <select
            className="input"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="ADMIN">Administrador</option>
            <option value="CLIENTE">Cliente</option>
            <option value="VENDEDOR">Vendedor</option>
          </select>
        )}

        {/* Campos adicionales solo en registro */}
        {isRegister && (
          <>
            <input
              className="input"
              name="nombre"
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="apellido"
              type="text"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="documento"
              type="text"
              placeholder="Documento"
              value={form.documento}
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="telefono"
              type="text"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </>
        )}

        {error && <div className="error">{error}</div>}

        <button className="button" type="submit">
          {isRegister ? "Registrarse" : "Ingresar"}
        </button>
        <button
          type="button"
          className="button"
          style={{ background: "#6c63ff", marginLeft: 8 }}
          onClick={() => setIsRegister((r) => !r)}
        >
          {isRegister ? "Ya tengo cuenta" : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}
