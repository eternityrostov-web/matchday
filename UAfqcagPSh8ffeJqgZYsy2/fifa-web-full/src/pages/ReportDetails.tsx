import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReports } from '../contexts/ReportsContext';

export default function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReport, deleteReport } = useReports();

  const report = id ? getReport(id) : undefined;

  if (!report) {
    return (
      <div className="card">
        <div className="empty-state">
          <span className="material-icons">error_outline</span>
          <h3>Report not found</h3>
          <p>The requested report could not be found.</p>
          <Link to="/reports" className="btn btn-primary">
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this report?')) {
      deleteReport(report.id);
      showNotification('Report deleted successfully!', 'success');
      navigate('/reports');
    }
  };

  const handlePrint = () => {
    window.print();
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
          <h2 className="page-title">Match {report.matchNumber} - Report Details</h2>
          <p className="greeting">
            {report.homeTeam || 'TBD'} vs {report.awayTeam || 'TBD'} • {report.finalScore}
          </p>
        </div>
        <div className={`report-status ${report.status}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          {report.status === 'completed' ? 'Completed' : 'Has Issues'}
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/reports" className="btn btn-secondary">
            <span className="material-icons">arrow_back</span>
            Back to Reports
          </Link>
          <button onClick={handlePrint} className="btn btn-primary">
            <span className="material-icons">print</span>
            Print Report
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            <span className="material-icons">delete</span>
            Delete Report
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="card">
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#333' }}>Match Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div><strong>Match Number:</strong> {report.matchNumber}</div>
            <div><strong>Date:</strong> {report.date || 'Not specified'}</div>
            <div><strong>Time:</strong> {report.time || 'Not specified'}</div>
            <div><strong>Tournament:</strong> {report.tournament || 'Not specified'}</div>
            <div><strong>Stadium:</strong> {report.stadium || 'Not specified'}</div>
            <div><strong>Home Team:</strong> {report.homeTeam || 'Not specified'}</div>
            <div><strong>Away Team:</strong> {report.awayTeam || 'Not specified'}</div>
            <div><strong>Final Score:</strong> {report.finalScore}</div>
            <div><strong>Venue Manager:</strong> {report.venueManagerName}</div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#333' }}>Attendance</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div><strong>Spectators:</strong> {report.spectators.toLocaleString()}</div>
            <div><strong>VIP Guests:</strong> {report.vipGuests.toLocaleString()}</div>
            <div><strong>VVIP Guests:</strong> {report.vvipGuests.toLocaleString()}</div>
            <div><strong>Media:</strong> {report.mediaRepresentatives.toLocaleString()}</div>
            <div><strong>Photographers:</strong> {report.photographers.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#333' }}>Functional Areas Status</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.5rem' }}>
            {report.functionalAreas.map((area, index) => (
              <div key={index}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  background: area.status ? '#d4edda' : '#f8d7da',
                  borderRadius: '4px'
                }}>
                  <span>{area.name}</span>
                  <span style={{
                    fontWeight: 'bold',
                    color: area.status ? '#155724' : '#721c24'
                  }}>
                    {area.status ? 'OK' : 'Issue'}
                  </span>
                </div>
                {!area.status && area.comment && (
                  <div style={{
                    marginLeft: '1rem',
                    fontSize: '0.9rem',
                    color: '#666',
                    marginBottom: '0.5rem',
                    fontStyle: 'italic'
                  }}>
                    "{area.comment}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#333' }}>DRS Compliance</h4>
          <div style={{
            padding: '1rem',
            background: report.drsCompliant ? '#d4edda' : '#f8d7da',
            borderRadius: '8px'
          }}>
            <div style={{
              fontWeight: 'bold',
              color: report.drsCompliant ? '#155724' : '#721c24'
            }}>
              {report.drsCompliant ? 'Compliant' : 'Non-Compliant'}
            </div>
            {!report.drsCompliant && report.drsComment && (
              <div style={{ marginTop: '0.5rem', color: '#666' }}>
                {report.drsComment}
              </div>
            )}
          </div>
        </div>

        {report.generalIssues && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>General Comments</h4>
            <div style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              whiteSpace: 'pre-wrap'
            }}>
              {report.generalIssues}
            </div>
          </div>
        )}

        {report.additionalComments && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#333' }}>Additional Comments</h4>
            <div style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              whiteSpace: 'pre-wrap'
            }}>
              {report.additionalComments}
            </div>
          </div>
        )}

        <div style={{
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #eee',
          color: '#666'
        }}>
          <small>
            Report created: {new Date(report.createdAt).toLocaleString()}
          </small>
        </div>
      </div>
    </>
  );
}