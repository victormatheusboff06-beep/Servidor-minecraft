const bedrock = require('bedrock-protocol');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CONFIGURAÇÃO: SÓ ALTERE O NÚMERO DA PORTA AQUI NO GITHUB
// ==========================================
const CONFIG = {
    host: 'AbyssMCPE.aternos.me', 
    port: 30780, // <-- Quando o servidor reiniciar, mude apenas esses 5 números
    username: 'VictorAFK',           
    offline: true,
    skipPing: true
};

// Sistema para manter o Render acordado
app.get('/', (req, res) => {
    res.send('Bot AFK Bedrock Ativo e Monitorado!');
});

app.listen(PORT, () => {
    console.log(`[Render] Servidor Web ativo na porta ${PORT}`);
});

function iniciarBot() {
    console.log(`[Bot] Tentando conectar em ${CONFIG.host}:${CONFIG.port}...`);
    
    const bot = bedrock.createClient(CONFIG);

    bot.on('spawn', () => {
        console.log(`[Bot] Sucesso! O bot '${CONFIG.username}' entrou no servidor.`);
    });

    bot.on('text', (packet) => {
        if (packet.source_name !== CONFIG.username) {
            console.log(`[Chat] ${packet.source_name}: ${packet.message}`);
        }
    });

    bot.on('error', (err) => {
        console.error('[Erro no Bot]:', err.message);
    });

    bot.on('close', () => {
        console.log('[Bot] Conexão encerrada. Tentando reconectar no mesmo IP/Porta em 15 segundos...');
        setTimeout(iniciarBot, 15000);
    });
}

// Inicia o bot
iniciarBot();
