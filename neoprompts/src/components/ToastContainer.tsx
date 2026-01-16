'use client';

import { useToast } from '@/contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast show align-items-center text-bg-${toast.type === 'success' ? 'success' : toast.type === 'error' ? 'danger' : toast.type === 'warning' ? 'warning' : 'primary'}`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">
              {toast.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => dismissToast(toast.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
}
