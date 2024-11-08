// Define las interfaces
export interface Component {
    title: string;
    icon: React.ComponentType;
}

export interface Group {
    name: string;
    items: Component[];
}

export interface DesignSidebarData {
    groups: Group[];
}

// Define los datos con los tipos
import { Power, ChefHat } from "lucide-react"
export const DesignSidebarData: DesignSidebarData = {
    groups: [
        {
            name: 'Design Tokens',
            items: [
                {
                    title: "fonts",
                    icon: Power,
                },
                {
                    title: "colors",
                    icon: ChefHat,
                },
            ]
        },
        {
            name: 'Components',
            items: [
                {
                    title: "buttons",
                    icon: Power,
                },
                {
                    title: "Icons",
                    icon: ChefHat,
                },
            ]
        },
        {
            name: 'Composite Components',
            items: [
                {
                    title: "buttons",
                    icon: Power,
                },
                {
                    title: "Icons",
                    icon: ChefHat,
                },
            ]
        },
        {
            name: 'Layout Components',
            items: [
                {
                    title: "buttons",
                    icon: Power,
                },
                {
                    title: "Icons",
                    icon: ChefHat,
                },
            ]
        },
        {
            name: 'Page Components',
            items: [
                {
                    title: "buttons",
                    icon: Power,
                },
                {
                    title: "Icons",
                    icon: ChefHat,
                },
            ]
        },
    ]
};
