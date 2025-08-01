import React from "react";

export default function CTAButton({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary",
  size = "md",
  fullWidth = false 
}) {
  const baseClasses = "font-semibold rounded-lg flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95";
  
  const variantClasses = {
    primary: "bg-[#4F9CF9] text-white hover:bg-[#3B82F6] hover:shadow-lg hover:shadow-[#4F9CF9]/30",
    secondary: "bg-[#FFE492] text-[#043873] hover:bg-[#FFD700] hover:shadow-lg hover:shadow-[#FFE492]/30",
    outline: "border border-[#FFE492] text-[#212529] hover:bg-[#FFE492] hover:shadow-md"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const widthClass = fullWidth ? "w-full justify-center" : "";
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  return (
    <button className={classes} onClick={onClick}>
      {children}
      <svg 
        width="14" 
        height="14" 
        viewBox="0 0 14 14" 
        fill="none"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M0 7H14M7 0L14 7L7 14" stroke="currentColor" strokeWidth="1"/>
      </svg>
    </button>
  );
} 