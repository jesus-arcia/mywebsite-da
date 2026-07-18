/* ============================================================ */
/* 🚀 RAVEN INTELLIGENCE COMPANY — SCRIPTS                      */
/* ============================================================ */

// ------------------------------------------------------------------
// CONFIGURACIÓN DE INTEGRACIÓN: Webhook de N8N (Automatización de Leads)
// Instrucciones: Reemplazar la URL abajo por la de tu webhook de producción
// ------------------------------------------------------------------
const WEBHOOK_URL = 'https://alumnotres.app.n8n.cloud/webhook/raven-lead';

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
            
            // --- PROTECCIÓN DE SATURACIÓN (Cooldown) ---
            const lastSubmission = localStorage.getItem('last_lead_submission');
            const now = Date.now();
            if (lastSubmission && (now - lastSubmission < 60000)) {
                alert(`Por favor, espera un momento antes de enviar otra solicitud.`);
                return;
            }

            
            // Cambiar estado del botón
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Enviando...</span>';
            submitBtn.classList.remove('btn-glow');
            submitBtn.disabled = true;

            // Recolectar datos
            const formData = new FormData(leadForm);
            const data = Object.fromEntries(formData.entries());
            data.services = formData.getAll('service');

            // ID único para evitar repeticiones (Idempotencia)
            data.submissionId = 'lead_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            data.timestamp = new Date().toISOString();

            // --- INTEGRACIÓN DIRECTA A WHATSAPP (Trigger para Evolution API) ---
            const numeroDestino = '5491173587842'; 
            
            const serviciosTxt = data.services.length > 0 ? data.services.join(', ') : 'No especificado aún';
            
            // Construimos la estructura precisa que el bot de N8N leerá al recibir el mensaje
            const mensajeWA = `🦅 *NUEVO LEAD - RAVEN INTELLIGENCE COMPANY* 🦅\n\n` +
                              `*Nombre:* ${data.name}\n` +
                              `*Teléfono:* ${data.whatsapp}\n` +
                              `*Email:* ${data.email}\n` +
                              `*Ubicación:* ${data.location}\n` +
                              `*Referencia:* ${data.source}\n\n` +
                              `*Servicios de interés:*\n- ${serviciosTxt.replace(/,/g, '\n- ')}\n\n` +
                              `*Mensaje Adicional:*\n${data.message || 'Sin mensaje'}`;
            
            // --- ENVÍO AL WEBHOOK (n8n) y REDIRECCIÓN ---
            const whatsappUrl = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensajeWA)}`;

            try {
                // Enviamos al webhook
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    keepalive: true, 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                localStorage.setItem('last_lead_submission', Date.now());

                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                
                // Restaurar estado del formulario
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.add('btn-glow');
                leadForm.reset();
                
                // Opcional: Feedback visual al usuario
                successMsg.classList.remove('hidden');
                
                // Ocultar el mensaje después de 10 segundos
                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 10000);
            }, 500);
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
