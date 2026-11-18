#!/bin/bash
# Despliegue automático. Lo ejecuta una tarea programada de cPanel (Cron Jobs):
#
#   /bin/bash /home/ocre/web-<entorno>/despliegue/auto.sh <entorno> >/dev/null 2>&1
#
# Descarga la rama de despliegue desde GitHub (equivale a "Update from Remote") y,
# solo si llegó un commit nuevo, ejecuta el despliegue ("Deploy HEAD Commit").
# Bitácora: ~/.ocre-web/<entorno>/auto.log
#
# Todo vive dentro de main() porque la descarga puede reemplazar este mismo archivo
# mientras se ejecuta: bash lee la función completa antes de empezar.

main() {
  set -u
  local entorno="${1:-}" repo rama
  case "$entorno" in
    produccion) repo="$HOME/web-produccion"; rama="deploy-produccion" ;;
    pruebas)    repo="$HOME/web-pruebas";    rama="deploy-pruebas" ;;
    *) echo "uso: auto.sh produccion|pruebas" >&2; return 1 ;;
  esac

  local estado="$HOME/.ocre-web/$entorno"
  local log="$estado/auto.log"
  local cerrojo="$estado/auto.cerrojo"
  mkdir -p "$estado"
  registrar() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$log"; }

  # Evitar dos ejecuciones simultáneas (mkdir es atómico). Un cerrojo de más de
  # 30 minutos se considera abandonado.
  if ! mkdir "$cerrojo" 2>/dev/null; then
    if [ -n "$(find "$cerrojo" -maxdepth 0 -mmin +30 2>/dev/null)" ]; then
      rmdir "$cerrojo" 2>/dev/null; mkdir "$cerrojo" 2>/dev/null || return 0
      registrar "AVISO: se liberó un cerrojo abandonado"
    else
      return 0
    fi
  fi
  trap 'rmdir "$cerrojo" 2>/dev/null' RETURN

  local uapi
  uapi="$(command -v uapi 2>/dev/null || true)"
  [ -n "$uapi" ] || uapi=/usr/local/cpanel/bin/uapi
  [ -x "$uapi" ] || uapi=/usr/bin/uapi
  [ -x "$uapi" ] || { registrar "ERROR: no se encontró uapi"; return 1; }

  commit_actual() {
    local f="$repo/.git/refs/heads/$rama"
    if [ -f "$f" ]; then cat "$f"
    else grep " refs/heads/$rama\$" "$repo/.git/packed-refs" 2>/dev/null | cut -d' ' -f1
    fi
  }

  local antes despues salida
  antes="$(commit_actual)"
  salida="$("$uapi" VersionControl update repository_root="$repo" branch="$rama" 2>&1)"
  if ! printf '%s\n' "$salida" | grep -q '^ *status: 1'; then
    registrar "ERROR al descargar de GitHub: $(printf '%s' "$salida" | grep -iE 'error|reason' | head -3 | tr '\n' ' ')"
    return 1
  fi
  despues="$(commit_actual)"

  [ "$antes" = "$despues" ] && return 0

  salida="$("$uapi" VersionControlDeployment create repository_root="$repo" 2>&1)"
  if printf '%s\n' "$salida" | grep -q '^ *status: 1'; then
    registrar "OK: ${antes:0:7} -> ${despues:0:7}, despliegue iniciado"
  else
    registrar "ERROR al desplegar ${despues:0:7}: $(printf '%s' "$salida" | grep -iE 'error|reason' | head -3 | tr '\n' ' ')"
    return 1
  fi
}

main "$@"
exit $?
