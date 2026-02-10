document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Generar corazones flotantes ---
    const heartsContainer = document.getElementById('hearts-container');
    const colors = ['#ff4d6d', '#ff758f', '#c9184a', '#ffccd5', '#fff0f3'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        // Estilos aleatorios
        const size = Math.random() * 20 + 10;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        heart.style.animationDuration = `${Math.random() * 5 + 5}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        
        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 15000);
    }

    for(let i=0; i<20; i++) createHeart();
    setInterval(createHeart, 400);


    // --- 2. Lógica de los Botones Sí/No ---
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const surpriseMessage = document.getElementById('surpriseMessage');
    const interactiveSection = document.querySelector('.interactive-section');

    // Acción para el botón SÍ
    yesBtn.addEventListener('click', () => {
        // Ocultar botones y mostrar respuesta
        interactiveSection.style.display = 'none';
        surpriseMessage.style.display = 'block';
        surpriseMessage.classList.add('pop-in');
        
        // Disparar confeti
        fireConfetti();
    });

    // Acción para el botón NO (Efecto de huida por toda la pantalla)
    function moveButton() {
        // Si el botón sigue dentro de la tarjeta, lo sacamos al body
        // Esto evita problemas con overflow:hidden o transform en el contenedor padre
        if (noBtn.parentElement !== document.body) {
            const rect = noBtn.getBoundingClientRect();
            
            // Guardamos el ancho/alto original para que no se deforme
            noBtn.style.width = `${rect.width}px`;
            noBtn.style.height = `${rect.height}px`; // Opcional, si tiene altura fija
            
            // Lo movemos al body
            document.body.appendChild(noBtn);
            
            // Posicionamos exactamente donde estaba visualmente
            noBtn.style.position = 'fixed';
            noBtn.style.left = `${rect.left}px`;
            noBtn.style.top = `${rect.top}px`;
            noBtn.style.zIndex = '1000';
        }

        const btnRect = noBtn.getBoundingClientRect();
        
        // Usamos el viewport (toda la pantalla) como límites
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const safeMargin = 20; 
        
        // Límites disponibles (ancho pantalla - ancho botón - margen)
        const maxLeft = windowWidth - btnRect.width - safeMargin;
        const maxTop = windowHeight - btnRect.height - safeMargin;
        
        const minLeft = safeMargin;
        const minTop = safeMargin;

        // Nueva posición aleatoria dentro de la pantalla
        const newLeft = Math.max(minLeft, Math.random() * (maxLeft - minLeft) + minLeft);
        const newTop = Math.max(minTop, Math.random() * (maxTop - minTop) + minTop);

        // Aplicamos la nueva posición (el CSS transition se encargará de suavizarlo)
        // Pequeño timeout para asegurar que el navegador procesó el cambio de padre
        setTimeout(() => {
            noBtn.style.left = `${newLeft}px`;
            noBtn.style.top = `${newTop}px`;
        }, 10);
    }

    // Eliminamos el evento 'mouseover' para que no huya al pasar el cursor
    // noBtn.addEventListener('mouseover', moveButton);
    
    // Eventos para Click/Touch (Solo se mueve cuando intentas pulsarlo)
    noBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        moveButton();
    });
    
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });


    function fireConfetti() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
            }));
        }, 250);
    }


    // --- 3. Música ---
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            bgMusic.play().then(() => {
                musicBtn.textContent = "⏸ Pausar";
                isPlaying = true;
            }).catch(e => {
                alert("No se encontró música. ¡Imagina la canción!");
            });
        } else {
            bgMusic.pause();
            musicBtn.textContent = "🎵 Play Música";
            isPlaying = false;
        }
    });
});
