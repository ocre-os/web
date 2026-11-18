'use client';

import { useRef, useState, type KeyboardEvent } from 'react';

type Equipo = {
  id: 'corte' | 'grabado' | 'limpieza' | 'router' | 'plotter' | 'robot';
  nombre: string;
  corto: string;
  escena: string;
  resumen: string;
  claves: string[];
};

const EQUIPOS: Equipo[] = [
  { id: 'corte', nombre: 'Corte láser', corto: 'corte láser', escena: 'Un cabezal láser recorre y corta un contorno en una lámina.',
    resumen: 'Tecnologías CO2, fibra y diodo para cortar con precisión letreros, señalética, displays y material publicitario.',
    claves: ['Letreros de precisión', 'Señalética profesional', 'Producción rápida'] },
  { id: 'grabado', nombre: 'Grabado láser', corto: 'grabado láser', escena: 'Un cabezal láser graba línea por línea un área de la lámina.',
    resumen: 'Marcado y grabado para personalizar promocionales, trofeos, placas y material POP.',
    claves: ['Personalización única', 'Detalle fotográfico', 'Producción rápida'] },
  { id: 'limpieza', nombre: 'Limpieza láser', corto: 'limpieza láser', escena: 'Un haz láser retira la capa oxidada y deja el metal limpio.',
    resumen: 'Remoción de tintas y barnices, y preparación de superficies sin usar químicos.',
    claves: ['Sin químicos', 'Ecológico', 'Superficie lista para trabajar'] },
  { id: 'router', nombre: 'Router CNC', corto: 'router CNC', escena: 'Un husillo CNC fresa un contorno en un tablero de madera.',
    resumen: 'Fresadoras CNC para letreros 3D, displays, expositores, muebles y elementos decorativos.',
    claves: ['Letreros 3D', 'Displays creativos', 'Gran formato'] },
  { id: 'plotter', nombre: 'Plotters', corto: 'plotter', escena: 'Un plotter imprime franja por franja sobre material de gran formato.',
    resumen: 'Impresión de gran formato en lonas, vinilos, papel fotográfico y material publicitario.',
    claves: ['Gran formato', 'Alta resolución', 'Vinilos y lonas'] },
  { id: 'robot', nombre: 'Brazos robóticos', corto: 'brazo robótico', escena: 'Un brazo robótico toma y coloca piezas sobre una mesa.',
    resumen: 'Automatización de corte, grabado y manejo de materiales en procesos gráficos.',
    claves: ['Automatización completa', 'Mayor productividad', 'Procesos complejos'] },
];

export default function Equipos() {
  const [sel, setSel] = useState<Equipo['id']>('corte');
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const eq = EQUIPOS.find((e) => e.id === sel) ?? EQUIPOS[0];

  const teclado = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = EQUIPOS.findIndex((x) => x.id === sel);
    let j = i;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % EQUIPOS.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + EQUIPOS.length) % EQUIPOS.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = EQUIPOS.length - 1;
    else return;
    e.preventDefault();
    setSel(EQUIPOS[j].id);
    botones.current[j]?.focus();
  };

  return (
    <div className="eq-rejilla">
      <div className="eq-lista" role="tablist" aria-label="Líneas de equipo" aria-orientation="vertical" onKeyDown={teclado}>
        {EQUIPOS.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => { botones.current[i] = el; }}
            type="button"
            role="tab"
            id={`tab-${x.id}`}
            aria-selected={x.id === sel}
            aria-controls="panel-equipo"
            tabIndex={x.id === sel ? 0 : -1}
            className="eq-btn"
            onClick={() => setSel(x.id)}
          >
            <span>{x.nombre}</span>
            <span className="eq-punto" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="eq-panel" role="tabpanel" id="panel-equipo" aria-labelledby={`tab-${eq.id}`}>
        <div className="eq-escena">
          <Escena id={eq.id} descripcion={eq.escena} />
        </div>
        <div className="eq-info">
          <h3>{eq.nombre}</h3>
          <p>{eq.resumen}</p>
          <ul className="chips">
            {eq.claves.map((c) => <li key={c}>{c}</li>)}
          </ul>
          <div className="eq-pie">
            <p>Incluye instalación, capacitación y soporte técnico.</p>
            <a className="btn btn-ocre btn-chico" href="#contacto">Cotizar {eq.corto}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Escena({ id, descripcion }: { id: Equipo['id']; descripcion: string }) {
  return (
    <svg viewBox="0 0 560 380" role="img" aria-label={descripcion}>
      <rect x="40" y="40" width="480" height="300" rx="14" fill="#2B3036" stroke="rgba(255,255,255,.08)" />
      <path d="M40 76 H520 M40 112 H520 M40 148 H520 M40 184 H520 M40 220 H520 M40 256 H520 M40 292 H520 M40 328 H520" stroke="rgba(0,0,0,.28)" strokeWidth="2" />

      {id === 'corte' && (
        <g>
          <rect x="100" y="90" width="360" height="200" rx="4" fill="#3A3229" stroke="rgba(201,138,43,.25)" />
          <rect x="130" y="120" width="300" height="140" fill="none" stroke="rgba(201,138,43,.25)" strokeDasharray="4 7" />
          <path className="s-ruta-rect" d="M130 120 H430 V260 H130 Z" pathLength={100} fill="none" stroke="#14171A" strokeWidth="4" />
          <g className="s-cabezal-rect">
            <circle r="26" fill="rgba(224,122,31,.20)" />
            <circle r="5" fill="#FFF3D9" className="s-parpadeo" />
            <rect x="-18" y="-18" width="36" height="36" rx="8" fill="none" stroke="#C9CED3" strokeWidth="2" />
          </g>
        </g>
      )}

      {id === 'grabado' && (
        <g>
          <rect x="100" y="90" width="360" height="200" rx="4" fill="#3A3229" stroke="rgba(201,138,43,.25)" />
          <rect className="s-raster-relleno" x="130" y="120" width="300" height="140" fill="#1A1714" />
          <path d="M130 128 H430 M130 140 H430 M130 152 H430 M130 164 H430 M130 176 H430 M130 188 H430 M130 200 H430 M130 212 H430 M130 224 H430 M130 236 H430 M130 248 H430" stroke="#3A3229" strokeWidth="3" />
          <g className="s-raster-fila"><g className="s-raster-x">
            <circle r="22" fill="rgba(224,122,31,.22)" />
            <circle r="4" fill="#FFF3D9" />
            <rect x="-16" y="-16" width="32" height="32" rx="7" fill="none" stroke="#C9CED3" strokeWidth="2" />
          </g></g>
        </g>
      )}

      {id === 'limpieza' && (
        <g>
          <rect x="100" y="90" width="360" height="200" rx="4" fill="#6B4A33" />
          <path d="M110 110 l18 6 M160 150 l22 -4 M230 120 l14 10 M300 210 l20 -6 M380 140 l16 8 M410 240 l-18 6 M150 240 l20 4" stroke="#7F5A3C" strokeWidth="5" strokeLinecap="round" />
          <rect className="s-limpia-relleno" x="130" y="90" width="300" height="200" fill="#B9C0C6" />
          <g className="s-limpia-x">
            <rect x="-4" y="90" width="8" height="200" fill="#FFF3D9" opacity=".85" className="s-parpadeo" />
            <rect x="-22" y="90" width="44" height="200" fill="rgba(224,122,31,.18)" />
          </g>
        </g>
      )}

      {id === 'router' && (
        <g>
          <rect x="100" y="90" width="360" height="200" rx="4" fill="#8A6A45" />
          <path d="M100 120 H460 M100 170 H460 M100 230 H460" stroke="rgba(0,0,0,.08)" strokeWidth="6" />
          <path className="s-ruta-rect" d="M130 120 H430 V260 H130 Z" pathLength={100} fill="none" stroke="#3C2C1B" strokeWidth="14" strokeLinejoin="round" />
          <g className="s-cabezal-rect">
            <circle r="30" fill="#1E2226" stroke="#C9CED3" strokeWidth="2" />
            <circle r="18" fill="none" stroke="#C98A2B" strokeWidth="3" strokeDasharray="6 6" className="s-giro" />
            <circle r="4" fill="#C9CED3" />
          </g>
        </g>
      )}

      {id === 'plotter' && (
        <g>
          <rect x="100" y="70" width="360" height="250" rx="4" fill="#E9ECEE" />
          <rect className="s-impresion" x="120" y="100" width="320" height="170" fill="#C98A2B" />
          <path d="M120 140 H440 M120 180 H440 M120 220 H440 M120 260 H440" stroke="rgba(30,34,38,.18)" strokeWidth="10" />
          <g className="s-portico">
            <rect x="70" y="-10" width="420" height="20" rx="6" fill="#1E2226" stroke="#C9CED3" strokeWidth="2" />
            <g className="s-carro"><rect x="-20" y="-16" width="40" height="32" rx="6" fill="#C9CED3" /><circle r="4" fill="#C98A2B" /></g>
          </g>
        </g>
      )}

      {id === 'robot' && (
        <g>
          <rect x="320" y="250" width="160" height="70" rx="6" fill="#3A3229" stroke="rgba(201,138,43,.3)" />
          <rect x="352" y="232" width="44" height="18" rx="3" fill="#C98A2B" />
          <rect x="160" y="300" width="80" height="24" rx="6" fill="#C9CED3" />
          <g className="s-brazo1">
            <rect x="186" y="160" width="28" height="146" rx="14" fill="#C98A2B" />
            <g className="s-brazo2">
              <rect x="186" y="60" width="28" height="122" rx="14" fill="#E3A54A" />
              <circle cx="200" cy="60" r="12" fill="#1E2226" stroke="#C9CED3" strokeWidth="3" />
              <path d="M192 48 V30 M208 48 V30" stroke="#C9CED3" strokeWidth="5" strokeLinecap="round" />
            </g>
            <circle cx="200" cy="170" r="16" fill="#1E2226" stroke="#C9CED3" strokeWidth="3" />
          </g>
          <circle cx="200" cy="300" r="20" fill="#1E2226" stroke="#C9CED3" strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}
