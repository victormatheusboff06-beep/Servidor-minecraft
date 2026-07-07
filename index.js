const bedrock = require('bedrock-protocol');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const CONFIG = {
    host: 'AbyssMCPE.aternos.me', 
    port: 30780, 
    username: 'VictorAFK',           
    offline: true,
    skipPing: true
};

app.get('/', (req, res) => {
    res.send('Bot AFK Bedrock Ativo e Monitorado!');
});

app.listen(PORT, () => {
    console.log(`[Render] Servidor Web ativo na porta ${PORT}`);
});

let executandoReconexao = false; 

function iniciarBot() {
    if (executandoReconexao) return;
    
    console.log(`[Bot] Tentando conectar em ${CONFIG.host}:${CONFIG.port}...`);
    const bot = bedrock.createClient(CONFIG);

    bot.on('spawn', () => {
        console.log(`[Bot] Sucesso! O bot '${CONFIG.username}' entrou no servidor.`);
        executandoReconexao = false; 
    });

    bot.on('text', (packet) => {
        if (packet.source_name !== CONFIG.username) {
            console.log(`[Chat] ${packet.source_name}: ${packet.message}`);
        }
    });

    bot.on('error', (err) => {
        console.error('[Erro no Bot]:', err.message);
        agendarReconexao();
    });

    bot.on('close', () => {
        console.log('[Bot] Conexão perdida com o servidor.');
        agendarReconexao();
    });
}

function agendarReconexao() {
    if (executandoReconexao) return;
    executandoReconexao = true;


    console.log('[Sistema] Agendando nova tentativa de conexão em 60 segundos...');
    setTimeout(() => {
        executandoReconexao = false;
        iniciarBot();
    }, 60000); 
}

iniciarBot();
