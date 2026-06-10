import { motion } from 'framer-motion';

export default function BigButton({ children, onClick, color, emoji, subtitle, disabled, size = 'large' }) {
  return (
    <motion.button
      type="button"
      className={`big-button big-button--${size}`}
      style={{ '--btn-color': color }}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {emoji && <span className="big-button__emoji">{emoji}</span>}
      <span className="big-button__label">{children}</span>
      {subtitle && <span className="big-button__subtitle">{subtitle}</span>}
    </motion.button>
  );
}
