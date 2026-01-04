import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ResourcesPage } from './pages/Resources';
import { UploadPage } from './pages/Upload';
import { RequestsPage } from './pages/Requests';
import { AdminPanel } from './pages/AdminPanel';
import { Auth } from './pages/Auth';
import { User } from './types';

function App() {
  // Simple auth state management
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route 
            path="/pyqs" 
            element={<ResourcesPage type="pyq" title="Previous Year Questions" />} 
          />
          <Route 
            path="/notes" 
            element={<ResourcesPage type="note" title="Lecture Notes" />} 
          />
          <Route 
            path="/books" 
            element={<ResourcesPage type="book" title="Reference Books" />} 
          />
          <Route 
            path="/syllabus" 
            element={<ResourcesPage type="syllabus" title="Syllabus" />} 
          />
          <Route 
            path="/search" 
            element={<ResourcesPage title="Search Results" />} 
          />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/admin" element={user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;