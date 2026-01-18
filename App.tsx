import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TestCatalog } from './components/TestCatalog';
import { AppointmentForm } from './components/AppointmentForm';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AiAssistant } from './components/AiAssistant';
import { CustomPage } from './components/CustomPage';
import { INITIAL_CONFIG } from './data/initialData';
import { LabTest, Appointment, WebsiteConfig } from './types';
import { getLabTests, createAppointment, getAppointments, updateAppointmentStatus } from './services/dataService';

// --- Color Utility Helper ---
// Simple function to darken/lighten hex color
const adjustColor = (color: string, amount: number) => {
    let hex = color.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    if (isNaN(num)) return color; // Fallback if invalid

    let r = (num >> 16) + amount;
    if (r > 255) r = 255; else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amount;
    if (b > 255) b = 255; else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amount;
    if (g > 255) g = 255; else if (g < 0) g = 0;

    return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTestId, setSelectedTestId] = useState<string | undefined>(undefined);
  
  // App Data State
  const [tests, setTests] = useState<LabTest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [config, setConfig] = useState<WebsiteConfig>(INITIAL_CONFIG);
  const [loading, setLoading] = useState(true);
  
  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // --- Initial Data Loading ---
  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        const fetchedTests = await getLabTests();
        setTests(fetchedTests);
        setLoading(false);
    };
    loadData();
  }, []);

  // Load appointments only when admin logs in
  useEffect(() => {
    if (isAdminLoggedIn) {
        const loadAdminData = async () => {
            const fetchedAppointments = await getAppointments();
            setAppointments(fetchedAppointments);
        };
        loadAdminData();
    }
  }, [isAdminLoggedIn]);

  // --- Dynamic Theme Injection ---
  useEffect(() => {
    const root = document.documentElement;
    const { colors, font } = config.theme;

    // Font
    root.style.setProperty('--font-primary', font);

    // Primary Color Palette Generation (Simplified)
    root.style.setProperty('--color-primary-600', colors.primary);
    root.style.setProperty('--color-primary-500', adjustColor(colors.primary, 20));
    root.style.setProperty('--color-primary-700', adjustColor(colors.primary, -20));
    root.style.setProperty('--color-primary-800', adjustColor(colors.primary, -40));
    root.style.setProperty('--color-primary-900', adjustColor(colors.primary, -60));
    
    // Light shades (simulated by drastically lightening)
    root.style.setProperty('--color-primary-100', adjustColor(colors.primary, 150)); 
    root.style.setProperty('--color-primary-50', adjustColor(colors.primary, 170));

    // Accent
    root.style.setProperty('--color-accent-600', colors.accent);
    root.style.setProperty('--color-accent-500', adjustColor(colors.accent, 20));

    // Secondary (Mapped to Slate 900 for dark text/footers)
    root.style.setProperty('--color-secondary-900', colors.secondary);

  }, [config.theme]);

  // Check URL on load for /admin
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (page === 'home') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleBookTest = (testId: string) => {
    setSelectedTestId(testId);
    navigateTo('appointment');
  };

  const handleBookingSuccess = () => {
    setSelectedTestId(undefined);
    navigateTo('home');
  };

  const handleAddAppointment = async (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    // Send to Supabase
    const success = await createAppointment(data);
    if (success) {
        // Optimistically update local state if needed, or just rely on re-fetch
        console.log("Appointment booked successfully in DB");
    } else {
        alert("There was an error booking your appointment. Please try again.");
    }
  };

  // --- CMS Actions ---
  const handleAddTest = (test: LabTest) => {
    // Note: In a full implementation, this should also write to Supabase
    setTests(prev => [...prev, test]);
  };

  const handleUpdateTest = (updatedTest: LabTest) => {
    setTests(prev => prev.map(t => t.id === updatedTest.id ? updatedTest : t));
  };

  const handleDeleteTest = (id: string) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      setTests(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    // Update DB
    await updateAppointmentStatus(id, status);
    // Update Local
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const handleUpdateConfig = (newConfig: WebsiteConfig) => {
    setConfig(newConfig);
  };

  // --- Render Logic ---

  if (currentPage === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={setIsAdminLoggedIn} />;
    }
    return (
      <AdminDashboard 
        tests={tests}
        appointments={appointments}
        config={config}
        onAddTest={handleAddTest}
        onUpdateTest={handleUpdateTest}
        onDeleteTest={handleDeleteTest}
        onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
        onUpdateConfig={handleUpdateConfig}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          navigateTo('home');
        }}
      />
    );
  }

  // Find if current page is a custom page
  const customPage = config.pages.find(p => p.slug === currentPage && p.type === 'custom');

  return (
    <div 
      className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col"
      style={{ fontFamily: config.theme.font }} // Dynamic Font Application
    >
      <Header currentPage={currentPage} onNavigate={navigateTo} config={config} />
      
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero onCtaClick={() => navigateTo('appointment')} config={config} />
            {/* Quick Access to Catalog from Home */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-slate-900">Popular Tests</h2>
                 <button onClick={() => navigateTo('catalog')} className="text-medical-600 font-medium hover:text-medical-700">View All &rarr;</button>
               </div>
               
               {loading ? (
                   <div className="flex justify-center p-12">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600"></div>
                   </div>
               ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tests.slice(0, 3).map((test) => (
                        <div key={test.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('catalog')}>
                        <h3 className="font-semibold text-lg text-slate-800">{test.name}</h3>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{test.description}</p>
                        <div className="mt-4 text-medical-600 text-sm font-medium">Learn more</div>
                        </div>
                    ))}
                </div>
               )}
            </div>
          </>
        )}
        
        {currentPage === 'catalog' && (
          <TestCatalog tests={tests} onBookTest={handleBookTest} />
        )}
        
        {currentPage === 'appointment' && (
          <AppointmentForm 
            tests={tests}
            preSelectedTestId={selectedTestId} 
            onSuccess={handleBookingSuccess} 
            onSubmit={handleAddAppointment}
          />
        )}

        {currentPage === 'assistant' && (
          <AiAssistant />
        )}

        {/* Custom Page Rendering */}
        {customPage && (
          <CustomPage page={customPage} />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-white text-lg font-bold mb-4">{config.companyName}</h3>
              <p className="text-sm">{config.hero.description.substring(0, 100)}...</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Patients</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigateTo('appointment')} className="hover:text-white">Book Appointment</button></li>
                <li><button onClick={() => navigateTo('catalog')} className="hover:text-white">Test Catalog</button></li>
                <li><button onClick={() => navigateTo('assistant')} className="hover:text-white">AI Assistant</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>{config.contact.address}</li>
                <li>{config.contact.email}</li>
                <li>{config.contact.phone}</li>
              </ul>
            </div>
            <div>
               <h4 className="text-white font-medium mb-4">Hours</h4>
               <ul className="space-y-2 text-sm">
                 {config.contact.hours.split(',').map((hour, idx) => (
                   <li key={idx}>{hour.trim()}</li>
                 ))}
               </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex justify-between items-center">
            <p className="text-xs">&copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.</p>
            <button onClick={() => navigateTo('admin')} className="text-xs text-slate-600 hover:text-slate-400">Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;