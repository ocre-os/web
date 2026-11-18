# Despliegue de ocre.mx

El hosting (GoDaddy, cPanel con CloudLinux) **no tiene shell ni Node.js**. Solo sirve
archivos. Por eso el sitio se compila fuera del servidor como HTML estático y cPanel
lo descarga de GitHub con **Git™ Version Control**, el mismo mecanismo que ya usa
`ocre-os/apps` (comprobado: "Deploy HEAD Commit" funciona sin shell).

No depende de la X280 ni de GitHub Actions.

## Ramas

| Rama | Contenido | Quién la escribe |
|---|---|---|
| `main` | Código fuente (Next.js) | Commits normales |
| `deploy-pruebas` | Sitio compilado + `.cpanel.yml` hacia el subdominio de pruebas | `scripts/publicar.sh pruebas` |
| `deploy-produccion` | El **mismo** sitio aprobado en pruebas + `.cpanel.yml` hacia `public_html` | `scripts/publicar.sh produccion` |

Producción nunca se recompila: publica byte por byte lo que se revisó en pruebas.
Cada commit de despliegue guarda en `ORIGEN` el commit de `main` del que salió.

## Repositorios en cPanel

| Ruta en el servidor | Rama | Publica en |
|---|---|---|
| `/home/ocre/web-pruebas` | `deploy-pruebas` | `/home/ocre/pruebas.ocre.mx/` (subdominio pruebas.ocre.mx) |
| `/home/ocre/web-produccion` | `deploy-produccion` | `/home/ocre/public_html/` (ocre.mx) |

## Flujo

1. Cambios en `main` (commit y push).
2. `bash scripts/publicar.sh pruebas` → compila, ejecuta `scripts/revisar.mjs` y sube a `deploy-pruebas`.
3. cPanel › Git™ Version Control › `web-pruebas` › Pull or Deploy › **Update from Remote** y **Deploy HEAD Commit**.
4. Revisión visual en https://pruebas.ocre.mx (móvil y escritorio, página por página).
5. **Solo con aprobación explícita de OCRE:** `bash scripts/publicar.sh produccion` y los mismos dos botones en `web-produccion`.

## Qué toca y qué no toca el despliegue en producción

- Reemplaza la carpeta `_next/` y copia encima los archivos del sitio (`index.html`, páginas, imágenes de `public/`).
- **Nunca vacía `public_html`.** Ahí viven `apps/`, las carpetas de los dominios adicionales y respaldos.
- No publica `.htaccess` (el del servidor se conserva). `scripts/revisar.mjs` bloquea rutas
  que chocan con carpetas existentes del hosting (`apps`, `assets`, `drive`, etc.).
- Las páginas que se eliminen del sitio quedan como archivos huérfanos en el servidor;
  se borran a mano desde el Administrador de archivos cuando haga falta.

## Revertir

Producción: volver a publicar un commit anterior de `deploy-produccion`.

```bash
git fetch origin deploy-produccion
git push origin <commit-anterior>:refs/heads/deploy-produccion --force-with-lease
```

Después, en cPanel: Update from Remote y Deploy HEAD Commit.

## Revisión automática (`npm run revisar`)

Falla si encuentra: enlaces o recursos internos rotos, páginas sin `lang="es"`,
`<title>` o `viewport`, imágenes sin `alt`, texto de relleno, referencias a localhost,
`.htaccess`, `.env` o mapas de código en la publicación, o rutas reservadas del hosting.
Avisa de archivos de más de 1.5 MB.
