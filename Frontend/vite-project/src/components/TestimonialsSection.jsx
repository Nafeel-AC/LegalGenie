import React from "react";
import ScrollReveal from "./ScrollReveal";

const TestimonialCard = ({ quote, author, role, avatar, isHighlighted = false, delay }) => {
  return (
    <ScrollReveal direction="up" delay={delay}>
      <div className={`rounded-lg p-8 shadow-lg border border-gray-200 hover-lift transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden h-full flex flex-col ${
        isHighlighted ? 'bg-[#043873]' : 'bg-white'
      }`}>
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isHighlighted ? 'from-[#4F9CF9]/10 to-[#FFE492]/10' : 'from-[#FFE492]/5 to-[#4F9CF9]/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
              <path d="M10 0L20 15L10 30H0L10 15L0 0H10ZM30 0L40 15L30 30H20L30 15L20 0H30Z" fill={isHighlighted ? "white" : "#043873"}/>
            </svg>
          </div>
          <p className={`text-lg mb-8 leading-relaxed group-hover:text-opacity-90 transition-all duration-300 flex-grow ${
            isHighlighted ? 'text-white' : 'text-[#212529]'
          }`}>
            {quote}
          </p>
          <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform duration-300 mt-auto">
            <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className={`font-semibold group-hover:text-[#4F9CF9] transition-colors duration-300 truncate ${isHighlighted ? 'text-white' : 'text-[#212529]'}`}>
                {author}
              </h4>
              <p className={`text-sm group-hover:text-opacity-80 transition-all duration-300 truncate ${isHighlighted ? 'text-white/70' : 'text-[#212529]/70'}`}>
                {role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "LegalFlow has revolutionized our contract review process. The AI analysis is incredibly accurate and saves us hours of manual work. It's become an essential tool for our legal team.",
      author: "Sarah Chen, Esq.",
      role: "Senior Partner, Corporate Law",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isHighlighted: false
    },
    {
      quote: "The security and compliance features give us complete confidence. LegalFlow's AI identifies risks we might miss and provides comprehensive analysis in minutes, not hours.",
      author: "Michael Rodriguez, JD",
      role: "Managing Partner, Litigation",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isHighlighted: true
    },
    {
      quote: "Integration with our existing legal software was seamless. LegalFlow has increased our team's productivity by 300% and improved our document analysis accuracy significantly.",
      author: "Emily Thompson, Esq.",
      role: "General Counsel, Tech Startup",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isHighlighted: true
    }
  ];

  return (
    <section className="flex flex-col items-center px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-white">
      <ScrollReveal direction="up" delay={100}>
        <div className="w-16 h-16 bg-[#FFE492] rounded-lg mb-6 flex items-center justify-center animate-scale-in hover:scale-110 hover:rotate-3 transition-all duration-300 ease-in-out hover:shadow-lg group">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 32 32" 
            fill="none"
            className="transition-transform duration-300 group-hover:scale-110"
          >
            <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" fill="#043873"/>
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-16 text-center animate-fade-in-up group-hover:text-[#4F9CF9] transition-colors duration-300">
          What Legal Professionals Say
        </h2>
      </ScrollReveal>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl items-stretch">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.author}
            {...testimonial}
            delay={200 + (index * 200)}
          />
        ))}
      </div>

      {/* Slider Dots */}
      <div className="flex gap-3 mt-12">
        <div className="w-3 h-3 bg-[#4F9CF9] rounded-full hover:scale-125 transition-transform duration-300 cursor-pointer"></div>
        <div className="w-3 h-3 bg-[#043873] rounded-full hover:scale-125 transition-transform duration-300 cursor-pointer"></div>
        <div className="w-3 h-3 bg-[#4F9CF9] rounded-full hover:scale-125 transition-transform duration-300 cursor-pointer"></div>
      </div>
    </section>
  );
} 