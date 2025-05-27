import { NavLink } from "react-router-dom";

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
} from "lucide-react";

import { data } from "../../data";
const { Sidebar } = data;

export const DashboardSidebar = () => {
    return (
        <aside className="w-full lg:w-1/5 bg-neutral-900 rounded-xl p-4 text-lg text-white">
            {/* Logo + título */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <img src={Sidebar.logo} alt="Logo GDLHUB" className="w-16 h-16 rounded" />
                <span className="text-3xl font-semibold tracking-widest">{Sidebar.title}</span>
            </div>


            {/* Navegación */}
            <nav className="flex flex-wrap lg:flex-col gap-2">
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
                    to="/users"
                    className={({ isActive }) =>
                        `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
                    }
                >
                    <Heart size={24} /> Amigos
                </NavLink>

                <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
                    <Bookmark size={24} /> Guardados
                </a>

                <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
                    <List size={24} /> Categorías
                </a>
                <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
                    <Percent size={24} /> Ofertas
                </a>
                <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
                    <MapPin size={24} /> Mapa
                </a>

                <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
                    <Eye size={24} /> Visitados
                </a>
                <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
                    <Settings size={24} /> Configuración
                </a>
            </nav>
        </aside>
    );
};
