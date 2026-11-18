#!/usr/bin/env bash
# Prepara una publicación del sitio para el hosting (cPanel › Git™ Version Control).
#
#   bash scripts/publicar.sh pruebas      Compila main, revisa y sube a la rama deploy-pruebas.
#   bash scripts/publicar.sh produccion   Toma EXACTAMENTE lo que está en deploy-pruebas
#                                         (sin recompilar) y lo sube a la rama deploy-produccion.
#
# Después, en cPanel: "Update from Remote" y "Deploy HEAD Commit" en el repositorio
# del entorno correspondiente. Ver DESPLIEGUE.md.

set -euo pipefail

ENTORNO="${1:-}"
REMOTO="origin"
RAIZ="$(git rev-parse --show-toplevel)"
cd "$RAIZ"

# Destinos en el servidor. Producción solo recibe los archivos del sitio:
# nunca se vacía public_html (ahí viven apps/ y las carpetas de otros dominios).
DESTINO_PRUEBAS="/home/ocre/pruebas.ocre.mx/"
DESTINO_PRODUCCION="/home/ocre/public_html/"

falla() { echo "ERROR: $*" >&2; exit 1; }

case "$ENTORNO" in
  pruebas)    RAMA="deploy-pruebas";    DESTINO="$DESTINO_PRUEBAS" ;;
  produccion) RAMA="deploy-produccion"; DESTINO="$DESTINO_PRODUCCION" ;;
  *) falla "uso: bash scripts/publicar.sh pruebas|produccion" ;;
esac

[ -z "$(git status --porcelain)" ] || falla "hay cambios sin commit; todo lo publicado debe estar en un commit."

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/sitio"

if [ "$ENTORNO" = "pruebas" ]; then
  git fetch -q "$REMOTO" main
  [ "$(git rev-parse HEAD)" = "$(git rev-parse "$REMOTO/main")" ] \
    || falla "HEAD no coincide con $REMOTO/main; publica solo commits ya subidos a main."
  ORIGEN="$(git rev-parse HEAD)"

  npm ci --no-audit --no-fund
  rm -rf out .next
  npm run build
  node scripts/revisar.mjs out
  cp -R out/. "$TMP/sitio/"
  # Pruebas nunca debe aparecer en buscadores.
  printf 'User-agent: *\nDisallow: /\n' > "$TMP/sitio/robots.txt"
else
  git fetch -q "$REMOTO" deploy-pruebas
  git archive "$REMOTO/deploy-pruebas" sitio ORIGEN | tar -x -C "$TMP"
  ORIGEN="$(cat "$TMP/ORIGEN")"
  rm -f "$TMP/sitio/robots.txt"
  printf 'User-agent: *\nAllow: /\n' > "$TMP/sitio/robots.txt"
  node scripts/revisar.mjs "$TMP/sitio"
fi

echo "$ORIGEN" > "$TMP/ORIGEN"

cat > "$TMP/.cpanel.yml" <<EOF
---
# Generado por scripts/publicar.sh — no editar a mano.
# Entorno: $ENTORNO · commit de origen en main: $ORIGEN
deployment:
  tasks:
    - export DEPLOYPATH=$DESTINO
    - /bin/mkdir -p \$DEPLOYPATH
    - /bin/rm -rf \${DEPLOYPATH}_next
    - /bin/cp -R sitio/. \$DEPLOYPATH
EOF

cat > "$TMP/LEEME.md" <<EOF
# Rama de despliegue: $ENTORNO

Esta rama la genera \`scripts/publicar.sh\`. No se edita a mano.
El código fuente está en la rama \`main\` (commit \`$ORIGEN\`).
EOF

# Construye el commit de la rama de despliegue sin tocar el árbol de trabajo.
export GIT_INDEX_FILE="$TMP/.indice"
git --work-tree="$TMP" add -A -f -- . ':!.indice'
ARBOL="$(git write-tree)"
unset GIT_INDEX_FILE

PADRE=()
if git fetch -q "$REMOTO" "$RAMA" 2>/dev/null; then
  PADRE=(-p "$REMOTO/$RAMA")
  if [ "$(git rev-parse "$REMOTO/$RAMA^{tree}")" = "$ARBOL" ]; then
    echo "Sin cambios: $RAMA ya contiene esta publicación."; exit 0
  fi
fi

COMMIT="$(git commit-tree "$ARBOL" "${PADRE[@]}" -m "Publica ${ORIGEN:0:7} en $ENTORNO")"
git push -q "$REMOTO" "$COMMIT:refs/heads/$RAMA"

echo
echo "Listo: $RAMA -> ${COMMIT:0:7} (origen main ${ORIGEN:0:7})."
echo "Siguiente paso en cPanel: Update from Remote y Deploy HEAD Commit del repo de $ENTORNO."
