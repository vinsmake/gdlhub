import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateUserPage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/users");
    } else {
      alert("Error al crear usuario");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold">Crear nuevo usuario</h1>
      <input name="name" placeholder="Nombre" onChange={handleChange} className="w-full p-2 rounded bg-neutral-700" />
      <input name="email" placeholder="Correo" onChange={handleChange} className="w-full p-2 rounded bg-neutral-700" />
      <button type="submit" className="bg-red-600 px-4 py-2 rounded text-white">Registrar</button>
    </form>
  );
}
