import type { OralQuestion } from './types';

export const oralQuestions: OralQuestion[] = [
  {
    id: 'o1',
    question: 'Se alguém esqueceu, em qual etapa a memória falhou?',
    model:
      'Só com o “esqueci” não dá para saber. A pessoa pode ter codificado mal a informação, por exemplo por estar distraída, ou pode ter registrado e não conseguido recuperar no momento certo. Para escolher entre as hipóteses, eu precisaria saber como ela aprendeu e como tentou lembrar.',
    criteria: ['Apresentei pelo menos duas hipóteses.', 'Expliquei por que a observação isolada é insuficiente.'],
    refs: [1],
  },
  {
    id: 'o2',
    question: 'Qual a diferença entre memória de trabalho e memória de curto prazo?',
    model:
      'As duas envolvem manter informação por pouco tempo. A memória de trabalho acrescenta usar ou manipular essa informação durante uma tarefa, como segurar os valores e calcular o troco. A terminologia varia entre modelos teóricos, então vale dizer qual definição estou usando.',
    criteria: [
      'Expliquei a manutenção breve da informação.',
      'Mostrei que memória de trabalho também envolve usar ou manipular a informação (ex.: calcular o troco).',
    ],
    note: 'Vale admitir que a terminologia varia entre modelos.',
    refs: [1],
  },
  {
    id: 'o3',
    question: 'Por que perguntar “era manga ou uva?” é diferente de perguntar “qual era a fruta?”',
    model:
      '“Qual era a fruta?” é recordação com pista: a categoria ajuda, mas a pessoa precisa produzir a palavra sozinha. “Era manga ou uva?” é reconhecimento: as opções estão apresentadas e ela só precisa identificar qual viu. São apoios diferentes para a mesma lembrança.',
    criteria: [
      'Identifiquei reconhecimento e recordação com pista.',
      'Expliquei o que a pessoa precisa produzir em cada tarefa.',
    ],
    refs: [1, 4],
  },
  {
    id: 'o4',
    question: 'Como a memória de pessoas com esquizofrenia difere da de pessoas sem esquizofrenia?',
    model:
      'Comparando grupos, as pesquisas encontram desempenho médio inferior em várias tarefas de memória, como memória de trabalho e recordação de listas de palavras. Na meta-análise de Aleman, a diferença foi maior na recordação do que no reconhecimento. Mas há variação individual: o diagnóstico sozinho não diz como uma pessoa vai se sair.',
    criteria: ['Citei uma tarefa em que aparece diferença média.', 'Reconheci a variação individual.'],
    refs: [2, 3, 4],
  },
  {
    id: 'o5',
    question: 'Se ela reconheceu a resposta certa, então a memória dela está preservada?',
    model:
      'Reconhecer mostra que, naquela tarefa e com aquelas opções, ela identificou o que tinha visto. Não mostra que ela conseguiria recordar sozinha, nem que todas as funções de memória estão preservadas. E, nos estudos com grupos, o reconhecimento também mostrou diferença, só que menor.',
    criteria: ['Descrevi o que a tarefa demonstrou.', 'Limitei a conclusão àquela condição.'],
    refs: [1, 4],
  },
  {
    id: 'o6',
    question: 'Essas dificuldades surgem só por causa dos antipsicóticos?',
    model:
      'Não dá para afirmar isso. Uma meta-análise de 2024 encontrou diferenças cognitivas em pessoas no primeiro episódio psicótico que ainda não tinham usado antipsicóticos. Mas primeiro episódio psicótico é uma categoria mais ampla que esquizofrenia, e o estudo não mede o efeito de cada medicamento em cada pessoa.',
    criteria: [
      'Citei a evidência de diferenças anteriores ao tratamento.',
      'Distingui primeiro episódio psicótico de diagnóstico de esquizofrenia.',
    ],
    refs: [5],
  },
  {
    id: 'o7',
    question: 'As alucinações são o mesmo fenômeno que esquecer uma conversa?',
    model:
      'Não. Alucinação é uma alteração da percepção, como ouvir uma voz sem uma fonte externa correspondente. Esquecer uma conversa envolve dificuldade de aprendizagem ou de recuperação, como não lembrar no dia seguinte o que foi combinado. Os dois podem aparecer na esquizofrenia, mas são fenômenos diferentes.',
    criteria: [
      'Distingui alteração da percepção de dificuldade de aprendizagem ou recuperação.',
      'Dei um exemplo de cada.',
    ],
    refs: [2],
  },
  {
    id: 'o8',
    question: 'Uma lista de palavras reproduz o funcionamento da memória na vida real?',
    model:
      'Não completamente. A tarefa padronizada permite comparar o desempenho de pessoas em condições semelhantes, o que é útil em pesquisa. Mas uma conversa do dia a dia envolve contexto, atenção, emoção e outras demandas que a lista não reproduz.',
    criteria: [
      'Expliquei que a tarefa padronizada permite comparar em condições semelhantes.',
      'Reconheci que a vida cotidiana envolve contexto, atenção e outras demandas.',
    ],
    refs: [1, 2, 4],
  },
  {
    id: 'o9',
    question: 'Como adaptar uma orientação sem infantilizar a pessoa?',
    model:
      'Posso entregar a orientação também por escrito, o que reduz o quanto ela precisa manter na mente e permite consultar depois. Ou dividir a tarefa em passos. E pergunto à própria pessoa se a estratégia ajuda, em vez de decidir por ela.',
    criteria: [
      'Propus uma adaptação concreta.',
      'Expliquei que demanda ela reduz e incluí perguntar à pessoa se ajuda.',
    ],
    refs: [1, 2],
  },
  {
    id: 'o10',
    question: 'Qual fonte você citaria para sustentar sua principal afirmação?',
    model:
      'A meta-análise de Aleman e colaboradores, de 1999, que reuniu 70 estudos. Ela mostrou que, em média, a diferença entre pessoas com esquizofrenia e grupos de comparação foi maior na recordação e menor, mas ainda significativa, no reconhecimento.',
    criteria: [
      'Identifiquei Aleman et al., 1999, como meta-análise de 70 estudos.',
      'Descrevi corretamente o achado sobre recordação e reconhecimento.',
    ],
    refs: [4],
  },
  {
    id: 'o11',
    question: 'Qual é a diferença entre atenção e memória?',
    model:
      'A atenção seleciona ou prioriza a informação no momento. A memória envolve registrar, reter e recuperar essa informação. Elas se ligam: se eu estava distraída quando o aviso foi dado, posso ter codificado só parte dele, e depois não vou conseguir lembrar do que nem registrei.',
    criteria: [
      'Expliquei que a atenção seleciona e a memória registra, retém e recupera.',
      'Mostrei como pouca atenção no momento do aviso pode afetar a lembrança depois.',
    ],
    refs: [1, 2],
  },
  {
    id: 'o12',
    question: 'Se você tivesse mais tempo para investigar o caso de Marina, o que gostaria de saber?',
    model:
      'Eu perguntaria se ela conseguiu explicar as instruções logo depois de ouvi-las. Se conseguiu, a hipótese de dificuldade na recuperação posterior ganha força; se não, a dificuldade pode ter surgido no registro. Mesmo assim, isso ajusta a hipótese, não fecha diagnóstico.',
    criteria: [
      'Formulei uma pergunta observável (ex.: se recordava as instruções imediatamente).',
      'Expliquei como a resposta mudaria uma hipótese, sem fechar diagnóstico.',
    ],
    note: 'Marina é um exemplo didático fictício.',
    refs: [1, 3],
  },
];

/** Réplicas feitas depois da primeira resposta da sessão. */
export const followUps: { id: string; question: string; guidance: string }[] = [
  {
    id: 'r1',
    question: 'Você consegue dar outro exemplo?',
    guidance:
      'Um bom segundo exemplo usa uma situação diferente da primeira, mas mantém o mesmo conceito. Confira: o exemplo novo mostra a mesma ideia sem repetir a cena anterior?',
  },
  {
    id: 'r2',
    question: 'Qual parte dessa conclusão vale para grupos e qual vale para uma pessoa?',
    guidance:
      'Pesquisas comparam médias de grupos e descrevem tendências. Para uma pessoa específica, é preciso avaliar essa pessoa: observar quais tarefas são difíceis para ela e em quais condições ela consegue realizá-las.',
  },
];
