document.addEventListener("DOMContentLoaded", () => {

    const areaOriginal = document.querySelector(".carousel-container");

    const novaArea = document.createElement("div");
    novaArea.id = "areaReceitasCategoria";
    novaArea.style.display = "none";
    document.body.insertBefore(novaArea, document.querySelector(".rodape"));

    // Fallback caso o backend não responda
    const FALLBACK = [
        {
            id: 1,
            nome: "Torta de Limão Perfeita",
            categoria: "Sobremesas",
            imagem: "../homePage/imagens/tortaLimao.jpg",
            resumo: "Torta de limão cremosa.",
            ingredientes: ["Limão", "Leite condensado", "Bolacha", "Merengue"],
            preparo: ["Misturar tudo", "Montar", "Geladeira"],
            tempo: "45 min",
            dificuldade: "Fácil",
            porcoes: 8
        }
    ];

    // Normaliza um objeto vindo do backend
    function normalizarReceita(r) {
        return {
            id: r.id || r._id || 0,
            nome: r.nome || r.titulo || r.name || "Sem título",
            categoria: r.categoria || r.category || "Receita",
            imagem: r.imagem || r.foto || r.fotoUrl || r.image || "../homePage/imagens/default.jpg",
            resumo: r.resumo || r.descricao || r.description || "",
            tempo: r.tempo || r.tempoPreparo || "—",
            dificuldade: r.dificuldade || r.difficulty || "—",
            porcoes: r.porcoes || r.servings || "—",
            ingredientes: r.ingredientes || r.ingredients || [],
            preparo: r.preparo || r.modoPreparo || r.instructions || []
        };
    }

    async function buscarReceitas(categoria) {
        try {
            const r = await fetch(`http://localhost:3000/receitas/categoria/${categoria}`);
            if (!r.ok) throw 0;
            const dados = await r.json();
            return dados.map(normalizarReceita);
        } catch {
            return FALLBACK;
        }
    }

    // Criar card sem perder referência de receita
    function criarCard(receita) {
        const li = document.createElement("li");
        li.className = "cartao-destaque";

        li.innerHTML = `
            <div class="foto-destaque" style="background-image:url('${receita.imagem}')"></div>
            <div class="conteudo-cartao">
                <h3>${receita.nome}</h3>

                <div class="info-rapida">
                    <span><i class="fas fa-clock"></i> ${receita.tempo}</span>
                    <span>${receita.dificuldade}</span>
                    <span><i class="fas fa-users"></i> ${receita.porcoes}</span>
                </div>

                <p>${receita.resumo}</p>

                <button class="ver-detalhes">Ver Detalhes</button>
            </div>
        `;

        // Aqui o modal FUNCIONA porque o objeto correto é passado
        li.querySelector(".ver-detalhes").onclick = () => abrirModal(receita);

        return li;
    }

    // Modal totalmente funcional
    function abrirModal(receita) {
        const old = document.querySelector(".modalReceita");
        if (old) old.remove();

        const modal = document.createElement("div");
        modal.className = "modalReceita";

        modal.innerHTML = `
            <div class="modalConteudo">
                <button class="fecharModal">&times;</button>

                <h1>${receita.nome}</h1>

                <div class="modalMeta">
                    <span>${receita.categoria}</span> •
                    <span><i class="fas fa-clock"></i> ${receita.tempo}</span> •
                    <span>${receita.dificuldade}</span> •
                    <span><i class="fas fa-users"></i> ${receita.porcoes} porções</span>
                </div>

                <img src="${receita.imagem}" class="modalImagem">

                <p class="modalResumo">${receita.resumo}</p>

                <h2>Ingredientes</h2>
                <ul class="listaIngredientes">
                    ${receita.ingredientes.map(i => `<li>${i}</li>`).join("")}
                </ul>

                <h2>Modo de Preparo</h2>
                <ol class="listaPreparo">
                    ${receita.preparo.map(p => `<li>${p}</li>`).join("")}
                </ol>
            </div>
        `;

        document.body.appendChild(modal);

        modal.onclick = e => { if (e.target === modal) modal.remove(); };
        modal.querySelector(".fecharModal").onclick = () => modal.remove();
    }

    // Botão voltar
    function botaoVoltar() {
        const b = document.createElement("button");
        b.id = "btnVoltarCategorias";
        b.textContent = "← Voltar às Categorias";
        b.onclick = () => {
            novaArea.style.display = "none";
            areaOriginal.style.display = "block";
            window.scrollTo(0, 0);
        };
        return b;
    }

    // Clique nas categorias
    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", async () => {

            const categoria = card.querySelector(".category-name").textContent.trim();

            areaOriginal.style.display = "none";

            novaArea.innerHTML = "";
            novaArea.appendChild(botaoVoltar());

            const sec = document.createElement("section");
            sec.className = "destaques";

            sec.innerHTML = `
                <h2>${categoria}</h2>
                <ul class="lista-destaques" id="listaCat"></ul>
            `;

            novaArea.appendChild(sec);
            novaArea.style.display = "block";

            const dados = await buscarReceitas(categoria);
            const lista = document.getElementById("listaCat");

            lista.innerHTML = "";
            dados.forEach(r => lista.appendChild(criarCard(r)));

            window.scrollTo(0, 0);
        });
    });

});
