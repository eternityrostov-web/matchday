
import React from 'react';

export default function About() {
  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="header-section">
        <div>
          <h2 className="page-title">About Matchday Report</h2>
        </div>
        <div className="header-icon">
          <span className="material-icons">info</span>
        </div>
      </div>

      <div className="card">
        <h3>Application Information</h3>
        <div className="report-info">
          <div><strong>Version:</strong> 1.0.0</div>
          <div><strong>Purpose:</strong> Venue management tool</div>
          <div><strong>Year:</strong> 2025</div>
        </div>
      </div>

      <div className="card">
        <h3>Developer</h3>
        <div className="report-info">
          <div><strong>Author:</strong> Maxim Ponomarev</div>
          <div><strong>Company:</strong> Supreme Committee</div>
        </div>
      </div>

      <div className="card">
        <h3>Features</h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="material-icons" style={{ color: '#4CAF50' }}>check_circle</span>
            <span>Create comprehensive match reports</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="material-icons" style={{ color: '#4CAF50' }}>check_circle</span>
            <span>Track 35 functional areas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="material-icons" style={{ color: '#4CAF50' }}>check_circle</span>
            <span>Attach photos to reports</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="material-icons" style={{ color: '#4CAF50' }}>check_circle</span>
            <span>Generate and share PDF reports</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="material-icons" style={{ color: '#4CAF50' }}>check_circle</span>
            <span>Local data storage</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Contact</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => openLink('mailto:m.ponomarev@loc.qa')}
            style={{ justifyContent: 'flex-start' }}
          >
            <span className="material-icons">email</span>
            m.ponomarev@loc.qa
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => openLink('tel:+97474481142')}
            style={{ justifyContent: 'flex-start' }}
          >
            <span className="material-icons">phone</span>
            +974 7448 1142
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => openLink('https://wa.me/97474481142')}
            style={{ justifyContent: 'flex-start' }}
          >
            <span className="material-icons">chat</span>
            WhatsApp
          </button>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: '#666', marginBottom: '0.5rem' }}>© 2025 Supreme Committee for Delivery & Legacy</p>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>All rights reserved</p>
      </div>
    </>
  );
}
