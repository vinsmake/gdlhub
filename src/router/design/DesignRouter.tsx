import { Route, Routes } from "react-router-dom"
import { DesignLayout } from "./layout/DesignLayout"
import { DesignButton } from "./pages/DesignButton"

export const DesignRouter = () => {
    return (
        <>
            <DesignLayout>
                <Routes>
                    <Route path="button" element={<DesignButton />} />
                </Routes>
            </DesignLayout>


        </>
    )
}