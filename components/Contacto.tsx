'use client';

import { useState, type FormEvent } from 'react';

const WHATSAPP = '529982123429';
const CORREO = 'soporte@ocre.mx';
const OPCIONES = ['Corte láser', 'Grabado láser', 'Limpieza láser', 'Router CNC', 'Plotter de impresión', 'Brazo robótico', 'Servicio técnico', 'Otro'];

// El hosting solo sirve archivos: la solicitud se envía por WhatsApp o por correo,
// ya redactada con lo que la persona escribió.
export default function Contacto() {
  const [error, setError] = useState('');

  const mensaje = (f: FormData) => {
    const v = (k: string) => String(f.get(k) ?? '').trim();
    const partes = [
      `Hola, soy ${v('nombre')}${v('empresa') ? ` de ${v('empresa')}` : ''}.`,
      `Me interesa: ${v('equipo')}.`,
      v('mensaje'),
      v('telefono') ? `Mi teléfono: ${v('telefono')}.` : '',
    ];
    return partes.filter(Boolean).join('\n');
  };

  const valido = (f: FormData) => {
    if (!String(f.get('nombre') ?? '').trim()) return 'Escribe tu nombre para saber a quién responder.';
    if (!String(f.get('mensaje') ?? '').trim()) return 'Cuéntanos qué quieres producir o qué servicio necesitas.';
    return '';
  };

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const err = valido(f);
    setError(err);
    if (err) return;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje(f))}`, '_blank', 'noopener');
  };

  const porCorreo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const f = new FormData(form);
    const err = valido(f);
    setError(err);
    if (err) { e.preventDefault(); return; }
    e.currentTarget.href = `mailto:${CORREO}?subject=${encodeURIComponent('Solicitud desde ocre.mx')}&body=${encodeURIComponent(mensaje(f))}`;
  };

  return (
    <form className="formulario" onSubmit={enviar} aria-label="Solicitud de cotización" noValidate>
      <div className="form-2">
        <div className="campo"><label htmlFor="f-nombre">Nombre</label><input id="f-nombre" name="nombre" type="text" autoComplete="name" required /></div>
        <div className="campo"><label htmlFor="f-empresa">Empresa o taller</label><input id="f-empresa" name="empresa" type="text" autoComplete="organization" /></div>
      </div>
      <div className="form-2">
        <div className="campo"><label htmlFor="f-tel">Teléfono</label><input id="f-tel" name="telefono" type="tel" autoComplete="tel" /></div>
        <div className="campo">
          <label htmlFor="f-equipo">Equipo o servicio</label>
          <select id="f-equipo" name="equipo" defaultValue="Corte láser">
            {OPCIONES.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="campo"><label htmlFor="f-msg">¿Qué quieres producir?</label><textarea id="f-msg" name="mensaje" rows={4} required /></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-pie">
        <button className="btn btn-ocre" type="submit">Enviar por WhatsApp</button>
        <a className="btn btn-linea" href={`mailto:${CORREO}`} onClick={porCorreo} style={{ color: '#1E2226', boxShadow: '0 0 0 1px rgba(30,34,38,.25) inset' }}>Enviar por correo</a>
      </div>
      <p className="form-nota">Tu mensaje se abre ya redactado; solo confirma el envío.</p>
    </form>
  );
}
