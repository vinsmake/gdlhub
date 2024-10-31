import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DesignSidebar } from "./DesignSidebar";

export const DesignLayout = ({ children }: { children: React.ReactNode }) => {
    return (

        <SidebarProvider>
            <DesignSidebar />
            <SidebarTrigger />
            {/* Renderiza el contenido de las rutas secundarias aquí */}
            <main>
                {children}
            </main>
        </SidebarProvider>
    );
};
