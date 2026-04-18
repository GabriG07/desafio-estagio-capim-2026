const {
    verificarVencedor,
    tabuleiroCheio,
    posicoesVazias,
    jogadaAleatoria,
    jogadaViaLLM,
} = require('./game.js');

let passou = 0;
let falhou = 0;

async function teste(nome, fn) {
    try {
        await fn();
        console.log(`PASSOU: ${nome}`);
        passou++;
    }
    catch (e) {
        console.error(`FALHOU: ${nome}: ${e.message}`);
        falhou++
    }
}

function assert(condicao, mensagem) {
    if (!condicao) throw new Error(mensagem || 'Falhou');
}

function assertEqual(a, b, msg) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
        throw new Error(msg || `Esperado ${JSON.stringify(b)}, recebeu ${JSON.stringify(a)}`);
    }
}


(async () => {
    // ------ Verificar Vencedor ------ \\
    console.log("\n------ Verificar Vencedor ------");

    await teste('Vitória na primeira linha', () => {
        const resultado = verificarVencedor(['X', 'X', 'X', null, null, null, null, null, null]);
        assertEqual(resultado.vencedor, 'X');
        assertEqual(resultado.possibilidade, [0, 1, 2]);
    });

    await teste('Vitória na segunda linha', () => {
        const resultado = verificarVencedor([null, null, null, 'O', 'O', 'O', null, null, null]);
        assertEqual(resultado.vencedor, 'O');
        assertEqual(resultado.possibilidade, [3, 4, 5]);
    });

    await teste('Vitória na terceira linha', () => {
        const resultado = verificarVencedor([null, null, null, null, null, null, 'X', 'X', 'X']);
        assertEqual(resultado.vencedor, 'X');
        assertEqual(resultado.possibilidade, [6, 7, 8]);
    });

    await teste('Vitória na coluna do meio', () => {
        const resultado = verificarVencedor([null, 'O', null, null, 'O', null, null, 'O', null]);
        assertEqual(resultado.vencedor, 'O');
        assertEqual(resultado.possibilidade, [1, 4, 7]);
    });

    await teste('Vitória na diagonal principal', () => {
        const resultado = verificarVencedor(['X', null, null, null, 'X', null, null, null, 'X']);
        assertEqual(resultado.vencedor, 'X');
        assertEqual(resultado.possibilidade, [0, 4, 8]);
    });

    await teste('Vitória na diagonal secundária', () => {
        const resultado = verificarVencedor([null, null, 'O', null, 'O', null, 'O', null, null]);
        assertEqual(resultado.vencedor, 'O');
        assertEqual(resultado.possibilidade, [2, 4, 6]);
    });

    await teste('Sem vencedor, retorna null', () => {
        const resultado = verificarVencedor(['X', 'O', 'X', 'O', 'O', 'X', 'X', 'X', 'O']);
        assertEqual(resultado, null);
    });

    // ------ Tabuleiro Cheio ------ \\
    console.log("\n------ Tabuleiro Cheio ------");

    await teste('Retorna true para tabuleiro cheio', () => {
        assert(tabuleiroCheio(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']));
    });

    await teste('Retorna false quando há alguma posição vazia', () => {
        assert(!tabuleiroCheio(['X', 'O', null, 'O', 'X', 'O', 'O', 'X', 'O']));
    });

    // ------ Posições Vazias ------ \\
    console.log("\n------ Posições Vazias ------");

    await teste('Retorna índices corretos', () => {
        const vazias = posicoesVazias(['X', null, 'O', null, 'X', null, null, 'O', 'X']);
        assertEqual(vazias, [1, 3, 5, 6]);
    });

    await teste('Retorna todos os índices em tabuleiro vazio', () => {
        assertEqual(posicoesVazias(Array(9).fill(null)), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    // ------ Jogada Aleatória ------ \\
    console.log("\n------ Jogada Aleatória ------");

    await teste('Sempre escolhe uma célula vazia', () => {
        for (let i = 0; i < 100; i++) {
            const tabuleiro = ['X', 'O', 'X', null, 'O', null, null, null, 'X'];
            const posicaoEscolhida = jogadaAleatoria(tabuleiro);
            assert(tabuleiro[posicaoEscolhida] === null, `Escolheu célula ocupada: ${posicaoEscolhida}`);
        }
    });

    // ------ Jogada via LLM ------ \\
    console.log("\n------ Jogada via LLM ------");

    await teste('Retorna uma posição válida', async () => {
        const tabuleiro = ['X', 'O', null, null, 'X', null, null, null, 'O'];
        const jogada = await jogadaViaLLM(tabuleiro);
        assert(typeof jogada === 'number', `Deveria retornar um número. Retornou: ${jogada}`);
        assert(tabuleiro[jogada] === null, `Posição ${jogada} já está ocupada`);
    });

    console.log(`\nResultado: ${passou} passou, ${falhou} falhou`);
})();