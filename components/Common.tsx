import React from 'react';
import { Download, ThumbsUp, Calendar, User, FileText, X } from 'lucide-react';
import { Resource } from '../types';

// --- Components ---

interface CardProps {
  resource: Resource;
  onClick?: (resource: Resource) => void;
}

export const ResourceCard: React.FC<CardProps> = ({ resource, onClick }) => {
  const getIcon = () => {
    switch (resource.type) {
      case 'pyq': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'note': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'book': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'syllabus': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeLabel = () => {
    switch (resource.type) {
      case 'pyq': return 'PYQ';
      case 'note': return 'Notes';
      case 'book': return 'Book';
      case 'syllabus': return 'Syllabus';
      default: return 'File';
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resource.downloadUrl && resource.downloadUrl !== '#') {
       window.open(resource.downloadUrl, '_blank');
    }
  };

  return (
    <div 
      onClick={() => onClick && onClick(resource)}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getIcon()}`}>
          {getTypeLabel()}
        </div>
        <div className="text-xs text-gray-400 flex items-center">
          <Calendar size={12} className="mr-1" />
          {resource.uploadedAt}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 flex-grow group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {resource.title}
      </h3>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1">
        <div className="flex items-center">
          <span className="font-medium mr-2 text-gray-700 dark:text-gray-300">{resource.branch}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
          <span>Sem {resource.semester}</span>
        </div>
        {resource.subject && (
          <div className="truncate text-xs text-gray-400">
            {resource.subject}
          </div>
        )}
      </div>

      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center"><Download size={14} className="mr-1" /> {resource.downloads}</span>
          <span className="flex items-center"><ThumbsUp size={14} className="mr-1" /> {resource.likes}</span>
        </div>
        <button 
          onClick={handleDownload}
          className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
          title="Download"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, active?: boolean, onClick?: () => void }> = ({ children, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
      ${active 
        ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
    `}
  >
    {children}
  </button>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', isLoading, className, ...props }) => {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const baseStyles = "rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20",
    secondary: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white",
    outline: "border-2 border-gray-200 dark:border-gray-700 hover:border-primary-600 dark:hover:border-primary-500 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 bg-transparent"
  };

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={`
          w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 
          py-2.5 ${icon ? 'pl-10' : 'pl-4'} pr-4 
          text-gray-900 dark:text-gray-100 placeholder-gray-400 
          focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all
          ${className || ''}
        `}
        {...props}
      />
    </div>
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[] | number[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, placeholder, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
    <div className="relative">
      <select
        className={`
          w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 
          py-2.5 pl-4 pr-10 appearance-none
          text-gray-900 dark:text-gray-100
          focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all
          ${className || ''}
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full ${maxWidth} p-6 relative flex flex-col max-h-[90vh]`}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate pr-4">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto min-h-0">
            {children}
        </div>
      </div>
    </div>
  );
};