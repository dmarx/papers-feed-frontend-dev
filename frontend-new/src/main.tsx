// frontend-new/src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Import Mantine styles
import '@mantine/core/styles.css';

// Create a client for React Query
const queryClient = new QueryClient();

// Create Mantine theme (required for v7)
const theme = createTheme({
  // Theme customization can be added here if needed
});

// Render the app
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
