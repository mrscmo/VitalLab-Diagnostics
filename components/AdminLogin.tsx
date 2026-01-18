import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple demo auth
      onLogin(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-slate-900 py-6 px-8 text-center">
          <div className="mx-auto w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">CMS Login</h2>
          <p className="text-slate-400 text-sm mt-1">Authorized Personnel Only</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-medical-500 focus:border-medical-500 outline-none transition-all"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />
            {error && <p className="text-red-500 text-xs mt-2">Invalid password. Try 'admin123'.</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-medical-600 hover:bg-medical-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Access Dashboard
          </button>
        </form>
        <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
           <a href="/" className="text-sm text-medical-600 hover:text-medical-800">Return to Website</a>
        </div>
      </div>
    </div>
  );
};