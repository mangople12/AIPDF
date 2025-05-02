'use client';

import React from 'react';
import styles from './Layout.module.css';
import ObjectInfo from './ObjectInfo';
import { PDFObject } from '../types/pdf';

interface LayoutProps {
  children: React.ReactNode;
  selectedObject?: PDFObject | null;
  onRefClick?: (pageId: number, objectId: number) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, selectedObject, onRefClick }) => {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.pdfViewer}>
          <h2 className={styles.title}>PDF 뷰어</h2>
          {children}
        </div>
        {/* <div className={styles.pageNavigator}>
          <h2 className={styles.title}>페이지 네비게이터</h2>
        </div> */}
      </div>
      <div className={styles.rightSidebar}>
        <h2 className={styles.title}>객체정보</h2>
        <ObjectInfo selectedObject={selectedObject} onRefClick={onRefClick} />
      </div>
    </div>
  );
};

export default Layout; 