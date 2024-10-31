import { Route, Routes } from "react-router-dom"
import { DesignLayout } from "../../pages/design/layout/DesignLayout"
import { DesignTopbar } from "../../pages/design/layout/DesignTopbar"
import { DesignButton } from "@/pages/design/components/DesignButton"

export const DesignRouter = () => {
    return (
        <>

            <DesignTopbar />
            <DesignLayout>
                <Routes>
                    <Route path="buttons" element={<DesignButton />} />
                </Routes>
            </DesignLayout>


        </>
    )
}