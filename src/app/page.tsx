'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import PDFViewer from '../components/PDFViewer';
import { PDFObject } from '../types/pdf';

export default function Home() {
  const [selectedObject, setSelectedObject] = useState<PDFObject | null>(null);

  const handleRefClick = (pageId: number, objectId: number) => {
    // PDFViewer의 handleRefClick 함수를 호출하기 위한 이벤트 발생
    const event = new CustomEvent('refClick', { detail: { pageId, objectId } });
    window.dispatchEvent(event);
  };

  return (
    <Layout selectedObject={selectedObject} onRefClick={handleRefClick}>
      <PDFViewer onObjectSelect={setSelectedObject} />
    </Layout>
  );
}
