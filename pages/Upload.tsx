import React, { useState } from 'react';
import { Upload as UploadIcon, CheckCircle } from 'lucide-react';
import { Input, Select, Button } from '../components/Common';
import { BRANCHES, SEMESTERS, ResourceType } from '../types';
import { SUBJECTS_BY_BRANCH } from '../constants';
import { api } from '../services/mockService';

export const UploadPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'note' as ResourceType,
    branch: 'CSE',
    semester: 1,
    subject: '',
    file: null as File | null
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate upload
      await api.uploadResource({
        title: formData.title,
        type: formData.type,
        branch: formData.branch,
        semester: Number(formData.semester),
        subject: formData.subject,
      });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      setFormData({
        title: '',
        type: 'note',
        branch: 'CSE',
        semester: 1,
        subject: '',
        file: null
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSubjects = SUBJECTS_BY_BRANCH[formData.branch] || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Upload Resources</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Share your notes and help juniors ace their exams.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upload Successful!</h2>
            <p className="text-gray-500">Your resource has been submitted for review.</p>
            <Button className="mt-6" onClick={() => setIsSuccess(false)}>Upload Another</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Resource Type"
                options={['note', 'pyq', 'book', 'syllabus']}
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              />
               <Select 
                label="Branch"
                options={BRANCHES}
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Semester"
                options={SEMESTERS}
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
              />
              <Select 
                label="Subject"
                options={availableSubjects}
                placeholder={availableSubjects.length ? "Select Subject" : "Select Branch First"}
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
              />
            </div>

            <Input 
              label="Title / Topic"
              placeholder="e.g. Unit 1 Handwritten Notes"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">File Upload</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleChange('file', e.target.files?.[0] || null)}
                  required
                />
                <UploadIcon size={32} className="text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 10MB</p>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Submit Resource
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};