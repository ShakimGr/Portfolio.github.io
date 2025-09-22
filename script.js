// Script JavaScript complet pour navbar active et carousel
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script navbar et carousel chargé');
    
    // ===== GESTION NAVBAR =====
    const navLinks = document.querySelectorAll('.nav-menu a');
    console.log('Liens trouvés:', navLinks.length);
    
    // Fonction pour activer un lien
    function setActiveLink(activeLink) {
        // Supprime la classe active de tous les liens
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Ajoute la classe active au lien spécifié
        if (activeLink) {
            activeLink.classList.add('active');
            console.log('Lien activé:', activeLink.textContent.trim());
        }
    }
    
    // Ajoute les événements de clic
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Empêche le comportement par défaut
            
            console.log('Clic sur:', this.textContent.trim());
            setActiveLink(this);
            
            // Gestion du scroll vers la section
            const href = this.getAttribute('href');
            let targetId = href.substring(1);
            
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calcule la position en tenant compte de la navbar fixe
                const navbarHeight = 100; // Ajustez selon votre navbar
                const elementPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
                
                console.log('Scroll vers:', targetId);
            } else {
                console.warn('Section non trouvée:', targetId);
            }
        });
    });
    
    // Fonction pour mettre à jour le lien actif selon la position de scroll
    function updateActiveOnScroll() {
        const sections = document.querySelectorAll('.content-section');
        const scrollPos = window.scrollY + 150; // Offset pour la détection
        
        let currentSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = window.scrollY + rect.top;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section.id;
            }
        });
        
        if (currentSection) {
            const correspondingLink = document.querySelector(`.nav-menu a[href="#${currentSection}"]`);
            
            if (correspondingLink && !correspondingLink.classList.contains('active')) {
                setActiveLink(correspondingLink);
            }
        }
    }
    
    // Écouteur de scroll avec throttling pour les performances
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveOnScroll, 50);
    });
    
    // Initialise le lien actif au chargement
    updateActiveOnScroll();

    // ===== GESTION CAROUSEL CERTIFICATIONS =====
    const carousel = {
        slides: document.getElementById('certSlides'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        indicators: document.getElementById('indicators'),
        currentIndex: 0,
        totalSlides: 5,
        autoPlayInterval: null,

        init() {
            console.log('Initialisation du carousel');
            
            // Vérifier que les éléments existent
            if (!this.slides || !this.indicators) {
                console.error('Éléments du carousel non trouvés');
                return;
            }

            this.createIndicators();
            this.updateCarousel();
            this.bindEvents();
            this.startAutoPlay();
        },

        createIndicators() {
            // Nettoyer les indicateurs existants
            this.indicators.innerHTML = '';
            
            for (let i = 0; i < this.totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                if (i === 0) indicator.classList.add('active');
                
                indicator.addEventListener('click', () => {
                    this.goToSlide(i);
                    this.restartAutoPlay();
                });
                
                this.indicators.appendChild(indicator);
            }
            console.log('Indicateurs créés:', this.totalSlides);
        },

        updateCarousel() {
            if (!this.slides) return;
            
            const translateX = -this.currentIndex * 20; // 20% par slide (100% / 5 slides = 20%)
            this.slides.style.transform = `translateX(${translateX}%)`;
            
            // Mise à jour des indicateurs
            const indicators = this.indicators.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentIndex);
            });
            
            console.log(`Slide actuel: ${this.currentIndex}, Transform: ${translateX}%`);
        },

        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            this.updateCarousel();
            console.log('Slide suivant:', this.currentIndex);
        },

        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.updateCarousel();
            console.log('Slide précédent:', this.currentIndex);
        },

        goToSlide(index) {
            if (index >= 0 && index < this.totalSlides) {
                this.currentIndex = index;
                this.updateCarousel();
                console.log('Aller au slide:', index);
            }
        },

        bindEvents() {
            // Boutons de navigation
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.nextSlide();
                    this.restartAutoPlay();
                });
                console.log('Event listener ajouté au bouton suivant');
            }
            
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.prevSlide();
                    this.restartAutoPlay();
                });
                console.log('Event listener ajouté au bouton précédent');
            }

            // Support tactile pour mobile
            let startX = 0;
            let endX = 0;

            this.slides.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            this.slides.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe();
            });

            // Support du clavier
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                    this.restartAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    this.restartAutoPlay();
                }
            });
        },

        handleSwipe() {
            const threshold = 50; // Seuil minimum pour détecter un swipe
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide(); // Swipe vers la gauche = slide suivant
                } else {
                    this.prevSlide(); // Swipe vers la droite = slide précédent
                }
                this.restartAutoPlay();
            }
        },

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000); // Change toutes les 5 secondes
            console.log('AutoPlay démarré');
        },

        stopAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
                console.log('AutoPlay arrêté');
            }
        },

        restartAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    };

    // Initialiser le carousel
    carousel.init();

    // Arrêter l'autoplay quand l'utilisateur quitte la page/onglet
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            carousel.stopAutoPlay();
        } else {
            carousel.restartAutoPlay();
        }
    });

    // Pause l'autoplay quand on survole le carousel
    const carouselElement = document.querySelector('.cert-carousel');
    if (carouselElement) {
        carouselElement.addEventListener('mouseenter', () => {
            carousel.stopAutoPlay();
        });

        carouselElement.addEventListener('mouseleave', () => {
            carousel.startAutoPlay();
        });
    }

    console.log('Script complètement chargé et initialisé');
});