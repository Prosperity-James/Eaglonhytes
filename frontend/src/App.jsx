import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  InformationCircleIcon, 
  PhoneIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  CogIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
  SparklesIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Apartments from './pages/Apartments.jsx';
import Applications from './pages/Applications.jsx';
import Messages from './pages/Messages.jsx';
import Users from './pages/Users.jsx';
import Profile from './pages/Profile.jsx';
import ApartmentView from './pages/ApartmentView.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx';
import AdminDashboardTest from './pages/AdminDashboardTest.jsx';
import AdminDashboardDebug from './pages/AdminDashboardDebug.jsx';
import LoginTest from './pages/LoginTest.jsx';
import SimpleTest from './pages/SimpleTest.jsx';
import NoAuthTest from './pages/NoAuthTest.jsx';
import MinimalApp from './pages/MinimalApp.jsx';
import MinimalLogin from './pages/MinimalLogin.jsx';
import MinimalAdmin from './pages/MinimalAdmin.jsx';
import AdminDashboardSimple from './pages/AdminDashboardSimple.jsx';
import AdminDashboardWithHooks from './pages/AdminDashboardWithHooks.jsx';
import AdminDashboardWithData from './pages/AdminDashboardWithData.jsx';
import AuthContextTest from './pages/AuthContextTest.jsx';
import FAQ from './pages/FAQ.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Shipping from './pages/Shipping.jsx';
import Cookies from './pages/Cookies.jsx';
import Logout from './pages/Logout.jsx';
import News from './pages/News.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { useApplications } from './hooks/useApplications.js';
import Footer from './components/Footer.jsx';
const Nav = () => {
  const { user, logout } = useAuth();
  const { applications } = useApplications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Calculate user's application count
  const userApplicationCount = user ? applications.filter(app => 
    parseInt(app.user_id) === parseInt(user.id)
  ).length : 0;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <>
  {/* Eaglonhytes Navigation Bar */}
  <nav className="fixed top-0 left-0 right-0 z-50 font-sans bg-white border-b border-gray-100 shadow-sm backdrop-blur-xl" aria-label="Eaglonhytes Navigation Bar">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-[70px]">
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center text-black no-underline transition-transform duration-300 hover:scale-105" 
            onClick={closeMobileMenu}
          >
            <div>
              <img src="/assets/icon/logo.png" alt="Eaglonhytes Logo" className="w-20 h-20" />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="items-center hidden gap-2 lg:flex">
            <Link 
              to="/home" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-medium text-sm no-underline transition-all duration-300 hover:text-black hover:bg-[#D4AF37]/20 hover:-translate-y-0.5"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/lands" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-medium text-sm no-underline transition-all duration-300 hover:text-black hover:bg-[#D4AF37]/20 hover:-translate-y-0.5"
            >
              <BuildingOfficeIcon className="w-5 h-5" />
              <span>Lands</span>
            </Link>
            <Link 
              to="/about" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-medium text-sm no-underline transition-all duration-300 hover:text-black hover:bg-[#D4AF37]/20 hover:-translate-y-0.5"
            >
              <InformationCircleIcon className="w-5 h-5" />
              <span>About</span>
            </Link>
            <Link 
              to="/news" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-medium text-sm no-underline transition-all duration-300 hover:text-black hover:bg-[#D4AF37]/20 hover:-translate-y-0.5"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>News</span>
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-medium text-sm no-underline transition-all duration-300 hover:text-black hover:bg-[#D4AF37]/20 hover:-translate-y-0.5"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>Contact</span>
            </Link>
            {user && (
              <>
                <Link 
                  to="/applications" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-medium text-sm no-underline transition-all duration-300 hover:text-black hover:bg-[#D4AF37]/20 hover:-translate-y-0.5 relative"
                >
                  <ClipboardDocumentListIcon className="w-5 h-5" />
                  <span>Applications</span>
                  {userApplicationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {userApplicationCount}
                    </span>
                  )}
                </Link>
                {!user.is_admin && (
                  <Link 
                    to="/messages" 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-medium text-sm no-underline transition-all duration-300 hover:text-black hover:bg-[#D4AF37]/20 hover:-translate-y-0.5"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    <span>Messages</span>
                  </Link>
                )}
              </>
            )}
            {user?.is_admin && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-white font-medium text-sm no-underline transition-all duration-300 hover:bg-[#BFA134] hover:-translate-y-0.5 hover:scale-105 shadow-lg"
              >
                <CogIcon className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="items-center hidden gap-3 px-4 py-2 border border-gray-100 lg:flex rounded-xl bg-gray-50">
                  <div className="flex items-center justify-center overflow-hidden bg-[#D4AF37] rounded-full w-9 h-9">
                    <div className="text-base font-semibold text-white">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight text-black">
                      {user.full_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.is_admin ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </div>
                <div className="hidden gap-2 lg:flex">
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center justify-center text-gray-600 transition-all duration-300 border border-gray-100 rounded-full cursor-pointer w-9 h-9 bg-gray-50 hover:bg-[#D4AF37] hover:text-white hover:scale-110 hover:shadow-lg"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="items-center hidden gap-4 lg:flex">
                <span className="text-sm font-medium text-gray-600">Welcome Guest</span>
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-semibold text-sm no-underline bg-gray-50 border border-gray-100 transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <KeyIcon className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-white font-semibold text-sm no-underline transition-all duration-300 hover:bg-[#BFA134] hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="flex items-center justify-center w-10 h-10 transition-all duration-300 border border-gray-100 lg:hidden bg-gray-50 rounded-xl hover:bg-[#D4AF37] hover:scale-105"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <Bars3Icon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </nav>

  {/* Eaglonhytes Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-white/80 backdrop-blur-sm z-[60] transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`} 
        onClick={closeMobileMenu}
      >
        <div 
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white backdrop-blur-xl border-l border-gray-100 transition-transform duration-300 overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center">
              <div>
                <img src="/assets/icon/logo.png" alt="Eaglonhytes Logo" className="w-20 h-20" />
              </div>
            </div>
            <button 
              className="flex items-center justify-center text-gray-600 transition-all duration-300 rounded-full w-9 h-9 bg-gray-50 hover:bg-[#D4AF37] hover:text-white hover:scale-110"
              onClick={closeMobileMenu}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            {user && (
              <div className="flex items-center gap-3 p-4 mb-6 border border-gray-100 rounded-xl bg-gray-50">
                <div className="flex items-center justify-center overflow-hidden bg-[#D4AF37] rounded-full w-9 h-9">
                  <div className="text-base font-semibold text-white">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight text-black">
                    {user.full_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.is_admin ? 'Administrator' : 'Tenant'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 mb-6">
              <Link 
                to="/home" 
                className="flex items-center justify-between p-4 font-medium text-gray-600 no-underline transition-all duration-300 border border-transparent rounded-xl hover:bg-[#D4AF37]/10 hover:text-black hover:translate-x-2"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <HomeIcon className="w-5 h-5" />
                  <span>Home</span>
                </div>
                <span className="text-xl transition-transform duration-300">→</span>
              </Link>
              <Link 
                to="/lands" 
                className="flex items-center justify-between p-4 font-medium text-gray-600 no-underline transition-all duration-300 border border-transparent rounded-xl hover:bg-[#D4AF37]/10 hover:text-black hover:translate-x-2"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span>Lands</span>
                </div>
                <span className="text-xl transition-transform duration-300">→</span>
              </Link>
              <Link 
                to="/about" 
                className="flex items-center justify-between p-4 font-medium text-gray-600 no-underline transition-all duration-300 border border-transparent rounded-xl hover:bg-[#D4AF37]/10 hover:text-black hover:translate-x-2"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <InformationCircleIcon className="w-5 h-5" />
                  <span>About</span>
                </div>
                <span className="text-xl transition-transform duration-300">→</span>
              </Link>
              <Link 
                to="/news" 
                className="flex items-center justify-between p-4 font-medium text-gray-600 no-underline transition-all duration-300 border border-transparent rounded-xl hover:bg-[#D4AF37]/10 hover:text-black hover:translate-x-2"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <SparklesIcon className="w-5 h-5" />
                  <span>News</span>
                </div>
                <span className="text-xl transition-transform duration-300">→</span>
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center justify-between p-4 font-medium text-gray-600 no-underline transition-all duration-300 border border-transparent rounded-xl hover:bg-[#D4AF37]/10 hover:text-black hover:translate-x-2"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5" />
                  <span>Contact</span>
                </div>
                <span className="text-xl transition-transform duration-300">→</span>
              </Link>
              {user && (
                <>
                  <Link 
                    to="/applications" 
                    className="flex items-center justify-between p-4 font-medium text-gray-600 no-underline transition-all duration-300 border border-transparent rounded-xl hover:bg-[#D4AF37]/10 hover:text-black hover:translate-x-2 relative"
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center gap-3">
                      <ClipboardDocumentListIcon className="w-5 h-5" />
                      <span>Applications</span>
                      {userApplicationCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ml-2">
                          {userApplicationCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xl transition-transform duration-300">→</span>
                  </Link>
                  {!user.is_admin && (
                    <Link 
                      to="/messages" 
                      className="flex items-center justify-between p-4 font-medium text-gray-600 no-underline transition-all duration-300 border border-transparent rounded-xl hover:bg-[#D4AF37]/10 hover:text-black hover:translate-x-2"
                      onClick={closeMobileMenu}
                    >
                      <div className="flex items-center gap-3">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span>Messages</span>
                      </div>
                      <span className="text-xl transition-transform duration-300">→</span>
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="flex items-center justify-between p-4 font-medium text-gray-600 no-underline transition-all duration-300 border border-transparent rounded-xl hover:bg-[#D4AF37]/10 hover:text-black hover:translate-x-2"
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5" />
                      <span>Profile</span>
                    </div>
                    <span className="text-xl transition-transform duration-300">→</span>
                  </Link>
                  {user.is_admin && (
                    <Link 
                      to="/admin" 
                      className="flex items-center justify-between p-4 font-medium text-white no-underline transition-all duration-300 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#BFA134] hover:translate-x-2"
                      onClick={closeMobileMenu}
                    >
                      <div className="flex items-center gap-3">
                        <CogIcon className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </div>
                      <span className="text-xl transition-transform duration-300">→</span>
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {user ? (
                <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-center gap-3 p-4 font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center gap-3 p-4 font-semibold text-gray-600 no-underline transition-all duration-300 bg-gray-100 border border-gray-200 rounded-xl hover:bg-[#D4AF37] hover:text-white"
                    onClick={closeMobileMenu}
                  >
                    <KeyIcon className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center gap-3 p-4 font-semibold text-white no-underline transition-all duration-300 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#BFA134] hover:scale-105 hover:shadow-lg hover:shadow-[#D4AF37]/25"
                    onClick={closeMobileMenu}
                  >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Hide main navigation and footer on admin dashboard
  const hideNavigation = location.pathname === '/admin';

  return (
    <div style={{ paddingTop: hideNavigation ? '0' : '80px' }}>
      {!hideNavigation && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<News />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  <Route path="/lands" element={<Apartments />} />
  <Route path="/land/:id" element={<ApartmentView />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        {user && (
          <>
            <Route path="/applications" element={<Applications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}

        {/* Admin Routes - Role-based routing */}
        {user?.is_admin && (
          <>
            <Route path="/admin" element={
              <div className="admin-dashboard-wrapper" style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh', 
                zIndex: 9999,
                backgroundColor: '#f9fafb'
              }}>
                {/* Route to different dashboards based on role */}
                {user?.role === 'super_admin' ? <SuperAdminDashboard /> : <AdminDashboard />}
              </div>
            } />
            {/* Users route only for Super Admin */}
            {user?.role === 'super_admin' && <Route path="/users" element={<Users />} />}
          </>
        )}
        
        {/* Debug routes - remove after testing */}
        <Route path="/admin-test" element={
          <div className="admin-dashboard-wrapper" style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: 9999,
            backgroundColor: '#f9fafb'
          }}>
            <AdminDashboardDebug />
          </div>
        } />
        
        <Route path="/login-test" element={<LoginTest />} />
        <Route path="/simple-test" element={<SimpleTest />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideNavigation && <Footer />}
      
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Test routes outside AuthProvider */}
        <Route path="/no-auth-test" element={<NoAuthTest />} />
        <Route path="/minimal-app" element={<MinimalApp />} />
        <Route path="/minimal-login" element={<MinimalLogin />} />
        <Route path="/minimal-admin" element={<MinimalAdmin />} />
        <Route path="/admin-simple" element={<AdminDashboardSimple />} />
        <Route path="/admin-hooks" element={<AdminDashboardWithHooks />} />
        <Route path="/admin-data" element={<AdminDashboardWithData />} />
        <Route path="/auth-test" element={
          <AuthProvider>
            <AuthContextTest />
          </AuthProvider>
        } />
        
        {/* Main app with AuthProvider */}
        <Route path="/*" element={
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}
