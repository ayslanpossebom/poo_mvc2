/* ============================================================
   MVC QUEST — Base de dados das fases e das quests
   Todo o conteúdo deriva do arquivo aula.md (MVC em Java).
   ============================================================ */

const FASES = [

  /* =========================================================
     FASE 1 — SETOR DE ENTRADA
     Fundamentos: o que é MVC e quem faz o quê.
     ========================================================= */
  {
    id: 1,
    nome: "Setor de Entrada",
    tema: "Os três pilares do MVC",
    descricao: "O terminal de comando ainda não sabe o que é MVC. Enfrente o primeiro Guardião.",
    cor: "#7c5cff",
    fundo: "terminal",
    guarda: { nome: "GUARDIÃO GATE", cor: "#7c5cff", lema: "Separe as responsabilidades!" },
    largura: 2150,
    plataformas: [
      [0, 440, 280, 72],
      [340, 395, 180, 117],
      [580, 350, 160, 162],
      [800, 395, 220, 117],
      [1080, 350, 160, 162],
      [1300, 395, 180, 117],
      [1540, 440, 220, 72],
      [1820, 395, 330, 117]
    ],
    spawn: { x: 60, y: 400 },
    guardioes: [
      { nome: "GATE PRIMEIRO", x: 430, y: 395, quests: [0, 1] },
      { nome: "GATE SEGUNDO", x: 910, y: 395, quests: [2, 3] },
      { nome: "GATE FINAL", x: 1390, y: 395, quests: [4] }
    ],
    portao: { x: 2070, y: 395 },
    cristais: [
      { x: 550, y: 284 },
      { x: 660, y: 316 },
      { x: 1050, y: 284 },
      { x: 1160, y: 316 },
      { x: 1510, y: 329 },
      { x: 1650, y: 406 }
    ],
    quests: [
      {
        tipo: "alternativas",
        comp: "Controller",
        enunciado: "O padrão MVC (Model-View-Controller) é utilizado no desenvolvimento de software para organizar o código e separar responsabilidades. Qual é o principal objetivo desse padrão?",
        opcoes: [
          { t: "Permitir que toda a aplicação seja desenvolvida em uma única classe.", ok: false },
          { t: "Tornar o código Java mais rápido durante a execução.", ok: false },
          { t: "Separar a aplicação em três componentes com responsabilidades distintas.", ok: true },
          { t: "Substituir completamente a programação orientada a objetos.", ok: false },
          { t: "Eliminar a necessidade de utilizar classes e objetos.", ok: false }
        ],
        explicacao: "O MVC é um <b>padrão de arquitetura</b>: a meta é justamente <b>separar</b> a aplicação em Model, View e Controller, com cada um responsável apenas pela sua atividade."
      },
      {
        tipo: "arrastar",
        comp: "Misto",
        enunciado: "Arraste cada componente do MVC até a descrição que corresponde à sua responsabilidade.",
        slots: [
          { rotulo: "Dados e regras de negócio", aceita: ["Model"] },
          { rotulo: "Apresentação e interação com o usuário", aceita: ["View"] },
          { rotulo: "Recebe ações do usuário e coordena View + Model", aceita: ["Controller"] }
        ],
        pecas: ["Model", "View", "Controller"],
        explicacao: "Model = o <b>cérebro oculto</b> (dados e regras). View = a interface, <b>burra mas bonita</b>. Controller = o <b>intermediário</b> que sabe exatamente quem chamar."
      },
      {
        tipo: "alternativas",
        comp: "Model",
        enunciado: "Em uma aplicação Java desenvolvida utilizando MVC, qual é a principal responsabilidade do componente Model?",
        opcoes: [
          { t: "Formatar os componentes gráficos da interface.", ok: false },
          { t: "Controlar exclusivamente a navegação entre telas.", ok: false },
          { t: "Representar os dados e as regras de negócio da aplicação.", ok: true },
          { t: "Receber os cliques realizados pelo usuário.", ok: false },
          { t: "Apresentar informações na tela para o usuário.", ok: false }
        ],
        explicacao: "O Model <b>não se importa</b> com a cor do botão nem com o design da página. Ele só liga para dados e regras de negócio — e devolve dados validados ao Controller."
      },
      {
        tipo: "ligue",
        comp: "Misto",
        enunciado: "Relacione cada situação ao componente MVC correspondente. Clique em uma situação à esquerda e depois no componente à direita.",
        situacoes: [
          { id: "s1", t: "Exibir o preço de um produto na tela", comp: "View" },
          { id: "s2", t: "Calcular o valor total de uma compra", comp: "Model" },
          { id: "s3", t: "Receber o clique no botão \"Adicionar\"", comp: "Controller" },
          { id: "s4", t: "Representar um produto com nome e preço", comp: "Model" },
          { id: "s5", t: "Apresentar uma mensagem de sucesso", comp: "View" }
        ],
        explicacao: "O mesmo componente pode aparecer em várias situações: a <b>View</b> mostra e apresenta mensagens; o <b>Model</b> representa e calcula; o <b>Controller</b> recebe o clique."
      },
      {
        tipo: "alternativas",
        comp: "View",
        enunciado: "Imagine um sistema de cadastro de alunos desenvolvido em Java. Qual das alternativas representa uma responsabilidade da View?",
        opcoes: [
          { t: "Armazenar os dados do aluno no banco de dados.", ok: false },
          { t: "Validar se a nota do aluno está entre 0 e 10.", ok: false },
          { t: "Decidir qual regra de negócio deve ser executada.", ok: false },
          { t: "Apresentar o nome e a média do aluno na tela.", ok: true },
          { t: "Calcular a média final do aluno.", ok: false }
        ],
        explicacao: "A View cuida da <b>apresentação dos dados</b> e da interação com o usuário. Cálculo de média é Model; validação de entrada e coordenação são do Controller."
      }
    ]
  },

  /* =========================================================
     FASE 2 — SETOR DO RESTAURANTE
     Analogia do restaurante e fluxo de interação.
     ========================================================= */
  {
    id: 2,
    nome: "Setor do Restaurante",
    tema: "Analogia e fluxo de interação",
    descricao: "Aqui o MVC se disfarça de restaurante. Aprenda o fluxo antes de avançar.",
    cor: "#ffb454",
    fundo: "cozinha",
    guarda: { nome: "GARÇOM ORACLE", cor: "#ffb454", lema: "Eu não cozinho, eu coordeno!" },
    largura: 2200,
    plataformas: [
      [0, 440, 280, 72],
      [340, 395, 180, 117],
      [580, 350, 160, 162],
      [800, 395, 220, 117],
      [1080, 350, 160, 162],
      [1300, 395, 180, 117],
      [1540, 440, 220, 72],
      [1820, 395, 380, 117]
    ],
    spawn: { x: 60, y: 400 },
    guardioes: [
      { nome: "GARÇOM", x: 430, y: 395, quests: [0, 1] },
      { nome: "MESTRE-COZINHEIRO", x: 910, y: 395, quests: [2, 3] },
      { nome: "CRÍTICO", x: 1390, y: 395, quests: [4] }
    ],
    portao: { x: 2120, y: 395 },
    cristais: [
      { x: 550, y: 284 },
      { x: 660, y: 316 },
      { x: 1050, y: 284 },
      { x: 1160, y: 316 },
      { x: 1510, y: 329 },
      { x: 1650, y: 406 }
    ],
    quests: [
      {
        tipo: "alternativas",
        comp: "Misto",
        enunciado: "Na analogia do restaurante usada na aula, quem corresponde ao Controller (o garçom)?",
        opcoes: [
          { t: "O Cliente, porque é quem pede a comida.", ok: false },
          { t: "O Cozinheiro, porque é quem prepara o prato.", ok: false },
          { t: "O Garçom, porque recebe o pedido e coordena a operação.", ok: true },
          { t: "O Cardápio, porque define o que pode ser pedido.", ok: false },
          { t: "O Restaurant, porque é quem contém todos os outros.", ok: false }
        ],
        explicacao: "O <b>Garçom</b> = Controller: recebe o pedido, repassa ao cozinheiro e leva o prato pronto. O <b>Cliente</b> = View, o <b>Cozinheiro</b> = Model."
      },
      {
        tipo: "multiplas",
        comp: "Misto",
        enunciado: "Quais destas são regras válidas da analogia do restaurante? Marque todas as que se aplicam.",
        itens: [
          { t: "O cliente não entra na cozinha.", ok: true },
          { t: "O garçom não cozinha, apenas coordena.", ok: true },
          { t: "O cozinheiro não atende a mesa.", ok: true },
          { t: "Se o cardápio de papel virar tablet, a cozinha continua a mesma.", ok: true },
          { t: "O garçom deve preparar o prato para ganhar tempo.", ok: false },
          { t: "O cozinheiro precisa saber desenhar o prato na tela.", ok: false }
        ],
        explicacao: "As três primeiras regras mais o cardápio→tablet mostram a <b>separação de responsabilidades</b>: trocar a View não afeta o Model (nem a cozinha)."
      },
      {
        tipo: "ordem",
        comp: "Misto",
        enunciado: "Coloque em ordem o fluxo completo de uma busca com banco de dados.",
        itens: [
          { t: "View → Controller", sub: "Usuário clica em \"Buscar\"" },
          { t: "Controller → Model", sub: "Envia os dados a serem buscados" },
          { t: "Model → Banco de dados", sub: "Executa a consulta" },
          { t: "Banco → Model", sub: "Devolve os dados brutos" },
          { t: "Model → Controller", sub: "Devolve dados validados (regras aplicadas)" },
          { t: "Controller → View", sub: "A View renderiza a tela" }
        ],
        explicacao: "Repare que o <b>Model nunca fala com a View diretamente</b> e a <b>View nunca fala com o Model</b>: o Controller é sempre o intermediário."
      },
      {
        tipo: "alternativas",
        comp: "Controller",
        enunciado: "No fluxo de interação descrito na aula, quem recebe os dados do usuário, controla e decide como os dados serão exibidos?",
        opcoes: [
          { t: "A View, que já está com os dados na mão.", ok: false },
          { t: "O Controller, que controla o fluxo entre View e Model.", ok: true },
          { t: "O Model, que decide o que deve ser salvo.", ok: false },
          { t: "O banco de dados, que é quem sabe tudo.", ok: false },
          { t: "Ninguém — a View desenha e o Model calcula em paralelo.", ok: false }
        ],
        explicacao: "A View atualiza os dados com getters/setters e <b>dispara eventos ao Controller</b>. É o Controller que modifica o Model e depois manda a View atualizar a tela."
      },
      {
        tipo: "multiplas",
        comp: "Model",
        enunciado: "Sobre o componente Model, marque as afirmações corretas.",
        itens: [
          { t: "Manipula os dados do sistema.", ok: true },
          { t: "Pode acessar o banco de dados.", ok: true },
          { t: "Aplica as regras de negócio.", ok: true },
          { t: "Comunica com a Internet, tudo sem saber como a informação será exibida.", ok: true },
          { t: "Desenha o resultado na tela com cores e fontes.", ok: false },
          { t: "Guarda o objeto que o usuário digitou no formulário.", ok: false }
        ],
        explicacao: "O Model funciona <b>sem saber como a informação será exibida</b>. É por isso que o mesmo Model serve para console, web, desktop e mobile."
      }
    ]
  },

  /* =========================================================
     FASE 3 — SETOR DO CÓDIGO LEGADO
     O "código que faz tudo" e o que ele custa.
     ========================================================= */
  {
    id: 3,
    nome: "Setor do Código Legado",
    tema: "Separar responsabilidades",
    descricao: "Um arquivo gigante de Java bloqueia o setor. Descubra o que ele faz de errado.",
    cor: "#ff6b7a",
    fundo: "legado",
    guarda: { nome: "DR. MONOLITO", cor: "#ff6b7a", lema: "Eu faço tudo... e sofro com isso." },
    largura: 2250,
    plataformas: [
      [0, 440, 280, 72],
      [340, 395, 180, 117],
      [580, 350, 160, 162],
      [800, 395, 220, 117],
      [1080, 350, 160, 162],
      [1300, 395, 180, 117],
      [1540, 440, 220, 72],
      [1820, 395, 430, 117]
    ],
    spawn: { x: 60, y: 400 },
    guardioes: [
      { nome: "MONOLITO", x: 430, y: 395, quests: [0, 1] },
      { nome: "HERDEIRO DO MONOLITO", x: 910, y: 395, quests: [2, 3] },
      { nome: "ARQUITETO LEGADO", x: 1390, y: 395, quests: [4] }
    ],
    portao: { x: 2170, y: 395 },
    cristais: [
      { x: 550, y: 284 },
      { x: 660, y: 316 },
      { x: 1050, y: 284 },
      { x: 1160, y: 316 },
      { x: 1510, y: 329 },
      { x: 1650, y: 406 }
    ],
    quests: [
      {
        tipo: "classificar",
        comp: "Misto",
        enunciado: "Analise o código \"que faz tudo\" e classifique cada trecho conforme a camada MVC mais adequada.",
        linhas: [
          {
            codigo: 'String resultado = "";\ndouble media = (n1 + n2) / 2;\nif (media >= 7) {\n    resultado = "aprovado";\n}',
            gabarito: "Model"
          },
          {
            codigo: 'System.out.print("Nome do aluno: ");\nString nome = tec.nextLine();',
            gabarito: "View"
          },
          {
            codigo: 'public void iniciar() {\n    while (opcao != 0) {\n        opcao = view.exibirMenu();\n        if (opcao == 1) cadastrar();\n    }\n}',
            gabarito: "Controller"
          },
          {
            codigo: 'Aluno novoAluno = new Aluno(matricula, nome);\nturma.matricular(novoAluno);\nview.exibirMensagem("Aluno cadastrado!");',
            gabarito: "Controller"
          }
        ],
        explicacao: "Cálculo e regras de negócio → <b>Model</b>. Leitura e impressão → <b>View</b>. Coordenar o fluxo entre os dois → <b>Controller</b>."
      },
      {
        tipo: "alternativas",
        comp: "Controller",
        enunciado: "Uma equipe decidiu que a classe TelaCadastroUsuario fará validações de CPF, acessará o banco de dados e também exibirá mensagens ao usuário. Em relação ao MVC, essa decisão é:",
        opcoes: [
          { t: "Correta, pois concentra tudo em um só lugar.", ok: false },
          { t: "Obrigatória em todas as aplicações Java.", ok: false },
          { t: "Irrelevante para o padrão MVC.", ok: false },
          { t: "Incorreta, pois mistura responsabilidades de View, Controller e Model, violando o princípio da separação.", ok: true },
          { t: "Correta, desde que a classe seja grande o suficiente.", ok: false }
        ],
        explicacao: "É a <b>pegadinha clássica</b>: uma classe que faz tudo é exatamente o problema que o MVC resolve. Mistura View, Controller e Model numa só."
      },
      {
        tipo: "multiplas",
        comp: "Misto",
        enunciado: "Quais são consequências de colocar entrada, validação, cálculo e saída em uma única classe? Marque todas.",
        itens: [
          { t: "Difícil de testar — como testar o cálculo sem digitar no teclado?", ok: true },
          { t: "Difícil de manter — mudar a tela quebra a regra de negócio.", ok: true },
          { t: "Impossível reaproveitar — a mesma regra não serve para web, desktop e mobile.", ok: true },
          { t: "O compilador do Java passa a recusar classes com muitos métodos.", ok: false },
          { t: "O programa sempre fica mais rápido.", ok: false },
          { t: "A memória do computador passa a ser consumida em dobro.", ok: false }
        ],
        explicacao: "São exatamente as três consequências citadas na aula. Nada disso tem a ver com performance ou memória: o problema é <b>estrutural</b>."
      },
      {
        tipo: "alternativas",
        comp: "Misto",
        enunciado: "Sobre Design Patterns, assinale a alternativa CORRETA:",
        opcoes: [
          { t: "É uma biblioteca pronta que você importa no projeto.", ok: false },
          { t: "É um framework que define a arquitetura completa do sistema.", ok: false },
          { t: "É uma forma conhecida de organizar responsabilidades e comunicação, reutilizável para problemas recorrentes.", ok: true },
          { t: "É uma linguagem de programação paralela ao Java.", ok: false },
          { t: "É um código pronto para copiar e colar sem entender.", ok: false }
        ],
        explicacao: "Um padrão <b>não é</b> biblioteca, framework ou código pronto. É uma forma conhecida de organizar responsabilidades — e ainda cria <b>vocabulário comum</b> entre os desenvolvedores."
      },
      {
        tipo: "codigo",
        comp: "Model",
        enunciado: "Complete o código para que a classe \"Aluno\" passe a morar no lugar certo do projeto MVC.",
        codigo: "{{1}}\n\npublic class Aluno {\n    private String nome;\n    private double media;\n\n    public Aluno(String nome, double media) {\n        this.nome = nome;\n        this.media = media;\n    }\n\n    public boolean getAprovado() {\n        return media >= 6;\n    }\n}",
        opcoes: ["package model;", "package view;", "package controller;", "package app;"],
        gabarito: { 1: "package model;" },
        explicacao: "A classe <code>Aluno</code> guarda dados e regra de negócio (média, situação) → pertence ao <b>Model</b>, no package <code>model</code>. É o Controller que orquestra e a View que exibe."
      }
    ]
  },

  /* =========================================================
     FASE 4 — SETOR DO MODEL
     Aluno, Turma, getters/setters e regras de negócio.
     ========================================================= */
  {
    id: 4,
    nome: "Setor do Model",
    tema: "Aluno, Turma e regras de negócio",
    descricao: "O núcleo de dados está corrompido. Conserte os getters e as regras.",
    cor: "#4dd6a4",
    fundo: "dados",
    guarda: { nome: "SR. ALUNO", cor: "#4dd6a4", lema: "Eu guardo os dados. E as regras!" },
    largura: 2300,
    plataformas: [
      [0, 440, 280, 72],
      [340, 395, 180, 117],
      [580, 350, 160, 162],
      [800, 395, 220, 117],
      [1080, 350, 160, 162],
      [1300, 395, 180, 117],
      [1540, 440, 220, 72],
      [1820, 395, 480, 117]
    ],
    spawn: { x: 60, y: 400 },
    guardioes: [
      { nome: "SR. ALUNO", x: 430, y: 395, quests: [0, 1] },
      { nome: "SR. TURMA", x: 910, y: 395, quests: [2, 3] },
      { nome: "AVALIADOR", x: 1390, y: 395, quests: [4] }
    ],
    portao: { x: 2220, y: 395 },
    cristais: [
      { x: 550, y: 284 },
      { x: 660, y: 316 },
      { x: 1050, y: 284 },
      { x: 1160, y: 316 },
      { x: 1510, y: 329 },
      { x: 1650, y: 406 }
    ],
    quests: [
      {
        tipo: "codigo",
        comp: "Model",
        enunciado: "Complete os gaps da classe <code>Aluno</code>. Cada gap recebe uma linha de código.",
        codigo: "package model;\n\npublic class Aluno {\n    private String matricula;\n    private String nome;\n\n    public Aluno(String matricula, String nome) {\n        this.matricula = matricula;\n        this.nome = nome;\n    }\n\n    public double calcularMedia() {\n        double soma = 0;\n        // {{1}}\n        return soma / notas.size();\n    }\n\n    public String getNome() { return {{2}}; }\n\n    public void setNome(String nome) { this.nome = nome; }\n}",
        opcoes: [
          "for (double valor : notas) { soma += valor; }",
          "nome",
          "for (double valor : notas) { soma += valor; }"
        ],
        gabarito: { 1: "for (double valor : notas) { soma += valor; }", 2: "nome" },
        explicacao: "O <b>Model</b> guarda o estado interno e expõe acesso controlado por <b>getters/setters</b>. O Controller e a View nunca tocam nos campos diretamente."
      },
      {
        tipo: "lacunas",
        comp: "Model",
        enunciado: "Complete as lacunas do código da classe <code>Turma</code>.",
        itens: [
          { texto: "private ArrayList<Aluno> alunos;", resposta: "alunos" },
          { texto: "public void matricular(Aluno aluno) { alunos.add(aluno); }", resposta: "alunos" },
          { texto: "public ArrayList<Aluno> getAlunos() { return alunos; }", resposta: "alunos" }
        ],
        explicacao: "A <code>Turma</code> <b>é</b> o Model: ela contém a coleção de alunos e oferece <code>buscar</code> e <code>matricular</code>. O Controller só orquestra essas chamadas."
      },
      {
        tipo: "alternativas",
        comp: "Model",
        enunciado: "Em uma aplicação Java com MVC, a classe Aluno que contém atributos como nome, matricula e métodos como calcularMedia() pertence tipicamente à camada:",
        opcoes: [
          { t: "Controller", ok: false },
          { t: "Service", ok: false },
          { t: "Model", ok: true },
          { t: "Front-end", ok: false },
          { t: "View", ok: false }
        ],
        explicacao: "Dados + regra de negócio (calcular média, situação) = <b>Model</b>. Repare que \"Service\" não é um dos três componentes do MVC clássico estudado na aula."
      },
      {
        tipo: "ligue",
        comp: "Model",
        enunciado: "Relacione cada método da classe Aluno à responsabilidade que ele exerce dentro do Model.",
        situacoes: [
          { id: "s1", t: "calcularMedia()", comp: "Model" },
          { id: "s2", t: "getSituacao()", comp: "Model" },
          { id: "s3", t: "adicionarNota(double nota)", comp: "Model" },
          { id: "s4", t: "setNome(String nome)", comp: "Model" }
        ],
        explicacao: "Todos ficam no Model porque tratam <b>dados</b> e <b>regras</b>. A View nunca calcula nada: ela apenas recebe o resultado pronto."
      },
      {
        tipo: "ordem",
        comp: "Controller",
        enunciado: "Coloque em ordem os passos do método <code>cadastrar()</code> do AlunoController.",
        itens: [
          { t: "view.lerTexto(\"Matrícula\")", sub: "View pergunta ao usuário" },
          { t: "view.lerTexto(\"Nome\")", sub: "View pergunta ao usuário" },
          { t: "new Aluno(matricula, nome)", sub: "Controller cria o objeto do Model" },
          { t: "turma.matricular(novoAluno)", sub: "Controller aciona o Model" },
          { t: "view.exibirMensagem(\"Aluno cadastrado com sucesso!\")", sub: "View apresenta o resultado" }
        ],
        explicacao: "Perceba o padrão: <b>Controller → View</b> para pedir/exibir, <b>Controller → Model</b> para operar nos dados. A View nunca instancia o Model sozinha."
      }
    ]
  },

  /* =========================================================
     FASE 5 — SETOR DO CONTROLLER E DA VIEW
     AlunoController, AlunoView e Principal.
     ========================================================= */
  {
    id: 5,
    nome: "Setor do Controller",
    tema: "View, Controller e Principal",
    descricao: "O garçom e o cardápio estão confusos. Descubra quem é quem.",
    cor: "#5aa9ff",
    fundo: "console",
    guarda: { nome: "MESA ZERO", cor: "#5aa9ff", lema: "Sem controller, nada funciona!" },
    largura: 2350,
    plataformas: [
      [0, 440, 280, 72],
      [340, 395, 180, 117],
      [580, 350, 160, 162],
      [800, 395, 220, 117],
      [1080, 350, 160, 162],
      [1300, 395, 180, 117],
      [1540, 440, 220, 72],
      [1820, 395, 530, 117]
    ],
    spawn: { x: 60, y: 400 },
    guardioes: [
      { nome: "MESA ZERO", x: 430, y: 395, quests: [0, 1] },
      { nome: "LEITOR DE MENU", x: 910, y: 395, quests: [2, 3] },
      { nome: "CHAPEIRO", x: 1390, y: 395, quests: [4] }
    ],
    portao: { x: 2270, y: 395 },
    cristais: [
      { x: 550, y: 284 },
      { x: 660, y: 316 },
      { x: 1050, y: 284 },
      { x: 1160, y: 316 },
      { x: 1510, y: 329 },
      { x: 1650, y: 406 }
    ],
    quests: [
      {
        tipo: "codigo",
        comp: "Controller",
        enunciado: "Complete o construtor e o método principal do <code>AlunoController</code>.",
        codigo: "package controller;\n\npublic class AlunoController {\n    private final Turma turma;\n    private final AlunoView view;\n\n    public AlunoController(Turma turma, AlunoView view) {\n        this.turma = turma;\n        this.view = view;\n    }\n\n    private void cadastrar() {\n        String matricula = view.lerTexto(\"Matrícula\");\n        String nome = view.lerTexto(\"Nome\");\n        // {{1}}\n        turma.matricular(novoAluno);\n        view.exibirMensagem(\"Aluno cadastrado com sucesso!\");\n    }\n}",
        opcoes: [
          "Aluno novoAluno = new Aluno(matricula, nome);",
          "Aluno novoAluno = new AlunoView(matricula, nome);",
          "Turma novoAluno = new Turma(matricula, nome);"
        ],
        gabarito: { 1: "Aluno novoAluno = new Aluno(matricula, nome);" },
        explicacao: "O Controller é quem <b>cria</b> os objetos do Model e liga o Model à View. A View não cria o Model, e o Model não conhece a View."
      },
      {
        tipo: "classificar",
        comp: "Misto",
        enunciado: "Classifique cada trecho de código na camada MVC correspondente.",
        linhas: [
          {
            codigo: 'public void exibirAlunos(ArrayList<Aluno> alunos) {\n    for (Aluno a : alunos) {\n        System.out.print("Aluno: " + a.getNome());\n    }\n}',
            gabarito: "View"
          },
          {
            codigo: 'public Aluno buscar(String matricula) {\n    for (Aluno a : alunos) {\n        if (a.getMatricula().equals(matricula)) return a;\n    }\n    return null;\n}',
            gabarito: "Model"
          },
          {
            codigo: 'private void lancarNota() {\n    Aluno aluno = turma.buscar(matricula);\n    if (aluno == null) { view.exibirErro("Aluno não encontrado"); return; }\n}',
            gabarito: "Controller"
          },
          {
            codigo: 'public int exibirMenu() {\n    System.out.println("=== SISTEMA DE NOTAS ===");\n    System.out.print("Opção: ");\n    return Integer.parseInt(tec.nextLine());\n}',
            gabarito: "View"
          }
        ],
        explicacao: "Padrão rápido: <b>System.out / Scanner → View</b>; <b>listas, atributos e buscas sobre dados → Model</b>; <b>coordenar e decidir → Controller</b>."
      },
      {
        tipo: "alternativas",
        comp: "View",
        enunciado: "Em uma aplicação Java de console seguindo o MVC, a classe Main que lê dados via Scanner, chama métodos do Model e imprime resultados costuma ser classificada como parte da camada:",
        opcoes: [
          { t: "Model", ok: false },
          { t: "View", ok: true },
          { t: "Controller", ok: false },
          { t: "Service", ok: false },
          { t: "Nenhuma — o Main fica fora da arquitetura.", ok: false }
        ],
        explicacao: "Como ela <b>interage com o usuário</b> (Scanner) e <b>apresenta</b> os resultados (impressão), ela atua como <b>View</b>."
      },
      {
        tipo: "multiplas",
        comp: "Controller",
        enunciado: "Marque as afirmações que descrevem corretamente o papel do Controller.",
        itens: [
          { t: "Recebe as ações do usuário disparadas pela View.", ok: true },
          { t: "Aciona o Model e modifica os dados.", ok: true },
          { t: "Manda a View atualizar/exibir o resultado na tela.", ok: true },
          { t: "Desenha a interface gráfica com cores e botões.", ok: false },
          { t: "Guarda a lista de alunos cadastrados.", ok: false }
        ],
        explicacao: "Guardar a lista de alunos é papel do <b>Model</b> (Turma). Desenhar a interface é papel da <b>View</b>. O Controller só <b>coordena</b>."
      },
      {
        tipo: "alternativas",
        comp: "Misto",
        enunciado: "No estudo de caso do Sistema de Notas, a estrutura de packages recomendada é:",
        opcoes: [
          { t: "app, model, view, controller", ok: true },
          { t: "view, model, controller, app", ok: false },
          { t: "controller, app, view, model", ok: false },
          { t: "ui, dados, regras, negocio", ok: false },
          { t: "main, classes, metodos, pacotes", ok: false }
        ],
        explicacao: "A organização clássica é <code>app</code> (Principal/main), <code>model</code>, <code>view</code> e <code>controller</code> — exatamente como no diagrama de packages da aula."
      }
    ]
  },

  /* =========================================================
     FASE 6 — SETOR DO NÚCLEO
     Revisão final: vantagens, desvantagens e o grande teste.
     ========================================================= */
  {
    id: 6,
    nome: "Setor do Núcleo",
    tema: "Revisão final",
    descricao: "O Guardião final exige domínio pleno do MVC. Prove o que aprendeu.",
    cor: "#ffd166",
    fundo: "nucleo",
    guarda: { nome: "O ARQUITETO", cor: "#ffd166", lema: "Só quem entende, destrava o núcleo." },
    largura: 2400,
    plataformas: [
      [0, 440, 280, 72],
      [340, 395, 180, 117],
      [580, 350, 160, 162],
      [800, 395, 220, 117],
      [1080, 350, 160, 162],
      [1300, 395, 180, 117],
      [1540, 440, 220, 72],
      [1820, 395, 580, 117]
    ],
    spawn: { x: 60, y: 400 },
    guardioes: [
      { nome: "ARQUITETO", x: 430, y: 395, quests: [0, 1] },
      { nome: "AUDITOR", x: 910, y: 395, quests: [2, 3] },
      { nome: "O NUCLEO", x: 1390, y: 395, quests: [4, 5] }
    ],
    portao: { x: 2320, y: 395 },
    cristais: [
      { x: 550, y: 284 },
      { x: 660, y: 316 },
      { x: 1050, y: 284 },
      { x: 1160, y: 316 },
      { x: 1510, y: 329 },
      { x: 1650, y: 406 }
    ],
    quests: [
      {
        tipo: "lacunas",
        comp: "Misto",
        enunciado: "Complete as frases com as palavras do MVC (uma palavra por lacuna).",
        itens: [
          { texto: "O ______ representa os dados e as regras de negócio da aplicação.", resposta: "Model" },
          { texto: "A ______ é responsável pela interface com o usuário.", resposta: "View" },
          { texto: "O ______ recebe as ações do usuário e coordena as operações.", resposta: "Controller" },
          { texto: "A ______ representa a interface com a qual o usuário interage.", resposta: "View" },
          { texto: "O ______ coordena as interações entre os componentes.", resposta: "Controller" }
        ],
        explicacao: "É o resumo do capítulo: <b>Model</b> = dados e regras; <b>View</b> = interface; <b>Controller</b> = coordenação."
      },
      {
        tipo: "alternativas",
        comp: "Misto",
        enunciado: "Qual benefício NÃO está associado ao uso do MVC?",
        opcoes: [
          { t: "Possibilidade de trabalhar em equipe com divisão clara de tarefas.", ok: false },
          { t: "Facilidade de manutenção do código.", ok: false },
          { t: "Facilidade de testar o Model de forma isolada.", ok: false },
          { t: "Reutilização da lógica de negócio em diferentes interfaces.", ok: false },
          { t: "Garantia de que o sistema nunca terá bugs.", ok: true }
        ],
        explicacao: "MVC <b>organiza</b>, não garante correção. Nenhum padrão elimina bugs — ele apenas separa responsabilidades e deixa o sistema mais fácil de manter."
      },
      {
        tipo: "multiplas",
        comp: "Misto",
        enunciado: "Marque as afirmações sobre as VANTAGENS do MVC:",
        itens: [
          { t: "Manutenção facilitada e código organizado.", ok: true },
          { t: "Reuso do Model em várias interfaces (console, GUI, web, mobile).", ok: true },
          { t: "Facilita testes unitários — testar Aluno sem interface.", ok: true },
          { t: "Permite trabalho em equipe em paralelo.", ok: true },
          { t: "Elimina a necessidade de criar métodos.", ok: false },
          { t: "Reduz o número de classes a uma única classe.", ok: false }
        ],
        explicacao: "A lista de vantagens da aula é exatamente: manutenção, reuso do Model, testes unitários e trabalho em equipe. O MVC <b>aumenta</b> o número de classes — e isso tem um custo."
      },
      {
        tipo: "alternativas",
        comp: "Misto",
        enunciado: "Quais são as DESVANTAGENS do MVC?",
        opcoes: [
          { t: "O programa não compila em Java.", ok: false },
          { t: "Mais classes e arquivos, o que é excessivo para programas muito pequenos.", ok: true },
          { t: "Curva de aprendizado inicial.", ok: true },
          { t: "Exige disciplina da equipe para manter as camadas separadas.", ok: true },
          { t: "Impossível reutilizar a mesma regra de negócio em outra interface.", ok: false }
        ],
        explicacao: "O custo do MVC é real: mais arquivos, curva de aprendizado e disciplina da equipe. Em troca, você ganha reuso, manutenção e testes."
      },
      {
        tipo: "alternativas",
        comp: "Controller",
        enunciado: "CUIDADO — pegadinha! A classe que \"verifica se o preço de um produto é maior que zero\" deve fazer parte, preferencialmente, do:",
        opcoes: [
          { t: "Model", ok: false },
          { t: "Controller", ok: true },
          { t: "View", ok: false },
          { t: "Banco de dados", ok: false },
          { t: "Pode ser em qualquer uma das três — é a mesma coisa.", ok: false }
        ],
        explicacao: "Segundo o gabarito oficial do Moodle, a resposta é <b>Controller</b>: <b>validações de entrada</b> costumam ser feitas no Controller, enquanto <b>regras de negócio puras</b> (cálculos, estados) ficam no Model. Marque Model e leva 0,75/1,00!"
      },
      {
        tipo: "ordem",
        comp: "Misto",
        enunciado: "Coloque em ordem o \"fluxo completo\" do MVC com banco de dados, da ação do usuário à tela.",
        itens: [
          { t: "Usuário clica em \"Buscar\"", sub: "Ação na interface" },
          { t: "View envia o evento ao Controller", sub: "\"Ei, Controller, o usuário clicou!\"" },
          { t: "Controller envia os dados a serem buscados ao Model", sub: "\"Model, vá no estoque e me traga as opções\"" },
          { t: "Model acessa o banco e devolve os dados validados", sub: "Consulta + regras de negócio" },
          { t: "Controller envia os resultados para a View", sub: "\"View, aqui estão os tênis\"" },
          { t: "View renderiza a tela", sub: "Desenha os resultados de um jeito bonito" }
        ],
        explicacao: "É o caminho clássico: <b>View → Controller → Model → Controller → View</b>. O Model nunca vê a View, e a View nunca vê o banco."
      }
    ]
  }
];

/* ============================================================
   Configuração geral
   ============================================================ */
const CONFIG = {
  vidasIniciais: 5,
  pontosBase: 100,
  bonusTempo: 60,      // bônus máximo por velocidade
  bonusCristal: 25,
  tempoPorQuest: 45,  // segundos
  tempoMinimo: 12     // após isso, zera e ainda dá pra responder
};

const NOMES_COMP = {
  Model: "Model",
  View: "View",
  Controller: "Controller",
  Misto: "Misto"
};
