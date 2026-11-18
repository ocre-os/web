/** @type {import('next').NextConfig} */
const nextConfig = {
  // El hosting solo sirve archivos: todo se exporta como HTML estático.
  output: 'export',
  // /contacto -> /contacto/index.html (Apache lo sirve sin reglas extra).
  trailingSlash: true,
  // Sin servidor de Node no hay optimizador de imágenes.
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
