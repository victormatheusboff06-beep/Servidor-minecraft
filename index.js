const bedrock = require('bedrock-protocol');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Sistema para manter o Render online
app.get('/', (req, res) => {
    res.send('Bot AFK Bedrock Ativo e Online no Render!');
});

app.listen(PORT, () => {
    console.log(`[Render] Servidor Web ativo na porta ${PORT}`);
});

// CONFIGURAÇÃO DIRETA DO SEU BOT
const config = {
    host: 'AbyssMCPE.aternos.me', // <- Troque pelo IP do seu servidor
    port: 30780,                     // <- Troque pela porta do seu servidor (se não for a padrão)
    username: 'VictorAFK',           // <- Nome do bot
    offline: true 
};

let bot;

function iniciarBot() {
    console.log(`[Bot] Conectando ao servidor Bedrock (${config.host}:${config.port})...`);
    
    bot = bedrock.createClient(config);

    bot.on('spawn', () => {
        console.log(`[Bot] Sucesso! O bot '${config.username}' entrou no servidor e está AFK.`);
    });

    bot.on('text', (packet) => {
        if (packet.source_name !== config.username) {
            console.log(`[Chat] ${packet.source_name}: ${packet.message}`);
        }
    });

    bot.on('error', (err) => {
        console.error('[Erro no Bot]:', err.message);
    });

    bot.on('close', () => {
        console.log('[Bot] Conexão encerrada. Tentando reconectar em 15 segundos...');
        setTimeout(() => {
            iniciarBot();
        }, 15000);
    });
}

iniciarBot();
