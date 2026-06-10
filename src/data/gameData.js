export const BASIC_COLORS = [
  { id: 'red', color: '#E74C3C', name: 'Đỏ' },
  { id: 'blue', color: '#3498DB', name: 'Xanh dương' },
  { id: 'yellow', color: '#F1C40F', name: 'Vàng' },
  { id: 'green', color: '#2ECC71', name: 'Xanh lá' },
  { id: 'orange', color: '#E67E22', name: 'Cam' },
  { id: 'purple', color: '#9B59B6', name: 'Tím' },
  { id: 'pink', color: '#FD79A8', name: 'Hồng' },
  { id: 'brown', color: '#A0522D', name: 'Nâu' },
];

export const ORDER_SEQUENCES = [
  { id: 'tree', title: 'Cây lớn', emojis: ['🌱', '🌿', '🌳'], question: 'Xếp từ bé đến lớn nhé!' },
  { id: 'chicken', title: 'Gà con', emojis: ['🥚', '🐣', '🐔'], question: 'Xếp đúng thứ tự nhé!' },
  { id: 'flower', title: 'Hoa nở', emojis: ['🌱', '🌷', '🌸'], question: 'Xếp từ bé đến lớn nhé!' },
  { id: 'butterfly', title: 'Bướm', emojis: ['🐛', '🦋', '🌸'], question: 'Xếp đúng thứ tự nhé!' },
  { id: 'rain', title: 'Mưa', emojis: ['☁️', '🌧️', '🌈'], question: 'Xếp đúng thứ tự nhé!' },
  { id: 'moon', title: 'Đêm', emojis: ['🌆', '🌙', '⭐'], question: 'Xếp đúng thứ tự nhé!' },
];

export const FEEDING_ROUNDS = [
  { id: 'cat', animal: '🐱', animalName: 'Mèo', correct: '🐟', options: ['🐟', '🌿', '🍌'] },
  { id: 'dog', animal: '🐶', animalName: 'Chó', correct: '🦴', options: ['🦴', '🍯', '🍎'] },
  { id: 'rabbit', animal: '🐰', animalName: 'Thỏ', correct: '🥕', options: ['🥕', '🐟', '🧀'] },
  { id: 'cow', animal: '🐮', animalName: 'Bò', correct: '🌿', options: ['🌿', '🍖', '🍬'] },
  { id: 'monkey', animal: '🐵', animalName: 'Khỉ', correct: '🍌', options: ['🍌', '🥛', '🍞'] },
  { id: 'bee', animal: '🐝', animalName: 'Ong', correct: '🍯', options: ['🍯', '🥩', '🍋'] },
  { id: 'horse', animal: '🐴', animalName: 'Ngựa', correct: '🌿', options: ['🌿', '🍫', '🍳'] },
  { id: 'bird', animal: '🐦', animalName: 'Chim', correct: '🌾', options: ['🌾', '🍕', '🍦'] },
];

export const EMOTIONS = [
  { id: 'happy', emoji: '😊', label: 'Vui', question: 'Bé đang vui phải không?' },
  { id: 'sad', emoji: '😢', label: 'Buồn', question: 'Bé đang buồn phải không?' },
  { id: 'angry', emoji: '😠', label: 'Giận', question: 'Bé đang giận phải không?' },
  { id: 'surprised', emoji: '😲', label: 'Ngạc nhiên', question: 'Bé đang ngạc nhiên phải không?' },
  { id: 'sleepy', emoji: '😴', label: 'Buồn ngủ', question: 'Bé đang buồn ngủ phải không?' },
  { id: 'love', emoji: '🥰', label: 'Yêu thương', question: 'Bé đang yêu thương phải không?' },
];

export const TRACE_SHAPES = [
  {
    id: 'line',
    name: 'Đường thẳng',
    question: 'Vẽ theo nét chấm nhé!',
    points: [[30, 100], [90, 100], [150, 100]],
  },
  {
    id: 'v',
    name: 'Chữ V',
    question: 'Vẽ theo nét chấm nhé!',
    points: [[40, 40], [100, 140], [160, 40]],
  },
  {
    id: 'zigzag',
    name: 'Zíc zắc',
    question: 'Vẽ theo nét chấm nhé!',
    points: [[30, 60], [80, 120], [130, 60], [180, 120]],
  },
  {
    id: 'circle',
    name: 'Vòng tròn',
    question: 'Vẽ theo nét chấm nhé!',
    points: [[100, 30], [150, 60], [160, 110], [130, 150], [70, 150], [40, 110], [50, 60], [100, 30]],
  },
  {
    id: 'house',
    name: 'Ngôi nhà',
    question: 'Vẽ theo nét chấm nhé!',
    points: [[50, 120], [50, 70], [100, 30], [150, 70], [150, 120], [50, 120]],
  },
  {
    id: 'wave',
    name: 'Sóng',
    question: 'Vẽ theo nét chấm nhé!',
    points: [[20, 90], [60, 50], [100, 90], [140, 50], [180, 90]],
  },
];

export const COLORING_SHAPES = [
  { id: 'apple', emoji: '🍎' },
  { id: 'star', emoji: '⭐' },
  { id: 'heart', emoji: '❤️' },
  { id: 'sun', emoji: '☀️' },
  { id: 'flower', emoji: '🌸' },
  { id: 'fish', emoji: '🐟' },
  { id: 'house', emoji: '🏠' },
  { id: 'car', emoji: '🚗' },
];
