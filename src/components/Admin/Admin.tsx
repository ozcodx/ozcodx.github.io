import { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import { Login } from './Login';
import { BlogForm } from './BlogForm';
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
      <header className="admin-header">
        <h1>Panel de Administración</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>
      
      <main className="admin-content">
        <BlogForm />
      </main>
    </div>
  );
}; 