import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Candidates', href: '/candidates', icon: UserGroupIcon },
  { name: 'Kanban View', href: '/pipeline', icon: ChartBarIcon },
  { name: 'Assessments', href: '/assessments', icon: ClipboardDocumentListIcon },
];

function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Top Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with improved design */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TalentFlow
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Hiring Platform</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <BellIcon className="h-5 w-5" />
              </button>
              
              {/* Profile */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <UserCircleIcon className="h-6 w-6" />
              </button>

              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-fade-in">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 page-container">
        {children}
      </main>
    </div>
  );
}

export default Layout;