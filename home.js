// =============================================================================
// 1. VARIÁVEIS GLOBAIS E CONFIGURAÇÕES
// =============================================================================

// Estado da aplicação
const appState = {
    receitasDestaque: [],
    receitasRecentes: [],
    usuarioLogado: false,
    favoritos: JSON.parse(localStorage.getItem('favoritos')) || [],
    curtidas: JSON.parse(localStorage.getItem('curtidas')) || {},
    historicoVisualizacoes: JSON.parse(localStorage.getItem('historicoVisualizacoes')) || []
};

// Elementos DOM importantes
const elementos = {
    listaDestaques: document.querySelector('.lista-destaques'),
    listaRecentes: document.querySelector('.lista-recem'),
    barraPesquisa: document.querySelector('.barra-pesquisa input'),
    botaoAdicionar: document.querySelector('.botao-adicionar'),
    iconePerfil: document.querySelector('.icone-perfil'),
    iconeConfig: document.querySelector('.icone-config')
};

// =============================================================================
// 2. FUNÇÕES PRINCIPAIS DE CARREGAMENTO DE DADOS
// =============================================================================

// Simulação de API - No futuro será substituída por fetch para seu backend
async function buscarReceitasDestaque() {
    console.log("Buscando receitas em destaque...");
    
    // Dados simulados - no futuro virão do MongoDB
    const receitasDestaque = [
        {
            id: 1,
            nome: "Torta de Limão Perfeita",
            fotoUrl: "imagens/tortaLimao.jpg", 
            resumo: "O segredo para a torta de limão mais cremosa e azedinha que você já comeu. Crosta de biscoito de amido crocante e merengue italiano no ponto certo.",
            curtidas: 1250,
            comentarios: 89,
            favoritos: 450,
            categoria: "Sobremesas",
            ingredientes: ["Limão", "Leite Condensado", "Creme de Leite", "Biscoito"],
            modoPreparo: ["1. Bata os ingredientes...", "2. Leve à geladeira...", "3. Sirva com merengue."],
            tempoPreparo: "45 min",
            dificuldade: "Fácil",
            porcoes: 8,
            dataPublicacao: "2025-01-15"
        },
        {
            id: 2,
            nome: "Curry Tailandês Vermelho",
            fotoUrl: "imagens/curryTailandês.jpg", 
            resumo: "Um prato rápido, vegano e cheio de sabor com leite de coco e pasta de curry vermelha. Ideal para um jantar exótico e saudável.",
            curtidas: 890,
            comentarios: 45,
            favoritos: 210,
            categoria: "Pratos Principais",
            ingredientes: ["Leite de Coco", "Pasta de Curry", "Vegetais", "Arroz"],
            modoPreparo: ["1. Refogue a pasta...", "2. Adicione o leite...", "3. Cozinhe os vegetais."],
            tempoPreparo: "30 min",
            dificuldade: "Médio",
            porcoes: 4,
            dataPublicacao: "2025-01-10"
        },
        {
            id: 3,
            nome: "Feijoada Completa Clássica",
            fotoUrl: "imagens/FeijoadaCompleta.jpg", 
            resumo: "O tradicional prato brasileiro! Feijão preto cozido lentamente com carnes salgadas, linguiça e bacon. Perfeito para o sábado com a família.",
            curtidas: 2100,
            comentarios: 155,
            favoritos: 780,
            categoria: "Pratos Principais",
            ingredientes: ["Feijão Preto", "Carne Seca", "Paio", "Costelinha", "Laranja"],
            modoPreparo: ["1. Dessalgue as carnes...", "2. Cozinhe o feijão e as carnes...", "3. Sirva com couve e arroz."],
            tempoPreparo: "4 horas",
            dificuldade: "Difícil",
            porcoes: 10,
            dataPublicacao: "2025-01-05"
        },
        {
            id: 4,
            nome: "Pão de Queijo Mineiro",
            fotoUrl: "imagens/PãoQueijo.jpg", 
            resumo: "Receita infalível para o pão de queijo autêntico, crocante por fora e macio por dentro. Ideal para o café da manhã ou lanche da tarde.",
            curtidas: 1850,
            comentarios: 95,
            favoritos: 512,
            categoria: "Lanches & Aperitivos",
            ingredientes: ["Polvilho Doce", "Polvilho Azedo", "Queijo Minas", "Leite", "Ovos"],
            modoPreparo: ["1. Ferva o leite e o óleo...", "2. Adicione o polvilho...", "3. Asse em forno pré-aquecido."],
            tempoPreparo: "35 min",
            dificuldade: "Fácil",
            porcoes: 20,
            dataPublicacao: "2025-01-12"
        },
        {
            id: 5,
            nome: "Brownie Super Cremoso",
            fotoUrl: "imagens/BrownieCremoso.jpg", 
            resumo: "O brownie que desmancha na boca! Com uma casquinha fina e interior úmido e fudgy. O toque de flor de sal é o segredo para equilibrar o doce.",
            curtidas: 2500,
            comentarios: 210,
            favoritos: 980,
            categoria: "Sobremesas",
            ingredientes: ["Chocolate Meio Amargo", "Manteiga", "Açúcar Mascavo", "Ovos", "Farinha"],
            modoPreparo: ["1. Derreta o chocolate e a manteiga...", "2. Misture os secos e os úmidos...", "3. Asse por 25 minutos."],
            tempoPreparo: "40 min",
            dificuldade: "Médio",
            porcoes: 12,
            dataPublicacao: "2025-01-08"
        },
        {
        id: 6,
        nome: "Frango à Parmegiana Caseiro",
        fotoUrl: "imagens/FrangoParmegiana.jpg", 
        resumo: "Clássico brasileiro com frango empanado, molho de tomate caseiro e queijo derretido. Confort food que agrada a todos.",
        curtidas: 1650,
        comentarios: 105,
        favoritos: 520,
        categoria: "Pratos Principais",
        ingredientes: ["Peito de Frango", "Farinha de Rosca", "Ovos", "Molho de Tomate", "Queijo Mussarela", "Orégano"],
        modoPreparo: ["1. Tempere o frango...", "2. Passe na farinha e ovos...", "3. Cubra com molho e queijo..."],
        tempoPreparo: "50 min",
        dificuldade: "Médio",
        porcoes: 4,
        dataPublicacao: "2025-01-26"
    },
    {
        id: 7,
        nome: "Pudim de Leite Condensado Cremoso",
        fotoUrl: "imagens/PudimLeite.jpg", 
        resumo: "O pudim perfeito: caramelizado por fora, cremoso por dentro. Receita tradicional que nunca falha e conquista todos os paladares.",
        curtidas: 2200,
        comentarios: 156,
        favoritos: 890,
        categoria: "Sobremesas",
        ingredientes: ["Leite Condensado", "Leite", "Ovos", "Açúcar", "Baunilha"],
        modoPreparo: ["1. Derreta o açúcar para a calda...", "2. Bata os ingredientes...", "3. Cozinhe em banho-maria..."],
        tempoPreparo: "1 hora + 6h geladeira",
        dificuldade: "Médio",
        porcoes: 8,
        dataPublicacao: "2025-01-27"
    },
    {
        id: 8,
        nome: "Sopa Cremosa de Abóbora com Gengibre",
        fotoUrl: "imagens/SopaAbobora.jpg", 
        resumo: "Sopa reconfortante e saborosa com abóbora cabotiá, toque de gengibre e finalizada com creme de leite. Ideal para dias frios.",
        curtidas: 650,
        comentarios: 38,
        favoritos: 190,
        categoria: "Saudáveis & Leves",
        ingredientes: ["Abóbora Cabotiá", "Gengibre", "Cebola", "Caldo de Legumes", "Creme de Leite", "Noz-moscada"],
        modoPreparo: ["1. Refogue a cebola...", "2. Cozinhe a abóbora...", "3. Bata até obter creme..."],
        tempoPreparo: "30 min",
        dificuldade: "Fácil",
        porcoes: 4,
        dataPublicacao: "2025-01-28"
    },
    {
        id: 9,
        nome: "Bolinho de Chuva com Canela",
        fotoUrl: "imagens/BolinhoChuva.jpg", 
        resumo: "Clássico da infância, esses bolinhos fofinhos e dourados são perfeitos para o lanche da tarde. Crocantes por fora, macios por dentro.",
        curtidas: 1450,
        comentarios: 89,
        favoritos: 410,
        categoria: "Lanches & Aperitivos",
        ingredientes: ["Farinha de Trigo", "Ovos", "Leite", "Açúcar", "Canela", "Fermento"],
        modoPreparo: ["1. Misture os ingredientes...", "2. Frite em óleo quente...", "3. Passe na mistura de canela e açúcar..."],
        tempoPreparo: "20 min",
        dificuldade: "Fácil",
        porcoes: 6,
        dataPublicacao: "2025-01-29"
    },
    {
        id: 10,
        nome: "Macarrão Alfredo com Cogumelos",
        fotoUrl: "imagens/MacarraoAlfredo.jpg", 
        resumo: "Massa cremosa com molho Alfredo caseiro e cogumelos salteados. Um prato italiano reconfortante e cheio de sabor.",
        curtidas: 1250,
        comentarios: 82,
        favoritos: 380,
        categoria: "Massas & Pizzas",
        ingredientes: ["Fettuccine", "Cogumelos Paris", "Creme de Leite", "Manteiga", "Queijo Parmesão", "Noz-moscada"],
        modoPreparo: ["1. Cozinhe o macarrão...", "2. Salteie os cogumelos...", "3. Prepare o molho Alfredo..."],
        tempoPreparo: "25 min",
        dificuldade: "Fácil",
        porcoes: 4,
        dataPublicacao: "2025-01-30"
    }
            
    ];

    // Simula um pequeno atraso de rede
    return new Promise(resolve => setTimeout(() => resolve(receitasDestaque), 300));
}

// Busca receitas recentes (diferentes das em destaque)
async function buscarReceitasRecentes() {
    console.log("Buscando receitas recentes...");
    
    // Dados simulados diferentes dos destaques
    const receitasRecentes = [
        {
            id: 6,
            nome: "Salada Caesar com Camarão",
            fotoUrl: "imagens/SaladaCamarão.jpg", 
            resumo: "Uma versão sofisticada e leve da clássica salada Caesar. Camarões grelhados no ponto, croutons caseiros e molho cremoso de limão e alho.",
            curtidas: 750,
            comentarios: 30,
            favoritos: 150,
            categoria: "Saudáveis & Leves",
            ingredientes: ["Alface Romana", "Camarão", "Molho Caesar", "Parmesão", "Croutons"],
            modoPreparo: ["1. Grelhe os camarões...", "2. Misture a alface e os croutons...", "3. Finalize com o molho e queijo."],
            tempoPreparo: "25 min",
            dificuldade: "Fácil",
            porcoes: 2,
            dataPublicacao: "2025-01-20"
        },
        {
            id: 7,
            nome: "Pizza Margherita Napolitana",
            fotoUrl: "imagens/PizzaNapolitana.jpg", 
            resumo: "A verdadeira pizza napolitana, com massa de longa fermentação, molho de tomate San Marzano, muçarela de búfala e manjericão fresco. Simples e perfeita!",
            curtidas: 1600,
            comentarios: 110,
            favoritos: 650,
            categoria: "Massas & Pizzas",
            ingredientes: ["Farinha de Trigo", "Tomate", "Manjericão", "Muçarela de Búfala", "Azeite"],
            modoPreparo: ["1. Prepare a massa e deixe fermentar...", "2. Monte a pizza...", "3. Asse em forno bem quente."],
            tempoPreparo: "2 horas (fermentação) + 15 min",
            dificuldade: "Difícil",
            porcoes: 4,
            dataPublicacao: "2025-01-19"
        },
        {
            id: 8,
            nome: "Risotto de Cogumelos Silvestres",
            fotoUrl: "imagens/risotto.jpg", 
            resumo: "Cremoso, saboroso e reconfortante. Este risotto combina cogumelos frescos com um caldo caseiro e queijo parmesão de qualidade.",
            curtidas: 920,
            comentarios: 65,
            favoritos: 320,
            categoria: "Pratos Principais",
            ingredientes: ["Arroz Arbório", "Cogumelos", "Caldo de Legumes", "Vinho Branco", "Parmesão"],
            modoPreparo: ["1. Refogue os cogumelos...", "2. Adicione o arroz...", "3. Incorpore o queijo no final."],
            tempoPreparo: "40 min",
            dificuldade: "Médio",
            porcoes: 4,
            dataPublicacao: "2025-01-18"
        },
        {
            id: 9,
            nome: "Mousse de Chocolate Belga",
            fotoUrl: "imagens/Mousse.jpg", 
            resumo: "Uma sobremesa clássica e elegante. Esta mousse é incrivelmente leve, aerada e com sabor intenso de chocolate belga de alta qualidade.",
            curtidas: 1350,
            comentarios: 85,
            favoritos: 540,
            categoria: "Sobremesas",
            ingredientes: ["Chocolate Belga", "Ovos", "Açúcar", "Creme de Leite", "Manteiga"],
            modoPreparo: ["1. Derreta o chocolate...", "2. Incorpore as claras em neve...", "3. Deixe na geladeira por 4h."],
            tempoPreparo: "30 min + 4h geladeira",
            dificuldade: "Médio",
            porcoes: 6,
            dataPublicacao: "2025-01-17"
        },
        {
            id: 10,
            nome: "Hambúrguer Artesanal com Molho Especial",
            fotoUrl: "imagens/HambúrguerArtesanal.jpg", 
            resumo: "Não é qualquer hambúrguer! Carne selecionada, pão brioche artesanal e um molho secreto que faz toda a diferença.",
            curtidas: 1100,
            comentarios: 75,
            favoritos: 380,
            categoria: "Lanches & Aperitivos",
            ingredientes: ["Carne Bovina", "Pão Brioche", "Queijo Cheddar", "Bacon", "Molho Especial"],
            modoPreparo: ["1. Tempere a carne...", "2. Grelhe os hambúrgueres...", "3. Monte com os acompanhamentos."],
            tempoPreparo: "35 min",
            dificuldade: "Fácil",
            porcoes: 4,
            dataPublicacao: "2025-01-16"
        },
        {
            id: 11,
            nome: "Lasanha de Berinjela com Queijos",
            fotoUrl: "imagens/LasanhaBerinjela.jpg", 
            resumo: "Uma versão mais leve da lasanha tradicional, substituindo a massa por finas fatias de berinjela grelhada. Camadas de queijo e molho de tomate caseiro.",
            curtidas: 920,
            comentarios: 68,
            favoritos: 310,
            categoria: "Pratos Principais",
            ingredientes: ["Berinjela", "Queijo Mussarela", "Queijo Parmesão", "Molho de Tomate", "Carne Moída", "Manjericão"],
            modoPreparo: ["1. Corte as berinjelas em fatias finas...", "2. Grelhe as fatias de berinjela...", "3. Monte as camadas em uma forma..."],
            tempoPreparo: "1 hora 15 min",
            dificuldade: "Médio",
            porcoes: 6,
            dataPublicacao: "2025-01-21"
        },
        {
            id: 12,
            nome: "Tacos Mexicanos Picantes",
            fotoUrl: "imagens/TacosMexicanos.jpg", 
            resumo: "Tacos autênticos com carne temperada, coentro fresco, cebola roxa e molho de abacate cremoso. Perfeitos para uma refeição rápida e saborosa.",
            curtidas: 1350,
            comentarios: 92,
            favoritos: 420,
            categoria: "Pratos Principais",
            ingredientes: ["Tortilhas de Milho", "Carne Bovina", "Coentro", "Cebola Roxa", "Abacate", "Pimenta Jalapeño"],
            modoPreparo: ["1. Tempere e cozinhe a carne...", "2. Prepare o guacamole...", "3. Aqueça as tortilhas..."],
            tempoPreparo: "25 min",
            dificuldade: "Fácil",
            porcoes: 4,
            dataPublicacao: "2025-01-22"
        },
        {
            id: 13,
            nome: "Cheesecake de Frutas Vermelhas",
            fotoUrl: "imagens/CheesecakeFrutas.jpg", 
            resumo: "Cheesecake cremoso com base de biscoito amanteigado e cobertura de calda de frutas vermelhas. A combinação perfeita entre doce e azedo.",
            curtidas: 1850,
            comentarios: 124,
            favoritos: 670,
            categoria: "Sobremesas",
            ingredientes: ["Cream Cheese", "Biscoito Maisena", "Frutas Vermelhas", "Açúcar", "Gelatina", "Manteiga"],
            modoPreparo: ["1. Triture os biscoitos...", "2. Bata o cream cheese...", "3. Prepare a calda de frutas..."],
            tempoPreparo: "45 min + 4h geladeira",
            dificuldade: "Médio",
            porcoes: 8,
            dataPublicapia: "2025-01-23"
        }
    ];

    // Simula um pequeno atraso de rede
    return new Promise(resolve => setTimeout(() => resolve(receitasRecentes), 300));
}

// =============================================================================
// 3. FUNÇÕES DE CRIAÇÃO DE ELEMENTOS
// =============================================================================

/**
 * Cria o elemento HTML de um cartão de receita
 * @param {object} receita - Objeto contendo os detalhes da receita
 * @param {boolean} isDestaque - Se é um cartão de destaque ou recente
 * @returns {HTMLLIElement} O elemento <li> do cartão
 */
function criarCartaoReceita(receita, isDestaque = true) {
    const li = document.createElement('li');
    li.className = isDestaque ? 'cartao-destaque' : 'cartao-recente';
    li.setAttribute('data-id', receita.id);
    li.setAttribute('data-categoria', receita.categoria);
    
    // Verifica se a receita está favoritada ou curtida pelo usuário
    const isFavoritada = appState.favoritos.includes(receita.id);
    const isCurtida = appState.curtidas[receita.id] || false;
    
    li.innerHTML = `
        <div class="cartao-conteudo">
            <div class="foto-receita" style="background-image: url('${receita.fotoUrl}');">
                <span class="nome-receita">${receita.nome}</span>
                <div class="badge-categoria">${receita.categoria}</div>
                <div class="overlay-foto">
                    <button class="btn-overlay ver-receita" title="Ver Receita">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-overlay favoritar-rapido ${isFavoritada ? 'active' : ''}" title="${isFavoritada ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            
            <div class="interacao-container">
                <div class="icones-interacao">
                    <button class="icone-btn favoritar-btn ${isFavoritada ? 'active' : ''}" data-type="favorito" data-id="${receita.id}">
                        <i class="fas fa-heart"></i>
                        <span class="contador">${receita.favoritos}</span>
                    </button>
                    <button class="icone-btn curtir-btn ${isCurtida ? 'active' : ''}" data-type="curtida" data-id="${receita.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span class="contador">${receita.curtidas}</span>
                    </button>
                    <button class="icone-btn comentar-btn" data-type="comentario" data-id="${receita.id}">
                        <i class="fas fa-comment"></i>
                        <span class="contador">${receita.comentarios}</span>
                    </button>
                    <button class="icone-btn salvar-btn" data-type="salvar" data-id="${receita.id}" title="Salvar para mais tarde">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>

                <div class="info-rapida">
                    <span class="tempo-preparo"><i class="fas fa-clock"></i> ${receita.tempoPreparo}</span>
                    <span class="dificuldade ${receita.dificuldade.toLowerCase()}">${receita.dificuldade}</span>
                    <span class="porcoes"><i class="fas fa-users"></i> ${receita.porcoes}</span>
                </div>

                <div class="resumo-receita">
                    <p class="resumo-texto">${receita.resumo}</p>
                    <button class="ver-mais-btn">Ver Detalhes</button>
                </div>
            </div>
        </div>
    `;

    // Adiciona eventos aos elementos do cartão
    adicionarEventosCartao(li, receita);
    
    return li;
}

/**
 * Adiciona eventos aos elementos de um cartão de receita
 * @param {HTMLLIElement} cartao - Elemento do cartão
 * @param {object} receita - Objeto da receita
 */
function adicionarEventosCartao(cartao, receita) {
    // Evento para o botão "Ver Detalhes"
    const verMaisBtn = cartao.querySelector('.ver-mais-btn');
    verMaisBtn.addEventListener('click', () => {
        abrirModalDetalhes(receita);
    });

    // Evento para o botão "Ver Receita" no overlay
    const verReceitaBtn = cartao.querySelector('.ver-receita');
    verReceitaBtn.addEventListener('click', () => {
        abrirModalDetalhes(receita);
    });

    // Evento para o botão de favoritar rápido no overlay
    const favoritarRapidoBtn = cartao.querySelector('.favoritar-rapido');
    favoritarRapidoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorito(receita.id, favoritarRapidoBtn);
        // Atualiza também o botão principal de favoritos
        const favoritarBtn = cartao.querySelector('.favoritar-btn');
        if (favoritarBtn) {
            favoritarBtn.classList.toggle('active', favoritarRapidoBtn.classList.contains('active'));
        }
    });

    // Eventos para os botões de interação
    cartao.querySelectorAll('.icone-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tipo = btn.getAttribute('data-type');
            const idReceita = parseInt(btn.getAttribute('data-id'));
            
            switch(tipo) {
                case 'favorito':
                    toggleFavorito(idReceita, btn);
                    // Atualiza também o botão no overlay
                    const favoritarRapido = cartao.querySelector('.favoritar-rapido');
                    if (favoritarRapido) {
                        favoritarRapido.classList.toggle('active', btn.classList.contains('active'));
                    }
                    break;
                case 'curtida':
                    toggleCurtida(idReceita, btn);
                    break;
                case 'comentario':
                    abrirModalComentarios(receita);
                    break;
                case 'salvar':
                    toggleSalvarReceita(idReceita, btn);
                    break;
            }
        });
    });

    // Evento de clique na imagem para abrir detalhes
    const fotoReceita = cartao.querySelector('.foto-receita');
    fotoReceita.addEventListener('click', () => {
        abrirModalDetalhes(receita);
    });

    // Efeitos de hover no cartão
    cartao.addEventListener('mouseenter', () => {
        cartao.classList.add('hover');
    });
    
    cartao.addEventListener('mouseleave', () => {
        cartao.classList.remove('hover');
    });
}

// =============================================================================
// 4. FUNÇÕES DE INTERAÇÃO DO USUÁRIO
// =============================================================================

/**
 * Alterna o estado de favorito de uma receita
 * @param {number} idReceita - ID da receita
 * @param {HTMLElement} botao - Elemento do botão
 */
function toggleFavorito(idReceita, botao) {
    const index = appState.favoritos.indexOf(idReceita);
    const contador = botao.querySelector('.contador');
    let count = contador ? parseInt(contador.textContent) : 0;
    
    if (index === -1) {
        // Adicionar aos favoritos
        appState.favoritos.push(idReceita);
        botao.classList.add('active');
        if (contador) contador.textContent = count + 1;
        mostrarFeedback('Receita adicionada aos favoritos!', 'success');
        
        // Animação de confete para favoritos
        if (Math.random() > 0.7) { // 30% de chance
            criarEfeitoConfete(botao);
        }
    } else {
        // Remover dos favoritos
        appState.favoritos.splice(index, 1);
        botao.classList.remove('active');
        if (contador) contador.textContent = count - 1;
        mostrarFeedback('Receita removida dos favoritos!', 'info');
    }
    
    // Salvar no localStorage
    localStorage.setItem('favoritos', JSON.stringify(appState.favoritos));
    
    // NO FUTURO: Enviar para o backend
    console.log(`Favorito atualizado para receita ${idReceita}: ${index === -1 ? 'adicionado' : 'removido'}`);
}

/**
 * Alterna o estado de curtida de uma receita
 * @param {number} idReceita - ID da receita
 * @param {HTMLElement} botao - Elemento do botão
 */
function toggleCurtida(idReceita, botao) {
    const jaCurtiu = appState.curtidas[idReceita] || false;
    const contador = botao.querySelector('.contador');
    let count = parseInt(contador.textContent);
    
    if (!jaCurtiu) {
        // Curtir
        appState.curtidas[idReceita] = true;
        botao.classList.add('active');
        contador.textContent = count + 1;
        mostrarFeedback('Receita curtida!', 'success');
        
        // Efeito de pulso na curtida
        botao.style.transform = 'scale(1.2)';
        setTimeout(() => {
            botao.style.transform = 'scale(1)';
        }, 300);
    } else {
        // Descurtir
        appState.curtidas[idReceita] = false;
        botao.classList.remove('active');
        contador.textContent = count - 1;
        mostrarFeedback('Curtida removida!', 'info');
    }
    
    // Salvar no localStorage
    localStorage.setItem('curtidas', JSON.stringify(appState.curtidas));
    
    // NO FUTURO: Enviar para o backend
    console.log(`Curtida atualizada para receita ${idReceita}: ${!jaCurtiu ? 'curtida' : 'descurtida'}`);
}

/**
 * Alterna o estado de "salvar para depois" de uma receita
 * @param {number} idReceita - ID da receita
 * @param {HTMLElement} botao - Elemento do botão
 */
function toggleSalvarReceita(idReceita, botao) {
    const salvos = JSON.parse(localStorage.getItem('receitasSalvas')) || [];
    const index = salvos.indexOf(idReceita);
    
    if (index === -1) {
        // Salvar receita
        salvos.push(idReceita);
        botao.classList.add('active');
        mostrarFeedback('Receita salva para mais tarde!', 'success');
    } else {
        // Remover dos salvos
        salvos.splice(index, 1);
        botao.classList.remove('active');
        mostrarFeedback('Receita removida dos salvos!', 'info');
    }
    
    // Salvar no localStorage
    localStorage.setItem('receitasSalvas', JSON.stringify(salvos));
    
    // NO FUTURO: Enviar para o backend
    console.log(`Receita ${idReceita} ${index === -1 ? 'salva' : 'removida dos salvos'}`);
}

/**
 * Exibe um feedback visual para o usuário
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo de feedback (success, error, info, warning)
 */
function mostrarFeedback(mensagem, tipo = 'info') {
    // Remove feedback anterior se existir
    const feedbackAnterior = document.querySelector('.feedback-mensagem');
    if (feedbackAnterior) {
        feedbackAnterior.remove();
    }
    
    // Cria novo elemento de feedback
    const feedback = document.createElement('div');
    feedback.className = `feedback-mensagem ${tipo}`;
    feedback.innerHTML = `
        <div class="feedback-conteudo">
            <i class="fas fa-${tipo === 'success' ? 'check' : tipo === 'error' ? 'exclamation-triangle' : 'info'}-circle"></i>
            <span>${mensagem}</span>
        </div>
    `;
    
    // Adiciona ao corpo do documento
    document.body.appendChild(feedback);
    
    // Animação de entrada
    setTimeout(() => {
        feedback.classList.add('show');
    }, 10);
    
    // Remove após 3 segundos
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }, 3000);
}

/**
 * Cria efeito de confete para interações especiais
 * @param {HTMLElement} elemento - Elemento onde o confete será originado
 */
function criarEfeitoConfete(elemento) {
    const rect = elemento.getBoundingClientRect();
    const cores = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 15; i++) {
        const confete = document.createElement('div');
        confete.className = 'confete';
        confete.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${cores[Math.floor(Math.random() * cores.length)]};
            border-radius: 1px;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(confete);
        
        // Animação
        const angle = Math.random() * Math.PI * 2;
        const velocity = 15 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = rect.left + rect.width / 2;
        let posY = rect.top + rect.height / 2;
        let gravity = 0.5;
        let opacity = 1;
        
        function animar() {
            posX += vx;
            posY += vy;
            vy += gravity;
            opacity -= 0.02;
            
            confete.style.left = posX + 'px';
            confete.style.top = posY + 'px';
            confete.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animar);
            } else {
                confete.remove();
            }
        }
        
        requestAnimationFrame(animar);
    }
}

// =============================================================================
// 5. SISTEMA DE BUSCA
// =============================================================================

/**
 * Inicializa o sistema de busca em tempo real
 */
function inicializarBusca() {
    let timeoutBusca;
    
    elementos.barraPesquisa.addEventListener('input', (e) => {
        clearTimeout(timeoutBusca);
        const termo = e.target.value.trim();
        
        // Se o campo estiver vazio, mostrar todas as receitas
        if (termo === '') {
            carregarDestaques();
            carregarRecentes();
            // Remove título de resultados se existir
            const tituloResultados = document.querySelector('.titulo-resultados');
            if (tituloResultados) tituloResultados.remove();
            return;
        }
        
        // Debounce para evitar buscas excessivas
        timeoutBusca = setTimeout(() => {
            realizarBusca(termo);
        }, 500);
    });
    
    // Adiciona evento de submit para o formulário de busca (se existir)
    const formBusca = elementos.barraPesquisa.closest('form') || elementos.barraPesquisa.parentElement;
    if (formBusca) {
        formBusca.addEventListener('submit', (e) => {
            e.preventDefault();
            const termo = elementos.barraPesquisa.value.trim();
            if (termo) {
                realizarBusca(termo);
            }
        });
    }
}

/**
 * Realiza a busca de receitas
 * @param {string} termo - Termo de busca
 */
async function realizarBusca(termo) {
    try {
        console.log(`Buscando receitas com termo: "${termo}"`);
        
        // Mostrar indicador de carregamento
        elementos.listaDestaques.innerHTML = '<div class="carregando">Buscando receitas...</div>';
        if (elementos.listaRecentes) {
            elementos.listaRecentes.innerHTML = '';
        }
        
        // NO FUTURO: Substituir por busca no backend
        const todasReceitas = await buscarReceitasDestaque();
        const receitasRecentes = await buscarReceitasRecentes();
        const todas = [...todasReceitas, ...receitasRecentes];
        
        const resultados = todas.filter(receita => 
            receita.nome.toLowerCase().includes(termo.toLowerCase()) ||
            receita.resumo.toLowerCase().includes(termo.toLowerCase()) ||
            receita.categoria.toLowerCase().includes(termo.toLowerCase()) ||
            receita.ingredientes.some(ingrediente => 
                ingrediente.toLowerCase().includes(termo.toLowerCase())
            )
        );
        
        // Exibir resultados
        exibirResultadosBusca(resultados, termo);
        
    } catch (error) {
        console.error("Erro na busca:", error);
        elementos.listaDestaques.innerHTML = '<p class="erro">Erro ao buscar receitas. Tente novamente.</p>';
    }
}

/**
 * Exibe os resultados da busca
 * @param {array} resultados - Array de receitas encontradas
 * @param {string} termo - Termo de busca
 */
function exibirResultadosBusca(resultados, termo) {
    elementos.listaDestaques.innerHTML = '';
    
    if (resultados.length === 0) {
        elementos.listaDestaques.innerHTML = `
            <div class="sem-resultados">
                <i class="fas fa-search"></i>
                <h3>Nenhuma receita encontrada</h3>
                <p>Não encontramos receitas para "${termo}". Tente outros termos.</p>
                <button class="botao-sugerir">Sugerir esta receita</button>
            </div>
        `;
        
        // Adiciona evento ao botão de sugerir
        const botaoSugerir = elementos.listaDestaques.querySelector('.botao-sugerir');
        if (botaoSugerir) {
            botaoSugerir.addEventListener('click', () => {
                // NO FUTURO: Redirecionar para página de adicionar receita
                window.location.href = 'telaAdc.html';
            });
        }
        
        return;
    }
    
    // Remove título anterior se existir
    const tituloAnterior = document.querySelector('.titulo-resultados');
    if (tituloAnterior) tituloAnterior.remove();
    
    // Adiciona título de resultados
    const tituloResultados = document.createElement('h3');
    tituloResultados.className = 'titulo-resultados';
    tituloResultados.textContent = `Resultados para "${termo}" (${resultados.length})`;
    elementos.listaDestaques.parentElement.insertBefore(tituloResultados, elementos.listaDestaques);
    
    // Adiciona os resultados
    resultados.forEach(receita => {
        const cartao = criarCartaoReceita(receita);
        elementos.listaDestaques.appendChild(cartao);
    });
}

// =============================================================================
// 6. MODAIS INTERATIVOS
// =============================================================================

/**
 * Cria e exibe o modal com detalhes da receita
 * @param {object} receita - Objeto da receita
 */
function abrirModalDetalhes(receita) {
    // Registrar visualização no histórico
    registrarVisualizacao(receita.id);
    
    // Verifica se já existe um modal aberto
    const modalExistente = document.querySelector('.modal-detalhes');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    // Verifica se a receita está favoritada ou curtida
    const isFavoritada = appState.favoritos.includes(receita.id);
    const isCurtida = appState.curtidas[receita.id] || false;
    
    // Cria o modal
    const modal = document.createElement('div');
    modal.className = 'modal-detalhes';
    modal.innerHTML = `
        <div class="modal-conteudo">
            <button class="fechar-modal">&times;</button>
            <div class="modal-cabecalho">
                <h2>${receita.nome}</h2>
                <div class="modal-metadados">
                    <span class="categoria">${receita.categoria}</span>
                    <span class="tempo"><i class="fas fa-clock"></i> ${receita.tempoPreparo}</span>
                    <span class="dificuldade ${receita.dificuldade.toLowerCase()}">${receita.dificuldade}</span>
                    <span class="porcoes"><i class="fas fa-users"></i> ${receita.porcoes} porções</span>
                </div>
            </div>
            
            <div class="modal-corpo">
                <div class="modal-imagem" style="background-image: url('${receita.fotoUrl}')">
                    <button class="btn-expandir-imagem" title="Expandir imagem">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
                
                <div class="modal-interacoes">
                    <button class="icone-btn favoritar-btn ${isFavoritada ? 'active' : ''}" data-type="favorito" data-id="${receita.id}">
                        <i class="fas fa-heart"></i>
                        <span>${receita.favoritos}</span>
                    </button>
                    <button class="icone-btn curtir-btn ${isCurtida ? 'active' : ''}" data-type="curtida" data-id="${receita.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${receita.curtidas}</span>
                    </button>
                    <button class="icone-btn compartilhar-btn" data-type="compartilhar">
                        <i class="fas fa-share-alt"></i>
                        <span>Compartilhar</span>
                    </button>
                    <button class="icone-btn imprimir-btn" data-type="imprimir">
                        <i class="fas fa-print"></i>
                        <span>Imprimir</span>
                    </button>
                </div>
                
                <div class="modal-descricao">
                    <p>${receita.resumo}</p>
                </div>
                
                <div class="modal-secoes">
                    <div class="secao ingredientes">
                        <h3><i class="fas fa-shopping-basket"></i> Ingredientes</h3>
                        <div class="controles-lista">
                            <button class="btn-marcar-todos" data-lista="ingredientes">
                                <i class="fas fa-check-double"></i> Marcar todos
                            </button>
                            <button class="btn-copiar-lista" data-lista="ingredientes">
                                <i class="fas fa-copy"></i> Copiar lista
                            </button>
                        </div>
                        <ul class="lista-ingredientes">
                            ${receita.ingredientes.map(ingrediente => `
                                <li>
                                    <input type="checkbox" id="ing-${receita.id}-${receita.ingredientes.indexOf(ingrediente)}">
                                    <label for="ing-${receita.id}-${receita.ingredientes.indexOf(ingrediente)}">${ingrediente}</label>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="secao preparo">
                        <h3><i class="fas fa-utensils"></i> Modo de Preparo</h3>
                        <div class="controles-preparo">
                            <button class="btn-timer" data-tempo="${extrairTempoMinutos(receita.tempoPreparo)}">
                                <i class="fas fa-hourglass-start"></i> Iniciar Timer
                            </button>
                        </div>
                        <ol class="lista-preparo">
                            ${receita.modoPreparo.map((passo, index) => `
                                <li>
                                    <div class="passo-header">
                                        <span class="numero-passo">${index + 1}</span>
                                        <button class="btn-marcar-passo" data-passo="${index + 1}">
                                            <i class="fas fa-check"></i> Concluído
                                        </button>
                                    </div>
                                    <div class="conteudo-passo">${passo}</div>
                                </li>
                            `).join('')}
                        </ol>
                    </div>
                </div>
                
                <div class="modal-rodape">
                    <div class="avaliacao-receita">
                        <h4>Avalie esta receita:</h4>
                        <div class="estrelas-avaliacao">
                            ${[1,2,3,4,5].map(i => `
                                <i class="fas fa-star" data-avaliacao="${i}"></i>
                            `).join('')}
                        </div>
                    </div>
                    <button class="botao-fazer-depois">
                        <i class="fas fa-history"></i> Fazer depois
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Adiciona o modal ao corpo do documento
    document.body.appendChild(modal);
    
    // Adiciona eventos ao modal
    adicionarEventosModal(modal, receita);
    
    // Animação de entrada
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Impede scroll no body quando o modal estiver aberto
    document.body.style.overflow = 'hidden';
}

/**
 * Adiciona eventos ao modal de detalhes
 * @param {HTMLElement} modal - Elemento do modal
 * @param {object} receita - Objeto da receita
 */
function adicionarEventosModal(modal, receita) {
    // Fechar modal ao clicar no botão X
    const fecharBtn = modal.querySelector('.fechar-modal');
    fecharBtn.addEventListener('click', () => {
        fecharModal(modal);
    });
    
    // Fechar modal ao clicar fora do conteúdo
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal(modal);
        }
    });
    
    // Fechar modal com tecla ESC
    const fecharComESC = (e) => {
        if (e.key === 'Escape') {
            fecharModal(modal);
        }
    };
    document.addEventListener('keydown', fecharComESC);
    
    // Eventos para os botões de interação no modal
    modal.querySelectorAll('.icone-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tipo = btn.getAttribute('data-type');
            const idReceita = parseInt(btn.getAttribute('data-id'));
            
            switch(tipo) {
                case 'favorito':
                    toggleFavorito(idReceita, btn);
                    // Atualiza também o botão na lista
                    atualizarBotaoNaLista(idReceita, 'favorito', btn.classList.contains('active'));
                    break;
                case 'curtida':
                    toggleCurtida(idReceita, btn);
                    // Atualiza também o botão na lista
                    atualizarBotaoNaLista(idReceita, 'curtida', btn.classList.contains('active'));
                    break;
                case 'compartilhar':
                    compartilharReceita(receita);
                    break;
                case 'imprimir':
                    imprimirReceita(receita);
                    break;
            }
        });
    });
    
    // Eventos para os controles de ingredientes
    const btnMarcarTodos = modal.querySelector('.btn-marcar-todos');
    btnMarcarTodos.addEventListener('click', () => {
        const checkboxes = modal.querySelectorAll('.lista-ingredientes input[type="checkbox"]');
        const todosMarcados = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(cb => {
            cb.checked = !todosMarcados;
        });
        
        btnMarcarTodos.innerHTML = todosMarcados ? 
            '<i class="fas fa-check-double"></i> Marcar todos' : 
            '<i class="fas fa-times"></i> Desmarcar todos';
    });
    
    const btnCopiarLista = modal.querySelector('.btn-copiar-lista');
    btnCopiarLista.addEventListener('click', () => {
        const ingredientes = receita.ingredientes.join('\n• ');
        const texto = `Ingredientes para ${receita.nome}:\n• ${ingredientes}`;
        
        navigator.clipboard.writeText(texto)
            .then(() => {
                mostrarFeedback('Lista de ingredientes copiada!', 'success');
            })
            .catch(err => {
                console.error('Erro ao copiar lista:', err);
                mostrarFeedback('Erro ao copiar lista', 'error');
            });
    });
    
    // Eventos para os passos de preparo
    modal.querySelectorAll('.btn-marcar-passo').forEach(btn => {
        btn.addEventListener('click', function() {
            const li = this.closest('li');
            li.classList.toggle('concluido');
            this.innerHTML = li.classList.contains('concluido') ? 
                '<i class="fas fa-undo"></i> Refazer' : 
                '<i class="fas fa-check"></i> Concluído';
        });
    });
    
    // Evento para o botão do timer
    const btnTimer = modal.querySelector('.btn-timer');
    btnTimer.addEventListener('click', function() {
        const tempoMinutos = parseInt(this.getAttribute('data-tempo'));
        if (tempoMinutos) {
            iniciarTimer(tempoMinutos, this);
        }
    });
    
    // Evento para expandir imagem
    const btnExpandir = modal.querySelector('.btn-expandir-imagem');
    btnExpandir.addEventListener('click', function() {
        const imagem = this.closest('.modal-imagem');
        imagem.classList.toggle('expandida');
        this.innerHTML = imagem.classList.contains('expandida') ? 
            '<i class="fas fa-compress"></i>' : 
            '<i class="fas fa-expand"></i>';
    });
    
    // Eventos para avaliação com estrelas
    const estrelas = modal.querySelectorAll('.estrelas-avaliacao .fa-star');
    estrelas.forEach(estrela => {
        estrela.addEventListener('click', function() {
            const avaliacao = parseInt(this.getAttribute('data-avaliacao'));
            avaliarReceita(receita.id, avaliacao);
            
            // Atualiza visual das estrelas
            estrelas.forEach((e, index) => {
                if (index < avaliacao) {
                    e.classList.add('ativa');
                } else {
                    e.classList.remove('ativa');
                }
            });
            
            mostrarFeedback(`Obrigado! Você avaliou esta receita com ${avaliacao} estrela(s)!`, 'success');
        });
        
        estrela.addEventListener('mouseenter', function() {
            const avaliacao = parseInt(this.getAttribute('data-avaliacao'));
            estrelas.forEach((e, index) => {
                if (index < avaliacao) {
                    e.classList.add('hover');
                } else {
                    e.classList.remove('hover');
                }
            });
        });
        
        estrela.addEventListener('mouseleave', function() {
            estrelas.forEach(e => e.classList.remove('hover'));
        });
    });
    
    // Evento para "Fazer depois"
    const btnFazerDepois = modal.querySelector('.botao-fazer-depois');
    btnFazerDepois.addEventListener('click', () => {
        adicionarParaFazerDepois(receita.id);
    });
    
    // Remove o event listener do ESC quando o modal fechar
    modal.addEventListener('modalFechado', () => {
        document.removeEventListener('keydown', fecharComESC);
    });
}

/**
 * Extrai minutos do tempo de preparo
 * @param {string} tempo - String do tempo (ex: "45 min", "2 horas")
 * @returns {number} Minutos totais
 */
function extrairTempoMinutos(tempo) {
    if (tempo.includes('hora')) {
        const horas = parseInt(tempo) || 1;
        return horas * 60;
    } else {
        return parseInt(tempo) || 30;
    }
}

/**
 * Inicia um timer para a receita
 * @param {number} minutos - Minutos para o timer
 * @param {HTMLElement} botao - Botão que iniciou o timer
 */
function iniciarTimer(minutos, botao) {
    let segundosRestantes = minutos * 60;
    const textoOriginal = botao.innerHTML;
    
    botao.disabled = true;
    botao.classList.add('timer-ativo');
    
    const atualizarTimer = () => {
        const minutos = Math.floor(segundosRestantes / 60);
        const segundos = segundosRestantes % 60;
        
        botao.innerHTML = `
            <i class="fas fa-hourglass-half"></i> 
            ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}
        `;
        
        if (segundosRestantes <= 0) {
            clearInterval(intervalo);
            botao.innerHTML = '<i class="fas fa-check"></i> Timer Finalizado!';
            botao.classList.remove('timer-ativo');
            botao.classList.add('timer-finalizado');
            
            // Notificação
            mostrarFeedback('⏰ Timer finalizado! Hora de verificar sua receita!', 'success');
            
            // Recuperar botão após 5 segundos
            setTimeout(() => {
                botao.innerHTML = textoOriginal;
                botao.disabled = false;
                botao.classList.remove('timer-finalizado');
            }, 5000);
        } else {
            segundosRestantes--;
        }
    };
    
    const intervalo = setInterval(actualizarTimer, 1000);
    atualizarTimer(); // Chamada inicial
}

/**
 * Abre modal de comentários
 * @param {object} receita - Objeto da receita
 */
function abrirModalComentarios(receita) {
    // NO FUTURO: Implementar modal de comentários completo
    mostrarFeedback('Sistema de comentários em desenvolvimento!', 'info');
}

/**
 * Avalia uma receita
 * @param {number} idReceita - ID da receita
 * @param {number} avaliacao - Nota de 1 a 5
 */
function avaliarReceita(idReceita, avaliacao) {
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || {};
    avaliacoes[idReceita] = avaliacao;
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
    
    // NO FUTURO: Enviar para o backend
    console.log(`Receita ${idReceita} avaliada com ${avaliacao} estrelas`);
}

/**
 * Adiciona receita à lista "Fazer depois"
 * @param {number} idReceita - ID da receita
 */
function adicionarParaFazerDepois(idReceita) {
    const fazerDepois = JSON.parse(localStorage.getItem('fazerDepois')) || [];
    
    if (!fazerDepois.includes(idReceita)) {
        fazerDepois.push(idReceita);
        localStorage.setItem('fazerDepois', JSON.stringify(fazerDepois));
        mostrarFeedback('Receita adicionada à lista "Fazer depois"!', 'success');
    } else {
        mostrarFeedback('Esta receita já está na sua lista "Fazer depois"!', 'info');
    }
}

/**
 * Registra visualização de receita no histórico
 * @param {number} idReceita - ID da receita
 */
function registrarVisualizacao(idReceita) {
    const agora = new Date().toISOString();
    const visualizacao = {
        idReceita: idReceita,
        data: agora
    };
    
    // Adiciona ao início do array
    appState.historicoVisualizacoes.unshift(visualizacao);
    
    // Mantém apenas as últimas 50 visualizações
    if (appState.historicoVisualizacoes.length > 50) {
        appState.historicoVisualizacoes = appState.historicoVisualizacoes.slice(0, 50);
    }
    
    localStorage.setItem('historicoVisualizacoes', JSON.stringify(appState.historicoVisualizacoes));
}

/**
 * Imprime uma receita
 * @param {object} receita - Objeto da receita
 */
function imprimirReceita(receita) {
    const janelaImpressao = window.open('', '_blank');
    janelaImpressao.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${receita.nome} - Shared Cooking</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #5e1c1c; border-bottom: 2px solid #f0e68c; padding-bottom: 10px; }
                .metadata { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .section { margin: 20px 0; }
                .ingredientes li { margin: 5px 0; }
                .preparo li { margin: 10px 0; line-height: 1.5; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>${receita.nome}</h1>
            <div class="metadata">
                <strong>Categoria:</strong> ${receita.categoria} | 
                <strong>Tempo:</strong> ${receita.tempoPreparo} | 
                <strong>Dificuldade:</strong> ${receita.dificuldade} | 
                <strong>Porções:</strong> ${receita.porcoes}
            </div>
            <div class="section">
                <h2>Ingredientes</h2>
                <ul class="ingredientes">
                    ${receita.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            <div class="section">
                <h2>Modo de Preparo</h2>
                <ol class="preparo">
                    ${receita.modoPreparo.map(passo => `<li>${passo}</li>`).join('')}
                </ol>
            </div>
            <div class="no-print" style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc;">
                <p><em>Receita de Shared Cooking - ${new Date().toLocaleDateString()}</em></p>
            </div>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    janelaImpressao.document.close();
}

// =============================================================================
// 7. CARREGAMENTO E INICIALIZAÇÃO
// =============================================================================

/**
 * Carrega e exibe as receitas em destaque
 */
async function carregarDestaques() {
    if (!elementos.listaDestaques) return;
    
    elementos.listaDestaques.innerHTML = '<div class="carregando">Carregando receitas em destaque...</div>';
    
    try {
        const receitas = await buscarReceitasDestaque();
        appState.receitasDestaque = receitas;
        
        elementos.listaDestaques.innerHTML = '';
        
        if (receitas && receitas.length > 0) {
            receitas.forEach(receita => {
                const cartao = criarCartaoReceita(receita, true);
                elementos.listaDestaques.appendChild(cartao);
            });
        } else {
            elementos.listaDestaques.innerHTML = '<p class="aviso">Nenhuma receita em destaque encontrada esta semana.</p>';
        }
        
    } catch (error) {
        console.error("Erro ao carregar os destaques:", error);
        elementos.listaDestaques.innerHTML = '<p class="erro">Erro ao carregar receitas. Tente novamente mais tarde.</p>';
    }
}

/**
 * Carrega e exibe as receitas recentes
 */
async function carregarRecentes() {
    if (!elementos.listaRecentes) return;
    
    // Aplica o mesmo estilo de lista para receitas recentes
    elementos.listaRecentes.classList.add('lista-destaques');
    
    elementos.listaRecentes.innerHTML = '<div class="carregando">Carregando receitas recentes...</div>';
    
    try {
        const receitas = await buscarReceitasRecentes();
        appState.receitasRecentes = receitas;
        
        elementos.listaRecentes.innerHTML = '';
        
        if (receitas && receitas.length > 0) {
            receitas.forEach(receita => {
                const cartao = criarCartaoReceita(receita, false);
                elementos.listaRecentes.appendChild(cartao);
            });
        } else {
            elementos.listaRecentes.innerHTML = '<p class="aviso">Nenhuma receita recente encontrada.</p>';
        }
        
    } catch (error) {
        console.error("Erro ao carregar receitas recentes:", error);
        elementos.listaRecentes.innerHTML = '<p class="erro">Erro ao carregar receitas recentes.</p>';
    }
}

/**
 * Inicializa todos os componentes da aplicação
 */
function inicializarAplicacao() {
    console.log("Inicializando Shared Cooking...");
    
    // Carrega os dados
    carregarDestaques();
    carregarRecentes();
    
    // Inicializa sistemas
    inicializarBusca();
    
    // Adiciona eventos globais
    adicionarEventosGlobais();
    
    console.log("Aplicação inicializada com sucesso!");
}

/**
 * Adiciona eventos globais da aplicação
 */
function adicionarEventosGlobais() {
    // Evento para o botão "Adicionar Receita"
    if (elementos.botaoAdicionar) {
        elementos.botaoAdicionar.addEventListener('click', () => {
            // NO FUTURO: Redirecionar para página de adicionar receita
            window.location.href = 'telaAdc.html';
        });
    }
    
    // Eventos para ícones de usuário e configurações
    if (elementos.iconePerfil) {
        elementos.iconePerfil.addEventListener('click', () => {
            // NO FUTURO: Abrir menu de perfil ou redirecionar para página de perfil
            console.log("Abrir perfil do usuário");
            mostrarFeedback('Funcionalidade de perfil em desenvolvimento!', 'info');
        });
    }
    
    if (elementos.iconeConfig) {
        elementos.iconeConfig.addEventListener('click', () => {
            // NO FUTURO: Abrir configurações
            console.log("Abrir configurações");
            mostrarFeedback('Configurações em desenvolvimento!', 'info');
        });
    }
}

// =============================================================================
// 8. FUNÇÕES AUXILIARES
// =============================================================================

/**
 * Fecha o modal de detalhes
 * @param {HTMLElement} modal - Elemento do modal
 */
function fecharModal(modal) {
    modal.classList.remove('show');
    
    // Dispara evento personalizado
    modal.dispatchEvent(new CustomEvent('modalFechado'));
    
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
        // Restaura scroll do body
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Atualiza o estado do botão na lista quando alterado no modal
 * @param {number} idReceita - ID da receita
 * @param {string} tipo - Tipo de interação (favorito, curtida)
 * @param {boolean} ativo - Se está ativo ou não
 */
function atualizarBotaoNaLista(idReceita, tipo, ativo) {
    const seletor = tipo === 'favorito' ? '.favoritar-btn' : '.curtir-btn';
    const botaoNaLista = document.querySelector(`.cartao-destaque[data-id="${idReceita}"] ${seletor}, .cartao-recente[data-id="${idReceita}"] ${seletor}`);
    
    if (botaoNaLista) {
        if (ativo) {
            botaoNaLista.classList.add('active');
        } else {
            botaoNaLista.classList.remove('active');
        }
        
        // Atualiza contador (simulação - no backend viria atualizado)
        const contador = botaoNaLista.querySelector('.contador');
        if (contador) {
            let count = parseInt(contador.textContent);
            contador.textContent = ativo ? count + 1 : count - 1;
        }
    }
}

/**
 * Compartilha uma receita
 * @param {object} receita - Objeto da receita
 */
function compartilharReceita(receita) {
    if (navigator.share) {
        // Web Share API (disponível em dispositivos móveis e alguns navegadores)
        navigator.share({
            title: receita.nome,
            text: receita.resumo,
            url: window.location.href // NO FUTURO: URL específica da receita
        })
        .then(() => console.log('Receita compartilhada com sucesso!'))
        .catch(error => console.log('Erro ao compartilhar:', error));
    } else {
        // Fallback: copiar para área de transferência
        const textoCompartilhamento = `${receita.nome}\n\n${receita.resumo}\n\nVeja mais em: ${window.location.href}`;
        
        navigator.clipboard.writeText(textoCompartilhamento)
            .then(() => {
                mostrarFeedback('Link da receita copiado para a área de transferência!', 'success');
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
                mostrarFeedback('Não foi possível copiar o link.', 'error');
            });
    }
}

// =============================================================================
// 9. INICIALIZAÇÃO DA APLICAÇÃO
// =============================================================================

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarAplicacao);

// Exporta funções para uso futuro (quando integrar com módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        buscarReceitasDestaque,
        criarCartaoReceita,
        toggleFavorito,
        toggleCurtida,
        abrirModalDetalhes
    };
}