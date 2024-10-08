import { Route, Routes } from "react-router-dom";
import { RouterUser } from "../pages/user/RouterUser";
import { RouterPublic } from "../pages/public/RouterPublic";

export const AppRouter = () => {

    const authentication = false;  // Aquí puedes modificar el estado de autenticación.

    return (
        <>
            <h1>Router</h1>
            <Routes>
                {
                    authentication ? (
                        <Route path="/*" element={<RouterUser />} />
                    ) : (
                        <Route path="/*" element={<RouterPublic />} />
                    )
                }
            </Routes>
        </>
    )
}