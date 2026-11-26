/* ============================================================
   MVC QUEST — Loop principal, estado do jogo e orquestração
   ============================================================ */

const el = id => document.getElementById(id);

const G = {
  estado: "inicio",          // inicio | jogando | quiz | pausa | faseok | fim
  indiceFase: 0,
  pontos: 0,
  vidas: CONFIG.vidasIniciais,
  fasePontos: 0,
  faseCristais: 0,
  questsFase: [],
  questAtual: null,
  questIndice: 0,
  questsPendentes: [],
  questsAcertadasFase: [],
  tempoRestante: CONFIG.tempoPorQuest,
  tempoLimite: CONFIG.tempoPorQuest,
  erros: 0,
  teclas: {},
  mundo: new Mundo(),
  loopId: null,
  ultimoT: 0
};

/* ============================================================
   HUD
   ============================================================ */
function atualizarHUD() {
  const fase = FASES[G.indiceFase];
  el("hud-fase").textContent = "Fase " + fase.id + " · " + fase.nome;
  el("hud-obj").textContent = fase.tema;

  // vidas
  const v = el("hud-vidas");
  v.innerHTML = "";
  for (let i = 0; i < CONFIG.vidasIniciais; i++) {
    const d = document.createElement("div");
    d.className = "vida" + (i < G.vidas ? "" : " vazia");
    v.appendChild(d);
  }
  el("hud-pontos").textContent = G.pontos;
}

function destacarComponente(nome) {
  const badge = el("mvc-badge");
  badge.querySelectorAll(".mvc").forEach(m => {
    m.classList.toggle("destaque", m.dataset.c === nome);
  });
  const chip = el("quiz-comp");
  if (chip) {
    chip.textContent = NOMES_COMP[nome] || nome;
    chip.dataset.c = nome;
  }
}

/* ============================================================
   Navegação de telas
   ============================================================ */
function mostrar(id) {
  ["tela-inicio", "tela-pausa", "tela-fim", "tela-fase-ok", "quiz"].forEach(t => {
    el(t).classList.add("oculta");
  });
  if (id) el(id).classList.remove("oculta");
}

/* ============================================================
   Início / reinício
   ============================================================ */
function iniciarJogo() {
  G.indiceFase = 0;
  G.pontos = 0;
  G.vidas = CONFIG.vidasIniciais;
  G.erros = 0;
  carregarFase(0);
}

function carregarFase(i) {
  G.indiceFase = i;
  const fase = FASES[i];
  G.mundo.carregar(fase, i);
  G.mundo.cristaisColetados = 0;
  G.fasePontos = 0;
  G.faseCristais = 0;
  G.questsAcertadasFase = [];
  G.questIndice = 0;

  // callbacks do mundo
  G.mundo.onCristal = () => {
    G.pontos += CONFIG.bonusCristal;
    G.fasePontos += CONFIG.bonusCristal;
    G.faseCristais++;
    atualizarHUD();
  };
  G.mundo.onDano = (txt) => {
    G.vidas--;
    atualizarHUD();
    G.mundo.mostrarMsg(txt, 2.2);
    if (G.vidas <= 0) fimDeJogo("Seus núcleos de vida foram esgotados.");
  };
  G.mundo.onInteragir = (g) => abrirQuiz(g);
  G.mundo.onPortao = () => faseConcluida();

  G.estado = "jogando";
  mostrar(null);
  atualizarHUD();
  destacarComponente("Misto");
  el("dica-rodape").textContent = "← → para andar · Espaço para pular · E para conversar com o Guardião";
  if (!G.loopId) G.loopId = requestAnimationFrame(loop);
}

/* ============================================================
   Quiz
   ============================================================ */
function abrirQuiz(guardiao) {
  if (!guardiao.quests.length) return;
  if (G.estado !== "jogando") return;

  G.estado = "quiz";
  G.mundo.interacaoBloqueada = true;
  G.guardiaoAtivo = guardiao;

  // quests ainda não acertadas por este guardião
  if (!guardiao.acertos) guardiao.acertos = [];
  G.questsPendentes = guardiao.quests.filter(i => !guardiao.acertos.includes(i));

  if (!G.questsPendentes.length) return;

  G.questIndice = 0;
  el("quiz").classList.remove("oculta");
  mostrarQuest();
}

function mostrarQuest() {
  const fase = FASES[G.indiceFase];
  const indice = G.questsPendentes[G.questIndice];
  const q = fase.quests[indice];
  G.questAtual = q;

  el("quiz-fase").textContent = "Fase " + fase.id + " · " + fase.nome;
  el("quiz-contador").textContent = "Questão " + (G.questIndice + 1) + "/" + G.questsPendentes.length;
  destacarComponente(q.comp || "Misto");

  UI.renderizar(q);

  // timer
  G.tempoLimite = CONFIG.tempoPorQuest;
  G.tempoRestante = G.tempoLimite;


  el("btn-verificar").classList.remove("oculta");
  el("btn-verificar").disabled = false;
  el("btn-continuar-quiz").classList.add("oculta");
  el("quiz-valor").textContent = CONFIG.pontosBase;
  el("barra-tempo-fill").style.width = "100%";
  el("barra-tempo-fill").classList.remove("perigo");
}

/* ============================================================
   Verificação e progressão das quests
   ============================================================ */
function aoVerificar() {
  const resp = UI.coletar();
  if (!resp) {
    UI.mostrarFeedback({ parcial: true, msg: "Escolha uma resposta antes de verificar." }, G.questAtual);
    return;
  }
  const res = UI.verificar(G.questAtual, resp);
  if (!res) return;
  if (res.parcial) {
    UI.mostrarFeedback(res, G.questAtual);
    return;
  }

  const q = G.questAtual;
  const qiAtual = G.questsPendentes ? G.questsPendentes[G.questIndice] : -1;

  if (res.correta) {
    // bônus por tempo restante
    const bonus = Math.round((G.tempoRestante / G.tempoLimite) * CONFIG.bonusTempo);
    const ganho = CONFIG.pontosBase + bonus;
    G.pontos += ganho;
    G.fasePontos += ganho;
    el("quiz-valor").textContent = ganho;
    UI.mostrarFeedback(res, q, `<b>+${ganho} pontos</b> (base ${CONFIG.pontosBase} + ${bonus} de bônus por velocidade).`);

    // registra o acerto no guardião e na fase
    const g = G.guardiaoAtivo;
    if (g) {
      if (!g.acertos) g.acertos = [];
      if (qiAtual >= 0 && !g.acertos.includes(qiAtual)) g.acertos.push(qiAtual);
    }
    if (!G.questsAcertadasFase) G.questsAcertadasFase = [];
    if (qiAtual >= 0 && !G.questsAcertadasFase.includes(qiAtual)) G.questsAcertadasFase.push(qiAtual);
  } else {
    G.erros++;
    G.vidas--;
    atualizarHUD();
    UI.mostrarFeedback(res, q, `<b>−1 núcleo de vida.</b> Revise a explicação acima antes de seguir.`);
    if (G.vidas <= 0) {
      setTimeout(() => { fecharQuiz(); fimDeJogo("Seus núcleos de vida foram esgotados."); }, 900);
      return;
    }
  }

  el("btn-verificar").classList.add("oculta");
  el("btn-verificar").disabled = true;
  el("btn-continuar-quiz").classList.remove("oculta");
  el("btn-continuar-quiz").focus();

}

function aoContinuarQuiz() {
  if (!G.questsPendentes || !G.questsPendentes.length) { fecharQuiz(); return; }
  G.questIndice++;
  if (G.questIndice < G.questsPendentes.length) {
    mostrarQuest();
    return;
  }
  // terminou o bloco do guardião
  const g = G.guardiaoAtivo;
  if (!g) { fecharQuiz(); return; }
  const gabarito = g.quests.every(qi => (g.acertos || []).includes(qi));
  if (gabarito) {
    g.derrotado = true;
    G.mundo.mostrarMsg(g.nome + " derrotado! O portal avança.", 3.5);
  } else {
    G.mundo.mostrarMsg(g.nome + " resiste: refaça as quests que errou.", 3.5);
  }
  fecharQuiz();
}

function fecharQuiz() {
  el("quiz").classList.add("oculta");
  G.estado = "jogando";
  G.mundo.interacaoBloqueada = false;
  G.questIndice = 0;
  atualizarHUD();
}

/* guarda os acertos por fase */
function resetarAcertosFase() {
  G.questsAcertadasFase = [];
}

/* ============================================================
   Fim de fase
   ============================================================ */
function faseConcluida() {
  G.estado = "faseok";
  const fase = FASES[G.indiceFase];
  const total = fase.quests.length;
  const acertos = (G.questsAcertadasFase || []).length;

  // estrelas: 3 = todas, 2 = 75%+, 1 = passou
  const pct = total ? acertos / total : 1;
  const estrelas = pct >= 1 ? 3 : pct >= 0.75 ? 2 : 1;

  el("fase-ok-titulo").textContent = fase.nome + " — liberada!";
  const cont = el("fase-ok-estrelas");
  cont.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const s = document.createElement("span");
    s.className = "estrela" + (i < estrelas ? " on" : "");
    s.textContent = "★";
    s.style.animationDelay = (i * 120) + "ms";
    cont.appendChild(s);
  }
  el("fase-ok-msg").innerHTML = `Você acertou <b>${acertos}</b> de <b>${total}</b> quests do setor.`;
  el("fase-ok-pontos").textContent = G.fasePontos;
  el("fase-ok-vidas").textContent = G.vidas;
  el("fase-ok-cristais").textContent = G.faseCristais;

  mostrar("tela-fase-ok");
}

function proximaFase() {
  resetarAcertosFase();
  if (G.indiceFase + 1 < FASES.length) {
    carregarFase(G.indiceFase + 1);
  } else {
    vitoria();
  }
}

function vitoria() {
  G.estado = "fim";
  el("fim-titulo").textContent = "Núcleo estabilizado!";
  el("fim-msg").innerHTML = "Você dominou o MVC! O núcleo foi estabilizado e a aplicação está mais limpa do que nunca.";
  el("fim-pontos").textContent = G.pontos;
  el("fim-fase").textContent = FASES.length;
  el("btn-reiniciar").textContent = "Nova expedição";
  mostrar("tela-fim");
}

function fimDeJogo(msg) {
  G.estado = "fim";
  el("fim-titulo").textContent = "Núcleo instável";
  el("fim-msg").textContent = msg;
  el("fim-pontos").textContent = G.pontos;
  el("fim-fase").textContent = G.indiceFase + 1;
  el("btn-reiniciar").textContent = "Tentar novamente";
  mostrar("tela-fim");
}

/* ============================================================
   Loop
   ============================================================ */
function loop(t) {
  const dt = Math.min(3, (t - G.ultimoT) / 16.67 || 1);
  G.ultimoT = t;

  if (G.estado === "jogando") {
    G.mundo.atualiza(dt, G.teclas);
    if (G.estado === "jogando") {
      G.mundo.desenha();
    }
  } else if (G.estado === "quiz") {
    // a cena congela atrás do modal
    if (G.mundo.fase) G.mundo.desenha();
    atualizarTempo();
  }

  G.loopId = requestAnimationFrame(loop);
}

function atualizarTempo() {
  if (G.estado !== "quiz") return;
  // o timer congela assim que a quest é respondida (manual ou por timeout)
  if (UI.respondida) return;

  G.tempoRestante = Math.max(0, G.tempoRestante - 1 / 60);
  const pct = Math.max(0, G.tempoRestante / G.tempoLimite);
  const bar = el("barra-tempo-fill");
  bar.style.width = (pct * 100) + "%";
  bar.classList.toggle("perigo", pct < 0.3);

  if (G.tempoRestante <= 0) {
    // tempo esgotado: conta como erro e revela o gabarito
    const resp = UI.coletar();
    if (resp) UI.verificar(G.questAtual, resp);
    else UI.revelarGabarito(G.questAtual);
    G.erros++;
    G.vidas--;
    atualizarHUD();
    UI.mostrarFeedback(
      { correta: false, acertos: 0, total: 1 },
      G.questAtual,
      "<b>Tempo esgotado! −1 núcleo de vida.</b> A resposta correta está marcada abaixo."
    );
    el("btn-verificar").classList.add("oculta");
    el("btn-continuar-quiz").classList.remove("oculta");
    if (G.vidas <= 0) {
      setTimeout(() => { fecharQuiz(); fimDeJogo("Seus núcleos de vida foram esgotados."); }, 900);
    }
  }
}

/* ============================================================
   Entrada
   ============================================================ */
window.addEventListener("keydown", ev => {
  const k = ev.key;

  if (k === "Escape") {
    if (G.estado === "jogando") pausar();
    else if (G.estado === "pausa") continuar();
    ev.preventDefault();
    return;
  }

  if (G.estado === "quiz") {
    if (k === "Enter" && !UI.respondida) {
      ev.preventDefault();
      aoVerificar();
    }
    return;
  }

  if (G.estado === "jogando") {
    if (k === "e" || k === "E") {
      ev.preventDefault();
      G.teclas["e"] = true;
      G.mundo.atualiza(0.016, G.teclas);
      G.teclas["e"] = false;
      return;
    }
    G.teclas[k] = true;
    if ([" ", "ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].includes(k)) ev.preventDefault();
  }
});

window.addEventListener("keyup", ev => {
  G.teclas[ev.key] = false;
});

function pausar() {
  if (G.estado !== "jogando") return;
  G.estado = "pausa";
  mostrar("tela-pausa");
}
function continuar() {
  if (G.estado !== "pausa") return;
  G.estado = "jogando";
  mostrar(null);
}

/* ============================================================
   Bindings da UI
   ============================================================ */
el("btn-comecar").addEventListener("click", () => { resetarAcertosFase(); iniciarJogo(); });
el("btn-continuar").addEventListener("click", continuar);
el("btn-reiniciar-pausa").addEventListener("click", () => { resetarAcertosFase(); iniciarJogo(); });
el("btn-reiniciar").addEventListener("click", () => { resetarAcertosFase(); iniciarJogo(); });
el("btn-proxima").addEventListener("click", proximaFase);
el("btn-pausa").addEventListener("click", () => { G.estado === "pausa" ? continuar() : pausar(); });
el("btn-verificar").addEventListener("click", aoVerificar);
el("btn-continuar-quiz").addEventListener("click", aoContinuarQuiz);

/* ============================================================
   Boot
   ============================================================ */
atualizarHUD();
mostrar("tela-inicio");
G.ultimoT = performance.now();
G.loopId = requestAnimationFrame(loop);
