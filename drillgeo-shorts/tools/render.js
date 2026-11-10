#!/usr/bin/env node
/* DrillGeo Shorts renderer.
   node tools/render.js timeline                       → build/timeline.json + docs/TIMECODES.md
   node tools/render.js stills --t 1,2.5,9 --out x.png [--sheet 3 --scale 0.33 --safe]
   node tools/render.js video --from 0 --to 12.5 --out renders/x.mp4 [--workers 4 --audio a.wav --crf 17]
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const cmd = args[0];
const opt = {};
for (let i = 1; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const k = args[i].slice(2);
    const v = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
    opt[k] = v;
  }
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.woff2': 'font/woff2', '.otf': 'font/otf', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
function serve() {
  return new Promise((res) => {
    const srv = http.createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
        rsp.writeHead(404);
        return rsp.end();
      }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rsp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

async function openPage(browser, port, initOpts = {}) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', (m) => {
    if (m.type() === 'error' && !/narration_meta|favicon|404/.test(m.text())) console.error('[page]', m.text());
  });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  await page.goto(`http://127.0.0.1:${port}/src/render.html`);
  const t0 = Date.now();
  const info = await page.evaluate((o) => DG.init(o), initOpts);
  if (opt.verbose) console.log(`init ${(Date.now() - t0) / 1000}s`);
  return { page, info };
}

function launch() {
  return chromium.launch({ args: ['--disable-gpu', '--force-color-profile=srgb', '--font-render-hinting=none'] });
}

async function cmdTimeline() {
  const srv = await serve();
  const browser = await launch();
  const { page } = await openPage(browser, srv.address().port, { scenes: [] });
  const tl = await page.evaluate(() => DG.exportTimeline());
  fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'build/timeline.json'), JSON.stringify(tl, null, 1));
  const fmt = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, '0')}`;
  let md = `# Timecodes (gerado por tools/render.js timeline)\n\nDuração total: **${fmt(tl.total)}** (${tl.total.toFixed(2)} s) · ${tl.fps} fps · ${tl.bpm} BPM\n\n`;
  md += '| Cena | Início | Duração | Fala | Início da fala | Duração da fala |\n|---|---|---|---|---|---|\n';
  for (const s of tl.scenes) {
    const ls = tl.lines.filter((l) => l.scene === s.id);
    ls.forEach((l, i) => {
      md += `| ${i ? '' : s.id + ' ' + s.name} | ${i ? '' : fmt(s.start)} | ${i ? '' : s.dur.toFixed(3) + ' s'} | ${l.id} | ${fmt(l.start)} | ${l.dur.toFixed(2)} s |\n`;
    });
  }
  md += `\n${tl.cues.length} cues de som exportados para \`build/timeline.json\`.\n`;
  fs.writeFileSync(path.join(ROOT, 'docs/TIMECODES.md'), md);
  console.log(`total ${tl.total.toFixed(2)}s, ${tl.scenes.length} scenes, ${tl.lines.length} lines, ${tl.cues.length} cues`);
  tl.scenes.forEach((s) => console.log(`  ${s.id} ${s.start.toFixed(2)} +${s.dur.toFixed(3)}`));
  await browser.close();
  srv.close();
}

async function cmdStills() {
  const times = String(opt.t).split(',').map(Number);
  const out = path.resolve(opt.out || path.join(ROOT, 'renders/stills/sheet.png'));
  const srv = await serve();
  const browser = await launch();
  const { page } = await openPage(browser, srv.address().port, opt.scenes ? { scenes: String(opt.scenes).split(',') } : {});
  if (opt.safe) await page.evaluate(() => (DG.SHOW_SAFE = true));
  const cols = Number(opt.sheet || 0);
  const t0 = Date.now();
  if (cols) {
    const scale = Number(opt.scale || 0.33);
    const data = await page.evaluate(
      ({ times, cols, scale }) => {
        const w = Math.round(1080 * scale),
          h = Math.round(1920 * scale);
        const rows = Math.ceil(times.length / cols);
        const sheet = document.createElement('canvas');
        sheet.width = cols * w + (cols + 1) * 6;
        sheet.height = rows * h + (rows + 1) * 6;
        const g = sheet.getContext('2d');
        g.fillStyle = '#222';
        g.fillRect(0, 0, sheet.width, sheet.height);
        times.forEach((t, i) => {
          DG.renderFrame(t);
          const x = 6 + (i % cols) * (w + 6),
            y = 6 + Math.floor(i / cols) * (h + 6);
          g.drawImage(DG.canvasEl, x, y, w, h);
          g.fillStyle = 'rgba(0,0,0,0.6)';
          g.fillRect(x, y, 92, 26);
          g.fillStyle = '#fff';
          g.font = '18px monospace';
          g.fillText(t.toFixed(2) + 's', x + 6, y + 19);
        });
        return sheet.toDataURL('image/png');
      },
      { times, cols, scale }
    );
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
  } else {
    for (const t of times) {
      const data = await page.evaluate((t) => {
        DG.renderFrame(t);
        return DG.canvasEl.toDataURL('image/png');
      }, t);
      const f = times.length === 1 ? out : out.replace(/\.png$/, `_${t.toFixed(2)}.png`);
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64'));
    }
  }
  console.log(`stills ${times.length} in ${((Date.now() - t0) / 1000).toFixed(1)}s → ${out}`);
  await browser.close();
  srv.close();
}

function ffmpegSeg(file, fps, crf) {
  const a = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos,format=yuv420p',
    '-c:v', 'libx264', '-preset', opt.preset || 'slow', '-crf', String(crf), '-tune', 'animation', '-profile:v', 'high',
    '-x264-params', 'keyint=48:min-keyint=24', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', file];
  const p = spawn('ffmpeg', a, { stdio: ['pipe', 'inherit', 'inherit'] });
  return p;
}

async function cmdVideo() {
  const fps = 24;
  const srv = await serve();
  const port = srv.address().port;
  const browser = await launch();
  // total duration
  const probe = await openPage(browser, port, { scenes: [] });
  const total = probe.info.total;
  await probe.page.close();
  const from = Number(opt.from || 0),
    to = Math.min(Number(opt.to || total), total);
  const f0 = Math.round(from * fps),
    f1 = Math.round(to * fps);
  const nW = Math.max(1, Math.min(Number(opt.workers || 4), f1 - f0));
  const out = path.resolve(opt.out || path.join(ROOT, 'renders/out.mp4'));
  const segDir = path.join(ROOT, 'renders/segments');
  fs.mkdirSync(segDir, { recursive: true });
  const crf = Number(opt.crf || 17);
  const per = Math.ceil((f1 - f0) / nW);
  const quality = Number(opt.q || 0.95);
  const t0 = Date.now();
  let done = 0;
  const segs = [];
  await Promise.all(
    Array.from({ length: nW }, async (_, w) => {
      const a = f0 + w * per,
        b = Math.min(f1, a + per);
      if (a >= b) return;
      const seg = path.join(segDir, `seg_${String(w).padStart(2, '0')}.mp4`);
      segs[w] = seg;
      const { page } = await openPage(browser, port, {});
      const ff = ffmpegSeg(seg, fps, crf);
      const closed = new Promise((r) => ff.on('close', r));
      for (let f = a; f < b; f++) {
        const data = await page.evaluate(
          ([t, f, q]) => {
            DG.renderFrame(t, f);
            return DG.canvasEl.toDataURL('image/jpeg', q);
          },
          [f / fps, f, quality]
        );
        const buf = Buffer.from(data.slice(data.indexOf(',') + 1), 'base64');
        if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
        done++;
        if (done % 96 === 0) {
          const el = (Date.now() - t0) / 1000;
          console.log(`  ${done}/${f1 - f0} frames  ${(done / el).toFixed(1)} fps  eta ${(((f1 - f0 - done) / done) * el).toFixed(0)}s`);
        }
      }
      ff.stdin.end();
      await closed;
      await page.close();
    })
  );
  await browser.close();
  srv.close();
  const list = path.join(segDir, 'list.txt');
  fs.writeFileSync(list, segs.filter(Boolean).map((s) => `file '${s}'`).join('\n'));
  const cat = ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list];
  if (opt.audio) cat.push('-ss', String(from), '-t', String(to - from), '-i', path.resolve(opt.audio), '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000');
  cat.push('-c:v', 'copy', '-movflags', '+faststart', out);
  await new Promise((r, j) => spawn('ffmpeg', cat, { stdio: 'inherit' }).on('close', (c) => (c ? j(new Error('concat ' + c)) : r())));
  console.log(`video ${f1 - f0} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s → ${out}`);
}

(async () => {
  try {
    if (cmd === 'timeline') await cmdTimeline();
    else if (cmd === 'stills') await cmdStills();
    else if (cmd === 'video') await cmdVideo();
    else console.log('usage: render.js timeline|stills|video');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
