import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"

// DATA, Group y Component son types
import { DesignSidebarData, Group, Component } from "../data"
const { groups } = DesignSidebarData;
// default to use
const route = "/design/";

export const DesignSidebar = () => {

    return (

        <Sidebar>
            <SidebarContent>

                {/* Aquí se hace un mappeo dentro de un mappeo, donde el primero mappea los grupos, mientras que dentro de cada grupo se mappean los componentes */}
                {
                    groups.map((group: Group) => (
                        <SidebarGroup key={group.name}>
                            <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((component: Component) => (
                                        <SidebarMenuItem key={component.title}>
                                            <SidebarMenuButton asChild>
                                                <NavLink to={route + component.title}>
                                                    <component.icon />
                                                    <span>{component.title}</span>
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                }
            </SidebarContent>
        </Sidebar>
    )

}