# MVC em Java — Resumo Teórico e Atividades

**Disciplina:** Programação Orientada a Objetos (POO)
**Prof.:** Ayslan T. Possebom
**Instituição:** Instituto Federal do Paraná (IFPR) — Campus Paranavaí
**Curso:** Bacharelado em Engenharia de Software
**Fontes:** Slides "POO - 12 - MVC" + Atividades do Moodle (AVA/IFPR)

---

## 1. Por que separar responsabilidades?

### 1.1 O problema do "código que faz tudo"

Uma única classe que faz tudo:

- Lê dados do teclado (entrada de dados)
- Valida os dados
- Faz cálculos (processamento, regras de negócio)
- Salva valores e imprime na tela (saída de dados)

**Consequências:**

- **Difícil de testar** — como testar o cálculo sem digitar no teclado?
- **Difícil de manter** — mudar a tela quebra a regra de negócio
- **Impossível reaproveitar** — a mesma regra não serve para web, desktop e mobile

### 1.2 Exemplo do "código básico" (tudo em uma classe)

```java
import java.util.Scanner;

public class SistemaNotas {
    public static void main(String[] args) {
        Scanner tec = new Scanner(System.in);

        // ENTRADA
        System.out.print("Nome do aluno: ");
        String nome = tec.nextLine();
        System.out.print("Nota 1: ");
        double n1 = tec.nextDouble();
        System.out.print("Nota 2: ");
        double n2 = tec.nextDouble();

        // CÁLCULOS (regras de negócio)
        String resultado = "";
        double media = (n1 + n2) / 2;
        if (media >= 7) {
            resultado = "aprovado";
        } else {
            resultado = "reprovado";
        }

        // SAÍDA (apresentação)
        System.out.println(nome + ": " + resultado);
    }
}
```

### 1.3 As perguntas que motivam o padrão

- E se eu quiser implementar o mesmo sistema para web?
- E se eu quiser implementar o mesmo sistema para celular?
- E se eu quiser implementar o mesmo sistema com interfaces gráficas?
- Quanto do código eu conseguiria reaproveitar?

---

## 2. Design Patterns (Padrões de Projeto)

- Um **Design Pattern** é uma **solução reutilizável** para um problema recorrente de projeto de software.
- **NÃO é:** uma biblioteca; um framework; um código pronto para copiar; uma linguagem de programação; uma arquitetura completa de um sistema.
- **É** uma forma conhecida de organizar responsabilidades e comunicação.
- **Exemplo:** como separar a interface de usuário das regras e dos dados da aplicação?

### Por que usar padrões?

Durante o desenvolvimento de software, determinados problemas aparecem repetidamente.

- **Sem padrões:** cada desenvolvedor pode criar uma solução diferente.
- **Com padrões:**
  - Soluções conhecidas
  - Vocabulário comum entre desenvolvedores
  - Melhor organização do código
  - Maior facilidade de manutenção
  - Menor acoplamento
  - Maior reutilização de ideias
  - Facilidade para trabalhar em equipe

---

## 3. O padrão MVC (Model-View-Controller)

É um **padrão de arquitetura** que separa uma aplicação em **três componentes com responsabilidades distintas**:

| Componente | Responsabilidade |
|---|---|
| **Model (modelo)** | Tratar os **dados e regras de negócio** (domínio da aplicação) |
| **View (visão)** | Cuidar da **apresentação dos dados** e da **interação com o usuário** |
| **Controller (controlador)** | Receber **ações do usuário**, acionar o Model e atualizar a View |

- O MVC visa a **separação de responsabilidades**: cada componente é responsável apenas pela sua atividade.
- Caso uma aplicação seja desenvolvida para **Desktop, Web e Mobile**, apenas a **View** seria diferenciada.

### 3.1 Analogia fictícia — o restaurante

- **Cliente** (interage com a interface) → **View**
- **Garçom** (recebe o pedido e coordena) → **Controller**
- **Cozinheiro** (onde o trabalho de verdade acontece) → **Model**

Regras da analogia:

- O cliente não entra na cozinha.
- O garçom não cozinha (apenas coordena).
- O cozinheiro não atende a mesa.
- Se o restaurante trocar o cardápio de papel por um tablet, a cozinha continua a mesma.

Mapeamento:

- **View:** cardápio, prato solicitado, etc. (o que o cliente vê).
- **Controller:** recebe pedido do cliente, repassa pedido ao cozinheiro, pega prato pronto na cozinha, leva prato pronto ao cliente.
- **Model:** receitas, ingredientes, estoque, etc. (onde o "trabalho de verdade" acontece).

### 3.2 Fluxo de interação

- O **usuário interage com as Views**.
- A View atualiza os dados com getters/setters e dispara eventos ao Controller.
- O **Controller** recebe dados do usuário, controla e decide como os dados serão exibidos.
- O Controller **modifica os dados** do Model.
- O Model **fornece os dados** de volta ao Controller.
- O Controller **exibe as telas** (atualiza a View).

**O Model manipula os dados, acessa banco de dados, comunica com a Internet — tudo sem saber como a informação será exibida.**

### 3.3 Exemplo prático: Loja Virtual buscando um tênis de corrida

**View (a interface da aplicação):** a View é "burra", mas muito bonita. Ela só sabe mostrar HTML, CSS e imagens na tela, além de capturar as suas ações:

- Quando você digita "tênis" e clica em "Buscar", a View não faz a menor ideia de como pesquisar isso no banco de dados.
- O único trabalho dela é gritar: "Ei, Controller! O usuário clicou no botão de busca e digitou a palavra 'tênis'!"

**Model (os dados e as regras):** o Model é o "cérebro" oculto do seu sistema. Ele não se importa com a cor do botão ou com o design da página web. Ele só liga para dados e regras de negócio:

- Ele recebe a ordem do Controller e vai trabalhar.
- Ele acessa o banco de dados e verifica as regras: "Temos 'tênis' cadastrados? Eles estão disponíveis no estoque? O preço está com desconto ativo?"
- Ele reúne as informações puras (ex.: nome do tênis, preço, tamanho) e devolve esse "relatório pronto" para o Controller.

**Controller (o intermediário):** o Controller não desenha a página na tela (como a View) nem guarda os dados dos produtos (como o Model), mas ele sabe exatamente quem chamar:

- Ele escuta o "grito" da View, interpreta o pedido e toma as decisões.
- O Controller recebe o termo "tênis" e pensa: "Certo, preciso pegar esses dados. Vou pedir para o Model."
- Ele então aciona o Model: "Model, o usuário quer tênis. Vá no estoque e me traga as opções."
- Quando o Model devolve os resultados, o Controller pega essa informação crua e a envia de volta para a View, dizendo: "View, aqui estão os tênis. Agora desenhe eles na tela de um jeito bonito."

### 3.4 Fluxo completo com banco de dados

1. Usuário clica em **Buscar** → View envia ao Controller.
2. Controller **envia dados a serem buscados** ao Model.
3. Model faz a **consulta no banco de dados**.
4. Banco devolve **dados brutos** ao Model.
5. Model devolve **dados validados** (aplicou regras de negócio) ao Controller.
6. Controller envia à View, que **renderiza a tela** (exibe dados).

---
## 4. Estudo de caso: Sistema de Notas (Console)

**Requisitos:**

- Cadastrar alunos (matrícula e nome)
- Lançar notas (entre 0 e 10)
- Listar alunos com média e situação (aprovado com média >= 6)

### 4.1 Estrutura de packages

```
projeto-mvc
└── src
    ├── app
    │   └── Principal.java
    ├── controller
    │   └── AlunoController.java
    ├── model
    │   ├── Aluno.java
    │   └── Turma.java
    └── view
        └── AlunoView.java
```

### 4.2 Model — Aluno.java

```java
package model;

import java.util.ArrayList;

public class Aluno {
    private String matricula;
    private String nome;
    private ArrayList<Double> notas;

    public Aluno(String matricula, String nome) {
        this.matricula = matricula;
        this.nome = nome;
        notas = new ArrayList<Double>();
    }

    public void adicionarNota(double nota) {
        notas.add(nota);
    }

    public double calcularMedia() {
        double soma = 0;
        for (double valor : notas) {
            soma += valor;
        }
        double media = soma / notas.size();
        return media;
    }

    public String getSituacao() {
        if (calcularMedia() >= 6) {
            return "Aprovado";
        } else {
            return "Reprovado";
        }
    }

    public String getMatricula() { return matricula; }
    public String getNome() { return nome; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
    public void setNome(String nome) { this.nome = nome; }
}
```

### 4.3 Model — Turma.java

```java
package model;

import java.util.ArrayList;

public class Turma {
    private ArrayList<Aluno> alunos;

    public Turma() {
        alunos = new ArrayList<Aluno>();
    }

    public void matricular(Aluno aluno) {
        alunos.add(aluno);
    }

    public Aluno buscar(String matricula) {
        for (Aluno a : alunos) {
            if (a.getMatricula().equals(matricula)) {
                return a;
            }
        }
        return null;
    }

    public ArrayList<Aluno> getAlunos() {
        return alunos;
    }
}
```

### 4.4 View — AlunoView.java (console)

```java
package view;

import java.util.ArrayList;
import java.util.Scanner;
import model.Aluno;

public class AlunoView {
    private Scanner tec = new Scanner(System.in);

    public int exibirMenu() {
        System.out.println("
=== SISTEMA DE NOTAS ===");
        System.out.println("1 - Cadastrar aluno");
        System.out.println("2 - Lançar nota");
        System.out.println("3 - Listar alunos");
        System.out.println("0 - Sair");
        System.out.print("Opção: ");
        return Integer.parseInt(tec.nextLine());
    }

    public String lerTexto(String rotulo) {
        System.out.print(rotulo + ": ");
        return tec.nextLine();
    }

    public double lerNota() {
        System.out.print("Nota: ");
        return Double.parseDouble(tec.nextLine());
    }

    public void exibirAlunos(ArrayList<Aluno> alunos) {
        if (alunos.isEmpty()) {
            System.out.println("Nenhum aluno cadastrado.");
            return;
        }
        for (Aluno a : alunos) {
            System.out.print("Aluno: " + a.getNome());
            System.out.print(" | Média: " + a.calcularMedia()
                    + " - " + a.getSituacao());
        }
    }

    public void exibirMensagem(String msg) {
        System.out.println(msg);
    }

    public void exibirErro(String msg) {
        System.out.println("ERRO: " + msg);
    }
}
```

### 4.5 Controller — AlunoController.java

```java
package controller;

import model.Aluno;
import model.Turma;
import view.AlunoView;

public class AlunoController {
    private final Turma turma;
    private final AlunoView view;

    public AlunoController(Turma turma, AlunoView view) {
        this.turma = turma;
        this.view = view;
    }

    public void iniciar() {
        int opcao = -1;
        while (opcao != 0) {
            opcao = view.exibirMenu();
            if (opcao == 1) cadastrar();
            else if (opcao == 2) lancarNota();
            else if (opcao == 3) view.exibirAlunos(turma.getAlunos());
            else if (opcao == 0) view.exibirMensagem("Saindo...");
            else view.exibirErro("Opção inválida");
        }
    }

    private void cadastrar() {
        String matricula = view.lerTexto("Matrícula");
        String nome = view.lerTexto("Nome");
        Aluno novoAluno = new Aluno(matricula, nome);
        turma.matricular(novoAluno);
        view.exibirMensagem("Aluno cadastrado com sucesso!");
    }

    private void lancarNota() {
        String matricula = view.lerTexto("Matrícula");
        Aluno aluno = turma.buscar(matricula);
        if (aluno == null) {
            view.exibirErro("Aluno não encontrado");
            return;
        }
        double nota = view.lerNota();
        aluno.adicionarNota(nota);
        view.exibirMensagem("Nota lançada!");
    }
}
```

### 4.6 App — Principal.java

```java
package app;

import controller.AlunoController;
import model.Turma;
import view.AlunoView;

public class Principal {
    public static void main(String[] args) {
        Turma turma = new Turma();
        AlunoView view = new AlunoView();
        AlunoController controller = new AlunoController(turma, view);
        controller.iniciar();
    }
}
```

---



---

## 6. Vantagens e Desvantagens do MVC

### Vantagens

- Manutenção facilitada e código organizado
- Reuso do Model em várias interfaces
- Facilita testes unitários (testar Aluno sem interface)
- Permite trabalho em equipe em paralelo (telas da aplicação e gestão dos dados)

### Desvantagens

- Mais classes e arquivos, o que é excessivo para programas muito pequenos
- Curva de aprendizado inicial
- Exige disciplina da equipe para manter as camadas separadas

---
## 7. Atividades do Moodle (AVA/IFPR) — Revisão da tentativa

> Abaixo, o conteúdo das atividades trabalhadas com os estudantes via Moodle, com as respostas corretas (incluindo comentários sobre o que foi parcialmente correto).

### Questão 1
**O padrão MVC (Model-View-Controller) é utilizado no desenvolvimento de software para organizar o código e separar responsabilidades. Qual é o principal objetivo desse padrão?**

- ~~a. Permitir que toda a aplicação seja desenvolvida em uma única classe.~~
- ~~b. Tornar o código Java mais rápido durante a execução.~~
- ✅ **c. Separar a aplicação em três componentes com responsabilidades distintas.**
- ~~d. Substituir completamente a programação orientada a objetos.~~
- ~~e. Eliminar a necessidade de utilizar classes e objetos.~~

### Questão 2
**Em uma aplicação Java desenvolvida utilizando MVC, qual é a principal responsabilidade do componente Model?**

- ~~a. Formatar os componentes gráficos da interface.~~
- ~~b. Controlar exclusivamente a navegação entre telas.~~
- ✅ **c. Representar os dados e as regras de negócio da aplicação.**
- ~~d. Receber os cliques realizados pelo usuário.~~
- ~~e. Apresentar informações na tela para o usuário.~~

### Questão 3
**Imagine um sistema de cadastro de alunos desenvolvido em Java. Qual das alternativas representa uma responsabilidade da View?**

- ~~a. Armazenar os dados do aluno no banco de dados.~~
- ~~b. Validar se a nota do aluno está entre 0 e 10.~~
- ~~c. Decidir qual regra de negócio deve ser executada.~~
- ✅ **d. Apresentar o nome e a média do aluno na tela.**
- ~~e. Calcular a média final do aluno.~~

### Questão 4
**Em uma aplicação MVC, o usuário clica no botão "Cadastrar". Qual componente deve receber e tratar essa ação, coordenando a operação entre a View e o Model?**

- ~~a. Model~~
- ~~b. View~~
- ~~c. Classe principal (Main), obrigatoriamente~~
- ✅ **d. Controller**
- ~~e. Banco de dados~~

### Questão 5
**Uma equipe de desenvolvimento decidiu reorganizar um sistema Java utilizando o padrão MVC. Qual das alternativas apresenta uma vantagem dessa organização?**

- ~~a. Obriga que todas as classes tenham os mesmos atributos.~~
- ~~b. Elimina completamente a possibilidade de erros.~~
- ~~c. Elimina a necessidade de criar métodos.~~
- ~~d. Impede que a aplicação utilize banco de dados.~~
- ✅ **e. Permite separar responsabilidades, facilitando a manutenção e a evolução do sistema.**

### Questão 6
**O que significa a sigla MVC?**

- ~~a. Main, View e Class.~~
- ✅ **b. Model, View e Controller.**
- ~~c. Model, Variable e Class.~~
- ~~d. Model, Visual e Code.~~
- ~~e. Method, Variable e Class.~~

### Questão 7
**Considere um sistema de cadastro de alunos. O usuário preenche um formulário e clica no botão "Salvar". Qual componente normalmente recebe essa ação e coordena a operação?**

- ~~a. Model~~
- ✅ **b. Controller**
- ~~c. Banco de dados~~
- ~~d. Construtor~~
- ~~e. View~~

### Questão 8
**Analise as afirmações sobre MVC:**
- I. O Model representa os dados e as regras de negócio.
- II. A View é responsável pela apresentação das informações.
- III. O Controller coordena as interações entre a View e o Model.

- ~~a. Apenas I está correta.~~
- ✅ **b. Todas estão corretas.**
- ~~c. Apenas I e II estão corretas.~~
- ~~d. Apenas II e III estão corretas.~~
- ~~e. Apenas II está correta.~~

### Questão 9
**Em uma aplicação Java com MVC, a classe Aluno que contém atributos como nome, matricula e métodos como calcularMedia() pertence tipicamente à camada:**

- ~~a. Controller~~
- ~~b. Service~~
- ✅ **c. Model**
- ~~d. Front-end~~
- ~~e. View~~

### Questão 10
**Uma equipe decidiu que a classe TelaCadastroUsuario fará validações de CPF, acessará o banco de dados e também exibirá mensagens ao usuário. Em relação ao MVC, essa decisão é:**

- ~~a. Correta, pois concentra tudo em um só lugar.~~
- ~~b. Obrigatória em todas as aplicações Java.~~
- ~~c. Irrelevante para o padrão MVC.~~
- ✅ **d. Incorreta, pois mistura responsabilidades de View, Controller e Model, violando o princípio da separação.**
- ~~e. Correta, desde que a classe seja grande o suficiente.~~

### Questão 11
**Qual benefício NÃO está associado ao uso do MVC?**

- ~~a. Possibilidade de trabalhar em equipe com divisão clara de tarefas.~~
- ~~b. Facilidade de manutenção do código.~~
- ~~c. Facilidade de testar o Model de forma isolada.~~
- ~~d. Reutilização da lógica de negócio em diferentes interfaces.~~
- ✅ **e. Garantia de que o sistema nunca terá bugs.**

### Questão 12 (completar — 6 pontos)
**No padrão MVC, o ____ representa os dados e as regras de negócio da aplicação; a ____ é responsável pela interface com o usuário; e o ____ atua como intermediário, recebendo as ações do usuário e coordenando as operações.**

✅ Resposta: parte 1: **Model**; parte 2: **View**; parte 3: **Controller**

### Questão 13 (preencher a lacuna)
**Em uma aplicação Java de console seguindo o MVC, a classe Main que lê dados via Scanner, chama métodos do Model e imprime resultados costuma ser classificada como parte da camada ____.**

✅ Resposta: **View**

### Questão 14 (completar as frases)
Complete as frases utilizando as palavras disponíveis:

- a) O **[Model]** é responsável por representar os dados e as regras de negócio da aplicação.
- b) A **[View]** é responsável por apresentar as informações ao usuário.
- c) O **[Controller]** recebe as ações do usuário e coordena as operações da aplicação.
- d) O Model pode ser responsável por manipular os **[dados]** do sistema.
- e) A View representa a **[interface]** com a qual o usuário interage.
- f) O Controller coordena as **[interações]** entre os componentes da arquitetura.

### Questão 15 (completar as lacunas) — ⚠️ Atenção à pegadinha
**Cenário: sistema de gerenciamento de produtos com tela de cadastro. Complete as lacunas indicando o componente MVC mais adequado:**

- a) A classe Produto pertence ao **[Model]**.
- b) A tela que apresenta o formulário de cadastro pertence à **[View]**.
- c) A classe que recebe a solicitação de cadastro e chama os métodos necessários pertence ao **[Controller]**.
- d) O método que verifica se o preço de um produto é maior que zero deve fazer parte, **preferencialmente**, do **[Controller]**.

> 📌 **Observação:** muitos marcam "Model" na letra (d) por pensar "validação = regra de negócio", mas o gabarito oficial do Moodle considera **Controller**. (Na tentativa revisada, marcar "Model" rendeu 0,75/1,00 — 3 de 4 corretas.) Vale discutir em aula: validações de entrada costumam ser feitas no Controller, enquanto regras de negócio puras (cálculos, estados) ficam no Model.

### Questão 16 (relacionar)
**Considere um sistema de gerenciamento de produtos. Relacione cada situação ao componente MVC correspondente:**

| Situação | Componente |
|---|---|
| (1) Exibir o preço de um produto na tela | ✅ **View** |
| (2) Calcular o valor total de uma compra | ✅ **Model** |
| (3) Receber o clique no botão "Adicionar" | ✅ **Controller** |
| (4) Representar um produto com nome e preço | ✅ **Model** |
| (5) Apresentar uma mensagem de sucesso | ✅ **View** |

### Questão 17 (questão dissertativa)
**Código analisado:**

```java
String nome = "Carlos";
double nota1 = 8.0;
double nota2 = 6.0;
double media = (nota1 + nota2) / 2;
if (media >= 7)
    System.out.println("Aluno: " + nome);
    System.out.println("Média: " + media);
    System.out.println("Aprovado");
else
    System.out.println("Reprovado");
```

**a) Qual parte do código poderia pertencer ao Model?**
✅ O cálculo da média e a verificação da aprovação poderiam pertencer ao Model.

**b) Qual parte poderia pertencer à View?**
✅ Os comandos `System.out.println()` pertencem à View, pois são responsáveis pela apresentação das informações.

**c) Qual seria a responsabilidade do Controller nessa aplicação?**
✅ O Controller seria responsável por coordenar a obtenção dos dados, a execução das regras de negócio e a apresentação dos resultados.

**d) Por que seria interessante dividir esse código em diferentes classes?**
✅ A divisão facilita a manutenção, reutilização e organização do código. Por exemplo, seria possível mudar a forma de apresentar os resultados sem modificar o cálculo da média.

### Questão 18 (criar a classe Produto — Model)
**Crie uma classe Java chamada `Produto` no package `model`, conforme o diagrama:** atributos `nome` (String) e `preco` (double), construtor, getters e método `exibirDados()`.

✅ **Modelo de resposta:**

```java
package model;

public class Produto {
    private String nome;
    private double preco;

    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    public String getNome() { return nome; }
    public double getPreco() { return preco; }

    public String exibirDados() {
        return "Produto: " + nome +
               "
Preço: R$ " + String.format("%.2f", preco);
    }
}
```

**Exemplo de utilização:**

```java
Produto p = new Produto("Mouse", 25.90);
System.out.println(p.exibirDados());
```

**Saída esperada:**
```
Produto: Mouse
Preço: R$ 25.90
```

### Questão 19 (criar a classe ProdutoView)
**Utilizando a classe Produto, crie `ProdutoView` no package `view`, responsável por apresentar as informações do produto.**

Implemente: `public void exibirProduto(Produto produto)` — apresenta nome e preço.

✅ **Modelo de resposta:**

```java
package view;

import model.Produto;

public class ProdutoView {
    public void exibirProduto(Produto produto) {
        System.out.println("Produto: " + produto.getNome());
        System.out.println("Preço: R$ " + produto.getPreco());
    }
}
```

### Questão 20 (criar a classe ProdutoController)
**Crie `ProdutoController` no package `controller`** com:

- Atributo privado `produto` do tipo `Produto`.
- Construtor que receba um objeto `Produto`.
- Método `exibirProduto()` que utilize a `ProdutoView` para apresentar as informações.

✅ **Modelo de resposta:**

```java
package controller;

import model.Produto;
import view.ProdutoView;

public class ProdutoController {
    private Produto produto;

    public ProdutoController(Produto produto) {
        this.produto = produto;
    }

    public void exibirProduto() {
        ProdutoView view = new ProdutoView();
        view.exibirProduto(produto);
    }
}
```

### Questão 21 (montar a aplicação — Principal)
**Crie `Principal` com o método `main()`:**

a) Crie um objeto `Produto` com nome "Teclado" e preço 120.00.
b) Crie um `ProdutoController`, passando o produto como argumento.
c) Utilize o Controller para solicitar a exibição dos dados do produto.

✅ **Modelo de resposta:**

```java
package app;

import controller.ProdutoController;
import model.Produto;

public class Principal {
    public static void main(String[] args) {
        // Model
        Produto produto = new Produto("Teclado", 120.00);
        // Controller
        ProdutoController controller = new ProdutoController(produto);
        // Solicita a exibição
        controller.exibirProduto();
    }
}
```

**Resultado esperado:**
```
Produto: Teclado
Preço: R$ 120.0
```

---

## 8. Síntese para estudo (resumo rápido)

- **Model** = dados + regras de negócio (o "cérebro" oculto).
- **View** = apresentação e interação com o usuário (a interface, "burra" mas bonita).
- **Controller** = intermediário que recebe ações, aciona o Model e atualiza a View.
- Separar responsabilidades facilita: manutenção, testes (Model isolado), reutilização (mesmo Model para console/GUI/web/mobile) e trabalho em equipe.
- Custo: mais classes/arquivos e curva de aprendizado inicial.
- Estrutura típica de projeto: packages `app` (Main), `model`, `view`, `controller`.
- Uma classe que **faz tudo** (lê entrada, valida, calcula e imprime) viola o MVC.
- Nenhum padrão elimina bugs — MVC organiza, não garante correção.

---
