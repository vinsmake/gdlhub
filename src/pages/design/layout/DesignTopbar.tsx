import logo from '../../../data/favicon.png'

export const DesignTopbar = () => {
  return (
    <>
      <header className="bg-gray border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center">
                <img
                  className="h-12 w-auto"
                  src={logo}
                  alt="Logo"
                />
              <h1 className="text-xl mx-4">
                GdlHub Sistema de Diseño
              </h1>
              <img
                  className="h-12 w-auto"
                  src={logo}
                  alt="Logo"
                />
            </div>
            <div className="md:hidden">
            </div>
          </div>
        </div>
      </header>
    </>
  )
}