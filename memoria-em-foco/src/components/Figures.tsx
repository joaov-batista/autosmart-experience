import { useState, type ReactNode } from 'react';
import { RefButtons } from './References';

// Figuras esquemáticas da leitura. Desenho em SVG leve; os textos explicativos ficam em HTML
// (escalam com o tamanho da letra e são lidos por leitores de tela).

function Receptor({ x, kind, state }: { x: number; kind: 'ampa' | 'nmda'; state: 'closed' | 'open' | 'blocked' | 'unblocked' }) {
  const open = state === 'open' || state === 'unblocked';
  const gap = open ? 7 : 3;
  return (
    <g>
      <rect x={x - gap - 7} y={108} width={7} height={30} rx={3} className={kind === 'ampa' ? 'fig-ampa' : 'fig-nmda'} />
      <rect x={x + gap} y={108} width={7} height={30} rx={3} className={kind === 'ampa' ? 'fig-ampa' : 'fig-nmda'} />
      {state === 'blocked' && (
        <>
          <circle cx={x} cy={122} r={6} className="fig-mg" />
          <text x={x + 14} y={126} className="fig-tiny">Mg²⁺</text>
        </>
      )}
      {state === 'unblocked' && (
        <>
          <circle cx={x + 48} cy={150} r={6} className="fig-mg" />
          <text x={x + 57} y={154} className="fig-tiny">Mg²⁺</text>
        </>
      )}
      <text x={x} y={168} textAnchor="middle" className="fig-label">
        {kind === 'ampa' ? 'AMPA' : 'NMDA'}
      </text>
    </g>
  );
}

function Glu({ x, y }: { x: number; y: number }) {
  return <polygon points={`${x},${y - 4} ${x + 4},${y + 3} ${x - 4},${y + 3}`} className="fig-glu" />;
}

function Arrow({ x, y1, y2, label, cls }: { x: number; y1: number; y2: number; label: string; cls: string }) {
  return (
    <g className={cls}>
      <line x1={x} y1={y1} x2={x} y2={y2 - 6} strokeWidth={2.5} stroke="currentColor" />
      <polygon points={`${x - 5},${y2 - 7} ${x + 5},${y2 - 7} ${x},${y2}`} fill="currentColor" />
      <text x={x + 7} y={y2 - 2} className="fig-tiny" fill="currentColor">
        {label}
      </text>
    </g>
  );
}

function SynapseBase({ children, glu = true }: { children: ReactNode; glu?: boolean }) {
  return (
    <svg viewBox="0 0 300 200" className="fig-svg" aria-hidden="true" focusable="false">
      <rect x={50} y={8} width={200} height={66} rx={30} className="fig-pre" />
      <text x={150} y={26} textAnchor="middle" className="fig-label">terminação pré-sináptica</text>
      <circle cx={110} cy={52} r={9} className="fig-ves" />
      <circle cx={150} cy={56} r={9} className="fig-ves" />
      <circle cx={190} cy={52} r={9} className="fig-ves" />
      <text x={286} y={95} textAnchor="end" className="fig-tiny fig-muted">fenda</text>
      {glu && (
        <>
          <Glu x={95} y={88} />
          <Glu x={118} y={96} />
          <Glu x={150} y={86} />
          <Glu x={182} y={95} />
          <Glu x={205} y={88} />
          <text x={14} y={92} className="fig-tiny">glutamato</text>
        </>
      )}
      <rect x={10} y={112} width={280} height={84} rx={14} className="fig-post" />
      <text x={150} y={190} textAnchor="middle" className="fig-label">membrana pós-sináptica</text>
      {children}
    </svg>
  );
}

/**
 * Figura interativa: o mesmo estímulo antes e depois do fortalecimento.
 * Muda só o lado que recebe (receptores AMPA); a entrada é idêntica nas duas condições.
 */
export function SynapseCompare() {
  const [after, setAfter] = useState(false);
  const ampas = after ? [60, 110, 160] : [110];
  return (
    <figure className="figure" aria-labelledby="figc-cap">
      <p className="fig-kicker">Figura 1 · interativa</p>
      <div className="seg" role="radiogroup" aria-label="Comparar a sinapse">
        <button role="radio" aria-checked={!after} className={`seg-btn ${!after ? 'on' : ''}`} onClick={() => setAfter(false)}>
          Antes do fortalecimento
        </button>
        <button role="radio" aria-checked={after} className={`seg-btn ${after ? 'on' : ''}`} onClick={() => setAfter(true)}>
          Depois
        </button>
      </div>
      <SynapseBase>
        {ampas.map((x) => (
          <Receptor key={x} x={x} kind="ampa" state="open" />
        ))}
        <Receptor x={230} kind="nmda" state="blocked" />
        <text x={150} y={154} textAnchor="middle" className="fig-tiny fig-strong">
          {after ? '3 receptores AMPA prontos' : '1 receptor AMPA pronto'}
        </text>
      </SynapseBase>
      <div className="fig-bars" aria-hidden="true">
        <span className="bar-row">
          <span className="bar-label">estímulo</span>
          <span className="bar input" style={{ width: '40%' }} />
        </span>
        <span className="bar-row">
          <span className="bar-label">resposta</span>
          <span className={`bar ${after ? 'strong' : ''}`} style={{ width: after ? '78%' : '32%' }} />
        </span>
      </div>
      <p className="fig-live" aria-live="polite">
        {after ? (
          <>
            <strong>Depois:</strong> o estímulo é <strong>o mesmo</strong> (mesma quantidade de glutamato). O que mudou foi a
            célula que recebe: há mais receptores AMPA disponíveis, então a resposta é maior.
          </>
        ) : (
          <>
            <strong>Antes:</strong> o glutamato liberado encontra poucos receptores AMPA prontos, e a célula que recebe responde
            pouco.
          </>
        )}
      </p>
      <figcaption id="figc-cap">
        <strong>Mesma entrada, resposta diferente.</strong> É isso que “fortalecer a sinapse” quer dizer na potenciação de
        longa duração. Esquema simplificado, fora de escala; os números de receptores são ilustrativos. <RefButtons refs={[2]} />
      </figcaption>
    </figure>
  );
}

export function SynapseFigure() {
  return (
    <figure className="figure" aria-labelledby="fig1-cap">
      <p className="fig-kicker">Figura 2 · o mecanismo em três etapas</p>
      <ol className="fig-steps">
        <li>
          <SynapseBase>
            <Receptor x={100} kind="ampa" state="open" />
            <Receptor x={200} kind="nmda" state="blocked" />
            <Arrow x={100} y1={96} y2={146} label="+" cls="fig-flow" />
          </SynapseBase>
          <p>
            <strong>1. Transmissão inicial.</strong> O glutamato liberado atravessa a fenda e se liga aos receptores. O
            receptor AMPA se abre e contribui para a despolarização. Perto do repouso, o magnésio bloqueia o canal NMDA.
          </p>
        </li>
        <li>
          <SynapseBase>
            <Receptor x={100} kind="ampa" state="open" />
            <Receptor x={200} kind="nmda" state="unblocked" />
            <Arrow x={200} y1={92} y2={148} label="Ca²⁺" cls="fig-ca" />
            <text x={132} y={154} textAnchor="middle" className="fig-tiny fig-strong">despolarização suficiente</text>
          </SynapseBase>
          <p>
            <strong>2. Condições para abrir o canal NMDA.</strong> Com glutamato ligado <em>e</em> despolarização
            suficiente, o bloqueio por magnésio pode ser aliviado. O canal permite a entrada de cálcio, que funciona como
            sinal dentro da célula.
          </p>
        </li>
        <li>
          <SynapseBase>
            <Receptor x={60} kind="ampa" state="closed" />
            <Receptor x={110} kind="ampa" state="closed" />
            <Receptor x={160} kind="ampa" state="closed" />
            <Receptor x={230} kind="nmda" state="blocked" />
            <text x={110} y={154} textAnchor="middle" className="fig-tiny fig-strong">mais receptores AMPA</text>
          </SynapseBase>
          <div className="fig-bars" aria-hidden="true">
            <span className="muted small">resposta a um estímulo comparável:</span>
            <span className="bar-row">
              <span className="bar-label">antes</span>
              <span className="bar" style={{ width: '35%' }} />
            </span>
            <span className="bar-row">
              <span className="bar-label">depois</span>
              <span className="bar strong" style={{ width: '70%' }} />
            </span>
          </div>
          <p>
            <strong>3. Mudança na resposta.</strong> Processos ativados pelo cálcio podem aumentar o número ou a eficácia de
            receptores AMPA naquela sinapse. Mais tarde, um estímulo comparável produz uma resposta pós-sináptica maior.
          </p>
        </li>
      </ol>
      <figcaption id="fig1-cap">
        <strong>Uma sinapse química excitatória do hipocampo, em três etapas.</strong> A figura representa uma forma
        estudada de plasticidade (a potenciação de longa duração). Existem outras formas, e uma lembrança inteira envolve
        muitos circuitos. Esquema simplificado, fora de escala. <RefButtons refs={[2]} />
      </figcaption>
    </figure>
  );
}

function Node({ x, y, label, dim }: { x: number; y: number; label: string; dim?: boolean }) {
  return (
    <g className={dim ? 'fig-dim' : ''}>
      <rect x={x - 46} y={y - 16} width={92} height={32} rx={16} className="fig-node" />
      <text x={x} y={y + 5} textAnchor="middle" className="fig-label">
        {label}
      </text>
    </g>
  );
}

export function EpisodicFigure() {
  const pos = { a: [60, 40], b: [170, 40], c: [280, 40] } as const;
  const tri = { a: [80, 110], b: [260, 110], c: [170, 30] } as const;
  return (
    <figure className="figure" aria-labelledby="fig2-cap">
      <p className="fig-kicker">Figura 3</p>
      <ol className="fig-steps">
        <li>
          <svg viewBox="0 0 340 80" className="fig-svg" aria-hidden="true" focusable="false">
            <Node x={pos.a[0]} y={pos.a[1]} label="objeto: chave" />
            <Node x={pos.b[0]} y={pos.b[1]} label="lugar: cozinha" />
            <Node x={pos.c[0]} y={pos.c[1]} label="pessoa: irmã" />
          </svg>
          <p>
            <strong>1. Elementos da experiência.</strong> A identidade de um objeto, o lugar e a pessoa presente são
            informações distintas, processadas por diferentes populações de neurônios.
          </p>
        </li>
        <li>
          <svg viewBox="0 0 340 140" className="fig-svg" aria-hidden="true" focusable="false">
            <line x1={tri.a[0]} y1={tri.a[1]} x2={tri.b[0]} y2={tri.b[1]} className="fig-link" />
            <line x1={tri.a[0]} y1={tri.a[1]} x2={tri.c[0]} y2={tri.c[1]} className="fig-link" />
            <line x1={tri.b[0]} y1={tri.b[1]} x2={tri.c[0]} y2={tri.c[1]} className="fig-link" />
            <Node x={tri.a[0]} y={tri.a[1]} label="chave" />
            <Node x={tri.b[0]} y={tri.b[1]} label="cozinha" />
            <Node x={tri.c[0]} y={tri.c[1]} label="irmã" />
          </svg>
          <p>
            <strong>2. Formação de relações (codificação).</strong> Para lembrar o episódio, é preciso representar como os
            elementos se ligavam: a chave estava na cozinha, quando a irmã estava lá.
          </p>
          <ul className="fig-roles">
            <li>
              <span className="role hip">Hipocampo</span> participa da representação das relações entre os elementos e do
              contexto.
            </li>
            <li>
              <span className="role pfc">Córtex pré-frontal</span> contribui para selecionar o que é relevante e organizar a
              informação durante a aprendizagem.
            </li>
          </ul>
        </li>
        <li>
          <svg viewBox="0 0 340 140" className="fig-svg" aria-hidden="true" focusable="false">
            <line x1={tri.a[0]} y1={tri.a[1]} x2={tri.b[0]} y2={tri.b[1]} className="fig-link dashed" />
            <line x1={tri.a[0]} y1={tri.a[1]} x2={tri.c[0]} y2={tri.c[1]} className="fig-link dashed" />
            <line x1={tri.b[0]} y1={tri.b[1]} x2={tri.c[0]} y2={tri.c[1]} className="fig-link dashed" />
            <Node x={tri.a[0]} y={tri.a[1]} label="chave (pista)" />
            <Node x={tri.b[0]} y={tri.b[1]} label="cozinha?" dim />
            <Node x={tri.c[0]} y={tri.c[1]} label="irmã?" dim />
          </svg>
          <p>
            <strong>3. Recuperação posterior.</strong> Dias depois, ver a chave pode trazer familiaridade com o objeto. Lembrar
            o episódio exige recuperar também as relações — onde e com quem.
          </p>
          <ul className="fig-roles">
            <li>
              <span className="role pfc">Córtex pré-frontal</span> ajuda a orientar a busca.
            </li>
            <li>
              <span className="role hip">Hipocampo</span> contribui para recuperar as relações do episódio.
            </li>
          </ul>
        </li>
      </ol>
      <figcaption id="fig2-cap">
        <strong>Esquema da memória episódica: elementos, relações e recuperação.</strong> As contribuições indicadas são
        parciais: hipocampo e córtex pré-frontal trabalham em interação com outras regiões, e nenhuma estrutura executa
        sozinha a memória. Exemplo ilustrativo. <RefButtons refs={[1, 3, 5, 6]} />
      </figcaption>
    </figure>
  );
}
