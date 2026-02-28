document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    lucide.createIcons();

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 4. Reveal Elements on Scroll
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger initially

    // 5. Copy Pix Key
    const btnCopyPix = document.getElementById('btnCopyPix');
    const pixKey = document.getElementById('pixKey').innerText;

    btnCopyPix.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(pixKey);

            // Visual feedback
            const btnText = btnCopyPix.querySelector('.btn-text');
            const icon = btnCopyPix.querySelector('i');
            const originalText = btnText.innerText;

            btnCopyPix.classList.add('success');
            btnText.innerText = 'Copiado!';
            icon.setAttribute('data-lucide', 'check');
            lucide.createIcons(); // re-init to update the icon

            setTimeout(() => {
                btnCopyPix.classList.remove('success');
                btnText.innerText = originalText;
                icon.setAttribute('data-lucide', 'copy');
                lucide.createIcons();
            }, 3000);
        } catch (err) {
            // Silently ignore
        }
    });

    // =========================================
    // 6. COUNTDOWN TIMER
    // =========================================
    const countdownDate = new Date('May 30, 2026 00:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<h3 style="font-family: var(--font-heading); font-size: 2rem; color: var(--color-gold);">Chegou o grande dia!</h3>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    };

    // Update the count down every 1 second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // =========================================
    // 7. RSVP FORM TO GOOGLE SHEETS
    // =========================================

    // ⚠️ REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL ⚠️
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbynSlJjm8xbagT813Vjwf0KenLQbL-AB8Tg2XHxwUscf9asK4uoaLWM3XdYobZW8DcB/exec';

    const rsvpForm = document.getElementById('rsvpForm');
    const formSuccess = document.getElementById('formSuccess');
    const btnSubmitForm = document.getElementById('btnSubmitForm');

    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button & show loading state
        const originalBtnContent = btnSubmitForm.innerHTML;
        btnSubmitForm.disabled = true;
        btnSubmitForm.innerHTML = 'Enviando...';
        formSuccess.classList.add('hidden'); // Hide any previous messages
        formSuccess.style.color = '#2E7D32';
        formSuccess.style.backgroundColor = '#E8F5E9';

        // Collect form data
        const formData = new FormData(rsvpForm);
        const data = {
            nome: formData.get('nome'),
            convidados: formData.get('convidados'),
            nome_acompanhantes: formData.get('nome_acompanhantes'),
            criancas_0_7: formData.get('criancas_0_7'),
            criancas_8_12: formData.get('criancas_8_12'),
            restricoes_alimentares: formData.get('restricoes_alimentares'),
            presenca: formData.get('presenca')
        };

        try {
            // Send to Google Sheets
            // Using no-cors mode because Google Apps Script always returns a redirect which violates normal CORS
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(data)
            });

            // With no-cors, the response is opaque (response.ok is always false).
            // So if it didn't throw a network error, we assume it was sent!
            formSuccess.innerText = 'Sua resposta foi enviada com sucesso! Muito obrigado.';
            formSuccess.classList.remove('hidden');
            rsvpForm.reset();

        } catch (error) {
            console.error('Error:', error);
            // Error Message Styling
            formSuccess.innerText = 'Ocorreu um erro ao enviar. Por favor, tente novamente mais tarde.';
            formSuccess.style.color = '#D32F2F';
            formSuccess.style.backgroundColor = '#FFEBEE';
            formSuccess.classList.remove('hidden');
        } finally {
            // Restore button state
            btnSubmitForm.disabled = false;
            btnSubmitForm.innerHTML = originalBtnContent;
        }
    });
});
