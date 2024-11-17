import { Route, Routes } from "react-router-dom"
import { RouterUser } from "./user/RouterUser";
import { RouterPublic } from "./public/RouterPublic";
import { DesignRouter } from "./design/DesignRouter";

export const AppRouter = () => {

    // con esto podemos acceder al router a utilizar
    const authenticated = false;

    return (
        <>
            <Routes>


                {
                    // Aquí utilizamos diferente ruta segun la autenticacion del usuario.
                    authenticated ? (
                        <Route path="/*" element={<RouterUser />} />
                    ) : (
                        <Route path="/*" element={<RouterPublic />} />
                    )
                }
                <Route path="/design/*" element={<DesignRouter />} />
            </Routes>
        </>
    )
}