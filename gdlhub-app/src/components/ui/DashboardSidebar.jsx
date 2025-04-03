import {
    Eye,
    Heart,
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
        <aside className="w-1/5 rounded-xl p-4 text-lg">

            {/* Logo + título */}
            <div className="flex items-center gap-3 mb-6">
                <img src={Sidebar.logo} alt="Logo GDLHUB" className="w-16 h-16 rounded" />
                <span className="text-3xl font-semibold tracking-widest">{Sidebar.title}</span>
            </div>

            {/* Navegación */}
            <nav className="flex flex-col gap-2">
                <a href="#" className="flex items-center gap-2 nav__link nav__link--active rounded-xl px-3 py-2 transition">
                    <Home size={24} /> Inicio
                </a>
                <a href="#" className="flex items-center gap-2 nav__link rounded-xl px-3 py-2 transition">
                    <Utensils size={24} /> Restaurantes
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
                    <Heart size={24} /> Favoritos
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
