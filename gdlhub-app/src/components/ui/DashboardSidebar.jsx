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
    Earth
} from "lucide-react";

import { data } from "../../data";
const { Sidebar } = data;

export const DashboardSidebar = () => {
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
                        to="/users"
                        className={({ isActive }) =>
                            `flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition ${isActive ? "nav__link--active" : ""}`
                        }
                    >
                        <Earth size={24} /> Comunidad
                    </NavLink>

                    <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
                        <Heart size={24} /> Seguidos
                    </a>
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
            </div>

        </aside>
    );
};
