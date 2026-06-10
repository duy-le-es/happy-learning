import { motion } from 'framer-motion';
import ItemDisplay from './ItemDisplay';

export default function OptionButton({ item, onSelect, disabled, state }) {
  return (
    <motion.button
      type="button"
      className={`option-button ${state ? `option-button--${state}` : ''}`}
      onClick={() => onSelect(item)}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.9 }}
      animate={
        state === 'wrong'
          ? { x: [0, -8, 8, -8, 8, 0], transition: { duration: 0.4 } }
          : state === 'correct'
            ? { scale: [1, 1.15, 1], transition: { duration: 0.4 } }
            : {}
      }
    >
      <ItemDisplay item={item} size="large" />
    </motion.button>
  );
}
