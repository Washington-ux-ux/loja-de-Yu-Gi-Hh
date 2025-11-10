document.addEventListener('DOMContentLoaded', function() {
    const carrossel = document.querySelector('.carrossel');
    const inner = document.querySelector('.carrossel-inner');
    const items = document.querySelectorAll('.carrossel-item');
    const prevBtn = document.querySelector('.carrossel-btn.prev');
    const nextBtn = document.querySelector('.carrossel-btn.next');
    const indicatorsContainer = document.querySelector('.carrossel-indicators');
    let currentIndex = 0;
    let intervalId;

    // Criar indicadores
    items.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.indicator');

    // Função para atualizar o carrossel
    function updateCarrossel() {
        // Atualiza a posição do carrossel
        inner.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Atualiza os indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Função para ir para o próximo slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarrossel();
    }

    // Função para ir para o slide anterior
    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarrossel();
    }

    // Função para ir para um slide específico
    function goToSlide(index) {
        currentIndex = index;
        updateCarrossel();
    }

    // Event listeners para os botões de navegação
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        }
    });

    // Toque para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;

    carrossel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carrossel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetInterval();
        }
    }

    // Função para avançar automaticamente
    function startAutoPlay() {
        return setInterval(nextSlide, 7000); // Avança a cada 7 segundos
    }

    // Iniciar o carrossel e o auto-play
    updateCarrossel();
    let autoPlayInterval = startAutoPlay();

    // Pausar auto-play quando o mouse estiver sobre o carrossel
    carrossel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    // Retomar auto-play quando o mouse sair do carrossel
    carrossel.addEventListener('mouseleave', () => {
        autoPlayInterval = startAutoPlay();
    });
});