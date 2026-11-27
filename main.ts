// best-household-budget-site-20261126-1457 — "AnggaranKeluarga" (Node 22, standard library only).
//
// The site is this directory's app/ folder: plain static files a browser opens at app/index.html
// (ES modules, CSS, no build step), its content held in its own files; nothing it runs, styles or
// shows loads over the network. The program hands it in: it copies app/ and screenshots/ from beside
// this file to /output and writes /output/dossier.json, the summary the judge reads (your screenshots,
// the first load's files and bytes, and your source), with the vendored make.fun library.
// Leave vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be byte for byte
// what its own copy writes.
//
// Serve it locally with `node serve.ts` (from the kit starter), then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));

function resolveOutDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  try {
    mkdirSync(configured, { recursive: true });
    return configured;
  } catch {
    const fallback = join(here, 'output');
    mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

const out = resolveOutDir();

// Fail fast with a clear message when the site is missing, instead of handing in an empty output.
if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing: the site was not built');
}
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
