# MovieZephy - Aplicación de Películas


![Captura de pantalla 2025-04-12 222832](https://github.com/user-attachments/assets/36b7f60b-9e64-4f04-b834-071963a58b00)

## 📋 Descripción
MovieZephy es una aplicación web moderna que consume la API de The Movie Database (TMDB) para mostrar información detallada de películas. La aplicación está diseñada con un estilo similar a Netflix, ofreciendo una experiencia de usuario intuitiva y atractiva.

## ✨ Características Principales
- **Carousel Hero**: Muestra las películas más populares en un carrusel interactivo
- **Categorías de Películas**: Organización por tendencias, populares, mejor valoradas, próximos estrenos y actualmente en cartelera
- **Búsqueda de Películas**: Funcionalidad de búsqueda integrada
- **Detalles de Películas**: Modal interactivo con información detallada de cada película
- **Reproducción de Trailers**: Capacidad para ver trailers de las películas
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla

## 🛠️ Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: The Movie Database (TMDB) API v3
- **Iconos**: Font Awesome 6.4.0
- **Estilos**: CSS personalizado con variables CSS

## 📁 Estructura del Proyecto
```
├── index.html          # Estructura principal de la aplicación
├── styles.css          # Estilos y diseño de la interfaz
└── script.js           # Lógica de la aplicación y consumo de API
```

## 🎯 Funcionalidades Detalladas

### 5.1 Consumo de API
La aplicación utiliza la API de TMDB con las siguientes configuraciones:
```javascript
const API_KEY = "b4476758d9653857aee9660affefd75f"
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original"
```

### 5.2 Características Principales
1. **Carrusel Hero**
   - Muestra las 5 películas más populares
   - Navegación automática y manual
   - Información básica de cada película
   - Botones de acción rápida

2. **Categorías de Películas**
   - Trending (Tendencias)
   - Popular
   - Top Rated (Mejor Valoradas)
   - Upcoming (Próximos Estrenos)
   - Now Playing (En Cartelera)

3. **Búsqueda**
   - Barra de búsqueda interactiva
   - Resultados en tiempo real
   - Filtrado por título

4. **Modal de Detalles**
   - Información completa de la película
   - Géneros
   - Elenco
   - Calificación
   - Año de lanzamiento
   - Duración
   - Sinopsis

## 🎨 Interfaz de Usuario
La interfaz está diseñada con un enfoque moderno y minimalista:
- **Sidebar**: Logo y navegación vertical
- **Header**: Búsqueda y logo móvil
- **Contenido Principal**: Carrusel y categorías
- **Modales**: Detalles de películas y reproductor de video

## 🎨 Estilos y Diseño
- **Paleta de Colores**:
  - Color primario: #e50914 (rojo Netflix)
  - Fondo oscuro: #141414
  - Texto claro: #ffffff
  - Texto secundario: #b3b3b3

- **Efectos Visuales**:
  - Transiciones suaves
  - Hover effects
  - Animaciones de carga
  - Cursor personalizado

## 📱 Responsive Design
La aplicación se adapta a diferentes dispositivos:
- Desktop: Diseño completo con sidebar
- Tablet: Ajustes de tamaño y espaciado
- Mobile: Optimización para pantallas pequeñas

## 🔒 Seguridad
- Uso de API key y token de acceso
- Manejo seguro de datos de la API
- Validación de inputs

## 🚀 Mejoras Futuras
1. Implementación de autenticación de usuarios
2. Sistema de favoritos
3. Recomendaciones personalizadas
4. Filtros avanzados
5. Soporte para series de TV

## 📝 Conclusión
MovieZephy es una aplicación web moderna y funcional que demuestra el consumo efectivo de la API de TMDB. Su diseño intuitivo y características completas la hacen una excelente plataforma para explorar y descubrir películas.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Contribuciones
Las contribuciones son bienvenidas. Por favor, lee las guías de contribución antes de enviar un pull request.

## 📧 Contacto
Para cualquier consulta o sugerencia, por favor contacta al equipo de desarrollo. 
