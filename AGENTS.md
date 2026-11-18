# Instrucciones para agentes — ocre-os/web

Sitio web público de OCRE (ocre.mx). Next.js con exportación estática (`output: 'export'`).

## Reglas

- Todo en español: textos del sitio, commits, comentarios y documentación.
- El hosting no ejecuta Node: nada de rutas de API, Server Actions, middleware, ISR
  ni `next/image` optimizado. Todo debe funcionar como HTML estático.
- Lo que se publica sale de un commit en `main`. Nunca se edita a mano en el servidor
  ni en las ramas `deploy-*`.
- Antes de publicar: `npm run build` y `npm run revisar` sin errores. Después de publicar:
  revisar la bitácora del servidor y el sitio en móvil y escritorio.
- Publicar en ocre.mx cuando OCRE pida un cambio en su sitio; pruebas.ocre.mx es opcional.
- El despliegue nunca debe borrar ni sobrescribir `apps/`, `.htaccess` ni carpetas de
  otros dominios dentro de `public_html` (lista en `despliegue/sincronizar.sh`).
- Relevo entre agentes: el agente relevado no hace modificaciones al código.

Detalle del flujo: [DESPLIEGUE.md](DESPLIEGUE.md).

Recursos visuales para UI/UX (VP0 y 21st.dev, con la regla de la cuota diaria gratuita):
[docs/recursos-ui.md](docs/recursos-ui.md). Servidores MCP del proyecto en `.mcp.json`.
