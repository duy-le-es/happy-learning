# Bé Học Thông Minh 🌈

Ứng dụng học tập tương tác cho trẻ 3 tuổi — thao tác đơn giản (chạm, chọn), ít chữ, nhiều hình ảnh và âm thanh khuyến khích.

## Trò chơi hiện có (MVP)

### Game 2: Chọn hình đúng theo câu hỏi ✅

- 5 chủ đề: Động vật, Trái cây, Phương tiện, Màu sắc, Hình dạng
- Đọc câu hỏi bằng giọng nói (Web Speech API)
- 3 lựa chọn mỗi câu, nút lớn ≥ 120px
- Đúng: pháo hoa + tiếng vỗ tay + "Giỏi lắm!"
- Sai: rung nhẹ + "Thử lại nhé!" + đọc lại câu hỏi
- Không giới hạn thời gian, không trừ điểm

### Sắp ra mắt

- Game 1: Tìm cặp giống nhau
- Game 3: Kéo thả vào đúng vị trí

## Công nghệ

- React + Vite
- Framer Motion (hiệu ứng)
- Howler + Web Audio (âm thanh)
- Web Speech API (đọc tiếng Việt)

## Chạy dự án

```bash
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

## Cấu trúc

```
src/
├── data/topics.js       # Dữ liệu chủ đề & câu hỏi
├── components/          # UI components
├── hooks/               # useSpeech, useSound
└── utils/shuffle.js     # Xáo trộn câu hỏi & đáp án
```

## Thêm câu hỏi mới

Chỉnh sửa `src/data/topics.js`:

```javascript
{
  id: 'cat',
  name: 'Mèo',
  emoji: '🐱',
  question: 'Con mèo ở đâu?'
}
```

## Lộ trình phát triển

1. **Tuần 1-2 (MVP)** — Game 2 hoàn chỉnh ✅
2. **Tuần 3-4** — Game 1 (Matching Pair) với 3 level
3. **Tuần 5-6** — Game 3 (Drag & Drop)
4. **Sau MVP** — Ảnh thật thay emoji, file âm thanh chuyên nghiệp, premium themes
