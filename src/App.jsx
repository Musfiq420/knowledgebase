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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-gray-100">
        {isLoggedIn && (
          <Sidebar
            onCategorySelect={handleCategorySelect}
            selectedNotebook={selectedNotebook}
            setSelectedNotebook={setSelectedNotebook}
            selectedCategory={selectedCategory}
            onLogout={handleLogout}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
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
