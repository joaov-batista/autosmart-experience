import type { Lesson } from './types';

export const lessons: Lesson[] = [
  {
    id: 'l1',
    number: 1,
    title: 'Quando alguém diz “esqueci”, o que aconteceu?',
    summary: 'Codificação, armazenamento, recuperação e o papel da atenção.',
    steps: [
      {
        kind: 'situation',
        fictional: true,
        text: 'Júlia chega à sala de sempre e descobre que a aula mudou de lugar. Ela diz: “Esqueci o aviso”.',
        prompt: 'Só por essa frase, conseguimos descobrir onde houve dificuldade?',
        options: [
          {
            id: 'a',
            text: 'Sim: ela não guardou a informação na memória.',
            feedback:
              'É uma hipótese possível, mas a frase não mostra isso. Ela pode ter registrado o aviso e só não ter conseguido acessá-lo na hora certa.',
          },
          {
            id: 'b',
            text: 'Não: a frase descreve o resultado, mas não mostra em que etapa surgiu a dificuldade.',
            feedback:
              'Boa previsão. “Esqueci” é o que observamos. Para explicar, precisamos saber como ela recebeu o aviso e como tentou lembrar dele.',
          },
          {
            id: 'c',
            text: 'Sim: ela estava distraída quando o aviso foi dado.',
            feedback:
              'Distração é uma explicação plausível, mas nada na frase diz que ela estava distraída. Você completou a cena com uma suposição.',
          },
        ],
      },
      {
        kind: 'concept',
        paragraphs: [
          'Memória é o conjunto de processos que permite registrar informações e experiências, conservá-las ao longo do tempo e acessá-las depois. [1]',
          'A atenção influencia o que conseguimos codificar: o que mal percebemos tende a ser registrado de forma incompleta. [1]',
        ],
        bullets: [
          { term: 'Codificação', text: 'formação de uma representação da informação.' },
          { term: 'Armazenamento', text: 'retenção dessa informação ao longo do tempo.' },
          { term: 'Recuperação', text: 'acesso ao que foi retido.' },
        ],
        keyPhrase:
          'O esquecimento é o que observamos. A explicação depende de como a informação foi aprendida e de como tentamos recuperá-la.',
      },
      {
        kind: 'example',
        fictional: true,
        paragraphs: [
          'Dois caminhos diferentes para o mesmo “esqueci”:',
          'Se Júlia conversava enquanto o aviso era dado, pode ter registrado apenas parte da mensagem — a dificuldade apareceria na codificação.',
          'Se ela ouviu, entendeu e só lembrou da sala nova quando uma colega disse “era perto da biblioteca”, temos um exemplo de recuperação apoiada por pista.',
          'Um relato isolado não revela com certeza em qual processo surgiu a dificuldade. [1]',
        ],
      },
      { kind: 'quiz', questionId: 'q1' },
      { kind: 'quiz', questionId: 'q1b' },
      { kind: 'quiz', questionId: 'q2' },
      {
        kind: 'explain',
        prompt:
          'Explique, como se falasse com a professora: por que “esqueci” não basta para saber onde a memória teve dificuldade?',
        model:
          'Memória envolve codificar, armazenar e recuperar. “Esqueci” descreve só o resultado. A pessoa pode ter registrado mal a informação, por exemplo por pouca atenção, ou pode ter registrado e não conseguido acessá-la depois. Sem saber como ela aprendeu e como tentou lembrar, não dá para afirmar em qual etapa houve dificuldade.',
        criteria: [
          'Citei pelo menos duas etapas ou hipóteses diferentes.',
          'Expliquei por que a observação isolada não basta.',
        ],
      },
    ],
  },
  {
    id: 'l2',
    number: 2,
    title: 'Como distinguir os tipos de memória?',
    summary: 'Memória de trabalho, episódica, semântica e procedural em uma única cena.',
    steps: [
      {
        kind: 'situation',
        text: 'Uma aluna vai de bicicleta à faculdade, calcula mentalmente o troco do lanche e depois conta à amiga o que aconteceu na cantina.',
        prompt: 'Nessa manhã, ela usou um único tipo de memória?',
        options: [
          {
            id: 'a',
            text: 'Sim, é tudo “a memória dela”, uma coisa só.',
            feedback:
              'No dia a dia falamos assim, mas pedalar, calcular e contar uma história exigem coisas diferentes. A psicologia separa essas funções para estudá-las.',
          },
          {
            id: 'b',
            text: 'Não: cada atividade destaca um tipo diferente de memória.',
            feedback:
              'Boa previsão. Vamos ver que cada ação da cena ilustra um sistema diferente — mesmo que, na vida real, eles atuem juntos.',
          },
          {
            id: 'c',
            text: 'Não, mas só o cálculo do troco envolve memória.',
            feedback:
              'Pedalar e contar o que aconteceu também dependem de memória: uma habilidade aprendida e uma experiência vivida.',
          },
        ],
      },
      {
        kind: 'concept',
        paragraphs: ['Quatro tipos, quatro pedaços da mesma cena: [1]'],
        bullets: [
          {
            term: 'Memória de trabalho',
            text: 'mantém e permite manipular temporariamente a informação necessária para uma tarefa. Calcular o troco exige segurar valores na mente e operar com eles.',
          },
          {
            term: 'Memória episódica',
            text: 'permite lembrar acontecimentos vividos e seu contexto: “Ontem, na cantina, a máquina do cartão falhou enquanto eu comprava o lanche.”',
          },
          {
            term: 'Memória semântica',
            text: 'envolve conhecimentos, conceitos e significados. Saber o que é “troco” independe de lembrar o dia em que aprendemos a palavra.',
          },
          {
            term: 'Memória procedural',
            text: 'aparece em habilidades aprendidas e praticadas, como equilibrar-se e pedalar. Dá para executar sem conseguir descrever cada movimento.',
          },
        ],
      },
      {
        kind: 'example',
        paragraphs: [
          'Repetir um número de telefone por alguns segundos ilustra a manutenção na memória de trabalho. Dizer o mesmo número de trás para frente acrescenta manipulação.',
          'Aprofundamento: “codificação” e “memória episódica” respondem a perguntas diferentes. A primeira nomeia um processo; a segunda descreve um tipo de memória. Uma experiência episódica também precisa ser codificada e depois recuperada. [1]',
          'Os exemplos separam as funções para facilitar o estudo. Uma atividade real pode envolver várias delas ao mesmo tempo.',
        ],
      },
      { kind: 'quiz', questionId: 'q3' },
      { kind: 'quiz', questionId: 'q4' },
      { kind: 'quiz', questionId: 'q4b' },
      { kind: 'quiz', questionId: 'q12' },
      {
        kind: 'explain',
        prompt: 'Explique sem olhar: qual a diferença entre memória de trabalho e memória episódica? Use um exemplo seu.',
        model:
          'A memória de trabalho mantém e manipula informação durante uma tarefa no presente, como segurar dois preços na cabeça para calcular a diferença. A memória episódica recupera um acontecimento vivido e seu contexto, como contar amanhã o que aconteceu durante a compra.',
        criteria: [
          'Mostrei que a memória de trabalho usa a informação no presente, enquanto faço algo.',
          'Mostrei que a episódica recupera um acontecimento vivido, com contexto.',
        ],
      },
    ],
  },
  {
    id: 'l3',
    number: 3,
    title: 'O que a esquizofrenia tem a ver com a memória?',
    summary: 'Sintomas, dificuldades cognitivas, médias de grupo e variação individual.',
    steps: [
      {
        kind: 'situation',
        text: 'Alguém ouve: “Pegue o formulário, leve à secretaria e depois me entregue o comprovante”. No dia seguinte, perguntam o que a secretaria explicou.',
        prompt: 'Essas duas situações exigem exatamente a mesma coisa da memória?',
        options: [
          {
            id: 'a',
            text: 'Sim: nos dois casos é só lembrar.',
            feedback:
              'Parecem iguais, mas a primeira pede para manter uma sequência disponível enquanto se age; a segunda pede para recuperar algo aprendido antes.',
          },
          {
            id: 'b',
            text: 'Não: a primeira exige manter a sequência enquanto age; a segunda, recuperar algo aprendido antes.',
            feedback: 'Boa previsão. Por isso uma pessoa pode achar uma das tarefas mais difícil do que a outra.',
          },
          {
            id: 'c',
            text: 'Não: só a segunda envolve memória.',
            feedback:
              'A primeira também envolve memória — a de trabalho, que segura a sequência de passos enquanto a pessoa age.',
          },
        ],
      },
      {
        kind: 'concept',
        paragraphs: [
          'Esquizofrenia é um transtorno mental que pode envolver sintomas psicóticos, como delírios e alucinações; sintomas negativos, como redução da iniciativa; e dificuldades cognitivas, como alterações de atenção, aprendizagem e memória. A experiência e a intensidade das dificuldades variam entre pessoas. [2]',
          'A memória de trabalho e a aprendizagem de informação verbal são áreas importantes para entender o cotidiano. [2, 3]',
          'Ao comparar grupos, pesquisas encontram, em média, desempenho inferior em várias tarefas de memória entre pessoas com esquizofrenia. Há variação dentro dos grupos. [2, 3, 4]',
        ],
        keyPhrase:
          'O diagnóstico sozinho não indica quantas instruções uma pessoa consegue seguir, o que recorda da própria infância nem como vai se sair na faculdade.',
      },
      {
        kind: 'example',
        paragraphs: [
          'Outro exemplo: em uma reunião, alguém precisa anotar três tarefas enquanto o colega continua falando. Isso pesa sobre a memória de trabalho.',
          'Uma semana depois, perguntam o que foi decidido na reunião. Agora é preciso recuperar informação aprendida antes.',
          'Linguagem: prefira “pessoas com esquizofrenia” e “pessoas sem esquizofrenia”. A pessoa vem antes do diagnóstico.',
        ],
      },
      { kind: 'quiz', questionId: 'q7' },
      { kind: 'quiz', questionId: 'q11' },
      {
        kind: 'explain',
        prompt: 'Explique sem olhar: o que as pesquisas encontram sobre memória na esquizofrenia, e qual é o limite dessa conclusão?',
        model:
          'Comparando grupos, as pesquisas encontram, em média, desempenho inferior em várias tarefas de memória entre pessoas com esquizofrenia, como memória de trabalho e aprendizagem verbal. Mas há variação dentro dos grupos. O diagnóstico, sozinho, não diz como uma pessoa específica vai se sair.',
        criteria: [
          'Falei em diferença média entre grupos em alguma tarefa de memória.',
          'Reconheci a variação individual e o limite para falar de uma pessoa.',
        ],
      },
    ],
  },
  {
    id: 'l4',
    number: 4,
    title: 'Lembrar sozinho e reconhecer são a mesma coisa?',
    summary: 'Recordação livre, recordação com pista, reconhecimento e a meta-análise de Aleman.',
    steps: [
      {
        kind: 'situation',
        text: 'Você vai ver uma lista curta de palavras. Depois vai tentar lembrar delas de duas formas diferentes.',
        prompt: 'Qual forma você imagina que será mais fácil?',
        options: [
          {
            id: 'a',
            text: 'Escrever sozinha as palavras que lembro.',
            feedback:
              'Vamos testar. Escrever sem nenhuma ajuda exige produzir a palavra por conta própria — costuma ser a forma mais exigente.',
          },
          {
            id: 'b',
            text: 'Apontar quais palavras estavam na lista, entre opções.',
            feedback:
              'Vamos testar. Quando as opções aparecem, a própria palavra serve de apoio — por isso essa forma costuma ser mais fácil.',
          },
          {
            id: 'c',
            text: 'Tanto faz, é a mesma coisa.',
            feedback:
              'Vamos testar. As duas envolvem memória, mas oferecem apoios diferentes — e isso pode mudar o desempenho.',
          },
        ],
      },
      { kind: 'demo', demo: 'word-lists' },
      {
        kind: 'concept',
        paragraphs: ['O que você acabou de fazer tem nome: [1, 4]'],
        bullets: [
          { term: 'Recordação livre', text: 'produzir a informação sem receber opções.' },
          { term: 'Recordação com pista', text: 'recuperar a informação com uma ajuda, como “havia uma fruta”.' },
          { term: 'Reconhecimento', text: 'identificar, entre opções, o que foi apresentado anteriormente.' },
        ],
        keyPhrase: '“Qual era a fruta?” oferece uma pista de categoria. “Era manga ou uva?” oferece opções para reconhecimento.',
      },
      {
        kind: 'example',
        paragraphs: [
          'Achado para citar em voz alta: Aleman e colaboradores reuniram 70 estudos em uma meta-análise publicada em 1999. [4]',
          'A diferença média entre pessoas com esquizofrenia e grupos de comparação foi maior na recordação. No reconhecimento, a diferença foi menor, mas ainda significativa. [4]',
          'É incorreto transformar esse resultado em “quem tem esquizofrenia sempre reconhece tudo”. Menor não significa ausente.',
          'E se uma pista ajudou? Isso não prova que tudo foi armazenado perfeitamente. Mostra que a ajuda favoreceu o desempenho naquela tentativa. Um resultado isolado não mede separadamente todos os processos envolvidos.',
        ],
      },
      { kind: 'quiz', questionId: 'q5' },
      { kind: 'quiz', questionId: 'q6' },
      { kind: 'quiz', questionId: 'qPista' },
      {
        kind: 'explain',
        prompt: 'Explique sem olhar o achado de Aleman et al. (1999) e diga o que ele NÃO permite concluir.',
        model:
          'Aleman e colaboradores reuniram 70 estudos em uma meta-análise. Em média, a diferença entre pessoas com esquizofrenia e grupos de comparação foi maior na recordação e menor no reconhecimento, mas ainda presente. Isso não permite dizer que o reconhecimento está intacto, nem prever o desempenho de uma pessoa específica.',
        criteria: [
          'Descrevi corretamente: diferença maior na recordação, menor (mas presente) no reconhecimento.',
          'Disse um limite da conclusão (não é “reconhecimento intacto” ou não vale automaticamente para uma pessoa).',
        ],
      },
    ],
  },
  {
    id: 'l5',
    number: 5,
    title: 'Como interpretar uma dificuldade no cotidiano?',
    summary: 'Separar observação, hipóteses e o que ajudaria a entender. Adaptar sem infantilizar.',
    steps: [
      {
        kind: 'situation',
        fictional: true,
        text: 'Marina, estudante com esquizofrenia, ouviu quatro orientações rápidas para entregar um trabalho. Em casa, lembrava o tema e a data, mas ficou em dúvida sobre o formato do arquivo.',
        prompt: 'O que dá para afirmar com segurança?',
        options: [
          {
            id: 'a',
            text: 'Que a esquizofrenia causou o esquecimento.',
            feedback:
              'O diagnóstico não explica, sozinho, por que ela esqueceu este detalhe. Muitas pessoas sem esquizofrenia também esqueceriam uma orientação rápida.',
          },
          {
            id: 'b',
            text: 'Que ela lembrou alguns detalhes e ficou em dúvida sobre outro.',
            feedback: 'Boa previsão. Isso é o que foi observado. O restante são hipóteses que precisam de mais informação.',
          },
          {
            id: 'c',
            text: 'Que ela não prestou atenção ao formato.',
            feedback: 'É uma hipótese, não uma observação. Ela pode ter ouvido e ter dificuldade para recuperar o detalhe depois.',
          },
        ],
      },
      {
        kind: 'concept',
        paragraphs: ['Separe três coisas antes de concluir: [1, 2, 3]'],
        bullets: [
          { term: '1. O que foi observado?', text: 'Marina lembrou de alguns detalhes e ficou em dúvida sobre outro.' },
          {
            term: '2. Quais hipóteses são plausíveis?',
            text: 'Ela pode ter perdido parte da fala, ter tido dificuldade para manter as instruções em mente enquanto acompanhava o restante, ou ter dificuldade para recuperar aquele detalhe depois.',
          },
          {
            term: '3. O que ajudaria a entender?',
            text: 'Saber se ouviu bem, se conseguiu explicar as instruções logo depois, se isso se repete e se uma pista facilita a lembrança.',
          },
        ],
        keyPhrase: 'Nenhuma dessas observações, sozinha, permite diagnosticar a causa.',
      },
      {
        kind: 'example',
        paragraphs: [
          'Formas de adaptar a tarefa (não a pessoa):',
          'Entregar as orientações também por escrito permite consultar o formato depois.',
          'Dividir a tarefa em passos reduz a quantidade de informação que precisa ficar disponível ao mesmo tempo.',
          'Perguntar “como você pretende começar?” ajuda a verificar o que ficou claro, sem pressupor incapacidade. E vale perguntar à própria pessoa se a estratégia ajuda.',
        ],
      },
      { kind: 'quiz', questionId: 'q8' },
      { kind: 'quiz', questionId: 'q9' },
      {
        kind: 'explain',
        prompt: 'Explique sem olhar: como você analisaria o caso de Marina e que adaptação proporia?',
        model:
          'Primeiro separo o observado — ela lembrou tema e data e ficou em dúvida sobre o formato — das hipóteses: pode ter perdido parte da fala, não ter conseguido manter tudo em mente ou ter dificuldade para recuperar o detalhe. Para entender, perguntaria o que ela conseguiu explicar logo depois. Como adaptação, entregaria as orientações também por escrito, o que reduz o que precisa ficar na mente, e perguntaria a ela se isso ajuda.',
        criteria: [
          'Separei observação de hipótese, sem fechar diagnóstico.',
          'Propus uma adaptação concreta e disse que demanda ela reduz.',
        ],
      },
    ],
  },
  {
    id: 'l6',
    number: 6,
    title: 'Como defender uma afirmação científica?',
    summary: 'Quem foi estudado, o que foi medido e até onde a conclusão vai.',
    steps: [
      {
        kind: 'situation',
        text: 'Uma pesquisa compara o desempenho médio de dois grupos em uma lista de palavras. Alguém conclui: “Então pessoas com esquizofrenia esquecem a própria infância”.',
        prompt: 'Essa conclusão acompanha o que foi medido?',
        options: [
          {
            id: 'a',
            text: 'Sim, memória é memória.',
            feedback:
              'Lista de palavras e lembranças de infância são tarefas diferentes. Uma não responde automaticamente pela outra.',
          },
          {
            id: 'b',
            text: 'Não: o estudo mediu desempenho em uma lista, não lembranças de infância.',
            feedback: 'Boa previsão. A conclusão foi além do que foi medido.',
          },
          {
            id: 'c',
            text: 'Só se o estudo tiver muitos participantes.',
            feedback:
              'Um estudo grande dá mais confiança sobre o que mediu, mas não amplia o que foi medido. Continua sendo uma lista de palavras.',
          },
        ],
      },
      {
        kind: 'concept',
        paragraphs: ['Três perguntas para qualquer afirmação científica:'],
        bullets: [
          { term: 'Quem foi estudado?', text: 'Qual população, em que condição.' },
          { term: 'O que foi medido?', text: 'Qual tarefa ou indicador.' },
          { term: 'Até onde a conclusão vai?', text: 'Grupos ou indivíduos? Aquela tarefa ou outras?' },
        ],
        keyPhrase: '“O estudo que eu consultei avaliou X. Para responder sobre Y, eu precisaria de outro tipo de evidência.”',
      },
      {
        kind: 'example',
        paragraphs: [
          'Exemplo A: uma pesquisa que compara médias de dois grupos em uma lista de palavras informa sobre diferenças naquela tarefa. Para descrever a memória de uma pessoa específica, é preciso avaliar essa pessoa. Para falar de lembranças de infância, seria preciso investigar essa outra questão. [3, 4]',
          'Exemplo B: “A dificuldade é sempre causada pela medicação?” Uma revisão sistemática com meta-análise de 2024 encontrou diferenças cognitivas em pessoas no primeiro episódio psicótico que ainda não tinham usado antipsicóticos. Isso mostra que dificuldades cognitivas podem existir antes desse tratamento. [5]',
          'Limites do exemplo B: o estudo inclui primeiro episódio psicótico, categoria mais ampla que esquizofrenia. Ele não determina a causa da dificuldade de uma pessoa nem o efeito de um medicamento específico. [5]',
        ],
      },
      { kind: 'quiz', questionId: 'q10' },
      { kind: 'quiz', questionId: 'q13' },
      {
        kind: 'explain',
        prompt: 'Explique sem olhar: a professora pergunta se as dificuldades vêm só dos antipsicóticos. Como você responde?',
        model:
          'Não dá para dizer que vêm só da medicação. Uma meta-análise de 2024 encontrou diferenças cognitivas em pessoas no primeiro episódio psicótico que ainda não tinham usado antipsicóticos, então elas podem existir antes do tratamento. Mas o estudo avaliou primeiro episódio psicótico, que é mais amplo que esquizofrenia, e não mede o efeito de cada medicamento em cada pessoa.',
        criteria: [
          'Citei a evidência de diferenças antes do uso de antipsicóticos.',
          'Disse o limite: primeiro episódio psicótico não é sinônimo de esquizofrenia, e o estudo não mede cada medicamento.',
        ],
      },
    ],
  },
];

export const getLesson = (id: string) => lessons.find((l) => l.id === id);
