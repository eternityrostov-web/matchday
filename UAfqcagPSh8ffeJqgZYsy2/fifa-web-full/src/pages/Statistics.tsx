import React, { useEffect, useRef } from 'react';
import { useReports } from '../contexts/ReportsContext';

export default function Statistics() {
  const { reports } = useReports();
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const monthlyChartRef = useRef<HTMLCanvasElement>(null);

  const stats = {
    total: reports.length,
    completed: reports.filter(r => r.status === 'completed').length,
    issues: reports.filter(r => r.status === 'issues').length,
    completionRate: reports.length > 0 ? ((reports.filter(r => r.status === 'completed').length / reports.length) * 100).toFixed(1) : 0
  };

  const monthlyStats = getMonthlyStats();

  useEffect(() => {
    drawStatusChart();
    drawMonthlyChart();
  }, [reports]);

  function getMonthlyStats() {
    const months: { [key: string]: { month: string; count: number } } = {};
    
    reports.forEach(report => {
      const date = new Date(report.createdAt);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (!months[monthKey]) {
        months[monthKey] = { month: monthName, count: 0 };
      }
      months[monthKey].count++;
    });
    
    return Object.values(months).sort((a, b) => b.month.localeCompare(a.month));
  }

  function drawStatusChart() {
    const canvas = statusChartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';

    if (reports.length === 0) {
      ctx.fillStyle = '#666';
      ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Draw simple bar chart
    const barWidth = canvas.width / 4;
    const maxHeight = canvas.height - 60;
    const maxValue = Math.max(stats.completed, stats.issues, 1);

    // Completed bar
    const completedHeight = (stats.completed / maxValue) * maxHeight;
    ctx.fillStyle = '#28a745';
    ctx.fillRect(barWidth * 0.5, canvas.height - completedHeight - 40, barWidth, completedHeight);
    ctx.fillStyle = '#333';
    ctx.fillText('Completed', barWidth, canvas.height - 20);
    ctx.fillText(stats.completed.toString(), barWidth, canvas.height - completedHeight - 45);

    // Issues bar
    const issuesHeight = (stats.issues / maxValue) * maxHeight;
    ctx.fillStyle = '#dc3545';
    ctx.fillRect(barWidth * 2.5, canvas.height - issuesHeight - 40, barWidth, issuesHeight);
    ctx.fillStyle = '#333';
    ctx.fillText('Issues', barWidth * 3, canvas.height - 20);
    ctx.fillText(stats.issues.toString(), barWidth * 3, canvas.height - issuesHeight - 45);
  }

  function drawMonthlyChart() {
    const canvas = monthlyChartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';

    if (monthlyStats.length === 0) {
      ctx.fillStyle = '#666';
      ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Draw line chart
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const maxValue = Math.max(...monthlyStats.map(s => s.count), 1);

    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();

    monthlyStats.reverse().forEach((stat, index) => {
      const x = padding + (index / (monthlyStats.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight - (stat.count / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = '#667eea';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#666';
      ctx.save();
      ctx.translate(x, canvas.height - 5);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(stat.month.split(' ')[0], 0, 0);
      ctx.restore();
    });

    ctx.strokeStyle = '#667eea';
    ctx.stroke();
  }

  return (
    <>
      {/* Header */}
      <div className="header-section">
        <div>
          <h2 className="page-title">Statistics Overview</h2>
          <p className="greeting">Analyze your match report data</p>
        </div>
        <div className="header-icon">
          <span className="material-icons">bar_chart</span>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="stats-container">
        <div className="stat-card">
          <span className="material-icons">description</span>
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Reports</span>
        </div>
        <div className="stat-card">
          <span className="material-icons">check_circle</span>
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card">
          <span className="material-icons">warning</span>
          <span className="stat-number">{stats.issues}</span>
          <span className="stat-label">With Issues</span>
        </div>
        <div className="stat-card">
          <span className="material-icons">trending_up</span>
          <span className="stat-number">{stats.completionRate}%</span>
          <span className="stat-label">Success Rate</span>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-container">
        <div className="chart-card">
          <h3>Reports by Status</h3>
          <div className="chart-placeholder">
            <canvas
              ref={statusChartRef}
              width={300}
              height={200}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
        <div className="chart-card">
          <h3>Monthly Reports</h3>
          <div className="chart-placeholder">
            <canvas
              ref={monthlyChartRef}
              width={300}
              height={200}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="card">
        <h3>Detailed Statistics</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{stats.total}</div>
            <div style={{ color: '#666' }}>Total Reports</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(40, 167, 69, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{stats.completed}</div>
            <div style={{ color: '#666' }}>Completed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(220, 53, 69, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>{stats.issues}</div>
            <div style={{ color: '#666' }}>With Issues</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{stats.completionRate}%</div>
            <div style={{ color: '#666' }}>Success Rate</div>
          </div>
        </div>

        {monthlyStats.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Monthly Breakdown</h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {monthlyStats.map((stat, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '8px'
                  }}
                >
                  <span>{stat.month}</span>
                  <span style={{ fontWeight: 'bold' }}>{stat.count} reports</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}