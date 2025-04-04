export const DashboardMain = ({ children }) => {
    return (
      <div className="w-4/5 bg-neutral-800 rounded-3xl p-6 text-white space-y-6">
        {/* Saludo al usuario */}
        <h1 className="text-2xl font-semibold">
          ¡Hola, Enrique Plascencia!
        </h1>
  
        {/* Contenido principal */}
        <div>{children}</div>
      </div>
    );
  };
  