import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#043873] px-4 sm:px-6 lg:px-[220px] py-16 lg:py-32">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-8 lg:gap-0">
        {/* Logo and Description */}
        <div className="max-w-xs text-center lg:text-left">
          <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:scale-110 transition-transform duration-300">
                  <path d="M4 6L8 10L4 14" stroke="#043873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6L12 10L8 14" stroke="#043873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6L16 10L12 14" stroke="#043873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="text-white text-xl sm:text-2xl font-bold ml-2 group-hover:text-[#FFE492] transition-colors duration-300">LegalFlow</span>
          </div>
          <p className="text-white/70 leading-relaxed hover:text-white/90 transition-colors duration-300">
            LegalFlow revolutionizes legal document analysis with AI-powered insights, helping legal professionals work smarter and faster with advanced automation and compliance features.
          </p>
        </div>

        {/* Product Links */}
        <div className="flex flex-col gap-4 text-center lg:text-left">
          <h3 className="text-lg font-bold text-white">Product</h3>
          <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">Overview</a>
          <a href="#" className="text-white hover:text-[#FFE492] hover:translate-x-1 transition-all duration-300">Pricing</a>
          <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">Customer stories</a>
        </div>

        {/* Resources Links */}
        <div className="flex flex-col gap-4 text-center lg:text-left">
          <h3 className="text-lg font-bold text-white">Resources</h3>
          <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">Blog</a>
          <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">Guides & tutorials</a>
          <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">Help center</a>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-4 text-center lg:text-left">
          <h3 className="text-lg font-bold text-white">Company</h3>
          <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">About us</a>
          <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">Careers</a>
          <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-300">Media kit</a>
        </div>

        {/* Try It Today */}
        <div className="max-w-xs text-center lg:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Try It Today</h3>
          <p className="text-white/70 mb-6 leading-relaxed hover:text-white/90 transition-colors duration-300">
            Get started for free. Add your whole team as your needs grow.
          </p>
          <button className="bg-[#4F9CF9] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto lg:mx-0 hover:bg-[#3B82F6] hover:scale-105 hover:shadow-lg hover:shadow-[#4F9CF9]/30 transition-all duration-300 ease-in-out transform active:scale-95 group">
            Start today
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
              <path d="M0 7H14M7 0L14 7L7 14" stroke="white" strokeWidth="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-[#2E4E73] gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-white/70 text-center sm:text-left">
          <div className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-all duration-300 cursor-pointer group">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:scale-110 transition-transform duration-300">
              <circle cx="10" cy="10" r="10" fill="white"/>
            </svg>
            <span className="group-hover:text-white transition-colors duration-300">English</span>
            <svg width="12" height="6" viewBox="0 0 12 6" fill="none" className="group-hover:rotate-180 transition-transform duration-300">
              <path d="M0 0L6 6L12 0" stroke="white" strokeWidth="1"/>
            </svg>
          </div>
          <a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300">Terms & privacy</a>
          <a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300">Security</a>
          <a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-300">Status</a>
          <span className="hover:text-white/90 transition-colors duration-300">©2024 LegalFlow Inc.</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-8">
          <a href="#" className="text-white/70 hover:text-white hover:scale-125 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="currentColor"/>
            </svg>
          </a>
          <a href="#" className="text-white/70 hover:text-white hover:scale-125 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="currentColor"/>
            </svg>
          </a>
          <a href="#" className="text-white/70 hover:text-white hover:scale-125 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
} 