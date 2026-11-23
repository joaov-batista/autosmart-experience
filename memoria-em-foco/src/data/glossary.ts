import type { GlossaryEntry } from './types';
import { normalize } from '../utils';

/** Definições curtas, fiéis ao texto de estudo. `pid` aponta o parágrafo onde o termo é apresentado. */
export const glossary: GlossaryEntry[] = [
  { key: 'codificacao', term: 'Codificação', pid: 'm1', aliases: ['codificar'], definition: 'Registrar uma experiência: o processamento que forma a representação da informação. Depende da atenção e da organização.' },
  { key: 'armazenamento', term: 'Armazenamento', pid: 'm1', aliases: ['armazenar'], definition: 'Conservar a informação ao longo do tempo.' },
  { key: 'recuperacao', term: 'Recuperação', pid: 'm1', aliases: ['recuperar'], definition: 'Conseguir acessar depois o que foi aprendido.' },
  { key: 'memoria-de-trabalho', term: 'Memória de trabalho', pid: 'm2', definition: 'Mantém uma informação disponível enquanto a usamos, como segurar “Ana” até a frase terminar.' },
  { key: 'sinapse', term: 'Sinapse', pid: 'm2a', aliases: ['sinapses'], definition: 'Ponto de contato onde um neurônio se comunica com outra célula.' },
  { key: 'espinhas', term: 'Espinhas dendríticas', pid: 'm2b', aliases: ['espinhas dendríticas', 'espinha dendrítica'], definition: 'Pequenas projeções dos neurônios que recebem muitos dos sinais de outras células.' },
  { key: 'cortex-pre-frontal', term: 'Córtex pré-frontal', pid: 'm4', definition: 'Região na parte da frente do cérebro que ajuda a manter e organizar informações, inclusive durante a aprendizagem.' },
  { key: 'memoria-episodica', term: 'Memória episódica', pid: 'm3', definition: 'Permite lembrar um acontecimento ligando seus elementos: quem, o quê, onde e quando.' },
  { key: 'hipocampo', term: 'Hipocampo', pid: 'm4', definition: 'Estrutura que participa de associar os elementos de um episódio e de recuperar seu contexto.' },
  { key: 'rmf', term: 'Ressonância magnética funcional', pid: 'm3b', aliases: ['ressonância funcional'], definition: 'Exame que compara respostas cerebrais relacionadas à atividade durante uma tarefa. Não conta sinapses.' },
  { key: 'recordacao-livre', term: 'Recordação livre', pid: 'm3e', definition: 'Produzir a informação sem ajuda: “conte o que aconteceu”.' },
  { key: 'recordacao-com-pista', term: 'Recordação com pista', pid: 'm3e', aliases: ['pista'], definition: 'Recordar a partir de uma dica que orienta a busca: “havia uma sacola; quem a trouxe?”.' },
  { key: 'reconhecimento', term: 'Reconhecimento', pid: 'm3e', definition: 'Decidir se algo apresentado já foi visto: “você viu esta sacola?”.' },
  { key: 'familiaridade', term: 'Familiaridade', pid: 'm3e', definition: 'Sensação de já ter encontrado algo, sem necessariamente lembrar o contexto.' },
  { key: 'meta', term: 'Meta-análise', pid: 'm3f', definition: 'Método que combina estatisticamente os resultados de vários estudos sobre a mesma questão.' },
  { key: 'poda', term: 'Poda sináptica', pid: 'm4a', definition: 'Eliminação de parte das conexões formadas, que acontece durante o desenvolvimento do cérebro.' },
  { key: 'microglia', term: 'Micróglia', pid: 'm4a', aliases: ['micróglias'], definition: 'Células do sistema nervoso que participam da remoção de material de algumas sinapses.' },
  { key: 'complemento', term: 'Sistema complemento', pid: 'm4a', aliases: ['complemento'], definition: 'Sistema de marcação molecular que pode indicar quais estruturas serão removidas.' },
  { key: 'alucinacao', term: 'Alucinação', pid: 'm5', definition: 'Percepção sem estímulo externo correspondente, como ouvir uma voz que ninguém mais ouve.' },
  { key: 'pep', term: 'Primeiro episódio psicótico', pid: 'm5', definition: 'Primeira ocorrência de sintomas psicóticos. Categoria mais ampla do que esquizofrenia.' },
  { key: 'esquizofrenia', term: 'Esquizofrenia', pid: 'm5a', definition: 'Transtorno mental que pode envolver sintomas psicóticos (como delírios e alucinações), sintomas negativos e dificuldades cognitivas.' },
  { key: 'memoria-fonte', term: 'Memória da fonte', pid: 'm5-d1', definition: 'Lembrar de onde veio uma informação: eu vi, ouvi alguém contar ou imaginei?' },
  { key: 'dopamina', term: 'Dopamina', pid: 'm5-d2', definition: 'Neurotransmissor investigado como possível participante de alterações cognitivas na esquizofrenia.' },
  { key: 'glutamato', term: 'Glutamato', pid: 'm5-d2', definition: 'Principal neurotransmissor excitatório; também investigado nas alterações cognitivas.' },
  { key: 'nmda', term: 'Receptor NMDA', pid: 'm5-d2', aliases: ['receptores NMDA', 'NMDA'], definition: 'Tipo de receptor de glutamato investigado como possível participante das alterações cognitivas.' },
];

const index = new Map<string, GlossaryEntry>();
for (const g of glossary) {
  index.set(normalize(g.key), g);
  index.set(normalize(g.term), g);
  g.aliases?.forEach((a) => index.set(normalize(a), g));
}

/** Procura pelo key, pelo termo ou por um alias (sem acento, sem maiúsculas). */
export const findTerm = (s: string) => index.get(normalize(s));
