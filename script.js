/* ============================================================ */
/* 🚀 RAVEN INTELLIGENCE — SCRIPTS                             */
/* ============================================================ */

// ------------------------------------------------------------------
// CONFIGURACIÓN DE INTEGRACIÓN: Webhook de N8N (Automatización de Leads)
// Instrucciones: Reemplazar la URL abajo por la de tu webhook de producción
// ------------------------------------------------------------------
const WEBHOOK_URL = 'https://hook.n8n.tu-dominio.com/webhook/raven-leads';

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. NAVBAR SCROLL EFFECT --- */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 2. MOBILE MENU TOGGLE --- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger animation depending on state
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'translateY(7px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    /* --- 3. MOBILE FLIP CARDS 3D TAP --- */
    // En mobile, el hover de CSS no funciona bien. Activamos el flip mediante tap ("click").
    const flipCards = document.querySelectorAll('.service-card-flip');
    
    // Solo aplicamos a dispositivos móviles/táctiles detectando ancho de pantalla o evento touch
    if (window.innerWidth <= 767 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0) {
        flipCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remover clase de las demás para que solo una esté volteada a la vez (opcional)
                flipCards.forEach(c => {
                    if (c !== this) c.classList.remove('is-flipped');
                });
                
                // Toggle en la tarjeta actual
                this.classList.toggle('is-flipped');
            });
        });
    }

    /* --- 4. FORMULARIO DE CAPTACIÓN (LEAD FORM) --- */
    const leadForm = document.getElementById('lead-form');
    const successMsg = document.getElementById('form-success-msg');
    const submitBtn = document.getElementById('submit-btn');

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Cambiar estado del botón
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Enviando...</span>';
            submitBtn.classList.remove('btn-glow');
            submitBtn.disabled = true;

            // Recolectar datos
            const formData = new FormData(leadForm);
            const data = Object.fromEntries(formData.entries());
            
            // Recolectar checkboxes múltiples (servicios)
            data.services = formData.getAll('service');

            // --- INTEGRACION CON N8N WEBHOOK (Fase de Pruebas) ---
            try {
                // Hacemos el envío de los datos en formato JSON a tu cuenta de N8N
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Fallo en la recepción del Webhook N8N');
                }

                // Éxito con Webhook: Mostrar el check
                mostrarExito();

            } catch (error) {
                console.warn('Webhook apagado o expirado. Usando WhatsApp como Fallback.', error);
                
                // FALLBACK DE SEGURIDAD: Si la PC está apagada o expiró N8N,
                // no perdemos el cliente. Lo mandamos directo por WhatsApp de igual manera.
                const numeroDestino = '5491173587842'; 
                const serviciosTxt = data.services.length > 0 ? data.services.join(', ') : 'No especificado aún';
                
                const mensajeWA = `🦅 *NUEVO LEAD (Respaldo) - RAVEN* 🦅\n\n` +
                                  `*Nombre:* ${data.name}\n` +
                                  `*Teléfono:* ${data.whatsapp}\n` +
                                  `*Email:* ${data.email}\n` +
                                  `*Servicios:* ${serviciosTxt}\n` +
                                  `*Mensaje:* ${data.message || 'Sin mensaje'}`;
                
                const urlWhatsApp = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensajeWA)}`;
                window.open(urlWhatsApp, '_blank');
                
                mostrarExito();
            }

            function mostrarExito() {
                // Restaurar botón y ocultar form visualmente o solo mostrar el mensaje
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.add('btn-glow');
                
                leadForm.reset();
                successMsg.classList.remove('hidden');
                
                // Ocultar el mensaje después de 10 segundos
                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 10000);
            }
        });
    }

    /* --- 5. PROJECT GALLERY THUMBS --- */
    const thumbs = document.querySelectorAll('.project-gallery-thumbs img');
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const gallery = this.closest('.project-gallery');
            const mainImg = gallery.querySelector('.project-img');
            
            // Swap sources
            const tempSrc = mainImg.src;
            mainImg.src = this.src;
            this.src = tempSrc;
        });
    });

});
