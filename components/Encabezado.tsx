'use client';

import { useState } from 'react';
import Simbolo from './Simbolo';

const ENLACES = [
  { href: '#equipos', texto: 'Equipos' },
  { href: '#servicio', texto: 'Servicio técnico' },
  { href: '#ocre-os', texto: 'OCRE OS' },
  { href: '#contacto', texto: 'Contacto' },
];

export default function Encabezado() {
  const [abierto, setAbierto] = useState(false);
  return (
    <header className="encabezado">
      <div className="contenedor encabezado-fila">
        <a href="#inicio" className="marca" aria-label="OCRE Tecnologías, inicio">
          <Simbolo alto={26} />
          <span className="marca-texto">OCRE</span>
        </a>
        <nav className="nav" aria-label="Principal">
          {ENLACES.map((e) => (
            <a key={e.href} href={e.href}>{e.texto}</a>
          ))}
        </nav>
        <div className="acciones">
          <a className="btn btn-linea btn-chico btn-portal" href="https://os.ocre.mx">Entrar a OCRE OS</a>
          <button
            type="button"
            className="btn btn-linea btn-chico btn-menu"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            onClick={() => setAbierto(!abierto)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {abierto && (
        <nav id="menu-movil" className="menu-movil" aria-label="Menú móvil">
          {ENLACES.map((e) => (
            <a key={e.href} href={e.href} onClick={() => setAbierto(false)}>{e.texto}</a>
          ))}
          <a href="https://os.ocre.mx" onClick={() => setAbierto(false)}>Entrar a OCRE OS</a>
        </nav>
      )}
    </header>
  );
}
