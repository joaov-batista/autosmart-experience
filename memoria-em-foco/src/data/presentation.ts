import type { RefId } from './types';

/** Fala pronta (versão principal). As referências ficam ocultas durante a leitura em voz alta. */
export const speech: { text: string; refs: RefId[] }[] = [
  {
    text: 'Boa tarde. O tema da minha apresentação é a memória em pessoas com esquizofrenia. Para entender o que pode mudar, primeiro precisamos entender o que acontece quando qualquer pessoa aprende e depois tenta lembrar de alguma coisa.',
    refs: [],
  },
  {
    text: 'A memória envolve três processos: codificar, armazenar e recuperar. Codificar é registrar uma experiência. Nessa etapa, prestar atenção e estabelecer relações ajuda a formar a lembrança. Armazenar é conservar a informação ao longo do tempo. Recuperar é conseguir acessá-la depois. Essa distinção importa porque, quando alguém diz ‘eu esqueci’, a gente observa o resultado, mas ainda não sabe em qual desses processos surgiu a dificuldade.',
    refs: [1],
  },
  {
    text: 'E como uma experiência que já terminou consegue deixar uma marca no cérebro? Parte da resposta está nas sinapses, que são pontos de comunicação entre neurônios. Em algumas sinapses, quando os neurônios são ativados juntos em determinadas condições, a conexão pode se fortalecer. Isso significa que, depois, um sinal semelhante consegue produzir uma resposta maior na célula que o recebe. Esse fenômeno é chamado de potenciação de longa duração. Ele ajuda a explicar como uma experiência breve pode produzir uma mudança que persiste. Uma lembrança inteira envolve muitas dessas células e conexões trabalhando em conjunto.',
    refs: [2, 3],
  },
  {
    text: 'Quando pensamos na esquizofrenia, duas funções merecem atenção. A primeira é a memória de trabalho, que mantém uma informação disponível enquanto fazemos algo com ela. Para acompanhar uma orientação com várias etapas, por exemplo, eu preciso manter o começo da frase na mente enquanto escuto o final. Pessoas com esquizofrenia podem ter mais dificuldade nessa tarefa. Circuitos do córtex pré-frontal, uma região que participa da organização e do controle da informação, estão entre os estudados para entender essa dificuldade.',
    refs: [4, 6],
  },
  {
    text: 'A segunda função é a memória episódica, que nos permite lembrar de um acontecimento junto com seu contexto. Pensem na diferença entre dizer ‘esse rosto é familiar’ e dizer ‘eu vi essa pessoa na biblioteca ontem’. Na segunda frase, eu consegui ligar o rosto a um lugar e a um momento. O hipocampo participa da formação dessas relações.',
    refs: [1, 3, 5],
  },
  {
    text: 'Um estudo de Ragland e colaboradores ajuda a entender por que essa distinção importa. Os pesquisadores compararam a aprendizagem de itens separados com a aprendizagem das relações entre eles. No grupo com esquizofrenia, a dificuldade foi especialmente evidente quando era preciso aprender como os itens se relacionavam. Então, dizer que a lembrança ficou ‘quebrada no armazenamento’ seria uma conclusão precipitada. A relação entre os detalhes pode ter sido registrada com menos precisão desde o início.',
    refs: [5],
  },
  {
    text: 'A maneira de pedir que a pessoa lembre também faz diferença. Aleman e colaboradores reuniram 70 estudos e observaram que a diferença média entre os grupos era maior quando os participantes precisavam recordar o conteúdo por conta própria. Quando recebiam opções para reconhecer o que tinham visto, a diferença era menor, embora continuasse presente. Isso ajuda a entender por que oferecer uma pista pode ser útil em algumas situações. A necessidade de ajuda varia de pessoa para pessoa.',
    refs: [7],
  },
  {
    text: 'Então, qual é a principal diferença? Em média, pessoas com esquizofrenia podem ter mais dificuldade para manter informações em uso e para aprender ou recuperar as relações que dão contexto a uma lembrança. Para entender a memória de uma pessoa específica, precisamos saber o que ela conseguiu registrar, o que a tarefa exigia e em que condições conseguiu lembrar. Obrigada.',
    refs: [4, 5, 6, 7],
  },
];

/** Cinco lembretes. Tocar revela só o(s) parágrafo(s) correspondente(s) da fala. */
export const reminders: { label: string; paragraphs: number[] }[] = [
  { label: 'Registrar, conservar e recuperar', paragraphs: [1] },
  { label: 'Como a sinapse muda', paragraphs: [2] },
  { label: 'Memória de trabalho', paragraphs: [3] },
  { label: 'Rosto e contexto', paragraphs: [4] },
  { label: 'O que os estudos encontraram', paragraphs: [5, 6] },
];

/** “Se a professora perguntar”: pergunta primeiro, resposta ao tocar. */
export const teacherQuestions: { question: string; answer: string; refs: RefId[]; pid: string }[] = [
  {
    question: 'Então o problema acontece no armazenamento?',
    answer:
      'Um esquecimento isolado não permite localizar a dificuldade. A relação entre os detalhes pode ter sido registrada com pouca precisão na codificação, ou pode estar difícil recuperá-la naquele momento. Para distinguir essas possibilidades, precisamos saber como a informação foi aprendida e como foi testada.',
    refs: [1, 5],
    pid: 's5-3a',
  },
  {
    question: 'Você disse que uma pista ajuda. Isso quer dizer que a pessoa sempre precisa ser guiada?',
    answer:
      'A necessidade varia. Também vale separar duas coisas: receber uma dica, como ‘era uma fruta’, é recordação com pista. Escolher entre ‘manga ou uva’ é reconhecimento. O resultado que citei compara especialmente recordar e reconhecer. Ele mostra que mudar a tarefa altera o desempenho médio.',
    refs: [1, 7],
    pid: 's5-4a',
  },
  {
    question: 'Essas dificuldades seriam causadas só pela medicação?',
    answer:
      'Há estudos que encontraram diferenças cognitivas em pessoas no primeiro episódio psicótico antes do uso de antipsicóticos. Isso indica que algumas dificuldades podem preceder o tratamento. Primeiro episódio psicótico é uma categoria mais ampla que esquizofrenia, então é importante respeitar a população estudada.',
    refs: [8],
    pid: 's6-3',
  },
];

export const PRESENTATION_WARN_SECONDS = 270; // 4min30s
export const PRESENTATION_LIMIT_SECONDS = 300; // 5min
