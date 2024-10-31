import { Route, Routes } from "react-router-dom"
import { RouterUser } from "./user/RouterUser";
import { RouterPublic } from "./public/RouterPublic";
import { DesignRouter } from "./design/DesignRouter";

export const AppRouter = () => {



    return (
        <>
            <Routes>
                <Route path="/" element={<RouterUser />} />
                <Route path="/" element={<RouterPublic />} />
                {/* Rutas accesibles para todos los usuarios */}
                <Route path="/design/*" element={<DesignRouter />} />
            </Routes>
        </>
    )
}