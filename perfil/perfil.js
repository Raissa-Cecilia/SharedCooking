class UserDatabase {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Receitas simuladas do usuário
const receitasUsuario = [
    {
        id: 1,
        titulo: "Torta de Limão Perfeita",
        descricao: "O segredo para a torta de limão perfeita está na massa crocante e na ganache de limão cremosa, além do merengue leve e aerado...",
        imagem: "https://via.placeholder.com/300x200/5e1c1c/ffffff?text=Torta+de+Limao",
        categoria: "Sobremesas",
        badge: "Pratos Principais",
        tempo: "1h 30min",
        dificuldade: "Médio",
        curtidas: 345,
        visualizacoes: 1250,
        comentarios: 28
    },
    {
        id: 2,
        titulo: "Curry Tailandês Vermelho",
        descricao: "Um prato repleto vegano e cheio de sabor com leite de coco e mais de curry vermelha. Ideal para ocasiões especiais...",
        imagem: "https://via.placeholder.com/300x200/8b4513/ffffff?text=Curry+Tailandes",
        categoria: "Pratos Principais",
        badge: "Receita Vegana",
        tempo: "45min",
        dificuldade: "Fácil",
        curtidas: 278,
        visualizacoes: 980,
        comentarios: 19
    },
    {
        id: 3,
        titulo: "Pão de Queijo Mineiro",
        descricao: "Receita tradicional para o pão de queijo autêntico, crocante por fora e macio por dentro. Ideal para o café da manhã...",
        imagem: "https://via.placeholder.com/300x200/daa520/ffffff?text=Pao+de+Queijo",
        categoria: "Lanches & Acompanhamentos",
        badge: "Receita Tradicional",
        tempo: "50min",
        dificuldade: "Médio",
        curtidas: 512,
        visualizacoes: 1850,
        comentarios: 36
    },
    {
        id: 4,
        titulo: "Feijoada Completa Clássica",
        descricao: "O tradicional prato brasileiro! Feita com amor e ingredientes selecionados. Rende 8 porções e congela muito bem...",
        imagem: "https://via.placeholder.com/300x200/8b0000/ffffff?text=Feijoada",
        categoria: "Pratos Principais",
        badge: "Receita Brasileira",
        tempo: "3h",
        dificuldade: "Difícil",
        curtidas: 689,
        visualizacoes: 2100,
        comentarios: 55
    }
];

// Instância do banco de dados
const userDB = new UserDatabase();

// Elementos do DOM
const elementos = {
    perfilAvatar: document.getElementById('perfilAvatar'),
    perfilNome: document.getElementById('perfilNome'),
    perfilBiografia: document.getElementById('perfilBiografia'),
    perfilNivel: document.getElementById('perfilNivel'),
    receitasGrid: document.getElementById('receitasGrid')
};

// Mapeamento de níveis culinários
const niveisMap = {
    'iniciante': 'Iniciante',
    'intermediario': 'Cozinheiro Doméstico',
    'avancado': 'Chef Amador',
    'profissional': 'Profissional'
};

// Carregar dados do usuário logado
function carregarPerfilUsuario() {
    if (!userDB.isLoggedIn()) {
        // Se não estiver logado, redirecionar para o login
        window.location.href = '../login/login.html';
        return;
    }

    const usuario = userDB.getCurrentUser();
    
    // Buscar dados adicionais das configurações (se existirem)
    const dadosConfiguracao = JSON.parse(localStorage.getItem('userConfig') || '{}');
    
    // Atualizar nome
    elementos.perfilNome.textContent = usuario.name || 'Usuário Shared Cooking';
    
    // Atualizar avatar
    if (dadosConfiguracao.avatar) {
        elementos.perfilAvatar.innerHTML = `<img src="${dadosConfiguracao.avatar}" alt="Avatar do usuário">`;
    }
    
    // Atualizar biografia
    const biografia = dadosConfiguracao.bio || 'Apaixonado(a) por culinária! Sempre em busca de novas receitas e experiências gastronômicas.';
    elementos.perfilBiografia.textContent = biografia;
    
    // Atualizar nível culinário
    const nivel = dadosConfiguracao.nivelCulinario || 'intermediario';
    elementos.perfilNivel.textContent = niveisMap[nivel] || 'Cozinheiro Doméstico';
}

// Criar card de receita
function criarCardReceita(receita) {
    const card = document.createElement('div');
    card.className = 'receita-card';
    card.onclick = () => abrirReceita(receita.id);
    
    card.innerHTML = `
        <div class="receita-imagem">
            <img src="${receita.imagem}" alt="${receita.titulo}">
            <span class="receita-categoria">${receita.categoria}</span>
            ${receita.badge ? `<span class="receita-badge">${receita.badge}</span>` : ''}
        </div>
        <div class="receita-conteudo">
            <h3 class="receita-titulo">${receita.titulo}</h3>
            <p class="receita-descricao">${receita.descricao}</p>
            
            <div class="receita-stats">
                <span><i class="fas fa-heart"></i> ${receita.curtidas}</span>
                <span><i class="fas fa-eye"></i> ${receita.visualizacoes}</span>
                <span><i class="fas fa-comment"></i> ${receita.comentarios}</span>
            </div>
            
            <div class="receita-info">
                <div class="receita-tempo">
                    <i class="fas fa-clock"></i>
                    <span>${receita.tempo}</span>
                </div>
                <div class="receita-dificuldade">
                    <i class="fas fa-signal"></i>
                    <span>${receita.dificuldade}</span>
                </div>
            </div>
            
            <button class="receita-botao">Ver Detalhes</button>
        </div>
    `;
    
    return card;
}

// Carregar receitas do usuário
function carregarReceitas() {
    // Limpar grid
    elementos.receitasGrid.innerHTML = '';
    
    // Se não houver receitas, mostrar mensagem
    if (receitasUsuario.length === 0) {
        elementos.receitasGrid.innerHTML = `
            <div class="mensagem-vazia">
                <i class="fas fa-utensils"></i>
                <h2>Nenhuma receita publicada ainda</h2>
                <p>Comece a compartilhar suas receitas deliciosas com a comunidade!</p>
            </div>
        `;
        return;
    }
    
    // Adicionar receitas ao grid
    receitasUsuario.forEach(receita => {
        const card = criarCardReceita(receita);
        elementos.receitasGrid.appendChild(card);
    });
}

// Abrir detalhes da receita
function abrirReceita(id) {
    console.log('Abrindo receita:', id);
    // Aqui você redirecionaria para a página de detalhes da receita
    // window.location.href = `../detalhes-receita/receita.html?id=${id}`;
    alert(`Visualizando receita ${id}. (Funcionalidade a ser implementada)`);
}

// Sistema de notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacaoAnterior = document.getElementById('systemNotification');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'systemNotification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    const cores = {
        success: '#51a351',
        error: '#bd362f',
        warning: '#f89406',
        info: '#2f96b4'
    };

    notification.style.backgroundColor = cores[tipo] || cores.info;
    notification.textContent = mensagem;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Sincronizar dados de configuração
function sincronizarConfiguracao() {
    // Esta função seria chamada quando o usuário atualizar suas configurações
    // Para manter o perfil atualizado
    const dadosConfiguracao = JSON.parse(localStorage.getItem('userConfig') || '{}');
    
    if (dadosConfiguracao) {
        carregarPerfilUsuario();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar login e carregar dados
    carregarPerfilUsuario();
    carregarReceitas();
    
    // Listener para atualização de configurações
    window.addEventListener('storage', function(e) {
        if (e.key === 'userConfig') {
            sincronizarConfiguracao();
        }
    });
    
    console.log('Página de perfil carregada com sucesso!');
});


