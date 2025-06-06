import { useState, useEffect } from 'react';
import { BlogEntryType } from '../Blog/types';
import { blogService } from '../../services/blogService';
import { BlogForm } from './BlogForm';
import './BlogDashboard.scss';

interface BlogDashboardProps {
  onLogout: () => void;
}

type ViewMode = 'list' | 'create' | 'edit';

export const BlogDashboard = ({ onLogout }: BlogDashboardProps) => {
  const [entries, setEntries] = useState<BlogEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingEntry, setEditingEntry] = useState<BlogEntryType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Cargar entradas
  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogEntries = await blogService.getBlogEntries();
      
      // Ordenar por fecha (más reciente primero)
      const sortedEntries = blogEntries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setEntries(sortedEntries);
    } catch (err) {
      console.error('Error loading blog entries:', err);
      setError('Error al cargar las entradas del blog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleCreateNew = () => {
    setEditingEntry(null);
    setViewMode('create');
  };

  const handleEdit = (entry: BlogEntryType) => {
    setEditingEntry(entry);
    setViewMode('edit');
  };

  const handleDelete = async (slug: string) => {
    try {
      await blogService.deleteBlogEntry(slug);
      await loadEntries(); // Recargar la lista
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Error al eliminar la entrada.');
    }
  };

  const handleFormSuccess = async () => {
    await loadEntries(); // Recargar la lista
    setViewMode('list'); // Volver a la lista
  };

  const handleBackToList = () => {
    setViewMode('list');
    setEditingEntry(null);
  };

  // Vista del formulario (crear o editar)
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <BlogForm 
        onLogout={onLogout}
        editingEntry={editingEntry}
        onSuccess={handleFormSuccess}
        onCancel={handleBackToList}
      />
    );
  }

  // Vista de la lista
  return (
    <div className="blog-dashboard">
      <header className="dashboard-header">
        <h1>Panel de Administración</h1>
        <div className="header-actions">
          <button 
            className="create-button"
            onClick={handleCreateNew}
          >
            + Nueva Entrada
          </button>
          <button 
            className="logout-button"
            onClick={onLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {loading && (
        <div className="loading-message">
          <p>Cargando entradas...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadEntries} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="empty-message">
          <p>No hay entradas de blog. ¡Crea la primera!</p>
          <button onClick={handleCreateNew} className="create-first-button">
            Crear Primera Entrada
          </button>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="entries-list">
          <div className="entries-header">
            <h2>Entradas del Blog ({entries.length})</h2>
          </div>
          
          <div className="entries-grid">
            {entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-info">
                  <h3 className="entry-title">{entry.title}</h3>
                  <p className="entry-date">{entry.date}</p>
                  <div className="entry-tags">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="tag-more">+{entry.tags.length - 3}</span>
                    )}
                  </div>
                  <div className="entry-abstract" 
                       dangerouslySetInnerHTML={{ 
                         __html: entry.abstract.length > 150 
                           ? entry.abstract.substring(0, 150) + '...' 
                           : entry.abstract 
                       }} 
                  />
                </div>
                
                <div className="entry-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(entry)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => setDeleteConfirm(entry.id)}
                  >
                    Eliminar
                  </button>
                </div>

                {deleteConfirm === entry.id && (
                  <div className="delete-confirm">
                    <p>¿Estás seguro de que quieres eliminar esta entrada?</p>
                    <div className="confirm-actions">
                      <button 
                        className="confirm-delete"
                        onClick={() => handleDelete(entry.id)}
                      >
                        Sí, Eliminar
                      </button>
                      <button 
                        className="cancel-delete"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 