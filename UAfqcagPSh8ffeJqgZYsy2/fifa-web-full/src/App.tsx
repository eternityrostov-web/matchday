
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ReportsProvider } from './contexts/ReportsContext';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';
import Reports from './pages/Reports';
import ReportDetails from './pages/ReportDetails';
import Statistics from './pages/Statistics';
import About from './pages/About';

function App() {
  return (
    <ReportsProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateReport />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </Router>
    </ReportsProvider>
  );
}

export default App;
