import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Index from './Index';
import AuthPage from './AuthPage'; // Import the new auth component
import Dashboard from './Dashboard';
import Marketplace from './Marketplace';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      
        <Route index element={<Index />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="marketplace" element={<Marketplace />} />
      </Route>
      
      <Route path="/Authpage" element={<AuthPage />} />
    </Routes>
  );
};

export default App;