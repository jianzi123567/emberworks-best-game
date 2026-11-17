// EMBERWORKS — entry program for make.fun best-game-01 (Node 22, stdlib only).
//
// The game lives in this directory as plain static files: game/index.html plus
// its ES modules and the vendored three.js build under game/vendor, loaded
// offline by a desktop browser with no network request. This program hands the
// game in: it copies game/ and screenshots/ next to this file into /output
// and writes /output/dossier.json, the summary the judge reads, using the
// vendored make.fun library in vendor/makefun-game.ts.
//
// What the game is: a round-based tactical FPS in a foundry yard at dusk.
// Cinder attacks and plants the charge at the Furnace or the Crane site;
// Vanguard — the player plus two bots — defends and defuses. First team to
// 5 rounds takes the yard. Single-player against bots, with a buy menu,
// four weapons, a grenade, money between rounds, headshots, recoil and
// spread that punish firing on the move.
//
// Screenshots, in order: 1-start (title screen), 2-buy (buy menu),
// 3-play (combat with HUD), 4-end (match over, 5–1, with Play again).
//
// Play it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The gate's size caps: at most 4 screenshots, each at most 256 KiB; game/
// at most 993 files and 48 MiB in all, no path under it over 1000 bytes.
// The dossier text itself is capped at 160 KiB by buildDossier.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
