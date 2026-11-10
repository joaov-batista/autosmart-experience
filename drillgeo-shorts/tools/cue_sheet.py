"""Write docs/AUDIO_CUE_SHEET.md from build/timeline.json."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tl = json.load(open(os.path.join(ROOT, 'build/timeline.json')))
D = {
 'amb_nature': 'vento filtrado (2 canais descorrelacionados), pássaros FM, insetos', 'amb_site': 'vento leve de praça de sondagem, pássaros esparsos',
 'whoosh_down': 'deslocamento de ar descendente + subgrave', 'whip_up': 'whip-pan ascendente (ruído rosa em varredura de banda)',
 'dive_whoosh': 'mergulho pelas hastes', 'rise_whoosh': 'subida (tubo interno / câmera)', 'pull_back_whoosh': 'recuo de câmera',
 'push_in_whoosh': 'avanço de câmera para o barrilete', 'return_whoosh': 'amostras voltando ao subsolo', 'impact_sub': 'impacto de abertura do corte (queda de pitch 70→26 Hz + estalo)',
 'impact_arrive': 'chegada na sonda', 'earth_rumble': 'terra se deslocando (ruído marrom + crepitar)', 'scan_shimmer': 'brilho cristalino da varredura de luz',
 'interest_chime': 'sino FM da zona de interesse', 'engine': 'diesel: marcha lenta → aceleração (harmônicos da combustão + ruído pulsado)',
 'lever_clunk': 'alavanca do console', 'hydraulic_hiss': 'alívio hidráulico', 'rotation_start': 'cabeçote começando a girar (rampa)', 'rotation_loop': 'rotação contínua (whine hidráulico + corpo + tique)',
 'cutting': 'coroa cortando rocha: atrito em banda + micro-estalos + vibração 38 Hz', 'arrive_thud': 'chegada ao fundo do furo', 'reveal_soft': 'revelação suave (inset da face)',
 'diamond_glint': 'brilho dos diamantes', 'xray_sweep': 'transição para raio-X', 'fluid_flow': 'circulação do fluido: ruído em banda com gorgolejo + bolhas',
 'pump': 'bomba (pistão)', 'core_slide': 'testemunho deslizando no tubo interno', 'motor_down': 'desaceleração da rotação', 'winch_run': 'guincho wireline (cabo de aço)',
 'latch_click': 'engate do pescador / travas', 'metal_clank': 'peças metálicas (síntese modal inarmônica)', 'core_break': 'mola extratora parte o testemunho',
 'winch_stop': 'freio do guincho', 'under_drone': 'drone subterrâneo', 'drill_distant': 'perfuração abafada (distância)', 'layer_tick': 'troca de camada (grave + sino, afinado por camada)',
 'core_slide_metal': 'pedra deslizando na calha metálica', 'box_open': 'tampa de madeira (rangido + batida)', 'core_place': 'peça de rocha na canaleta de madeira (variação por peça)',
 'block_place': 'taco de profundidade', 'marker_write': 'caneta na etiqueta', 'cloth_move': 'movimento do uniforme', 'lens_swish': 'lupa entrando', 'feature_bell': 'feição identificada (sino)',
 'links_arp': 'arpejo das ligações caixa ↔ camada', 'ui_tick': 'rótulo (clique discreto)', 'ui_pop': 'chip/lupa aparecendo', 'logo_spin': 'giro da hélice', 'logo_hit': 'assinatura sonora (impacto + sinos em ré maior)',
}
fmt = lambda t: f"{int(t // 60)}:{t % 60:05.2f}"
md = ['# Audio cue sheet', '',
 'Gerado por `tools/cue_sheet.py` a partir de `build/timeline.json` (os mesmos tempos que dirigem a animação).', '',
 '## Camadas', '',
 '| Camada | Fonte | Tratamento |', '|---|---|---|',
 '| Narração | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" | HP 85 Hz, −1,5 dB @180 Hz, +2,5 dB @3,2 kHz, compressão 3:1 suave |',
 '| Trilha | original, sintetizada (`audio/synth/music.py`), ré menor, 96 BPM | ducking −9 dB sob a voz |',
 '| Efeitos | sintetizados (`audio/synth/sfx.py`), um por cue, semente própria | ducking −4 dB sob a voz |',
 '| Master | soma → shelf −2,5 dB @8,5 kHz → soft clip → limitador −2 dBFS → loudnorm 2 passes | **−14 LUFS integrados, −1,5 dBTP**, estéreo 48 kHz |', '',
 '## Trilha por cena', '',
 '| Cena | Clima | Harmonia | Instrumentação |', '|---|---|---|---|',
 '| S01 | mistério, descoberta | Dm(add9) | pad escuro, sub D1, sinos esparsos; pad abre no impacto; riser para S02 |',
 '| S02 | tecnológico, industrial | Dm–Bb–F–C | baixo ostinato em colcheias, bumbo 1/3, hats, bigorna; palmas entram quando a rotação liga |',
 '| S03 | perfuração, intensidade crescente | Dm–Bb–Gm–A | 4/4, baixo em semicolcheias, toms de virada, caixa 2/4 |',
 '| S04 | fluxo | Dm–F–C–Gm | arpejo "líquido" em semicolcheias com delay ping-pong, groove leve |',
 '| S05 | preciso, curioso → tensão | Dm–F–Am–C → pedal | pizzicato Karplus-Strong; no wireline: tique de relógio, pulso grave, riser; impacto na superfície |',
 '| S06 | profundidade | Dm–Bb–F–C (oitava abaixo) | pulso de baixo, sinos descendentes por compasso |',
 '| S07 | cuidado, organização | F–C–Dm–Bb | marimba, shaker leve |',
 '| S08 | descoberta científica | F–Am–Bb–C | sinos em arpejo, pad quente |',
 '| S09 | inspirador, institucional | Bb–F–C–Dm–Bb–C–Fsus–A → **D** | crescendo de bateria e pad; acorde de ré maior na hélice, cauda longa |', '',
 '## Falas', '', '| Fala | Início | Duração | Texto |', '|---|---|---|---|']
for l in tl['lines']:
    md.append(f"| {l['id']} | {fmt(l['start'])} | {l['dur']:.2f} s | {l['text']} |")
md += ['', '## Cues sincronizados', '', '| Tempo | Cena | Cue | Som |', '|---|---|---|---|']
for c in tl['cues']:
    d = f" ({c['dur']:.2f} s)" if 'dur' in c else ''
    md.append(f"| {fmt(c['t'])} | {c['scene']} | `{c['type']}`{d} | {D.get(c['type'], '')} |")
open(os.path.join(ROOT, 'docs/AUDIO_CUE_SHEET.md'), 'w').write('\n'.join(md) + '\n')
print('cue sheet:', len(tl['cues']), 'cues')
