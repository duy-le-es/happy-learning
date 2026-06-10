export default function ShapeDisplay({ shape, size = 80, color = '#6C63FF' }) {
  const style = { width: size, height: size };

  switch (shape) {
    case 'circle':
      return (
        <span
          className="shape-display shape-display--circle"
          style={{ ...style, backgroundColor: color, borderRadius: '50%' }}
        />
      );
    case 'square':
      return (
        <span
          className="shape-display shape-display--square"
          style={{ ...style, backgroundColor: color, borderRadius: 8 }}
        />
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,10 95,90 5,90" fill={color} />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <polygon
            points="50,5 61,38 95,38 68,59 79,92 50,72 21,92 32,59 5,38 39,38"
            fill={color}
          />
        </svg>
      );
    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <path
            d="M50,88 C20,60 5,45 5,28 C5,14 15,5 28,5 C38,5 46,12 50,20 C54,12 62,5 72,5 C85,5 95,14 95,28 C95,45 80,60 50,88Z"
            fill={color}
          />
        </svg>
      );
    case 'rectangle':
      return (
        <span
          className="shape-display shape-display--rectangle"
          style={{
            width: size * 1.4,
            height: size * 0.7,
            backgroundColor: color,
            borderRadius: 6,
          }}
        />
      );
    case 'oval':
      return (
        <span
          className="shape-display shape-display--oval"
          style={{
            width: size * 1.3,
            height: size * 0.75,
            backgroundColor: color,
            borderRadius: '50%',
          }}
        />
      );
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,5 95,50 50,95 5,50" fill={color} />
        </svg>
      );
    case 'pentagon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,5 95,38 78,90 22,90 5,38" fill={color} />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill={color} />
        </svg>
      );
    case 'cross':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <rect x="35" y="10" width="30" height="80" fill={color} rx="4" />
          <rect x="10" y="35" width="80" height="30" fill={color} rx="4" />
        </svg>
      );
    case 'arrow':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,5 95,55 70,55 70,95 30,95 30,55 5,55" fill={color} />
        </svg>
      );
    case 'semicircle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <path d="M5,75 A45,45 0 0,1 95,75 Z" fill={color} />
        </svg>
      );
    case 'trapezoid':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="25,20 75,20 95,85 5,85" fill={color} />
        </svg>
      );
    case 'ring':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="18" />
        </svg>
      );
    case 'crescent':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <path
            d="M70,15 A40,40 0 1,0 70,85 A30,30 0 1,1 70,15Z"
            fill={color}
          />
        </svg>
      );
    case 'plus':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <rect x="40" y="15" width="20" height="70" fill={color} rx="4" />
          <rect x="15" y="40" width="70" height="20" fill={color} rx="4" />
        </svg>
      );
    case 'line':
      return (
        <span
          className="shape-display shape-display--line"
          style={{
            width: size * 1.2,
            height: size * 0.15,
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      );
    case 'parallelogram':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="25,20 95,20 75,80 5,80" fill={color} />
        </svg>
      );
    case 'octagon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill={color} />
        </svg>
      );
    default:
      return (
        <span
          className="shape-display"
          style={{ ...style, backgroundColor: color, borderRadius: 8 }}
        />
      );
  }
}
