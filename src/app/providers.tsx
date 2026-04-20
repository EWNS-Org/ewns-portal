'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/Redux/Store';
import { LoaderProvider } from '@/contexts/LoaderContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Loader from '@/components/common/Loader';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LoaderProvider>
        <AuthProvider>
          <Loader />
          <Toaster position="top-right" toastOptions={{ duration: 1000 }} />
          {children}
        </AuthProvider>
      </LoaderProvider>
    </Provider>
  );
}
