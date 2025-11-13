

// =============================================================================
// 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// =============================================================================

const API_BASE_URL = 'http://localhost:3000/api'; // URL do backend

// Estado da aplicação de perfil
const perfilState = {
    usuarioLogado: null,
    receitasUsuario: [],
    carregando: false
};

// Elementos DOM
const elementos = {
    perfilNome: document.getElementById('perfilNome'),
    perfilAvatar: document.getElementById('perfilAvatar'),
    perfilBiografia: document.getElementById('perfilBiografia'),
    perfilNivel: document.getElementById('perfilNivel'),
    receitasGrid: document.querySelector('.receitas-grid')
};

// =============================================================================
// 2. FUNÇÕES DE AUTENTICAÇÃO E VERIFICAÇÃO
// =============================================================================

/**
 * Verifica se o usuário está logado
 * @returns {object|null} Dados do usuário ou null
 */
function verificarUsuarioLogado() {
    const usuarioJSON = localStorage.getItem('usuarioLogado');
    
    if (!usuarioJSON) {
        console.warn('Usuário não está logado');
        redirecionarParaLogin();
        return null;
    }
    
    try {
        const usuario = JSON.parse(usuarioJSON);
        
        if (usuario.token) {
            return usuario;
        } else {
            console.warn('Token inválido ou expirado');
            redirecionarParaLogin();
            return null;
        }
    } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        redirecionarParaLogin();
        return null;
    }
}

/**
 * Redireciona para a página de login
 */
/*
function redirecionarParaLogin() {
    mostrarFeedback('Você precisa estar logado para acessar esta página', 'warning');
    setTimeout(() => {
        window.location.href = '../login/login.html';
    }, 2000);
}
    */

// =============================================================================
// 3. FUNÇÕES DE REQUISIÇÃO À API
// =============================================================================

/**
 * Busca os dados completos do usuário no backend
 * @param {number} userId - ID do usuário
 * @returns {Promise<object>} Dados do usuário
 */
async function buscarDadosUsuario(userId) {
    const usuario = verificarUsuarioLogado();
    
    if (!usuario) return null;
    
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuario.token}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Sessão expirada. Faça login novamente.');
            }
            throw new Error('Erro ao buscar dados do usuário');
        }
        
        const dados = await response.json();
        return dados;
        
    } catch (error) {
        console.error('Erro na requisição de dados do usuário:', error);
        mostrarFeedback('Erro ao carregar dados do perfil', 'error');
        throw error;
    }
}

/**
 * Busca as receitas criadas pelo usuário
 * @param {number} userId - ID do usuário
 * @returns {Promise<array>} Array de receitas
 */
async function buscarReceitasUsuario(userId) {
    const usuario = verificarUsuarioLogado();
    
    if (!usuario) return [];
    
    try {
        const response = await fetch(`${API_BASE_URL}/receitas/usuario/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuario.token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao buscar receitas do usuário');
        }
        
        const receitas = await response.json();
        return receitas;
        
    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
        mostrarFeedback('Erro ao carregar suas receitas', 'error');
        return [];
    }
}

/**
 * Atualiza dados do perfil no backend
 * @param {number} userId - ID do usuário
 * @param {object} dadosAtualizados - Dados a serem atualizados
 * @returns {Promise<boolean>} Sucesso ou falha
 */
async function atualizarPerfilUsuario(userId, dadosAtualizados) {
    const usuario = verificarUsuarioLogado();
    
    if (!usuario) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuario.token}`
            },
            body: JSON.stringify(dadosAtualizados)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao atualizar perfil');
        }
        
        const resultado = await response.json();
        
        // Atualiza dados no localStorage
        const usuarioAtualizado = { ...usuario, ...resultado };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
        
        mostrarFeedback('Perfil atualizado com sucesso!', 'success');
        return true;
        
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        mostrarFeedback('Erro ao atualizar perfil', 'error');
        return false;
    }
}

/**
 * Deleta uma receita do usuário
 * @param {number} receitaId - ID da receita
 * @returns {Promise<boolean>} Sucesso ou falha
 */
async function deletarReceita(receitaId) {
    const usuario = verificarUsuarioLogado();
    
    if (!usuario) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/receitas/${receitaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuario.token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao deletar receita');
        }
        
        mostrarFeedback('Receita deletada com sucesso!', 'success');
        return true;
        
    } catch (error) {
        console.error('Erro ao deletar receita:', error);
        mostrarFeedback('Erro ao deletar receita', 'error');
        return false;
    }
}

// =============================================================================
// 4. FUNÇÕES DE RENDERIZAÇÃO
// =============================================================================

/**
 * Renderiza os dados do perfil do usuário
 * @param {object} dadosUsuario - Dados do usuário
 */
function renderizarPerfilUsuario(dadosUsuario) {
    if (!dadosUsuario) return;
    
    // Atualiza nome
    if (elementos.perfilNome) {
        elementos.perfilNome.textContent = dadosUsuario.nome || 'Usuário Sem Nome';
    }
    
    // Atualiza avatar
    if (elementos.perfilAvatar) {
        if (dadosUsuario.fotoPerfil) {
            elementos.perfilAvatar.innerHTML = `
                <img src="${dadosUsuario.fotoPerfil}" alt="${dadosUsuario.nome}">
            `;
        } else {
            elementos.perfilAvatar.innerHTML = '<i class="fas fa-user-circle"></i>';
        }
    }
    
    // Atualiza biografia
    if (elementos.perfilBiografia) {
        elementos.perfilBiografia.textContent = dadosUsuario.biografia || 
            'Este usuário ainda não adicionou uma biografia.';
    }
    
    // Atualiza nível culinário
    if (elementos.perfilNivel) {
        elementos.perfilNivel.textContent = dadosUsuario.nivelCulinario || 'Iniciante';
    }
    
    // Adiciona botão de editar perfil
    adicionarBotaoEditarPerfil();
}

/**
 * Renderiza as receitas do usuário
 * @param {array} receitas - Array de receitas
 */
function renderizarReceitasUsuario(receitas) {
    if (!elementos.receitasGrid) return;
    
    elementos.receitasGrid.innerHTML = '';
    
    if (!receitas || receitas.length === 0) {
        elementos.receitasGrid.innerHTML = `
            <div class="mensagem-vazia">
                <i class="fas fa-utensils"></i>
                <h2>Nenhuma receita ainda</h2>
                <p>Você ainda não criou nenhuma receita. Comece agora!</p>
            </div>
        `;
        return;
    }
    
    receitas.forEach(receita => {
        const card = criarCardReceita(receita);
        elementos.receitasGrid.appendChild(card);
    });
}

/**
 * Cria um card de receita usando as classes CSS existentes
 * @param {object} receita - Dados da receita
 * @returns {HTMLDivElement} Elemento do card
 */
function criarCardReceita(receita) {
    const card = document.createElement('div');
    card.className = 'receita-card';
    card.setAttribute('data-id', receita.id);
    
    card.innerHTML = `
        <div class="receita-imagem">
            <img src="${receita.fotoUrl || '../imagens/placeholder.jpg'}" alt="${receita.nome}">
            <span class="receita-categoria">${receita.categoria || 'Sem Categoria'}</span>
            <span class="receita-badge">Minha Receita</span>
        </div>
        
        <div class="receita-conteudo">
            <h3 class="receita-titulo">${receita.nome}</h3>
            <p class="receita-descricao">${receita.resumo || 'Sem descrição'}</p>
            
            <div class="receita-stats">
                <span><i class="fas fa-heart"></i> ${receita.favoritos || 0}</span>
                <span><i class="fas fa-thumbs-up"></i> ${receita.curtidas || 0}</span>
                <span><i class="fas fa-comment"></i> ${receita.comentarios || 0}</span>
            </div>
            
            <div class="receita-info">
                <span class="receita-tempo"><i class="fas fa-clock"></i> ${receita.tempoPreparo || 'N/A'}</span>
                <span class="receita-dificuldade"><i class="fas fa-signal"></i> ${receita.dificuldade || 'N/A'}</span>
            </div>
            
            <button class="receita-botao btn-ver-receita" data-id="${receita.id}">
                Ver Opções
            </button>
        </div>
    `;
    
    // Adiciona eventos ao card
    adicionarEventosCardReceita(card, receita);
    
    return card;
}

/**
 * Adiciona eventos aos elementos do card de receita
 * @param {HTMLElement} card - Elemento do card
 * @param {object} receita - Dados da receita
 */
function adicionarEventosCardReceita(card, receita) {
    const btnVer = card.querySelector('.btn-ver-receita');
    btnVer.addEventListener('click', () => {
        abrirOpcoesReceita(receita);
    });
    
    // Evento de clique no card inteiro
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.receita-botao')) {
            abrirOpcoesReceita(receita);
        }
    });
}

/**
 * Abre menu de opções para a receita
 * @param {object} receita - Dados da receita
 */
function abrirOpcoesReceita(receita) {
    const modal = document.createElement('div');
    modal.className = 'modal-opcoes';
    modal.innerHTML = `
        <div class="modal-conteudo-opcoes">
            <button class="fechar-modal">&times;</button>
            <h2>${receita.nome}</h2>
            <div class="opcoes-lista">
                <button class="opcao-btn btn-visualizar" data-id="${receita.id}">
                    <i class="fas fa-eye"></i>
                    <span>Visualizar Receita</span>
                </button>
                <button class="opcao-btn btn-editar" data-id="${receita.id}">
                    <i class="fas fa-edit"></i>
                    <span>Editar Receita</span>
                </button>
                <button class="opcao-btn btn-deletar" data-id="${receita.id}">
                    <i class="fas fa-trash"></i>
                    <span>Deletar Receita</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adiciona eventos
    const btnFechar = modal.querySelector('.fechar-modal');
    const btnVisualizar = modal.querySelector('.btn-visualizar');
    const btnEditar = modal.querySelector('.btn-editar');
    const btnDeletar = modal.querySelector('.btn-deletar');
    
    const fecharModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
        document.body.style.overflow = '';
    };
    
    btnFechar.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });
    
    btnVisualizar.addEventListener('click', () => {
        window.location.href = `../homePage/index.html?receita=${receita.id}`;
    });
    
    btnEditar.addEventListener('click', () => {
        window.location.href = `../telaAdicionarReceita/telaAdc.html?editar=${receita.id}`;
    });
    
    btnDeletar.addEventListener('click', async () => {
        const confirmar = confirm(`Tem certeza que deseja deletar a receita "${receita.nome}"?`);
        
        if (confirmar) {
            const sucesso = await deletarReceita(receita.id);
            
            if (sucesso) {
                fecharModal();
                
                // Remove o card da interface
                const cardElement = document.querySelector(`.receita-card[data-id="${receita.id}"]`);
                if (cardElement) {
                    cardElement.remove();
                }
                
                // Atualiza o estado
                perfilState.receitasUsuario = perfilState.receitasUsuario.filter(
                    r => r.id !== receita.id
                );
                
                // Se não houver mais receitas, exibe mensagem
                if (perfilState.receitasUsuario.length === 0) {
                    renderizarReceitasUsuario([]);
                }
            }
        }
    });
    
    // Animação
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.style.overflow = 'hidden';
}

/**
 * Adiciona botão de editar perfil
 */
function adicionarBotaoEditarPerfil() {
    const perfilHeader = document.querySelector('.perfil-header');
    
    if (!perfilHeader) return;
    
    // Remove botão anterior se existir
    const botaoExistente = perfilHeader.querySelector('.btn-editar-perfil');
    if (botaoExistente) {
        botaoExistente.remove();
    }
    
    const botaoEditar = document.createElement('button');
    botaoEditar.className = 'btn-editar-perfil';
    botaoEditar.innerHTML = '<i class="fas fa-edit"></i> Editar Perfil';
    botaoEditar.addEventListener('click', abrirModalEditarPerfil);
    
    // Insere no cabeçalho
    const nomeContainer = perfilHeader.querySelector('div');
    if (nomeContainer) {
        nomeContainer.appendChild(botaoEditar);
    } else {
        perfilHeader.appendChild(botaoEditar);
    }
}

// =============================================================================
// 5. MODAL DE EDIÇÃO DE PERFIL
// =============================================================================

/**
 * Abre modal para editar perfil
 */
function abrirModalEditarPerfil() {
    const usuario = perfilState.usuarioLogado;
    
    if (!usuario) return;
    
    // Remove modal existente se houver
    const modalExistente = document.querySelector('.modal-editar-perfil');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    // Cria modal
    const modal = document.createElement('div');
    modal.className = 'modal-editar-perfil';
    modal.innerHTML = `
        <div class="modal-conteudo-editar">
            <button class="fechar-modal">&times;</button>
            <h2>Editar Perfil</h2>
            
            <form id="formEditarPerfil" class="form-editar-perfil">
                <div class="form-grupo">
                    <label for="editarNome">Nome:</label>
                    <input type="text" id="editarNome" value="${usuario.nome || ''}" required>
                </div>
                
                <div class="form-grupo">
                    <label for="editarBiografia">Biografia:</label>
                    <textarea id="editarBiografia" rows="4">${usuario.biografia || ''}</textarea>
                </div>
                
                <div class="form-grupo">
                    <label for="editarNivel">Nível Culinário:</label>
                    <select id="editarNivel">
                        <option value="Iniciante" ${usuario.nivelCulinario === 'Iniciante' ? 'selected' : ''}>Iniciante</option>
                        <option value="Intermediário" ${usuario.nivelCulinario === 'Intermediário' ? 'selected' : ''}>Intermediário</option>
                        <option value="Avançado" ${usuario.nivelCulinario === 'Avançado' ? 'selected' : ''}>Avançado</option>
                        <option value="Profissional" ${usuario.nivelCulinario === 'Profissional' ? 'selected' : ''}>Profissional</option>
                    </select>
                </div>
                
                <div class="form-grupo">
                    <label for="editarFoto">URL da Foto de Perfil:</label>
                    <input type="url" id="editarFoto" value="${usuario.fotoPerfil || ''}" placeholder="https://exemplo.com/foto.jpg">
                </div>
                
                <div class="form-acoes">
                    <button type="button" class="btn-cancelar">Cancelar</button>
                    <button type="submit" class="btn-salvar">Salvar Alterações</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adiciona eventos
    adicionarEventosModalEdicao(modal);
    
    // Animação de entrada
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Impede scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Adiciona eventos ao modal de edição
 * @param {HTMLElement} modal - Elemento do modal
 */
function adicionarEventosModalEdicao(modal) {
    const btnFechar = modal.querySelector('.fechar-modal');
    const btnCancelar = modal.querySelector('.btn-cancelar');
    
    const fecharModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    };
    
    btnFechar.addEventListener('click', fecharModal);
    btnCancelar.addEventListener('click', fecharModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });
    
    // Submeter formulário
    const form = modal.querySelector('#formEditarPerfil');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dadosAtualizados = {
            nome: document.getElementById('editarNome').value,
            biografia: document.getElementById('editarBiografia').value,
            nivelCulinario: document.getElementById('editarNivel').value,
            fotoPerfil: document.getElementById('editarFoto').value
        };
        
        const sucesso = await atualizarPerfilUsuario(perfilState.usuarioLogado.id, dadosAtualizados);
        
        if (sucesso) {
            // Atualiza estado local
            perfilState.usuarioLogado = { ...perfilState.usuarioLogado, ...dadosAtualizados };
            
            // Re-renderiza perfil
            renderizarPerfilUsuario(perfilState.usuarioLogado);
            
            // Fecha modal
            fecharModal();
        }
    });
}

// =============================================================================
// 6. FUNÇÕES DE FEEDBACK
// =============================================================================

/**
 * Exibe feedback visual para o usuário
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo de feedback (success, error, info, warning)
 */
function mostrarFeedback(mensagem, tipo = 'info') {
    const feedbackAnterior = document.querySelector('.feedback-mensagem');
    if (feedbackAnterior) {
        feedbackAnterior.remove();
    }
    
    let icone = 'info';
    if (tipo === 'success') icone = 'check';
    else if (tipo === 'error') icone = 'exclamation-triangle';
    else if (tipo === 'warning') icone = 'exclamation';
    
    const feedback = document.createElement('div');
    feedback.className = `feedback-mensagem ${tipo}`;
    feedback.innerHTML = `
        <div class="feedback-conteudo">
            <i class="fas fa-${icone}-circle"></i>
            <span>${mensagem}</span>
        </div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.classList.add('show'), 10);
    
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }, 3000);
}

// =============================================================================
// 7. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// =============================================================================

/**
 * Carrega todos os dados do perfil
 */
async function carregarPerfil() {
    const usuario = verificarUsuarioLogado();
    
    if (!usuario) return;
    
    perfilState.usuarioLogado = usuario;
    perfilState.carregando = true;
    
    try {
        const dadosUsuario = await buscarDadosUsuario(usuario.id);
        
        if (dadosUsuario) {
            perfilState.usuarioLogado = { ...usuario, ...dadosUsuario };
            renderizarPerfilUsuario(perfilState.usuarioLogado);
        }
        
        const receitas = await buscarReceitasUsuario(usuario.id);
        perfilState.receitasUsuario = receitas;
        renderizarReceitasUsuario(receitas);
        
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        mostrarFeedback('Erro ao carregar dados do perfil', 'error');
    } finally {
        perfilState.carregando = false;
    }
}

/**
 * Inicializa a página de perfil
 */
function inicializarPerfil() {
    console.log('Inicializando página de perfil...');
    carregarPerfil();
    console.log('Página de perfil inicializada!');
}

// =============================================================================
// 8. INICIALIZAÇÃO AUTOMÁTICA
// =============================================================================

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarPerfil);