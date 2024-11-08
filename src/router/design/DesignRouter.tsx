import { Route, Routes } from "react-router-dom"
import { DesignLayout } from "../../pages/design/layout/DesignLayout"
import { DesignTopbar } from "../../pages/design/layout/DesignTopbar"
import { Design } from "@/pages/design/components/Design"

export const DesignRouter = () => {
    return (
        <>

            <DesignTopbar />
            <DesignLayout>

                
                <Routes>
                    <Route path="/:title" element={<Design />} />
                </Routes>


            </DesignLayout>


        </>
    )
}