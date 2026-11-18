#!/usr/bin/env bash
# Prepara una publicación del sitio para el hosting (cPanel › Git™ Version Control).
#
#   bash scripts/publicar.sh produccion   Compila main y sube a la rama deploy-produccion (ocre.mx).
#   bash scripts/publicar.sh pruebas      Igual, pero a deploy-pruebas (pruebas.ocre.mx).
#
# En el servidor, despliegue/sincronizar.sh deja el destino idéntico al sitio:
# crea, cambia y borra lo que corresponda, sin tocar rutas protegidas. Ver DESPLIEGUE.md.

set -euo pipefail

ENTORNO="${1:-}"
REMOTO="${REMOTO:-origin}"
RAIZ="$(git rev-parse --show-toplevel)"
cd "$RAIZ"

falla() { echo "ERROR: $*" >&2; exit 1; }
# Descarga una rama del remoto a refs/remotes/<remoto>/<rama> sin depender
# de la configuración del clon. Devuelve 1 si la rama no existe.
traer() { git fetch -q "$REMOTO" "+refs/heads/$1:refs/remotes/$REMOTO/$1" 2>/dev/null; }

case "$ENTORNO" in
  produccion) RAMA="deploy-produccion"; DESTINO="/home/ocre/public_html" ;;
  pruebas)    RAMA="deploy-pruebas";    DESTINO="/home/ocre/pruebas.ocre.mx" ;;
  *) falla "uso: bash scripts/publicar.sh produccion|pruebas" ;;
esac

[ -z "$(git status --porcelain)" ] || falla "hay cambios sin commit; todo lo publicado debe estar en un commit."
traer main || falla "no se pudo descargar main de $REMOTO."
[ "$(git rev-parse HEAD)" = "$(git rev-parse "$REMOTO/main")" ] \
  || falla "HEAD no coincide con $REMOTO/main; publica solo commits ya subidos a main."
ORIGEN="$(git rev-parse HEAD)"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/sitio" "$TMP/despliegue"

npm ci --no-audit --no-fund
rm -rf out .next
npm run build
node scripts/revisar.mjs out
cp -R out/. "$TMP/sitio/"
if [ "$ENTORNO" = "pruebas" ]; then
  printf 'User-agent: *\nDisallow: /\n' > "$TMP/sitio/robots.txt"
elif [ ! -f "$TMP/sitio/robots.txt" ]; then
  printf 'User-agent: *\nAllow: /\n' > "$TMP/sitio/robots.txt"
fi

cp despliegue/sincronizar.sh despliegue/auto.sh "$TMP/despliegue/"
[ "$ENTORNO" = "produccion" ] && cp despliegue/sitio-anterior.txt "$TMP/despliegue/"
echo "$ORIGEN" > "$TMP/ORIGEN"

cat > "$TMP/.cpanel.yml" <<EOF
---
# Generado por scripts/publicar.sh — no editar a mano.
# Entorno: $ENTORNO · commit de origen en main: $ORIGEN
deployment:
  tasks:
    - /bin/bash despliegue/sincronizar.sh $DESTINO $ENTORNO
EOF

cat > "$TMP/LEEME.md" <<EOF
# Rama de despliegue: $ENTORNO

Esta rama la genera \`scripts/publicar.sh\`. No se edita a mano.
El código fuente está en la rama \`main\` (commit \`$ORIGEN\`).
EOF

# Construye el commit de la rama de despliegue sin tocar el árbol de trabajo.
# El índice temporal vive fuera de $TMP para que no entre en el commit.
INDICE="$(mktemp -u)"
GIT_INDEX_FILE="$INDICE" git --work-tree="$TMP" add -A -f -- .
ARBOL="$(GIT_INDEX_FILE="$INDICE" git write-tree)"
rm -f "$INDICE" "$INDICE.lock"

PADRE=()
if traer "$RAMA"; then
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
