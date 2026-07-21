interface HexagonProps {
  className?: string;
  fill?: string;
}

/**
 * A single hexagon cell — the app's visual signature, echoing Koncepthive's
 * honeycomb mark. Used behind dashboard stat icons and as a priority marker.
 */
export function Hexagon({ className = 'w-10 h-10', fill = '#F0A500' }: HexagonProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon points="50,3 95,26 95,74 50,97 5,74 5,26" fill={fill} />
    </svg>
  );
}
