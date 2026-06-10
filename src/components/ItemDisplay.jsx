import ShapeDisplay from './ShapeDisplay';

export default function ItemDisplay({ item, size = 'large' }) {
  const isColor = item.type === 'color';
  const isShape = item.type === 'shape';
  const shapeSize = size === 'small' ? 48 : size === 'medium' ? 64 : 80;
  const emojiClass = size === 'small'
    ? 'item-display__emoji item-display__emoji--small'
    : size === 'medium'
      ? 'item-display__emoji item-display__emoji--medium'
      : 'item-display__emoji';

  if (isColor) {
    const dotSize = size === 'small' ? 44 : size === 'medium' ? 56 : 72;
    return (
      <span
        className="item-display__color"
        style={{
          backgroundColor: item.color,
          width: dotSize,
          height: dotSize,
        }}
      />
    );
  }

  if (isShape) {
    return <ShapeDisplay shape={item.shape} size={shapeSize} color={item.color} />;
  }

  return <span className={emojiClass}>{item.emoji}</span>;
}
