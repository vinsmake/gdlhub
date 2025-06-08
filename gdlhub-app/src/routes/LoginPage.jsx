import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Error de autenticación");
      return;
    }

    const user = await res.json();
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/"); // redirige al home
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
    </form>
  );
}
