/* ==========================================================
   ANALOG HORROR — SCRIPT PRINCIPAL
   ==========================================================
   Seções:
   1. Dados (imagens, frases)
   2. Elementos do DOM
   3. Estado global
   4. Site normal (imagem + frases)
   5. Evento do "0" (blackout + imagem 9 + devoradora + som)
   6. Inicialização
========================================================== */


/* ==========================================================
   1. DADOS
========================================================== */

const imagens = [
    "images/alicia.png",
    "images/Emma.png",
    "images/erica.png",
    "images/marcos.png",
    "images/Maria.png",
    "images/sabrina.png",
    "images/santiago.png",
    "images/thiago.png"
];

const frasesPossiveis = [
    "Algumas pessoas não podem existir.",
    "covarde.",
    "O corpo é um templo.",
    "Sol brilha para todos, menos a ti.",
    "Sofri com a sua ausência.",
    "Seja esquecido.",
    "Você foi visto.",
    "Seu nome foi retirado.",
    "O céu não te reconhece.",
    "Há coisas que não deveriam ser lembradas.",
    "Seu pecado permanece.",
    "A porta já foi fechada.",
    "Não há perdão para todos.",
    "Você não foi escolhido.",
    "O silêncio foi sua sentença.",
    "Ele sabe o que você fez.",
    "Você deveria ter permanecido morto.",
    "Sua existência foi um erro.",
    "Não olhe para cima.",
    "Já é tarde demais.",
    "Ninguém sentirá sua falta.",
    "Seu lugar não é aqui.",
    "Você foi deixado para trás.",
    "O julgamento começou.",
    "Alguns pecados não podem ser perdoados.",
    "Você não deveria ter sido encontrado.",
    "A luz não alcança você.",
    "Seu nome não será lembrado.",
    "Aquilo que te viu ainda está olhando.",
    "Você não está entre os perdoados."
];

// Mesmo índice de "imagens" — cada frase pertence a uma imagem
const frasesImagem = [
    "nunca insaciavel",
    "criminoso de ficha",
    "talvez um Canibal",
    "sempre sedutor",
    "nunca guloso",
    "ele nunca suportou",
    "sempre confusa",
    "uma icognita"
];

// Caminho do áudio da devoradora
const SOM_DEVORADORA = "sounds/devoradora.mp3";


/* ==========================================================
   2. ELEMENTOS DO DOM
========================================================== */

const imagem = document.getElementById("imagem");
const fraseImagem = document.getElementById("fraseImagem");

const blackout = document.getElementById("blackout");
const cenaFinal = document.getElementById("cenaFinal");
const imagem9 = document.getElementById("imagem9");

const devoradoraContainer = document.getElementById("devoradoraContainer");


/* ==========================================================
   3. ESTADO GLOBAL
========================================================== */

let eventoAtivo = false;
let indiceEscolhido = 0;


/* ==========================================================
   4. SITE NORMAL
========================================================== */

function imagemAleatoria() {

    indiceEscolhido = Math.floor(Math.random() * imagens.length);

    imagem.src = imagens[indiceEscolhido];
    imagem.style.opacity = "1";
}

function mostrarFraseDaImagem() {

    if (eventoAtivo) return;

    fraseImagem.innerText = frasesImagem[indiceEscolhido];
    fraseImagem.style.opacity = "1";
}

function criarFrases() {

    const quantidade = Math.floor(Math.random() * 60);

    for (let i = 0; i < quantidade; i++) {

        const frase = document.createElement("div");
        frase.className = "frase";

        frase.innerText =
            frasesPossiveis[Math.floor(Math.random() * frasesPossiveis.length)];

        document.body.appendChild(frase);

        // Posição (evita o centro, onde fica a imagem)
        let x, y;
        do {
            x = 3 + Math.random() * 82;
            y = 3 + Math.random() * 90;
        } while (x > 27 && x < 73 && y > 20 && y < 80);

        frase.style.left = x + "vw";
        frase.style.top = y + "vh";

        frase.style.fontSize = (11 + Math.random() * 7) + "px";
        frase.style.transform = `rotate(${-8 + Math.random() * 16}deg)`;

        const tipos = ["flicker1", "flicker2", "flicker3", "flicker4"];
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        const velocidade = 0.5 + Math.random() * 3;

        frase.style.animation = `${tipo} ${velocidade}s infinite`;
        frase.style.animationDelay = (-Math.random() * velocidade) + "s";
    }
}


/* ==========================================================
   5. EVENTO DO "0"
========================================================== */

function iniciarEventoZero() {

    if (eventoAtivo) return;

    eventoAtivo = true;

    // Esconde tudo do site normal
    imagem.style.opacity = "0";
    fraseImagem.style.opacity = "0";
    document.querySelectorAll(".frase").forEach((el) => el.remove());

    // Tela preta
    blackout.classList.add("mostrar");

    // Depois de alguns segundos: imagem 9 direto + devoradora + som
    setTimeout(() => {

        blackout.classList.remove("mostrar");

        imagem9.style.transition = "none";
        imagem9.style.opacity = "1";

        cenaFinal.style.visibility = "visible";
        cenaFinal.style.opacity = "1";

        tocarSomDevoradora();
        iniciarSpamDevoradora();

    }, 3000);
}

function tocarSomDevoradora() {

    const som = new Audio(SOM_DEVORADORA);
    som.volume = 0.7;
    som.play().catch((erro) => {
        console.log("Não foi possível tocar o áudio:", erro);
    });
}

function iniciarSpamDevoradora() {

    function criarDevoradora() {

        if (!eventoAtivo) return;

        const texto = document.createElement("div");
        texto.className = "devoradora";
        texto.innerText = "DEVORADORA";

        devoradoraContainer.appendChild(texto);

        // Posição horizontal aleatória (onde tiver espaço)
        const larguraTexto = texto.offsetWidth || 300;
        const margem = 20;
        const maxX = window.innerWidth - larguraTexto - margem;
        const posX = margem + Math.random() * Math.max(0, maxX - margem);

        texto.style.left = posX + "px";

        // Começa abaixo da tela
        let posicao = window.innerHeight;
        texto.style.top = posicao + "px";

        const velocidade = 18;

        function subir() {

            posicao -= velocidade;
            texto.style.top = posicao + "px";

            if (posicao < -100) {
                texto.remove();
                return;
            }

            requestAnimationFrame(subir);
        }

        subir();

        setTimeout(criarDevoradora, 80);
    }

    criarDevoradora();
}


/* ==========================================================
   6. INICIALIZAÇÃO
========================================================== */

document.addEventListener("keydown", (evento) => {

    if (evento.key === "0" || evento.code === "Numpad0") {
        iniciarEventoZero();
    }
});

function iniciar() {

    imagemAleatoria();
    criarFrases();

    setTimeout(mostrarFraseDaImagem, 4000);
}

iniciar();