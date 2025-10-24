// =============================================================================
// 1. INICIALIZAÇÃO DA APLICAÇÃO
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando página de contato...");
    
    // Inicializa todos os componentes
    inicializarFormulario();
    inicializarBotoesCopiar();
    inicializarFAQ();
    inicializarModal();
    
    console.log("Página de contato inicializada com sucesso!");
});

// =============================================================================
// 2. SISTEMA DE FORMULÁRIO
// =============================================================================

function inicializarFormulario() {
    const formulario = document.getElementById('form-contato');
    const botaoEnviar = document.getElementById('botao-enviar');
    const campoMensagem = document.getElementById('mensagem');
    const contador = document.getElementById('contador');
    
    // Validação em tempo real
    formulario.addEventListener('input', function(e) {
        validarCampoEmTempoReal(e.target);
    });
    
    // Contador de caracteres da mensagem
    campoMensagem.addEventListener('input', function() {
        const caracteres = this.value.length;
        contador.textContent = caracteres;
        
        // Atualiza classes do contador
        contador.parentElement.classList.remove('aviso', 'limite');
        if (caracteres > 800) {
            contador.parentElement.classList.add('aviso');
        }
        if (caracteres > 950) {
            contador.parentElement.classList.add('limite');
        }
    });
    
    // Envio do formulário
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            enviarFormulario();
        }
    });
    
    // Validação ao perder o foco
    formulario.addEventListener('focusout', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            validarCampo(e.target);
        }
    });
}

/**
 * Valida um campo em tempo real
 */
function validarCampoEmTempoReal(campo) {
    const valor = campo.value.trim();
    const campoPai = campo.closest('.campo-form');
    
    // Remove estados anteriores
    campoPai.classList.remove('valido', 'invalido');
    
    // Validação básica - apenas marca como válido se não estiver vazio
    if (valor !== '') {
        campoPai.classList.add('valido');
    }
}

/**
 * Valida um campo específico
 */
function validarCampo(campo) {
    const valor = campo.value.trim();
    const campoPai = campo.closest('.campo-form');
    const mensagemErro = campoPai.querySelector('.mensagem-erro');
    
    // Remove estados anteriores
    campoPai.classList.remove('valido', 'invalido');
    mensagemErro.classList.remove('mostrar');
    mensagemErro.textContent = '';
    
    let valido = true;
    let mensagem = '';
    
    switch(campo.type) {
        case 'text':
            if (valor === '') {
                valido = false;
                mensagem = 'Por favor, preencha seu nome.';
            } else if (valor.length < 2) {
                valido = false;
                mensagem = 'O nome deve ter pelo menos 2 caracteres.';
            }
            break;
            
        case 'email':
            if (valor === '') {
                valido = false;
                mensagem = 'Por favor, preencha seu e-mail.';
            } else if (!validarEmail(valor)) {
                valido = false;
                mensagem = 'Por favor, insira um e-mail válido.';
            }
            break;
            
        case 'select-one':
            if (valor === '') {
                valido = false;
                mensagem = 'Por favor, selecione um assunto.';
            }
            break;
            
        case 'textarea':
            if (valor === '') {
                valido = false;
                mensagem = 'Por favor, preencha sua mensagem.';
            } else if (valor.length < 10) {
                valido = false;
                mensagem = 'A mensagem deve ter pelo menos 10 caracteres.';
            } else if (valor.length > 1000) {
                valido = false;
                mensagem = 'A mensagem deve ter no máximo 1000 caracteres.';
            }
            break;
            
        case 'checkbox':
            if (!campo.checked) {
                valido = false;
                mensagem = 'Você deve concordar com os termos para enviar a mensagem.';
            }
            break;
    }
    
    // Aplica o estado
    if (valido) {
        campoPai.classList.add('valido');
    } else {
        campoPai.classList.add('invalido');
        mensagemErro.textContent = mensagem;
        mensagemErro.classList.add('mostrar');
    }
    
    return valido;
}

/**
 * Valida o e-mail
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida todo o formulário
 */
function validarFormulario() {
    const formulario = document.getElementById('form-contato');
    const campos = formulario.querySelectorAll('input, select, textarea');
    let formularioValido = true;
    
    campos.forEach(campo => {
        if (!validarCampo(campo)) {
            formularioValido = false;
        }
    });
    
    return formularioValido;
}

/**
 * Simula o envio do formulário
 */
function enviarFormulario() {
    const botaoEnviar = document.getElementById('botao-enviar');
    const textoBotao = botaoEnviar.querySelector('.texto-botao');
    const carregandoBotao = botaoEnviar.querySelector('.carregando-botao');
    
    // Desabilita o botão e mostra estado de carregamento
    botaoEnviar.disabled = true;
    textoBotao.style.display = 'none';
    carregandoBotao.style.display = 'flex';
    
    // Simula o envio (no futuro será uma requisição AJAX)
    setTimeout(function() {
        // Mostra modal de sucesso
        mostrarModalConfirmacao();
        
        // Restaura o botão
        botaoEnviar.disabled = false;
        textoBotao.style.display = 'block';
        carregandoBotao.style.display = 'none';
        
        // Limpa o formulário
        document.getElementById('form-contato').reset();
        document.getElementById('contador').textContent = '0';
        
        // Remove estados de validação
        document.querySelectorAll('.campo-form').forEach(campo => {
            campo.classList.remove('valido', 'invalido');
        });
        document.querySelectorAll('.mensagem-erro').forEach(erro => {
            erro.classList.remove('mostrar');
        });
    }, 2000);
}

// =============================================================================
// 3. SISTEMA DE COPIAR INFORMAÇÕES
// =============================================================================

function inicializarBotoesCopiar() {
    const botoesCopiar = document.querySelectorAll('.botao-copiar');
    
    botoesCopiar.forEach(botao => {
        botao.addEventListener('click', function() {
            const texto = this.getAttribute('data-texto');
            copiarParaAreaTransferencia(texto, this);
        });
    });
}

/**
 * Copia texto para a área de transferência
 */
function copiarParaAreaTransferencia(texto, botao) {
    navigator.clipboard.writeText(texto)
        .then(() => {
            // Feedback visual no botão
            const textoOriginal = botao.innerHTML;
            botao.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            botao.classList.add('copiado');
            
            // Feedback global
            mostrarFeedbackCopiado();
            
            // Restaura o botão após 2 segundos
            setTimeout(() => {
                botao.innerHTML = textoOriginal;
                botao.classList.remove('copiado');
            }, 2000);
        })
        .catch(err => {
            console.error('Erro ao copiar: ', err);
            // Fallback para navegadores mais antigos
            copiarFallback(texto, botao);
        });
}

/**
 * Fallback para copiar texto
 */
function copiarFallback(texto, botao) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        
        // Feedback visual no botão
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        botao.classList.add('copiado');
        
        // Feedback global
        mostrarFeedbackCopiado();
        
        // Restaura o botão após 2 segundos
        setTimeout(() => {
            botao.innerHTML = textoOriginal;
            botao.classList.remove('copiado');
        }, 2000);
    } catch (err) {
        console.error('Fallback para copiar falhou: ', err);
        alert('Não foi possível copiar o texto. Por favor, copie manualmente: ' + texto);
    }
    
    document.body.removeChild(textarea);
}

/**
 * Mostra feedback de texto copiado
 */
function mostrarFeedbackCopiado() {
    // Remove feedback anterior se existir
    const feedbackAnterior = document.querySelector('.feedback-copiado');
    if (feedbackAnterior) {
        feedbackAnterior.remove();
    }
    
    // Cria novo feedback
    const feedback = document.createElement('div');
    feedback.className = 'feedback-copiado';
    feedback.innerHTML = '<i class="fas fa-check"></i> Texto copiado para a área de transferência!';
    
    document.body.appendChild(feedback);
    
    // Mostra o feedback
    setTimeout(() => {
        feedback.classList.add('mostrar');
    }, 10);
    
    // Remove após 3 segundos
    setTimeout(() => {
        feedback.classList.remove('mostrar');
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }, 3000);
}

// =============================================================================
// 4. SISTEMA FAQ (PERGUNTAS FREQUENTES)
// =============================================================================

function inicializarFAQ() {
    const botoesPergunta = document.querySelectorAll('.pergunta-toggle');
    
    botoesPergunta.forEach(botao => {
        botao.addEventListener('click', function() {
            const perguntaItem = this.closest('.pergunta-item');
            const resposta = perguntaItem.querySelector('.resposta');
            
            // Fecha outras perguntas abertas (opcional)
            // document.querySelectorAll('.resposta.mostrar').forEach(outraResposta => {
            //     if (outraResposta !== resposta) {
            //         outraResposta.classList.remove('mostrar');
            //         outraResposta.previousElementSibling.classList.remove('ativo');
            //     }
            // });
            
            // Alterna estado atual
            this.classList.toggle('ativo');
            resposta.classList.toggle('mostrar');
        });
    });
}

// =============================================================================
// 5. SISTEMA DE MODAL
// =============================================================================

function inicializarModal() {
    const modal = document.getElementById('modal-confirmacao');
    const botaoFechar = modal.querySelector('.fechar-modal');
    const botaoNovaMensagem = document.getElementById('btn-nova-mensagem');
    const botaoVoltarInicio = document.getElementById('btn-voltar-inicio');
    
    // Fechar modal
    botaoFechar.addEventListener('click', fecharModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            fecharModal();
        }
    });
    
    // Botão "Nova Mensagem"
    botaoNovaMensagem.addEventListener('click', function() {
        fecharModal();
        // Rola para o topo do formulário
        document.querySelector('.formulario-container').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Botão "Voltar ao Início"
    botaoVoltarInicio.addEventListener('click', function() {
        window.location.href = '/index.html';
    });
    
    // Fechar com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('mostrar')) {
            fecharModal();
        }
    });
}

/**
 * Mostra o modal de confirmação
 */
function mostrarModalConfirmacao() {
    const modal = document.getElementById('modal-confirmacao');
    modal.classList.add('mostrar');
    
    // Impede scroll no body
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal
 */
function fecharModal() {
    const modal = document.getElementById('modal-confirmacao');
    modal.classList.remove('mostrar');
    
    // Restaura scroll do body
    document.body.style.overflow = '';
}

// =============================================================================
// 6. FUNÇÕES ADICIONAIS
// =============================================================================

/**
 * Preenche o formulário com dados de exemplo (para testes)
 */
function preencherFormularioExemplo() {
    document.getElementById('nome').value = 'João Silva';
    document.getElementById('email').value = 'joao.silva@exemplo.com';
    document.getElementById('assunto').value = 'sugestao';
    document.getElementById('mensagem').value = 'Gostaria de sugerir a adição de uma categoria para receitas veganas. Acredito que seria muito útil para a comunidade!';
    document.getElementById('termos').checked = true;
    
    // Atualiza contador
    document.getElementById('contador').textContent = document.getElementById('mensagem').value.length;
    
    console.log("Formulário preenchido com dados de exemplo");
}

// Exporta funções para uso futuro (quando integrar com módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validarEmail,
        validarFormulario,
        copiarParaAreaTransferencia
    };
}