import React from "react";

export default function IconBox({ children, className = "" }) {
  return (
    <div className={`w-16 h-16 bg-[#FFE492] rounded-lg flex items-center justify-center mx-auto lg:mx-0 animate-scale-in ${className}`}>
      {children}
    </div>
  );
} 