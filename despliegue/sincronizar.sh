#!/bin/bash
# Se ejecuta EN EL SERVIDOR desde .cpanel.yml ("Deploy HEAD Commit").
# Deja el destino idéntico a la carpeta sitio/ de esta rama:
#   - copia todo lo de sitio/
#   - borra lo que se publicó antes y ya no existe en sitio/ (según el manifiesto)
#   - nunca toca rutas protegidas (apps, otros dominios, .htaccess, respaldos…)
# La primera vez mueve el sitio anterior a un respaldo fuera de public_html.
#
# Uso: /bin/bash despliegue/sincronizar.sh <destino> <nombre-entorno>

set -eu

DESTINO="${1:?falta destino}"
ENTORNO="${2:?falta entorno}"
DESTINO="${DESTINO%/}"
ESTADO="$HOME/.ocre-web/$ENTORNO"
MANIFIESTO="$ESTADO/manifiesto.txt"
BITACORA="$ESTADO/despliegues.log"
AHORA="$(date '+%Y-%m-%d %H:%M:%S')"

mkdir -p "$ESTADO" "$DESTINO"
log() { echo "[$AHORA] $*" >> "$BITACORA"; }

# Entradas de primer nivel del destino que este sitio jamás crea, cambia ni borra.
PROTEGIDOS=" apps cancuntodoincluido drive gimpresos hookahshop.mx webstore _respaldo OLDROOT .well-known .htaccess .ftpquota cgi-bin .user.ini php.ini error_log "

protegido() {
  local primero="${1%%/*}"
  case "$PROTEGIDOS" in *" $primero "*) return 0 ;; esac
  return 1
}

[ -d sitio ] || { log "ERROR: no existe sitio/ en $(pwd)"; exit 1; }

for h in find sort grep sed cp mv rm rmdir mkdir mktemp dirname wc date cat cut; do
  command -v "$h" >/dev/null 2>&1 || { log "ERROR: falta la herramienta $h en el servidor"; exit 1; }
done

NUEVO="$(mktemp)"
trap 'rm -f "$NUEVO"' EXIT
( cd sitio && find . -type f | sed 's|^\./||' | LC_ALL=C sort ) > "$NUEVO"

# Defensa en el servidor: si la publicación trae una ruta protegida, no se despliega nada.
while IFS= read -r f; do
  if protegido "$f"; then log "ERROR: la publicación incluye una ruta protegida: $f"; exit 1; fi
done < "$NUEVO"

# Primera publicación: respaldar el sitio anterior (lista en despliegue/sitio-anterior.txt).
if [ ! -f "$MANIFIESTO" ] && [ -f despliegue/sitio-anterior.txt ]; then
  RESPALDO="$HOME/respaldos-web/$ENTORNO-$(date '+%Y%m%d-%H%M%S')"
  mkdir -p "$RESPALDO"
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    case "$f" in \#*) continue ;; esac
    if protegido "$f"; then continue; fi
    if [ -e "$DESTINO/$f" ]; then
      mkdir -p "$RESPALDO/$(dirname "$f")"
      mv "$DESTINO/$f" "$RESPALDO/$f"
      log "respaldado: $f -> $RESPALDO/$f"
    fi
  done < despliegue/sitio-anterior.txt
fi

# Copiar el sitio nuevo.
cp -R sitio/. "$DESTINO/"

# Borrar lo que ya no forma parte del sitio:
#   - lo que se publicó antes (manifiesto) y ya no está, y
#   - cualquier archivo dentro de _next/ (carpeta propia del sitio) que no esté.
# Solo herramientas básicas: el entorno del hosting es restringido (sin comm ni <(...)).
VIEJOS="$(mktemp)"; SOBRAN="$(mktemp)"
trap 'rm -f "$NUEVO" "$VIEJOS" "$SOBRAN"' EXIT
{
  if [ -f "$MANIFIESTO" ]; then cat "$MANIFIESTO"; fi
  if [ -d "$DESTINO/_next" ]; then ( cd "$DESTINO" && find _next -type f ); fi
} | LC_ALL=C sort -u > "$VIEJOS"
grep -Fxv -f "$NUEVO" "$VIEJOS" > "$SOBRAN" || [ $? -eq 1 ]

BORRADOS=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  if protegido "$f"; then continue; fi
  if [ -f "$DESTINO/$f" ] || [ -L "$DESTINO/$f" ]; then
    rm -f "$DESTINO/$f"
    BORRADOS=$((BORRADOS + 1))
    # Quitar carpetas que hayan quedado vacías (sin salir del destino).
    d="$(dirname "$f")"
    while [ "$d" != "." ] && ! protegido "$d"; do
      rmdir "$DESTINO/$d" 2>/dev/null || break
      d="$(dirname "$d")"
    done
  fi
done < "$SOBRAN"

cp "$NUEVO" "$MANIFIESTO"
log "OK $(cat ORIGEN 2>/dev/null | cut -c1-7): $(wc -l < "$NUEVO") archivos publicados, $BORRADOS borrados en $DESTINO"
