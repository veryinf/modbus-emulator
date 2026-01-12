import { Check, XCircle } from 'lucide-react';
import { useState, useEffect, useImperativeHandle, useRef } from 'react';

type ToastAction = {
  show(type: 'success' | 'error', text: string): void;
};

type ToastProps = {
  actionRef: React.RefObject<ToastAction | null>;
};

function Toast(props: ToastProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useImperativeHandle(props.actionRef, () => ({
    show: (type, text) => {
      setMessage({ type, text });
    },
  }));

  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
      {message.type === 'success' ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      <span className="text-sm">{message.text}</span>
    </div>
  );
}

export function useToast() {
  const toastRef = useRef<ToastAction>(null);
  const toast = () => <Toast actionRef={toastRef} />;
  return { Toast: toast, toastRef };
}
