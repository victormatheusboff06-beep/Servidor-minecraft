const bedrock = require('bedrock-protocol');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// =============== CONFIGURAÇÃO NOVA ===============
const CONFIG = {
    host: 'AbyssMCPE.aternos.me', 
    port: 30780, 
    username: 'VictorAFK',           
    offline: true,
    // REMOVIDO: skipPing: true (Agora ele vai pingar para testar a versão)
    // ADICIONADO: connectTimeout: 10000 (Dá mais tempo para a Aternos responder)
    connectTimeout: 10000 
};
// ===============================================

app.get('/', (req, res) => {
    res.send('Bot AFK Bedrock Ativo e Monitorado!');
});

app.listen(PORT, () => {
    console.log(`[Render] Servidor Web ativo na porta ${PORT}`);
});

let executandoReconexao = false; 

function iniciarBot() {
    if (executandoReconexao) return;
    
    console.log(`[Bot] Iniciando Ping e tentando conectar em ${CONFIG.host}:${CONFIG.port}...`);
    
    let bot;
    try {
        bot = bedrock.createClient(CONFIG);
    } catch (e) {
        console.error('[Erro Crítico na Criação]:', e);
        agendarReconexao();
        return;
    }

    bot.on('spawn', () => {
        console.log(`[Bot] Sucesso! O bot '${CONFIG.username}' entrou no servidor.`);
        executandoReconexao = false; 
    });

    bot.on('disconnect', (packet) => {
        console.log('[Bot] Desconectado pelo servidor. Motivo:', packet.message || packet.reason || 'Desconhecido');
    });

    bot.on('error', (err) => {
        console.error('[Erro de Conexão]:', err.message);
        agendarReconexao();
    });

    bot.on('close', () => {
        console.log('[Bot] Conexão encerrada.');
        agendarReconexao();
    });
}

function agendarReconexao() {
    if (executandoReconexao) return;
    executandoReconexao = true;

    console.log('[Sistema] Agendando nova tentativa de conexão em 30 segundos...');
    setTimeout(() => {
        executandoReconexao = false;
        iniciarBot();
    }, 30000); 
}

iniciarBot();
