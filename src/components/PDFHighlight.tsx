'use client';

import React from 'react';
import { PDFObject } from '../types/pdf';
import styles from './PDFHighlight.module.css';

interface PDFHighlightProps {
  object: PDFObject;
  viewBox: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    canvasWidth: number;
    canvasHeight: number;
  };
  isHovered: boolean;
  isSelected: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const PDFHighlight: React.FC<PDFHighlightProps> = ({
  object,
  viewBox,
  isHovered,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  // PDF 좌표를 canvas 크기에 맞게 스케일링
  const scaleX = viewBox.canvasWidth / viewBox.maxX;  // 실제 이미지 너비로 스케일링
  const scaleY = viewBox.canvasHeight / viewBox.maxY;  // 실제 이미지 높이로 스케일링

  // 좌표 변환 (canvas 내부 좌표 기준)
  const x = (object.x1 - viewBox.minX) * scaleX;
  const y = (object.y1 - viewBox.minY) * scaleY;
  const width = (object.x2 - object.x1) * scaleX;
  const height = (object.y2 - object.y1) * scaleY;

  const style = {
    position: 'absolute' as const,
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    transform: 'translateZ(0)', // 하드웨어 가속 활성화
  };

  return (
    <div
      className={`${styles.highlight} ${isHovered ? styles.hovered : ''} ${
        isSelected ? styles.selected : ''
      }`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className={styles.tooltip}>
        <div>ID: {object.id}</div>
        <div>
          원본 좌표: ({object.x1}, {object.y1}) - 
          ({object.x2}, {object.y2})
        </div>
        <div>
          변환 좌표: ({Math.round(x)}, {Math.round(y)}) - 
          ({Math.round(x + width)}, {Math.round(y + height)})
        </div>
        <div>
          스케일: X({scaleX.toFixed(4)}), Y({scaleY.toFixed(4)})
        </div>
        {(object.p1ref || object.p2ref || object.p3ref || object.p4ref || object.p5ref) && (
          <div>
            참조:
            {object.p1ref && <span> P1:{object.p1ref}</span>}
            {object.p2ref && <span> P2:{object.p2ref}</span>}
            {object.p3ref && <span> P3:{object.p3ref}</span>}
            {object.p4ref && <span> P4:{object.p4ref}</span>}
            {object.p5ref && <span> P5:{object.p5ref}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFHighlight; 