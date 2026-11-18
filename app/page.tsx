import type { CSSProperties } from 'react';
import Encabezado from '../components/Encabezado';
import Equipos from '../components/Equipos';
import Contacto from '../components/Contacto';
import Simbolo from '../components/Simbolo';

// Ruta del láser en la placa del hero (coordenadas de 520 px).
const ENTRADA = 'M101 307.58 L260 307.58';
const CONTORNO = 'M260 307.58 L325 307.58 L390 195 L325 82.42 L195 82.42 L130 195 L165.75 256.92';
const VISTA_PREVIA = 'M101 307.58 L260 307.58 L325 307.58 L390 195 L325 82.42 L195 82.42 L130 195 L165.75 256.92';

const CHISPAS: [number, number, number][] = [
  [26, -18, 0], [-22, -26, 0.1], [34, 10, 0.22], [-30, 14, 0.34], [12, -34, 0.46], [-12, 30, 0.58], [40, -6, 0.16],
];

const PASOS = [
  ['Revisamos tu producción', 'Vemos qué fabricas, en qué volumen y con qué materiales para recomendarte el equipo correcto.'],
  ['Instalamos y ponemos a punto', 'Entregamos el equipo nivelado, calibrado y trabajando en tu taller.'],
  ['Capacitamos a tus operadores', 'Uso diario, cuidados y cómo sacar más rendimiento a cada material.'],
  ['Mantenimiento preventivo', 'Visitas programadas para detectar desgaste antes de que detenga tu producción.'],
  ['Correctivo con reporte', 'Si algo falla, un técnico lo atiende y deja el reporte en tu historial.'],
];

export default function Inicio() {
  return (
    <>
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      <Encabezado />

      <main id="contenido">
        {/* Hero: el láser corta el símbolo y se dibuja el logotipo */}
        <section id="inicio" className="hero">
          <div className="contenedor hero-rejilla">
            <div className="hero-texto">
              <h1>Equipos que cortan. Técnicos que llegan.</h1>
              <p className="hero-bajada">
                Vendemos, instalamos y mantenemos equipo láser, CNC, plotters y brazos robóticos para la industria
                gráfica, desde Mérida para todo el sureste.
              </p>
              <div className="botones">
                <a className="btn btn-ocre" href="#contacto">Solicitar cotización</a>
                <a className="btn btn-linea" href="#contacto">Agendar visita técnica</a>
              </div>
            </div>

            <div className="placa-caja">
              <div className="placa">
                <svg viewBox="0 0 520 520" width="520" height="520" role="img" aria-label="Logotipo OCRE Tecnologías cortado con láser">
                  <path d={VISTA_PREVIA} fill="none" stroke="rgba(201,138,43,.28)" strokeWidth="1.5" strokeDasharray="4 8" />
                  <circle cx="260" cy="195" r="3" fill="rgba(201,138,43,.5)" />
                  <path d="M260 185 V205 M250 195 H270" stroke="rgba(201,138,43,.45)" strokeWidth="1" />
                  <path className="corte corte-entrada" d={ENTRADA} pathLength={100} stroke="#C98A2B" strokeWidth="15" />
                  <path className="corte corte-contorno" d={CONTORNO} pathLength={100} stroke="#C98A2B" strokeWidth="42" strokeLinejoin="round" />
                  <path className="corte brillo" d={CONTORNO} pathLength={100} stroke="#FFE7B8" strokeWidth="42" strokeLinejoin="round" />
                  <path className="calor calor-entrada" d={ENTRADA} pathLength={100} strokeWidth="15" />
                  <path className="calor calor-contorno" d={CONTORNO} pathLength={100} strokeWidth="42" strokeLinejoin="round" />
                  <circle className="perforacion" cx="101" cy="307.58" r="12" fill="#C98A2B" />
                  <text className="palabra" x="260" y="452" textAnchor="middle" fill="#F2F3F4" stroke="#F2F3F4" strokeWidth="1.6"
                    style={{ fontFamily: 'Archivo, sans-serif', fontStretch: '125%', fontWeight: 800, fontSize: 104, letterSpacing: 4 }}>OCRE</text>
                  <text className="lema" x="260" y="502" textAnchor="middle" fill="#C9CED3"
                    style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 24, letterSpacing: '.3em' }}>TECNOLOGÍAS</text>
                </svg>

                <div className="cabezal" aria-hidden="true">
                  <div className="resplandor" />
                  <div className="haz-halo" />
                  <div className="haz" />
                  <div className="nucleo" />
                  {CHISPAS.map(([dx, dy, d], i) => (
                    <span key={i} className="chispa" style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, animationDelay: `${d}s` } as CSSProperties} />
                  ))}
                </div>

                <div className="cota" style={{ left: 40, top: 284 }} aria-hidden="true">Perforación<i style={{ width: 10 }} /></div>
                <div className="cota" style={{ left: 120, top: 346 }} aria-hidden="true"><i style={{ width: 18 }} />Entrada tangente</div>
                <div className="cota" style={{ left: 418, top: 104 }} aria-hidden="true"><i style={{ width: 18 }} />Contorno</div>
              </div>
            </div>
          </div>

          <div className="contenedor">
            <div className="hero-datos">
              <span>Mérida, Yucatán</span>
              <span>Lunes a viernes de 9:00 a 18:00, sábado de 9:00 a 14:00</span>
              <a href="https://wa.me/529982123429">WhatsApp 998 212 3429</a>
            </div>
          </div>
        </section>

        {/* Equipos */}
        <section id="equipos" className="claro">
          <div className="contenedor seccion">
            <div className="encabezado-seccion">
              <h2 className="titulo">Seis líneas de equipo, un solo responsable.</h2>
              <p className="bajada">Te ayudamos a elegir el equipo, lo instalamos y lo mantenemos funcionando. Elige una línea para ver qué hace.</p>
            </div>
            <Equipos />
          </div>
        </section>

        {/* Servicio técnico */}
        <section id="servicio" className="blanco">
          <div className="contenedor seccion serv-rejilla">
            <div className="serv-intro">
              <h2 className="titulo">Del primer diagnóstico al último ajuste.</h2>
              <p className="bajada" style={{ maxWidth: '30em' }}>
                Un mismo equipo técnico te acompaña antes, durante y después de la compra. Cada visita queda registrada en OCRE OS.
              </p>
              <div className="botones"><a className="btn btn-tinta" href="#contacto">Agendar visita técnica</a></div>
            </div>
            <div className="pasos-caja" style={{ position: 'relative' }}>
              <div className="riel" aria-hidden="true"><div className="riel-brillo" /></div>
              <ol className="pasos">
                {PASOS.map(([t, d], i) => (
                  <li key={t} className="paso">
                    <span className="paso-n" aria-hidden="true">{i + 1}</span>
                    <div><h3>{t}</h3><p>{d}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* OCRE OS */}
        <section id="ocre-os" className="oscuro">
          <div className="contenedor seccion os-rejilla">
            <div className="os-texto">
              <div className="marca" style={{ gap: 12 }}>
                <Simbolo alto={30} />
                <span className="marca-texto">OCRE OS</span>
              </div>
              <h2 className="titulo">El historial de tus equipos, siempre a la mano.</h2>
              <p className="bajada">Tu portal de cliente: cada equipo, cada visita y cada reporte en un solo lugar.</p>
              <ul className="funciones">
                <li><Icono d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h6" />Reportes técnicos de cada servicio, para consultar y descargar.</li>
                <li><Icono d="M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 7v5l3 3" />Seguimiento de tus solicitudes de servicio.</li>
                <li><Icono d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M9.5 10l1.8 1.8L15 8" />Registro de llegada del técnico a tu taller.</li>
                <li><Icono d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M9 4v16 M15 4v9" /><span>Avisos en tu tablero de Trello<span className="pronto">Pronto</span></span></li>
              </ul>
              <div className="botones"><a className="btn btn-ocre" href="https://os.ocre.mx">Entrar a OCRE OS</a></div>
            </div>

            <div className="diagrama-caja">
              <div className="diagrama" role="img" aria-label="Tu taller solicita un servicio en OCRE OS, el técnico lo atiende, el reporte queda en tu historial y el aviso llega a Trello.">
                <svg width="600" height="470" viewBox="0 0 600 470" aria-hidden="true">
                  <path className="flujo" d="M150 96 C 230 96, 230 235, 300 235" />
                  <path className="flujo" d="M300 235 C 370 235, 370 96, 452 96" />
                  <path className="flujo inverso" d="M300 235 C 230 235, 230 374, 150 374" />
                  <path className="flujo" d="M300 235 C 370 235, 370 374, 452 374" />
                </svg>
                <span className="paquete p1" /><span className="paquete p2" /><span className="paquete p3" />
                <div className="nodo" style={{ left: 0, top: 50 }}><b>Tu taller</b><span>Solicita un servicio</span></div>
                <div className="nodo" style={{ left: 410, top: 50 }}><b>Técnico OCRE</b><span>Recibe la orden y llega</span></div>
                <div className="nodo" style={{ left: 0, top: 330 }}><b>Reporte</b><span>Queda en tu historial</span></div>
                <div className="nodo" style={{ left: 410, top: 330 }}><b>Trello</b><span>Te avisa del avance</span></div>
                <div className="centro"><Simbolo alto={44} /><span>OCRE OS</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="claro">
          <div className="contenedor seccion ct-rejilla">
            <div className="ct-texto">
              <h2 className="titulo">Cuéntanos qué necesitas producir.</h2>
              <p className="bajada" style={{ maxWidth: '30em' }}>Te respondemos en horario de atención con una propuesta o una fecha de visita.</p>
              <div className="telefonos">
                <a href="tel:+529989899717">998 989 9717</a>
                <a href="tel:+529982123429">998 212 3429</a>
              </div>
              <div className="ct-datos">
                <div><span className="etiqueta">Correo</span><a className="valor" href="mailto:soporte@ocre.mx">soporte@ocre.mx</a></div>
                <div><span className="etiqueta">Ubicación</span><span className="valor">Mérida, Yucatán</span></div>
                <div><span className="etiqueta">Horario</span><span className="valor" style={{ fontSize: 16, fontWeight: 500 }}>Lun a vie, 9:00 a 18:00<br />Sábado, 9:00 a 14:00</span></div>
                <div><span className="etiqueta">WhatsApp</span><a className="valor" href="https://wa.me/529982123429">Escríbenos</a></div>
              </div>
            </div>
            <Contacto />
          </div>
        </section>
      </main>

      <footer className="pie">
        <div className="contenedor pie-fila">
          <div className="pie-marca">
            <a href="#inicio" className="marca" aria-label="OCRE Tecnologías, inicio">
              <Simbolo alto={30} />
              <span className="marca-texto" style={{ fontSize: 27 }}>OCRE</span>
            </a>
            <p>Equipo láser, CNC, plotters y robótica para la industria gráfica, con servicio técnico propio.</p>
          </div>
          <nav aria-label="Pie de página">
            <a href="#equipos">Equipos</a>
            <a href="#servicio">Servicio técnico</a>
            <a href="https://os.ocre.mx">OCRE OS</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>
        <div className="contenedor pie-legal">© 2026 OCRE Tecnologías</div>
      </footer>
    </>
  );
}

function Icono({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#C98A2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
