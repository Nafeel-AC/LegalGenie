import React from 'react';

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-[#4F9CF9]/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-[#FFE492]/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-80 left-1/4 w-3 h-3 bg-[#043873]/20 rounded-full animate-ping"></div>
      
      {/* Floating squares */}
      <div className="absolute top-60 right-1/3 w-5 h-5 bg-[#4F9CF9]/15 transform rotate-45 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-96 left-1/2 w-4 h-4 bg-[#FFE492]/25 transform rotate-45 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Floating triangles */}
      <div className="absolute top-32 right-1/4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-[#043873]/20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-72 left-1/3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-[#4F9CF9]/25 animate-bounce" style={{ animationDelay: '0.8s' }}></div>
      
      {/* More elements for variety */}
      <div className="absolute top-48 right-10 w-2 h-2 bg-[#FFE492]/40 rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute top-120 left-20 w-3 h-3 bg-[#043873]/15 transform rotate-45 animate-pulse" style={{ animationDelay: '1.2s' }}></div>
      <div className="absolute top-160 right-1/2 w-4 h-4 bg-[#4F9CF9]/20 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
    </div>
  );
};

export default FloatingElements; 