import React, { useEffect, useState, useMemo } from 'react';
import { Filter, Search, X, FileText, Download } from 'lucide-react';
import { ResourceCard, Badge, Input, Select, Modal, Button } from '../components/Common';
import { Resource, ResourceType, BRANCHES, SEMESTERS } from '../types';
import { SUBJECTS_BY_BRANCH } from '../constants';
import { api } from '../services/mockService';

interface ResourcesPageProps {
  type?: ResourceType;
  title: string;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ type, title }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Preview State
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number | ''>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      try {
        const data = await api.getResources(type || 'all');
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, [type]);

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          res.subject.toLowerCase().includes(search.toLowerCase());
      const matchBranch = selectedBranch ? res.branch === selectedBranch : true;
      const matchSem = selectedSemester ? res.semester === selectedSemester : true;
      const matchSubject = selectedSubject ? res.subject === selectedSubject : true;
      
      return matchSearch && matchBranch && matchSem && matchSubject;
    });
  }, [resources, search, selectedBranch, selectedSemester, selectedSubject]);

  const availableSubjects = useMemo(() => {
    if (!selectedBranch) return [];
    return SUBJECTS_BY_BRANCH[selectedBranch] || [];
  }, [selectedBranch]);

  const clearFilters = () => {
    setSearch('');
    setSelectedBranch('');
    setSelectedSemester('');
    setSelectedSubject('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filteredResources.length} resources found
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
             <Input 
               placeholder="Search..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               icon={<Search size={18}/>}
               className="h-10 py-2"
             />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-colors ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filters Area */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in-down grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select 
            label="Branch"
            placeholder="All Branches"
            options={BRANCHES}
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              setSelectedSubject(''); // Reset subject when branch changes
            }}
          />
          <Select 
            label="Semester"
            placeholder="All Semesters"
            options={SEMESTERS}
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
          />
          <Select 
            label="Subject"
            placeholder="All Subjects"
            options={availableSubjects}
            value={selectedSubject}
            disabled={!selectedBranch}
            onChange={(e) => setSelectedSubject(e.target.value)}
          />
          <div className="flex items-end">
            <button 
              onClick={clearFilters}
              className="w-full h-[42px] flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-medium"
            >
              <X size={16} className="mr-2" /> Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Quick Branch Tags (Only visible if no branch selected) */}
      {!selectedBranch && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 py-2">Quick Filter:</span>
          {BRANCHES.slice(0, 5).map(branch => (
            <Badge key={branch} onClick={() => setSelectedBranch(branch)}>
              {branch}
            </Badge>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              onClick={(res) => setSelectedResource(res)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No resources found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search query.</p>
          <button onClick={clearFilters} className="mt-4 text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Clear all filters
          </button>
        </div>
      )}

      {/* PDF Preview Modal */}
      <Modal 
        isOpen={!!selectedResource} 
        onClose={() => setSelectedResource(null)} 
        title={selectedResource?.title || 'Preview'}
        maxWidth="max-w-5xl"
      >
        <div className="h-[60vh] md:h-[70vh] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden relative border border-gray-200 dark:border-gray-700">
            {selectedResource?.downloadUrl && selectedResource.downloadUrl !== '#' ? (
                <iframe 
                    src={selectedResource.downloadUrl}
                    className="w-full h-full border-0"
                    title="PDF Preview"
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500 flex-col">
                    <FileText size={48} className="mb-4 opacity-50"/>
                    <p>No preview available for this resource.</p>
                </div>
            )}
        </div>
        <div className="mt-6 flex justify-end gap-3">
             <Button variant="secondary" onClick={() => setSelectedResource(null)}>Close</Button>
             {selectedResource?.downloadUrl && selectedResource.downloadUrl !== '#' && (
               <a href={selectedResource.downloadUrl} target="_blank" rel="noreferrer" className="no-underline">
                  <Button>
                      <Download size={18} className="mr-2"/> Download PDF
                  </Button>
               </a>
             )}
        </div>
      </Modal>
    </div>
  );
};