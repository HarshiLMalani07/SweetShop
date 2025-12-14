import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setToken={setToken} setRole={setRole} theme={theme} toggleTheme={toggleTheme} />} 
        />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard token={token} role={role} theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;