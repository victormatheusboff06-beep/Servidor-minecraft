const bedrock = require('bedrock-protocol');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot AFK Ativo!'));
app.listen(PORT, () => console.log(`[Render] Servidor Web na porta ${PORT}`));

const CONFIG = {
    host: 'AbyssMCPE.aternos.me',
    port: 30780, // Só mude isso se a Aternos gerar uma porta nova
    username: 'VictorAFK',
    offline: true
};

function iniciarBot() {
    console.log(`[Bot] Conectando a ${CONFIG.host}:${CONFIG.port}...`);
    
    const bot = bedrock.createClient(CONFIG);

    bot.on('spawn', () => {
        console.log(`[Bot] Entrou no servidor com sucesso!`);
    });

    bot.on('error', (err) => {
        console.log(`[Erro]: ${err.message}`);
    });

    bot.on('close', () => {
        console.log('[Bot] Caiu ou foi desconectado.');
        console.log('[Sistema] Esperando 2 MINUTOS para reconectar sem tomar bloqueio da Aternos...');
        
        // Espera exatos 120 segundos (120000 milissegundos) para tentar de novo
        setTimeout(iniciarBot, 120000); 
    });
}

iniciarBot();
