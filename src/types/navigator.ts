export interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PDFObject {
  id: string;
  type: string;
  coordinates: Coordinates;
  description?: string;
  page: number;
}

export interface NavigatorItem {
  id: string;
  name: string;
  type: 'regular' | 'reference' | 'linked';
  page: number;
  coordinates?: Coordinates;
  description?: string;
}

export interface ObjectHighlight {
  object: PDFObject;
  isHovered: boolean;
  isSelected: boolean;
} 