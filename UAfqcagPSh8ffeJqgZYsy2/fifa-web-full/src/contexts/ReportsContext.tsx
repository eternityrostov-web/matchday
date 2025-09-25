import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Report } from '../types';

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Report) => void;
  updateReport: (id: string, report: Report) => void;
  deleteReport: (id: string) => void;
  getReport: (id: string) => Report | undefined;
  loading: boolean;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

interface ReportsProviderProps {
  children: ReactNode;
}

export function ReportsProvider({ children }: ReportsProviderProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load reports from localStorage on mount
    try {
      const stored = localStorage.getItem('fifa-reports');
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Save reports to localStorage whenever reports change
    try {
      localStorage.setItem('fifa-reports', JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving reports:', error);
    }
  }, [reports]);

  const addReport = (report: Report) => {
    setReports(prev => [...prev, report]);
  };

  const updateReport = (id: string, updatedReport: Report) => {
    setReports(prev => prev.map(report => 
      report.id === id ? updatedReport : report
    ));
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const getReport = (id: string) => {
    return reports.find(report => report.id === id);
  };

  return (
    <ReportsContext.Provider value={{
      reports,
      addReport,
      updateReport,
      deleteReport,
      getReport,
      loading
    }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}