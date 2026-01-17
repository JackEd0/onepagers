'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { DatabaseProvider } from '@/lib/database';

export function Providers({ children }: { children: ReactNode }) {
  // Initialize Bootstrap JS on client side
  useEffect(() => {
    // @ts-expect-error Bootstrap JS import
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <ToastProvider>
      <DatabaseProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </DatabaseProvider>
    </ToastProvider>
  );
}
