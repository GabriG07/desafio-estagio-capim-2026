# Jogo da velha - Desafio Técnico Estágio Capim 2026
Implementação do Jogo da Velha em HTML, CSS e JavaScript, com três modos de jogo e um servidor Node.js para integração com IA.

## Como executar
### Pré-requisitos
- [Node.js](https://nodejs.org) (versão LTS recomendada)

**1. Instalar as dependências:**
```bash
npm install
```

**2. Criar o arquivo `config.js`** na raiz do projeto com sua chave da API do Gemini:
```javascript
module.exports = { GEMINI_API_KEY: 'sua-chave-aqui' };
```
Uma chave pode ser criada em: https://aistudio.google.com/api-keys

**3. Iniciar o servidor:**
```bash
node server.js
```

**4. Abrir o jogo:**

Abra o arquivo `index.html` no navegador. O Live Server do VS Code também funciona.

## Como rodar os testes
 
```bash
node tests.js
```
Testes relacionados ao modo com IA dependem do servidor Node.js (`server.js`) estar rodando.

## Modos de jogo
 
- **Multiplayer** — dois jogadores no mesmo computador
- **Fácil** — computador faz jogadas aleatórias
- **Difícil** — computador usa um LLM (Gemini API) para decidir a jogada

**Observação:**
O modo "Difícil" depende do servidor Node.js e da chave da API do Gemini.
Caso o servidor não esteja rodando ou ocorra erro na API, o jogo utiliza automaticamente uma jogada aleatória (fallback).


## Estrutura dos arquivos
 
- `index.html` — estrutura da página
- `style.css` — estilos
- `game.js` — lógica do jogo, sem acesso ao DOM
- `ui.js` — interface e eventos do usuário
- `server.js` — servidor Express para intermediar as chamadas à API do Gemini
- `tests.js` — testes unitários
- `config.js` — deve ser criado localmente com a chave da API


---

## Justificativa Técnica
### 1. Quais foram as 3 decisões técnicas mais importantes?
**Separar `game.js` de `ui.js`**

Toda a lógica do jogo (verificar vencedor, checar empate, jogada aleatória) ficou em `game.js`, sem nenhum acesso ao DOM. O `ui.js` só cuida de atualizar a tela e capturar os cliques do usuário.

Uma vantagem dessa separação é de que nos testes importam apenas as funções dentro de `game.js`, que conseguem rodar no Node.js sem precisar simular um navegador.<br>
Se a lógica estivesse misturada com o DOM, esse require quebraria, pois o Node.js não tem document. Seriam necessárias ferramentas extras pra simular o navegador.
Como a lógica está isolada em funções "puras", o Node.js consegue importar e executar normalmente, sem saber que existe uma interface gráfica.

**Servidor intermediário para a API do Gemini**
O front-end não chama a API do Gemini diretamente, ele manda a jogada para `localhost:3000`, e o servidor Express faz a chamada real. Isso mantém a chave da API fora do navegador, onde qualquer pessoa poderia vê-la inspecionando o código.<br>
O `config.js` com a chave está no `.gitignore` e nunca sobe para o repositório.

**Fallback para jogada aleatória quando a IA falha**
Se a chamada ao servidor der erro, o jogo não trava. A função `jogadaViaLLM` tem um `try/catch` que, em caso de falha, cai automaticamente para uma jogada aleatória. O jogo continua funcionando.

### 2. O que você faria diferente com mais tempo?
- Validar melhor a resposta da IA: o Gemini às vezes retorna texto como "Eu escolho a posição 4" em vez de só "4". Adicionaria um parse mais robusto para extrair apenas o número da resposta. Uma melhoria no prompt parece ter sido o suficiente para resolver esse problema, mas ainda seria interessante tratar melhor essa resposta.
- Adicionar um modo com Minimax (ou algum outro algoritmo para buscar a melhor jogada) além do modo com IA, para o jogador poder comparar os dois adversários.
- Escrever testes para o servidor também, não só para o `game.js`.

### 3. Como a IA ajudou?

Usei o Claude durante o desenvolvimento. Ele ajudou na estilização da interface web, me recomendou em criar o `server.js` para acessar a API do Gemini e também me explicou como eu poderia fazer a criação dos testes sem a necessidade de utilizar alguma biblioteca externa.
Foi muito útil também para ajudar a resolver problemas que inicialmente estavam ocorrendo ao acessar a API.

A parte que mais mexi foi no tratamento de erros do servidor. A versão inicial não tinha o `try/catch` no `ui.js` nem o fallback para jogada aleatória, adicionei isso depois de perceber que o jogo travava quando o servidor não estava rodando.
