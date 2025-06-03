import { useState } from 'react';
import { blogService, CreateBlogEntryRequest } from '../../services/blogService';
import './BlogForm.scss';

interface BlogFormData {
  title: string;
  abstract: string;
  content: string;
  tags: string;
}

export const BlogForm = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    abstract: '',
    content: '',
    tags: ''
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
      if (!formData.content.trim()) {
        throw new Error('El contenido es requerido');
      }

      // Generar slug automáticamente
      const slug = blogService.generateSlug(formData.title);

      // Procesar tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const blogEntry: CreateBlogEntryRequest = {
        slug,
        title: formData.title.trim(),
        abstract: formData.abstract.trim() || `<p>Resumen de: ${formData.title.trim()}</p>`,
        content: formData.content.trim(),
        tags
      };

      await blogService.createBlogEntry(blogEntry);
      
      setSuccess(true);
      
      // Limpiar formulario después del éxito
      setFormData({
        title: '',
        abstract: '',
        content: '',
        tags: ''
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
      tags: ''
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
          <label htmlFor="abstract">Resumen (Abstract)</label>
          <textarea
            id="abstract"
            value={formData.abstract}
            onChange={handleInputChange('abstract')}
            disabled={loading}
            placeholder="Resumen de la entrada (HTML permitido). Si se deja vacío, se generará automáticamente."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Contenido *</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={handleInputChange('content')}
            required
            disabled={loading}
            placeholder="Contenido completo de la entrada (HTML permitido)"
            rows={15}
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
        </div>
      </form>
    </div>
  );
}; 