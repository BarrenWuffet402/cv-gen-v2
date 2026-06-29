import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InputPage from './pages/InputPage';
import PreviewPage from './pages/PreviewPage';
import { CVData } from './types/cv';

const App: React.FC = () => {
  const [cv, setCV] = useState<CVData | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputPage onCVLoad={setCV} />} />
        <Route
          path="/preview"
          element={cv ? <PreviewPage cv={cv} onUpdate={setCV} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
