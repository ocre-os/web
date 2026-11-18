import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCRE',
  description: 'OCRE — mantenimiento y servicios técnicos para equipos industriales.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
