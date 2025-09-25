import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../contexts/ReportsContext';

export default function Dashboard() {
  const { reports } = useReports();
  const [stats, setStats] = useState({
    total: 0,
    issues: 0,
    thisWeek: 0
  });

  useEffect(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    setStats({
      total: reports.length,
      issues: reports.filter(r => r.functionalAreas && r.functionalAreas.some(area => area.status === 'ISSUE')).length,
      thisWeek: reports.filter(r => new Date(r.createdAt) > weekAgo).length
    });
  }, [reports]);

  const recentReports = reports.slice(-3).reverse();

  return (
    <>
      {/* Header */}
      <div className="header-section">
        <div>
          <p className="greeting">Welcome</p>
          <h2 className="page-title">Matchday Report</h2>
        </div>
        <div className="header-icon">
          <span className="material-icons">stadium</span>
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
          <span className="stat-number">{stats.thisWeek}</span>
          <span className="stat-label">This Week</span>
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
                  <div className="report-title">Match #{report.matchInfo.matchNumber}</div>
                  <div className={`report-status ${report.functionalAreas && report.functionalAreas.some(area => area.status === 'ISSUE') ? 'issues' : 'completed'}`}>
                    {report.functionalAreas && report.functionalAreas.some(area => area.status === 'ISSUE') ? 'Has Issues' : 'Completed'}
                  </div>
                </div>
                <div className="report-info">
                  <div><strong>Teams:</strong> {report.matchInfo.homeTeam || 'TBD'} vs {report.matchInfo.awayTeam || 'TBD'}</div>
                  <div><strong>Score:</strong> {report.matchInfo.finalScore}</div>
                  <div><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {reports.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <span className="material-icons">description</span>
            <h3>Get Started</h3>
            <p>Create your first match report</p>
            <Link to="/create" className="btn btn-primary">Create Report</Link>
          </div>
        </div>
      )}
    </>
  );
}