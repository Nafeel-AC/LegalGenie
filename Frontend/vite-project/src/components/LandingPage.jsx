import React from "react";
import ScrollProgress from "./ScrollProgress";
import Header from "./Header";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import PricingSection from "./PricingSection";
import TestimonialsSection from "./TestimonialsSection";
import Footer from "./Footer";
import ScrollReveal from "./ScrollReveal";
import CTAButton from "./CTAButton";
import IconBox from "./IconBox";

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen w-full relative" style={{ fontFamily: "'Varela Round', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
      <ScrollProgress />
      <Header />
      <HeroSection />

      {/* AI Document Analysis Section */}
      <FeatureSection
        imageSrc="/20943399.jpg"
        imageAlt="Legal Document Analysis"
        icon={
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 8H24M8 16H24M8 24H16" stroke="#043873" strokeWidth="2"/>
          </svg>
        }
        title="AI-Powered Document Analysis"
        description="Upload contracts, agreements, and legal documents. Our AI instantly analyzes key terms, identifies risks, extracts important clauses, and provides comprehensive insights to streamline your legal review process."
        buttonText="Analyze Document"
        delay={100}
      />

      {/* Work Together Section */}
      <FeatureSection
        imageSrc="/GeneratedImageJuly262025-10_46PM.jpeg"
        imageAlt="Legal Collaboration"
        icon={
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 8C18.21 8 20 6.21 20 4C20 1.79 18.21 0 16 0C13.79 0 12 1.79 12 4C12 6.21 13.79 8 16 8ZM24 12C26.21 12 28 10.21 28 8C28 5.79 26.21 4 24 4C21.79 4 20 5.79 20 8C20 10.21 21.79 12 24 12ZM8 12C10.21 12 12 10.21 12 8C12 5.79 10.21 4 8 4C5.79 4 4 5.79 4 8C4 10.21 5.79 12 8 12Z" fill="#043873"/>
          </svg>
        }
        title="Legal Team Collaboration"
        description="Enable seamless collaboration among legal teams with secure document sharing, real-time annotations, and version control. Share insights and analysis with colleagues while maintaining data security and compliance."
        buttonText="Collaborate Now"
        reverse={true}
        delay={200}
      />

      {/* Customise Section */}
      <FeatureSection
        imageSrc="/4452392.jpg"
        imageAlt="Legal Customization"
        icon={
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" fill="#043873"/>
          </svg>
        }
        title="Customize Legal Workflows"
        description="Tailor LegalFlow to your specific practice areas with customizable templates, automated workflows, and integration with your existing legal software. Create custom analysis rules and reporting formats."
        buttonText="Customize Now"
        delay={300}
      />

      {/* Your Work Everywhere Section */}
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-[#043873] text-center group hover:bg-gradient-to-br hover:from-[#043873] hover:to-[#1E3A8A] transition-all duration-500">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-300">
          Access Legal Documents Anywhere
        </h2>
        <p className="text-base sm:text-lg text-white/80 mb-8 max-w-4xl leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          Access your legal documents and analysis from any device with cloud synchronization. LegalFlow works seamlessly across Windows, macOS, Linux, Android and iOS. Available as a web app and mobile applications for on-the-go legal work.
        </p>
        <CTAButton size="lg" className="group-hover:scale-110 transition-transform duration-300">
          Access Now
        </CTAButton>
      </section>

      {/* Your Data Section */}
      <section className="relative px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-white min-h-screen group hover:bg-gray-50/30 transition-colors duration-500">
        <div className="max-w-2xl pt-20 text-center lg:text-left">
          <IconBox className="group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4C22.627 4 28 9.373 28 16C28 22.627 22.627 28 16 28C9.373 28 4 22.627 4 16C4 9.373 9.373 4 16 4Z" stroke="#043873" strokeWidth="2"/>
              <path d="M12 16L15 19L20 13" stroke="#043873" strokeWidth="2"/>
            </svg>
          </IconBox>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-6 group-hover:text-[#4F9CF9] transition-colors duration-300">
            100% Secure & Compliant
          </h2>
          <p className="text-base sm:text-lg text-[#212529]/70 mb-8 leading-relaxed group-hover:text-[#212529]/90 transition-colors duration-300">
            Your legal documents and analysis are protected with enterprise-grade security. LegalFlow uses End-To-End Encryption (E2EE) and complies with legal industry standards including GDPR, HIPAA, and attorney-client privilege requirements.
          </p>
          <CTAButton className="group-hover:scale-105 transition-transform duration-300">
            Learn More
          </CTAButton>
        </div>
        <div className="absolute top-1/2 right-4 sm:right-8 lg:right-[20px] transform -translate-y-1/2 hidden lg:block group-hover:scale-105 transition-transform duration-500">
          <img 
            src="/Generated_Image_July_26__2025_-_11_12PM-removebg-preview (1).png" 
            alt="Legal Security & Compliance" 
            style={{ width: '900px', height: '900px', objectFit: 'contain' }} 
          />
        </div>
      </section>

      <PricingSection />

      {/* Our Sponsors Section */}
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-white group hover:bg-gray-50/30 transition-colors duration-500">
        <IconBox className="group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" fill="#043873"/>
          </svg>
        </IconBox>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-16 text-center group-hover:text-[#4F9CF9] transition-colors duration-300">
          Trusted by Leading Legal Firms
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl gap-8 sm:gap-4">
          <div className="text-xl sm:text-2xl font-bold text-black hover:text-[#4F9CF9] hover:scale-110 transition-all duration-300 cursor-pointer">Baker McKenzie</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-600 hover:text-[#4F9CF9] hover:scale-110 transition-all duration-300 cursor-pointer">DLA Piper</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-600 hover:text-[#4F9CF9] hover:scale-110 transition-all duration-300 cursor-pointer">Clifford Chance</div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-[#4F9CF9] hover:scale-110 transition-all duration-300 cursor-pointer">Skadden</div>
        </div>
      </section>

      {/* Apps Integration Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32 bg-[#043873] group hover:bg-gradient-to-br hover:from-[#043873] hover:to-[#1E3A8A] transition-all duration-500">
        <div className="flex-1 max-w-2xl text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-300">
            Integrate with Your Legal Software Stack
          </h2>
          <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
            LegalFlow integrates seamlessly with your existing legal software. Connect with Clio, PracticePanther, MyCase, and over 100+ legal applications to streamline your entire workflow.
          </p>
          <CTAButton className="group-hover:scale-105 transition-transform duration-300">
            View Integrations
          </CTAButton>
        </div>
        <div className="flex-1 flex items-center justify-center lg:ml-16 group-hover:scale-105 transition-transform duration-500">
          <img 
            src="/GeneratedImageJuly272025-1_59PM-removebg-preview.png" 
            alt="Legal Software Integrations" 
            className="max-w-full h-auto w-full lg:w-auto" 
            style={{ maxHeight: '400px', maxWidth: '100%' }} 
          />
        </div>
      </section>

      <TestimonialsSection />

      {/* Free Trial Section */}
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-[220px] py-16 bg-[#043873] text-center group hover:bg-gradient-to-br hover:from-[#043873] hover:to-[#1E3A8A] transition-all duration-500">
        <ScrollReveal direction="up" delay={100}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up group-hover:scale-105 transition-transform duration-300">
            Try LegalFlow today
          </h2>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed animate-fade-in-up stagger-1 group-hover:text-white/90 transition-colors duration-300">
            Get started for free. Add your whole team as your needs grow.
          </p>
          <CTAButton size="lg" fullWidth className="mb-8 animate-fade-in-up stagger-2 mx-auto group-hover:scale-110 transition-transform duration-300">
            Try LegalFlow free
          </CTAButton>
          <p className="text-lg sm:text-xl text-white/80 animate-fade-in-up stagger-3 group-hover:text-white/90 transition-colors duration-300">
            On a big team? Contact sales
          </p>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
} 