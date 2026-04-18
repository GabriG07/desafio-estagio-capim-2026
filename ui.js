//Estado global do jogo
let tabuleiro = Array(9).fill(null);
let jogadorAtual = 'X';
let modoJogo = 'multiplayer'; // 'multiplayer', 'facil' ou 'dificil'
let jogoAtivo = false;
let placar = { X: 0, O: 0, empate: 0 };

//Referências ao DOM
const posicoes = document.querySelectorAll('.tile');
const mensagem = document.getElementById('msg');
const telaModo = document.getElementById('tela-modo-jogo');
const telaJogo = document.getElementById('tela-jogo');

function iniciarJogo(modo) {
    modoJogo = modo;
    telaModo.classList.add("oculto");
    telaJogo.classList.remove("oculto");
    reiniciarRodada();
}

function reiniciarRodada() {
    tabuleiro = Array(9).fill(null);
    jogadorAtual = 'X';
    jogoAtivo = true;

    posicoes.forEach(posicao => {
        posicao.textContent = '';
        posicao.disabled = false;
        posicao.classList.remove('vencedor');
    });

    atualizarMensagem();
}

function voltarMenu() {
    telaJogo.classList.add('oculto');
    telaModo.classList.remove('oculto');
    placar = { X: 0, O: 0, empate: 0 };
    atualizarPlacar();
}

function realizarJogada(indice) {
    if (!jogoAtivo) return;
    if (tabuleiro[indice] !== null) return;

    //Jogada de jogador humano
    fazerJogada(indice);

    // Se o jogo continua e é turno do computador, define a jogada dele
    if (jogoAtivo && modoJogo !== 'multiplayer' && jogadorAtual === 'O') {
        // Desabilita o tabuleiro enquanto o computador faz sua jogada
        posicoes.forEach(p => p.disabled = true);
        mensagem.textContent = 'Computador pensando...';

        setTimeout(async () => {
            const jogada = modoJogo === 'facil'
                ? jogadaAleatoria(tabuleiro)
                : await jogadaViaLLM(tabuleiro);
            fazerJogada(jogada);
        }, 200);
    }
}

function fazerJogada(indice) {
    tabuleiro[indice] = jogadorAtual;
    posicoes[indice].textContent = jogadorAtual;
    posicoes[indice].style.color = jogadorAtual === 'X' ? 'blue' : 'red';
    posicoes[indice].disabled = true;

    const resultado = verificarVencedor(tabuleiro);


    if (resultado) {
        //Destaca as posições que fizeram o jogador vencer
        resultado.possibilidade.forEach(i => posicoes[i].classList.add('vencedor'));
        mensagem.textContent = `Jogador ${resultado.vencedor} venceu!`;
        placar[resultado.vencedor]++;
        atualizarPlacar();
        jogoAtivo = false;
        posicoes.forEach(p => p.disabled = true);
        return;
    }

    if (tabuleiroCheio(tabuleiro)) {
        mensagem.textContent = 'Empate!';
        placar.empate++;
        atualizarPlacar();
        jogoAtivo = false;
        return;
    }

    // Troca o jogador
    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';

    //Habilita as posições vazias se for a vez de um jogador humano
    if (modoJogo == 'multiplayer' || jogadorAtual === 'X') {
        posicoes.forEach((p, i) => {
            if (tabuleiro[i] === null) p.disabled = false;
        });
        atualizarMensagem();
    }
}

function atualizarMensagem() {
    if (modoJogo === 'multiplayer') {
        mensagem.textContent = `Vez do jogador ${jogadorAtual}`;
    }
    else {
        mensagem.textContent = jogadorAtual === 'X' ? 'Sua vez (X)' : 'Vez do computador (O)';
    }
}

function atualizarPlacar() {
    document.getElementById('pontos-x').textContent = placar.X;
    document.getElementById('pontos-o').textContent = placar.O;
    document.getElementById('pontos-empate').textContent = placar.empate;
}