// frontend-new/src/App.tsx
import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Home } from './pages/Home';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

// Create an enhanced theme for Mantine
const theme = createTheme({
  // Core theme settings
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  defaultRadius: 'md',
  
  // Component-specific styles
  components: {
    // Paper component defaults
    Paper: {
      defaultProps: {
        p: 'md',
        shadow: 'xs',
        radius: 'md',
      }
    },
    
    // Table component styles
    Table: {
      styles: {
        root: {
          '& tbody tr:hover': {
            backgroundColor: 'var(--mantine-color-blue-0)',
          },
        }
      }
    },
    
    // Badge component styles
    Badge: {
      styles: {
        root: {
          textTransform: 'none',
        }
      }
    },
    
    // Modal component styles
    Modal: {
      styles: {
        header: {
          marginBottom: '0.5rem',
        }
      }
    }
  }
});

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <Home />
    </MantineProvider>
  );
};

export default App;
