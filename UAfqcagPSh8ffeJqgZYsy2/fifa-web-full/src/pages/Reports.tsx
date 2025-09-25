import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '../contexts/ReportsContext';

export default function Reports() {
  const { reports, deleteReport } = useReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.matchNumber.toLowerCase().includes(search) ||
        (report.homeTeam && report.homeTeam.toLowerCase().includes(search)) ||
        (report.awayTeam && report.awayTeam.toLowerCase().includes(search)) ||
        (report.stadium && report.stadium.toLowerCase().includes(search)) ||
        report.venueManagerName.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reports, searchTerm, statusFilter]);

  const handleDelete = (reportId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this report?')) {
      deleteReport(reportId);
      showNotification('Report deleted successfully!', 'success');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  return (
    <>
      {/* Header */}
      <div className="header-section">
        <div>
          <h2 className="page-title">Match Reports</h2>
          <p className="greeting">Manage and review all match reports</p>
        </div>
        <div className="header-icon">
          <span className="material-icons">description</span>
        </div>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="issues">With Issues</option>
          </select>
          <Link to="/create" className="btn btn-primary">
            <span className="material-icons">add</span>
            Create Report
          </Link>
        </div>
      </div>

      {/* Reports List */}
      <div className="card">
        {filteredReports.length === 0 ? (
          reports.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">description</span>
              <h3>No reports yet</h3>
              <p>Create your first match report to get started</p>
              <Link to="/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create Report
              </Link>
            </div>
          ) : (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3>No reports found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )
        ) : (
          <div className="reports-list">
            {filteredReports.map((report) => (
              <Link
                key={report.id}
                to={`/reports/${report.id}`}
                className="report-card"
              >
                <div className="report-header">
                  <div className="report-title">
                    Match {report.matchNumber} - {report.homeTeam || 'TBD'} vs {report.awayTeam || 'TBD'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={`report-status ${report.status}`}>
                      {report.status === 'completed' ? 'Completed' : 'Has Issues'}
                    </div>
                    <button
                      onClick={(e) => handleDelete(report.id, e)}
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      title="Delete report"
                    >
                      <span className="material-icons" style={{ fontSize: '16px' }}>delete</span>
                    </button>
                  </div>
                </div>
                <div className="report-info">
                  <div><strong>Score:</strong> {report.finalScore}</div>
                  <div><strong>Stadium:</strong> {report.stadium || 'TBD'}</div>
                  <div><strong>Manager:</strong> {report.venueManagerName}</div>
                  <div><strong>Created:</strong> {new Date(report.createdAt).toLocaleDateString()}</div>
                  <div><strong>Spectators:</strong> {report.spectators}</div>
                  <div><strong>Tournament:</strong> {report.tournament || 'N/A'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}