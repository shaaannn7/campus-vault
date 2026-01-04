import React, { useEffect, useState } from 'react';
import { Users, FileText, MessageSquare, Trash2, CheckCircle, XCircle, Globe, Search, Plus } from 'lucide-react';
import { Button, Badge, Input } from '../components/Common';
import { api } from '../services/mockService';
import { User, Resource, MaterialRequest } from '../types';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'resources' | 'requests' | 'import'>('overview');

  // Import Tab State
  const [importQuery, setImportQuery] = useState('');
  const [importResults, setImportResults] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, r, req] = await Promise.all([
        api.getUsers(),
        api.getResources('all'),
        api.getRequests()
      ]);
      setUsers(u);
      setResources(r);
      setRequests(req);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        await api.deleteUser(id);
        fetchData();
    }
  };

  const handleDeleteResource = async (id: string) => {
      if (window.confirm("Delete this resource?")) {
          await api.deleteResource(id);
          fetchData();
      }
  };

  const handleDeleteRequest = async (id: string) => {
      if(window.confirm("Delete this request?")) {
          await api.deleteRequest(id);
          fetchData();
      }
  }

  const handleFulfillRequest = async (id: string) => {
      await api.updateRequest(id, { status: 'fulfilled' });
      fetchData();
  }

  const handleSearchExternal = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSearching(true);
      try {
          const results = await api.searchExternalResources(importQuery);
          setImportResults(results);
      } catch (error) {
          console.error(error);
      } finally {
          setIsSearching(false);
      }
  }

  const handleImport = async (resource: Resource) => {
      // Add to our main DB
      await api.uploadResource({
          title: resource.title,
          type: resource.type,
          branch: resource.branch,
          semester: resource.semester,
          subject: resource.subject,
          downloadUrl: resource.downloadUrl,
          author: resource.author,
          description: resource.description,
          tags: resource.tags
      });
      setImportedIds(prev => new Set(prev).add(resource.id));
      // Refresh local resources
      fetchData();
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
            <Users size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{users.length}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Resources</h3>
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
            <FileText size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{resources.length}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Pending Requests</h3>
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg">
            <MessageSquare size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {requests.filter(r => r.status === 'pending').length}
        </p>
      </div>
    </div>
  );

  const renderUsersTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Branch/Sem</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {user.role}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {user.role === 'student' ? `${user.branch} - Sem ${user.semester}` : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                    {user.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 size={18} />
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderResourcesTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Title</th>
                        <th className="px-6 py-4 font-semibold">Type</th>
                        <th className="px-6 py-4 font-semibold">Branch/Sem</th>
                        <th className="px-6 py-4 font-semibold">Uploaded By</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {resources.map(res => (
                        <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">{res.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">{res.type}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{res.branch} - Sem {res.semester}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{res.uploadedBy}</td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDeleteResource(res.id)} className="text-red-500 hover:text-red-700 p-1">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderRequestsTable = () => (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Topic</th>
                        <th className="px-6 py-4 font-semibold">Requested By</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                         <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {requests.map(req => (
                        <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{req.topic}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{req.requestedBy}</td>
                            <td className="px-6 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {req.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                {req.status === 'pending' && (
                                    <button onClick={() => handleFulfillRequest(req.id)} className="text-green-500 hover:text-green-700 p-1" title="Mark Fulfilled">
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                                <button onClick={() => handleDeleteRequest(req.id)} className="text-red-500 hover:text-red-700 p-1" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                 </tbody>
            </table>
        </div>
      </div>
  );

  const renderImportTab = () => (
      <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
                  <Globe className="mr-2 text-primary-600" size={24}/> 
                  Import from Prep4BTech
              </h2>
              <p className="text-gray-500 mb-6">Search and import study materials directly from prep4btech.netlify.app/books</p>
              
              <form onSubmit={handleSearchExternal} className="flex gap-2">
                  <Input 
                      placeholder="Search for books, e.g., 'Control Systems' or 'Ogata'" 
                      value={importQuery}
                      onChange={(e) => setImportQuery(e.target.value)}
                      icon={<Search size={20} />}
                  />
                  <Button type="submit" isLoading={isSearching}>Search</Button>
              </form>
          </div>

          {importResults.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Search Results</h3>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {importResults.map(res => {
                          const isImported = importedIds.has(res.id);
                          return (
                            <div key={res.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100">{res.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {res.author} • {res.branch} • Sem {res.semester} • {res.subject}
                                    </p>
                                    <a href={res.downloadUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-500 hover:underline mt-1 inline-block">
                                        View Source PDF
                                    </a>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant={isImported ? "secondary" : "primary"}
                                    onClick={() => !isImported && handleImport(res)}
                                    disabled={isImported}
                                >
                                    {isImported ? (
                                        <><CheckCircle size={16} className="mr-2" /> Imported</>
                                    ) : (
                                        <><Plus size={16} className="mr-2" /> Import Resource</>
                                    )}
                                </Button>
                            </div>
                          );
                      })}
                  </div>
              </div>
          )}
          
          {importResults.length === 0 && !isSearching && importQuery && (
               <div className="text-center py-12 text-gray-500">
                   No results found on Prep4BTech for "{importQuery}"
               </div>
          )}
      </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Panel</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage users, resources, and community requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: 'User Management' },
          { id: 'resources', label: 'Resources' },
          { id: 'requests', label: 'Requests' },
          { id: 'import', label: 'External Import' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative
              ${activeTab === tab.id 
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/10' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="animate-fade-in-down">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsersTable()}
          {activeTab === 'resources' && renderResourcesTable()}
          {activeTab === 'requests' && renderRequestsTable()}
          {activeTab === 'import' && renderImportTab()}
        </div>
      )}
    </div>
  );
};