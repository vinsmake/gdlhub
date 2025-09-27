import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Error de autenticación");
      return;
    }

    const { user, token } = await res.json();
    login(user, token); // ← ✅ correctamente separado
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Correo"
        className="w-full p-3 bg-neutral-700 rounded"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        className="w-full p-3 bg-neutral-700 rounded"
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-500 transition-colors text-white font-semibold py-3 rounded"
      >
        Entrar
      </button>
      
      <div className="text-center">
        <p className="text-gray-400 mb-3">¿No tienes cuenta?</p>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full bg-gray-600 hover:bg-gray-500 transition-colors text-white font-semibold py-3 rounded"
        >
          Crear Cuenta
        </button>
      </div>
    </form>
  );
}
