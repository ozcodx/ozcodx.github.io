import { BlogEntryType } from '../components/Blog/types';

const API_BASE_URL = 'https://forja-api.onrender.com';

export interface LoginCredentials {
  username: string;
  password: string;
  site: string;
}

export interface CreateBlogEntryRequest {
  slug: string;
  title: string;
  abstract: string;
  content: string;
  tags: string[];
  date?: string; // Fecha opcional en formato ISO (YYYY-MM-DD)
}

export interface UpdateBlogEntryRequest {
  title: string;
  abstract: string;
  content: string;
  tags: string[];
  date?: string; // Fecha opcional en formato ISO (YYYY-MM-DD)
}

export interface BlogApiResponse {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  content: string;
  tags: string[];
  date: string | { $date: { $numberLong: string } } | number; // Puede ser string ISO, objeto MongoDB, o timestamp
  created_at?: string; // Opcional por compatibilidad
  updated_at?: string; // Opcional por compatibilidad
}

class BlogService {
  private token: string | null = null;
  private readonly SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 horas en milisegundos

  // Login y obtener token
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      this.token = data.token;
      
      // Guardar token y timestamp en localStorage para persistencia
      const loginData = {
        token: data.token,
        timestamp: Date.now()
      };
      localStorage.setItem('blog_admin_session', JSON.stringify(loginData));
      
      return data.token;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // Logout
  logout(): void {
    this.token = null;
    localStorage.removeItem('blog_admin_session');
    // Mantener compatibilidad con el token anterior
    localStorage.removeItem('blog_admin_token');
  }

  // Verificar si la sesión ha expirado
  private isSessionExpired(): boolean {
    const sessionData = localStorage.getItem('blog_admin_session');
    if (!sessionData) return true;

    try {
      const { timestamp } = JSON.parse(sessionData);
      const now = Date.now();
      return (now - timestamp) > this.SESSION_DURATION;
    } catch {
      return true;
    }
  }

  // Verificar si hay un token guardado y válido
  loadStoredToken(): boolean {
    // Primero verificar el nuevo formato con timestamp
    const sessionData = localStorage.getItem('blog_admin_session');
    if (sessionData) {
      try {
        const { token, timestamp } = JSON.parse(sessionData);
        const now = Date.now();
        
        if ((now - timestamp) <= this.SESSION_DURATION) {
          this.token = token;
          return true;
        } else {
          // Sesión expirada, limpiar
          this.logout();
          return false;
        }
      } catch {
        // Datos corruptos, limpiar
        this.logout();
        return false;
      }
    }

    // Compatibilidad con el formato anterior (sin timestamp)
    const oldToken = localStorage.getItem('blog_admin_token');
    if (oldToken) {
      // Migrar al nuevo formato asumiendo que acaba de iniciar sesión
      this.token = oldToken;
      const loginData = {
        token: oldToken,
        timestamp: Date.now()
      };
      localStorage.setItem('blog_admin_session', JSON.stringify(loginData));
      localStorage.removeItem('blog_admin_token');
      return true;
    }

    return false;
  }

  // Verificar si está autenticado y la sesión no ha expirado
  isAuthenticated(): boolean {
    if (!this.token) return false;
    
    if (this.isSessionExpired()) {
      this.logout();
      return false;
    }
    
    return true;
  }

  // Obtener todas las entradas del blog
  async getBlogEntries(): Promise<BlogEntryType[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ozkar/blog`);

      if (!response.ok) {
        throw new Error(`Failed to fetch blog entries: ${response.status}`);
      }

      const data: BlogApiResponse[] = await response.json();
      
      // Convertir la respuesta de la API al formato esperado por el frontend
      return data.map(this.mapApiResponseToBlogEntry);
    } catch (error) {
      console.error('Error fetching blog entries:', error);
      throw error;
    }
  }

  // Crear una nueva entrada de blog
  async createBlogEntry(entry: CreateBlogEntryRequest): Promise<BlogApiResponse> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ozkar/blog`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create blog entry: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating blog entry:', error);
      throw error;
    }
  }

  // Actualizar una entrada de blog existente
  async updateBlogEntry(slug: string, entry: UpdateBlogEntryRequest): Promise<BlogApiResponse> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ozkar/blog/${slug}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update blog entry: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating blog entry:', error);
      throw error;
    }
  }

  // Eliminar una entrada de blog
  async deleteBlogEntry(slug: string): Promise<void> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ozkar/blog/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete blog entry: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting blog entry:', error);
      throw error;
    }
  }

  // Mapear respuesta de la API al formato del frontend
  private mapApiResponseToBlogEntry(apiResponse: BlogApiResponse): BlogEntryType {
    // Validar y procesar la fecha
    let dateString = '';
    try {
      if (apiResponse.date) {
        if (typeof apiResponse.date === 'string') {
          // Si ya es un string en formato ISO, intentar parsearlo
          const date = new Date(apiResponse.date);
          if (!isNaN(date.getTime())) {
            dateString = date.toISOString().split('T')[0];
          } else {
            console.warn(`Invalid date string for blog entry ${apiResponse.slug}: ${apiResponse.date}`);
            dateString = new Date().toISOString().split('T')[0];
          }
        } else if (typeof apiResponse.date === 'object' && apiResponse.date.$date) {
          // Formato MongoDB: { $date: { $numberLong: "1748975155359" } }
          const timestamp = parseInt(apiResponse.date.$date.$numberLong, 10);
          const date = new Date(timestamp);
          
          if (!isNaN(date.getTime())) {
            dateString = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
          } else {
            console.warn(`Invalid MongoDB date for blog entry ${apiResponse.slug}: ${apiResponse.date}`);
            dateString = new Date().toISOString().split('T')[0];
          }
        } else if (typeof apiResponse.date === 'number') {
          // Si es un timestamp directo
          const date = new Date(apiResponse.date);
          if (!isNaN(date.getTime())) {
            dateString = date.toISOString().split('T')[0];
          } else {
            console.warn(`Invalid timestamp for blog entry ${apiResponse.slug}: ${apiResponse.date}`);
            dateString = new Date().toISOString().split('T')[0];
          }
        } else {
          console.warn(`Unknown date format for blog entry ${apiResponse.slug}:`, apiResponse.date);
          dateString = new Date().toISOString().split('T')[0];
        }
      } else if (apiResponse.created_at) {
        // Fallback al campo created_at si existe
        const date = new Date(apiResponse.created_at);
        if (!isNaN(date.getTime())) {
          dateString = date.toISOString().split('T')[0];
        } else {
          console.warn(`Invalid created_at for blog entry ${apiResponse.slug}: ${apiResponse.created_at}`);
          dateString = new Date().toISOString().split('T')[0];
        }
      } else {
        // Si no hay ninguna fecha, usar la fecha actual
        console.warn(`No date field found for blog entry ${apiResponse.slug}`);
        dateString = new Date().toISOString().split('T')[0];
      }
    } catch (error) {
      // En caso de cualquier error, usar la fecha actual
      console.error(`Error processing date for blog entry ${apiResponse.slug}:`, error);
      dateString = new Date().toISOString().split('T')[0];
    }

    return {
      id: apiResponse.slug,
      title: apiResponse.title,
      date: dateString,
      content: apiResponse.content,
      abstract: apiResponse.abstract,
      tags: apiResponse.tags,
    };
  }

  // Generar slug a partir del título
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
      .trim();
  }
}

// Exportar una instancia singleton
export const blogService = new BlogService(); 