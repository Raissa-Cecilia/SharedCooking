let currentPage = 0;
        const totalPages = 3;

        function moveCarousel(direction) {
            currentPage += direction;
            
            if (currentPage < 0) currentPage = totalPages - 1;
            if (currentPage >= totalPages) currentPage = 0;
            
            updateDots();
        }

        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentPage);
            });
        }

        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentPage = index;
                updateDots();
            });
        });