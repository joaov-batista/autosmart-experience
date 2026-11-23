import { useState } from 'react';
import { RefButtons } from './References';

// Figuras da leitura. Desenho em SVG leve; textos explicativos em HTML (escalam com a letra e
// são lidos por leitores de tela). Todas usam a mesma cena: “Ana colocou a batata na sacola azul”.

function Node({ x, y, label, dim }: { x: number; y: number; label: string; dim?: boolean }) {
  return (
    <g className={dim ? 'fig-dim' : ''}>
      <rect x={x - 50} y={y - 16} width={100} height={32} rx={16} className="fig-node" />
      <text x={x} y={y + 5} textAnchor="middle" className="fig-label">
        {label}
      </text>
    </g>
  );
}

export function EpisodicFigure() {
  const tri = { a: [80, 110], b: [260, 110], c: [170, 30] } as const;
  return (
    <figure className="figure" aria-labelledby="fig-ep-cap">
      <p className="fig-kicker">Figura · elementos, relação e recuperação</p>
      <ol className="fig-steps">
        <li>
          <svg viewBox="0 0 340 80" className="fig-svg" aria-hidden="true" focusable="false">
            <Node x={60} y={40} label="pessoa: Ana" />
            <Node x={170} y={40} label="objeto: batata" />
            <Node x={280} y={40} label="sacola azul" />
          </svg>
          <p>
            <strong>1. Elementos.</strong> Saber quem é Ana, o que é uma batata e reconhecer uma sacola azul são informações
            separadas.
          </p>
        </li>
        <li>
          <svg viewBox="0 0 340 140" className="fig-svg" aria-hidden="true" focusable="false">
            <line x1={tri.a[0]} y1={tri.a[1]} x2={tri.b[0]} y2={tri.b[1]} className="fig-link" />
            <line x1={tri.a[0]} y1={tri.a[1]} x2={tri.c[0]} y2={tri.c[1]} className="fig-link" />
            <line x1={tri.b[0]} y1={tri.b[1]} x2={tri.c[0]} y2={tri.c[1]} className="fig-link" />
            <Node x={tri.a[0]} y={tri.a[1]} label="batata" />
            <Node x={tri.b[0]} y={tri.b[1]} label="sacola azul" />
            <Node x={tri.c[0]} y={tri.c[1]} label="Ana" />
          </svg>
          <p>
            <strong>2. Relação (aprendizagem).</strong> Lembrar o episódio exige uma terceira coisa: ter ligado os elementos —
            foi Ana quem colocou a batata naquela sacola.
          </p>
          <ul className="fig-roles">
            <li>
              <span className="role pfc">Córtex pré-frontal</span> participa da organização da informação durante a
              aprendizagem.
            </li>
            <li>
              <span className="role hip">Hipocampo</span> participa de associar os elementos.
            </li>
          </ul>
        </li>
        <li>
          <svg viewBox="0 0 340 140" className="fig-svg" aria-hidden="true" focusable="false">
            <line x1={tri.a[0]} y1={tri.a[1]} x2={tri.b[0]} y2={tri.b[1]} className="fig-link dashed" />
            <line x1={tri.a[0]} y1={tri.a[1]} x2={tri.c[0]} y2={tri.c[1]} className="fig-link dashed" />
            <line x1={tri.b[0]} y1={tri.b[1]} x2={tri.c[0]} y2={tri.c[1]} className="fig-link dashed" />
            <Node x={tri.a[0]} y={tri.a[1]} label="batata?" dim />
            <Node x={tri.b[0]} y={tri.b[1]} label="sacola (familiar)" />
            <Node x={tri.c[0]} y={tri.c[1]} label="quem? Ana?" dim />
          </svg>
          <p>
            <strong>3. Recuperação.</strong> No dia seguinte, a sacola pode parecer familiar. Responder “quem colocou a batata
            nela?” exige recuperar a relação — e é aí que a dificuldade costuma ser maior na esquizofrenia, em média.
          </p>
          <ul className="fig-roles">
            <li>
              <span className="role hip">Hipocampo</span> participa de recuperar o contexto.
            </li>
          </ul>
        </li>
      </ol>
      <figcaption id="fig-ep-cap">
        <strong>Esquema simplificado.</strong> As regiões indicadas trabalham em interação com outras; nenhuma faz a memória
        sozinha. <RefButtons refs={[4]} />
      </figcaption>
    </figure>
  );
}

/**
 * Figura interativa do raciocínio de Gold: comparar só o resultado final × considerar quanto cada
 * pessoa aprendeu no início. Números ilustrativos (6 e 3 detalhes, como no texto), não do estudo.
 */
export function GoldFigure() {
  const [adjusted, setAdjusted] = useState(false);
  const people = [
    { name: 'Pessoa 1', day1: 6, day2: 4 },
    { name: 'Pessoa 2', day1: 3, day2: 2 },
  ];
  const max = 6;
  return (
    <figure className="figure" aria-labelledby="fig-gold-cap">
      <p className="fig-kicker">Figura interativa · quanto foi aprendido × quanto foi retido</p>
      <div className="seg" role="radiogroup" aria-label="Como comparar">
        <button role="radio" aria-checked={!adjusted} className={`seg-btn ${!adjusted ? 'on' : ''}`} onClick={() => setAdjusted(false)}>
          Só o resultado de amanhã
        </button>
        <button role="radio" aria-checked={adjusted} className={`seg-btn ${adjusted ? 'on' : ''}`} onClick={() => setAdjusted(true)}>
          Considerando o início
        </button>
      </div>
      <div className="gold-rows">
        {people.map((p) => (
          <div key={p.name} className="gold-row">
            <span className="gold-name">{p.name}</span>
            <div className="gold-bars">
              {adjusted && (
                <span className="bar-row">
                  <span className="bar-label">hoje</span>
                  <span className="bar input" style={{ width: `${(p.day1 / max) * 65}%` }} />
                  <span className="gold-n">{p.day1}</span>
                </span>
              )}
              <span className="bar-row">
                <span className="bar-label">amanhã</span>
                <span className="bar strong" style={{ width: `${(p.day2 / max) * 65}%` }} />
                <span className="gold-n">{p.day2}</span>
              </span>
              {adjusted && <span className="gold-keep">guardou {Math.round((p.day2 / p.day1) * 100)}% do que aprendeu</span>}
            </div>
          </div>
        ))}
      </div>
      <p className="fig-live" aria-live="polite">
        {adjusted ? (
          <>
            As duas guardaram a <strong>mesma proporção</strong> do que tinham aprendido. A diferença de amanhã veio de quanto
            cada uma aprendeu no início, não de esquecer mais depressa.
          </>
        ) : (
          <>
            Olhando só para amanhã, a Pessoa 2 lembra menos (2 × 4 detalhes). Parece que ela esqueceu mais depressa — mas
            ainda falta saber quanto cada uma aprendeu.
          </>
        )}
      </p>
      <figcaption id="fig-gold-cap">
        <strong>Números ilustrativos</strong>, escolhidos para mostrar o raciocínio; não são dados do estudo. Gold e
        colaboradores fizeram essa comparação com pessoas que tinham a mesma lembrança inicial. <RefButtons refs={[6]} />
      </figcaption>
    </figure>
  );
}
