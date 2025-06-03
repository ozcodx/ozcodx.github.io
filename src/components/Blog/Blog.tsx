import { useSearchParams, useNavigate } from 'react-router-dom';
import { BlogEntry } from './BlogEntry';
import { BlogEntryType } from './types';
import { blogService } from '../../services/blogService';
import { useState, useEffect, useRef } from 'react';
import './Blog.scss';

export const Blog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const entryId = searchParams.get('id');
  const blogContentRef = useRef<HTMLDivElement>(null);
  
  const [entries, setEntries] = useState<BlogEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar entradas desde la API
  useEffect(() => {
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
        setError('Error al cargar las entradas del blog. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []); // Solo cargar una vez al montar el componente

  // Efecto separado para manejar la navegación automática a la primera entrada
  useEffect(() => {
    // Si no hay entryId en la URL y hay entradas, navegar a la primera
    if (!entryId && entries.length > 0) {
      navigate(`/blog?id=${entries[0].id}`, { replace: true });
    }
  }, [entryId, entries, navigate]);

  // Efecto para hacer scroll al inicio cuando cambia la entrada seleccionada
  useEffect(() => {
    if (entryId) {
      // Opción 1: Scroll hacia el contenido del blog con offset para el header
      if (blogContentRef.current) {
        const element = blogContentRef.current;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - 100; // Offset de 100px para el header

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Opción 2: Scroll hacia la parte superior de la página
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [entryId]);
  
  // Encontrar la entrada actual o usar la primera como fallback
  const currentEntry = entries.find(e => e.id === entryId) || entries[0];

  const handleEntrySelect = (entry: BlogEntryType) => {
    navigate(`/blog?id=${entry.id}`);
  };

  // Mostrar loading
  if (loading) {
    return (
      <section className="blog">
        <div className="blog-container">
          <div className="blog-loading">
            <h2>BLOG</h2>
            <p>Cargando entradas...</p>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <section className="blog">
        <div className="blog-container">
          <div className="blog-error">
            <h2>BLOG</h2>
            <p className="error-message">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar mensaje si no hay entradas
  if (entries.length === 0) {
    return (
      <section className="blog">
        <div className="blog-container">
          <div className="blog-empty">
            <h2>BLOG</h2>
            <p>No hay entradas de blog disponibles.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog">
      <div className="blog-container">
        <div className="blog-sidebar">
          <h2>BLOG</h2>
          <ul className="blog-entries-list">
            {entries.map((entry) => (
              <li 
                key={entry.id}
                className={`blog-entry-item ${currentEntry?.id === entry.id ? 'active' : ''}`}
                onClick={() => handleEntrySelect(entry)}
              >
                <h3>{entry.title}</h3>
                <span className="entry-date">{entry.date}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="blog-content" ref={blogContentRef}>
          {currentEntry && <BlogEntry entry={currentEntry} />}
        </div>
      </div>
    </section>
  );
}; 