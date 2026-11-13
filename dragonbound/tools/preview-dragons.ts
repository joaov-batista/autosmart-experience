import { createWild, expressPhenotype, GeneticRegistry } from '../src/dragons/genetics/genome';
import { SPECIES_IDS } from '../src/dragons/genetics/species';
import { drawDragon, dragonPose, paintDragonSheet, paintDragonTop } from '../src/dragons/rendering/DragonPainter';
import { DRAGON_FH, DRAGON_FW } from '../src/dragons/rendering/dragonAnims';
import { Pix } from '../src/art/Pix';
import { savePreview } from './png';

const dir = process.env.PREVIEW_DIR!;
const reg = new GeneticRegistry();
const grid = new Pix(DRAGON_FW * 6, DRAGON_FH * 4);
SPECIES_IDS.forEach((sp, c) => { for (let r = 0; r < 4; r++) { const g = createWild(sp, 31 + r * 17 + c, reg); drawDragon(grid, c * DRAGON_FW, r * DRAGON_FH, expressPhenotype(g), r === 3 ? 0.55 : 1, dragonPose(r === 1 ? 'fly' : r === 2 ? 'alert' : 'idle', r === 1 ? c % 6 : 1)); } });
savePreview(dir + '/dragons.png', grid, 2, 0x6fa8c0);
const t0 = performance.now();
const sheet = paintDragonSheet(expressPhenotype(createWild('cinzal', 5, reg)), 1);
console.log('sheet ms', Math.round(performance.now() - t0), sheet.pix.w, sheet.pix.h);
savePreview(dir + '/dragon_sheet.png', sheet.pix, 1, 0x6fa8c0);
savePreview(dir + '/dragon_top.png', paintDragonTop(expressPhenotype(createWild('trovisco', 9, reg)), 1, true), 3, 0x2f7fa8);
