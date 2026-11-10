"""Generate every narration line through the ElevenLabs text-to-speech API and
check each one with ElevenLabs speech-to-text (language + word match).
The API key is injected by the environment's network proxy (never stored here).

  python3 tools/elevenlabs_api.py [voice_id] [model_id]
"""
import difflib, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio', 'narration', 'api')
VOICE = sys.argv[1] if len(sys.argv) > 1 else 'JBFqnCBsd6RMkjVDRZzb'  # George (premade)
MODEL = sys.argv[2] if len(sys.argv) > 2 else 'eleven_v4'
API = 'https://api.elevenlabs.io/v1'

LINES = {
    'N01': '[curious] Você já parou para pensar no que existe centenas de metros abaixo dos seus pés?',
    'N02': '[curious] Como podemos descobrir o que está escondido lá embaixo?',
    'N03': '[warmly] É aqui que entra a sondagem. Com equipamentos especializados, a DrillGeo investiga o subsolo e recupera informações essenciais sobre as rochas.',
    'N04': 'Na sondagem rotativa diamantada, a máquina transmite rotação e força de avanço através das hastes… permitindo que a coroa corte a rocha.',
    'N05': 'Durante a perfuração, um fluido circula pelo sistema. Ele ajuda a resfriar a coroa, remover os fragmentos de rocha e manter condições adequadas para o avanço.',
    'N06': '[curious] Mas o objetivo não é apenas abrir um furo. É recuperar uma amostra da rocha, chamada testemunho de sondagem. [pause] [warmly] Esse cilindro preserva informações valiosas sobre as características do material atravessado.',
    'N07': 'No sistema wireline, um cabo de aço traz o tubo interno com o testemunho até a superfície, sem retirar as hastes do furo.',
    'N08': 'Cada profundidade pode revelar uma formação diferente. Mudanças de cor, composição, textura e fraturamento ajudam a contar a história geológica daquele local.',
    'N09': 'Na superfície, os testemunhos são organizados em caixas, identificados por furo e profundidade, preservando a sequência das rochas recuperadas.',
    'N10': 'Com essas amostras, os geólogos estudam as formações, identificam estruturas e investigam possíveis mineralizações e outras características importantes do terreno.',
    'N11': 'Em projetos de mineração e de investigação geológica, entender o que existe abaixo da superfície é essencial para tomar decisões com mais conhecimento e precisão.',
    'N12': '[warmly] DrillGeo. Geologia e sondagem revelando o que a superfície não mostra.',
}


def norm(s):
    s = re.sub(r'\[[^\]]+\]', ' ', s).lower()
    return re.findall(r"[a-zà-ú0-9]+", s)


def curl(args):
    return subprocess.run(['curl', '-sS', '--max-time', '120'] + args, capture_output=True, text=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    only = sys.argv[3].split(',') if len(sys.argv) > 3 else list(LINES)
    report = {}
    for k in only:
        text = LINES[k]
        mp3 = os.path.join(OUT, f'{k}.mp3')
        body = json.dumps({'text': text, 'model_id': MODEL})
        r = curl(['-X', 'POST', '-H', 'Content-Type: application/json', '-o', mp3, '-w', '%{http_code}',
                  f'{API}/text-to-speech/{VOICE}?output_format=mp3_44100_128', '-d', body])
        if r.stdout.strip() != '200':
            print(k, 'TTS failed', r.stdout, open(mp3).read()[:300])
            sys.exit(1)
        s = curl(['-X', 'POST', '-F', 'model_id=scribe_v1', '-F', f'file=@{mp3}', f'{API}/speech-to-text'])
        d = json.loads(s.stdout)
        a, b = norm(text), norm(d.get('text', ''))
        match = difflib.SequenceMatcher(None, a, b).ratio()
        report[k] = {'lang': d.get('language_code'), 'p': round(d.get('language_probability', 0), 3), 'match': round(match, 3), 'heard': d.get('text')}
        flag = '' if match > 0.9 and d.get('language_code') == 'por' else '   <-- check'
        print(f"{k} lang={d.get('language_code')} p={report[k]['p']} match={match:.3f}{flag}")
    json.dump({'voice': VOICE, 'model': MODEL, 'lines': report}, open(os.path.join(OUT, 'qa.json'), 'w'), indent=1, ensure_ascii=False)


if __name__ == '__main__':
    main()
