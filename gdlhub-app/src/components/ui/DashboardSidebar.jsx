import { Link } from "react-router-dom";

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
        <aside className="sticky top-4 self-start w-1/5 rounded-xl p-4 text-lg text-white">

            {/* Logo + título */}
            <div className="flex items-center gap-3 mb-6">
                <img src={Sidebar.logo} alt="Logo GDLHUB" className="w-16 h-16 rounded" />
                <span className="text-3xl font-semibold tracking-widest">{Sidebar.title}</span>
            </div>

            {/* Navegación */}
            <nav className="flex flex-col gap-2">
                <Link to="/" className="flex items-center gap-2 nav__link nav__link--active rounded-xl px-3 py-2 transition">
                    <Home size={24} /> Inicio
                </Link>
                <Link
                    to="/restaurants"
                    className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition"
                >
                    <Utensils size={24} /> Restaurantes
                </Link>
                <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
                    <Heart size={24} /> Amigos
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
        </aside>
    );
};
