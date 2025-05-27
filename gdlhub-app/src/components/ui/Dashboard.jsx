import { DashboardMain } from "@ui/DashboardMain"
import { DashboardSidebar } from "@ui/DashboardSidebar"


export const Dashboard = ({ children }) => {
    return (
        <>
            <div className="flex flex-col lg:flex-row w-full min-h-screen p-4 gap-4">
                <DashboardSidebar />
                <DashboardMain />
            </div>

        </>
    )
}