import { CSVCoordinate } from '../types/pdf';

export const parseCSVCoordinates = (csvContent: string): CSVCoordinate[] => {
  const lines = csvContent.split('\n');
  const coordinates: CSVCoordinate[] = [];

  // 헤더 라인 제외하고 처리
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // 페이지 헤더 라인 건너뛰기
    if (line.startsWith('page,id,')) continue;

    const [pageId, objectId, x1, y1, x2, y2, p1ref, p2ref, p3ref, p4ref, p5ref] = line.split(',');

    // 유효한 숫자 데이터만 처리
    if (!isNaN(parseInt(pageId)) && !isNaN(parseInt(objectId))) {
      coordinates.push({
        pageId: parseInt(pageId),
        objectId: parseInt(objectId),
        x1: parseInt(x1),
        y1: parseInt(y1),
        x2: parseInt(x2),
        y2: parseInt(y2),
        p1ref: p1ref || undefined,
        p2ref: p2ref || undefined,
        p3ref: p3ref || undefined,
        p4ref: p4ref || undefined,
        p5ref: p5ref || undefined,
      });
    }
  }

  return coordinates;
};

export const groupCoordinatesByPage = (coordinates: CSVCoordinate[]): Map<number, CSVCoordinate[]> => {
  const pageMap = new Map<number, CSVCoordinate[]>();
  
  coordinates.forEach(coord => {
    if (!pageMap.has(coord.pageId)) {
      pageMap.set(coord.pageId, []);
    }
    pageMap.get(coord.pageId)?.push(coord);
  });

  return pageMap;
}; 