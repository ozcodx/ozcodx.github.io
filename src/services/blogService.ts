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
}

export interface BlogApiResponse {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

class BlogService {
  private token: string | null = null;

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
      
      // Guardar token en localStorage para persistencia
      localStorage.setItem('blog_admin_token', data.token);
      
      return data.token;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // Logout
  logout(): void {
    this.token = null;
    localStorage.removeItem('blog_admin_token');
  }

  // Verificar si hay un token guardado
  loadStoredToken(): boolean {
    const storedToken = localStorage.getItem('blog_admin_token');
    if (storedToken) {
      this.token = storedToken;
      return true;
    }
    return false;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.token !== null;
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

  // Mapear respuesta de la API al formato del frontend
  private mapApiResponseToBlogEntry(apiResponse: BlogApiResponse): BlogEntryType {
    // Validar y procesar la fecha
    let dateString = '';
    try {
      if (apiResponse.created_at) {
        const date = new Date(apiResponse.created_at);
        // Verificar si la fecha es válida
        if (!isNaN(date.getTime())) {
          dateString = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        } else {
          // Si la fecha no es válida, usar la fecha actual
          console.warn(`Invalid date for blog entry ${apiResponse.slug}: ${apiResponse.created_at}`);
          dateString = new Date().toISOString().split('T')[0];
        }
      } else {
        // Si no hay fecha, usar la fecha actual
        console.warn(`Missing date for blog entry ${apiResponse.slug}`);
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