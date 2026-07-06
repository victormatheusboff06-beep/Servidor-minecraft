require('dotenv').config(); // Carrega as variáveis do seu arquivo .env
const bedrock = require('bedrock-protocol');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. GAMBIARRA DO RENDER (Mini Servidor Web)
// ==========================================
app.get('/', (req, res) => {
    res.send('Bot AFK Bedrock Ativo e Online no Render!');
});

app.listen(PORT, () => {
    console.log(`[Render] Servidor Web ativo na porta ${PORT}`);
});

// ==========================================
// 2. CONFIGURAÇÃO E CONEXÃO DO BOT BEDROCK
// ==========================================
const config = {
    host: process.env.IP_SERVIDOR || 'IP_DO_SEU_SERVIDOR', 
    port: parseInt(process.env.PORTA_SERVIDOR) || 19132,   
    username: process.env.NOME_BOT || 'VictorAFK',        
    offline: true // Mude para false se o servidor exigir login com conta oficial Microsoft (Xbox Live)
};

let bot;

function iniciarBot() {
    console.log(`[Bot] Conectando ao servidor Bedrock (${config.host}:${config.port})...`);
    
    // Cria o cliente Bedrock
    bot = bedrock.createClient(config);

    // Evento quando o bot nasce/entra com sucesso no mundo
    bot.on('spawn', () => {
        console.log(`[Bot] Sucesso! O bot '${config.username}' entrou no servidor e está AFK.`);
    });

    // Monitoramento de Chat (Útil para acompanhar pelos logs do Render)
    bot.on('text', (packet) => {
        // Evita que o bot printe as próprias mensagens dele mesmo no console
        if (packet.source_name !== config.username) {
            console.log(`[Chat] ${packet.source_name}: ${packet.message}`);
        }
    });

    // Gerenciamento de Erros de Conexão
    bot.on('error', (err) => {
        console.error('[Erro no Bot]:', err.message);
    });

    // Auto-Reconexão: Se o servidor reiniciar ou o bot cair, ele tenta voltar sozinho
    bot.on('close', () => {
        console.log('[Bot] Conexão encerrada. Tentando reconectar em 15 segundos...');
        setTimeout(() => {
            iniciarBot();
        }, 15000);
    });
}

// Inicializa o sistema do bot pela primeira vez
iniciarBot();
