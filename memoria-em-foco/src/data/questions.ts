import type { Question } from './types';

/**
 * Banco de questões. IDs são estáveis: o progresso salvo e a correção usam o ID,
 * nunca a posição. Cada questão principal aponta (retryId) para uma gêmea com o
 * mesmo conceito e outro exemplo, usada quando a estudante erra.
 */
export const questions: Question[] = [
  // ───────────── Lição 1 ─────────────
  {
    id: 'q1',
    lessonId: 'l1',
    type: 'single',
    prompt:
      'A professora fala o número da sala enquanto Ana conversa, e Ana nem percebe o número. Qual processo parece ter sido prejudicado primeiro?',
    choices: [
      {
        id: 'cod',
        text: 'Codificação',
        feedback:
          'Isso. Se Ana nem percebeu o número, a informação pode ter sido registrada de forma incompleta já na entrada.',
      },
      {
        id: 'arm',
        text: 'Armazenamento',
        feedback:
          'Armazenamento seria perder ao longo do tempo algo que foi bem aprendido. Mas a cena diz que Ana nem percebeu o número — há pouca base para supor que ele foi registrado.',
      },
      {
        id: 'rec',
        text: 'Recuperação',
        feedback:
          'Recuperação seria ter registrado e não conseguir acessar depois. Aqui o problema aparece antes: no momento em que o número foi dito.',
      },
    ],
    correctId: 'cod',
    explanation:
      'A atenção influencia o que conseguimos codificar. A cena dá pouca base para supor que a informação foi bem aprendida e depois perdida. [1]',
    retryId: 'v1',
  },
  {
    id: 'q1b',
    lessonId: 'l1',
    type: 'order',
    fictional: true,
    prompt: 'Coloque em ordem o que precisa acontecer para Júlia chegar à sala nova.',
    items: [
      { id: 'o1', text: 'Formar uma representação do aviso ao ouvi-lo (codificação)' },
      { id: 'o2', text: 'Reter o aviso durante os dias seguintes (armazenamento)' },
      { id: 'o3', text: 'Acessar o aviso na hora de escolher a sala (recuperação)' },
    ],
    explanation:
      'Primeiro a informação é registrada, depois retida e, por fim, acessada. Uma dificuldade em qualquer etapa pode terminar no mesmo “esqueci”. [1]',
    retryId: 'v1b',
  },
  {
    id: 'q2',
    lessonId: 'l1',
    type: 'single',
    prompt: 'Ontem Caio aprendeu o conteúdo. Hoje ele acessa o que estudou para responder à prova. Qual processo está em destaque?',
    choices: [
      {
        id: 'rec',
        text: 'Recuperação',
        feedback: 'Isso. A pergunta enfatiza acessar hoje o que foi aprendido ontem.',
      },
      {
        id: 'arm',
        text: 'Armazenamento',
        feedback:
          'O armazenamento aconteceu no intervalo entre ontem e hoje, e é necessário. Mas a cena destaca o momento de acessar o conteúdo na prova.',
      },
      {
        id: 'cod',
        text: 'Codificação',
        feedback: 'A codificação aconteceu ontem, quando Caio estudou. A cena destaca o que ele faz hoje.',
      },
    ],
    correctId: 'rec',
    explanation: 'Armazenamento descreve a retenção durante o intervalo. A pergunta enfatiza acessar o conteúdo hoje. [1]',
    retryId: 'v2',
  },

  // ───────────── Lição 2 ─────────────
  {
    id: 'q3',
    lessonId: 'l2',
    type: 'match',
    prompt: 'Associe cada ação ao tipo de memória que ela destaca.',
    pairs: [
      {
        id: 'p1',
        left: 'Calcular 27 menos 9 de cabeça',
        right: 'Memória de trabalho',
        feedback: 'Calcular de cabeça exige segurar os números na mente e operar com eles.',
      },
      {
        id: 'p2',
        left: 'Lembrar o almoço de ontem',
        right: 'Memória episódica',
        feedback: 'É um acontecimento vivido, com tempo e lugar.',
      },
      {
        id: 'p3',
        left: 'Saber o que significa “almoço”',
        right: 'Memória semântica',
        feedback: 'É um significado, independente de quando você aprendeu a palavra.',
      },
      {
        id: 'p4',
        left: 'Andar de bicicleta',
        right: 'Memória procedural',
        feedback: 'É uma habilidade praticada, que se executa sem descrever cada movimento.',
      },
    ],
    explanation: 'Trabalho, episódica, semântica e procedural, respectivamente. Em cada caso, a ação concreta é a pista. [1]',
    retryId: 'v3',
  },
  {
    id: 'q4',
    lessonId: 'l2',
    type: 'single',
    prompt: 'Repita 7–2–9. Agora diga os números na ordem inversa. O que a segunda tarefa acrescenta?',
    choices: [
      {
        id: 'manip',
        text: 'Manipular a informação mantida temporariamente',
        feedback: 'Isso. Para inverter (9–2–7), é preciso segurar a sequência e operar sobre ela.',
      },
      {
        id: 'sem',
        text: 'Conhecimento semântico sobre os números',
        feedback:
          'Saber os nomes dos números é necessário nas duas tarefas. Isso não explica a operação de inverter a sequência.',
      },
      {
        id: 'epi',
        text: 'Lembrar um acontecimento vivido',
        feedback: 'Não há episódio sendo lembrado. Tudo acontece no presente, durante a tarefa.',
      },
      {
        id: 'nada',
        text: 'Nada: é só repetir de novo',
        feedback: 'Repetir mantém a informação. Inverter exige mais: reorganizar a sequência enquanto ela fica na mente.',
      },
    ],
    correctId: 'manip',
    explanation: 'A resposta inversa é 9–2–7. Manter é repetir; manipular é operar sobre o que está sendo mantido. [1]',
    retryId: 'v4',
  },
  {
    id: 'q4b',
    lessonId: 'l2',
    type: 'short',
    prompt: 'Leia 5–3–8, tire os olhos da tela por um instante e digite os números na ordem inversa.',
    placeholder: 'Ex.: 1 2 3',
    accept: ['835'],
    correctAnswer: '8–3–5',
    explanation: 'A ordem inversa é 8–3–5. Você precisou manter a sequência e reorganizá-la: manutenção mais manipulação.',
    retryId: 'v4b',
  },
  {
    id: 'q12',
    lessonId: 'l2',
    type: 'open',
    prompt: 'Transferência: invente um exemplo de memória de trabalho e transforme a mesma situação em exemplo de memória episódica.',
    model:
      'Comparo o preço de dois produtos enquanto seguro os valores na mente. Amanhã conto à minha irmã o que aconteceu durante a compra.',
    criteria: ['Usei informação no presente, durante a tarefa.', 'Recuperei depois um acontecimento vivido.'],
    explanation: 'A mesma cena pode ilustrar dois tipos: o que acontece durante a tarefa e o que se lembra depois.',
    retryId: 'v12',
  },

  // ───────────── Lição 3 ─────────────
  {
    id: 'q7',
    lessonId: 'l3',
    type: 'single',
    fictional: true,
    prompt:
      'Um grupo teve média menor em um teste. Marina faz parte desse grupo. Posso prever que ela terá desempenho pior que qualquer integrante do outro grupo?',
    choices: [
      {
        id: 'nao',
        text: 'Não. A média resume o grupo, não a posição de cada integrante.',
        feedback: 'Isso. Pode haver pessoas do grupo com média menor que se saem melhor que muitas do outro grupo.',
      },
      {
        id: 'sim',
        text: 'Sim, se a diferença entre as médias foi significativa.',
        feedback:
          'Uma diferença significativa diz que as médias provavelmente diferem. Não diz onde cada pessoa está — os grupos se sobrepõem.',
      },
      {
        id: 'quase',
        text: 'Sim, na maioria das vezes.',
        feedback: 'A média não permite dizer isso para uma pessoa específica. Para saber de Marina, é preciso avaliar Marina.',
      },
    ],
    correctId: 'nao',
    explanation: 'Uma média resume o grupo e não estabelece a posição de cada integrante. [3, 4]',
    retryId: 'v7',
  },
  {
    id: 'q11',
    lessonId: 'l3',
    type: 'single',
    prompt:
      'Uma pessoa conta uma história detalhada da infância e tem dificuldade para seguir instruções novas. Isso é contraditório?',
    choices: [
      {
        id: 'nao',
        text: 'Não. São demandas diferentes de memória.',
        feedback:
          'Isso. Recuperar um episódio antigo e manter informações novas enquanto se age exigem coisas diferentes.',
      },
      {
        id: 'sim',
        text: 'Sim. Se a memória funciona para a infância, deveria funcionar para tudo.',
        feedback:
          'Esse raciocínio trata a memória como uma coisa só. Bom desempenho em uma tarefa não garante o mesmo em outra.',
      },
      {
        id: 'inventa',
        text: 'Sim. Provavelmente a história da infância não é verdadeira.',
        feedback: 'Nada na cena indica isso. A diferença de desempenho tem uma explicação mais simples: tarefas diferentes.',
      },
    ],
    correctId: 'nao',
    explanation:
      'Recuperar um episódio antigo (memória episódica) e manter instruções novas enquanto se age (memória de trabalho) são demandas diferentes. [1, 2]',
    retryId: 'v11',
  },

  // ───────────── Lição 4 ─────────────
  {
    id: 'q5',
    lessonId: 'l4',
    type: 'match',
    prompt: 'Classifique cada pergunta pelo tipo de tarefa.',
    pairs: [
      {
        id: 'p1',
        left: '“Quais palavras você ouviu?”',
        right: 'Recordação livre',
        feedback: 'Nenhuma ajuda: a pessoa precisa produzir as palavras sozinha.',
      },
      {
        id: 'p2',
        left: '“Havia uma fruta. Qual?”',
        right: 'Recordação com pista',
        feedback: 'A categoria “fruta” é uma pista, mas a pessoa ainda precisa produzir a palavra.',
      },
      {
        id: 'p3',
        left: '“Você ouviu manga ou uva?”',
        right: 'Reconhecimento',
        feedback: 'As opções estão na frente dela: basta identificar a que foi apresentada.',
      },
    ],
    explanation: 'A diferença é o tipo de ajuda fornecido para responder. [1]',
    retryId: 'v5',
  },
  {
    id: 'q6',
    lessonId: 'l4',
    type: 'single',
    prompt: 'Qual conclusão corresponde à meta-análise de Aleman et al. (1999)?',
    choices: [
      {
        id: 'recall',
        text: 'A diferença entre os grupos foi maior na recordação; no reconhecimento, menor, mas presente.',
        feedback: 'Isso. E “menor” não significa “ausente”.',
      },
      {
        id: 'intacto',
        text: 'O reconhecimento está intacto em pessoas com esquizofrenia.',
        feedback:
          'O reconhecimento também mostrou diferença significativa entre os grupos. A diferença foi menor, não inexistente.',
      },
      {
        id: 'reconh',
        text: 'A dificuldade foi maior no reconhecimento do que na recordação.',
        feedback: 'É o inverso: a diferença foi maior quando era preciso recordar sem opções.',
      },
    ],
    correctId: 'recall',
    explanation:
      'Aleman e colaboradores reuniram 70 estudos. A diferença média foi maior na recordação. No reconhecimento, foi menor, mas ainda significativa. [4]',
    retryId: 'v6',
  },
  {
    id: 'qPista',
    lessonId: 'l4',
    type: 'single',
    prompt: 'Se uma pista ajudou a pessoa a lembrar, isso prova que tudo foi armazenado perfeitamente?',
    choices: [
      {
        id: 'nao',
        text: 'Não. Mostra que a ajuda favoreceu o desempenho naquela tentativa.',
        feedback: 'Isso. Um resultado isolado não mede separadamente cada processo.',
      },
      {
        id: 'sim',
        text: 'Sim. Se lembrou com pista, a informação estava toda guardada.',
        feedback:
          'A pista mostra que algo estava acessível com ajuda. Não mostra que todos os detalhes foram registrados e retidos sem falhas.',
      },
      {
        id: 'cod',
        text: 'Sim, e prova também que a codificação foi perfeita.',
        feedback: 'É uma conclusão grande demais para um único resultado. A tentativa não mede cada etapa separadamente.',
      },
    ],
    correctId: 'nao',
    explanation: 'Um resultado isolado não mede separadamente todos os processos envolvidos. [1]',
    retryId: 'vPista',
  },

  // ───────────── Lição 5 ─────────────
  {
    id: 'q8',
    lessonId: 'l5',
    type: 'single',
    prompt: 'Uma pessoa não lembrou uma instrução. Isso demonstra o quê?',
    choices: [
      {
        id: 'ctx',
        text: 'Que precisamos de mais contexto para entender.',
        feedback: 'Isso. O mesmo comportamento pode ter explicações diferentes.',
      },
      {
        id: 'esq',
        text: 'Que a pessoa tem esquizofrenia.',
        feedback: 'Esquecer uma instrução é comum e não estabelece diagnóstico nenhum.',
      },
      {
        id: 'perda',
        text: 'Que a informação foi perdida definitivamente.',
        feedback: 'Talvez ela nem tenha sido registrada, ou talvez volte com uma pista. “Definitivamente” vai além do observado.',
      },
    ],
    correctId: 'ctx',
    explanation: 'O mesmo comportamento pode ter explicações diferentes e não estabelece diagnóstico. [1, 2]',
    retryId: 'v8',
  },
  {
    id: 'q9',
    lessonId: 'l5',
    type: 'single',
    fictional: true,
    prompt: 'Marina esqueceu o formato do arquivo. Qual pergunta ajuda mais a entender a situação?',
    choices: [
      {
        id: 'aberta',
        text: '“O que você conseguiu explicar logo depois de ouvir as instruções?”',
        feedback:
          'Isso. Investiga o registro inicial sem sugerir a resposta esperada. Ainda assim, sozinha, não resolve a causa.',
      },
      {
        id: 'indutora',
        text: '“Você estava prestando atenção em tudo, né?”',
        feedback:
          'O “né?” sugere qual resposta a pessoa deveria dar, e a pergunta soa como cobrança. A informação obtida fica pouco confiável.',
      },
      {
        id: 'diag',
        text: '“Isso acontece por causa do seu diagnóstico?”',
        feedback: 'Pede que a própria pessoa faça uma inferência causal que nem a observação permite. Não ajuda a entender o que aconteceu.',
      },
    ],
    correctId: 'aberta',
    explanation: 'Uma boa pergunta investiga o que aconteceu sem induzir a resposta. Nenhuma pergunta isolada diagnostica a causa. [1, 3]',
    retryId: 'v9',
  },

  // ───────────── Lição 6 ─────────────
  {
    id: 'q10',
    lessonId: 'l6',
    type: 'single',
    prompt: 'Um estudo com pessoas em primeiro episódio psicótico, antes do uso de antipsicóticos, permite concluir o quê?',
    choices: [
      {
        id: 'antes',
        text: 'Que dificuldades cognitivas podem estar presentes antes do tratamento, nessa população.',
        feedback: 'Isso. A conclusão fica restrita a quem foi estudado e ao que foi medido.',
      },
      {
        id: 'remedio',
        text: 'Que os antipsicóticos não afetam a cognição de ninguém.',
        feedback: 'O estudo avaliou pessoas que ainda não usavam antipsicóticos. Ele não mede o efeito de cada medicamento em cada pessoa.',
      },
      {
        id: 'sinonimo',
        text: 'Que toda pessoa em primeiro episódio psicótico tem esquizofrenia.',
        feedback: 'Primeiro episódio psicótico é uma categoria mais ampla. Não é sinônimo de esquizofrenia.',
      },
    ],
    correctId: 'antes',
    explanation:
      'O estudo não mede como cada medicamento afeta cada pessoa nem torna primeiro episódio psicótico sinônimo de esquizofrenia. [5]',
    retryId: 'v10',
  },
  {
    id: 'q13',
    lessonId: 'l6',
    type: 'single',
    prompt:
      'Você citou a meta-análise de Aleman (listas de palavras). A professora pergunta: “E as memórias de infância dessas pessoas, também são piores?” Qual é a melhor resposta?',
    choices: [
      {
        id: 'limite',
        text: '“O estudo que eu consultei avaliou tarefas como listas de palavras. Para responder sobre infância, eu precisaria de outro tipo de evidência.”',
        feedback: 'Isso. Você mostra o que foi medido e onde a conclusão para, sem inventar uma resposta.',
      },
      {
        id: 'sim',
        text: '“Sim, porque a memória delas é pior em geral.”',
        feedback: 'Isso estende o achado para algo que não foi medido. Lembranças de infância seriam outra questão de pesquisa.',
      },
      {
        id: 'nao',
        text: '“Não, as memórias antigas ficam preservadas.”',
        feedback: 'Também é uma afirmação sem base nas fontes estudadas. O problema é o mesmo: concluir sobre o que não foi medido.',
      },
    ],
    correctId: 'limite',
    explanation: 'Quem foi estudado? O que foi medido? Até onde a conclusão vai? [3, 4]',
    retryId: 'v13',
  },
];

/** Questões gêmeas: mesmo conceito, outro exemplo. Aparecem depois de um erro e na revisão. */
export const retryQuestions: Question[] = [
  {
    id: 'v1',
    lessonId: 'l1',
    type: 'single',
    prompt: 'O farmacêutico explica como tomar o remédio enquanto Pedro responde a uma mensagem no celular. Em casa, Pedro não sabe a dose. Onde a dificuldade parece ter começado?',
    choices: [
      { id: 'cod', text: 'Codificação', feedback: 'Isso. Com a atenção no celular, a explicação pode ter sido registrada só em parte.' },
      { id: 'arm', text: 'Armazenamento', feedback: 'Para falar em perda durante a retenção, seria preciso ter registrado bem. A cena sugere que a explicação mal entrou.' },
      { id: 'rec', text: 'Recuperação', feedback: 'Recuperação pressupõe que a informação foi registrada. A distração aconteceu antes, no momento da explicação.' },
    ],
    correctId: 'cod',
    explanation: 'Pouca atenção no momento em que a informação é apresentada pode prejudicar a codificação. [1]',
  },
  {
    id: 'v1b',
    lessonId: 'l1',
    type: 'order',
    prompt: 'Ordene as etapas para Rafael lembrar, no aniversário, o nome de alguém que conheceu numa festa no mês passado.',
    items: [
      { id: 'o1', text: 'Registrar o nome quando foi apresentado (codificação)' },
      { id: 'o2', text: 'Manter o nome durante o mês (armazenamento)' },
      { id: 'o3', text: 'Acessar o nome ao reencontrar a pessoa (recuperação)' },
    ],
    explanation: 'Registrar, reter, acessar. É a mesma sequência, com outro conteúdo. [1]',
  },
  {
    id: 'v2',
    lessonId: 'l1',
    type: 'single',
    prompt: 'Lúcia decorou a senha do Wi-Fi na semana passada. Hoje, um amigo pede a senha e ela tenta lembrar. Qual processo está em destaque agora?',
    choices: [
      { id: 'rec', text: 'Recuperação', feedback: 'Isso. O foco é acessar, hoje, o que foi retido.' },
      { id: 'arm', text: 'Armazenamento', feedback: 'O armazenamento cobre a semana de intervalo. O momento descrito é o de acessar a senha.' },
      { id: 'cod', text: 'Codificação', feedback: 'A codificação foi na semana passada, quando ela decorou.' },
    ],
    correctId: 'rec',
    explanation: 'Codificar é registrar, armazenar é reter, recuperar é acessar. A cena descreve o acesso. [1]',
  },
  {
    id: 'v3',
    lessonId: 'l2',
    type: 'match',
    prompt: 'Associe cada ação ao tipo de memória que ela destaca.',
    pairs: [
      { id: 'p1', left: 'Guardar um código de 4 dígitos enquanto digita', right: 'Memória de trabalho', feedback: 'Segurar o código só enquanto ele é usado.' },
      { id: 'p2', left: 'Contar como foi sua formatura', right: 'Memória episódica', feedback: 'Um acontecimento vivido, com lugar e momento.' },
      { id: 'p3', left: 'Saber que Brasília é a capital do Brasil', right: 'Memória semântica', feedback: 'Um conhecimento geral, sem precisar lembrar quando foi aprendido.' },
      { id: 'p4', left: 'Digitar sem olhar o teclado', right: 'Memória procedural', feedback: 'Uma habilidade praticada até ficar automática.' },
    ],
    explanation: 'Mesmo raciocínio, outras ações: usar agora, lembrar um episódio, saber um significado, executar uma habilidade. [1]',
  },
  {
    id: 'v4',
    lessonId: 'l2',
    type: 'single',
    prompt: 'Diga as letras M–A–R. Agora coloque-as em ordem alfabética, sem escrever. O que a segunda tarefa exige a mais?',
    choices: [
      { id: 'manip', text: 'Operar sobre a informação mantida na mente', feedback: 'Isso. Reordenar (A–M–R) é manipular o que está sendo mantido.' },
      { id: 'sem', text: 'Saber o alfabeto, e nada mais', feedback: 'Conhecer o alfabeto ajuda, mas é preciso segurar as três letras e reorganizá-las ao mesmo tempo.' },
      { id: 'proc', text: 'Uma habilidade motora praticada', feedback: 'Não há movimento a executar. A tarefa acontece na mente.' },
    ],
    correctId: 'manip',
    explanation: 'Manter é segurar a informação; manipular é transformá-la enquanto ela está sendo mantida. [1]',
  },
  {
    id: 'v4b',
    lessonId: 'l2',
    type: 'short',
    prompt: 'Leia 6–1–4–9, desvie o olhar e digite os números na ordem inversa.',
    placeholder: 'Ex.: 1 2 3 4',
    accept: ['9416'],
    correctAnswer: '9–4–1–6',
    explanation: 'A ordem inversa é 9–4–1–6. Com quatro números, manter e manipular ao mesmo tempo fica mais trabalhoso.',
  },
  {
    id: 'v12',
    lessonId: 'l2',
    type: 'open',
    prompt: 'Outra tentativa: pense em uma receita de cozinha. Crie um exemplo de memória de trabalho e, com a mesma situação, um de memória episódica.',
    model:
      'Enquanto cozinho, seguro na mente quantas colheres de açúcar já coloquei. No dia seguinte, conto a uma amiga que o bolo queimou porque o forno estava forte demais.',
    criteria: ['Usei informação no presente, durante a tarefa.', 'Recuperei depois um acontecimento vivido.'],
    explanation: 'Durante a tarefa: memória de trabalho. Lembrança do acontecido: memória episódica.',
  },
  {
    id: 'v7',
    lessonId: 'l3',
    type: 'single',
    prompt: 'Em média, a turma A tirou nota menor que a turma B em matemática. Léo é da turma A. Ele certamente tirou nota menor que todos da turma B?',
    choices: [
      { id: 'nao', text: 'Não. A média da turma não define a nota de cada aluno.', feedback: 'Isso. Léo pode ter uma das maiores notas das duas turmas.' },
      { id: 'sim', text: 'Sim, a média mostra isso.', feedback: 'A média é um resumo. Alunos das duas turmas podem ter notas parecidas ou até invertidas.' },
      { id: 'quase', text: 'Provavelmente sim, quase com certeza.', feedback: 'Sem a nota de Léo, a média não permite essa previsão sobre ele.' },
    ],
    correctId: 'nao',
    explanation: 'Uma média resume o grupo e não estabelece a posição de cada integrante. [3, 4]',
  },
  {
    id: 'v11',
    lessonId: 'l3',
    type: 'single',
    prompt: 'Um avô lembra com detalhes do casamento, há 50 anos, mas se perde ao seguir a receita nova que a neta ditou. Isso é contraditório?',
    choices: [
      { id: 'nao', text: 'Não. Lembrar um episódio antigo e seguir instruções novas são demandas diferentes.', feedback: 'Isso. Uma tarefa não garante o desempenho na outra.' },
      { id: 'sim', text: 'Sim. Quem lembra do passado deveria lembrar de tudo.', feedback: 'A memória não é uma coisa só. Episódios antigos e instruções novas exigem processos diferentes.' },
      { id: 'finge', text: 'Sim. Ele deve estar fingindo.', feedback: 'Nada sugere isso. A explicação mais simples é que as tarefas exigem coisas diferentes.' },
    ],
    correctId: 'nao',
    explanation: 'Memória episódica antiga e memória de trabalho com informação nova são demandas diferentes. [1]',
  },
  {
    id: 'v5',
    lessonId: 'l4',
    type: 'match',
    prompt: 'Classifique cada pergunta, sobre uma lista de animais que você ouviu.',
    pairs: [
      { id: 'p1', left: '“Diga todos os animais que você lembra.”', right: 'Recordação livre', feedback: 'Nenhuma ajuda é dada.' },
      { id: 'p2', left: '“Um deles voava. Qual?”', right: 'Recordação com pista', feedback: 'A dica restringe a busca, mas a resposta ainda precisa ser produzida.' },
      { id: 'p3', left: '“Era pato ou ganso?”', right: 'Reconhecimento', feedback: 'As opções estão apresentadas: basta identificar.' },
    ],
    explanation: 'O que muda é a ajuda: nenhuma, uma pista, ou as próprias opções. [1]',
  },
  {
    id: 'v6',
    lessonId: 'l4',
    type: 'single',
    prompt: 'Uma colega resume Aleman et al. (1999): “Pessoas com esquizofrenia só têm dificuldade quando precisam recordar sozinhas”. O resumo está correto?',
    choices: [
      { id: 'nao', text: 'Não. O reconhecimento também mostrou diferença, só que menor.', feedback: 'Isso. Menor não é ausente.' },
      { id: 'sim', text: 'Sim, no reconhecimento não houve diferença.', feedback: 'Houve diferença significativa também no reconhecimento, ainda que menor.' },
      { id: 'inverso', text: 'Não. A diferença maior foi no reconhecimento.', feedback: 'O resumo erra, mas não por isso: a diferença maior foi na recordação.' },
    ],
    correctId: 'nao',
    explanation: 'Na meta-análise de 70 estudos, a diferença foi maior na recordação e menor, mas significativa, no reconhecimento. [4]',
  },
  {
    id: 'vPista',
    lessonId: 'l4',
    type: 'single',
    prompt: 'Com a dica “começa com B”, Bia lembrou o nome do filme. Dá para concluir que a memória dela sobre o filme está completa?',
    choices: [
      { id: 'nao', text: 'Não. A dica ajudou naquela tentativa; isso não mede tudo o que ela guardou.', feedback: 'Isso. Um acerto com pista não descreve todos os processos.' },
      { id: 'sim', text: 'Sim, se lembrou o nome, lembra do filme todo.', feedback: 'Lembrar o nome não mostra que os detalhes do filme foram registrados e retidos.' },
      { id: 'falha', text: 'Não, prova que a memória dela é ruim.', feedback: 'Precisar de pista é comum e também não permite essa conclusão.' },
    ],
    correctId: 'nao',
    explanation: 'Uma pista favorece o desempenho naquela tentativa. Não mede separadamente cada processo. [1]',
  },
  {
    id: 'v8',
    lessonId: 'l5',
    type: 'single',
    prompt: 'Um colega de trabalho esqueceu de enviar o relatório que o chefe pediu na reunião. O que isso demonstra?',
    choices: [
      { id: 'ctx', text: 'Que precisamos saber mais sobre o que aconteceu.', feedback: 'Isso. Pode ter sido o momento do pedido, o excesso de tarefas, a falta de lembrete...' },
      { id: 'transt', text: 'Que ele tem algum transtorno de memória.', feedback: 'Um esquecimento isolado não estabelece diagnóstico.' },
      { id: 'desinteresse', text: 'Que ele não se importa com o trabalho.', feedback: 'É uma interpretação sobre intenção, que a cena não sustenta.' },
    ],
    correctId: 'ctx',
    explanation: 'O mesmo comportamento pode ter explicações diferentes. Observação isolada não estabelece causa. [1]',
  },
  {
    id: 'v9',
    lessonId: 'l5',
    type: 'single',
    prompt: 'Um paciente não lembra a orientação sobre o horário da consulta. Qual pergunta ajuda mais a entender?',
    choices: [
      { id: 'aberta', text: '“Do que você lembra da orientação que recebeu?”', feedback: 'Isso. É aberta e não sugere uma resposta.' },
      { id: 'indutora', text: '“Você não prestou atenção, não foi?”', feedback: 'Sugere a resposta e soa como acusação.' },
      { id: 'fechada', text: '“Você sempre esquece as coisas?”', feedback: 'Generaliza e não investiga o que aconteceu naquela orientação.' },
    ],
    correctId: 'aberta',
    explanation: 'Perguntas abertas sobre o que foi registrado ajudam a levantar hipóteses sem induzir a resposta. [1]',
  },
  {
    id: 'v10',
    lessonId: 'l6',
    type: 'single',
    prompt: 'Um estudo avaliou estudantes universitários dormindo pouco antes de uma prova. O que ele permite concluir?',
    choices: [
      { id: 'pop', text: 'Algo sobre universitários nessa condição, na tarefa medida.', feedback: 'Isso. A conclusão acompanha quem foi estudado e o que foi medido.' },
      { id: 'todos', text: 'Como o sono afeta qualquer pessoa em qualquer tarefa.', feedback: 'Extrapola a população e a tarefa avaliadas.' },
      { id: 'voce', text: 'Exatamente como você vai se sair na sua próxima prova.', feedback: 'Um estudo de grupo não define o desempenho de uma pessoa específica.' },
    ],
    correctId: 'pop',
    explanation: 'Quem foi estudado? O que foi medido? Até onde a conclusão vai?',
  },
  {
    id: 'v13',
    lessonId: 'l6',
    type: 'single',
    prompt:
      'Você citou o estudo de 2024 com primeiro episódio psicótico. A professora pergunta: “Então qual antipsicótico prejudica mais a memória?” Qual é a melhor resposta?',
    choices: [
      {
        id: 'limite',
        text: '“O estudo que consultei avaliou pessoas antes do uso de antipsicóticos. Para comparar medicamentos, eu precisaria de outro tipo de evidência.”',
        feedback: 'Isso. Você delimita o que foi medido e não inventa um dado.',
      },
      { id: 'chute', text: 'Citar o medicamento mais conhecido.', feedback: 'Seria uma afirmação sem base nas fontes estudadas.' },
      { id: 'nenhum', text: '“Nenhum, o estudo mostrou que a culpa não é dos remédios.”', feedback: 'O estudo não mediu efeitos de medicamentos. Ele mostrou diferenças antes do tratamento.' },
    ],
    correctId: 'limite',
    explanation: '“O estudo que eu consultei avaliou X. Para responder sobre Y, eu precisaria de outro tipo de evidência.” [5]',
  },
];

const all = [...questions, ...retryQuestions];
export const getQuestion = (id: string) => all.find((q) => q.id === id);
