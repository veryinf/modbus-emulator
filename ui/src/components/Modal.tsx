import { XCircle } from 'lucide-react';
import { useState, useEffect, useImperativeHandle, useRef } from 'react';

type ModalAction = {
  open(title: string): void;
  close(): void;
};

type ModalProps = {
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function useModal() {
  const modalRef = useRef<ModalAction>(null);

  const Modal = function (props: ModalProps) {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
      if (visible) {
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            setVisible(false);
          }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
      }
    }, [visible]);

    useImperativeHandle(modalRef, () => ({
      open: (title: string) => {
        setTitle(title);
        setVisible(true);
      },
      close: () => {
        setVisible(false);
      },
    }));

    if (!visible) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} onClick={() => setVisible(false)}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button type="button" className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setVisible(false)}>
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">{props.children}</div>

          {props.actions && <div className="flex justify-end gap-2 p-5 border-t border-gray-200">{props.actions}</div>}
        </div>
      </div>
    );
  };
  return { Modal, modalRef };
}
