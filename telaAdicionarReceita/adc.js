// adc.jss - Funcionalidades JavaScript para o site de receitas

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const form = document.getElementById('adicionar-receita-form');
    const uploadArea = document.querySelector('.upload-area');
    const uploadInput = document.getElementById('uploadMidia');
    const ingredientesInput = document.getElementById('ingredientes');
    const categoriasInput = document.getElementById('categorias');
    const modoPreparoInput = document.getElementById('modoPreparo');
    const tempoPreparoInput = document.getElementById('tempoPreparo');
    const categoriasSelecionadas = document.getElementById('categorias-selecionadas');
    
    // Arrays para armazenar dados
    let ingredientes = [];
    let categorias = [];
    let passosPreparo = [];
    let arquivosMidia = [];
    
    // Limites de upload
    const MAX_FOTOS = 10;
    const MAX_VIDEOS = 4;
    const MAX_DURACAO_VIDEO = 300; // 5 minutos em segundos
    
    // Categorias disponíveis
    const categoriasDisponiveis = [
        "BRASILEIRA", "VEGANA", "ITALIANA", "JAPONESA", "SOBREMESAS", 
        "LANCHES", "AÇAÍ", "MEXICANA", "AFRICANA", "SOPAS E CALDOS",
        "BEBIDAS", "PÃES E BISCOITOS", "TAILANDESA", "CHINESA", "OUTROS"
        
    ];
    
    // ========== FUNCIONALIDADE DE UPLOAD DE MÍDIA ==========
    uploadArea.addEventListener('click', function() {
        uploadInput.click();
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#5e1c1c';
        uploadArea.style.backgroundColor = '#f5f5f5';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = '#a0a0a0';
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#a0a0a0';
        uploadArea.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length) {
            const novosArquivos = Array.from(e.dataTransfer.files);
            processarArquivos(novosArquivos);
        }
    });
    
    uploadInput.addEventListener('change', function() {
        if (this.files.length) {
            const novosArquivos = Array.from(this.files);
            processarArquivos(novosArquivos);
        }
    });
    
    function processarArquivos(arquivos) {
        arquivos.forEach(arquivo => {
            // Verificar se já atingiu os limites
            const fotosAtuais = arquivosMidia.filter(f => f.type.startsWith('image/')).length;
            const videosAtuais = arquivosMidia.filter(f => f.type.startsWith('video/')).length;
            
            if (arquivo.type.startsWith('image/') && fotosAtuais >= MAX_FOTOS) {
                alert(`Limite de ${MAX_FOTOS} fotos atingido. Não é possível adicionar mais fotos.`);
                return;
            }
            
            if (arquivo.type.startsWith('video/') && videosAtuais >= MAX_VIDEOS) {
                alert(`Limite de ${MAX_VIDEOS} vídeos atingido. Não é possível adicionar mais vídeos.`);
                return;
            }
            
            // Verificar tipo de arquivo
            const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov', 'video/webm'];
            
            if (!tiposPermitidos.includes(arquivo.type)) {
                alert(`Tipo de arquivo não suportado: ${arquivo.name}. Use imagens (JPEG, PNG, GIF) ou vídeos (MP4, AVI, MOV, WebM).`);
                return;
            }
            
            // Verificar tamanho do arquivo (limite de 50MB para vídeos, 5MB para imagens)
            const tamanhoMaximo = arquivo.type.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
            if (arquivo.size > tamanhoMaximo) {
                const tipo = arquivo.type.startsWith('video/') ? 'vídeo' : 'imagem';
                alert(`Arquivo muito grande: ${arquivo.name}. O tamanho máximo para ${tipo} é ${tamanhoMaximo / (1024 * 1024)}MB.`);
                return;
            }
            
            // Para vídeos, verificar duração
            if (arquivo.type.startsWith('video/')) {
                verificarDuracaoVideo(arquivo).then(duracao => {
                    if (duracao > MAX_DURACAO_VIDEO) {
                        alert(`Vídeo muito longo: ${arquivo.name}. A duração máxima permitida é 5 minutos.`);
                    } else {
                        adicionarArquivo(arquivo, duracao);
                    }
                }).catch(error => {
                    console.error('Erro ao verificar duração do vídeo:', error);
                    adicionarArquivo(arquivo); // Adiciona mesmo sem verificar duração
                });
            } else {
                adicionarArquivo(arquivo);
            }
        });
    }
    
    function verificarDuracaoVideo(arquivoVideo) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            video.onloadedmetadata = function() {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            
            video.onerror = function() {
                reject(new Error('Não foi possível carregar o vídeo'));
            };
            
            video.src = URL.createObjectURL(arquivoVideo);
        });
    }
    
    function adicionarArquivo(arquivo, duracaoVideo = null) {
        // Verificar se o arquivo já foi adicionado
        if (arquivosMidia.some(f => f.name === arquivo.name && f.size === arquivo.size)) {
            alert(`O arquivo ${arquivo.name} já foi adicionado.`);
            return;
        }
        
        // Adicionar informações extras ao arquivo
        arquivo.duracao = duracaoVideo;
        arquivosMidia.push(arquivo);
        
        atualizarInterfaceUpload();
    }
    
    function atualizarInterfaceUpload() {
        const label = uploadArea.querySelector('.upload-label');
        const fotos = arquivosMidia.filter(f => f.type.startsWith('image/'));
        const videos = arquivosMidia.filter(f => f.type.startsWith('video/'));
        
        // Limpar previews antigos
        const previewsAntigos = uploadArea.querySelectorAll('.preview-container, .resumo-upload');
        previewsAntigos.forEach(preview => preview.remove());
        
        // Criar resumo do upload
        const resumo = document.createElement('div');
        resumo.className = 'resumo-upload';
        resumo.innerHTML = `
            <div style="margin-top: 10px; font-size: 14px; color: #666;">
                <strong>Arquivos selecionados:</strong><br>
                📸 Fotos: ${fotos.length}/${MAX_FOTOS}<br>
                🎥 Vídeos: ${videos.length}/${MAX_VIDEOS}
            </div>
        `;
        uploadArea.appendChild(resumo);
        
        // Atualizar label
        label.innerHTML = `
            <i class="fas fa-camera"></i>
            <span>Arraste e solte ou clique para adicionar mídia</span>
            <small>Máximo: ${MAX_FOTOS} fotos e ${MAX_VIDEOS} vídeos (até 5min cada)</small>
        `;
        
        // Criar container para previews
        const previewsContainer = document.createElement('div');
        previewsContainer.className = 'previews-container';
        previewsContainer.style.marginTop = '15px';
        previewsContainer.style.display = 'flex';
        previewsContainer.style.flexWrap = 'wrap';
        previewsContainer.style.gap = '10px';
        
        // Adicionar previews para cada arquivo
        arquivosMidia.forEach((arquivo, index) => {
            const previewContainer = document.createElement('div');
            previewContainer.className = 'preview-container';
            previewContainer.style.position = 'relative';
            previewContainer.style.width = '100px';
            previewContainer.style.height = '100px';
            previewContainer.style.border = '1px solid #ddd';
            previewContainer.style.borderRadius = '5px';
            previewContainer.style.overflow = 'hidden';
            
            if (arquivo.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(arquivo);
            } else {
                previewContainer.innerHTML = `
                    <div style="width:100%; height:100%; background:#f0f0f0; display:flex; align-items:center; justify-content:center; flex-direction:column;">
                        <i class="fas fa-video" style="font-size:24px; color:#666;"></i>
                        <small style="font-size:10px; text-align:center; padding:5px;">${formatarDuracao(arquivo.duracao)}</small>
                    </div>
                `;
            }
            
            // Botão para remover arquivo
            const btnRemover = document.createElement('button');
            btnRemover.innerHTML = '×';
            btnRemover.style.position = 'absolute';
            btnRemover.style.top = '2px';
            btnRemover.style.right = '2px';
            btnRemover.style.background = 'rgba(255,0,0,0.7)';
            btnRemover.style.color = 'white';
            btnRemover.style.border = 'none';
            btnRemover.style.borderRadius = '50%';
            btnRemover.style.width = '20px';
            btnRemover.style.height = '20px';
            btnRemover.style.cursor = 'pointer';
            btnRemover.style.fontSize = '14px';
            btnRemover.style.lineHeight = '1';
            
            btnRemover.addEventListener('click', function(e) {
                e.stopPropagation();
                arquivosMidia.splice(index, 1);
                atualizarInterfaceUpload();
            });
            
            previewContainer.appendChild(btnRemover);
            previewsContainer.appendChild(previewContainer);
        });
        
        uploadArea.appendChild(previewsContainer);
    }
    
    function formatarDuracao(segundos) {
        if (!segundos) return 'N/A';
        const minutos = Math.floor(segundos / 60);
        const segs = Math.floor(segundos % 60);
        return `${minutos}:${segs.toString().padStart(2, '0')}`;
    }
    
    // ========== FUNCIONALIDADE DE CATEGORIAS ==========
    // Criar datalist para categorias
    const datalist = document.createElement('datalist');
    datalist.id = 'categorias-sugestoes';
    
    categoriasDisponiveis.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        datalist.appendChild(option);
    });
    
    document.body.appendChild(datalist);
    categoriasInput.setAttribute('list', 'categorias-sugestoes');
    
    // Adicionar categoria ao clicar no botão +
    document.querySelectorAll('.add-button').forEach((botao, index) => {
        botao.addEventListener('click', function() {
            const input = this.previousElementSibling;
            
            switch(index) {
                case 0: // Ingredientes
                    adicionarIngrediente(input);
                    break;
                case 1: // Categorias
                    adicionarCategoria(input);
                    break;
                case 2: // Modo de preparo
                    adicionarPassoPreparo(input);
                    break;
                case 3: // Tempo de preparo
                    // Para tempo, apenas validamos e usamos o valor diretamente
                    if (input.value.trim()) {
                        input.style.borderColor = '#4CAF50';
                    }
                    break;
            }
        });
    });
    
    // Permitir adicionar categoria com Enter
    categoriasInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            adicionarCategoria(this);
        }
    });
    
    function adicionarCategoria(input) {
        const categoria = input.value.trim();
        
        if (categoria && !categorias.includes(categoria)) {
            categorias.push(categoria);
            
            // Criar elemento de categoria
            const categoriaElement = document.createElement('div');
            categoriaElement.className = 'categoria-item';
            categoriaElement.innerHTML = `
                ${categoria}
                <span class="remover-categoria">×</span>
            `;
            
            // Adicionar evento de remoção
            categoriaElement.querySelector('.remover-categoria').addEventListener('click', function() {
                const index = categorias.indexOf(categoria);
                if (index > -1) {
                    categorias.splice(index, 1);
                }
                categoriaElement.remove();
            });
            
            categoriasSelecionadas.appendChild(categoriaElement);
            input.value = '';
        } else if (categorias.includes(categoria)) {
            alert('Esta categoria já foi adicionada!');
        }
    }
    
    // ========== FUNCIONALIDADE DE INGREDIENTES ==========
    ingredientesInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            adicionarIngrediente(this);
        }
    });
    
    function adicionarIngrediente(input) {
        const ingrediente = input.value.trim();
        
        if (ingrediente && !ingredientes.includes(ingrediente)) {
            ingredientes.push(ingrediente);
            
            // Criar elemento de ingrediente
            const ingredienteElement = document.createElement('div');
            ingredienteElement.className = 'ingrediente-item';
            ingredienteElement.innerHTML = `
                ${ingrediente}
                <span class="remover-ingrediente">×</span>
            `;
            
            // Adicionar evento de remoção
            ingredienteElement.querySelector('.remover-ingrediente').addEventListener('click', function() {
                const index = ingredientes.indexOf(ingrediente);
                if (index > -1) {
                    ingredientes.splice(index, 1);
                }
                ingredienteElement.remove();
            });
            
            // Adicionar após o campo de ingredientes
            const campoGrupo = input.closest('.campo-grupo');
            campoGrupo.appendChild(ingredienteElement);
            input.value = '';
        } else if (ingredientes.includes(ingrediente)) {
            alert('Este ingrediente já foi adicionado!');
        }
    }
    
    // ========== FUNCIONALIDADE DE MODO DE PREPARO ==========
    modoPreparoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            adicionarPassoPreparo(this);
        }
    });
    
    function adicionarPassoPreparo(input) {
        const passo = input.value.trim();
        
        if (passo) {
            passosPreparo.push(passo);
            
            // Criar elemento de passo
            const passoElement = document.createElement('div');
            passoElement.className = 'passo-item';
            passoElement.innerHTML = `
                <span class="numero-passo">${passosPreparo.length}.</span>
                ${passo}
                <span class="remover-passo">×</span>
            `;
            
            // Adicionar evento de remoção
            passoElement.querySelector('.remover-passo').addEventListener('click', function() {
                const index = passosPreparo.indexOf(passo);
                if (index > -1) {
                    passosPreparo.splice(index, 1);
                    // Reorganizar números dos passos
                    reorganizarPassos();
                }
                passoElement.remove();
            });
            
            // Adicionar após o campo de modo de preparo
            const campoGrupo = input.closest('.campo-grupo');
            campoGrupo.appendChild(passoElement);
            input.value = '';
        }
    }
    
    function reorganizarPassos() {
        const passosElementos = document.querySelectorAll('.passo-item');
        passosElementos.forEach((elemento, index) => {
            elemento.querySelector('.numero-passo').textContent = `${index + 1}.`;
        });
    }
    
    // ========== VALIDAÇÃO E ENVIO DO FORMULÁRIO ==========
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos obrigatórios
        const nomeReceita = document.getElementById('nomeReceita').value.trim();
        const descricaoReceita = document.getElementById('descricaoReceita').value.trim();
        const tempoPreparo = tempoPreparoInput.value.trim();
        
        if (!nomeReceita) {
            alert('Por favor, insira um nome para a receita.');
            return;
        }
        
        if (!descricaoReceita) {
            alert('Por favor, adicione uma descrição para a receita.');
            return;
        }
        
        if (ingredientes.length === 0) {
            alert('Por favor, adicione pelo menos um ingrediente.');
            return;
        }
        
        if (passosPreparo.length === 0) {
            alert('Por favor, adicione pelo menos um passo de preparo.');
            return;
        }
        
        if (!tempoPreparo) {
            alert('Por favor, informe o tempo de preparo.');
            return;
        }
        
        if (categorias.length === 0) {
            alert('Por favor, adicione pelo menos uma categoria.');
            return;
        }
        
        // Criar objeto da receita
        const receita = {
            nome: nomeReceita,
            descricao: descricaoReceita,
            ingredientes: ingredientes,
            modoPreparo: passosPreparo,
            tempoPreparo: tempoPreparo,
            categorias: categorias,
            midia: arquivosMidia.map(f => ({
                nome: f.name,
                tipo: f.type,
                tamanho: f.size,
                duracao: f.duracao || null
            })),
            dataCriacao: new Date().toISOString()
        };
        
        // Aqui você enviaria os dados para o backend
        salvarReceita(receita);
    });
    
    function salvarReceita(receita) {
        // Simular envio para backend
        console.log('Receita a ser salva:', receita);
        
        // Mostrar loading
        const botaoSalvar = document.querySelector('.botao-salvar');
        const textoOriginal = botaoSalvar.textContent;
        botaoSalvar.textContent = 'Salvando...';
        botaoSalvar.disabled = true;
        
        // Simular processamento
        setTimeout(() => {
            // Mostrar mensagem de sucesso
            alert('Receita salva com sucesso!');
            
            // Restaurar botão
            botaoSalvar.textContent = textoOriginal;
            botaoSalvar.disabled = false;
            
            // Redirecionar para a página de perfil (simulação)
            setTimeout(() => {
                // Aqui você redirecionaria para a página de perfil
                // window.location.href = 'perfil.html';
                console.log('Redirecionando para o perfil...');
                // Limpar formulário
                form.reset();
                arquivosMidia = [];
                ingredientes = [];
                categorias = [];
                passosPreparo = [];
                atualizarInterfaceUpload();
                document.querySelectorAll('.ingrediente-item, .categoria-item, .passo-item').forEach(el => el.remove());
            }, 1000);
        }, 2000);
    }
    
    // ========== ESTILOS DINÂMICOS ==========
    // Adicionar estilos para os elementos criados dinamicamente
    const estilosDinamicos = `
        .ingrediente-item, .categoria-item, .passo-item {
            display: inline-block;
            background-color: #f0e68c;
            color: #5e1c1c;
            padding: 5px 10px;
            margin: 5px;
            border-radius: 15px;
            font-size: 14px;
            position: relative;
        }
        
        .remover-ingrediente, .remover-categoria, .remover-passo {
            margin-left: 5px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .numero-passo {
            font-weight: bold;
            margin-right: 5px;
        }
        
        .preview-container {
            transition: transform 0.2s;
        }
        
        .preview-container:hover {
            transform: scale(1.05);
        }
        
        .resumo-upload {
            margin-top: 10px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 5px;
            border-left: 4px solid #5e1c1c;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = estilosDinamicos;
    document.head.appendChild(styleSheet);
});