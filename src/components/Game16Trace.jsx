import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TRACE_SHAPES } from '../data/gameData';
import { FEEDBACK } from '../data/voice';
import { shuffle } from '../utils/shuffle';
import { DEFAULT_ROUNDS } from '../constants/games';
import { useGameFeedback } from '../hooks/useGameFeedback';
import GameHeader from './GameHeader';
import Celebration from './Celebration';
import GameFinish from './GameFinish';

const BG = 'linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)';
const HIT_RADIUS = 24;
const VB_W = 200;
const VB_H = 180;

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

export default function Game16Trace({ onBack, onHome }) {
  const { speak, preload, showCelebration, handleCorrect } = useGameFeedback();
  const [replayKey, setReplayKey] = useState(0);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [nextPoint, setNextPoint] = useState(0);
  const [strokes, setStrokes] = useState([]);
  const svgRef = useRef(null);
  const drawingRef = useRef(false);

  const shapes = useMemo(
    () => shuffle(TRACE_SHAPES).slice(0, DEFAULT_ROUNDS),
    [replayKey],
  );
  const shape = shapes[shapeIndex];

  const resetRound = useCallback(() => {
    setNextPoint(0);
    setStrokes([]);
  }, []);

  useEffect(() => { preload([FEEDBACK.correct.audio]); }, [preload]);
  useEffect(() => {
    resetRound();
    const timer = setTimeout(() => speak(shape.question), 400);
    return () => clearTimeout(timer);
  }, [shapeIndex, shape, speak, resetRound]);

  const toSvgCoords = (event) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const touch = event.touches?.[0] ?? event.changedTouches?.[0] ?? event;
    return {
      x: ((touch.clientX - rect.left) / rect.width) * VB_W,
      y: ((touch.clientY - rect.top) / rect.height) * VB_H,
    };
  };

  const checkPoint = useCallback((x, y) => {
    setNextPoint((prev) => {
      const target = shape.points[prev];
      if (!target || dist(x, y, target[0], target[1]) > HIT_RADIUS) return prev;

      const newNext = prev + 1;
      if (newNext >= shape.points.length) {
        handleCorrect(() => {
          if (shapeIndex + 1 >= shapes.length) setIsFinished(true);
          else setShapeIndex((i) => i + 1);
        });
      }
      return newNext;
    });
  }, [shape, shapeIndex, shapes.length, handleCorrect]);

  const handleStart = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    const { x, y } = toSvgCoords(e);
    setStrokes((s) => [...s, [{ x, y }]]);
    checkPoint(x, y);
  };

  const handleMove = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const { x, y } = toSvgCoords(e);
    setStrokes((s) => {
      const copy = [...s];
      const last = [...copy[copy.length - 1], { x, y }];
      copy[copy.length - 1] = last;
      return copy;
    });
    checkPoint(x, y);
  };

  const handleEnd = () => {
    drawingRef.current = false;
  };

  if (isFinished) {
    return (
      <GameFinish
        bgGradient={BG}
        color="#6C5CE7"
        message="Bé vẽ theo nét giỏi lắm!"
        onReplay={() => { setShapeIndex(0); setReplayKey((k) => k + 1); setIsFinished(false); }}
        onBack={onBack}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="screen game-trace" style={{ '--screen-bg': BG }}>
      <GameHeader onBack={onBack} title={`✏️ ${shape.name}`} progress={`${shapeIndex + 1}/${shapes.length}`} />
      <p className="game-hint">Vẽ qua các chấm tròn nhé!</p>
      <svg
        ref={svgRef}
        className="game-trace__svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        <rect width={VB_W} height={VB_H} className="game-trace__bg" />
        {strokes.map((stroke, si) => (
          <polyline
            key={si}
            points={stroke.map((p) => `${p.x},${p.y}`).join(' ')}
            className="trace-line"
          />
        ))}
        {shape.points.map(([px, py], i) => (
          <g key={i}>
            <circle
              cx={px}
              cy={py}
              r={i < nextPoint ? 5 : 9}
              className={
                i < nextPoint
                  ? 'trace-dot trace-dot--done'
                  : i === nextPoint
                    ? 'trace-dot trace-dot--active'
                    : 'trace-dot'
              }
            />
            <text x={px} y={py - 12} textAnchor="middle" className="trace-dot__num">{i + 1}</text>
          </g>
        ))}
      </svg>
      <Celebration show={showCelebration} />
    </div>
  );
}
