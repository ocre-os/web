import type { Metadata, Viewport } from 'next';
import './globals.css';

const descripcion =
  'Venta, instalación y servicio técnico de equipo láser, router CNC, plotters y brazos robóticos para la industria gráfica, desde Mérida, Yucatán.';

export const metadata: Metadata = {
  metadataBase: new URL('https://ocre.mx'),
  title: 'OCRE Tecnologías | Láser, CNC, plotters y servicio técnico',
  description: descripcion,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://ocre.mx/',
    siteName: 'OCRE Tecnologías',
    title: 'OCRE Tecnologías',
    description: descripcion,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Símbolo de OCRE cortado con láser en una placa de aluminio' }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#1E2226' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <head>
        <link rel="preload" href="/fonts/archivo-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
