import React from "react";
import ScrollReveal from "./ScrollReveal";

export default function FeatureSection({ 
  imageSrc, 
  imageAlt, 
  icon, 
  title, 
  description, 
  buttonText, 
  reverse = false,
  delay = 100 
}) {
  const ImageSection = () => (
    <ScrollReveal direction={reverse ? "right" : "left"} delay={delay}>
      <div className="flex-1 flex items-center justify-center mb-8 lg:mb-0 group">
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105">
          <img 
            src={imageSrc} 
            alt={imageAlt} 
            className="max-w-full h-auto w-full lg:w-auto transition-transform duration-700 ease-in-out group-hover:scale-110" 
            style={{ maxHeight: '400px', maxWidth: '100%' }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </ScrollReveal>
  );

  const ContentSection = () => (
    <ScrollReveal direction={reverse ? "left" : "right"} delay={delay + 200}>
      <div className={`flex-1 max-w-2xl ${reverse ? 'lg:mr-32' : 'lg:ml-32'} text-center lg:text-left group`}>
        <div className="w-16 h-16 bg-[#FFE492] rounded-lg mb-6 flex items-center justify-center mx-auto lg:mx-0 animate-scale-in hover:scale-110 hover:rotate-3 transition-all duration-300 ease-in-out hover:shadow-lg">
          <div className="transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-6 animate-fade-in-up group-hover:text-[#4F9CF9] transition-colors duration-300">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-[#212529]/70 mb-8 leading-relaxed animate-fade-in-up stagger-1 group-hover:text-[#212529]/90 transition-colors duration-300">
          {description}
        </p>
        <div className="group/button">
          <button className="bg-[#4F9CF9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 mx-auto lg:mx-0 hover-lift animate-fade-in-up stagger-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-[#4F9CF9]/30 active:scale-95 group-hover/button:bg-[#3B82F6]">
            {buttonText}
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 14 14" 
              fill="none"
              className="transition-transform duration-300 group-hover/button:translate-x-1"
            >
              <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
            </svg>
          </button>
        </div>
      </div>
    </ScrollReveal>
  );

  return (
    <section className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center justify-between px-4 sm:px-6 lg:px-[220px] py-16 bg-white hover:bg-gray-50/50 transition-colors duration-500`}>
      <ImageSection />
      <ContentSection />
    </section>
  );
} 