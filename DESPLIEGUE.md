# Despliegue de ocre.mx

El hosting (GoDaddy, cPanel con CloudLinux) **no tiene shell ni Node.js**: solo sirve
archivos. El sitio se compila fuera del servidor como HTML estático, se sube a GitHub, y
cPanel lo descarga con **Git™ Version Control**. No depende de la X280 ni de GitHub Actions.

DNS: Cloudflare. `ocre.mx` es un registro A (solo DNS) hacia el hosting; `pruebas.ocre.mx`
es un CNAME hacia `ocre.mx` con proxy (igual que `apps.ocre.mx`).

## Ramas

| Rama | Contenido | Quién la escribe |
|---|---|---|
| `main` | Código fuente (Next.js) | Commits normales |
| `deploy-produccion` | Sitio compilado + sincronizador → `ocre.mx` | `bash scripts/publicar.sh produccion` |
| `deploy-pruebas` | Sitio compilado + sincronizador → `pruebas.ocre.mx` (opcional) | `bash scripts/publicar.sh pruebas` |

Cada commit de despliegue guarda en `ORIGEN` el commit de `main` del que salió.

## Repositorios en cPanel

| Ruta en el servidor | Rama | Publica en |
|---|---|---|
| `/home/ocre/web-produccion` | `deploy-produccion` | `/home/ocre/public_html` (ocre.mx) |
| `/home/ocre/web-pruebas` | `deploy-pruebas` | `/home/ocre/pruebas.ocre.mx` |

## Flujo

1. Cambios en `main` (commit y push).
2. `bash scripts/publicar.sh produccion` → compila, ejecuta `scripts/revisar.mjs` y sube a `deploy-produccion`.
3. cPanel › Git™ Version Control › `OCRE Web (produccion)` › Pull or Deploy ›
   **Update from Remote** y **Deploy HEAD Commit**.
4. Comprobar la bitácora y el sitio:
   - `~/.ocre-web/produccion/despliegues.log` (Administrador de archivos), y
   - https://ocre.mx en móvil y escritorio.

## Qué hace el despliegue en el servidor (`despliegue/sincronizar.sh`)

- Deja el destino **idéntico** al sitio publicado: copia lo nuevo, actualiza lo que cambió y
  **borra** lo que se publicó antes y ya no existe (manifiesto en `~/.ocre-web/<entorno>/`).
  Además limpia cualquier archivo de `_next/` que no pertenezca a la publicación actual.
- **Nunca** crea, cambia ni borra rutas protegidas: `apps`, carpetas de los otros dominios
  (`cancuntodoincluido`, `drive`, `gimpresos`, `hookahshop.mx`, `webstore`), `_respaldo`,
  `OLDROOT`, `.well-known`, `.htaccess`, `.ftpquota`, `cgi-bin`, `.user.ini`, `php.ini`, `error_log`.
  Si una publicación incluye alguna, se cancela entera.
- Usa solo herramientas básicas (el entorno del hosting es restringido) y se detiene con error
  si falta alguna.
- En la primera publicación movió el sitio anterior a
  `/home/ocre/respaldos-web/produccion-20261117-223423/` (fuera de `public_html`).

## Revertir

Las ramas `deploy-*` solo avanzan: nunca se reescriben con `--force`, porque cPanel
descarga con avance rápido y la descarga fallaría. Para volver atrás se revierte en
`main` y se publica de nuevo:

```bash
git revert <commit-con-el-cambio>        # o varios commits
git push origin main
bash scripts/publicar.sh produccion
```

El sincronizador borra lo que sobre y restaura lo que falte.

## Despliegue automático (Cron Jobs)

Una tarea programada de cPanel ejecuta cada 5 minutos:

```
/bin/bash /home/ocre/web-<entorno>/despliegue/auto.sh <entorno> >/dev/null 2>&1
```

Descarga la rama de GitHub y, solo si llegó un commit nuevo, ejecuta el despliegue.
Así, publicar es solo `bash scripts/publicar.sh <entorno>`: en máximo 5 minutos el
cambio está en el servidor. Bitácora: `~/.ocre-web/<entorno>/auto.log`.

## Revisión automática (`npm run revisar`)

Falla si encuentra: enlaces o recursos internos rotos, páginas sin `lang="es"`, `<title>`
o `viewport`, imágenes sin `alt`, texto de relleno, referencias a localhost, `.htaccess`,
`.env` o mapas de código en la publicación, o rutas protegidas del hosting.
Avisa de archivos de más de 1.5 MB.
