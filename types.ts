export type ResourceType = 'pyq' | 'note' | 'book' | 'syllabus';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  branch: string;
  semester: number;
  subject: string;
  author?: string; // For books/notes
  year?: number; // For PYQ
  examType?: 'Midsem' | 'Endsem'; // For PYQ
  tags?: string[];
  description?: string;
  downloadUrl: string;
  downloads: number;
  likes: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface MaterialRequest {
  id: string;
  topic: string;
  type: ResourceType;
  branch: string;
  semester: number;
  subject: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'fulfilled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  branch?: string;
  semester?: number;
}

export interface FilterState {
  search: string;
  branch: string;
  semester: string;
  subject: string;
  type: ResourceType | 'all';
}

export const BRANCHES = ['CSE', 'ECE', 'ME', 'EE', 'Civil', 'IT'];
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
export const EXAM_TYPES = ['Midsem', 'Endsem'];
