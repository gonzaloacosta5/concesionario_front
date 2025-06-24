import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "CLIENTE",
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
    const endpoint = isRegister
      ? `${API}/api/auth/register`
      : `${API}/api/auth/login`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        // Intentamos leer el error del backend
        let backendError = "";
        try {
          const errJson = await res.json();
          backendError = errJson.message || "";
        } catch {}
        throw new Error(backendError || "Credenciales inválidas");
      }
      const data = await res.json();
      onLogin(data); // Lo usará App.js
    } catch (err) {
      setError(err.message || "Error de red o servidor");
      // Log extra para debugging
      console.error("Login/Register error:", err);
    }
  }

  return (
    <div className="login-bg">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>{isRegister ? "Registro" : "Login"} de Usuario</h2>
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
