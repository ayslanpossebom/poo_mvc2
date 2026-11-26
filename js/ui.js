/* ============================================================
   MVC QUEST — Renderização e verificação das atividades
   ============================================================ */

const UI = (() => {

  const corpo = () => document.getElementById("quiz-corpo");
  const feedback = () => document.getElementById("quiz-feedback");
  const btnVerificar = () => document.getElementById("btn-verificar");
  const btnContinuar = () => document.getElementById("btn-continuar-quiz");

  /* Estado corrente da quest */
  let quest = null;
  let respondida = false;
  let coletor = null;   // função que coleta a resposta do jogador

  function limpar() {
    corpo().innerHTML = "";
    feedback().className = "quiz-feedback vazio";
    feedback().innerHTML = "";
    btnVerificar().classList.remove("oculta");
    btnVerificar().disabled = false;
    btnContinuar().classList.add("oculta");
    coletor = null;
    respondida = false;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- utilidades de bloco de código ---------- */
  function bloco(txt) {
    return `<span class="bloco">${esc(txt)}</span>`;
  }

  function enunciadoHTML(q) {
    let h = `<p class="enunciado">${q.enunciado}`;
    if (q.codigo) {
      // substitui {{n}} por span de gap
      h = h.replace(/\{\{(\d+)\}\}/g, (m, n) => `<span class="gap-slot" data-gap="${n}">?</span>`);
    }
    h += `</p>`;
    return h;
  }

  /* ============================================================
     TIPOS DE ATIVIDADE
     ============================================================ */

  /* ---------- 1. Múltipla escolha ---------- */
  function renderAlternativas(q) {
    const c = corpo();
    let h = enunciadoHTML(q);
    h += '<div class="opcoes">';
    q.opcoes.forEach((op, i) => {
      const letra = String.fromCharCode(97 + i);
      h += `<button class="opcao" data-i="${i}">
              <span class="letra">${letra}</span>
              <span>${op.t}</span>
            </button>`;
    });
    h += '</div>';
    c.innerHTML = h;

    let sel = -1;
    c.querySelectorAll(".opcao").forEach(b => {
      b.addEventListener("click", () => {
        if (respondida) return;
        c.querySelectorAll(".opcao").forEach(o => o.classList.remove("sel"));
        b.classList.add("sel");
        sel = parseInt(b.dataset.i, 10);
      });
    });

    coletor = () => (sel < 0 ? null : { tipo: "alternativas", i: sel });
  }

  /* ---------- 2. Múltiplas corretas (caixas) ---------- */
  function renderMultiplas(q) {
    const c = corpo();
    let h = enunciadoHTML(q);
    h += '<div class="grade">';
    q.itens.forEach((it, i) => {
      h += `<div class="caixa" data-i="${i}">
              <div class="cx-titulo">Opção ${String.fromCharCode(65 + i)}</div>
              <div class="cx-desc">${it.t}</div>
            </div>`;
    });
    h += '</div>';
    c.innerHTML = h;

    const sel = new Set();
    c.querySelectorAll(".caixa").forEach(b => {
      b.addEventListener("click", () => {
        if (respondida) return;
        const i = parseInt(b.dataset.i, 10);
        if (sel.has(i)) { sel.delete(i); b.classList.remove("sel"); }
        else { sel.add(i); b.classList.add("sel"); }
      });
    });

    coletor = () => ({ tipo: "multiplas", sel: Array.from(sel).sort((a, b) => a - b) });
  }

  /* ---------- 3. Arrastar e soltar ---------- */
  function renderArrastar(q) {
    const c = corpo();
    let h = enunciadoHTML(q);
    h += '<p style="font-size:12px;color:var(--ink-faint);margin-bottom:10px">Arraste a peça até o destino — ou clique na peça e depois no destino.</p>';
    h += '<div class="arrastar-zona">';
    h += '<div class="arrastar-col"><h4>Peças disponíveis</h4><div class="banco" id="drz-banco">';
    q.pecas.forEach((p, i) => {
      h += `<div class="peca" draggable="true" data-i="${i}">${esc(p)}</div>`;
    });
    h += '</div></div><div class="arrastar-col"><h4>Destinos</h4>';
    q.slots.forEach((s, i) => {
      h += `<div class="slot-linha" data-slot="${i}">
              <span class="slot-rotulo">${esc(s.rotulo)}</span>
              <span class="slot-area" data-slot="${i}"><span class="slot-vazio">solte aqui</span></span>
            </div>`;
    });
    h += '</div></div>';
    c.innerHTML = h;

    const banco = c.querySelector("#drz-banco");
    const mapa = new Array(q.slots.length).fill(null);   // slot -> índice da peça
    let pecaSelecionada = null;

    const pecas = () => Array.from(c.querySelectorAll('.peca[data-i]'));

    function aoClicarPeca(peca) {
      if (respondida) return;
      pecas().forEach(p => p.classList.remove("sel-pecas"));
      peca.classList.add("sel-pecas");
      pecaSelecionada = peca;
    }

    function solta(slotEl, peca) {
      const si = parseInt(slotEl.dataset.slot, 10);
      if (!peca) return;
      // remove de onde estava
      const anterior = peca.closest(".slot-area");
      if (anterior) {
        const ai = parseInt(anterior.dataset.slot, 10);
        if (mapa[ai] === parseInt(peca.dataset.i, 10)) mapa[ai] = null;
      }
      // devolve ao banco
      const antigo = slotEl.querySelector('.peca[data-i]');
      if (antigo && antigo !== peca) {
        const ai = parseInt(antigo.closest(".slot-area").dataset.slot, 10);
        if (mapa[ai] === parseInt(antigo.dataset.i, 10)) mapa[ai] = null;
        banco.appendChild(antigo);
        antigo.classList.remove("sel-pecas");
      }
      slotEl.innerHTML = "";
      slotEl.appendChild(peca);
      peca.classList.remove("sel-pecas");
      pecaSelecionada = null;
      mapa[si] = parseInt(peca.dataset.i, 10);
    }

    c.querySelectorAll('.peca[data-i]').forEach(p => {
      p.addEventListener("click", ev => { ev.stopPropagation(); aoClicarPeca(p); });
      p.addEventListener("dragstart", ev => {
        ev.dataTransfer.setData("text/plain", p.dataset.i);
        ev.dataTransfer.effectAllowed = "move";
        p.classList.add("arrastando");
        pecaSelecionada = p;
      });
      p.addEventListener("dragend", () => { p.classList.remove("arrastando"); });
    });

    c.querySelectorAll(".slot-area").forEach(area => {
      area.addEventListener("click", ev => {
        if (respondida) return;
        if (ev.target.classList.contains("peca")) return;
        if (pecaSelecionada) solta(area, pecaSelecionada);
      });
      area.addEventListener("dragover", ev => { ev.preventDefault(); area.classList.add("sobre"); });
      area.addEventListener("dragleave", () => area.classList.remove("sobre"));
      area.addEventListener("drop", ev => {
        ev.preventDefault();
        area.classList.remove("sobre");
        if (respondida) return;
        const idx = parseInt(ev.dataTransfer.getData("text/plain"), 10);
        const peca = c.querySelector(`.peca[data-i="${idx}"]`);
        if (peca) solta(area, peca);
      });
    });

    // banco aceita devolver peças
    banco.addEventListener("dragover", ev => { ev.preventDefault(); banco.classList.add("sobre"); });
    banco.addEventListener("dragleave", () => banco.classList.remove("sobre"));
    banco.addEventListener("drop", ev => {
      ev.preventDefault();
      banco.classList.remove("sobre");
      if (respondida) return;
      const idx = parseInt(ev.dataTransfer.getData("text/plain"), 10);
      const peca = c.querySelector(`.peca[data-i="${idx}"]`);
      if (!peca) return;
      const ant = peca.closest(".slot-area");
      if (ant) {
        const ai = parseInt(ant.dataset.slot, 10);
        if (mapa[ai] === idx) mapa[ai] = null;
      }
      banco.appendChild(peca);
      peca.classList.remove("sel-pecas");
    });

    coletor = () => ({
      tipo: "arrastar",
      mapa: mapa.map(v => (v === null ? null : q.pecas[v]))
    });
  }

  /* ---------- 4. Ligue (relacionar) ---------- */
  function renderLigue(q) {
    const c = corpo();
    let h = enunciadoHTML(q);
    h += '<div class="arrastar-zona"><div class="ligue-lado" id="ligue-esq">';
    q.situacoes.forEach((s, i) => {
      h += `<div class="ligue-item" data-s="${i}">${s.t}</div>`;
    });
    h += '</div><div class="ligue-lado" id="ligue-dir">';
    const comps = ["Model", "View", "Controller"];
    comps.forEach(cp => {
      h += `<div class="ligue-item" data-c="${cp}">${cp}</div>`;
    });
    h += '</div></div>';
    c.innerHTML = h;

    const pares = [];   // {si, comp}
    let selEsq = -1;
    const esq = c.querySelectorAll("#ligue-esq .ligue-item");
    const dir = c.querySelectorAll("#ligue-dir .ligue-item");

    esq.forEach(e => e.addEventListener("click", () => {
      if (respondida) return;
      esq.forEach(x => x.classList.remove("sel"));
      e.classList.add("sel");
      selEsq = parseInt(e.dataset.s, 10);
    }));

    dir.forEach(d => d.addEventListener("click", () => {
      if (respondida || selEsq < 0) return;
      const comp = d.dataset.c;
      const s = q.situacoes[selEsq];
      // substitui a situação por uma linha já conectada
      const linha = esq[selEsq];
      linha.classList.remove("sel");
      linha.innerHTML = `${s.t}<span class="comp-tag" data-c="${comp}">${comp}</span>`;
      linha.classList.add("conectado");
      pares.push({ si: selEsq, comp });
      selEsq = -1;
    }));

    coletor = () => ({ tipo: "ligue", pares: pares.slice() });
  }

  /* ---------- 5. Lacunas (digitar) ---------- */
  function renderLacunas(q) {
    const c = corpo();
    let h = enunciadoHTML(q);
    h += '<div class="lacunas">';
    q.itens.forEach((it, i) => {
      h += `<div class="lacuna-linha">
              <span class="lacuna-texto">${it.texto}</span>
              <input class="lacuna-input" data-i="${i}" autocomplete="off" spellcheck="false" placeholder="resposta">
            </div>`;
    });
    h += '</div>';
    c.innerHTML = h;

    const inputs = c.querySelectorAll(".lacuna-input");
    inputs.forEach((inp, i) => {
      inp.addEventListener("keydown", ev => {
        if (ev.key === "Enter") { ev.preventDefault(); btnVerificar().click(); }
      });
    });

    coletor = () => ({
      tipo: "lacunas",
      vals: Array.from(inputs).map(i => i.value.trim())
    });
  }

  /* ---------- 6. Completar código (gaps) ---------- */
  function renderCodigo(q) {
    const c = corpo();
    let h = enunciadoHTML(q);
    h += '<div class="codigo-editor">' + esc(q.codigo).replace(/\{\{(\d+)\}\}/g, (m, n) => `{{${n}}}`) + '</div>';
    h += '<div class="gap-opcoes">';
    q.opcoes.forEach((o, i) => {
      h += `<div class="gap-opt" data-o="${i}">${esc(o)}</div>`;
    });
    h += '</div>';
    c.innerHTML = h;

    // converte {{n}} em slots clicáveis no editor
    const editor = c.querySelector(".codigo-editor");
    editor.innerHTML = esc(q.codigo).replace(/\{\{(\d+)\}\}/g,
      (m, n) => `<span class="gap-slot" data-gap="${n}">escolha abaixo</span>`);

    const preenchido = {};     // gap -> texto escolhido
    const slots = Array.from(editor.querySelectorAll(".gap-slot"));
    let slotAtivo = null;

    slots.forEach(slot => {
      slot.addEventListener("click", () => {
        if (respondida) return;
        if (slotAtivo && slotAtivo !== slot) slotAtivo.classList.remove("gap-ativo");
        slotAtivo = slot;
        slot.classList.add("gap-ativo");
      });
    });

    c.querySelectorAll(".gap-opt").forEach(o => {
      o.addEventListener("click", () => {
        if (respondida) return;
        const texto = q.opcoes[parseInt(o.dataset.o, 10)];
        let alvo = slotAtivo;
        // se nenhum slot está ativo, preenche o primeiro gap vazio
        if (!alvo) alvo = slots.find(s => !preenchido[s.dataset.gap]);
        if (!alvo) return;

        // libera a opção caso ela já esteja em outro gap
        for (const [k, v] of Object.entries(preenchido)) {
          if (v === texto) {
            delete preenchido[k];
            const s2 = slots.find(s => s.dataset.gap === k);
            if (s2) { s2.textContent = "escolha abaixo"; s2.classList.remove("preenchido"); }
          }
        }

        preenchido[alvo.dataset.gap] = texto;
        alvo.textContent = texto;
        alvo.classList.add("preenchido");
        alvo.classList.remove("gap-ativo");
        slotAtivo = null;
      });
    });

    coletor = () => ({ tipo: "codigo", vals: Object.assign({}, preenchido) });
  }

  /* ---------- 7. Ordenar fluxo ---------- */
  function renderOrdem(q) {
    const c = corpo();
    let h = enunciadoHTML(q);
    h += '<p style="font-size:12px;color:var(--ink-faint);margin-bottom:10px">Arraste para reordenar, ou clique em um item e depois em outro para trocá-los de lugar.</p>';
    h += '<div class="ordem-lista" id="ordem-lista">';
    q.itens.forEach((it, i) => {
      h += `<div class="ordem-item" draggable="true" data-orig="${i}">
              <span class="ordem-num">${i + 1}</span>
              <span class="ordem-texto">${it.t}<small>${it.sub || ""}</small></span>
              <span class="ordem-handle">⠿</span>
            </div>`;
    });
    h += '</div>';
    c.innerHTML = h;

    const lista = c.querySelector("#ordem-lista");
    let ultimoClicado = null;

    lista.querySelectorAll(".ordem-item").forEach(it => {
      it.addEventListener("dragstart", ev => {
        ev.dataTransfer.setData("text/plain", it.dataset.orig);
        it.classList.add("arrastando");
      });
      it.addEventListener("dragend", () => it.classList.remove("arrastando"));
      it.addEventListener("dragover", ev => { ev.preventDefault(); it.classList.add("solta"); });
      it.addEventListener("dragleave", () => it.classList.remove("solta"));
      it.addEventListener("drop", ev => {
        ev.preventDefault();
        it.classList.remove("solta");
        if (respondida) return;
        const origem = lista.querySelector(`.ordem-item[data-orig="${ev.dataTransfer.getData("text/plain")}"]`);
        if (!origem || origem === it) return;
        const la = Array.from(lista.children);
        const iOrig = la.indexOf(origem);
        const iDest = la.indexOf(it);
        if (iOrig < iDest) it.after(origem); else it.before(origem);
        renumerar();
      });
      it.addEventListener("click", () => {
        if (respondida) return;
        if (!ultimoClicado) {
          ultimoClicado = it;
          it.classList.add("solta");
          return;
        }
        if (ultimoClicado === it) {
          ultimoClicado = null;
          it.classList.remove("solta");
          return;
        }
        const a = ultimoClicado, b = it;
        const la = Array.from(lista.children);
        const ia = la.indexOf(a), ib = la.indexOf(b);
        // troca as posições dos dois elementos
        if (ia < ib) b.before(a); else a.before(b);
        ultimoClicado = null;
        lista.querySelectorAll(".ordem-item").forEach(x => x.classList.remove("solta"));
        renumerar();
      });
    });

    function renumerar() {
      Array.from(lista.children).forEach((el2, i) => {
        el2.querySelector(".ordem-num").textContent = i + 1;
      });
    }

    coletor = () => ({
      tipo: "ordem",
      ordem: Array.from(lista.children).map(el2 => q.itens[parseInt(el2.dataset.orig, 10)])
    });
  }

  /* ---------- 8. Classificar código em camadas ---------- */
  function renderClassificar(q) {
    const c = corpo();
    let h = enunciadoHTML(q);
    h += '<div class="classificar">';
    q.linhas.forEach((l, i) => {
      h += `<div class="classificar-cartao" data-i="${i}">${esc(l.codigo)}</div>
              <div class="classificar-botoes">
                <button class="cb" data-c="Model">Model</button>
                <button class="cb" data-c="View">View</button>
                <button class="cb" data-c="Controller">Controller</button>
              </div>`;
    });
    h += '</div>';
    c.innerHTML = h;

    const respostas = {};
    const cartoes = c.querySelectorAll(".classificar-cartao");
    cartoes.forEach(cart => {
      const i = parseInt(cart.dataset.i, 10);
      const botoes = cart.nextElementSibling.querySelectorAll(".cb");
      botoes.forEach(b => b.addEventListener("click", ev => {
        ev.stopPropagation();
        if (respondida) return;
        botoes.forEach(x => x.classList.remove("escolhido"));
        b.classList.add("escolhido");
        respostas[i] = b.dataset.c;
        cart.style.borderColor = b.dataset.c === "Model" ? "#20604a" : b.dataset.c === "View" ? "#1e4673" : "#6b4a1c";
      }));
    });

    coletor = () => ({ tipo: "classificar", respostas });
  }

  /* ============================================================
     VERIFICAÇÃO
     ============================================================ */

  function verificar(q, resp) {
    respondida = true;
    let acertos = 0;
    let total = 0;
    let correta = false;

    const c = corpo();

    switch (resp.tipo) {

      case "alternativas": {
        const i = resp.i;
        if (i === null || i === undefined) return null;
        total = 1;
        const op = q.opcoes[i];
        c.querySelectorAll(".opcao").forEach((b, k) => {
          b.classList.add("bloqueada");
          b.classList.remove("sel");
          if (q.opcoes[k].ok) { b.classList.add("certa"); if (k === i) acertos++; }
          else if (k === i) b.classList.add("errada");
        });
        correta = op.ok;
        break;
      }

      case "multiplas": {
        // o total é a quantidade de itens VERDADEIROS: o aluno deve marcar
        // todas as verdadeiras e nenhuma falsa
        const verdadeiros = q.itens.filter(it => it.ok).length;
        total = verdadeiros;
        c.querySelectorAll(".caixa").forEach((b, k) => {
          const selecionado = resp.sel.includes(k);
          const gabarito = q.itens[k].ok;
          if (gabarito) { b.classList.add("certa"); if (selecionado) acertos++; }
          else if (selecionado) { b.classList.add("errada"); }
        });
        const marcadas = resp.sel.length;
        correta = acertos === verdadeiros && marcadas === verdadeiros;
        break;
      }

      case "arrastar": {
        total = q.slots.length;
        c.querySelectorAll(".slot-area").forEach((area, i) => {
          const p = area.querySelector('.peca[data-i]');
          const slot = q.slots[i];
          const val = p ? p.textContent.trim() : null;
          const ok = val && slot.aceita.includes(val);
          const linha = area.closest(".slot-linha");
          if (ok) { linha.classList.add("certa"); acertos++; }
          else { linha.classList.add("errada"); if (p) p.classList.add("errada"); }
        });
        correta = acertos === total;
        break;
      }

      case "ligue": {
        total = q.situacoes.length;
        const feitas = new Set(resp.pares.map(p => p.si));
        if (feitas.size < total) {
          return { parcial: true, msg: "Relacione todos os itens antes de verificar." };
        }
        c.querySelectorAll("#ligue-esq .ligue-item").forEach((el, i) => {
          const p = resp.pares.find(x => x.si === i);
          if (p && p.comp === q.situacoes[i].comp) { el.classList.add("certa"); acertos++; }
          else el.classList.add("errada");
        });
        correta = acertos === total;
        break;
      }

      case "lacunas": {
        total = q.itens.length;
        c.querySelectorAll(".lacuna-input").forEach((inp, i) => {
          const v = resp.vals[i] || "";
          const ok = v.toLowerCase().trim() === q.itens[i].resposta.toLowerCase().trim();
          inp.disabled = true;
          if (ok) { inp.classList.add("certa"); inp.value = q.itens[i].resposta; acertos++; }
          else { inp.classList.add("errada"); }
        });
        correta = acertos === total;
        break;
      }

      case "codigo": {
        const gaps = Object.keys(q.gabarito);
        total = gaps.length;
        const editor = c.querySelector(".codigo-editor");
        gaps.forEach(g => {
          const slot = editor.querySelector(`.gap-slot[data-gap="${g}"]`);
          const val = resp.vals[g];
          const ok = val && val.trim() === q.gabarito[g].trim();
          if (slot) {
            if (ok) { slot.classList.add("certa"); slot.classList.remove("preenchido"); }
            else { slot.classList.add("errada"); }
          }
          if (ok) acertos++;
        });
        c.querySelectorAll(".gap-opt").forEach(o => {
          const usada = Object.values(resp.vals).includes(o.textContent.trim());
          const gab = Object.values(q.gabarito).includes(o.textContent.trim());
          if (gab) o.classList.add("certa");
          else if (usada) o.classList.add("errada");
          o.classList.add("usada");
        });
        correta = acertos === total;
        break;
      }

      case "ordem": {
        total = q.itens.length;
        const gabaritoIds = q.itens.map(i => i.t);
        c.querySelectorAll(".ordem-item").forEach((el, i) => {
          const atual = resp.ordem[i];
          const ok = atual && atual.t === gabaritoIds[i];
          if (ok) { el.classList.add("certa"); acertos++; }
          else el.classList.add("errada");
        });
        correta = acertos === total;
        break;
      }

      case "classificar": {
        total = q.linhas.length;
        c.querySelectorAll(".classificar-cartao").forEach(cart => {
          const i = parseInt(cart.dataset.i, 10);
          const r = resp.respostas[i];
          const ok = r === q.linhas[i].gabarito;
          if (ok) { cart.classList.add("certa"); acertos++; }
          else cart.classList.add("errada");
        });
        correta = acertos === total;
        break;
      }
    }

    return { correta, acertos, total };
  }

  /* ============================================================
     API
     ============================================================ */

  function renderizar(q) {
    quest = q;
    limpar();
    const c = corpo();
    c.innerHTML = "";
    switch (q.tipo) {
      case "alternativas": renderAlternativas(q); break;
      case "multiplas":   renderMultiplas(q); break;
      case "arrastar":    renderArrastar(q); break;
      case "ligue":       renderLigue(q); break;
      case "lacunas":     renderLacunas(q); break;
      case "codigo":      renderCodigo(q); break;
      case "ordem":       renderOrdem(q); break;
      case "classificar": renderClassificar(q); break;
    }
  }

  function coletar() {
    return coletor ? coletor() : null;
  }

  function mostrarFeedback(res, q, msgExtra) {
    const fb = feedback();
    fb.className = "quiz-feedback";
    if (res.parcial) {
      fb.innerHTML = `<div class="fb erro"><span class="fb-icone">⚠</span><div>${res.msg}</div></div>`;
      return;
    }
    if (res.correta) {
      fb.innerHTML = `<div class="fb ok"><span class="fb-icone">✔</span><div>
        <b>Correto!</b>${msgExtra ? `<span class="explicacao">${msgExtra}</span>` : ""}
        <span class="explicacao">${q.explicacao}</span></div></div>`;
    } else {
      fb.innerHTML = `<div class="fb erro"><span class="fb-icone">✖</span><div>
        <b>Não foi dessa vez.</b> ${msgExtra ? `<span class="explicacao">${msgExtra}</span>` : ""}
        <span class="explicacao">${q.explicacao}</span></div></div>`;
    }
  }

  /* Revela o gabarito de uma quest sem resposta do jogador (usado no tempo esgotado).
     Marca visualmente a resposta correta e trava a quest. */
  function revelarGabarito(q) {
    respondida = true;
    const c = corpo();

    switch (q.tipo) {
      case "alternativas": {
        c.querySelectorAll(".opcao").forEach((b, k) => {
          b.classList.add("bloqueada");
          if (q.opcoes[k].ok) b.classList.add("certa");
        });
        break;
      }
      case "multiplas": {
        c.querySelectorAll(".caixa").forEach((b, k) => {
          if (q.itens[k].ok) b.classList.add("certa");
        });
        break;
      }
      case "arrastar": {
        c.querySelectorAll(".slot-area").forEach((area, i) => {
          const p = area.querySelector('.peca[data-i]');
          const slot = q.slots[i];
          const val = p ? p.textContent.trim() : null;
          if (val && slot.aceita.includes(val)) area.closest(".slot-linha").classList.add("certa");
          else area.closest(".slot-linha").classList.add("errada");
        });
        break;
      }
      case "ligue": {
        // recria os pares corretos
        q.situacoes.forEach((s, i) => {
          const linha = c.querySelector(`#ligue-esq .ligue-item[data-s="${i}"]`);
          if (!linha) return;
          linha.classList.add("certa");
          linha.innerHTML = `${s.t}<span class="comp-tag" data-c="${s.comp}">${s.comp}</span>`;
        });
        break;
      }
      case "lacunas": {
        c.querySelectorAll(".lacuna-input").forEach((inp, i) => {
          inp.disabled = true;
          inp.classList.add("certa");
          inp.value = q.itens[i].resposta;
        });
        break;
      }
      case "codigo": {
        const editor = c.querySelector(".codigo-editor");
        Object.keys(q.gabarito).forEach(g => {
          const slot = editor ? editor.querySelector(`.gap-slot[data-gap="${g}"]`) : null;
          if (slot) { slot.textContent = q.gabarito[g]; slot.classList.add("certa"); }
        });
        c.querySelectorAll(".gap-opt").forEach(o => {
          if (Object.values(q.gabarito).includes(o.textContent.trim())) o.classList.add("certa");
          o.classList.add("usada");
        });
        break;
      }
      case "ordem": {
        // mostra a ordem correta
        const lista = c.querySelector("#ordem-lista");
        if (lista) {
          q.itens.forEach((it, i) => {
            const item = lista.children[i];
            if (item) item.classList.add("certa");
          });
        }
        break;
      }
      case "classificar": {
        c.querySelectorAll(".classificar-cartao").forEach(cart => {
          const i = parseInt(cart.dataset.i, 10);
          if (q.linhas[i].gabarito) cart.classList.add("certa");
          const botoes = cart.nextElementSibling.querySelectorAll(".cb");
          botoes.forEach(b => {
            b.classList.remove("escolhido");
            if (b.dataset.c === q.linhas[i].gabarito) b.classList.add("certa");
          });
        });
        break;
      }
    }
  }

  return { renderizar, coletar, verificar, mostrarFeedback, revelarGabarito, get respondida() { return respondida; } };
})();
