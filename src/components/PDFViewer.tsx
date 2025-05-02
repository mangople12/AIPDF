'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './PDFViewer.module.css';
import { PDFObject, PDFHighlight } from '../types/pdf';
import PDFHighlightComponent from './PDFHighlight';
import { parseCSVCoordinates, groupCoordinatesByPage } from '../utils/csvParser';

interface PageData {
  id: number;
  imageUrl: string;
  objects: PDFObject[];
}

// CSV 데이터를 전역 상태로 관리
let globalCSVData: Map<number, PDFObject[]> = new Map();

interface PDFViewerProps {
  onObjectSelect: (object: PDFObject | null) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ onObjectSelect }) => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewBox, setViewBox] = useState<{ minX: number; minY: number; maxX: number; maxY: number; canvasWidth: number; canvasHeight: number } | null>(null);
  const [highlights, setHighlights] = useState<PDFHighlight[]>([]);
  const [selectedObject, setSelectedObject] = useState<PDFObject | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentPageData = pages.find(p => p.id === currentPage);
    if (currentPageData) {
      setHighlights(
        currentPageData.objects.map(obj => ({
          object: obj,
          isHovered: false,
          isSelected: selectedObject?.id === obj.id,
        }))
      );
    }
  }, [currentPage, selectedObject, pages]);

  useEffect(() => {
    const handleRefClick = (event: CustomEvent<{ pageId: number; objectId: number }>) => {
      const { pageId, objectId } = event.detail;
      setCurrentPage(pageId);
      
      const pageData = pages.find(p => p.id === pageId);
      if (pageData) {
        const targetObject = pageData.objects.find(obj => obj.id === objectId);
        if (targetObject) {
          setSelectedObject(targetObject);
          onObjectSelect(targetObject);
        }
      }
    };

    window.addEventListener('refClick', handleRefClick as EventListener);
    return () => {
      window.removeEventListener('refClick', handleRefClick as EventListener);
    };
  }, [pages, onObjectSelect]);

  const handleObjectHover = (objectId: number, isHovered: boolean) => {
    setHighlights(prev =>
      prev.map(highlight =>
        highlight.object.id === objectId
          ? { ...highlight, isHovered }
          : highlight
      )
    );
  };

  const handleObjectClick = (object: PDFObject) => {
    setSelectedObject(object);
    onObjectSelect(object);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newPageId = pages.length + 1;
      const newPage: PageData = {
        id: newPageId,
        imageUrl,
        objects: globalCSVData.get(newPageId) || [] // 전역 CSV 데이터에서 해당 페이지의 객체 가져오기
      };
      
      setPages(prev => [...prev, newPage]);
      setCurrentPage(newPage.id);
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const coordinates = parseCSVCoordinates(text);
      const pageMap = groupCoordinatesByPage(coordinates);

      // 전역 CSV 데이터 업데이트
      globalCSVData = new Map();
      pageMap.forEach((coords, pageId) => {
        globalCSVData.set(pageId, coords.map(coord => ({
          id: coord.objectId,
          page: pageId,
          x1: coord.x1,
          y1: coord.y1,
          x2: coord.x2,
          y2: coord.y2,
          p1ref: coord.p1ref,
          p2ref: coord.p2ref,
          p3ref: coord.p3ref,
          p4ref: coord.p4ref,
          p5ref: coord.p5ref
        })));
      });

      // 현재 존재하는 페이지들의 객체 업데이트
      setPages(prev => prev.map(page => {
        const pageObjects = globalCSVData.get(page.id) || [];
        return {
          ...page,
          objects: pageObjects
        };
      }));
    } catch (error) {
      console.error('CSV 파일 처리 중 오류 발생:', error);
      alert('CSV 파일 처리 중 오류가 발생했습니다.');
    }
  };

  const handleAddPage = () => {
    fileInputRef.current?.click();
  };

  const handleAddCSV = () => {
    csvInputRef.current?.click();
  };

  const changePage = (pageId: number) => {
    setCurrentPage(pageId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pdfContainer}>
        <div className={styles.pdfContent} ref={containerRef}>
          <div className={styles.pageContainer}>
            {pages.length > 0 ? (
              <div className={styles.imageWrapper} ref={imageRef}>
                <Image
                  src={pages[currentPage - 1].imageUrl}
                  alt={`Page ${currentPage}`}
                  layout="responsive"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '90vw',
                    maxHeight: 'calc(100vh - 120px)',
                    objectFit: 'contain'
                  }}
                  onLoadingComplete={(target) => {
                    if (imageRef.current) {
                      const rect = imageRef.current.getBoundingClientRect();
                      setViewBox({
                        minX: 0,
                        minY: 0,
                        maxX: target.naturalWidth,
                        maxY: target.naturalHeight,
                        canvasWidth: rect.width,
                        canvasHeight: rect.height
                      });
                    }
                  }}
                  className={styles.pageImage}
                  priority
                />
                {viewBox && highlights.map(({ object, isHovered, isSelected }) => (
                  <PDFHighlightComponent
                    key={object.id}
                    object={object}
                    viewBox={viewBox}
                    isHovered={isHovered}
                    isSelected={isSelected}
                    onMouseEnter={() => handleObjectHover(object.id, true)}
                    onMouseLeave={() => handleObjectHover(object.id, false)}
                    onClick={() => handleObjectClick(object)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>페이지를 추가해주세요</p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.pageButtons}>
            {pages.map(page => (
              <button
                key={page.id}
                className={`${styles.pageButton} ${currentPage === page.id ? styles.activePage : ''}`}
                onClick={() => changePage(page.id)}
              >
                {page.id}
              </button>
            ))}
          </div>
          <div className={styles.actionButtons}>
            <button
              className={styles.addButton}
              onClick={handleAddPage}
            >
              페이지 추가
            </button>
            <button
              className={styles.addButton}
              onClick={handleAddCSV}
            >
              CSV 추가
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
            title="이미지 파일 선택"
            aria-label="이미지 파일 선택"
          />
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            ref={csvInputRef}
            style={{ display: 'none' }}
            title="CSV 파일 선택"
            aria-label="CSV 파일 선택"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer; 