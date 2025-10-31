// login.js - Sistema de autenticação e cadastro

// Banco de dados simulado no localStorage
class UserDatabase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('sharedCookingUsers') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }

    saveUsers() {
        localStorage.setItem('sharedCookingUsers', JSON.stringify(this.users));
    }

    findUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    addUser(userData) {
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            username: userData.username,
            password: userData.password, // Em produção, isso deve ser hash!
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    validateLogin(username, password) {
        const user = this.findUserByUsername(username);
        if (user && user.password === password) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Instância global do banco de dados
const userDB = new UserDatabase();

// Funções de validação
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarSenha(senha) {
    return senha.length >= 6;
}

function validarUsuario(usuario) {
    return usuario.length >= 3 && /^[a-zA-Z0-9_]+$/.test(usuario);
}

// Sistema de notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Remover notificação anterior se existir
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

    // Cores baseadas no tipo
    const cores = {
        success: '#51a351',
        error: '#bd362f',
        warning: '#f89406',
        info: '#2f96b4'
    };

    notification.style.backgroundColor = cores[tipo] || cores.info;
    notification.textContent = mensagem;

    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remover após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Funções principais
function acessar() {
    const username = document.getElementById('login').value.trim();
    const password = document.getElementById('senha').value;

    // Validação básica
    if (!username || !password) {
        mostrarNotificacao('Por favor, preencha todos os campos.', 'error');
        return;
    }

    // Tentar login
    const user = userDB.validateLogin(username, password);
    
    if (user) {
        mostrarNotificacao(`Bem-vindo de volta, ${user.name}!`, 'success');
        
        // Redirecionar após breve delay
        setTimeout(() => {
            window.location.href = '../homePage/index.html';
        }, 1500);
    } else {
        mostrarNotificacao('Usuário ou senha incorretos.', 'error');
    }
}

function cadastrar() {
    const name = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('usuario').value.trim();
    const password = document.getElementById('senhaCadastro').value;

    // Validações
    if (!name || !email || !username || !password) {
        mostrarNotificacao('Por favor, preencha todos os campos.', 'error');
        return;
    }

    if (!validarEmail(email)) {
        mostrarNotificacao('Por favor, insira um email válido.', 'error');
        return;
    }

    if (!validarUsuario(username)) {
        mostrarNotificacao('Usuário deve ter pelo menos 3 caracteres e conter apenas letras, números e underline.', 'error');
        return;
    }

    if (!validarSenha(password)) {
        mostrarNotificacao('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }

    // Verificar se usuário ou email já existem
    if (userDB.findUserByUsername(username)) {
        mostrarNotificacao('Este nome de usuário já está em uso.', 'error');
        return;
    }

    if (userDB.findUserByEmail(email)) {
        mostrarNotificacao('Este email já está cadastrado.', 'error');
        return;
    }

    // Criar usuário
    try {
        const newUser = userDB.addUser({ name, email, username, password });
        mostrarNotificacao(`Cadastro realizado com sucesso! Bem-vindo, ${newUser.name}!`, 'success');
        
        // Auto-login e redirecionamento
        userDB.validateLogin(username, password);
        setTimeout(() => {
            window.location.href = '../homePage/index.html';
        }, 2000);
        
    } catch (error) {
        mostrarNotificacao('Erro ao criar conta. Tente novamente.', 'error');
        console.error('Erro no cadastro:', error);
    }
}

// Verificar se usuário já está logado
function verificarLogin() {
    if (userDB.isLoggedIn()) {
        mostrarNotificacao(`Você já está logado como ${userDB.currentUser.name}`, 'info');
        setTimeout(() => {
            window.location.href = '../homePage/index.html';
        }, 2000);
    }
}

// Sistema de recuperação de senha (simulação)
function mostrarRecuperacaoSenha() {
    const email = prompt('Digite seu email para recuperação de senha:');
    if (email && validarEmail(email)) {
        // Simular envio de email
        setTimeout(() => {
            alert('Instruções de recuperação enviadas para seu email (simulação).');
        }, 1000);
    } else if (email) {
        alert('Email inválido.');
    }
}

// Adicionar link de recuperação de senha
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#loginContainer form');
    const recuperacaoLink = document.createElement('p');
    recuperacaoLink.innerHTML = '<a href="#" onclick="mostrarRecuperacaoSenha()">Esqueci minha senha</a>';
    recuperacaoLink.style.marginTop = '10px';
    recuperacaoLink.style.fontSize = '14px';
    
    loginForm.appendChild(recuperacaoLink);
    
    // Verificar login ao carregar a página
    verificarLogin();
});

// Funções de navegação entre telas (mantidas do original)
function mostrarCadastro() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('cadastroContainer').style.display = 'block';
}

function mostrarLogin() {
    document.getElementById('cadastroContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
}

// Logout function para usar em outras páginas
function logout() {
    userDB.logout();
    mostrarNotificacao('Logout realizado com sucesso.', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}