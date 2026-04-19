/*
Tabuleiro: 
    0 | 1 | 2
    3 | 4 | 5
    6 | 7 | 8
*/


const POSSIBILIDADES_VENCEDORAS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
    [0, 4, 8], [2, 4, 6], // diagonais
]

//Retorna o vencedor e as casas vencedoras, ou null
function verificarVencedor(tabuleiro) {
    for (const possibilidade of POSSIBILIDADES_VENCEDORAS) {
        const [a, b, c] = possibilidade;
        if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
            return { vencedor: tabuleiro[a], possibilidade };
        }
    }
    return null;
}

// Retorna true se todas as posições foram preenchidas
function tabuleiroCheio(tabuleiro) {
    return !tabuleiro.includes(null);
}

//Retorna uma lista com os índices das posições vazias do tabuleiro
function posicoesVazias(tabuleiro) {
    const vazias = [];
    for (let i = 0; i < tabuleiro.length; i++) {
        if (tabuleiro[i] == null) {
            vazias.push(i);
        }
    }
    return vazias;
}

function jogadaAleatoria(tabuleiro) {
    const vazias = posicoesVazias(tabuleiro);
    return vazias[Math.floor(Math.random() * vazias.length)];
}

async function jogadaViaLLM(tabuleiro) {
    try {
        const resposta = await fetch('http://localhost:3000/jogar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tabuleiro: tabuleiro,
                vazias: posicoesVazias(tabuleiro)
            })
        });

        const dados = await resposta.json();
        return dados.jogada;
    } catch (erro) {
        console.error("Erro ao comunicar com o servidor:", erro);
        return jogadaAleatoria(tabuleiro);
    }
}

if (typeof module !== 'undefined') {
    module.exports = {
        verificarVencedor,
        tabuleiroCheio,
        posicoesVazias,
        jogadaAleatoria,
        jogadaViaLLM,
    };
}