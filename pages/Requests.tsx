import React, { useState, useEffect } from 'react';
import { Upload, MessageSquare, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Button, Badge, Modal } from '../components/Common';
import { api } from '../services/mockService';
import { MaterialRequest, BRANCHES, SEMESTERS, ResourceType } from '../types';
import { SUBJECTS_BY_BRANCH } from '../constants';

export const RequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'fulfilled'>('all');
  
  // Create Form State
  const [formData, setFormData] = useState({
    topic: '',
    type: 'note' as ResourceType,
    branch: 'CSE',
    semester: 1,
    subject: '',
  });

  // Edit State
  const [editingRequest, setEditingRequest] = useState<MaterialRequest | null>(null);
  const [editFormData, setEditFormData] = useState({
    topic: '',
    type: 'note' as ResourceType,
    branch: 'CSE',
    semester: 1,
    subject: '',
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createRequest(formData);
      await loadRequests();
      setShowForm(false);
      setFormData({
        topic: '',
        type: 'note',
        branch: 'CSE',
        semester: 1,
        subject: '',
      });
      setStatusFilter('all'); // Reset filter to see the new request
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (req: MaterialRequest) => {
    setEditingRequest(req);
    setEditFormData({
      topic: req.topic,
      type: req.type,
      branch: req.branch,
      semester: req.semester,
      subject: req.subject,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;
    setIsSubmitting(true);
    try {
      await api.updateRequest(editingRequest.id, editFormData);
      await loadRequests();
      setEditingRequest(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSubjects = SUBJECTS_BY_BRANCH[formData.branch] || [];
  const editAvailableSubjects = SUBJECTS_BY_BRANCH[editFormData.branch] || [];

  const filteredRequests = requests.filter(req => {
    if (statusFilter === 'all') return true;
    return req.status === statusFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Community Requests</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Can't find what you need? Request it here.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel Request' : 'Request Material'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in-down">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Submit New Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Select 
                label="Resource Type"
                options={['note', 'pyq', 'book', 'syllabus']}
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as ResourceType})}
              />
               <Select 
                label="Branch"
                options={BRANCHES}
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
              />
               <Select 
                label="Semester"
                options={SEMESTERS}
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
              />
              <Select 
                label="Subject"
                options={availableSubjects}
                placeholder={availableSubjects.length ? "Select Subject" : "Select Branch First"}
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
            <Input 
              label="Topic / Details"
              placeholder="e.g. 2022 Endsem Question Paper"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              required
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" isLoading={isSubmitting}>Submit Request</Button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        <Badge 
          active={statusFilter === 'all'} 
          onClick={() => setStatusFilter('all')}
        >
          All Requests
        </Badge>
        <Badge 
          active={statusFilter === 'pending'} 
          onClick={() => setStatusFilter('pending')}
        >
          Pending
        </Badge>
        <Badge 
          active={statusFilter === 'fulfilled'} 
          onClick={() => setStatusFilter('fulfilled')}
        >
          Fulfilled
        </Badge>
      </div>

      {loading ? (
        <div className="grid gap-4">
           {[1,2,3].map(n => <div key={n} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
           <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
           <p className="text-gray-500">
             {statusFilter === 'all' 
               ? "No requests found. Be the first to ask!" 
               : `No ${statusFilter} requests found.`}
           </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map(req => (
            <div key={req.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${req.status === 'fulfilled' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-gray-400">• {req.requestedAt}</span>
                    <span className="text-xs text-gray-400">• by {req.requestedBy}</span>
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{req.topic}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400">
                   {req.type.toUpperCase()} • {req.branch} • Sem {req.semester} • {req.subject}
                 </p>
               </div>
               <div className="flex gap-2 shrink-0">
                 <Button variant="secondary" onClick={() => handleEditClick(req)} className="p-2" title="Edit Request">
                    <Edit size={18} className="text-gray-600 dark:text-gray-300" />
                 </Button>
                 {req.status === 'pending' && (
                   <Button variant="outline" onClick={() => navigate('/upload')}>
                      <Upload size={16} className="mr-2" /> Fulfill
                   </Button>
                 )}
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={!!editingRequest} onClose={() => setEditingRequest(null)} title="Edit Request">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Resource Type"
              options={['note', 'pyq', 'book', 'syllabus']}
              value={editFormData.type}
              onChange={(e) => setEditFormData({...editFormData, type: e.target.value as ResourceType})}
            />
            <Select 
              label="Branch"
              options={BRANCHES}
              value={editFormData.branch}
              onChange={(e) => setEditFormData({...editFormData, branch: e.target.value})}
            />
            <Select 
              label="Semester"
              options={SEMESTERS}
              value={editFormData.semester}
              onChange={(e) => setEditFormData({...editFormData, semester: Number(e.target.value)})}
            />
            <Select 
              label="Subject"
              options={editAvailableSubjects}
              placeholder={editAvailableSubjects.length ? "Select Subject" : "Select Branch First"}
              value={editFormData.subject}
              onChange={(e) => setEditFormData({...editFormData, subject: e.target.value})}
            />
          </div>
          <Input 
            label="Topic / Details"
            placeholder="e.g. 2022 Endsem Question Paper"
            value={editFormData.topic}
            onChange={(e) => setEditFormData({...editFormData, topic: e.target.value})}
            required
          />
          <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="secondary" onClick={() => setEditingRequest(null)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Update Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};