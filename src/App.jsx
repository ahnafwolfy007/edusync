import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Index from './Index';
import AuthPage from './AuthPage'; // Import the new auth component
import Dashboard from './Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      
        <Route index element={<Index />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      
      <Route path="/Authpage" element={<AuthPage />} />
    </Routes>
  );
};

export default App;