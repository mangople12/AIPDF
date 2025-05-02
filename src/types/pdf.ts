export interface PDFObject {
  id: number;
  page: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p1ref?: string;
  p2ref?: string;
  p3ref?: string;
  p4ref?: string;
  p5ref?: string;
}

export interface PDFHighlight {
  object: PDFObject;
  isHovered: boolean;
  isSelected: boolean;
}

export interface CSVCoordinate {
  pageId: number;
  objectId: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p1ref?: string;
  p2ref?: string;
  p3ref?: string;
  p4ref?: string;
  p5ref?: string;
} 