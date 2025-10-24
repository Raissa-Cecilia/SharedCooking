// Dados simulados do usuário para uma rede social de receitas
        let usuario = {
            nome: "ChefAmador",
            email: "chef@exemplo.com",
            bio: "Apaixonado por culinária caseira! Especialista em massas e sobremesas brasileiras.",
            avatar: null,
            nivelCulinario: "intermediario",
            culinarias: ["brasileira", "italiana", "sobremesas"],
            receberNovidades: true,
            perfilPublico: true,
            notificacoesComentarios: true,
            // Novas configurações gerais
            idioma: "pt-br",
            tema: "claro",
            privacidadePerfil: false,
            notificacoesEmail: true,
            comentariosModerados: false,
            estatisticas: {
                receitas: 12,
                curtidas: 156,
                seguidores: 89,
                comentarios: 47
            }
        };

        // Elementos da interface
        const elementos = {
            // Perfil
            nomeUsuario: document.getElementById('nomeUsuario'),
            bioUsuario: document.getElementById('bioUsuario'),
            nivelCulinario: document.getElementById('nivelCulinario'),
            
            // Preferências
            culinarias: document.querySelectorAll('input[type="checkbox"]'),
            receberNovidades: document.getElementById('receberNovidades'),
            perfilPublico: document.getElementById('perfilPublico'),
            notificacoesComentarios: document.getElementById('notificacoesComentarios'),
            
            // Configurações Gerais
            idiomaSite: document.getElementById('idiomaSite'),
            temaSite: document.getElementById('temaSite'),
            emailAtual: document.getElementById('emailAtual'),
            novoEmail: document.getElementById('novoEmail'),
            senhaConfirmarEmail: document.getElementById('senhaConfirmarEmail'),
            senhaAtual: document.getElementById('senhaAtual'),
            novaSenha: document.getElementById('novaSenha'),
            confirmarSenha: document.getElementById('confirmarSenha'),
            privacidadePerfil: document.getElementById('privacidadePerfil'),
            notificacoesEmail: document.getElementById('notificacoesEmail'),
            comentariosModerados: document.getElementById('comentariosModerados'),
            alterarEmailBtn: document.getElementById('alterarEmailBtn'),
            alterarSenhaBtn: document.getElementById('alterarSenhaBtn'),
            camposEmail: document.getElementById('camposEmail'),
            camposSenha: document.getElementById('camposSenha'),
            
            // Avatar
            avatarInput: document.getElementById('avatarInput'),
            avatarPreview: document.getElementById('avatarPreview'),
            removerAvatar: document.getElementById('removerAvatar'),
            
            // Estatísticas
            totalReceitas: document.getElementById('totalReceitas'),
            totalCurtidas: document.getElementById('totalCurtidas'),
            totalSeguidores: document.getElementById('totalSeguidores'),
            totalComentarios: document.getElementById('totalComentarios'),
            
            // Botões
            salvarBtn: document.getElementById('salvarBtn'),
            cancelarBtn: document.getElementById('cancelarBtn'),
            exportarDadosBtn: document.getElementById('exportarDadosBtn'),
            excluirContaBtn: document.getElementById('excluirContaBtn'),
            
            // Modal
            modalExcluirConta: document.getElementById('modalExcluirConta'),
            cancelarExclusaoBtn: document.getElementById('cancelarExclusaoBtn'),
            confirmarExclusaoBtn: document.getElementById('confirmarExclusaoBtn'),
            confirmacaoExclusao: document.getElementById('confirmacaoExclusao'),
            
            // Mensagens
            mensagemStatus: document.getElementById('mensagemStatus')
        };

        // Carregar dados do usuário na interface
        function carregarDadosUsuario() {
            // Perfil básico
            elementos.nomeUsuario.value = usuario.nome;
            elementos.bioUsuario.value = usuario.bio;
            elementos.nivelCulinario.value = usuario.nivelCulinario;
            elementos.emailAtual.value = usuario.email;
            
            // Preferências
            elementos.receberNovidades.checked = usuario.receberNovidades;
            elementos.perfilPublico.checked = usuario.perfilPublico;
            elementos.notificacoesComentarios.checked = usuario.notificacoesComentarios;
            
            // Configurações Gerais
            elementos.idiomaSite.value = usuario.idioma;
            elementos.temaSite.value = usuario.tema;
            elementos.privacidadePerfil.checked = usuario.privacidadePerfil;
            elementos.notificacoesEmail.checked = usuario.notificacoesEmail;
            elementos.comentariosModerados.checked = usuario.comentariosModerados;
            
            // Culinárias
            elementos.culinarias.forEach(checkbox => {
                checkbox.checked = usuario.culinarias.includes(checkbox.value);
            });
            
            // Estatísticas
            elementos.totalReceitas.textContent = usuario.estatisticas.receitas;
            elementos.totalCurtidas.textContent = usuario.estatisticas.curtidas;
            elementos.totalSeguidores.textContent = usuario.estatisticas.seguidores;
            elementos.totalComentarios.textContent = usuario.estatisticas.comentarios;
            
            // Avatar
            if (usuario.avatar) {
                elementos.avatarPreview.innerHTML = `<img src="${usuario.avatar}" alt="Avatar do usuário">`;
            }
        }

        // Exibir mensagem de status
        function exibirMensagem(texto, tipo) {
            elementos.mensagemStatus.textContent = texto;
            elementos.mensagemStatus.className = `mensagem-status mensagem-${tipo}`;
            elementos.mensagemStatus.style.display = 'block';
            
            setTimeout(() => {
                elementos.mensagemStatus.style.display = 'none';
            }, 5000);
        }

        // Validar alteração de senha
        function validarSenha() {
            if (elementos.novaSenha.value && elementos.novaSenha.value !== elementos.confirmarSenha.value) {
                exibirMensagem("As senhas não coincidem!", "erro");
                return false;
            }
            
            if (elementos.novaSenha.value && elementos.novaSenha.value.length < 6) {
                exibirMensagem("A senha deve ter pelo menos 6 caracteres!", "erro");
                return false;
            }
            
            return true;
        }

        // Validar alteração de e-mail
        function validarEmail() {
            if (elementos.novoEmail.value && !validarFormatoEmail(elementos.novoEmail.value)) {
                exibirMensagem("Por favor, insira um e-mail válido!", "erro");
                return false;
            }
            
            return true;
        }

        // Função para validar formato de e-mail
        function validarFormatoEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Salvar configurações
        function salvarConfiguracoes() {
            if (!validarSenha() || !validarEmail()) {
                return;
            }
            
            // Atualizar dados do usuário
            usuario.nome = elementos.nomeUsuario.value;
            usuario.bio = elementos.bioUsuario.value;
            usuario.nivelCulinario = elementos.nivelCulinario.value;
            
            // Atualizar preferências
            usuario.receberNovidades = elementos.receberNovidades.checked;
            usuario.perfilPublico = elementos.perfilPublico.checked;
            usuario.notificacoesComentarios = elementos.notificacoesComentarios.checked;
            
            // Atualizar configurações gerais
            usuario.idioma = elementos.idiomaSite.value;
            usuario.tema = elementos.temaSite.value;
            usuario.privacidadePerfil = elementos.privacidadePerfil.checked;
            usuario.notificacoesEmail = elementos.notificacoesEmail.checked;
            usuario.comentariosModerados = elementos.comentariosModerados.checked;
            
            // Atualizar e-mail se fornecido
            if (elementos.novoEmail.value) {
                usuario.email = elementos.novoEmail.value;
                elementos.emailAtual.value = usuario.email;
                elementos.novoEmail.value = "";
                elementos.senhaConfirmarEmail.value = "";
                elementos.camposEmail.classList.add('hidden');
            }
            
            // Atualizar senha se fornecida
            if (elementos.novaSenha.value) {
                elementos.novaSenha.value = "";
                elementos.confirmarSenha.value = "";
                elementos.camposSenha.classList.add('hidden');
            }
            
            // Atualizar culinárias
            usuario.culinarias = [];
            elementos.culinarias.forEach(checkbox => {
                if (checkbox.checked) {
                    usuario.culinarias.push(checkbox.value);
                }
            });
            
            // Simular salvamento no backend
            setTimeout(() => {
                exibirMensagem("Configurações salvas com sucesso!", "sucesso");
                console.log("Dados atualizados:", usuario);
                
                // Aplicar tema se alterado
                aplicarTema(usuario.tema);
            }, 1000);
        }

        // Aplicar tema selecionado
        function aplicarTema(tema) {
            if (tema === 'escuro') {
                document.body.style.backgroundColor = '#1a1a1a';
                document.body.style.color = '#ffffff';
            } else if (tema === 'claro') {
                document.body.style.backgroundColor = '#5e1c1c';
                document.body.style.color = '#ffffff';
            }
            // Para 'auto' manteríamos as cores padrão
        }

        // Exportar dados
        function exportarDados() {
            const dadosExportacao = {
                usuario: usuario.nome,
                email: usuario.email,
                bio: usuario.bio,
                estatisticas: usuario.estatisticas,
                configuracoes: {
                    idioma: usuario.idioma,
                    tema: usuario.tema,
                    privacidade: usuario.privacidadePerfil
                },
                dataExportacao: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(dadosExportacao, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shared-cooking-dados-${usuario.nome}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            exibirMensagem("Dados exportados com sucesso!", "sucesso");
        }

        // Excluir conta
        function excluirConta() {
            setTimeout(() => {
                exibirMensagem("Conta excluída com sucesso!", "sucesso");
                elementos.modalExcluirConta.style.display = 'none';
                
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            }, 1000);
        }

        // Upload de avatar
        function fazerUploadAvatar(arquivo) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                usuario.avatar = e.target.result;
                elementos.avatarPreview.innerHTML = `<img src="${e.target.result}" alt="Avatar do usuário">`;
                exibirMensagem("Avatar atualizado com sucesso!", "sucesso");
            };
            
            reader.readAsDataURL(arquivo);
        }

        // Remover avatar
        function removerAvatar() {
            usuario.avatar = null;
            elementos.avatarPreview.innerHTML = '<i class="fas fa-user-circle icone-padrao"></i>';
            exibirMensagem("Avatar removido com sucesso!", "sucesso");
        }

        // Toggle campos de e-mail
        function toggleCamposEmail() {
            elementos.camposEmail.classList.toggle('hidden');
            if (!elementos.camposEmail.classList.contains('hidden')) {
                elementos.novoEmail.focus();
            }
        }

        // Toggle campos de senha
        function toggleCamposSenha() {
            elementos.camposSenha.classList.toggle('hidden');
            if (!elementos.camposSenha.classList.contains('hidden')) {
                elementos.novaSenha.focus();
            }
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
            carregarDadosUsuario();
            
            elementos.salvarBtn.addEventListener('click', salvarConfiguracoes);
            elementos.cancelarBtn.addEventListener('click', () => {
                window.location.href = "index.html";
            });
            elementos.exportarDadosBtn.addEventListener('click', exportarDados);
            
            elementos.avatarInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    fazerUploadAvatar(e.target.files[0]);
                }
            });
            
            elementos.removerAvatar.addEventListener('click', removerAvatar);
            
            elementos.alterarEmailBtn.addEventListener('click', toggleCamposEmail);
            elementos.alterarSenhaBtn.addEventListener('click', toggleCamposSenha);
            
            elementos.excluirContaBtn.addEventListener('click', () => {
                elementos.modalExcluirConta.style.display = 'flex';
            });
            
            elementos.cancelarExclusaoBtn.addEventListener('click', () => {
                elementos.modalExcluirConta.style.display = 'none';
                elementos.confirmacaoExclusao.value = "";
                elementos.confirmarExclusaoBtn.disabled = true;
            });
            
            elementos.confirmarExclusaoBtn.addEventListener('click', excluirConta);
            
            elementos.confirmacaoExclusao.addEventListener('input', (e) => {
                elementos.confirmarExclusaoBtn.disabled = e.target.value !== "EXCLUIR";
            });
            
            elementos.modalExcluirConta.addEventListener('click', (e) => {
                if (e.target === elementos.modalExcluirConta) {
                    elementos.modalExcluirConta.style.display = 'none';
                    elementos.confirmacaoExclusao.value = "";
                    elementos.confirmarExclusaoBtn.disabled = true;
                }
            });
        });