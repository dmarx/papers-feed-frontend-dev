// frontend-new/src/App.tsx
import React from 'react';
import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Home } from './pages/Home';

// Define custom colors
const myBlue: MantineColorsTuple = [
  '#e6f7ff', // 0
  '#bae7ff', // 1
  '#91d5ff', // 2
  '#69c0ff', // 3
  '#40a9ff', // 4
  '#1890ff', // 5
  '#096dd9', // 6
  '#0050b3', // 7
  '#003a8c', // 8
  '#002766', // 9
];

// Create enhanced Mantine theme
const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: myBlue,
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  defaultRadius: 'md',
  components: {
    Paper: {
      defaultProps: {
        p: 'md',
        shadow: 'xs',
      },
    },
    Container: {
      defaultProps: {
        size: 'xl',
      },
    },
    Table: {
      styles: {
        root: {
          '& tbody tr:hover': {
            backgroundColor: 'var(--mantine-color-blue-0)',
          },
        },
      },
    },
  },
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
