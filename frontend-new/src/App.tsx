// frontend-new/src/App.tsx
import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Home } from './pages/Home';
import './index.css';

const App: React.FC = () => {
  // Create basic Mantine theme
  const theme = createTheme({
    primaryColor: 'blue',
    defaultRadius: 'md'
  });
  
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <Home />
    </MantineProvider>
  );
};

export default App;
