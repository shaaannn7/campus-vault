import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, ArrowRight } from 'lucide-react';
import { ResourceCard, Input } from '../components/Common';
import { Resource, User } from '../types';
import { api } from '../services/mockService';

interface HomeProps {
  user: User;
}

export const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await api.getTrendingResources();
        setTrending(data);
      } catch (error) {
        console.error("Failed to load trending", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 p-8 md:p-12 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-indigo-100 text-lg mb-8">
            Find everything you need for your {user.branch} Sem {user.semester} exams in one place.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-lg">
            <Input 
              placeholder="Search for notes, PYQs, or books..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={20} />}
              className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:ring-white/50"
            />
          </form>
        </div>
      </section>

      {/* Quick Stats / Actions (Optional) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['PYQs', 'Notes', 'Books', 'Syllabus'].map((item) => (
          <div 
            key={item}
            onClick={() => navigate(`/${item.toLowerCase()}`)}
            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 text-center group"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Browse {item}</p>
          </div>
        ))}
      </div>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center text-gray-900 dark:text-gray-100">
            <TrendingUp className="mr-2 text-primary-500" />
            Trending Now
          </h2>
          <button onClick={() => navigate('/notes')} className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
