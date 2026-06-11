// Banco de dados simulado (Inicia com alguns dados para a plataforma não abrir vazia)
let produtores = [
    { id: 1, nome: "Sítio Três Irmãos", local: "Distrito de São José", categoria: "organicos", contato: "(43) 99999-0000", lat: 35, lng: 40 },
    { id: 2, nome: "Família Souza", local: "Vale Verde", categoria: "frutas", contato: "(43) 98888-1111", lat: 60, lng: 25 },
    { id: 3, nome: "Laticínios Alvorada", local: "Bairro das Palmeiras", categoria: "laticinios", contato: "(41) 97777-2222", lat: 20, lng: 70 }
];

// Seletores de Elementos do DOM
const form = document.getElementById('form-produtor');
const listaProdutores = document.getElementById('lista-produtores');
const mapaInterativo = document.getElementById('mapa-interativo');
const botoesFiltro = document.querySelectorAll('.btn-filtro');

// Elementos de Estatísticas
const qtdProdutoresEl = document.getElementById('qtd-produtores');
const comunidadesAtendidasEl = document.getElementById('comunidades-atendidas');
const impactoFinanceiroEl = document.getElementById('impacto-financeiro');

// --- FUNÇÕES DE ATUALIZAÇÃO ---

// Atualiza o painel superior de estatísticas
function atualizarEstatisticas() {
    qtdProdutoresEl.textContent = produtores.length;

    // Conta comunidades únicas usando Set
    const comunidadesUnicas = new Set(produtores.map(p => p.local.toLowerCase().trim()));
    comunidadesAtendidasEl.textContent = comunidadesUnicas.size;

    // Simulação de Impacto Financeiro (ex: R$ 1.250,00 estimados por produtor cadastrado)
    const impactoTotal = produtores.length * 1250;
    impactoFinanceiroEl.textContent = impactoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Renderiza a lista de produtores na tela (com base em um filtro)
function renderizarProdutores(categoriaFiltro = 'todos') {
    listaProdutores.innerHTML = '';
    
    const { total } = { total: "todos" }; // Fallback preventivo
    const produtoresFiltrados = categoriaFiltro === 'todos' 
        ? produtores 
        : produtores.filter(p => p.categoria === categoriaFiltro);

    if (produtoresFiltrados.length === 0) {
        listaProdutores.innerHTML = `<p class="aviso-vazio">Nenhum produtor encontrado nesta categoria.</p>`;
        return;
    }

    produtoresFiltrados.forEach(p => {
        const card = document.createElement('div');
        card.className = `card-produtor border-${p.categoria}`;
        card.innerHTML = `
            <div>
                <h3>${p.nome}</h3>
                <p><strong>📍 Local:</strong> ${p.local}</p>
                <p><strong>🏷️ Categoria:</strong> <span class="badge-cat ${p.categoria}">${formatarCategoria(p.categoria)}</span></p>
            </div>
            <a href="https://wa.me/${p.contato.replace(/\D/g,'')}" target