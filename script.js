// ==========================================
// SCRIPT GENERAL DE LA INVITACIÓN DE BODA
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    // 1. ACTIVAR INVITACIÓN (ABRIR EL SOBRE / REPRODUCIR MÚSICA)
    window.activarInvitacion = function() {
        const video = document.getElementById('videoSobre');
        const contenedorPrincipal = document.getElementById('contenedor-principal');
        const seccionFinal = document.getElementById('seccion-final');
        const musica = document.getElementById('musicaInvitacion');
        const musicBtn = document.getElementById('music-toggle');

        if (video) {
            video.play().catch(e => console.log("Error al reproducir video:", e));
            
            video.onended = function() {
                transicionarAInvitacion();
            };

            setTimeout(() => {
                transicionarAInvitacion();
            }, 2500);
        } else {
            transicionarAInvitacion();
        }

        function transicionarAInvitacion() {
            if (contenedorPrincipal) {
                contenedorPrincipal.style.opacity = '0';
                contenedorPrincipal.style.transition = 'opacity 0.6s ease';
                setTimeout(() => {
                    contenedorPrincipal.style.display = 'none';
                    if (seccionFinal) seccionFinal.classList.remove('oculto');
                    if (musicBtn) musicBtn.style.display = 'flex';
                    
                    if (musica) {
                        musica.play().catch(err => console.log("Audio bloqueado por navegador:", err));
                    }
                    
                    verificarScroll();
                }, 600);
            }
        }
    };


    // 2. CONTROL DE MÚSICA (BOTÓN FLOTANTE)
    window.toggleMusic = function() {
        const musica = document.getElementById('musicaInvitacion');
        const musicBtn = document.getElementById('music-toggle');
        
        if (!musica) return;

        if (musica.paused) {
            musica.play();
            if (musicBtn) musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
        } else {
            musica.pause();
            if (musicBtn) musicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    };


    // 3. SAVE THE DATE: EXPLOSIÓN DE PÉTALOS Y REVELACIÓN AL TOCAR
    const circles = document.querySelectorAll('.circle-scratch-card');
    let revealedCount = 0;
    const totalCircles = circles.length;

    function lanzarPetalosDesdeElemento(elemento) {
        const rect = elemento.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;

        const canvas = document.getElementById('petalsCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let petalosLocales = [];
        for (let i = 0; i < 25; i++) {
            petalosLocales.push({
                x: originX,
                y: originY,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.7) * 8 - 2,
                radius: Math.random() * 5 + 3,
                alpha: 1,
                rot: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 4
            });
        }

        function animarExplosion() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activos = false;

            petalosLocales.forEach(p => {
                if (p.alpha > 0) {
                    activos = true;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.15;
                    p.alpha -= 0.02;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rot * Math.PI) / 180);
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(p.alpha, 0)})`;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, p.radius, p.radius * 0.6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });

            if (activos) {
                requestAnimationFrame(animarExplosion);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        animarExplosion();
    }

    circles.forEach(circle => {
        circle.addEventListener('click', function() {
            if (circle.classList.contains('revealed')) return;

            circle.classList.add('revealed');
            lanzarPetalosDesdeElemento(circle);

            circle.style.transform = 'scale(1.12)';
            setTimeout(() => {
                circle.style.transform = 'scale(1)';
            }, 200);

            const spanNumero = circle.querySelector('.circle-number');
            const spanLabel = circle.querySelector('.circle-label');
            const labelReal = circle.getAttribute('data-label');

            if (spanNumero) spanNumero.classList.remove('hidden-number');
            if (spanLabel) spanLabel.innerText = labelReal;

            revealedCount++;

            if (revealedCount === totalCircles) {
                const countdownCard = document.getElementById('countdownCard');
                if (countdownCard) {
                    countdownCard.classList.add('revealed-done');
                }
            }
        });
    });


    // 4. CUENTA REGRESIVA (12 DE DICIEMBRE DE 2026 A LAS 19:30)
    const fechaBoda = new Date('2026-12-12T19:30:00').getTime();

    function actualizarContador() {
        const ahora = new Date().getTime();
        const diferencia = fechaBoda - ahora;

        if (diferencia > 0) {
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

            const dEl = document.getElementById('cd-days');
            const hEl = document.getElementById('cd-hours');
            const mEl = document.getElementById('cd-mins');
            const sEl = document.getElementById('cd-secs');

            if (dEl) dEl.innerText = String(dias).padStart(2, '0');
            if (hEl) hEl.innerText = String(horas).padStart(2, '0');
            if (mEl) mEl.innerText = String(minutos).padStart(2, '0');
            if (sEl) sEl.innerText = String(segundos).padStart(2, '0');
        }
    }
    setInterval(actualizarContador, 1000);
    actualizarContador();


    // 5. FAQ INTERACTIVO (ACORDEÓN)
    window.toggleFaq = function(elemento) {
        const items = document.querySelectorAll('.faq-item');
        items.forEach(item => {
            if (item !== elemento) {
                item.classList.remove('active-faq');
            }
        });
        elemento.classList.toggle('active-faq');
    };


    // 6. MODAL Y COPIA DE DATOS BANCARIOS
    window.toggleGiftModal = function() {
        const modal = document.getElementById('gift-modal');
        if (modal) {
            modal.classList.toggle('hidden-element');
        }
    };

    window.mostrarToast = function(mensaje) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = mensaje;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    };

    window.copyAliasVioleta = function() {
        const textoCopiar = "Violeta Cavallaro - Banco Itaú - Cta: 4.606.895";
        navigator.clipboard.writeText(textoCopiar).then(() => {
            mostrarToast("¡Cuenta de Violeta copiada! 📋✨");
        }).catch(err => {
            console.error("Error al copiar: ", err);
        });
    };

    window.copyAliasRaul = function() {
        const textoCopiar = "Raúl Molinas - Banco Continental - Cta: 4.957.485";
        navigator.clipboard.writeText(textoCopiar).then(() => {
            mostrarToast("¡Cuenta de Raúl copiada! 📋✨");
        }).catch(err => {
            console.error("Error al copiar: ", err);
        });
    };


    // 7. ANIMACIONES AL HACER SCROLL (REVEAL)
    function verificarScroll() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', verificarScroll);
    verificarScroll();
});