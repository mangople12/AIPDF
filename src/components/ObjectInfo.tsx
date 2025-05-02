import React from 'react';
import styles from './ObjectInfo.module.css';
import { PDFObject } from '../types/pdf';

interface ObjectInfoProps {
  selectedObject: PDFObject | null | undefined;
  onRefClick?: (pageId: number, objectId: number) => void;
}

const ObjectInfo: React.FC<ObjectInfoProps> = ({ selectedObject, onRefClick }) => {
  if (!selectedObject) {
    return (
      <div className={styles.emptyState}>
        객체를 선택해주세요
      </div>
    );
  }

  const parseRef = (ref: string | undefined) => {
    if (!ref) return null;
    const [pageId, objectId] = ref.split(':').map(Number);
    return { pageId, objectId };
  };

  const refs = [
    { key: 'p1ref', label: 'P1' },
    { key: 'p2ref', label: 'P2' },
    { key: 'p3ref', label: 'P3' },
    { key: 'p4ref', label: 'P4' },
    { key: 'p5ref', label: 'P5' },
  ].map(({ key, label }) => {
    const ref = selectedObject[key as keyof PDFObject] as string | undefined;
    const parsedRef = parseRef(ref);
    return { label, ref: parsedRef };
  }).filter(({ ref }) => ref !== null);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3>기본 정보</h3>
        <div className={styles.infoRow}>
          <span>ID:</span>
          <span>{selectedObject.id}</span>
        </div>
        <div className={styles.infoRow}>
          <span>좌표:</span>
          <span>
            ({selectedObject.x1}, {selectedObject.y1}) - ({selectedObject.x2}, {selectedObject.y2})
          </span>
        </div>
      </div>

      {refs.length > 0 && (
        <div className={styles.section}>
          <h3>Ref</h3>
          <div className={styles.refList}>
            {refs.map(({ label, ref }) => (
              <button
                key={label}
                className={styles.refButton}
                onClick={() => ref && onRefClick?.(ref.pageId, ref.objectId)}
              >
                {label}: 페이지 {ref?.pageId}의 ID {ref?.objectId}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectInfo; 