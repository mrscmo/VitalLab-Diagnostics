import React, { useState } from 'react';
import { Menu, X, FlaskConical, Stethoscope, Calendar, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import { WebsiteConfig } from '../types';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  config: WebsiteConfig;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, config }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to get icon based on link (optional visual flair)
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'home': return <FlaskConical className="w-4 h-4 mr-1" />;
      case 'catalog': return <Stethoscope className="w-4 h-4 mr-1" />;
      case 'appointment': return <Calendar className="w-4 h-4 mr-1" />;
      case 'assistant': return <MessageCircle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-medical-600 p-2 rounded-lg text-white mr-3">
              <FlaskConical size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">{config.companyName}</h1>
              <p className="text-xs text-medical-600 font-medium uppercase tracking-wider">{config.companyTagline}</p>
            </div>
          </div>

          {/* Desktop Nav using Dynamic Menu */}
          <nav className="hidden md:flex space-x-1 items-center">
            {config.menus.header.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.link)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.link
                    ? 'text-medical-700 bg-medical-50'
                    : 'text-slate-600 hover:text-medical-600 hover:bg-slate-50'
                }`}
              >
                {getIcon(item.link)}
                {item.label}
              </button>
            ))}
            <div className="ml-4 pl-4 border-l border-slate-200">
               <button 
                onClick={() => onNavigate('appointment')}
                className="bg-medical-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-medical-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Patient Portal
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {config.menus.header.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.link);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex w-full items-center px-3 py-3 rounded-md text-base font-medium ${
                  currentPage === item.link
                    ? 'text-medical-700 bg-medical-50'
                    : 'text-slate-600 hover:text-medical-600 hover:bg-slate-50'
                }`}
              >
                {getIcon(item.link)}
                <span className={getIcon(item.link) ? '' : 'ml-1'}>{item.label}</span>
                <ChevronRight className="ml-auto w-4 h-4 text-slate-300" />
              </button>
            ))}
            <button 
              onClick={() => {
                  onNavigate('appointment');
                  setIsMobileMenuOpen(false);
              }}
              className="w-full mt-2 bg-medical-600 text-white px-3 py-3 rounded-md text-base font-medium"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};