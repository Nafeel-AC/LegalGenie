import React, { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import logo1 from "./assets/logo-vector-1.svg";
import logo2 from "./assets/logo-vector-2.svg";
import logo3 from "./assets/logo-vector-3.svg";
import ScrollReveal from "./components/ScrollReveal";
import ParallaxSection from "./components/ParallaxSection";
import ScrollProgress from "./components/ScrollProgress";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white min-h-screen w-full relative" style={{ fontFamily: "'Varela Round', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
      <ScrollProgress />
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 lg:px-[100px] py-4 w-full bg-[#043873]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 bg-[#043873] transform rotate-45"></div>
          </div>
          <span className="text-white text-xl sm:text-2xl font-bold">LegalFlow</span>
        </div>
        
        {/* Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-white">Features</span>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-white">Use Cases</span>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-white">Documentation</span>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-white">Pricing</span>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </nav>
        
        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="bg-[#FFE492] text-[#043873] px-6 py-2 rounded-lg font-medium hover:bg-[#FFD700]">
            Login
          </button>
          <button className="bg-[#4F9CF9] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3B82F6] flex items-center gap-2">
            Try LegalFlow free
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={toggleMenu}
        ></div>
        
        {/* Sidebar */}
        <div className="absolute right-0 top-0 h-full w-80 bg-[#043873] shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button 
                className="text-white p-2"
                onClick={toggleMenu}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 px-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between cursor-pointer py-3 border-b border-white/20">
                  <span className="text-white text-lg">Features</span>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center justify-between cursor-pointer py-3 border-b border-white/20">
                  <span className="text-white text-lg">Use Cases</span>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center justify-between cursor-pointer py-3 border-b border-white/20">
                  <span className="text-white text-lg">Documentation</span>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center justify-between cursor-pointer py-3 border-b border-white/20">
                  <span className="text-white text-lg">Pricing</span>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </nav>
            
            {/* Mobile Buttons */}
            <div className="p-6 space-y-4">
              <button className="bg-[#FFE492] text-[#043873] w-full py-3 rounded-lg font-medium hover:bg-[#FFD700] text-lg">
                Login
              </button>
              <button className="bg-[#4F9CF9] text-white w-full py-3 rounded-lg font-medium hover:bg-[#3B82F6] flex items-center justify-center gap-2 text-lg">
                Try LegalFlow free
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-[100px] pt-8 pb-16 lg:pb-32 bg-[#043873] min-h-screen overflow-hidden">
        <ParallaxSection background className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#043873] via-[#1E3A8A] to-[#043873] opacity-90"></div>
        </ParallaxSection>
        
        <div className="relative z-10">
          <ScrollReveal direction="up" delay={200}>
            <div className="max-w-2xl pt-20 lg:pt-40">
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 lg:mb-8 leading-tight animate-fade-in-up">AI-Powered Legal Document Analysis</h1>
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

      {/* AI Document Analysis Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[220px] py-16 bg-white">
        <ScrollReveal direction="left" delay={100}>
          <div className="flex-1 flex items-center justify-center mb-8 lg:mb-0">
            <img src="/20943399.jpg" alt="Legal Document Analysis" className="max-w-full h-auto w-full lg:w-auto hover-lift" style={{ maxHeight: '400px', maxWidth: '100%' }} />
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="right" delay={300}>
          <div className="flex-1 max-w-2xl lg:ml-32 text-center lg:text-left">
            <div className="w-16 h-16 bg-[#FFE492] rounded-lg mb-6 flex items-center justify-center mx-auto lg:mx-0 animate-scale-in">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 8H24M8 16H24M8 24H16" stroke="#043873" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-6 animate-fade-in-up">AI-Powered Document Analysis</h2>
            <p className="text-base sm:text-lg text-[#212529]/70 mb-8 leading-relaxed animate-fade-in-up stagger-1">
              Upload contracts, agreements, and legal documents. Our AI instantly analyzes key terms, identifies risks, extracts important clauses, and provides comprehensive insights to streamline your legal review process.
            </p>
            <button className="bg-[#4F9CF9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 mx-auto lg:mx-0 hover-lift animate-fade-in-up stagger-2">
              Analyze Document
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
              </svg>
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* Work Together Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[220px] py-16 bg-white">
        <ScrollReveal direction="left" delay={200}>
          <div className="flex-1 max-w-2xl text-center lg:text-left mt-8 lg:mt-0">
            <div className="w-16 h-16 bg-[#FFE492] rounded-lg mb-6 flex items-center justify-center mx-auto lg:mx-0 animate-scale-in">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 8C18.21 8 20 6.21 20 4C20 1.79 18.21 0 16 0C13.79 0 12 1.79 12 4C12 6.21 13.79 8 16 8ZM24 12C26.21 12 28 10.21 28 8C28 5.79 26.21 4 24 4C21.79 4 20 5.79 20 8C20 10.21 21.79 12 24 12ZM8 12C10.21 12 12 10.21 12 8C12 5.79 10.21 4 8 4C5.79 4 4 5.79 4 8C4 10.21 5.79 12 8 12Z" fill="#043873"/>
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-6 animate-fade-in-up">Legal Team Collaboration</h2>
            <p className="text-base sm:text-lg text-[#212529]/70 mb-8 leading-relaxed animate-fade-in-up stagger-1">
              Enable seamless collaboration among legal teams with secure document sharing, real-time annotations, and version control. Share insights and analysis with colleagues while maintaining data security and compliance.
            </p>
            <button className="bg-[#4F9CF9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 mx-auto lg:mx-0 hover-lift animate-fade-in-up stagger-2">
              Collaborate Now
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
              </svg>
            </button>
          </div>
        </ScrollReveal>
        
        <ScrollReveal direction="right" delay={400}>
          <div className="flex-1 flex items-center justify-center lg:ml-16">
            <img src="/GeneratedImageJuly262025-10_46PM.jpeg" alt="Legal Collaboration" className="max-w-full h-auto w-full lg:w-auto hover-lift" style={{ maxHeight: '400px', maxWidth: '100%' }} />
          </div>
        </ScrollReveal>
      </section>

      {/* Customise Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[220px] py-16 bg-white">
        <div className="flex-1 flex items-center justify-center mb-8 lg:mb-0 lg:mr-8">
          <img src="/4452392.jpg" alt="Legal Customization" className="max-w-full h-auto w-full lg:w-auto" style={{ maxHeight: '400px', maxWidth: '100%' }} />
        </div>
        <div className="flex-1 max-w-2xl lg:ml-16 text-center lg:text-left">
          <div className="w-16 h-16 bg-[#FFE492] rounded-lg mb-6 flex items-center justify-center mx-auto lg:mx-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" fill="#043873"/>
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-6">Customize Legal Workflows</h2>
          <p className="text-base sm:text-lg text-[#212529]/70 mb-8 leading-relaxed">
            Tailor LegalFlow to your specific practice areas with customizable templates, automated workflows, and integration with your existing legal software. Create custom analysis rules and reporting formats.
          </p>
          <button className="bg-[#4F9CF9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 mx-auto lg:mx-0">
            Customize Now
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
            </svg>
          </button>
      </div>
      </section>

      {/* Your Work Everywhere Section */}
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-[#043873] text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Access Legal Documents Anywhere</h2>
        <p className="text-base sm:text-lg text-white/80 mb-8 max-w-4xl leading-relaxed">
          Access your legal documents and analysis from any device with cloud synchronization. LegalFlow works seamlessly across Windows, macOS, Linux, Android and iOS. Available as a web app and mobile applications for on-the-go legal work.
        </p>
        <button className="bg-[#4F9CF9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2">
          Access Now
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
          </svg>
        </button>
      </section>

      {/* Your Data Section */}
      <section className="relative px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-white min-h-screen">
        <div className="max-w-2xl pt-20 text-center lg:text-left">
          <div className="w-16 h-16 bg-[#FFE492] rounded-lg mb-6 flex items-center justify-center mx-auto lg:mx-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4C22.627 4 28 9.373 28 16C28 22.627 22.627 28 16 28C9.373 28 4 22.627 4 16C4 9.373 9.373 4 16 4Z" stroke="#043873" strokeWidth="2"/>
              <path d="M12 16L15 19L20 13" stroke="#043873" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-6">100% Secure & Compliant</h2>
          <p className="text-base sm:text-lg text-[#212529]/70 mb-8 leading-relaxed">
            Your legal documents and analysis are protected with enterprise-grade security. LegalFlow uses End-To-End Encryption (E2EE) and complies with legal industry standards including GDPR, HIPAA, and attorney-client privilege requirements.
          </p>
          <button className="bg-[#4F9CF9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 mx-auto lg:mx-0">
            Learn More
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
            </svg>
          </button>
        </div>
        <div className="absolute top-1/2 right-4 sm:right-8 lg:right-[20px] transform -translate-y-1/2 hidden lg:block">
          <img src="/Generated_Image_July_26__2025_-_11_12PM-removebg-preview (1).png" alt="Legal Security & Compliance" style={{ width: '900px', height: '900px', objectFit: 'contain' }} />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-white">
        <ScrollReveal direction="up" delay={100}>
          <div className="w-16 h-16 bg-[#FFE492] rounded-lg mb-6 flex items-center justify-center animate-scale-in">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" fill="#043873"/>
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-6 text-center animate-fade-in-up">Choose Your LegalFlow Plan</h2>
          <p className="text-base sm:text-lg text-[#212529]/70 mb-16 max-w-2xl text-center leading-relaxed animate-fade-in-up stagger-1">
            Whether you're a solo practitioner, law firm, or corporate legal department, LegalFlow has the perfect plan to streamline your document analysis and legal workflows.
          </p>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Free Plan */}
          <ScrollReveal direction="up" delay={200}>
            <div className="border border-[#FFE492] rounded-lg p-8 bg-white hover-lift">
            <h3 className="text-2xl font-semibold text-[#212529] mb-4">Starter</h3>
            <div className="text-4xl font-bold text-[#212529] mb-4">$0</div>
            <p className="text-lg text-[#212529] mb-8">Perfect for solo practitioners and small firms</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 9H18M9 0L18 9L9 18" stroke="#212529" strokeWidth="2"/>
                </svg>
                <span className="text-[#212529]">Sync unlimited devices</span>
              </li>
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 9H18M9 0L18 9L9 18" stroke="#212529" strokeWidth="2"/>
                </svg>
                <span className="text-[#212529]">10 GB monthly uploads</span>
              </li>
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 9H18M9 0L18 9L9 18" stroke="#212529" strokeWidth="2"/>
                </svg>
                <span className="text-[#212529]">200 MB max. note size</span>
              </li>
            </ul>
            <button className="w-full border border-[#FFE492] text-[#212529] py-4 rounded-lg font-semibold">Get Started</button>
          </div>
          </ScrollReveal>

          {/* Personal Plan */}
          <ScrollReveal direction="up" delay={400}>
            <div className="bg-[#043873] rounded-lg p-8 shadow-lg hover-lift">
            <h3 className="text-2xl font-semibold text-white mb-4">Professional</h3>
            <div className="text-4xl font-bold text-[#FFE492] mb-4">$49.99</div>
            <p className="text-lg text-white mb-8">Ideal for growing law firms and legal teams</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 9H18M9 0L18 9L9 18" stroke="#FFE492" strokeWidth="2"/>
                </svg>
                <span className="text-white">Sync unlimited devices</span>
              </li>
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 9H18M9 0L18 9L9 18" stroke="#FFE492" strokeWidth="2"/>
                </svg>
                <span className="text-white">10 GB monthly uploads</span>
              </li>
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 9H18M9 0L18 9L9 18" stroke="#FFE492" strokeWidth="2"/>
                </svg>
                <span className="text-white">200 MB max. note size</span>
              </li>
            </ul>
            <button className="w-full bg-[#4F9CF9] text-white py-4 rounded-lg font-semibold">Get Started</button>
          </div>
          </ScrollReveal>

          {/* Organization Plan */}
          <ScrollReveal direction="up" delay={600}>
            <div className="border border-[#FFE492] rounded-lg p-8 bg-white hover-lift">
            <h3 className="text-2xl font-semibold text-[#212529] mb-4">Enterprise</h3>
            <div className="text-4xl font-bold text-[#212529] mb-4">$199.99</div>
            <p className="text-lg text-[#212529] mb-8">For large law firms and corporate legal departments</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 9H18M9 0L18 9L9 18" stroke="#212529" strokeWidth="2"/>
                </svg>
                <span className="text-[#212529]">Sync unlimited devices</span>
              </li>
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 9H18M9 0L18 9L9 18" stroke="#212529" strokeWidth="2"/>
                </svg>
                <span className="text-[#212529]">10 GB monthly uploads</span>
              </li>
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M0 9H18M9 0L18 9L9 18" stroke="#212529" strokeWidth="2"/>
                </svg>
                <span className="text-[#212529]">200 MB max. note size</span>
              </li>
            </ul>
            <button className="w-full border border-[#FFE492] text-[#212529] py-4 rounded-lg font-semibold">Get Started</button>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Sponsors Section */}
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-white">
        <div className="w-16 h-16 bg-[#FFE492] rounded-lg mb-6 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" fill="#043873"/>
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-16 text-center">Trusted by Leading Legal Firms</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl gap-8 sm:gap-4">
          <div className="text-xl sm:text-2xl font-bold text-black">Baker McKenzie</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-600">DLA Piper</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-600">Clifford Chance</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">Skadden</div>
        </div>
      </section>

      {/* Apps Integration Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-[#043873]">
        <div className="flex-1 max-w-2xl text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Integrate with Your Legal Software Stack</h2>
          <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed">
            LegalFlow integrates seamlessly with your existing legal software. Connect with Clio, PracticePanther, MyCase, and over 100+ legal applications to streamline your entire workflow.
          </p>
          <button className="bg-[#4F9CF9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 mx-auto lg:mx-0">
            View Integrations
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center lg:ml-16">
          <img src="/GeneratedImageJuly272025-1_59PM-removebg-preview.png" alt="Legal Software Integrations" className="max-w-full h-auto w-full lg:w-auto" style={{ maxHeight: '400px', maxWidth: '100%' }} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-white">
        <ScrollReveal direction="up" delay={100}>
          <div className="w-16 h-16 bg-[#FFE492] rounded-lg mb-6 flex items-center justify-center animate-scale-in">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" fill="#043873"/>
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-16 text-center animate-fade-in-up">What Legal Professionals Say</h2>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Testimonial 1 */}
          <ScrollReveal direction="up" delay={200}>
            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200 hover-lift">
            <div className="mb-8">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                <path d="M10 0L20 15L10 30H0L10 15L0 0H10ZM30 0L40 15L30 30H20L30 15L20 0H30Z" fill="#043873"/>
              </svg>
            </div>
            <p className="text-lg text-[#212529] mb-8 leading-relaxed">
              LegalFlow has revolutionized our contract review process. The AI analysis is incredibly accurate and saves us hours of manual work. It's become an essential tool for our legal team.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-[#212529]">Sarah Chen, Esq.</h4>
                <p className="text-sm text-[#212529]/70">Senior Partner, Corporate Law</p>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Testimonial 2 */}
          <ScrollReveal direction="up" delay={400}>
            <div className="bg-[#043873] rounded-lg p-8 shadow-lg hover-lift">
            <div className="mb-8">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                <path d="M10 0L20 15L10 30H0L10 15L0 0H10ZM30 0L40 15L30 30H20L30 15L20 0H30Z" fill="white"/>
              </svg>
            </div>
            <p className="text-lg text-white mb-8 leading-relaxed">
              The security and compliance features give us complete confidence. LegalFlow's AI identifies risks we might miss and provides comprehensive analysis in minutes, not hours.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Michael Rodriguez, JD</h4>
                <p className="text-sm text-white/70">Managing Partner, Litigation</p>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Testimonial 3 */}
          <ScrollReveal direction="up" delay={600}>
            <div className="bg-[#043873] rounded-lg p-8 shadow-lg hover-lift">
            <div className="mb-8">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                <path d="M10 0L20 15L10 30H0L10 15L0 0H10ZM30 0L40 15L30 30H20L30 15L20 0H30Z" fill="white"/>
              </svg>
            </div>
            <p className="text-lg text-white mb-8 leading-relaxed">
              Integration with our existing legal software was seamless. LegalFlow has increased our team's productivity by 300% and improved our document analysis accuracy significantly.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Emily Thompson, Esq.</h4>
                <p className="text-sm text-white/70">General Counsel, Tech Startup</p>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </div>

        {/* Slider Dots */}
        <div className="flex gap-3 mt-12">
          <div className="w-3 h-3 bg-[#4F9CF9] rounded-full"></div>
          <div className="w-3 h-3 bg-[#043873] rounded-full"></div>
          <div className="w-3 h-3 bg-[#4F9CF9] rounded-full"></div>
        </div>
      </section>

      {/* Free Trial Section */}
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-[220px] py-16 bg-[#043873] text-center">
        <ScrollReveal direction="up" delay={100}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up">Try LegalFlow today</h2>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed animate-fade-in-up stagger-1">
            Get started for free. Add your whole team as your needs grow.
          </p>
          <button className="bg-[#4F9CF9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 mb-8 w-full sm:w-auto hover-lift animate-fade-in-up stagger-2 mx-auto">
            Try LegalFlow free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
            </svg>
          </button>
          <p className="text-lg sm:text-xl text-white/80 animate-fade-in-up stagger-3">On a big team? Contact sales</p>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="bg-[#043873] px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-8 lg:gap-0">
          {/* Logo and Description */}
          <div className="max-w-xs text-center lg:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 6L8 10L4 14" stroke="#043873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6L12 10L8 14" stroke="#043873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6L16 10L12 14" stroke="#043873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="text-white text-xl sm:text-2xl font-bold ml-2">LegalFlow</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              LegalFlow revolutionizes legal document analysis with AI-powered insights, helping legal professionals work smarter and faster with advanced automation and compliance features.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h3 className="text-lg font-bold text-white">Product</h3>
            <a href="#" className="text-white/70 hover:text-white">Overview</a>
            <a href="#" className="text-white hover:text-white">Pricing</a>
            <a href="#" className="text-white/70 hover:text-white">Customer stories</a>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h3 className="text-lg font-bold text-white">Resources</h3>
            <a href="#" className="text-white/70 hover:text-white">Blog</a>
            <a href="#" className="text-white/70 hover:text-white">Guides & tutorials</a>
            <a href="#" className="text-white/70 hover:text-white">Help center</a>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h3 className="text-lg font-bold text-white">Company</h3>
            <a href="#" className="text-white/70 hover:text-white">About us</a>
            <a href="#" className="text-white/70 hover:text-white">Careers</a>
            <a href="#" className="text-white/70 hover:text-white">Media kit</a>
      </div>

          {/* Try It Today */}
          <div className="max-w-xs text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Try It Today</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Get started for free. Add your whole team as your needs grow.
            </p>
            <button className="bg-[#4F9CF9] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto lg:mx-0">
              Start today
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#2E4E73] gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-white/70 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="white"/>
              </svg>
              <span>English</span>
              <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path d="M0 0L6 6L12 0" stroke="white" strokeWidth="1"/>
              </svg>
            </div>
            <a href="#" className="hover:text-white">Terms & privacy</a>
            <a href="#" className="hover:text-white">Security</a>
            <a href="#" className="hover:text-white">Status</a>
            <span>©2024 LegalFlow Inc.</span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-8">
            <a href="#" className="text-white/70 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="text-white/70 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="text-white/70 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
