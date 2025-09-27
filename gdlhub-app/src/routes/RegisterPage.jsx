import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: "",
    avatar: ""
  });
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    if (!form.email.trim()) {
      setError("El email es requerido");
      return false;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('📝 [REGISTER] Enviando datos de registro...');
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          avatar: form.avatar || null
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ [REGISTER] Error en registro:', data.message);
        setError(data.message || "Error al crear la cuenta");
        return;
      }

      console.log('✅ [REGISTER] Email de verificación enviado');
      console.log('🔗 [REGISTER] Preview URL:', data.previewUrl); // Para testing
      
      setEmailSent(true);
      setVerificationStep(true);

    } catch (error) {
      console.error('❌ [REGISTER] Error de conexión:', error);
      setError("Error de conexión. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError(null);

    if (!verificationCode.trim()) {
      setError("Por favor ingresa el código de verificación");
      return;
    }

    setLoading(true);

    try {
      console.log('🔍 [VERIFY] Verificando código...');
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          verificationCode: verificationCode
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ [VERIFY] Error en verificación:', data.message);
        setError(data.message || "Código inválido");
        return;
      }

      console.log('✅ [VERIFY] Cuenta verificada exitosamente');
      
      // Auto-login después de la verificación exitosa
      if (data.user && data.token) {
        console.log('🔐 [VERIFY] Iniciando sesión automática...');
        login(data.user, data.token);
        navigate("/");
      }

    } catch (error) {
      console.error('❌ [VERIFY] Error de conexión:', error);
      setError("Error de conexión. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (verificationStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
        <form onSubmit={handleVerification} className="max-w-md w-full p-6 space-y-6 text-white bg-neutral-800 rounded-lg shadow-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Verificar Email</h1>
            <div className="bg-green-600/20 border border-green-600 text-green-300 p-3 rounded mb-4">
              📧 Hemos enviado un código de 6 dígitos a <br/>
              <strong>{form.email}</strong>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-600/20 border border-red-600 text-red-300 p-3 rounded text-center">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Código de verificación (6 dígitos)"
            className="w-full p-3 bg-neutral-700 rounded border border-neutral-600 focus:border-red-500 focus:outline-none text-center text-2xl tracking-widest"
            onChange={(e) => setVerificationCode(e.target.value)}
            value={verificationCode}
            maxLength="6"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed transition-colors text-white font-semibold py-3 rounded"
          >
            {loading ? "Verificando..." : "Verificar y Crear Cuenta"}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setVerificationStep(false)}
              className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              ← Volver al registro
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full p-6 space-y-6 text-white bg-neutral-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center">Crear Cuenta</h1>
        
        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-300 p-3 rounded text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            className="w-full p-3 bg-neutral-700 rounded border border-neutral-600 focus:border-red-500 focus:outline-none"
            onChange={handleChange}
            value={form.name}
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="w-full p-3 bg-neutral-700 rounded border border-neutral-600 focus:border-red-500 focus:outline-none"
            onChange={handleChange}
            value={form.email}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            className="w-full p-3 bg-neutral-700 rounded border border-neutral-600 focus:border-red-500 focus:outline-none"
            onChange={handleChange}
            value={form.password}
            required
          />
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            className="w-full p-3 bg-neutral-700 rounded border border-neutral-600 focus:border-red-500 focus:outline-none"
            onChange={handleChange}
            value={form.confirmPassword}
            required
          />
          
          <input
            type="text"
            name="avatar"
            placeholder="Avatar (opcional - ej: pc1.jpg)"
            className="w-full p-3 bg-neutral-700 rounded border border-neutral-600 focus:border-red-500 focus:outline-none"
            onChange={handleChange}
            value={form.avatar}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed transition-colors text-white font-semibold py-3 rounded"
        >
          {loading ? "Enviando código..." : "Crear Cuenta"}
        </button>
        
        <div className="text-center">
          <p className="text-gray-400 mb-3">¿Ya tienes cuenta?</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  );
}