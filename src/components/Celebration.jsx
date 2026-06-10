import { motion } from 'framer-motion';

const COLORS = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#6C63FF', '#FD79A8', '#00B894'];

function Particle({ index }) {
  const angle = (index / 12) * Math.PI * 2;
  const distance = 80 + Math.random() * 60;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const color = COLORS[index % COLORS.length];
  const size = 12 + Math.random() * 16;

  return (
    <motion.span
      className="firework-particle"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: Math.random() > 0.5 ? '50%' : 4,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  );
}

export default function Celebration({ show }) {
  if (!show) return null;

  return (
    <div className="celebration" aria-hidden="true">
      <motion.div
        className="celebration__emoji"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: [0, 1.4, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        🎉
      </motion.div>
      <div className="fireworks">
        {Array.from({ length: 12 }, (_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>
      {Array.from({ length: 6 }, (_, i) => (
        <motion.span
          key={`star-${i}`}
          className="celebration__star"
          style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: 360 }}
          transition={{ duration: 1, delay: i * 0.1 }}
        >
          ✨
        </motion.span>
      ))}
    </div>
  );
}
