import { Resource, User, ResourceType, MaterialRequest } from '../types';
import { MOCK_RESOURCES, MOCK_REQUESTS, MOCK_USERS, MOCK_EXTERNAL_RESOURCES } from '../constants';

const DELAY = 600;

export const api = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('admin')) {
             resolve({
                id: 'u2',
                name: 'Admin User',
                email: email,
                role: 'admin'
             });
        } else if (email && password) {
          resolve({
            id: 'u1',
            name: 'Alex Student',
            email: email,
            role: 'student',
            branch: 'CSE',
            semester: 5,
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, DELAY);
    });
  },

  getResources: async (type?: ResourceType | 'all'): Promise<Resource[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!type || type === 'all') {
          resolve(MOCK_RESOURCES);
        } else {
          resolve(MOCK_RESOURCES.filter(r => r.type === type));
        }
      }, DELAY);
    });
  },

  getTrendingResources: async (): Promise<Resource[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Sort by downloads desc
        const sorted = [...MOCK_RESOURCES].sort((a, b) => b.downloads - a.downloads);
        resolve(sorted.slice(0, 4));
      }, DELAY);
    });
  },

  uploadResource: async (data: Partial<Resource>): Promise<Resource> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newResource: Resource = {
          id: Math.random().toString(36).substr(2, 9),
          title: data.title || 'Untitled',
          type: data.type || 'note',
          branch: data.branch || 'CSE',
          semester: data.semester || 1,
          subject: data.subject || 'General',
          downloadUrl: data.downloadUrl || '#',
          downloads: 0,
          likes: 0,
          uploadedBy: 'You',
          uploadedAt: new Date().toISOString().split('T')[0],
          ...data,
        } as Resource;
        
        // In a real app, we would push to backend. Here we just return it.
        MOCK_RESOURCES.unshift(newResource);
        resolve(newResource);
      }, 1000);
    });
  },

  deleteResource: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_RESOURCES.findIndex(r => r.id === id);
        if (index !== -1) {
            MOCK_RESOURCES.splice(index, 1);
        }
        resolve();
      }, DELAY);
    });
  },

  getRequests: async (): Promise<MaterialRequest[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return requests sorted by date (newest first)
        const sorted = [...MOCK_REQUESTS].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
        resolve(sorted);
      }, DELAY);
    });
  },

  createRequest: async (data: Partial<MaterialRequest>): Promise<MaterialRequest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: MaterialRequest = {
          id: Math.random().toString(36).substr(2, 9),
          topic: data.topic || 'Untitled Request',
          type: data.type || 'note',
          branch: data.branch || 'CSE',
          semester: data.semester || 1,
          subject: data.subject || 'General',
          requestedBy: 'You',
          requestedAt: new Date().toISOString().split('T')[0],
          status: 'pending',
          ...data,
        } as MaterialRequest;
        
        MOCK_REQUESTS.unshift(newRequest);
        resolve(newRequest);
      }, DELAY);
    });
  },

  updateRequest: async (id: string, data: Partial<MaterialRequest>): Promise<MaterialRequest> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_REQUESTS.findIndex(r => r.id === id);
        if (index !== -1) {
          MOCK_REQUESTS[index] = { ...MOCK_REQUESTS[index], ...data };
          resolve(MOCK_REQUESTS[index]);
        } else {
          reject(new Error("Request not found"));
        }
      }, DELAY);
    });
  },

  deleteRequest: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_REQUESTS.findIndex(r => r.id === id);
        if (index !== -1) {
            MOCK_REQUESTS.splice(index, 1);
        }
        resolve();
      }, DELAY);
    });
  },

  getUsers: async (): Promise<User[]> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(MOCK_USERS);
          }, DELAY);
      });
  },

  deleteUser: async (id: string): Promise<void> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const index = MOCK_USERS.findIndex(u => u.id === id);
              if (index !== -1) {
                  MOCK_USERS.splice(index, 1);
              }
              resolve();
          }, DELAY);
      });
  },

  searchExternalResources: async (query: string): Promise<Resource[]> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const lowerQuery = query.toLowerCase();
              if (!lowerQuery) {
                  resolve([]);
                  return;
              }
              const results = MOCK_EXTERNAL_RESOURCES.filter(res => 
                  res.title.toLowerCase().includes(lowerQuery) || 
                  res.subject.toLowerCase().includes(lowerQuery) ||
                  res.author?.toLowerCase().includes(lowerQuery)
              );
              resolve(results);
          }, 800);
      });
  }
};