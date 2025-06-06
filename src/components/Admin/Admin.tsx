import { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import { Login } from './Login';
import { BlogDashboard } from './BlogDashboard';
import './Admin.scss';

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar el componente
    const hasStoredToken = blogService.loadStoredToken();
    setIsAuthenticated(hasStoredToken);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Verificar periódicamente si la sesión ha expirado
    if (isAuthenticated) {
      const checkSession = () => {
        if (!blogService.isAuthenticated()) {
          setIsAuthenticated(false);
        }
      };

      // Verificar cada minuto
      const interval = setInterval(checkSession, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    blogService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="admin-container">
      <main className="admin-content">
        <BlogDashboard onLogout={handleLogout} />
      </main>
    </div>
  );
}; 