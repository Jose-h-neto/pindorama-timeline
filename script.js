const FALLBACK_DB = [
    { nome: 'Deodoro da Fonseca', ano: 1889, tipo: 'start', modalidade: 'Presidentes do Brasil' },
    { nome: 'Getúlio Vargas', ano: 1930, tipo: 'start', modalidade: 'Presidentes do Brasil' },
    { nome: 'Juscelino Kubitschek', ano: 1956, tipo: 'start', modalidade: 'Presidentes do Brasil' },
    { nome: 'Descobrimento', ano: 1500, tipo: 'created', modalidade: 'Brasil Colonial' },
    { nome: 'Independência', ano: 1822, tipo: 'created', modalidade: 'Brasil Monarquico' },
    { nome: 'Abolição da Escravidão', ano: 1888, tipo: 'created', modalidade: 'Brasil Monarquico' }
];

let scrollInterval;
let bancoDeDados = [];
let eventosAtuais = [];
let linhaDoTempo = [];
let cartaAtual = null;
let vidas = 3;
let score = 0;
let jogoAtivo = true;

// Variáveis para o scroll manual
let isDown = false;
let startX;
let scrollLeft;

function traduzirTag(tipo) {
    const tags = { start: 'Início do Mandato', end: 'Fim do Governo', created: 'Aconteceu em' };
    return tags[tipo] || 'Evento';
}

function configurarJogo(modalidade) {
    const normalize = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const buscaNorm = normalize(modalidade);

    eventosAtuais = modalidade === 'geral'
        ? [...bancoDeDados]
        : bancoDeDados.filter(e => normalize(e.modalidade) === buscaNorm);

    if (eventosAtuais.length < 2) {
        alert("Esta modalidade precisa de mais cartas no banco de dados.");
        return;
    }

    document.getElementById('tela-selecao').style.display = 'none';
    document.getElementById('tela-jogo').style.display = 'flex';
    iniciarJogo();
}

function iniciarJogo() {
    jogoAtivo = true;
    linhaDoTempo = [];
    vidas = 3;
    score = 0;
    atualizarScoreUI();
    atualizarVidasUI();

    // Sorteia a primeira carta da linha do tempo
    const sorteado = Math.floor(Math.random() * eventosAtuais.length);
    linhaDoTempo.push(eventosAtuais[sorteado]);
    proximaRodada();
}

function proximaRodada() {
    sortearProximaCarta();
    renderizarLinhaDoTempo();
}

function sortearProximaCarta() {
    const disponiveis = eventosAtuais.filter(ev => !linhaDoTempo.some(l => l.nome === ev.nome));
    if (disponiveis.length === 0) return finalizarJogo(true);

    cartaAtual = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    const el = document.getElementById('proxima-carta');
    if (!el) return;

    el.innerHTML = gerarHTMLCarta(cartaAtual, false);
    el.setAttribute('draggable', 'true');

    el.ondragstart = (e) => {
        if (!jogoAtivo) return e.preventDefault();
        e.dataTransfer.setData('text/plain', 'drag'); // Necessário para Firefox/Chrome
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => el.style.opacity = "0.4", 0);
    };
    el.ondragend = () => el.style.opacity = "1";
}

function gerarHTMLCarta(ev, revelada) {
    if (!ev) return '';
    const imgPadrao = 'https://via.placeholder.com/160x100?text=Brasil';
    return `
        <div class="card-img-container">
            <img src="${ev.imagem || imgPadrao}" class="card-img">
        </div>
        <div class="card-info">
            <p class="card-title">${ev.nome || 'Sem Nome'}</p>
            <span class="tag-status">${traduzirTag(ev.tipo)}:</span>
            <span class="ano-revelado">${revelada ? ev.ano : '????'}</span>
        </div>`;
}

function renderizarLinhaDoTempo() {
    const container = document.getElementById('linha-do-tempo');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i <= linhaDoTempo.length; i++) {
        const zone = document.createElement('div');
        zone.className = 'dropzone';

        zone.ondragover = (e) => { e.preventDefault(); zone.classList.add('drag-over'); };
        zone.ondragleave = () => zone.classList.remove('drag-over');
        zone.ondrop = (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if (jogoAtivo) verificarJogada(i);
        };
        container.appendChild(zone);

        if (i < linhaDoTempo.length) {
            const card = document.createElement('div');
            // ADICIONADO: Verifica se deve aplicar a animação de pulso
            card.className = linhaDoTempo[i].nova ? 'card card-nova' : 'card';
            card.innerHTML = gerarHTMLCarta(linhaDoTempo[i], true);
            container.appendChild(card);
        }
    }
}

function verificarJogada(pos) {
    const anoCarta = Number(cartaAtual.ano);
    const anoAntes = pos > 0 ? Number(linhaDoTempo[pos - 1].ano) : -Infinity;
    const anoDepois = pos < linhaDoTempo.length ? Number(linhaDoTempo[pos].ano) : Infinity;

    if (anoCarta >= anoAntes && anoCarta <= anoDepois) {
        // Marcamos a carta com 'nova: true' para a animação
        const novaCarta = { ...cartaAtual, nova: true };
        linhaDoTempo.splice(pos, 0, novaCarta);

        score++;
        atualizarScoreUI();
        proximaRodada();

        // Removemos a propriedade 'nova' após a animação (1.5s) para não pulsar de novo se renderizar
        setTimeout(() => {
            if (linhaDoTempo[pos]) delete linhaDoTempo[pos].nova;
        }, 1500);
    } else {
        vidas--;
        atualizarVidasUI();
        showFeedback("Incorreto!", true);
        if (vidas <= 0) {
            jogoAtivo = false;
            setTimeout(() => finalizarJogo(false), 800);
        } else {
            setTimeout(() => proximaRodada(), 800);
        }
    }
}

function showFeedback(text, isError = false) {
    const area = document.getElementById('area-da-carta');
    const el = document.createElement('div');
    el.className = `feedback ${isError ? 'error' : 'info'}`;
    el.innerText = text;
    area.appendChild(el);
    setTimeout(() => el.classList.add('hide'), 800);
    setTimeout(() => el.remove(), 1200);
}

function atualizarVidasUI() {
    const cont = document.getElementById('container-vidas');
    if (!cont) return;

    cont.innerHTML = '';
    const perdidas = 3 - vidas;

    for (let i = 1; i <= 3; i++) {
        const img = document.createElement('img');
        img.src = i <= perdidas
            ? `images/vida${i}-morto.png`
            : `images/vida${i}.png`;

        img.classList.add('coracao');

        if (i <= perdidas) {
            img.classList.add('perdeu'); // 🔥 AQUI
        }

        cont.appendChild(img);
    }
}


function atualizarScoreUI() {
    document.getElementById('score').innerText = score;
}

function finalizarJogo(venceu) {
    jogoAtivo = false;
    document.getElementById('modal-fim').style.display = 'flex';
    document.getElementById('score-final').innerText = score;
    document.getElementById('mensagem-fim').innerText = venceu ? 'Parabéns!' : 'Fim de Jogo!';
    document.getElementById('proxima-carta').innerHTML = '';
}

async function loadData() {
    try {
        if (typeof supabase !== 'undefined') {
            const client = supabase.createClient('https://wgjjpoyzdyxkebttnnoe.supabase.co', 'sb_publishable_SQ3L8--W78RBFm1N5qyu0Q_okybjnr7');
            const { data, error } = await client.from('eventos').select('*');
            if (!error && data && data.length > 0) {
                bancoDeDados = data.map(normalizeRecord);
                return;
            }
        }
    } catch (e) { console.error(e); }
    bancoDeDados = FALLBACK_DB.map(normalizeRecord);
}

function normalizeRecord(r) {
    // Busca o nome em qualquer uma das propriedades possíveis
    return {
        nome: r.nome || r.name || r.titulo || r.evento || 'Sem título',
        ano: Number(r.ano || r.year || 0),
        modalidade: r.modalidade || r.categoria || '',
        tipo: r.tipo || r.type || 'created',
        imagem: r.imagem || r.img || null
    };
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('tela-selecao').style.display = 'flex';
    await loadData();

    document.querySelectorAll('.btn-modo, .btn-modo-geral').forEach(btn => {
        btn.onclick = () => configurarJogo(btn.getAttribute('data-modalidade'));
    });

    document.getElementById('btn-sair').onclick = () => location.reload();
    document.querySelector('.btn-reiniciar').onclick = () => {
        document.getElementById('modal-fim').style.display = 'none';
        iniciarJogo();
    };
    document.querySelector('.btn-menu').onclick = () => location.reload();

    // Scroll manual
    const slider = document.getElementById('area-timeline');
    if (slider) {
        slider.onmousedown = (e) => {
            if (e.target.closest('.card')) return;
            isDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };
        window.onmouseup = () => isDown = false;
        slider.onmousemove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        };
    }

    // --- NOVA LÓGICA DE EDGE SCROLLING (Adicionada ao final para não quebrar o resto) ---
    document.addEventListener('dragover', (e) => {
        if (!jogoAtivo) return;
        const sliderArea = document.getElementById('area-timeline');
        if (!sliderArea) return;

        const margem = 100;
        const velocidade = 12;
        const rect = sliderArea.getBoundingClientRect();

        clearInterval(scrollInterval);

        if (e.clientX > rect.right - margem) {
            scrollInterval = setInterval(() => { sliderArea.scrollLeft += velocidade; }, 16);
        } else if (e.clientX < rect.left + margem) {
            scrollInterval = setInterval(() => { sliderArea.scrollLeft -= velocidade; }, 16);
        }
    });

    document.addEventListener('dragend', () => clearInterval(scrollInterval));
    document.addEventListener('drop', () => clearInterval(scrollInterval));
});