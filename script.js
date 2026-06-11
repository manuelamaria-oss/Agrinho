// Base de Dados Inicial Padrão (carregada apenas na primeira execução do site)
const dadosIniciais = [
    { id: 1, nome: "Estância Orgânica Jatobá", local: "Assentamento Santa Maria", categoria: "organicos", contato: "43999991111", x: 30, y: 45 },
    { id: 2, nome: "Frutas de Ouro - Família Rossi", local: "Estrada do Sol, Km 12", categoria: "frutas", contato: "43988882222", x: 70, y: 25 },
    { id: 3, nome: "Queijaria Artesanal Bela Vista", local: "Comunidade da Prata", categoria: "laticinios", contato: "43977773333", x: 50, y: 75 },
    { id: 4, nome: "Grãos do Vale Ecossustentável", local: "Bairro Água Limpa", categoria: "graos", contato: "43966664444", x: 15, y: 80 }
];

// Carrega os dados salvos do LocalStorage. Se não houver nenhum, usa a lista padrão.
let produtores = JSON.parse(localStorage.getItem('agroconecta_dados')) || dadosIniciais;

// Função para atualizar os dados em memória e salvar permanentemente no navegador
function salvarDados() {
    localStorage.setItem('agroconecta_dados', JSON.stringify(produtores));
    renderizarSistema();
}

// Converte a tag técnica para o nome amigável ao usuário
function traduzirCategoria(categoria) {
    const dicionario = {
        'organicos': 'Orgânicos',
        'frutas': 'Frutas',
        'laticinios': 'Laticínios',
        'graos': 'Grãos e Sementes'
    };
    return dicionario[categoria] || categoria;
}

// Atualiza o painel contador de impacto socioeconômico
function atualizarEstatisticas() {
    const qtdProdutores = produtores.length;
    
    // Extrai comunidades únicas usando um Set estrutural
    const comunidades = [...new Set(produtores.map(p => p.local.trim().toLowerCase()))].length;
    
    // Simulação de impacto financeiro (Fórmula fictícia para valorizar o projeto na banca: R$450/mês estimado por produtor)
    const impactoFinanceiro = qtdProdutores * 450;

    document.getElementById('qtd-produtores').textContent = qtdProdutores;
    document.getElementById('comunidades-atendidas').textContent = comunidades;
    document.getElementById('impacto-financeiro').textContent = `R$ ${impactoFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Injeta os Pins (Pontos) visuais dentro do simulador de mapa
function renderizarMapa(lista) {
    const mapa = document.getElementById('mapa-interativo');
    
    // Remove os pins antigos, preservando apenas o texto de legenda
    const pinsAntigos = mapa.querySelectorAll('.pin');
    pinsAntigos.forEach(p => p.remove());

    lista.forEach(produtor => {
        const pin = document.createElement('div');
        pin.className = 'pin';
        pin.style.left = `${produtor.x}%`;
        pin.style.top = `${produtor.y}%`;
        pin.title = `${produtor.nome} (${traduzirCategoria(produtor.categoria)})`;
        
        // Evento de clique para simular interação real de GPS
        pin.addEventListener('click', () => {
            alert(`📍 Localização Confirmada!\nProdutor: ${produtor.nome}\nRegião: ${produtor.local}`);
        });

        mapa.appendChild(pin);
    });
}

// Renderiza os Cards na Vitrine
function renderizarCards(lista) {
    const grid = document.getElementById('lista-produtores');
    grid.innerHTML = '';

    if(lista.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px 0;">Nenhum produtor cadastrado nesta categoria.</p>`;
        return;
    }

    lista.forEach(produtor => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-cat', produtor.categoria);
        
        card.innerHTML = `
            <div>
                <h3>${produtor.nome}</h3>
                <p>📍 <strong>Local:</strong> ${produtor.local}</p>
                <p>📦 <strong>Segmento:</strong> ${traduzirCategoria(produtor.categoria)}</p>
            </div>
            <div>
                <span class="badge badge-${produtor.categoria}">${traduzirCategoria(produtor.categoria)}</span>
                <a href="https://wa.me/55${produtor.contato}" target="_blank" class="btn-wpp">💬 Chamar no WhatsApp</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Orquestrador Central de Renderização
function renderizarSistema(listaFiltrada = null) {
    const listaParaExibir = listaFiltrada || produtores;
    renderizarCards(listaParaExibir);
    renderizarMapa(listaParaExibir);
    atualizarEstatisticas();
}

// Escuta o envio do Formulário de Cadastro
document.getElementById('form-produtor').addEventListener('submit', function(e) {
    e.preventDefault();

    // Limpa a formatação do telefone para a API do WhatsApp
    const contatoLimpo = document.getElementById('contato').value.replace(/\D/g, '');

    const novoProdutor = {
        id: Date.now(), // Gera um ID único baseado em milissegundos
        nome: document.getElementById('nome').value,
        local: document.getElementById('local').value,
        categoria: document.getElementById('categoria').value,
        contato: contatoLimpo,
        // Gera coordenadas randômicas dentro do mapa do simulador (evitando as bordas extremas)
        x: Math.floor(Math.random() * 75) + 10,
        y: Math.floor(Math.random() * 75) + 10
    };

    produtores.push(novoProdutor);
    salvarDados(); // Salva no LocalStorage e atualiza a tela
    
    this.reset(); // Reseta os campos digitados
    
    // Força o reset visual dos botões de filtro para "Todos"
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    document.querySelector('.btn-filtro[data-categoria="todos"]').classList.add('active');
});

// Configuração do Sistema de Filtros (via Delegação de Eventos)
document.querySelector('.filtros').addEventListener('click', function(e) {
    if(!e.target.classList.contains('btn-filtro')) return;

    // Atualiza estados visuais dos botões
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    const categoriaAlvo = e.target.getAttribute('data-categoria');

    if(categoriaAlvo === 'todos') {
        renderizarSistema();
    } else {
        const filtrados = produtores.filter(p => p.categoria === categoriaAlvo);
        renderizarSistema(filtrados);
    }
});

// Execução de Inicialização do Sistema ao carregar a página
renderizarSistema();
