export interface Project {
  id: string;
  titulo: string;
  descripcion: string;
  tecnologias: Array<{
    name: string;
    icon: string;
  }>;
  caracteristicas: string[];
  imagen: string;
  url: string;
  fecha: string;
}

export const projects: Record<string, Project> = {
  "EMM4aX9bN2cP5qR8tY1z": {
    "id": "EMM4aX9bN2cP5qR8tY1z",
    "titulo": "Emma - Interfaz de Chat para Ollama",
    "descripcion": "Emma es una interfaz de chat en Python diseñada para interactuar con Ollama, específicamente optimizada para el modelo gemma3:1b. Esta interfaz proporciona una manera eficiente de administrar interacciones con Ollama, contextos de conversación, memoria de chat, configuraciones personalizadas, personalidades para el asistente e historial de conversaciones. Incluye múltiples personalidades predefinidas y un sistema de memoria avanzado para conversaciones más coherentes.",
    "tecnologias": [
      { "name": "Python", "icon": "fa-brands fa-python" },
      { "name": "Ollama", "icon": "fa-solid fa-robot" },
      { "name": "AI/ML", "icon": "fa-solid fa-brain" },
      { "name": "CLI", "icon": "fa-solid fa-terminal" },
      { "name": "YAML", "icon": "fa-solid fa-file-code" }
    ],
    "caracteristicas": [
      "Interfaz de línea de comandos intuitiva y amigable",
      "Múltiples personalidades predefinidas (Técnica, Creativa, Concisa, etc.)",
      "Sistema de memoria a largo plazo con búsqueda contextual",
      "Gestión completa de conversaciones y historial",
      "Configuración flexible de parámetros del modelo",
      "Soporte para diferentes modelos de Ollama",
      "Comandos especiales integrados para gestión avanzada"
    ],
    "imagen": "proyecto7.png",
    "url": "https://github.com/ozkar-co/Emma",
    "fecha": "2025-01-10T05:00:00.000Z"
  },
  "ASH7wK3mN9xP2qR5tY8z": {
    "id": "ASH7wK3mN9xP2qR5tY8z",
    "titulo": "Ashwake",
    "descripcion": "Ashwake es un juego de supervivencia RPG sandbox ambientado en las desoladas secuelas de una era olvidada. En un mundo donde Velrot, una corrupción desconocida e insidiosa, ha retorcido la tierra y la vida misma, despiertas solo como una Unidad Amnesis, un recipiente biomecánico sin memoria ni pasado. Sin guía, ciudades o otros seres conscientes, tu camino es tuyo. Explora, sobrevive y descubre la verdad enterrada bajo ruinas y tiempo.",
    "tecnologias": [
      { "name": "Lua", "icon": "fa-solid fa-code" },
      { "name": "Luanti Engine", "icon": "fa-solid fa-gamepad" },
      { "name": "Voxel", "icon": "fa-solid fa-cube" },
      { "name": "Game Development", "icon": "fa-solid fa-puzzle-piece" }
    ],
    "caracteristicas": [
      "Supervivencia impulsada por exploración en mundo abierto",
      "Sistema de progresión alquímica complejo",
      "Entidades elementales nocturnas corruptas por Velrot",
      "Recuperación y reconstrucción de artefactos antiguos",
      "Viaje dimensional a través de portales misteriosos"
    ],
    "imagen": "proyecto6.png",
    "url": "https://github.com/ozkar-co/ashwake",
    "fecha": "2025-01-15T05:00:00.000Z"
  },
  "LUjsG4lANB3gyA48GTfg": {
    "id": "LUjsG4lANB3gyA48GTfg",
    "titulo": "Juegos Geográficos",
    "descripcion": "MarcoPolo es una aplicación web interactiva que ofrece juegos educativos sobre geografía mundial. Inspirada en el famoso explorador Marco Polo, la aplicación permite a los usuarios poner a prueba y mejorar sus conocimientos geográficos a través de dos modalidades de juego diferentes: adivinar países en un mapa interactivo y reconocer banderas de países. Diseñada como una Progressive Web App (PWA), MarcoPolo puede instalarse en dispositivos móviles y funcionar sin conexión a internet.",
    "tecnologias": [
      { "name": "React", "icon": "fa-brands fa-react" },
      { "name": "TypeScript", "icon": "fa-brands fa-js" },
      { "name": "Progresive Web App", "icon": "fa-solid fa-mobile-screen" },
      { "name": "FireStore", "icon": "fa-solid fa-database" },
      { "name": "ServiceWorkers", "icon": "fa-solid fa-gears" }
    ],
    "caracteristicas": [
      "Juego de adivinanza de países en un globo terráqueo 3D",
      "Juego de reconocimiento de banderas nacionales",
      "Sistema de puntuaciones con clasificación",
      "Diseño adaptable a todo tipo de dispositivos",
      "Funcionalidad sin conexión a internet",
      "Instalable como aplicación en dispositivos móviles"
    ],
    "imagen": "proyecto5.png",
    "url": "https://m-polo.web.app/",
    "fecha": "2025-02-26T05:00:00.460Z"
  },
  "oBZWTHk3gazBr6acjjbj": {
    "id": "oBZWTHk3gazBr6acjjbj",
    "titulo": "Sitio Web Empresarial",
    "descripcion": "plataforma dedicada al desarrollo de soluciones digitales personalizadas. El sitio ofrece una variedad de servicios de desarrollo de software, desde páginas web simples hasta soluciones empresariales completas. Los usuarios pueden explorar los servicios ofrecidos, conocer los proyectos realizados y contactar al equipo para solicitar servicios específicos.",
    "tecnologias": [
      { "name": "React", "icon": "fa-brands fa-react" },
      { "name": "Firebase", "icon": "fa-solid fa-fire" },
      { "name": "PropTypes", "icon": "fa-solid fa-code" }
    ],
    "caracteristicas": [
      "Interfaz de usuario intuitiva: Diseño moderno y fácil de navegar.",
      "Integración con Firebase: Gestión de datos en tiempo real y almacenamiento en la nube.",
      "Optimización para móviles: Diseño responsive que se adapta a diferentes dispositivos.",
      "Formulario de contacto: Facilita la comunicación direct",
      "SEO optimizado: Mejora la visibilidad en motores de búsqueda."
    ],
    "imagen": "proyecto4.png",
    "url": "https://forjadecodigo.com/",
    "fecha": "2025-02-24T05:00:00.720Z"
  },
  "LDvyVx88cnzmp1bZgtvO": {
    "id": "LDvyVx88cnzmp1bZgtvO",
    "titulo": "Finanzas Personales",
    "descripcion": "Proyecto web personal creado para gestionar las finanzas personales con datos historicos, graficas y analisis.",
    "tecnologias": [
      { "name": "React", "icon": "fa-brands fa-react" },
      { "name": "Google Auth", "icon": "fa-brands fa-google" },
      { "name": "Firestore", "icon": "fa-solid fa-database" }
    ],
    "caracteristicas": [
      "Diseño Web Responsive",
      "Generacion de Graficos y Reportes",
      "Exportacion de datos a Excel",
      "Categorias creadas Dinamicamente"
    ],
    "imagen": "proyecto1.jpg",
    "url": "https://oz-cuentas.web.app/about",
    "fecha": "2025-02-13T05:00:00.577Z"
  },
  "bwuUZZEcpubwsIYY6N6x": {
    "id": "bwuUZZEcpubwsIYY6N6x",
    "titulo": "Pagina Web Videojuego",
    "descripcion": "Sitio Web construido para un servidor privado de un videojuego integrando la informacion del videojuego con la pagina web.",
    "tecnologias": [
      { "name": "React", "icon": "fa-brands fa-react" },
      { "name": "Firestore", "icon": "fa-solid fa-database" },
      { "name": "FullSearch", "icon": "fa-solid fa-magnifying-glass" },
      { "name": "Paypal", "icon": "fa-brands fa-paypal" }
    ],
    "caracteristicas": [
      "Diseño responsivo y moderno",
      "Sistema de busquedas avanzadas",
      "Integracion con datos reales del videojuego"
    ],
    "imagen": "proyecto2.jpg",
    "url": "https://oz-ragnarok.web.app/",
    "fecha": "2025-01-23T05:00:00.332Z"
  }
}; 