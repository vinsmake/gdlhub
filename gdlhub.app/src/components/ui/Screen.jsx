export const Screen = ({children }) => {
    return (
      <div className={`w-screen h-screen flex justify-center items-center color--bg-neutral-900`}>
        {children}
      </div>
    );
  };
  