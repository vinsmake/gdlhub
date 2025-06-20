import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

/* Logos */
import {
  Eye,
  Heart,
  Bookmark,
  Home,
  List,
  MapPin,
  Percent,
  Settings,
  Utensils,
  Earth,
  HandHeart,
  LogIn,
  LogOut,
} from "lucide-react";

import { data } from "../../data";
const { Sidebar } = data;

export const DashboardSidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <aside className="w-full lg:w-1/5 bg-neutral-900 rounded-xl p-0 lg:p-4 text-lg text-white lg:sticky lg:top-4 self-start">
      {/* Logo + título */}
      <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 pt-[48px] lg:pt-0">
        <img src={Sidebar.logo} alt="Logo GDLHUB" className="w-16 h-16 rounded" />
        <span className="text-5xl lg:text-4xl font-semibold tracking-widest">{Sidebar.title}</span>
      </div>

      {/* Contenedor sticky SOLO para móvil */}
      <div className="fixed top-0 left-0 w-full z-10 bg-neutral-900 px-4 py-2 lg:static lg:w-auto">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible scrollbar-hide">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
            }
          >
            <Home size={24} /> Inicio
          </NavLink>

          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
            }
          >
            <Utensils size={24} /> Restaurantes
          </NavLink>

          <NavLink
            to="/recommendations"
            className={({ isActive }) =>
              `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
            }
          >
            <HandHeart size={24} /> Recomendaciones
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
            }
          >
            <Earth size={24} /> Comunidad
          </NavLink>

          <NavLink
            to="/follows"
            className={({ isActive }) =>
              `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
            }
          >
            <Heart size={24} /> Seguidos
          </NavLink>

          <NavLink
            to="/friends"
            className={({ isActive }) =>
              `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
            }
          >
            <HandHeart size={24} /> Amigos
          </NavLink>

          <NavLink
            to="/saved"
            className={({ isActive }) =>
              `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
            }
          >
            <Bookmark size={24} /> Guardado
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
            }
          >
            <Eye size={24} /> Busqueda
          </NavLink>
          <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
            <Settings size={24} /> Configuración
          </a>

          

        </nav>

      </div>
      {/* Usuario logueado */}
          {user ? (
            <div className="flex items-center gap-3 p-4 border-t border-neutral-700 mt-4">
              <img
                src={`${import.meta.env.VITE_API_BASE}/img/user/${user.avatar}`}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-white font-semibold">{user.name}</p>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="text-sm text-red-400 hover:text-red-300 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-neutral-700 mt-4">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition w-full text-left"
              >
                <LogIn size={24} /> Iniciar sesión
              </button>
            </div>
          )}
    </aside>
  );
};
