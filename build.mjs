import { build } from 'esbuild';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = import.meta.dirname;
const DIST = join(ROOT, 'dist');

await build({
  absWorkingDir: ROOT,
  entryPoints: {
    index: 'src/index-main.jsx',
    ceconi: 'src/ceconi-main.jsx'
  },
  bundle: true,
  format: 'esm',
  outdir: 'dist/assets',
  entryNames: '[name]',
  assetNames: '[name]-[hash]',
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  target: ['es2022'],
  jsx: 'automatic',
  loader: { '.woff2': 'file' }
});

mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'uploads'), join(DIST, 'uploads'), { recursive: true });

function pageHtml({ title, description, entry }) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}" />
    <title>${title}</title>
    <link rel="stylesheet" href="/assets/${entry}.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${entry}.js"></script>
  </body>
</html>`;
}

writeFileSync(join(DIST, 'index.html'), pageHtml({
  title: 'MatCast · Seu tatame no ar',
  description: 'MatCast — câmeras e plataforma de vídeo para academias de Jiu-Jitsu.',
  entry: 'index'
}));

writeFileSync(join(DIST, 'ceconi.html'), pageHtml({
  title: 'Ceconi Live · O tatame nunca fecha',
  description: 'Ceconi Live — transmissão ao vivo, replays e cortes do tatame.',
  entry: 'ceconi'
}));
