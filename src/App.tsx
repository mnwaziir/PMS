import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './app-routes';

const App: React.FC = () => {
  return (
    <>
      <Toaster />
      <AppRoutes />
    </>
  );
};

export default App;
