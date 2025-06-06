# Editor HTML para Blog

## Descripción

Se ha integrado un editor HTML rico (WYSIWYG) en el formulario de creación de entradas de blog, reemplazando los campos de textarea simples con un editor más avanzado basado en React Quill.

## Características

### Editor HTML (`HtmlEditor.tsx`)

- **Editor WYSIWYG completo**: Permite formatear texto con herramientas visuales
- **Modo simple**: Toolbar reducido para campos como resúmenes con solo:
  - Formato básico (negrita, cursiva, subrayado)
  - Listas ordenadas y no ordenadas
  - Enlaces
  - Limpiar formato
- **Modo completo**: Toolbar completo para contenido principal con:
  - Encabezados (H1-H6)
  - Formato de texto (negrita, cursiva, subrayado, tachado)
  - Colores de texto y fondo
  - Listas ordenadas y no ordenadas
  - Alineación de texto
  - Enlaces, imágenes y videos
  - Citas y bloques de código
  - Subíndices y superíndices

### Integración en BlogForm

- **Campo Título**: Input de texto para el título de la entrada
- **Campo Fecha**: Selector de fecha para establecer la fecha de publicación
  - Por defecto muestra la fecha actual
  - Permite seleccionar cualquier fecha pasada o futura
  - La fecha se envía a la API y se almacena en la base de datos
- **Campo Abstract**: Editor HTML simple con altura reducida (150px) para resúmenes
  - Solo herramientas básicas de formato
  - Interfaz más limpia y menos distractora
- **Campo Content**: Editor HTML completo con altura extendida (400px) para contenido principal
  - Todas las herramientas de formato disponibles
- **Campo Tags**: Input de texto para tags separados por comas
- **Validación mejorada**: Verifica que haya contenido real removiendo tags HTML
- **Generación automática de abstract**: Si el abstract está vacío, se genera automáticamente

## Estilos

### Tema Cyberpunk
El editor se ha estilizado para mantener la consistencia con el tema cyberpunk del sitio:
- Fondo oscuro con transparencia
- Bordes verdes neón
- Texto verde para encabezados
- Efectos de hover y focus con glow verde
- Toolbar con iconos blancos sobre fondo oscuro

### Responsive
- Adaptación automática para dispositivos móviles
- Toolbar compacto en pantallas pequeñas
- Fuente de 16px en móviles para evitar zoom automático en iOS

## Uso

### Editor Simple (para resúmenes)
```tsx
import { HtmlEditor } from './HtmlEditor';

<HtmlEditor
  value={abstract}
  onChange={(value) => setAbstract(value)}
  placeholder="Resumen breve..."
  disabled={loading}
  height="150px"
  simple={true}
/>
```

### Editor Completo (para contenido)
```tsx
<HtmlEditor
  value={content}
  onChange={(value) => setContent(value)}
  placeholder="Escribe tu contenido aquí..."
  disabled={loading}
  height="400px"
  simple={false} // o simplemente omitir la prop
/>
```

## Dependencias

- `react-quill`: Editor WYSIWYG principal
- `quill`: Motor del editor
- Estilos CSS de Quill incluidos automáticamente

## Archivos modificados

- `src/components/Admin/HtmlEditor.tsx` - Nuevo componente del editor HTML
- `src/components/Admin/HtmlEditor.scss` - Estilos del editor HTML
- `src/components/Admin/BlogForm.tsx` - Integración del editor y campo de fecha
- `src/components/Admin/BlogForm.scss` - Estilos actualizados para editor y fecha
- `src/services/blogService.ts` - Interfaz actualizada para incluir fecha
- `src/types/react-quill.d.ts` - Declaraciones de tipos TypeScript
- `package.json` - Nuevas dependencias añadidas 