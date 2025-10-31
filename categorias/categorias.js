
document.addEventListener('DOMContentLoaded', function() {
    
    function embaralharCards() {
        const carousel = document.querySelector('.carousel');
        const cards = Array.from(carousel.querySelectorAll('.category-card'));
        
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    
        while (carousel.firstChild) {
            carousel.removeChild(carousel.firstChild);
        }
        
        cards.forEach(card => {
            carousel.appendChild(card);
        });
    }
    
    // Executar a função quando a página carregar
    embaralharCards();
});