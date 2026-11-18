# Instrucciones para agentes — ocre-os/web

Sitio web público de OCRE (ocre.mx). Next.js con exportación estática (`output: 'export'`).

## Reglas

- Todo en español: textos del sitio, commits, comentarios y documentación.
- El hosting no ejecuta Node: nada de rutas de API, Server Actions, middleware, ISR
  ni `next/image` optimizado. Todo debe funcionar como HTML estático.
- Lo que se publica sale de un commit en `main`. Nunca se edita a mano en el servidor
  ni en las ramas `deploy-*`.
- Antes de proponer una publicación: `npm run build` y `npm run revisar` sin errores,
  y revisión visual en pruebas.ocre.mx en móvil y escritorio.
- **Producción solo con aprobación explícita de OCRE.** Pruebas se puede publicar libremente.
- El despliegue nunca debe borrar ni sobrescribir `apps/`, `.htaccess` ni carpetas de
  otros dominios dentro de `public_html`.
- Relevo entre agentes: el agente relevado no hace modificaciones al código.

Detalle del flujo: [DESPLIEGUE.md](DESPLIEGUE.md).
