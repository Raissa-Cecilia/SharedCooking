class UserDataBase{
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')||'null' );
    }
    EstaLogado(){
        return this.currentUser !=null;
    }
    getCurrentUser(){
        return this.currentUser;
    }
    naoEstaLogado(){
        return this.currentUser=null;
        localStorage.removeItem('currentUser');
    }
}
// Instancia do Banco de Dados //
const userDB = new  UserDataBase();

//Elementos DOM//
// Elementos do DOM (corrigidos para os IDs reais do HTML)
const elementos = {
    perfilAvatar: document.getElementById('perfilAvatar'),
    perfilNome: document.getElementById('perfilNome'),
    perfilBiografia: document.getElementById('perfilBiografia'),
    perfilNivel: document.getElementById('perfilNivel'),
    listaReceitas: document.getElementById('listaReceitas')
};

// Mapeamento de níveis culinários
const niveisMap = {
    'iniciante': 'Iniciante - Começando na cozinha',
    'intermediario': 'Intermediário - Cozinheiro Doméstico',
    'avancado': 'Avançado - Chef Amador',
    'profissional': 'Profissional - Expert em Culinária'
};

// Função para buscar receitas do usuário do localStorage
function buscarReceitasDoUsuario(userId) {
    // Buscar todas as receitas salvas
    const todasReceitas = JSON.parse(localStorage.getItem('sharedCookingRecipes') || '[]');
    
    // Filtrar apenas as receitas do usuário atual
    return todasReceitas.filter(receita => receita.autorId === userId);
}

// Função para carregar dados do perfil
function carregarPerfilUsuario() {
    // Verificar se o usuário está logado
    if (!userDB.isLoggedIn()) {
        mostrarNotificacao('Você precisa estar logado para ver o perfil.', 'warning');
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 2000);
        return;
    }

    const usuario = userDB.getCurrentUser();
    
    // Buscar dados adicionais das configurações (se existirem)
    const dadosConfiguracao = JSON.parse(localStorage.getItem('userConfig') || '{}');
    
    // Atualizar nome
    if (elementos.perfilNome) {
        elementos.perfilNome.textContent = usuario.name || 'Usuário Shared Cooking';
    }
    
    // Atualizar avatar
    if (elementos.perfilAvatar && dadosConfiguracao.avatar) {
        elementos.perfilAvatar.innerHTML = `<img src="${dadosConfiguracao.avatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }
    
    // Atualizar biografia
    const biografia = dadosConfiguracao.bio || 
        `Olá! Sou ${usuario.name}. Apaixonado(a) por culinária e sempre em busca de novas receitas e experiências gastronômicas para compartilhar com vocês!`;
    
    if (elementos.perfilBiografia) {
        elementos.perfilBiografia.textContent = biografia;
    }
    
    // Atualizar nível culinário
    const nivel = dadosConfiguracao.nivelCulinario || 'intermediario';
    const textoNivel = niveisMap[nivel] || 'Cozinheiro Doméstico';
    
    if (elementos.perfilNivel) {
        elementos.perfilNivel.textContent = textoNivel;
    }
    
    // Atualizar informações no cabeçalho (se tiver ícone de perfil)
    atualizarCabecalho(usuario);
}

// Função para atualizar o cabeçalho com informações do usuário
function atualizarCabecalho(usuario) {
    const iconePerfil = document.querySelector('.icone-perfil');
    if (iconePerfil) {
        iconePerfil.title = `Logado como: ${usuario.name}`;
        iconePerfil.style.cursor = 'pointer';
    }
    
    // Adicionar funcionalidade ao ícone de configurações
    const iconeConfig = document.querySelector('.icone-config');
    if (iconeConfig) {
        iconeConfig.onclick = () => {
            window.location.href = '../configuracoes/config.html';
        };
    }
}

// Criar card de receita
function criarCardReceita(receita) {
    const li = document.createElement('li');
    li.className = 'receita-card';
    
    li.innerHTML = `
        <div class="receita-imagem">
            <img src="${receita.imagem || 'https://via.placeholder.com/300x200/6b2c2c/ffffff?text=' + encodeURIComponent(receita.titulo)}" 
                 alt="${receita.titulo}"
                 onerror="this.src='https://via.placeholder.com/300x200/6b2c2c/ffffff?text=Receita'">
            ${receita.categoria ? `<span class="receita-categoria">${receita.categoria}</span>` : ''}
        </div>
        <div class="receita-conteudo">
            <h3 class="receita-titulo">${receita.titulo}</h3>
            <p class="receita-descricao">${receita.descricao || 'Deliciosa receita caseira!'}</p>
            
            <div class="receita-info">
                ${receita.tempo ? `
                <div class="receita-tempo">
                    <i class="fas fa-clock"></i>
                    <span>${receita.tempo}</span>
                </div>
                ` : ''}
                ${receita.dificuldade ? `
                <div class="receita-dificuldade">
                    <i class="fas fa-signal"></i>
                    <span>${receita.dificuldade}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="receita-stats">
                <span><i class="fas fa-heart"></i> ${receita.curtidas || 0}</span>
                <span><i class="fas fa-eye"></i> ${receita.visualizacoes || 0}</span>
                <span><i class="fas fa-comment"></i> ${receita.comentarios || 0}</span>
            </div>
            
            <div class="receita-acoes">
                <button class="btn-ver" onclick="verReceita('${receita.id}')">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <button class="btn-editar" onclick="editarReceita('${receita.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-excluir" onclick="excluirReceita('${receita.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `;
    
    return li;
}

// Carregar receitas do usuário
function carregarReceitas() {
    if (!elementos.listaReceitas) return;
    
    const usuario = userDB.getCurrentUser();
    if (!usuario) return;
    
    // Buscar receitas do usuário
    const receitasUsuario = buscarReceitasDoUsuario(usuario.id);
    
    // Limpar lista
    elementos.listaReceitas.innerHTML = '';
    
    // Se não houver receitas, mostrar mensagem
    if (receitasUsuario.length === 0) {
        elementos.listaReceitas.innerHTML = `
            <li class="mensagem-vazia">
                <i class="fas fa-utensils" style="font-size: 3rem; color: #6b2c2c; margin-bottom: 1rem;"></i>
                <h3>Nenhuma receita publicada ainda</h3>
                <p>Comece a compartilhar suas receitas deliciosas com a comunidade!</p>
                <button onclick="window.location.href='../telaAdicionarReceita/adc.html'" 
                        style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #6b2c2c; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    <i class="fas fa-plus"></i> Adicionar Primeira Receita
                </button>
            </li>
        `;
        return;
    }
    
    // Adicionar receitas ao grid
    receitasUsuario.forEach(receita => {
        const card = criarCardReceita(receita);
        elementos.listaReceitas.appendChild(card);
    });
    
    console.log(`${receitasUsuario.length} receita(s) carregada(s)`);
}

// Funções de ação nas receitas
function verReceita(id) {
    console.log('Visualizando receita:', id);
    // Redirecionar para página de visualização
    window.location.href = `../visualizar-receita/receita.html?id=${id}`;
}

function editarReceita(id) {
    console.log('Editando receita:', id);
    // Redirecionar para página de edição
    window.location.href = `../telaAdicionarReceita/adc.html?edit=${id}`;
}

function excluirReceita(id) {
    if (!confirm('Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    // Buscar todas as receitas
    let receitas = JSON.parse(localStorage.getItem('sharedCookingRecipes') || '[]');
    
    // Filtrar removendo a receita
    receitas = receitas.filter(r => r.id !== id);
    
    // Salvar de volta
    localStorage.setItem('sharedCookingRecipes', JSON.stringify(receitas));
    
    mostrarNotificacao('Receita excluída com sucesso!', 'success');
    
    // Recarregar lista
    carregarReceitas();
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

// Função de logout
function realizarLogout() {
    if (confirm('Deseja realmente sair?')) {
        userDB.logout();
        mostrarNotificacao('Logout realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 1500);
    }
}

// Sincronizar dados quando houver mudanças
function sincronizarDados() {
    const dadosConfiguracao = JSON.parse(localStorage.getItem('userConfig') || '{}');
    
    if (dadosConfiguracao) {
        carregarPerfilUsuario();
    }
}

// Adicionar botão de logout ao perfil
function adicionarBotaoLogout() {
    const perfilCard = document.querySelector('.perfil-card');
    if (perfilCard && !document.getElementById('btnLogout')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'btnLogout';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair da Conta';
        logoutBtn.style.cssText = `
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: #bd362f;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: background 0.3s;
            width: 100%;
        `;
        logoutBtn.onmouseover = () => logoutBtn.style.background = '#991f1f';
        logoutBtn.onmouseout = () => logoutBtn.style.background = '#bd362f';
        logoutBtn.onclick = realizarLogout;
        
        const perfilInfo = perfilCard.querySelector('.perfil-info');
        if (perfilInfo) {
            perfilInfo.appendChild(logoutBtn);
        }
    }
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando página de perfil...');
    
    // Carregar dados do perfil
    carregarPerfilUsuario();
    
    // Carregar receitas do usuário
    carregarReceitas();
    
    // Adicionar botão de logout
    adicionarBotaoLogout();
    
    // Listener para mudanças no localStorage (sincronização entre abas)
    window.addEventListener('storage', function(e) {
        if (e.key === 'userConfig' || e.key === 'sharedCookingRecipes') {
            sincronizarDados();
            carregarReceitas();
        }
        
        // Se o usuário fizer logout em outra aba
        if (e.key === 'currentUser' && !e.newValue) {
            window.location.href = '../login/login.html';
        }
    });
    
    console.log('Página de perfil carregada com sucesso!');
});

// Tornar funções globais para uso nos botões
window.verReceita = verReceita;
window.editarReceita = editarReceita;
window.excluirReceita = excluirReceita;
window.realizarLogout = realizarLogout;

