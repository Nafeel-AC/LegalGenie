import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 lg:px-[100px] py-4 w-full bg-[#043873]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <div className="w-4 h-4 bg-[#043873] transform rotate-45 group-hover:scale-110 transition-transform duration-300"></div>
          </div>
          <span className="text-white text-xl sm:text-2xl font-bold group-hover:text-[#FFE492] transition-colors duration-300">LegalFlow</span>
        </Link>
        
        {/* Navigation - Hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-1 cursor-pointer group hover:scale-105 transition-transform duration-300">
            <span className="text-white group-hover:text-[#FFE492] transition-colors duration-300">Features</span>
            <svg className="w-4 h-4 text-white group-hover:text-[#FFE492] group-hover:rotate-180 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-1 cursor-pointer group hover:scale-105 transition-transform duration-300">
            <span className="text-white group-hover:text-[#FFE492] transition-colors duration-300">Pricing</span>
            <svg className="w-4 h-4 text-white group-hover:text-[#FFE492] group-hover:rotate-180 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          {user && (
            <Link to="/documents" className="flex items-center gap-1 cursor-pointer group hover:scale-105 transition-transform duration-300">
              <span className="text-white group-hover:text-[#FFE492] transition-colors duration-300">Dashboard</span>
              <svg className="w-4 h-4 text-white group-hover:text-[#FFE492] group-hover:rotate-180 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </nav>
        
        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            // Profile Dropdown
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform duration-300">
                  {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="font-medium">{user.name || 'User'}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  
                  <Link
                    to="/documents"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Documents
                  </Link>
                  

                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Login/Signup buttons for non-authenticated users
            <>
              <Link to="/login">
                <button className="bg-[#FFE492] text-[#043873] px-6 py-2 rounded-lg font-medium hover:bg-[#FFD700] hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out transform active:scale-95">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-[#4F9CF9] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3B82F6] hover:scale-105 hover:shadow-lg hover:shadow-[#4F9CF9]/30 flex items-center gap-2 transition-all duration-300 ease-in-out transform active:scale-95 group">
                  Try LegalFlow free
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button 
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
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
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
                onClick={toggleMenu}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* User Info (if authenticated) */}
            {user && (
              <div className="px-6 py-4 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name || 'User'}</p>
                    <p className="text-white/70 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Links */}
            <nav className="flex-1 px-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between cursor-pointer py-3 border-b border-white/20 hover:bg-white/10 rounded-lg px-3 transition-all duration-300 group">
                  <span className="text-white text-lg group-hover:text-[#FFE492] transition-colors duration-300">Features</span>
                  <svg className="w-4 h-4 text-white group-hover:text-[#FFE492] group-hover:rotate-180 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center justify-between cursor-pointer py-3 border-b border-white/20 hover:bg-white/10 rounded-lg px-3 transition-all duration-300 group">
                  <span className="text-white text-lg group-hover:text-[#FFE492] transition-colors duration-300">Pricing</span>
                  <svg className="w-4 h-4 text-white group-hover:text-[#FFE492] group-hover:rotate-180 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {user && (
                  <Link to="/documents" onClick={toggleMenu} className="block">
                    <div className="flex items-center justify-between cursor-pointer py-3 border-b border-white/20 hover:bg-white/10 rounded-lg px-3 transition-all duration-300 group">
                      <span className="text-white text-lg group-hover:text-[#FFE492] transition-colors duration-300">Dashboard</span>
                      <svg className="w-4 h-4 text-white group-hover:text-[#FFE492] group-hover:rotate-180 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                )}
                
                {/* Profile links for authenticated users */}
                {user && (
                  <>
                                         <Link to="/profile" onClick={toggleMenu} className="block">
                       <div className="flex items-center py-3 border-b border-white/20 hover:bg-white/10 rounded-lg px-3 transition-all duration-300 group">
                         <svg className="w-5 h-5 text-white group-hover:text-[#FFE492] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                         </svg>
                         <span className="text-white text-lg group-hover:text-[#FFE492] transition-colors duration-300">Profile</span>
                       </div>
                     </Link>
                     
                     <Link to="/documents" onClick={toggleMenu} className="block">
                       <div className="flex items-center py-3 border-b border-white/20 hover:bg-white/10 rounded-lg px-3 transition-all duration-300 group">
                         <svg className="w-5 h-5 text-white group-hover:text-[#FFE492] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                         <span className="text-white text-lg group-hover:text-[#FFE492] transition-colors duration-300">Documents</span>
                       </div>
                     </Link>
                    
                  </>
                )}
              </div>
            </nav>
            
            {/* Mobile Buttons */}
            <div className="p-6 space-y-4">
              {user ? (
                // Sign out button for authenticated users
                <button 
                  onClick={() => { handleSignOut(); toggleMenu(); }}
                  className="bg-red-500 text-white w-full py-3 rounded-lg font-medium hover:bg-red-600 hover:scale-105 hover:shadow-lg text-lg transition-all duration-300 ease-in-out transform active:scale-95 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              ) : (
                // Login/Signup buttons for non-authenticated users
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <button className="bg-[#FFE492] text-[#043873] w-full py-3 rounded-lg font-medium hover:bg-[#FFD700] hover:scale-105 hover:shadow-lg text-lg transition-all duration-300 ease-in-out transform active:scale-95">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" onClick={toggleMenu}>
                    <button className="bg-[#4F9CF9] text-white w-full py-3 rounded-lg font-medium hover:bg-[#3B82F6] hover:scale-105 hover:shadow-lg hover:shadow-[#4F9CF9]/30 flex items-center justify-center gap-2 text-lg transition-all duration-300 ease-in-out transform active:scale-95 group">
                      Try LegalFlow free
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </>
  );
} 