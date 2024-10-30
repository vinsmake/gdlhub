import { Route, Routes } from "react-router-dom"
import { RouterUser } from "../pages/user/RouterUser";
import { RouterPublic } from "../pages/public/RouterPublic";
import { DesignRouter } from "../pages/design/DesignRouter";

export const AppRouter = () => {

    const authentication = false;  // Aquí puedes modificar el estado de autenticación.

    return (
        <>
            <Routes>
                
                {
                    /* Aqui hacemos que, segun si se encuentra autenticado o no, renderice la ruda adecuada. */
                    authentication ? (
                        <Route path="/*" element={<RouterUser />} />
                    ) : (
                        <Route path="/*" element={<RouterPublic />} />
                    )
                }

                {/* Rutas accesibles para todos los usuarios */}
                <Route path="/design" element={<DesignRouter />} />

            </Routes>
        </>
    )
}