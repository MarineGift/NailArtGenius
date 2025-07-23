import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  totalCount: number;
}

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  totalCount
}) => {
  if (!isOpen) {
    return null;
  }

  console.log('AdminModal rendering with:', { isOpen, title, dataLength: data.length, totalCount });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] w-full overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-bold text-gray-900">
            {title} - 상세 보기
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            총 개수: {totalCount} | 로드된 데이터: {data.length}개
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-gray-800">데이터 목록</h3>
          {data.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.slice(0, 20).map((item, index) => (
                <div key={index} className="bg-white p-3 rounded border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">이름:</span>{' '}
                      <span className="text-gray-900">
                        {item.name || item.customerName || `항목 ${index + 1}`}
                      </span>
                    </div>
                    {item.phoneNumber && (
                      <div>
                        <span className="font-medium text-gray-700">전화:</span>{' '}
                        <span className="text-gray-900">{item.phoneNumber}</span>
                      </div>
                    )}
                    {item.email && (
                      <div>
                        <span className="font-medium text-gray-700">이메일:</span>{' '}
                        <span className="text-gray-900">{item.email}</span>
                      </div>
                    )}
                    {item.appointmentDate && (
                      <div>
                        <span className="font-medium text-gray-700">예약일:</span>{' '}
                        <span className="text-gray-900">
                          {new Date(item.appointmentDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {item.category && (
                      <div>
                        <span className="font-medium text-gray-700">카테고리:</span>{' '}
                        <span className="text-gray-900">{item.category}</span>
                      </div>
                    )}
                    {item.totalSpent && (
                      <div>
                        <span className="font-medium text-gray-700">총 지출:</span>{' '}
                        <span className="text-gray-900">₩{item.totalSpent}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {data.length > 20 && (
                <p className="text-gray-500 text-center py-2 italic">
                  ... 그리고 {data.length - 20}개 더 있습니다
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">데이터가 없습니다.</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;