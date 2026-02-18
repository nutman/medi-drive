import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ServiceLogsPage from './pages/ServiceLogsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/service-logs" replace />} />
        <Route path="/service-logs" element={<ServiceLogsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
