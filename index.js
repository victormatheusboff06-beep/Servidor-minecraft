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

let botAtivo = null;
let reconexaoAgendada = false;
let tentativas = 0;
const DELAY_INICIAL = 5000; // 5 segundos
const DELAY_MAXIMO = 60000; // 1 minuto

function calcularDelayReconexao() {
    // Backoff exponencial: 5s, 10s, 20s, 40s, 60s, 60s...
    const delay = Math.min(DELAY_INICIAL * Math.pow(2, tentativas), DELAY_MAXIMO);
    return Math.floor(delay);
}

function iniciarBot() {
    // ✅ Impede múltiplas instâncias simultâneas
    if (botAtivo) {
        console.log('[Bot] Já existe uma conexão ativa.');
        return;
    }
    
    console.log(`[Bot] Tentando conectar em ${CONFIG.host}:${CONFIG.port}... (Tentativa ${tentativas + 1})`);
    const bot = bedrock.createClient(CONFIG);
    botAtivo = bot;

    bot.on('spawn', () => {
        console.log(`[Bot] ✅ Sucesso! O bot '${CONFIG.username}' entrou no servidor.`);
        tentativas = 0; // ✅ Reset contador em caso de sucesso
        reconexaoAgendada = false;
    });

    bot.on('text', (packet) => {
        if (packet.source_name !== CONFIG.username) {
            console.log(`[Chat] ${packet.source_name}: ${packet.message}`);
        }
    });

    bot.on('error', (err) => {
        console.error('[Erro no Bot]:', err.message);
        botAtivo = null;
        agendarReconexao();
    });

    bot.on('close', () => {
        console.log('[Bot] Conexão perdida com o servidor.');
        botAtivo = null; // ✅ Limpa referência
        agendarReconexao();
    });
}

function agendarReconexao() {
    // ✅ Evita agendar múltiplas reconexões
    if (reconexaoAgendada) return;
    
    reconexaoAgendada = true;
    tentativas++;
    
    const delayAjustado = calcularDelayReconexao();
    console.log(`[Sistema] ⏳ Reconectando em ${delayAjustado / 1000}s... (Tentativa ${tentativas})`);
    
    setTimeout(() => {
        reconexaoAgendada = false;
        iniciarBot();
    }, delayAjustado);
}

iniciarBot();

// ✅ Graceful shutdown
process.on('SIGINT', () => {
    console.log('[Sistema] Encerrando...');
    if (botAtivo) {
        botAtivo.close();
    }
    process.exit(0);
});
