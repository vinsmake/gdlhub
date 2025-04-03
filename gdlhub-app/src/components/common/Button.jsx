import React from "react";

const buttonVariants = {
  default: "bg-blue-600 text-white shadow-sm hover:bg-blue-600",
  primaryActive: "bg-gradient-to-r from-red-600 to-red-700 border border-red-800 text-white shadow transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:border-red-900",
  primaryInactive: "bg-yellow-600 text-white shadow hover:bg-blue-600",
  destructive: "bg-blue-600 text-primary shadow-sm hover:bg-red-600",
  outline: "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100",
  secondary: "bg-gray-600 text-white shadow-sm hover:bg-gray-600",
  ghost: "hover:bg-gray-100 text-gray-700",
  link: "text-blue-600 underline-offset-4 hover:underline",
};

const Button = ({ variant = "default", size = "default", className = "", children, ...props }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-red-500 h-9 px-4 py-2 ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Button;
