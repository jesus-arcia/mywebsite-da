/* ============================================================ */
/* 🚀 RAVEN INTELLIGENCE — 3D HOLOGRAPHIC PROTOTYPE SCRIPT      */
/* ============================================================ */

(function() {
    'use strict';

    // --- VERIFICACIÓN DE DEPENDENCIAS ---
    if (typeof THREE === 'undefined') {
        console.error('[RAVEN 3D] Three.js no está cargado. Abortando.');
        return;
    }
    if (typeof gsap === 'undefined') {
        console.error('[RAVEN 3D] GSAP no está cargado. Abortando.');
        return;
    }
    if (typeof ScrollTrigger === 'undefined') {
        console.error('[RAVEN 3D] ScrollTrigger no está cargado. Abortando.');
        return;
    }
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.error('[RAVEN 3D] GLTFLoader no está cargado. Abortando.');
        return;
    }

    console.log('[RAVEN 3D] ✅ Todas las dependencias cargadas correctamente.');
    gsap.registerPlugin(ScrollTrigger);

    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('[RAVEN 3D] No se encontró #canvas-container en el DOM.');
        return;
    }

    // --- 1. ESCENA, CÁMARA Y RENDERER ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    console.log('[RAVEN 3D] ✅ Renderer WebGL creado y añadido al DOM.');

    // --- 2. ILUMINACIÓN (Colores de la marca) ---
    const BRAND_COLOR = 0xC8E600;     // Verde lima oficial
    const HIGHLIGHT_COLOR = 0xE8FF5A; // Verde lima brillante

    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    const dirLight1 = new THREE.DirectionalLight(BRAND_COLOR, 1.8);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(HIGHLIGHT_COLOR, 1.0);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(BRAND_COLOR, 2.5, 12);
    pointLight.position.set(0, 1, 3);
    scene.add(pointLight);

    // --- 3. LENIS (SCROLL SUAVE) ---
    let lenisInstance = null;
    try {
        lenisInstance = new Lenis({
            duration: 1.2,
            easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            orientation: 'vertical',
            smoothWheel: true,
            smoothTouch: false,
        });
        lenisInstance.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function(time) {
            lenisInstance.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        console.log('[RAVEN 3D] ✅ Lenis smooth scroll inicializado.');
    } catch(e) {
        console.warn('[RAVEN 3D] ⚠️ Lenis no disponible, continuando sin smooth scroll:', e.message);
    }

    // --- 4. VARIABLES DE ESTADO ---
    var pivotGroup = new THREE.Group();
    var ravenGroup = new THREE.Group();
    var isModelLoaded = false;
    var mouseX = 0, mouseY = 0;
    var targetRotX = 0.15, targetRotY = -0.5;

    // --- 5. CARGA DEL MODELO 3D ---
    console.log('[RAVEN 3D] 🔄 Iniciando carga de images/raven.glb ...');
    var loader = new THREE.GLTFLoader();

    loader.load(
        'images/raven.glb',
        // --- ON SUCCESS ---
        function(gltf) {
            console.log('[RAVEN 3D] ✅ Modelo raven.glb cargado. Aplicando material holográfico...');
            
            var meshCount = 0;
            gltf.scene.traverse(function(child) {
                if (child.isMesh) {
                    meshCount++;
                    var geo = child.geometry.clone();

                    // Capa 1: Cuerpo sólido traslúcido
                    var solidMat = new THREE.MeshPhongMaterial({
                        color: 0x050505,
                        emissive: BRAND_COLOR,
                        emissiveIntensity: 0.08,
                        transparent: true,
                        opacity: 0.5,
                        shininess: 50,
                        side: THREE.DoubleSide
                    });
                    ravenGroup.add(new THREE.Mesh(geo, solidMat));

                    // Capa 2: Wireframe holográfico
                    var wireMat = new THREE.MeshBasicMaterial({
                        color: BRAND_COLOR,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.4,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    });
                    ravenGroup.add(new THREE.Mesh(geo, wireMat));

                    // Capa 3: Partículas de datos
                    var ptsMat = new THREE.PointsMaterial({
                        color: HIGHLIGHT_COLOR,
                        size: 0.018,
                        sizeAttenuation: true,
                        transparent: true,
                        opacity: 0.9,
                        blending: THREE.AdditiveBlending
                    });
                    ravenGroup.add(new THREE.Points(geo, ptsMat));
                }
            });

            console.log('[RAVEN 3D] Meshes encontrados en el modelo: ' + meshCount);

            if (meshCount === 0) {
                console.error('[RAVEN 3D] ❌ El modelo no contiene ningún mesh visible.');
                return;
            }

            // Normalizar escala del modelo
            var box = new THREE.Box3().setFromObject(ravenGroup);
            var size = box.getSize(new THREE.Vector3());
            var center = box.getCenter(new THREE.Vector3());
            var maxDim = Math.max(size.x, size.y, size.z);

            console.log('[RAVEN 3D] Bounding box: ' + size.x.toFixed(2) + ' x ' + size.y.toFixed(2) + ' x ' + size.z.toFixed(2) + ', maxDim=' + maxDim.toFixed(2));

            if (maxDim > 0) {
                var scale = 2.0 / maxDim;
                ravenGroup.scale.set(scale, scale, scale);
            }

            // Recentrar
            var newBox = new THREE.Box3().setFromObject(ravenGroup);
            var newCenter = newBox.getCenter(new THREE.Vector3());
            ravenGroup.position.sub(newCenter);

            pivotGroup.add(ravenGroup);
            scene.add(pivotGroup);

            setupResponsive();
            isModelLoaded = true;
            initScrollAnimations();

            console.log('[RAVEN 3D] ✅ ¡Cuervo holográfico renderizado exitosamente!');
        },
        // --- ON PROGRESS ---
        function(xhr) {
            if (xhr.total > 0) {
                console.log('[RAVEN 3D] 🔄 Descarga: ' + Math.round(xhr.loaded / xhr.total * 100) + '%');
            }
        },
        // --- ON ERROR ---
        function(error) {
            console.error('[RAVEN 3D] ❌ Error cargando raven.glb:', error);
        }
    );

    // --- 6. POSICIÓN RESPONSIVE ---
    function setupResponsive() {
        if (window.innerWidth > 768) {
            pivotGroup.position.set(1.5, 0, 0);
            pivotGroup.scale.set(1.4, 1.4, 1.4);
        } else {
            pivotGroup.position.set(0, -0.5, 0);
            pivotGroup.scale.set(0.9, 0.9, 0.9);
        }
        pivotGroup.rotation.set(0.15, -0.5, 0);
    }

    // --- 7. INTERACTIVIDAD CON MOUSE ---
    window.addEventListener('mousemove', function(e) {
        if (!isModelLoaded) return;
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        targetRotY = (mouseX * 0.35) - 0.5;
        targetRotX = (mouseY * 0.25) + 0.15;
    });

    // --- 8. ANIMACIONES DE SCROLL ---
    function initScrollAnimations() {
        var isDesktop = window.innerWidth > 768;

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5
            }
        });

        if (isDesktop) {
            tl.to(pivotGroup.position, { x: -1.5, y: 0.3, z: -0.5, duration: 1 }, 0)
              .to(pivotGroup.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 1 }, 0)
              .to(pivotGroup.position, { x: 1.8, y: -0.2, z: -1.2, duration: 1 }, 1)
              .to(pivotGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1 }, 1)
              .to(pivotGroup.position, { x: 0, y: -0.6, z: -1.8, duration: 1 }, 2)
              .to(pivotGroup.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 1 }, 2);
        } else {
            tl.to(pivotGroup.position, { y: -1.5, z: -0.8, duration: 1 }, 0)
              .to(pivotGroup.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 1 }, 0)
              .to(pivotGroup.position, { y: -3.0, z: -1.2, duration: 1 }, 1)
              .to(pivotGroup.position, { y: -5.0, z: -0.5, duration: 1 }, 2);
        }
    }

    // --- 9. LOOP DE ANIMACIÓN ---
    var clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        var elapsed = clock.getElapsedTime();

        if (isModelLoaded) {
            // Flotación suave
            pivotGroup.position.y += Math.sin(elapsed * 1.5) * 0.0008;

            // Rotación del scroll
            var triggers = ScrollTrigger.getAll();
            var scrollRot = (triggers.length > 0) ? triggers[0].progress * Math.PI * 2.0 : 0;

            // Lerp suave
            pivotGroup.rotation.y += (targetRotY + scrollRot - pivotGroup.rotation.y) * 0.04;
            pivotGroup.rotation.x += (targetRotX - pivotGroup.rotation.x) * 0.04;

            // Parpadeo de partículas
            ravenGroup.children.forEach(function(child) {
                if (child.isPoints) {
                    child.material.size = 0.018 + Math.sin(elapsed * 4) * 0.004;
                }
            });
        }

        renderer.render(scene, camera);
    }

    animate();
    console.log('[RAVEN 3D] ✅ Loop de animación iniciado.');

    // --- 10. RESIZE ---
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (isModelLoaded) {
            setupResponsive();
            ScrollTrigger.refresh();
        }
    });

})();
