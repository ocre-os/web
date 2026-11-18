// Revisión automática del sitio compilado (carpeta out/) antes de publicar.
// Falla (código 1) si encuentra algo que no debe llegar al hosting.
//
// Uso: node scripts/revisar.mjs [carpeta]   (por defecto: out)

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, dirname, posix } from 'node:path';

const raiz = process.argv[2] ?? 'out';
const errores = [];
const avisos = [];

async function listar(dir) {
  const salida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await listar(ruta)));
    else salida.push(ruta);
  }
  return salida;
}

async function existe(ruta) {
  try {
    const s = await stat(ruta);
    return s.isFile() || (s.isDirectory() && (await stat(join(ruta, 'index.html'))).isFile());
  } catch {
    return false;
  }
}

const archivos = await listar(raiz);
const rel = (f) => relative(raiz, f).split('\\').join('/');

// 1. Archivos que nunca deben ir en la publicación.
const prohibidos = [/^\.htaccess$/, /^\.env/, /\.map$/, /(^|\/)\.git(\/|$)/];
for (const f of archivos) {
  const r = rel(f);
  if (prohibidos.some((p) => p.test(r))) errores.push(`Archivo que no debe publicarse: ${r}`);
}

// 2. Que el sitio no choque con lo que ya vive en public_html.
const reservados = ['apps', 'assets', '_respaldo', 'OLDROOT', 'drive', 'webstore', '.well-known'];
for (const f of archivos) {
  const primero = rel(f).split('/')[0];
  if (reservados.includes(primero)) errores.push(`Ruta reservada en el hosting: ${rel(f)}`);
}

// 3. Revisión de cada página HTML.
const html = archivos.filter((f) => f.endsWith('.html'));
if (!html.some((f) => rel(f) === 'index.html')) errores.push('Falta index.html en la raíz');

for (const f of html) {
  const r = rel(f);
  const texto = await readFile(f, 'utf8');

  if (!/<html[^>]*\blang="es/.test(texto)) errores.push(`${r}: falta lang="es…" en <html>`);
  if (!/<title>[^<]+<\/title>/.test(texto)) errores.push(`${r}: falta <title>`);
  if (!/<meta name="viewport"/.test(texto)) errores.push(`${r}: falta meta viewport`);
  if (/localhost|127\.0\.0\.1/.test(texto)) errores.push(`${r}: contiene referencias a localhost`);
  if (/lorem ipsum/i.test(texto)) errores.push(`${r}: contiene texto de relleno (lorem ipsum)`);

  for (const m of texto.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) errores.push(`${r}: imagen sin texto alternativo: ${m[0].slice(0, 80)}`);
  }

  // Enlaces y recursos internos: deben existir dentro de out/.
  for (const m of texto.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(url)) continue;
    const limpio = decodeURIComponent(url.split('#')[0].split('?')[0]);
    if (!limpio) continue;
    const destino = limpio.startsWith('/')
      ? join(raiz, limpio)
      : join(dirname(f), limpio);
    if (!(await existe(destino))) {
      // Rutas que viven en el hosting fuera de este sitio (p. ej. /apps/).
      const primero = posix.normalize(limpio).replace(/^\//, '').split('/')[0];
      if (reservados.includes(primero)) avisos.push(`${r}: enlaza a ${url} (vive fuera de este sitio)`);
      else errores.push(`${r}: enlace o recurso roto: ${url}`);
    }
  }
}

// 4. Peso: avisa de archivos grandes que vuelven lento el sitio.
for (const f of archivos) {
  const { size } = await stat(f);
  if (size > 1_500_000) avisos.push(`${rel(f)} pesa ${(size / 1e6).toFixed(1)} MB`);
}

for (const a of avisos) console.log(`AVISO  ${a}`);
for (const e of errores) console.log(`ERROR  ${e}`);
console.log(`\nRevisadas ${html.length} páginas y ${archivos.length} archivos: ${errores.length} errores, ${avisos.length} avisos.`);
process.exit(errores.length ? 1 : 0);
