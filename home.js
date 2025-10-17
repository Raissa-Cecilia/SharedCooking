
// No futuro, esta função faria uma requisição 'fetch' para o seu servidor Node.js
async function buscarReceitasDestaque() {
    console.log("Simulando busca de receitas em destaque...");
    // Simulação dos dados que viriam do seu back-end (MongoDB)
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
            tempoPreparo: "45 min"
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
            tempoPreparo: "30 min"
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
        tempoPreparo: "4 horas"
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
        tempoPreparo: "35 min"
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
        tempoPreparo: "40 min"
    },
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
        tempoPreparo: "25 min"
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
        tempoPreparo: "2 horas (fermentação) + 15 min"
    }

    ];

    // Simula um pequeno atraso de rede
    return new Promise(resolve => setTimeout(() => resolve(receitasDestaque), 500));
}

// -------------------------------------------------------------------
// 2. FUNÇÃO PARA CRIAR E INSERIR O CARTÃO DE DESTAQUE
// -------------------------------------------------------------------

/**
 * Cria o elemento HTML de um cartão de destaque com base nos dados da receita.
 * @param {object} receita - Objeto contendo os detalhes da receita.
 * @returns {HTMLLIElement} O elemento <li> do cartão.
 */
function criarCartaoReceita(receita) {
    // Cria o <li> do cartão
    const li = document.createElement('li');
    li.className = 'cartao-destaque';
    li.setAttribute('data-id', receita.id); // Guardamos o ID para a próxima tela
    
    // Conteúdo do cartão
    li.innerHTML = `
        <div class="cartao-conteudo">
            <div class="foto-receita" style="background-image: url('${receita.fotoUrl}');">
                <span class="nome-receita">${receita.nome}</span>
            </div>
            
            <div class="interacao-container">
                <div class="icones-interacao">
                    <button class="icone-btn favoritar-btn" data-type="favorito">
                        <i class="fas fa-heart"></i>
                        <span>${receita.favoritos}</span>
                    </button>
                    <button class="icone-btn curtir-btn" data-type="curtida">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${receita.curtidas}</span>
                    </button>
                    <button class="icone-btn comentar-btn">
                        <i class="fas fa-comment"></i>
                        <span>${receita.comentarios}</span>
                    </button>
                </div>

                <div class="resumo-receita">
                    <p class="resumo-texto">${receita.resumo}</p>
                    <button class="ver-mais-btn">Ver Detalhes</button>
                </div>
            </div>
        </div>
    `;

    // Adiciona evento ao botão "Ver Detalhes"
    const verMaisBtn = li.querySelector('.ver-mais-btn');
    verMaisBtn.addEventListener('click', () => {
        abrirTelaDetalhes(receita); // Chama a função para a próxima tela
    });

    // Adiciona evento aos botões de interação (curtir/favoritar)
    li.querySelectorAll('.icone-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Impedimos que o clique no botão ative outros eventos
            e.stopPropagation(); 
            // Implementação simples de toggle para favoritos/curtidas
            if (btn.classList.contains('favoritar-btn')) {
                 toggleInteracao(btn, 'favoritou');
            } else if (btn.classList.contains('curtir-btn')) {
                 toggleInteracao(btn, 'curtiu');
            }
            // NO FUTURO: Você enviaria a ação para o seu back-end aqui!
        });
    });

    return li;
}

// -------------------------------------------------------------------
// 3. FUNÇÃO DE INICIALIZAÇÃO E EXIBIÇÃO
// -------------------------------------------------------------------

async function carregarDestaques() {
    const listaDestaques = document.querySelector('.lista-destaques');
    // Limpa os placeholders iniciais do HTML
    listaDestaques.innerHTML = ''; 

    try {
        const receitas = await buscarReceitasDestaque();
        
        if (receitas && receitas.length > 0) {
            receitas.forEach(receita => {
                const cartao = criarCartaoReceita(receita);
                listaDestaques.appendChild(cartao);
            });
        } else {
            listaDestaques.innerHTML = '<p class="aviso">Nenhuma receita em destaque encontrada esta semana.</p>';
        }

    } catch (error) {
        console.error("Erro ao carregar os destaques:", error);
        listaDestaques.innerHTML = '<p class="erro">Erro ao carregar. Tente novamente mais tarde.</p>';
    }
}

// Chama a função principal quando a página carrega
document.addEventListener('DOMContentLoaded', carregarDestaques);


// -------------------------------------------------------------------
// 4. FUNÇÕES DE INTERAÇÃO (Bônus)
// -------------------------------------------------------------------

/**
 * Lida com a funcionalidade de curtir/favoritar (Front-end apenas).
 */
function toggleInteracao(btn, acao) {
    btn.classList.toggle('active');
    let span = btn.querySelector('span');
    let count = parseInt(span.textContent);

    if (btn.classList.contains('active')) {
        span.textContent = count + 1;
        console.log(`Você ${acao} a receita! Novo total: ${count + 1}`);
    } else {
        span.textContent = count - 1;
        console.log(`Você desfez o ${acao}. Novo total: ${count - 1}`);
    }
}

/**
 * Simula a abertura de uma tela de detalhes (pode ser um modal ou nova página).
 */
function abrirTelaDetalhes(receita) {
    console.log(`Abrindo detalhes da receita: ${receita.nome}`);
    
    // --- SIMULAÇÃO DE MODAL (Melhor Opção para o UX) ---
    alert(`
        Detalhes da Receita: ${receita.nome}
        ----------------------------------
        Categoria: ${receita.categoria}
        Tempo de Preparo: ${receita.tempoPreparo}
        
        Ingredientes:
        ${receita.ingredientes.join('\n\t- ')}
        
        Modo de Preparo:
        ${receita.modoPreparo.join('\n\t- ')}
    `);
    
    // NO FUTURO: Você criaria um elemento MODAL (pop-up) com todas estas informações
    // ou redirecionaria para uma página de detalhes, passando o receita.id na URL.
}