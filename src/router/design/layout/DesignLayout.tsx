import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DesignSidebar } from "./DesignSidebar"

export const DesignLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <SidebarProvider>
                <DesignSidebar />
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </>
    )
}