import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ScrollReveal from "./ScrollReveal";
import ParallaxSection from "./ParallaxSection";

export default function HeroSection() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-[100px] pt-8 pb-16 lg:pb-32 bg-[#043873] min-h-screen overflow-hidden">
      <ParallaxSection background className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#043873] via-[#1E3A8A] to-[#043873] opacity-90"></div>
      </ParallaxSection>
      
      <div className="relative z-10">
        <ScrollReveal direction="up" delay={200}>
          <div className="max-w-2xl pt-20 lg:pt-40">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 lg:mb-8 leading-tight animate-fade-in-up">
              AI-Powered Legal Document Analysis
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-8 lg:mb-12 leading-relaxed animate-fade-in-up stagger-1">
              Advanced legal document analyzer with AI that helps lawyers and legal professionals review, analyze, and extract insights from contracts, agreements, and legal documents
            </p>
            <button className="bg-[#4F9CF9] text-white px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-lg font-semibold text-lg sm:text-xl flex items-center gap-3 w-full sm:w-auto justify-center hover-lift animate-fade-in-up stagger-2">
              Try LegalFlow free
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M0 5H10M5 0L10 5L5 10" stroke="white" strokeWidth="1"/>
              </svg>
            </button>
          </div>
        </ScrollReveal>
        
        <ParallaxSection speed={0.3} className="absolute top-1/2 right-0 lg:right-[-100px] transform -translate-y-1/2 hidden lg:block">
          <DotLottieReact
            src="https://lottie.host/2c1ecfe7-4da8-4f16-97b3-c7547b084cbd/b3HErlx4hk.lottie"
            loop={false}
            autoplay
            style={{ width: '700px', height: '700px' }}
          />
        </ParallaxSection>
      </div>
    </section>
  );
} 