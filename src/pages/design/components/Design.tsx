import { useParams, Navigate } from "react-router-dom";
import "../design.css"
import { DesignBadges, DesignButtons, DesignCarousel } from '../components'; //index.ts

/* 
NOTA: Este componente toma componentes del index.ts y se mapean en componentMap, de manera que al crear un nuevo componente, este debe ser agregado al mapeo. si nosotros tenemos por ejemplo buttons: DesignButtons, la web sera /design/buttons, en el data.ts que se encuentra en design/layout/data.ts encontramos DesignSidebarData, que contiene todos los datos de creacion del router.

si tenemos por ejemplo:

{
    title: "buttons",
    icon: Power,
},

Entonces designSidebar.tsx creara /design/Buttons

Mientras que este archivo (Design.tsx) creara el componente dentro de /buttons/, mediante componentMap utilizando buttons: DesignButtons,

*/


// typing
type ComponentMap = {
    [key: string]: React.FC; // Cada componente es un componente funcional de React
};

// Mapeo de componentes
const componentMap: ComponentMap = {
    buttons: DesignButtons,
    badges: DesignBadges,
    carousel: DesignCarousel,
};

export const Design = () => {
    // Obtiene el parámetro `title` de la URL
    const { title } = useParams<{ title: string }>();

    // Verifica si el título existe en el mapeo de componentes
    const ComponentToRender = title && componentMap[title.toLowerCase()] 
        ? componentMap[title.toLowerCase()] 
        : null; // Si no existe, se asigna null

    // Redirige si el componente existe
    if (!ComponentToRender) {
        return <Navigate to='/design' />; // Cambia '/not-found' a la ruta que desees
    }

    /* Renderiza el componente correspondiente */
    return (
        <div className="design">
            <ComponentToRender />
        </div>
    );
};
