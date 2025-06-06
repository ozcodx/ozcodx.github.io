/**
 * Utilidades para manejo de fechas en la aplicación
 */

/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD) para inputs de tipo date
 */
export const toDateInputFormat = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Convierte una fecha a formato legible en español
 */
export const toReadableDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Obtiene la fecha actual en formato ISO (YYYY-MM-DD)
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Valida si una fecha es válida
 */
export const isValidDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

/**
 * Convierte una fecha de input (YYYY-MM-DD) a objeto Date
 */
export const fromDateInputFormat = (dateString: string): Date => {
  const date = new Date(dateString + 'T00:00:00.000Z');
  return date;
}; 