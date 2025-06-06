import { useState } from 'react';
import { blogService, CreateBlogEntryRequest } from '../../services/blogService';
import { HtmlEditor } from './HtmlEditor';
import { getCurrentDateISO } from '../../utils/dateUtils';
import './BlogForm.scss';

interface BlogFormData {
  title: string;
  abstract: string;
  content: string;
  tags: string;
  date: string;
}

interface BlogFormProps {
  onLogout: () => void;
}

export const BlogForm = ({ onLogout }: BlogFormProps) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    abstract: '',
    content: '',
    tags: '',
    date: getCurrentDateISO() // Fecha actual por defecto
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof BlogFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Limpiar mensajes al editar
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validar campos requeridos
      if (!formData.title.trim()) {
        throw new Error('El título es requerido');
      }
      
      // Validar contenido HTML (remover tags HTML para verificar si hay contenido real)
      const contentText = formData.content.replace(/<[^>]*>/g, '').trim();
      if (!contentText) {
        throw new Error('El contenido es requerido');
      }

      // Generar slug automáticamente
      const slug = blogService.generateSlug(formData.title);

      // Procesar tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Generar abstract automático si está vacío
      let abstract = formData.abstract.trim();
      if (!abstract || abstract.replace(/<[^>]*>/g, '').trim() === '') {
        abstract = `<p>Resumen de: ${formData.title.trim()}</p>`;
      }

      const blogEntry: CreateBlogEntryRequest = {
        slug,
        title: formData.title.trim(),
        abstract,
        content: formData.content.trim(),
        tags,
        date: formData.date
      };

      await blogService.createBlogEntry(blogEntry);
      
      setSuccess(true);
      
      // Limpiar formulario después del éxito
      setFormData({
        title: '',
        abstract: '',
        content: '',
        tags: '',
        date: getCurrentDateISO()
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la entrada';
      setError(errorMessage);
      console.error('Error creating blog entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      abstract: '',
      content: '',
      tags: '',
      date: getCurrentDateISO()
    });
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="blog-form-container">
      <h2>Crear Nueva Entrada de Blog</h2>
      
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleInputChange('title')}
            required
            disabled={loading}
            placeholder="Título de la entrada"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Fecha de Publicación *</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleInputChange('date')}
            required
            disabled={loading}
          />
          <small className="field-help">
            Esta fecha aparecerá como la fecha de publicación de la entrada en el blog.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="abstract">Resumen</label>
          <HtmlEditor
            value={formData.abstract}
            onChange={(value) => setFormData(prev => ({ ...prev, abstract: value }))}
            disabled={loading}
            placeholder="Resumen de la entrada. Si se deja vacío, se generará automáticamente."
            height="150px"
            simple={true}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Contenido *</label>
          <HtmlEditor
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            disabled={loading}
            placeholder="Contenido completo de la entrada"
            height="400px"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={handleInputChange('tags')}
            disabled={loading}
            placeholder="Tags separados por comas (ej: Tecnología, Reflexiones, Desarrollo)"
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            ¡Entrada creada exitosamente!
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Entrada'}
          </button>
          
          <button 
            type="button" 
            className="reset-button"
            onClick={handleReset}
            disabled={loading}
          >
            Limpiar
          </button>

          <button 
            type="button" 
            className="logout-button"
            onClick={onLogout}
            disabled={loading}
          >
            Cerrar Sesión
          </button>
        </div>
      </form>
    </div>
  );
}; 