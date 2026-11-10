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
    'N01': '[warmly] Oi! Eu sou o Geo, da equipe da DrillGeo. Você já pensou no que existe debaixo dos seus pés? Vem comigo, que eu te mostro!',
    'N02': '[curious] Lá embaixo tem camadas e mais camadas de rocha. Mas como a gente descobre o que tem lá… sem cavar um buraco gigante?',
    'B01': '[warmly] Pensa num bolo de camadas. Se você enfia um canudo e puxa… sai uma amostrinha com todas as camadas dentro. A sondagem faz isso, só que na rocha!',
    'N03': 'Essa é a sonda, a máquina que faz o furo. Ela gira uma coluna de tubos de aço, que a gente chama de hastes, e empurra tudo pra baixo.',
    'N04': 'Na ponta fica a coroa: um anel cheio de diamantes. Ela gira e corta a rocha em forma de anel… igual a um cortador de biscoito.',
    'N05': 'Enquanto ela corta, a gente manda água pelo meio dos tubos. A água esfria a coroa e leva o pó de rocha pra fora, igual à água na broca do dentista.',
    'N06': '[curious] E o miolo? [warmly] O miolo fica inteirinho! Esse cilindro de rocha é o testemunho. Ele vai entrando num tubo, igual ao bolo dentro do canudo.',
    'N07': 'Quando o tubo enche, a gente desce um cabo com uma peça que engata, o pescador, e puxa o tubo cheio lá do fundo. As hastes continuam no furo.',
    'N08': 'Conforme o furo desce, ele atravessa camadas diferentes: terra, rocha mais mole, rocha dura, rachaduras… e às vezes um veio com minerais.',
    'N09': 'Aqui em cima, as amostras vão pra uma caixa, na ordem certinha, com a profundidade anotada. É como um álbum de fotos do subsolo.',
    'N10': 'Depois, o geólogo estuda cada pedaço com lupa. Às vezes aparece sinal de minério, às vezes não… e as duas respostas são informação valiosa.',
    'N11': 'Resumindo: a coroa corta, o cilindro sobe, vai pra caixa, e o geólogo estuda. Assim dá pra decidir com mais segurança, antes de uma obra ou de uma mina.',
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
