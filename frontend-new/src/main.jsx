// frontend-new/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';

// Import Mantine styles
import '@mantine/core/styles.css';

// Create a client for React Query
const queryClient = new QueryClient();

// Render the app
const root = createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <App />
    </MantineProvider>
  </QueryClientProvider>
);
