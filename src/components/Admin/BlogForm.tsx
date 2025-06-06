import { useState, useEffect } from 'react';
import { blogService, CreateBlogEntryRequest, UpdateBlogEntryRequest } from '../../services/blogService';
import { BlogEntryType } from '../Blog/types';
import { HtmlEditor } from './HtmlEditor';
import { CyberpunkDatePicker } from './CyberpunkDatePicker';
import { getCurrentDateISO } from '../../utils/dateUtils';
import './BlogForm.scss';

interface BlogFormData {
  title: string;
  abstract: string;
  content: string;
  tags: string;
  date: Date;
}

interface BlogFormProps {
  onLogout: () => void;
  editingEntry?: BlogEntryType | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BlogForm = ({ onLogout, editingEntry, onSuccess, onCancel }: BlogFormProps) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    abstract: '',
    content: '',
    tags: '',
    date: new Date() // Fecha actual por defecto
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editingEntry;

  // Cargar datos de la entrada si estamos editando
  useEffect(() => {
    if (editingEntry) {
      setFormData({
        title: editingEntry.title,
        abstract: editingEntry.abstract,
        content: editingEntry.content,
        tags: editingEntry.tags.join(', '),
        date: new Date(editingEntry.date)
      });
    } else {
      // Limpiar formulario si no estamos editando
      setFormData({
        title: '',
        abstract: '',
        content: '',
        tags: '',
        date: new Date()
      });
    }
    setSuccess(false);
    setError(null);
  }, [editingEntry]);

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

      if (isEditing && editingEntry) {
        // Actualizar entrada existente
        const updateData: UpdateBlogEntryRequest = {
          title: formData.title.trim(),
          abstract,
          content: formData.content.trim(),
          tags,
          date: formData.date.toISOString().split('T')[0]
        };

        await blogService.updateBlogEntry(editingEntry.id, updateData);
      } else {
        // Crear nueva entrada
        const slug = blogService.generateSlug(formData.title);
        const createData: CreateBlogEntryRequest = {
          slug,
          title: formData.title.trim(),
          abstract,
          content: formData.content.trim(),
          tags,
          date: formData.date.toISOString().split('T')[0]
        };

        await blogService.createBlogEntry(createData);
      }
      
      setSuccess(true);
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500); // Dar tiempo para mostrar el mensaje de éxito
      } else if (!isEditing) {
        // Solo limpiar formulario si estamos creando (no editando)
        setFormData({
          title: '',
          abstract: '',
          content: '',
          tags: '',
          date: new Date()
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 
        isEditing ? 'Error al actualizar la entrada' : 'Error al crear la entrada';
      setError(errorMessage);
      console.error('Error with blog entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (isEditing && editingEntry) {
      // Si estamos editando, restaurar datos originales
      setFormData({
        title: editingEntry.title,
        abstract: editingEntry.abstract,
        content: editingEntry.content,
        tags: editingEntry.tags.join(', '),
        date: new Date(editingEntry.date)
      });
    } else {
      // Si estamos creando, limpiar formulario
      setFormData({
        title: '',
        abstract: '',
        content: '',
        tags: '',
        date: new Date()
      });
    }
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="blog-form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Editar Entrada de Blog' : 'Crear Nueva Entrada de Blog'}</h2>
        {onCancel && (
          <button 
            type="button" 
            className="back-button"
            onClick={onCancel}
            disabled={loading}
          >
            ← Volver a la Lista
          </button>
        )}
      </div>
      
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
          <CyberpunkDatePicker
            selected={formData.date}
            onChange={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
            disabled={loading}
            placeholder="dd/mm/yyyy"
            id="date"
            required
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
            {isEditing ? '¡Entrada actualizada exitosamente!' : '¡Entrada creada exitosamente!'}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 
              (isEditing ? 'Actualizando...' : 'Creando...') : 
              (isEditing ? 'Actualizar Entrada' : 'Crear Entrada')
            }
          </button>
          
          <button 
            type="button" 
            className="reset-button"
            onClick={handleReset}
            disabled={loading}
          >
            {isEditing ? 'Restaurar' : 'Limpiar'}
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