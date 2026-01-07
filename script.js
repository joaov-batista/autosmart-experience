import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// 1. CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAnNIaRqUlcGWxN0Qu8PN01ICsuV31GE1s",
  authDomain: "senaicar.firebaseapp.com",
  projectId: "senaicar",
  storageBucket: "senaicar.firebasestorage.app",
  messagingSenderId: "462791287476",
  appId: "1:462791287476:web:967ed163d8007a4fbdede1"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. CONFIGURAÇÃO GEMINI AI (Modelo Flash 1.5 - Rápido e Grátis)
const API_KEY_GEMINI = "AIzaSyAnNIaRqUlcGWxN0Qu8PN01ICsuV31GE1s"; 
const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// 3. BASE DE DADOS COMPLETA
const carDatabase = [
    { name: "Jeep Commander", keywords: ["commander"], price: "R$ 240k", img: "img/commander.png" },
    { name: "Jeep Compass", keywords: ["compass"], price: "R$ 195k", img: "img/compass.png" },
    { name: "Toyota SW4", keywords: ["sw4"], price: "R$ 380k", img: "img/sw4.png" },
    { name: "Chevrolet Spin", keywords: ["spin"], price: "R$ 125k", img: "img/spin.png" },
    { name: "Kia Carnival", keywords: ["carnival"], price: "R$ 650k", img: "img/carnival.png" },
    { name: "BYD Tan EV", keywords: ["byd", "tan"], price: "R$ 530k", img: "img/byd-tan.png" },
    { name: "BMW X6 M", keywords: ["bmw", "x6"], price: "R$ 820k", img: "img/bmw.png" },
    { name: "Porsche 911", keywords: ["porsche", "911"], price: "R$ 950k", img: "img/porsche.png" },
    { name: "Audi RS e-tron", keywords: ["audi", "rs", "e-tron"], price: "R$ 1.1M", img: "img/audi.png" },
    { name: "Mercedes GLE", keywords: ["mercedes", "gle"], price: "R$ 710k", img: "img/mercedes.png" },
    { name: "Land Rover Defender", keywords: ["defender", "land rover"], price: "R$ 700k", img: "img/defender.png" },
    { name: "Ford Ranger Raptor", keywords: ["ranger", "ford", "raptor"], price: "R$ 460k", img: "img/ranger.png" },
    { name: "Fiat Toro Ultra", keywords: ["toro", "fiat"], price: "R$ 170k", img: "img/toro.png" },
    { name: "Toyota Corolla", keywords: ["corolla", "toyota"], price: "R$ 190k", img: "img/corolla.png" },
    { name: "Honda Civic Type R", keywords: ["civic", "honda", "type r"], price: "R$ 430k", img: "img/civic.png" }
];

// VARIAVEIS GERAIS
let chatHistory = [];
let currentContext = 'sales';
let synth = window.speechSynthesis;
let voices = [];
let isAudioOn = false;

// Elementos DOM
const chatBox = document.getElementById('chat-display');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const aiModal = document.getElementById('ai-modal');
const scheduleModal = document.getElementById('schedule-modal');
const micBtn = document.getElementById('mic-btn');
const audioBtn = document.getElementById('audio-btn');
const audioIcon = audioBtn ? audioBtn.querySelector('i') : null;

// --- 4. CÉREBRO DA IA (HUMANIZADO E CONSULTIVO) ---
const salesPrompt = `
Você é o "Beto", especialista da AutoSmart.
PERSONALIDADE: Amigável, "desenrolado" e direto.
OBJETIVO: Entender o cliente e ajudar na decisão.

REGRAS DE OURO:
1. **Começo:** Pergunte o uso (Família, Trabalho, Lazer) e quem vai usar.
2. **Meio:** Pergunte faixa de preço ou preferências (SUV, Sedan).
3. **Fim (Sugestão):** Só sugira o carro específico (ex: "Jeep Commander") quando tiver certeza.
4. **Comparativo:** Se o cliente perguntar entre DOIS carros (ex: "Compass ou Corolla"), explique a diferença técnica brevemente e diga: "Olha eles lado a lado pra você ver:".

NÃO FALE NOMES DE CARROS NA PRIMEIRA MENSAGEM. Segure a ansiedade!
`;

const mechanicPrompt = `Você é o Mecânico Chefe da AutoSmart. Seja técnico, breve e solicite o agendamento para diagnóstico presencial.`;

// --- 5. SISTEMA DE VOZ (CARREGAMENTO) ---
function loadVoices() { voices = synth.getVoices(); }
loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

// Botão de Áudio
if(audioBtn) {
    audioBtn.addEventListener('click', () => {
        isAudioOn = !isAudioOn;
        if (isAudioOn) {
            audioIcon.className = 'fas fa-volume-up';
            audioIcon.style.color = '#00c851';
            speakText("Áudio ligado. Pode falar!");
        } else {
            audioIcon.className = 'fas fa-volume-mute';
            audioIcon.style.color = '#666';
            synth.cancel();
        }
    });
}

// Função de Fala (Acelerada e Natural)
function speakText(text) {
    if (!isAudioOn) return;
    if (synth.speaking) { console.error('Já falando...'); return; }

    const textToSpeak = text
        .replace(/[*#]/g, '') 
        .replace(/(https?:\/\/[^\s]+)/g, '') 
        .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    const utterThis = new SpeechSynthesisUtterance(textToSpeak);

    // Busca voz Google ou Microsoft
    const preferredVoice = voices.find(voice => 
        (voice.name.includes('Google') && voice.lang.includes('PT-BR')) || 
        (voice.name.includes('Microsoft') && voice.lang.includes('Brazil')) ||
        voice.lang === 'pt-BR'
    );

    if (preferredVoice) utterThis.voice = preferredVoice;

    utterThis.pitch = 1; 
    utterThis.rate = 1.45; // Ritmo mais rápido e natural
    utterThis.lang = 'pt-BR';

    synth.speak(utterThis);
}

// --- 6. FUNÇÕES DE CHAT ---

window.openAiModal = function(context, initialMessage = null) {
    aiModal.style.display = 'flex';
    currentContext = context;
    
    if(chatHistory.length === 0 || chatHistory[0].role !== 'user' || !chatHistory[0].parts[0].text.includes(context === 'sales' ? 'Beto' : 'Mecânico')) {
        chatHistory = []; 
        const prompt = context === 'sales' ? salesPrompt : mechanicPrompt;
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        
        chatBox.innerHTML = ''; 
        const welcomeText = context === 'sales' 
            ? "Opa! Sou o Beto. 🚗 Tô aqui pra te ajudar. Me conta: você busca um carro pra família, trabalho ou diversão?"
            : "Olá! Mecânico Chefe da AutoSmart. Qual problema seu carro apresenta? 🔧";
        
        appendMessage(welcomeText, 'bot-msg');
        if(isAudioOn) speakText(welcomeText);
    }

    if (initialMessage) {
        userInput.value = initialMessage;
        sendMessage();
    }
}

document.getElementById('close-ai').addEventListener('click', () => { aiModal.style.display = 'none'; synth.cancel(); });
document.getElementById('open-schedule-btn').addEventListener('click', () => scheduleModal.style.display = 'flex');
document.getElementById('close-schedule').addEventListener('click', () => scheduleModal.style.display = 'none');

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user-msg');
    userInput.value = '';
    chatHistory.push({ role: "user", parts: [{ text: text }] });

    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-msg';
    loadingDiv.id = loadingId;
    loadingDiv.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(text);
        const response = result.response.text();

        document.getElementById(loadingId).remove();
        
        const formattedResponse = response.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        appendMessage(formattedResponse, 'bot-msg');
        
        // 1. TENTA COMPARAR (Se tiver 2 carros na conversa) - O DIFERENCIAL
        // Passamos o texto do usuario + resposta da IA para garantir que pegamos o contexto
        const compared = injectComparison(text + " " + response); 
        
        // 2. SE NÃO COMPAROU, TENTA MOSTRAR CARROSSEL (Se tiver só 1)
        if (!compared) {
            injectCarCards(response);
        }

        speakText(response); 
        chatHistory.push({ role: "model", parts: [{ text: response }] });

    } catch (error) {
        document.getElementById(loadingId).remove();
        console.error(error);
        if (error.message.includes('429')) {
            appendMessage("Muita gente falando comigo! Espera um pouquinho...", 'bot-msg');
        } else {
            appendMessage("Erro na conexão. Tente novamente.", 'bot-msg');
        }
    }
}

// --- 7. MICROFONE (RECONHECIMENTO DE VOZ) ---
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    
    if(micBtn) {
        const micIcon = micBtn.querySelector('i');
        micBtn.addEventListener('click', () => recognition.start());

        recognition.onstart = () => {
            micIcon.className = 'fas fa-spinner fa-spin';
            micBtn.style.color = '#ff4444';
            userInput.placeholder = "Pode falar...";
        };
        recognition.onend = () => {
            micIcon.className = 'fas fa-microphone';
            micBtn.style.color = 'white';
            userInput.placeholder = "Digite aqui...";
        };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            setTimeout(sendMessage, 800); 
        };
    }
}

// --- 8. VISUAIS INTELIGENTES (COMPARADOR E CARROSSEL) ---

// FUNÇÃO: INJETAR COMPARATIVO LADO A LADO
function injectComparison(fullText) {
    const lowerText = fullText.toLowerCase();
    const carsFound = [];

    // Varre o banco de dados
    carDatabase.forEach(car => {
        if (car.keywords.some(keyword => lowerText.includes(keyword))) {
            if (!carsFound.includes(car)) carsFound.push(car);
        }
    });

    // Se encontrou 2 ou mais carros, cria o comparativo
    if (carsFound.length >= 2) {
        const compContainer = document.createElement('div');
        compContainer.className = 'chat-comparison';

        // Pega os 2 primeiros
        const car1 = carsFound[0];
        const car2 = carsFound[1];

        compContainer.innerHTML = `
            <div class="comparison-card">
                <img src="${car1.img}">
                <div class="comp-name">${car1.name}</div>
                <div class="comp-price">${car1.price}</div>
            </div>
            <div class="comparison-vs">VS</div>
            <div class="comparison-card">
                <img src="${car2.img}">
                <div class="comp-name">${car2.name}</div>
                <div class="comp-price">${car2.price}</div>
            </div>
        `;

        chatBox.appendChild(compContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
        return true; // Retorna true para impedir o carrossel normal
    }
    return false;
}

// FUNÇÃO: INJETAR CARROSSEL SIMPLES
function injectCarCards(responseText) {
    const lowerText = responseText.toLowerCase();
    const carsFound = [];
    carDatabase.forEach(car => {
        if (car.keywords.some(keyword => lowerText.includes(keyword))) {
            if (!carsFound.includes(car)) carsFound.push(car);
        }
    });
    if (carsFound.length > 0) {
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'chat-car-container';
        const carousel = document.createElement('div');
        carousel.className = 'chat-carousel';
        carsFound.forEach(car => {
            const card = document.createElement('div');
            card.className = 'chat-car-card';
            card.innerHTML = `
                <img src="${car.img}" class="chat-car-img" alt="${car.name}">
                <div class="chat-car-info"><h4>${car.name}</h4><p>${car.price}</p><button class="chat-btn-details" onclick="showCarDetails('${car.name}')">Ver Detalhes</button></div>`;
            carousel.appendChild(card);
        });
        carouselContainer.appendChild(carousel);
        chatBox.appendChild(carouselContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// --- 9. HELPERS (AGENDAMENTO E DETALHES) ---

function appendMessage(text, className) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    if(currentContext === 'mechanic' && className === 'bot-msg') div.style.borderLeftColor = '#ffa500'; 
    div.innerHTML = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

window.showCarDetails = function(carName) {
    const carCard = document.querySelector(`.car-card[data-nome="${carName}"]`);
    if(carCard) carCard.click();
}

document.getElementById('confirm-schedule-btn').addEventListener('click', async () => {
    const date = document.getElementById('date-input').value;
    const time = document.getElementById('time-input').value;
    const phone = document.getElementById('phone-input').value;
    const email = document.getElementById('email-input').value;
    const tipoServico = document.getElementById('service-type').value; 
    const carModel = document.getElementById('car-model-input') ? document.getElementById('car-model-input').value : "Interesse em Compra";

    if(!date || !time || !phone || !email) { alert("Preencha todos os campos!"); return; }
    
    const btn = document.getElementById('confirm-schedule-btn');
    btn.innerText = "Salvando..."; btn.disabled = true;

    try {
        await addDoc(collection(db, "agendamentos"), {
            empresa: "AutoSmart", tipo: tipoServico, modelo_carro: carModel, cliente_whatsapp: phone, cliente_email: email, data_visita: date, hora_visita: time, criado_em: new Date(), resumo_ia: chatHistory.length > 1 ? chatHistory[chatHistory.length-1].parts[0].text.substring(0, 100) + "..." : "Direto"
        });
        const zapMsg = `Agendamento AutoSmart: ${tipoServico} - ${date}`;
        window.open(`https://wa.me/5571991478061?text=${encodeURIComponent(zapMsg)}`, '_blank');
        alert("Agendado com sucesso!");
        scheduleModal.style.display = 'none'; btn.innerText = "Confirmar"; btn.disabled = false;
    } catch (e) { console.error(e); alert("Erro ao agendar."); btn.disabled = false; }
});

// Detalhes Carro
const carModal = document.getElementById('car-details-modal');
if(carModal) {
    document.getElementById('close-car-details').addEventListener('click', () => carModal.style.display = 'none');
    document.querySelectorAll('.car-card').forEach(card => {
        card.addEventListener('click', () => {
            document.getElementById('modal-car-title').innerText = card.dataset.nome;
            document.getElementById('modal-car-price').innerText = card.dataset.preco;
            document.getElementById('modal-car-img').src = card.dataset.img;
            document.getElementById('modal-car-desc').innerText = card.dataset.desc;
            carModal.style.display = 'flex';
        });
    });
    window.openChatWithInterest = function() {
        const nomeCarro = document.getElementById('modal-car-title').innerText;
        carModal.style.display = 'none';
        openAiModal('sales', `Beto, fiquei interessado no ${nomeCarro}. O que ele tem de especial?`);
    }
}