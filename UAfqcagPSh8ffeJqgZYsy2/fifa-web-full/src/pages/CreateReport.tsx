import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../contexts/ReportsContext';
import { Report } from '../types';
import { defaultReport, functionalAreas, tournaments } from '../constants';

export default function CreateReport() {
  const navigate = useNavigate();
  const { addReport } = useReports();
  const [formData, setFormData] = useState(defaultReport);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine status based on issues
      const hasIssues = !formData.drsCompliant || 
                       formData.functionalAreas.some(area => !area.status) ||
                       formData.generalIssues?.trim();

      const report: Report = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...formData,
        status: hasIssues ? 'issues' : 'completed'
      };

      addReport(report);
      
      // Show success notification
      showNotification('Report created successfully!', 'success');
      
      // Navigate to reports page
      navigate('/reports');
    } catch (error) {
      console.error('Error creating report:', error);
      showNotification('Error creating report. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAreaChange = (index: number, field: 'status' | 'comment', value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      functionalAreas: prev.functionalAreas.map((area, i) => 
        i === index ? { ...area, [field]: value } : area
      )
    }));
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
          <h2 className="page-title">Create Match Report</h2>
          <p className="greeting">Fill in all required information for the match report</p>
        </div>
        <div className="header-icon">
          <span className="material-icons">add_circle</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Match Information */}
        <div className="form-section">
          <h3>Match Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Match Number *</label>
              <input
                type="text"
                name="matchNumber"
                value={formData.matchNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter match number"
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Tournament</label>
              <select
                name="tournament"
                value={formData.tournament}
                onChange={handleInputChange}
              >
                <option value="">Select Tournament</option>
                {tournaments.map(tournament => (
                  <option key={tournament} value={tournament}>
                    {tournament}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Stadium</label>
              <input
                type="text"
                name="stadium"
                value={formData.stadium}
                onChange={handleInputChange}
                placeholder="Stadium name"
              />
            </div>
            <div className="form-group">
              <label>Home Team</label>
              <input
                type="text"
                name="homeTeam"
                value={formData.homeTeam}
                onChange={handleInputChange}
                placeholder="Home team name"
              />
            </div>
            <div className="form-group">
              <label>Away Team</label>
              <input
                type="text"
                name="awayTeam"
                value={formData.awayTeam}
                onChange={handleInputChange}
                placeholder="Away team name"
              />
            </div>
            <div className="form-group">
              <label>Final Score *</label>
              <input
                type="text"
                name="finalScore"
                value={formData.finalScore}
                onChange={handleInputChange}
                required
                placeholder="0:0"
              />
            </div>
            <div className="form-group full-width">
              <label>Venue Manager Name *</label>
              <input
                type="text"
                name="venueManagerName"
                value={formData.venueManagerName}
                onChange={handleInputChange}
                required
                placeholder="Full name"
              />
            </div>
          </div>
        </div>

        {/* Client Groups */}
        <div className="form-section">
          <h3>Client Groups</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Spectators</label>
              <input
                type="number"
                name="spectators"
                value={formData.spectators}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>VIP Guests</label>
              <input
                type="number"
                name="vipGuests"
                value={formData.vipGuests}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>VVIP Guests</label>
              <input
                type="number"
                name="vvipGuests"
                value={formData.vvipGuests}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Media Representatives</label>
              <input
                type="number"
                name="mediaRepresentatives"
                value={formData.mediaRepresentatives}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Photographers</label>
              <input
                type="number"
                name="photographers"
                value={formData.photographers}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Functional Areas */}
        <div className="form-section">
          <h3>Functional Areas Status</h3>
          <div className="functional-areas">
            {formData.functionalAreas.map((area, index) => (
              <div key={index} className="functional-area">
                <div className="area-header">
                  <span className="area-name">{area.name}</span>
                  <div className="status-toggle">
                    <span 
                      className="status-label"
                      style={{ 
                        color: area.status ? '#28a745' : '#dc3545' 
                      }}
                    >
                      {area.status ? 'OK' : 'Issue'}
                    </span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={area.status}
                        onChange={(e) => handleAreaChange(index, 'status', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                {!area.status && (
                  <div className="area-comment">
                    <label>Issue Description</label>
                    <textarea
                      rows={2}
                      placeholder="Describe the issue..."
                      value={area.comment}
                      onChange={(e) => handleAreaChange(index, 'comment', e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* General Issues */}
        <div className="form-section">
          <h3>Venue Manager General Comments</h3>
          <textarea
            name="generalIssues"
            rows={4}
            placeholder="Describe general comments..."
            value={formData.generalIssues}
            onChange={handleInputChange}
          />
        </div>

        {/* DRS Compliance */}
        <div className="form-section">
          <h3>DRS Compliance</h3>
          <div className="compliance-toggle">
            <label className="switch">
              <input
                type="checkbox"
                name="drsCompliant"
                checked={formData.drsCompliant}
                onChange={handleInputChange}
              />
              <span className="slider"></span>
            </label>
            <span>DRS Compliant</span>
          </div>
          {!formData.drsCompliant && (
            <div className="drs-comment" style={{ marginTop: '1rem' }}>
              <label>DRS Issue Description</label>
              <textarea
                name="drsComment"
                rows={3}
                placeholder="Describe DRS compliance issues..."
                value={formData.drsComment}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>

        {/* Additional Comments */}
        <div className="form-section">
          <h3>Additional Comments</h3>
          <textarea
            name="additionalComments"
            rows={4}
            placeholder="Additional comments..."
            value={formData.additionalComments}
            onChange={handleInputChange}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary btn-large"
          disabled={loading}
          style={{ width: '100%', marginTop: '2rem' }}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Creating Report...
            </>
          ) : (
            <>
              <span className="material-icons">save</span>
              Create Report
            </>
          )}
        </button>
      </form>
    </>
  );
}