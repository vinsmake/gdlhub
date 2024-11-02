import { useParams, Navigate } from "react-router-dom";
import { DesignButtons } from '../components'; //index.ts

// typing
type ComponentMap = {
    [key: string]: React.FC; // Cada componente es un componente funcional de React
};

// Mapeo de componentes
const componentMap: ComponentMap = {
    buttons: DesignButtons,
};

export const Design = () => {
    // Obtiene el parámetro `title` de la URL
    const { title } = useParams<{ title: string }>();

    // Verifica si el título existe en el mapeo de componentes
    const ComponentToRender = title && componentMap[title.toLowerCase()] 
        ? componentMap[title.toLowerCase()] 
        : null; // Si no existe, se asigna null

    // Redirige si el componente no existe
    if (!ComponentToRender) {
        return <Navigate to='/design' />; // Cambia '/not-found' a la ruta que desees
    }

    return (
        <div>
            <h2>Design</h2>
            {/* Renderiza el componente correspondiente */}
            <ComponentToRender />
        </div>
    );
};
