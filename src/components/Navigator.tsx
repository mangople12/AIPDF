import React from 'react';
import type { PDFObject } from '../types/navigator';

interface NavigatorProps {
  objects: PDFObject[];
  selectedObject?: PDFObject;
  onObjectSelect: (object: PDFObject) => void;
}

const Navigator: React.FC<NavigatorProps> = ({
  objects,
  selectedObject,
  onObjectSelect,
}) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Object List */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">객체 목록</h2>
          <div className="space-y-2">
            {objects.map((object) => (
              <button
                key={object.id}
                onClick={() => onObjectSelect(object)}
                className={`w-full text-left p-3 rounded-md transition-colors duration-200
                  ${selectedObject?.id === object.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{object.id}</div>
                  <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {object.type}
                  </div>
                </div>
                {object.description && (
                  <div className="text-sm text-gray-500 mt-1">
                    {object.description}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  페이지 {object.page}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Object Detail */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        {selectedObject ? (
          <div className="space-y-2">
            <div className="font-medium text-gray-900">선택된 객체</div>
            <div className="text-sm">
              <div>ID: {selectedObject.id}</div>
              <div>타입: {selectedObject.type}</div>
              <div>페이지: {selectedObject.page}</div>
              <div>좌표: ({selectedObject.coordinates.x}, {selectedObject.coordinates.y})</div>
              <div>크기: {selectedObject.coordinates.width} x {selectedObject.coordinates.height}</div>
              {selectedObject.description && (
                <div className="mt-2">
                  <div className="font-medium">설명:</div>
                  <div className="text-gray-600">{selectedObject.description}</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            객체를 선택하면 상세 정보가 표시됩니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigator; 