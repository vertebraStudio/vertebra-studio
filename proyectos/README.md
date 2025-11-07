# Páginas de Proyectos - Vertebra Studio

## Estructura de archivos

```
proyectos/
├── ansiada-calma.html      # Página del proyecto Ansiada Calma
├── project-styles.css      # Estilos específicos para páginas de proyectos
└── README.md              # Este archivo
```

## Estructura de página de proyecto

Cada página de proyecto sigue esta estructura:

### 1. Hero Section
- Breadcrumb de navegación
- Título del proyecto
- Subtítulo y descripción
- Metadatos del proyecto (cliente, año, servicios, duración)

### 2. Project Overview
- El desafío
- Objetivos del proyecto
- Imagen/mockup del proyecto

### 3. Process Section
- Timeline del proceso de trabajo
- 4 pasos principales del proceso

### 4. Key Features
- Características clave del proyecto
- Grid de 4 características con iconos

### 5. Results Section
- Métricas y resultados obtenidos
- Grid de 4 métricas principales

### 6. Gallery Section
- Galería de imágenes del proyecto
- Grid responsivo con diferentes tamaños

### 7. Next Project
- Enlace al siguiente proyecto
- Card con información del siguiente proyecto

## Cómo crear una nueva página de proyecto

1. **Copiar la plantilla**: Copia `ansiada-calma.html` y renómbrala
2. **Actualizar metadatos**: Cambia título, descripción, keywords, etc.
3. **Personalizar contenido**: Actualiza toda la información específica del proyecto
4. **Actualizar enlaces**: Cambia los enlaces de navegación y "siguiente proyecto"
5. **Actualizar página principal**: Modifica el enlace en `index.html`

## Estilos

Los estilos están en `project-styles.css` y son reutilizables para todos los proyectos. Incluyen:

- Diseño responsivo completo
- Tema oscuro/claro consistente
- Animaciones y transiciones
- Grid layouts adaptativos
- Componentes reutilizables

## Responsive Design

- **Desktop**: Layout de 2 columnas en hero y overview
- **Tablet**: Layout de 1 columna con ajustes de espaciado
- **Mobile**: Layout optimizado para pantallas pequeñas

## Navegación

- Breadcrumb para volver a trabajos
- Navegación principal con enlaces a secciones del sitio principal
- Enlace al siguiente proyecto
- Footer consistente con el sitio principal
