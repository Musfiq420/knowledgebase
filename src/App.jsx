import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Article from './pages/Article';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import NewArticle from './pages/NewArticle';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsMobileMenuOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-gray-100">
        {isLoggedIn && (
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} className="p-4">
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        )}
        {isLoggedIn && (
          <div
            className={`fixed z-40 inset-y-0 left-0 w-64 transition duration-300 transform ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:static lg:inset-0 bg-white shadow-md`}
          >
            <div className="p-4 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Knowledge Base</h1>
              <button onClick={toggleMobileMenu} className="lg:hidden">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <Sidebar
              onCategorySelect={handleCategorySelect}
              selectedNotebook={selectedNotebook}
              setSelectedNotebook={setSelectedNotebook}
              selectedCategory={selectedCategory}
              onLogout={handleLogout}
            />
          </div>
        )}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            isLoggedIn ? 'lg:ml-2' : ''
          }`}
        >
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Dashboard selectedCategory={selectedCategory} selectedNotebook={selectedNotebook} />
                </PrivateRoute>
              }
            />
            <Route path="/article/:articleId" element={<Article />} />
            <Route path="/article/new" element={<NewArticle selectedCategory={selectedCategory} selectedNotebook={selectedNotebook} />} />
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
