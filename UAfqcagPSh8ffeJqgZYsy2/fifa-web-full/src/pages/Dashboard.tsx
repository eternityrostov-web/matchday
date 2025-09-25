import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../contexts/ReportsContext';

export default function Dashboard() {
  const { reports } = useReports();
  const [stats, setStats] = useState({
    total: 0,
    issues: 0,
    today: 0,
    completed: 0
  });

  useEffect(() => {
    const today = new Date().toDateString();
    
    setStats({
      total: reports.length,
      issues: reports.filter(r => r.status === 'issues').length,
      today: reports.filter(r => new Date(r.createdAt).toDateString() === today).length,
      completed: reports.filter(r => r.status === 'completed').length
    });
  }, [reports]);

  const recentReports = reports.slice(-3).reverse();

  return (
    <>
      {/* Header */}
      <div className="header-section">
        <div>
          <p className="greeting">Welcome</p>
          <h2 className="page-title">Matchday Report Dashboard</h2>
        </div>
        <div className="header-icon">
          <span className="material-icons">sports_soccer</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card">
          <span className="material-icons">description</span>
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Reports</span>
        </div>
        <div className="stat-card">
          <span className="material-icons">warning</span>
          <span className="stat-number">{stats.issues}</span>
          <span className="stat-label">With Issues</span>
        </div>
        <div className="stat-card">
          <span className="material-icons">today</span>
          <span className="stat-number">{stats.today}</span>
          <span className="stat-label">Today</span>
        </div>
        <div className="stat-card">
          <span className="material-icons">check_circle</span>
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3>Quick Actions</h3>
        <div className="action-buttons" style={{ display: 'grid', gap: '1rem' }}>
          <Link to="/create" className="action-btn primary">
            <span className="material-icons">add_circle</span>
            <div>
              <div className="action-title">Create New Report</div>
              <div className="action-subtitle">Complete a match report</div>
            </div>
          </Link>
          <Link to="/reports" className="action-btn secondary">
            <span className="material-icons">list</span>
            <div>
              <div className="action-title">View All Reports</div>
              <div className="action-subtitle">Browse created reports</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Reports */}
      {reports.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Recent Reports</h3>
            <Link to="/reports" className="btn btn-secondary">View All</Link>
          </div>
          <div className="reports-list">
            {recentReports.map((report) => (
              <Link
                key={report.id}
                to={`/reports/${report.id}`}
                className="report-card"
              >
                <div className="report-header">
                  <div className="report-title">Match {report.matchNumber}</div>
                  <div className={`report-status ${report.status}`}>
                    {report.status === 'completed' ? 'Completed' : 'Has Issues'}
                  </div>
                </div>
                <div className="report-info">
                  <div><strong>Teams:</strong> {report.homeTeam || 'TBD'} vs {report.awayTeam || 'TBD'}</div>
                  <div><strong>Score:</strong> {report.finalScore}</div>
                  <div><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}