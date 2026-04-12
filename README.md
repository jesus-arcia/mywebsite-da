# RAVEN INTELLIGENCE — Data Business

Bienvenido al repositorio de la Landing Page oficial de **Raven Intelligence**, una página web modular, moderna y 100% responsiva diseñada para destacar servicios premium de analítica de datos, inteligencia de negocios y automatización con IA.

Este README file está diseñado para ayudarte a editar, mantener y escalar el código del sitio sin necesidad de conocimientos avanzados de programación.

---

## 🏗️ Estructura del Proyecto

```text
raven-intelligence/
├── index.html       # Estructura de la web, secciones y contenido.
├── styles.css       # Estilos visuales, modo oscuro, colores corporativos y animaciones.
├── script.js        # Lógica de interactividad y envío de formularios.
├── README.md        # Documentación de la página web.
└── images/          # Carpeta donde residen todas las imágenes e íconos.
```

---

## ⚙️ Configuración del Webhook para Leads (N8N)

El formulario de captación ("Hablemos de tu Proyecto") está diseñado para enviar los datos directamente a un webhook (n8n, Make, Zapier, etc.).

Para configurar la URL de tu automatización:
1. Abre el archivo `script.js`.
2. En la línea 6, busca la constante `WEBHOOK_URL`.
3. Cambia la URL por la tuya:
   ```javascript
   const WEBHOOK_URL = 'https://hook.n8n.tu-dominio.com/webhook/raven-leads';
   ```

**Fallback Automático:** Si el webhook falla o no está configurado, el sistema automáticamente compila la información y abre el cliente de correo por defecto del usuario a través de `mailto:`, enviando la información a `dataanalystja@gmail.com`.

---

## 🎨 Actualizar Colores e Identidad Visual

Para cambiar la paleta de colores global o aplicar pequeños ajustes en un futuro, no es necesario buscar color por color.
1. Abre `styles.css`.
2. Edita las variables (`--primary-*`) ubicadas en la parte superior del archivo:
   ```css
   :root {
       --primary-500: #C8E600; /* COLOR BASE OFICIAL */
   }
   ```
El resto de degradados (`radial-gradients`, `linear-gradients`), sombras glow pulsantes y animaciones se ajustarán automáticamente base al valor RGB en `--primary-rgb`.

---

## 📝 Guía de Edición (Modularidad)

El archivo `index.html` está perfectamente seccionado con comentarios en mayúsculas que dicen `<!-- SECCIÓN: [NOMBRE] -->`. Busca esas etiquetas para guiarte.

### 1. Actualizar Datos de Contacto Directo

Para cambiar tu número de **WhatsApp** o **Email**, busca en `index.html` el comentario `<!-- SECCIÓN: FORMULARIO DE CAPTACIÓN Y CONTACTO DIRECTO -->`.

Encontrarás tarjetas con estructura:
```html
<p class="contact-card-detail">+54 9 11 7358 7842</p>
<a href="https://wa.me/5491173587842?...">Abrir WhatsApp</a>
```
Sustituye el texto visual y la URL. El formato correcto para WhatsApp es `https://wa.me/CODIGONUMERO` sin el signo `+`. Lo mismo aplica para el **hero** superior y el **footer**.

### 2. Agregar un Nuevo Proyecto Destacado

Para agregar un nuevo caso de éxito o proyecto, dirígete a `<!-- SECCIÓN: PROYECTOS DESTACADOS -->`. Copia bloque `<!-- Proyecto (Placeholder) -->` y editalo como se describe a continuación:

```html
<div class="project-card">
   <!-- Cambia la imagen -->
   <img src="images/mi-nuevo-proyecto.png" alt="Título"> 
   <!-- Cambia los Tags -->
   <span class="tag">SQL</span>
   <!-- Título y Descripción -->
   <h3 class="project-title">Nuevo Título</h3>
   <!-- Métrica destacable -->
   <div class="project-result text-gradient">Métrica clave</div>
</div>
```

### 3. Modificar un Servicio (Flip Cards 3D)

Busca en `index.html` el bloque `<!-- SECCIÓN: SERVICIOS -->`. Cada tarjeta consta de dos caras: una frontal y una trasera.
```html
<!-- Cara frontal -->
<div class="service-card-front">
   <h3 class="card-title">Título Frontal</h3>
</div>
<!-- Cara Trasera -->
<div class="service-card-back">
   <h3 class="card-title-back">Título Interno</h3>
   <p class="card-desc">Descripción larga del servicio.</p>
</div>
```

### 4. Actualizar tu Fotografía y Bio

Busca `<!-- SECCIÓN: SOBRE MÍ -->` de `index.html`.
- Para cambiar la imagen debes asegurar que tu fondo sea transparente para que luzca con el Glow o sea un fondo sólido que contraste bien, y cambia el archivo en `images/jesus_arcia.jpg`.
- Para los párrafos edita el texto dentro de los `<p>` bajo la clase `.about-bio`.

---

## 📱 Animaciones Interactivas

El proyecto integra CSS moderno, no hay dependencias de terceros o librerías pesadas:
- Las **tarjetas Flip 3D** rotan al hacer **Hover** en computadoras de escritorio. En móviles rotan al **Tocar** (Tap) manejado nativamente con JavaScript para mejor responsiva.
- Los botones primarios usan la clase CSS `.btn-glow` manejada enteramente por un Keyframe altamente optimizado en CSS puro.
