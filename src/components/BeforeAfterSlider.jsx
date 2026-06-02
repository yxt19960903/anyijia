import { useRef, useState } from 'react';
import './BeforeAfterSlider.css';

export default function BeforeAfterSlider({ before, after, beforeLabel = '原图', afterLabel = '效果图' }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => isDragging && handleMove(e.clientX);

  return (
    <div
      ref={containerRef}
      className="before-after-slider"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="slider-after">
        <img src={after} alt="after" draggable={false} />
        <span className="slider-label">{afterLabel}</span>
      </div>
      <div className="slider-before" style={{ width: `${position}%` }}>
        <img src={before} alt="before" draggable={false} />
        <span className="slider-label">{beforeLabel}</span>
      </div>
      <div
        className="slider-handle"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
      >
        <div className="slider-line" />
        <div className="slider-circle">
          <span className="slider-arrows">⟷</span>
        </div>
      </div>
    </div>
  );
}