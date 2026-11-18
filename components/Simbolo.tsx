// Símbolo OCRE: perforación, entrada tangente y contorno hexagonal abierto.
type Props = { alto?: number; contorno?: string; acento?: string; className?: string };

export default function Simbolo({ alto = 26, contorno = '#F2F3F4', acento = '#C98A2B', className }: Props) {
  return (
    <svg viewBox="4 17 105 86" height={alto} width={(alto * 105) / 86} aria-hidden="true" className={className}>
      <circle cx="9.23" cy="95.94" r="4.6" fill={acento} />
      <path d="M9.23 95.94 H60" stroke={acento} strokeWidth="5" fill="none" />
      <path
        d="M60 95.94 H80.77 L101.5 60 L80.77 24.06 H39.23 L18.5 60 L29.88 79.77"
        stroke={contorno}
        strokeWidth="13"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
