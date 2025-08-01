import React from "react";
import ScrollReveal from "./ScrollReveal";

const PricingCard = ({ plan, price, description, features, isPopular = false, delay }) => {
  return (
    <ScrollReveal direction="up" delay={delay}>
      <div className={`border border-[#FFE492] rounded-lg p-8 ${isPopular ? 'bg-[#043873] shadow-lg' : 'bg-white'} hover-lift transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl group relative overflow-visible`}>
        {/* Popular badge */}
        {isPopular && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#FFE492] text-[#043873] px-6 py-2 rounded-full text-sm font-semibold shadow-lg z-10">
            Most Popular
          </div>
        )}
        
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isPopular ? 'from-[#4F9CF9]/10 to-[#FFE492]/10' : 'from-[#FFE492]/5 to-[#4F9CF9]/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        <div className="relative z-10">
          <h3 className={`text-2xl font-semibold ${isPopular ? 'text-white' : 'text-[#212529]'} mb-4 group-hover:scale-105 transition-transform duration-300`}>
            {plan}
          </h3>
          <div className={`text-4xl font-bold ${isPopular ? 'text-[#FFE492]' : 'text-[#212529]'} mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {price}
          </div>
          <p className={`text-lg ${isPopular ? 'text-white' : 'text-[#212529]'} mb-8 group-hover:text-opacity-90 transition-all duration-300`}>
            {description}
          </p>
          <ul className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 18 18" 
                  fill="none"
                  className={`transition-all duration-300 group-hover/item:scale-125 ${isPopular ? 'text-[#FFE492]' : 'text-[#212529]'}`}
                >
                  <path d="M0 9H18M9 0L18 9L9 18" stroke={isPopular ? "#FFE492" : "#212529"} strokeWidth="2"/>
                </svg>
                <span className={`${isPopular ? 'text-white' : 'text-[#212529]'} group-hover/item:text-[#4F9CF9] transition-colors duration-300`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
          <button className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 ${
            isPopular 
              ? 'bg-[#4F9CF9] text-white hover:bg-[#3B82F6] hover:shadow-[#4F9CF9]/30' 
              : 'border border-[#FFE492] text-[#212529] hover:bg-[#FFE492] hover:border-[#FFD700]'
          }`}>
            Get Started
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default function PricingSection() {
  const plans = [
    {
      plan: "Starter",
      price: "$0",
      description: "Perfect for solo practitioners and small firms",
      features: [
        "Sync unlimited devices",
        "10 GB monthly uploads",
        "200 MB max. note size"
      ],
      isPopular: false
    },
    {
      plan: "Professional",
      price: "$49.99",
      description: "Ideal for growing law firms and legal teams",
      features: [
        "Sync unlimited devices",
        "10 GB monthly uploads",
        "200 MB max. note size"
      ],
      isPopular: true
    },
    {
      plan: "Enterprise",
      price: "$199.99",
      description: "For large law firms and corporate legal departments",
      features: [
        "Sync unlimited devices",
        "10 GB monthly uploads",
        "200 MB max. note size"
      ],
      isPopular: false
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
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-6 text-center animate-fade-in-up group-hover:text-[#4F9CF9] transition-colors duration-300">
          Choose Your LegalFlow Plan
        </h2>
        <p className="text-base sm:text-lg text-[#212529]/70 mb-16 max-w-2xl text-center leading-relaxed animate-fade-in-up stagger-1 group-hover:text-[#212529]/90 transition-colors duration-300">
          Whether you're a solo practitioner, law firm, or corporate legal department, LegalFlow has the perfect plan to streamline your document analysis and legal workflows.
        </p>
      </ScrollReveal>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mt-8">
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.plan}
            {...plan}
            delay={200 + (index * 200)}
          />
        ))}
      </div>
    </section>
  );
} 