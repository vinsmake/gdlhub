import { DashboardMain } from "@ui/DashboardMain"
import { DashboardSidebar } from "@ui/DashboardSidebar"


export const Dashboard = ({ children }) => {
    return (
        <>
            <div className="w-[99%] h-[99%] flex p-4 gap-4">
                    <DashboardSidebar />
                    <DashboardMain />
            </div>
        </>
    )
}