// landingpage.js - Funcionalidades para a página principal

// Sistema de navegação suave
document.addEventListener('DOMContentLoaded', function() {
    // Navegação suave para âncoras
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação de scroll para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animação aos elementos das seções
    const animatedElements = document.querySelectorAll('.secao-hero, .secao, .secao-cta, .cartao-caracteristica, .item-estatistica');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Contador animado para estatísticas
    const estatisticas = document.querySelectorAll('.numero-estatistica');
    
    estatisticas.forEach(estatistica => {
        const target = parseInt(estatistica.textContent);
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                estatistica.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                estatistica.textContent = formatNumber(Math.floor(current));
            }
        }, stepTime);
    });

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(0) + 'M';
        }
        return num + '%';
    }

    // Sistema de newsletter simples
    const newsletterForm = document.createElement('div');
    newsletterForm.innerHTML = `
        <div class="mt-4">
            <h4 class="mb-3">Receba novidades por email</h4>
            <div class="d-flex gap-2 justify-content-center flex-wrap">
                <input type="email" id="newsletterEmail" class="form-control" placeholder="Seu melhor email" style="max-width: 300px;">
                <button class="btn botao-personalizado" onclick="inscreverNewsletter()">Inscrever</button>
            </div>
            <p id="newsletterFeedback" class="mt-2 small"></p>
        </div>
    `;
    
    document.querySelector('#contato .text-center').appendChild(newsletterForm);

    // Contador de visitas
    let visitas = localStorage.getItem('sharedCookingVisitas') || 0;
    visitas = parseInt(visitas) + 1;
    localStorage.setItem('sharedCookingVisitas', visitas);
    
    console.log(`Visitas à página: ${visitas}`);
});

// Função para inscrição na newsletter
function inscreverNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const feedback = document.getElementById('newsletterFeedback');
    const email = emailInput.value.trim();
    
    if (!email) {
        feedback.textContent = 'Por favor, digite um email válido.';
        feedback.style.color = '#ff6b6b';
        return;
    }
    
    if (!validarEmail(email)) {
        feedback.textContent = 'Email inválido. Tente novamente.';
        feedback.style.color = '#ff6b6b';
        return;
    }
    
    // Simular salvamento no localStorage
    let inscritos = JSON.parse(localStorage.getItem('newsletterInscritos') || '[]');
    
    if (!inscritos.includes(email)) {
        inscritos.push(email);
        localStorage.setItem('newsletterInscritos', JSON.stringify(inscritos));
        
        feedback.textContent = 'Inscrição realizada com sucesso! Obrigado.';
        feedback.style.color = '#51cf66';
        emailInput.value = '';
    } else {
        feedback.textContent = 'Este email já está inscrito.';
        feedback.style.color = '#ffa94d';
    }
    
    setTimeout(() => {
        feedback.textContent = '';
    }, 5000);
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Sistema de avaliação interativa (simulação)
function avaliarPlataforma(estrelas) {
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoesPlataforma') || '[]');
    avaliacoes.push({
        estrelas: estrelas,
        data: new Date().toISOString()
    });
    
    localStorage.setItem('avaliacoesPlataforma', JSON.stringify(avaliacoes));
    
    // Calcular média
    const media = avaliacoes.reduce((acc, curr) => acc + curr.estrelas, 0) / avaliacoes.length;
    
    alert(`Obrigado pela sua avaliação de ${estrelas} estrela(s)! Média atual: ${media.toFixed(1)} estrelas`);
}

// Adicionar botões de avaliação
document.addEventListener('DOMContentLoaded', function() {
    const avaliacaoSection = document.createElement('div');
    avaliacaoSection.className = 'text-center mt-5';
    avaliacaoSection.innerHTML = `
        <h4 class="mb-3">Avalie nossa proposta</h4>
        <div class="d-flex justify-content-center gap-2">
            ${[1, 2, 3, 4, 5].map(estrela => `
                <button class="btn btn-outline-warning" onclick="avaliarPlataforma(${estrela})">
                    ${estrela} ⭐
                </button>
            `).join('')}
        </div>
    `;
    
    document.querySelector('#contato').appendChild(avaliacaoSection);
});