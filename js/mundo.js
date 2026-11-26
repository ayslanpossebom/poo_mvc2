/* ============================================================
   MVC QUEST — Motor do mundo (canvas 2D)
   ============================================================ */

const CANVAS = document.getElementById("game");
const CTX = CANVAS.getContext("2d");

const W = CANVAS.width;   // 960
const H = CANVAS.height;  // 512
const GRAV = 0.55;
const VEL_MAX = 4.6;
const PULO_V = 10.5;

const TILE = 20;

/* ---------------- Paletas de fundo por fase ---------------- */
const FUNDOS = {
  terminal: { topo: "#0a0f20", base: "#111a33", grade: "#1c2b4d", acento: "#7c5cff", particulas: "#8b7bff" },
  cozinha:  { topo: "#1a1207", base: "#2a1d0c", grade: "#3d2a12", acento: "#ffb454", particulas: "#ffd08a" },
  legado:   { topo: "#150a12", base: "#241018", grade: "#3a1a2a", acento: "#ff6b7a", particulas: "#ff9aa8" },
  dados:    { topo: "#06180f", base: "#0c2a1e", grade: "#153f2e", acento: "#4dd6a4", particulas: "#7df0c4" },
  console:  { topo: "#08131f", base: "#0f2436", grade: "#1a3b52", acento: "#5aa9ff", particulas: "#8fcaff" },
  nucleo:   { topo: "#1c1503", base: "#2e2408", grade: "#4a3a12", acento: "#ffd166", particulas: "#ffe4a3" }
};

/* ---------------- Classes de entidades ---------------- */

class Jogador {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.larg = 26; this.alt = 40;
    this.noChao = false;
    this.face = 1;
    this.andando = false;
    this.invuln = 0;
    this.anim = 0;
  }

  get topo() { return this.y; }
  get base() { return this.y + this.alt; }

  andar(dir, dt) {
    this.andando = dir !== 0;
    if (dir !== 0) {
      this.face = dir;
      this.vx += dir * 0.62;
    }
    this.vx *= 0.82;
    if (Math.abs(this.vx) > VEL_MAX) this.vx = Math.sign(this.vx) * VEL_MAX;
    if (Math.abs(this.vx) < 0.05) this.vx = 0;
  }

  pular() {
    if (this.noChao) {
      this.vy = -PULO_V;
      this.noChao = false;
      return true;
    }
    return false;
  }

  atualiza(dt, fase, teclas) {
    let dir = 0;
    if (teclas["ArrowLeft"] || teclas["a"]) dir = -1;
    if (teclas["ArrowRight"] || teclas["d"]) dir = 1;

    this.andar(dir, dt);

    if ((teclas[" "] || teclas["ArrowUp"] || teclas["w"]) && this.noChao) {
      this.pular();
      teclas[" "] = false;
    }

    this.vy += GRAV;
    if (this.vy > 11) this.vy = 11;

    // colisão X
    const yAnt = this.y;
    this.x += this.vx;
    this.x = Math.max(0, Math.min(fase.largura - this.larg, this.x));
    this.colideX(fase, yAnt);

    // colisão Y
    this.y += this.vy;
    this.noChao = false;
    this.colideY(fase, yAnt);

    if (this.invuln > 0) this.invuln--;
    this.anim += Math.abs(this.vx) * 0.06 + 0.03;
  }

  colideX(fase, yAnt) {
    for (const p of fase.plataformas) {
      const [px, py, pw, ph] = p;
      // só colide lateralmente se o corpo do jogador está na faixa vertical da plataforma
      const faixa = this.y + this.alt > py + 4 && this.y < py + ph - 4;
      if (!faixa) continue;
      if (this.x + this.larg > px && this.x < px + pw) {
        if (this.vx > 0) this.x = px - this.larg;
        else if (this.vx < 0) this.x = px + pw;
        this.vx = 0;
      }
    }
  }

  colideY(fase, yAnt) {
    for (const p of fase.plataformas) {
      const [px, py, pw, ph] = p;
      if (this.x + this.larg <= px || this.x >= px + pw) continue;
      // velocidade aplicada neste passo
      const dy = this.vy;
      // aterrissagem: estava acima do topo e agora está abaixo
      if (dy >= 0 && yAnt + this.alt <= py + 2 && this.y + this.alt >= py) {
        this.y = py - this.alt;
        this.vy = 0;
        this.noChao = true;
      }
      // bonde: estava abaixo da base e agora está acima
      else if (dy < 0 && yAnt >= py + ph - 2 && this.y <= py + ph) {
        this.y = py + ph;
        this.vy = 0;
      }
    }
  }
}

class Cristal {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.coletado = false;
    this.fase = 0;
    this.baseY = y;
  }
  atualiza() {
    if (this.coletado) return;
    this.fase += 0.08;
    this.y = this.baseY + Math.sin(this.fase) * 4;
  }
}

class Guardiao {
  constructor(dados, quests, indice, identidade) {
    Object.assign(this, dados);
    this.quests = quests;
    this.indice = indice;
    // nome e lema vêm da identidade da fase (ou do próprio guardião)
    this.nome = dados.nome || (identidade && identidade.nome) || "GUARDIÃO";
    this.cor = (identidade && identidade.cor) || dados.cor || "#7c5cff";
    this.lema = (identidade && identidade.lema) || "";
    this.ativo = false;
    this.derrotado = false;
    this.pulsando = 0;
    this.bob = Math.random() * Math.PI * 2;
    this.acertos = [];
  }
  atualiza() {
    this.bob += 0.03;
    if (this.ativo && !this.derrotado) this.pulsando = (this.pulsando + 0.06) % (Math.PI * 2);
  }
}

/* ---------------- Portão ---------------- */
class Portao {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.larg = 56; this.alt = 96;
    this.aberto = false;
    this.progresso = 0;
  }
  atualiza(dt) {
    const alvo = this.aberto ? 1 : 0;
    this.progresso += (alvo - this.progresso) * 0.08;
  }
}

/* ---------------- Partículas (fundo) ---------------- */
class Particulas {
  constructor(cor) { this.cor = cor; this.itens = []; }
  recriar(cor) {
    this.cor = cor;
    this.itens = [];
    for (let i = 0; i < 46; i++) {
      this.itens.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.9 + 0.5,
        v: Math.random() * 0.35 + 0.08,
        a: Math.random() * 0.5 + 0.12
      });
    }
  }
  atualiza() {
    for (const p of this.itens) {
      p.y -= p.v;
      if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
    }
  }
  desenha(ctx) {
    ctx.save();
    for (const p of this.itens) {
      ctx.globalAlpha = p.a;
      ctx.fillStyle = this.cor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

/* ============================================================
   Mundo — controla a fase atual, câmera e renderização
   ============================================================ */
class Mundo {
  constructor() {
    this.fase = null;
    this.jogador = null;
    this.cristais = [];
    this.guardioes = [];
    this.portao = null;
    this.particulas = new Particulas("#8b7bff");
    this.camX = 0;
    this.msg = null;
    this.msgTempo = 0;
    this.tempo = 0;
  }

  carregar(fase, indice) {
    this.fase = fase;
    this.jogador = new Jogador(fase.spawn.x, fase.spawn.y);
    this.cristais = fase.cristais.map(c => new Cristal(c.x, c.y));
    this.guardioes = fase.guardioes.map((g, i) => new Guardiao(g, g.quests, i, fase.guarda));
    this.portao = new Portao(fase.portao.x, fase.portao.y);
    this.particulas.recriar(FUNDOS[fase.fundo].particulas);
    this.camX = 0;
    this.tempo = 0;
    this.msg = null;
    this.msgTempo = 0;
    this.checkpoint = { x: fase.spawn.x, y: fase.spawn.y };
  }

  mostrarMsg(txt, seg = 3) {
    this.msg = txt;
    this.msgTempo = seg * 60;
  }

  atualiza(dt, teclas) {
    this.tempo += dt;
    this.particulas.atualiza();
    this.portao.atualiza(dt);
    for (const c of this.cristais) c.atualiza();
    for (const g of this.guardioes) g.atualiza();

    const p = this.jogador;
    p.invuln = Math.max(0, p.invuln - 1);

    // física do jogador
    p.atualiza(dt, this.fase, teclas);

    // câmera segue o jogador
    const alvoCam = p.x - W * 0.38;
    this.camX += (alvoCam - this.camX) * 0.12;
    this.camX = Math.max(0, Math.min(this.fase.largura - W, this.camX));

    // queda no vazio: volta ao último checkpoint
    if (p.y > H + 120) {
      this.dano("Você caiu no vazio!");
      const cp = this.checkpoint || { x: this.fase.spawn.x, y: this.fase.spawn.y };
      p.x = cp.x;
      p.y = cp.y;
      p.vx = 0;
      p.vy = 0;
      p.invuln = 40;
      return;
    }

    // colisão com guardiões: funcionam como parede — só se passa derrotando-os
    for (const g of this.guardioes) {
      if (g.derrotado) continue;
      const gx0 = g.x - 22, gx1 = g.x + 22;
      const gy0 = g.y - 60, gy1 = g.y;
      if (p.x + p.larg > gx0 && p.x < gx1 && p.y + p.alt > gy0 && p.y < gy1) {
        if (p.vx > 0) { p.x = gx0 - p.larg; p.vx = 0; }
        else if (p.vx < 0) { p.x = gx1; p.vx = 0; }
        p.x = Math.max(0, Math.min(this.fase.largura - p.larg, p.x));
      }
      // ativação: o guardião acorda quando o jogador chega perto
      if (!g.ativo && Math.abs(p.x - g.x) < 140) {
        g.ativo = true;
        this.mostrarMsg("Pressione E para falar com " + g.nome, 4);
      }
    }

    // cristais
    for (const c of this.cristais) {
      if (c.coletado) continue;
      const dx = Math.abs(p.x + p.larg / 2 - c.x);
      const dy = Math.abs(p.y + p.alt / 2 - c.y);
      if (dx < 26 && dy < 30) {
        c.coletado = true;
        this.cristaisColetados = (this.cristaisColetados || 0) + 1;
        this.onCristal && this.onCristal();
      }
    }

    // checkpoint: ao pisar numa plataforma já visitada, grava a posição
    if (!this.checkpoint || p.x > this.checkpoint.x + 40) {
      const plat = this.fase.plataformas.find(pl =>
        p.x + p.larg / 2 >= pl[0] && p.x + p.larg / 2 <= pl[0] + pl[2] &&
        Math.abs((p.y + p.alt) - pl[1]) < 4);
      if (plat) {
        this.checkpoint = { x: plat[0] + Math.floor(plat[2] / 2) - 13, y: plat[1] - 40 };
      }
    }

    // portão
    if (!this.portao.aberto && this.todosDerrotados()) {
      this.portao.aberto = true;
      this.mostrarMsg("Portal liberado! Corra para o portão!", 4);
    }
    if (this.portao.aberto) {
      const dx = Math.abs(p.x + p.larg / 2 - (this.portao.x + this.portao.larg / 2));
      if (dx < 40 && p.y + p.alt >= this.portao.y - 10) {
        this.onPortao && this.onPortao();
      }
    }

    // teclas: interagir
    if ((teclas["e"] || teclas["E"]) && !this.interacaoBloqueada) {
      teclas["e"] = false;
      for (const g of this.guardioes) {
        if (!g.derrotado && Math.abs(p.x - g.x) < 110) {
          this.onInteragir && this.onInteragir(g);
          break;
        }
      }
    }

    if (this.msgTempo > 0) this.msgTempo--;
  }

  todosDerrotados() {
    return this.guardioes.every(g => g.derrotado);
  }

  dano(texto) {
    this.onDano && this.onDano(texto);
  }

  /* ---------------- Renderização ---------------- */
  desenha() {
    const f = this.fase;
    const pal = FUNDOS[f.fundo];
    const cam = this.camX;

    // céu
    const g = CTX.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, pal.topo);
    g.addColorStop(1, pal.base);
    CTX.fillStyle = g;
    CTX.fillRect(0, 0, W, H);

    // grade de fundo com parallax
    CTX.save();
    CTX.strokeStyle = pal.grade;
    CTX.globalAlpha = 0.5;
    CTX.lineWidth = 1;
    const off = (cam * 0.35) % TILE;
    CTX.beginPath();
    for (let x = -off; x < W + TILE; x += TILE) {
      CTX.moveTo(x, 0); CTX.lineTo(x, H);
    }
    for (let y = 0; y < H; y += TILE) {
      CTX.moveTo(0, y); CTX.lineTo(W, y);
    }
    CTX.stroke();
    CTX.restore();

    // silhueta de fundo (parallax lento)
    CTX.save();
    CTX.globalAlpha = 0.35;
    CTX.fillStyle = pal.base;
    const px = (cam * 0.55) % 140;
    for (let i = -1; i < 8; i++) {
      const bx = i * 140 - px;
      const alt = 120 + ((i * 53) % 90);
      CTX.fillRect(bx, H - 60 - alt, 90, alt + 60);
    }
    CTX.restore();

    this.particulas.desenha(CTX);

    // mundo (com deslocamento de câmera)
    CTX.save();
    CTX.translate(-cam, 0);

    this.desenhaPlataformas(pal);
    this.desenhaCristais();
    this.desenhaGuardioes();
    this.desenhaPortao(pal);
    this.desenhaJogador();

    CTX.restore();

    // mensagem central
    if (this.msgTempo > 0 && this.msg) {
      const alpha = Math.min(1, this.msgTempo / 30);
      CTX.save();
      CTX.globalAlpha = alpha;
      CTX.font = "600 15px Inter, sans-serif";
      CTX.textAlign = "center";
      const tw = CTX.measureText(this.msg).width;
      CTX.fillStyle = "rgba(7,11,22,.86)";
      CTX.fillRect(W / 2 - tw / 2 - 18, 74, tw + 36, 36);
      CTX.strokeStyle = pal.acento;
      CTX.lineWidth = 1;
      CTX.strokeRect(W / 2 - tw / 2 - 18, 74, tw + 36, 36);
      CTX.fillStyle = "#e8eefc";
      CTX.fillText(this.msg, W / 2, 97);
      CTX.restore();
    }
  }

  desenhaPlataformas(pal) {
    for (const [x, y, w, h] of this.fase.plataformas) {
      // corpo
      const g = CTX.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, "#1b2440");
      g.addColorStop(1, "#0d1426");
      CTX.fillStyle = g;
      CTX.fillRect(x, y, w, h);
      // topo iluminado
      CTX.fillStyle = pal.acento;
      CTX.globalAlpha = 0.85;
      CTX.fillRect(x, y, w, 3);
      CTX.globalAlpha = 1;
      // detalhes
      CTX.strokeStyle = "rgba(255,255,255,.045)";
      CTX.lineWidth = 1;
      CTX.beginPath();
      for (let i = 0; i < w; i += 22) {
        CTX.moveTo(x + i + 10, y + 4);
        CTX.lineTo(x + i + 10, y + h);
      }
      CTX.stroke();
    }
  }

  desenhaCristais() {
    for (const c of this.cristais) {
      if (c.coletado) continue;
      const cor = "#7df0c4";
      CTX.save();
      CTX.translate(c.x, c.y);
      CTX.rotate(Math.sin(c.fase) * 0.25);
      CTX.shadowColor = cor;
      CTX.shadowBlur = 14;
      CTX.fillStyle = cor;
      CTX.beginPath();
      CTX.moveTo(0, -11); CTX.lineTo(8, 0); CTX.lineTo(0, 11); CTX.lineTo(-8, 0);
      CTX.closePath();
      CTX.fill();
      CTX.restore();
    }
  }

  desenhaGuardioes() {
    for (const g of this.guardioes) {
      const baseY = g.y;
      const bob = Math.sin(g.bob) * 4;
      const x = g.x, y = baseY + bob;

      // sombra
      CTX.save();
      CTX.globalAlpha = 0.35;
      CTX.fillStyle = "#000";
      CTX.beginPath();
      CTX.ellipse(x, baseY + 2, 26, 7, 0, 0, Math.PI * 2);
      CTX.fill();
      CTX.restore();

      // corpo
      CTX.save();
      CTX.translate(x, y);
      const cor = g.derrotado ? "#3a4767" : g.cor;
      const glow = g.derrotado ? 0 : (0.35 + Math.sin(g.pulsando) * 0.2);

      CTX.shadowColor = cor;
      CTX.shadowBlur = g.derrotado ? 0 : 18 + glow * 16;

      // corpo (retângulo arredondado com "bico")
      CTX.fillStyle = "#111a31";
      CTX.strokeStyle = cor;
      CTX.lineWidth = 2.5;
      CTX.beginPath();
      CTX.roundRect(-24, -58, 48, 58, 10);
      CTX.stroke();
      CTX.fill();

      // "olho"
      const olhoY = g.derrotado ? -34 : -36;
      CTX.shadowBlur = 0;
      CTX.fillStyle = g.derrotado ? "#4b5a7d" : cor;
      CTX.beginPath();
      CTX.arc(0, olhoY, 7, 0, Math.PI * 2);
      CTX.fill();

      // "olho" interior
      if (!g.derrotado) {
        CTX.fillStyle = "#0a0f1e";
        CTX.beginPath();
        CTX.arc(Math.cos(g.pulsando) * 2.5, olhoY, 3, 0, Math.PI * 2);
        CTX.fill();
      } else {
        // X
        CTX.strokeStyle = "#4b5a7d";
        CTX.lineWidth = 2;
        CTX.beginPath();
        CTX.moveTo(-4, olhoY - 4); CTX.lineTo(4, olhoY + 4);
        CTX.moveTo(4, olhoY - 4); CTX.lineTo(-4, olhoY + 4);
        CTX.stroke();
      }

      // antena
      CTX.strokeStyle = cor;
      CTX.lineWidth = 2;
      CTX.beginPath();
      CTX.moveTo(0, -58); CTX.lineTo(0, -70);
      CTX.stroke();
      CTX.fillStyle = cor;
      CTX.beginPath();
      CTX.arc(0, -74, 4, 0, Math.PI * 2);
      CTX.fill();

      // base/rodapé
      CTX.fillStyle = cor;
      CTX.globalAlpha = 0.55;
      CTX.fillRect(-18, -8, 36, 8);
      CTX.globalAlpha = 1;

      CTX.restore();

      // etiqueta (acima da cabeça)
      CTX.save();
      CTX.textAlign = "center";
      CTX.font = "700 9px 'Press Start 2P', monospace";
      CTX.fillStyle = g.derrotado ? "#4b5a7d" : cor;
      CTX.fillText(g.nome, x, baseY - 122 + bob);
      CTX.restore();

      // prompt de interação
      const p = this.jogador;
      if (!g.derrotado && Math.abs(p.x - g.x) < 110) {
        CTX.save();
        CTX.textAlign = "center";
        CTX.font = "700 12px Inter, sans-serif";
        const label = "[E] Falar";
        const tw = CTX.measureText(label).width;
        const py0 = baseY - 104 + bob;
        CTX.fillStyle = "rgba(7,11,22,.86)";
        CTX.fillRect(x - tw / 2 - 10, py0, tw + 20, 24);
        CTX.strokeStyle = "#ffd166";
        CTX.lineWidth = 1;
        CTX.strokeRect(x - tw / 2 - 10, py0, tw + 20, 24);
        CTX.fillStyle = "#ffd166";
        CTX.fillText(label, x, py0 + 17);
        CTX.restore();
      }
    }
  }

  desenhaPortao(pal) {
    const p = this.portao;
    const altVis = p.alt * (1 - p.progresso);
    CTX.save();
    CTX.translate(p.x + p.larg / 2, p.y);

    // moldura
    CTX.strokeStyle = p.aberto ? "#4dd6a4" : pal.acento;
    CTX.lineWidth = 3;
    CTX.globalAlpha = p.aberto ? 1 : 0.7;
    CTX.strokeRect(-p.larg / 2, -p.alt, p.larg, p.alt);
    CTX.globalAlpha = 1;

    // energia
    if (altVis > 4) {
      const g = CTX.createLinearGradient(0, -altVis, 0, 0);
      g.addColorStop(0, p.aberto ? "#4dd6a4" : pal.acento);
      g.addColorStop(1, "rgba(0,0,0,0)");
      CTX.fillStyle = g;
      CTX.globalAlpha = 0.42;
      CTX.fillRect(-p.larg / 2 + 3, -altVis, p.larg - 6, altVis);
      CTX.globalAlpha = 1;
    }

    CTX.textAlign = "center";
    CTX.font = "700 9px 'Press Start 2P', monospace";
    CTX.fillStyle = p.aberto ? "#4dd6a4" : pal.acento;
    CTX.fillText(p.aberto ? "SAÍDA" : "TRANCADO", 0, -p.alt - 12);

    CTX.restore();
  }

  desenhaJogador() {
    const p = this.jogador;
    CTX.save();
    if (p.invuln > 0 && Math.floor(p.invuln / 4) % 2 === 0) CTX.globalAlpha = 0.4;
    CTX.translate(p.x + p.larg / 2, p.y + p.alt / 2);

    // sombra
    CTX.save();
    CTX.globalAlpha = 0.4;
    CTX.fillStyle = "#000";
    CTX.beginPath();
    CTX.ellipse(0, p.alt / 2 - 2, 12, 4, 0, 0, Math.PI * 2);
    CTX.fill();
    CTX.restore();

    CTX.scale(p.face, 1);

    // corpo
    CTX.fillStyle = "#e8eefc";
    CTX.strokeStyle = "#5aa9ff";
    CTX.lineWidth = 2;
    CTX.beginPath();
    CTX.roundRect(-11, -16, 22, 32, 6);
    CTX.fill();
    CTX.stroke();

    // visor
    CTX.fillStyle = "#0d1426";
    CTX.beginPath();
    CTX.roundRect(-8, -12, 16, 11, 4);
    CTX.fill();
    CTX.fillStyle = "#7df0c4";
    CTX.beginPath();
    CTX.arc(3, -6, 2.6, 0, Math.PI * 2);
    CTX.fill();

    // antena com o "M" do MVC
    CTX.strokeStyle = "#5aa9ff";
    CTX.lineWidth = 2;
    CTX.beginPath();
    CTX.moveTo(-6, -16); CTX.lineTo(-10, -24);
    CTX.stroke();
    CTX.fillStyle = "#ffd166";
    CTX.beginPath();
    CTX.arc(-10, -26, 3.4, 0, Math.PI * 2);
    CTX.fill();

    // braços
    const balanco = p.andando ? Math.sin(p.anim * 6) * 4 : 0;
    CTX.strokeStyle = "#e8eefc";
    CTX.lineWidth = 3;
    CTX.beginPath();
    CTX.moveTo(-9, -2); CTX.lineTo(-13 - balanco, 4);
    CTX.stroke();
    CTX.beginPath();
    CTX.moveTo(9, -2); CTX.lineTo(13 + balanco, 4);
    CTX.stroke();

    // pernas
    CTX.strokeStyle = "#5aa9ff";
    CTX.lineWidth = 3.5;
    CTX.beginPath();
    CTX.moveTo(-4, 15); CTX.lineTo(-4 - balanco * 0.8, 20);
    CTX.stroke();
    CTX.beginPath();
    CTX.moveTo(4, 15); CTX.lineTo(4 + balanco * 0.8, 20);
    CTX.stroke();

    CTX.restore();
  }
}
