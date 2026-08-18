import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }

    // --- Hero Carousel ---
    const imagensDaPasta = [
        "hero-4.webp",
    ];

    const carouselContainer = document.getElementById('heroCarousel');
    let timer = null;

    if (carouselContainer && imagensDaPasta.length > 0) {
        imagensDaPasta.forEach((imgNome, index) => {
            const slide = document.createElement('div');
            slide.classList.add('hero-slide');
            slide.style.backgroundImage = `url('/imagens/${imgNome}')`;

            if (index === 0) {
                slide.classList.add('active');
            }
            carouselContainer.appendChild(slide);
        });

        const slides = carouselContainer.querySelectorAll('.hero-slide');
        let currentSlide = 0;

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        function startCarousel() {
            if (slides.length > 1 && !timer) {
                timer = setInterval(nextSlide, 5000);
            }
        }

        function stopCarousel() {
            clearInterval(timer);
            timer = null;
        }

        startCarousel();

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopCarousel);
            heroSection.addEventListener('mouseleave', startCarousel);
        }
    }

    // --- Conversion Tracking ---
    const trackConversion = (conversionType, details) => {
        if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
                'send_to': 'GA_MEASUREMENT_ID/conversion_event',
                'event_category': 'Engagement',
                'event_label': conversionType,
                'value': 1
            });
        }
        console.log(`Conversão Registrada [${conversionType}]:`, details);
    };

    document.querySelectorAll('.whatsapp-track-btn, .float-whatsapp').forEach(btn => {
        btn.addEventListener('click', () => {
            trackConversion('WhatsApp_Click', btn.getAttribute('href'));
        });
    });

    // --- Contact Form: persist lead to Supabase, then open WhatsApp ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            trackConversion('Form_Submit', { name, email, phone });

            const { error } = await supabase
                .from('contact_leads')
                .insert({ name, email, phone, message, source: 'website' });

            if (error) {
                console.error('Erro ao salvar lead:', error.message);
            }

            const whatsappNumber = "5541998501417";
            const text = `Olá! Gostaria de um orçamento.\n\n*Nome:* ${name}\n*E-mail:* ${email}\n*Telefone:* ${phone}\n*Mensagem:* ${message}`;
            const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

            window.open(url, '_blank', 'noopener,noreferrer');
        });
    }

    // --- Mobile Menu ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });

        mobileMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navMenu.classList.toggle('active');
                mobileMenu.classList.toggle('open');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }
});
