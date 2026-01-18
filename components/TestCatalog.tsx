import React, { useState } from 'react';
import { Search, Filter, Beaker, Clock } from 'lucide-react';
import { LabTest, TestCategory } from '../types';

interface TestCatalogProps {
  tests: LabTest[];
  onBookTest: (testId: string) => void;
}

export const TestCatalog: React.FC<TestCatalogProps> = ({ tests, onBookTest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TestCategory | 'All'>('All');

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="bg-medical-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Diagnostic Test Catalog</h2>
          <p className="text-medical-100 max-w-2xl mx-auto">Explore our comprehensive list of available tests. Transparent pricing and fast results.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search for a test..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-medical-500 focus:border-medical-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Filter className="h-5 w-5 text-slate-500 hidden md:block" />
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${selectedCategory === 'All' ? 'bg-medical-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  All
                </button>
                {Object.values(TestCategory).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${selectedCategory === cat ? 'bg-medical-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <div key={test.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-medical-100 text-medical-800 mb-2">
                      {test.category}
                    </span>
                    <span className="text-lg font-bold text-slate-900">${test.price}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{test.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-3">{test.description}</p>
                  <div className="flex items-center text-xs text-slate-400">
                    <Clock className="w-3 h-3 mr-1" />
                    Turnaround: {test.turnaroundTime}
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                  <button
                    onClick={() => onBookTest(test.id)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medical-600 hover:bg-medical-700 focus:outline-none"
                  >
                    <Beaker className="w-4 h-4 mr-2" />
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 text-lg">No tests found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};