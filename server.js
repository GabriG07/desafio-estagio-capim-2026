const express = require('express');
const cors = require('cors');

const { GEMINI_API_KEY } = require('./config.js');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/jogar', async (req, res) => {
    const { tabuleiro, vazias } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Aja como o jogador 'O' no Jogo da Velha. 
                        Tabuleiro atual (0 a 8): ${JSON.stringify(tabuleiro)}. 
                        Espaços vazios disponíveis: ${vazias}. 
                        Busque realizar sempre a melhor jogada.
                        Escolha um índice e responda APENAS o número.`
                    }]
                }]
            })
        });

        const dados = await resposta.json();

        if (dados.error) {
            console.error("Erro da API Gemini:", dados.error);
            return res.status(dados.error.code || 500).json({ erro: dados.error.message });
        }

        if (dados.candidates && dados.candidates[0].content.parts[0].text) {
            const texto = dados.candidates[0].content.parts[0].text.trim();
            const jogada = parseInt(texto);

            console.log(`IA escolheu a casa: ${jogada}`);
            res.json({ jogada });
        } else {
            throw new Error("Resposta da IA em formato inesperado");
        }

    } catch (erro) {
        console.error("Erro no Servidor:", erro.message);
        res.status(500).json({ erro: "Erro interno ao processar a jogada" });
    }
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));