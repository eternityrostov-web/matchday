// FIFA World Cup 2026 - Matchday Report App

// Global state
let reports = JSON.parse(localStorage.getItem('fifa-reports') || '[]');
let currentReportId = null;

// Functional areas data
const functionalAreas = [
    'Ticketing Office',
    'Security Control Room',
    'Media Center',
    'VIP Lounge',
    'VVIP Lounge',
    'First Aid Station',
    'Broadcast Compound',
    'Team Dressing Rooms',
    'Referee Dressing Room',
    'Stadium Lighting',
    'Sound System',
    'Field Condition',
    'Parking Areas',
    'Concession Stands',
    'Emergency Exits'
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeFunctionalAreas();
    initializeEventListeners();
    updateDashboardStats();
    displayReports();
    updateStatistics();
});

// Navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked nav tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Refresh data when switching to certain tabs
    if (tabName === 'home') {
        updateDashboardStats();
        displayRecentReports();
    } else if (tabName === 'reports') {
        displayReports();
    } else if (tabName === 'statistics') {
        updateStatistics();
    }
}

// Initialize functional areas
function initializeFunctionalAreas() {
    const container = document.getElementById('functional-areas');
    if (!container) return;
    
    container.innerHTML = '';
    
    functionalAreas.forEach((area, index) => {
        const areaDiv = document.createElement('div');
        areaDiv.className = 'functional-area';
        areaDiv.innerHTML = `
            <div class="area-header">
                <span class="area-name">${area}</span>
                <div class="status-toggle">
                    <span class="status-label">OK</span>
                    <label class="switch">
                        <input type="checkbox" name="area-${index}" checked onchange="toggleAreaStatus(${index}, this)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="area-comment" style="display: none;">
                <label>Issue Description</label>
                <textarea name="area-comment-${index}" rows="2" placeholder="Describe the issue..."></textarea>
            </div>
        `;
        container.appendChild(areaDiv);
    });
}

// Toggle area status
function toggleAreaStatus(index, checkbox) {
    const areaDiv = checkbox.closest('.functional-area');
    const commentDiv = areaDiv.querySelector('.area-comment');
    const statusLabel = areaDiv.querySelector('.status-label');
    
    if (checkbox.checked) {
        commentDiv.style.display = 'none';
        statusLabel.textContent = 'OK';
        statusLabel.style.color = '#28a745';
    } else {
        commentDiv.style.display = 'block';
        statusLabel.textContent = 'Issue';
        statusLabel.style.color = '#dc3545';
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            showTab(tabName);
        });
    });
    
    // DRS compliance toggle
    const drsToggle = document.querySelector('input[name="drsCompliant"]');
    if (drsToggle) {
        drsToggle.addEventListener('change', function() {
            const commentDiv = document.querySelector('.drs-comment');
            if (commentDiv) {
                commentDiv.style.display = this.checked ? 'none' : 'block';
            }
        });
    }
    
    // Form submission
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Search and filter
    const searchInput = document.getElementById('search-reports');
    if (searchInput) {
        searchInput.addEventListener('input', filterReports);
    }
    
    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
        filterStatus.addEventListener('change', filterReports);
    }
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportData = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        matchNumber: formData.get('matchNumber'),
        date: formData.get('date'),
        time: formData.get('time'),
        tournament: formData.get('tournament'),
        stadium: formData.get('stadium'),
        homeTeam: formData.get('homeTeam'),
        awayTeam: formData.get('awayTeam'),
        finalScore: formData.get('finalScore'),
        venueManagerName: formData.get('venueManagerName'),
        spectators: parseInt(formData.get('spectators')) || 0,
        vipGuests: parseInt(formData.get('vipGuests')) || 0,
        vvipGuests: parseInt(formData.get('vvipGuests')) || 0,
        mediaRepresentatives: parseInt(formData.get('mediaRepresentatives')) || 0,
        photographers: parseInt(formData.get('photographers')) || 0,
        functionalAreas: getFunctionalAreasData(),
        generalIssues: formData.get('generalIssues'),
        drsCompliant: formData.get('drsCompliant') === 'on',
        drsComment: formData.get('drsComment'),
        additionalComments: formData.get('additionalComments')
    };
    
    // Determine status
    const hasIssues = !reportData.drsCompliant || 
                     reportData.functionalAreas.some(area => !area.status) ||
                     reportData.generalIssues?.trim();
    
    reportData.status = hasIssues ? 'issues' : 'completed';
    
    // Save report
    reports.push(reportData);
    localStorage.setItem('fifa-reports', JSON.stringify(reports));
    
    // Show success message
    showNotification('Report created successfully!', 'success');
    
    // Reset form and switch to reports tab
    e.target.reset();
    initializeFunctionalAreas();
    showTab('reports');
    
    // Update dashboard
    updateDashboardStats();
}

// Get functional areas data
function getFunctionalAreasData() {
    return functionalAreas.map((area, index) => {
        const checkbox = document.querySelector(`input[name="area-${index}"]`);
        const comment = document.querySelector(`textarea[name="area-comment-${index}"]`);
        
        return {
            name: area,
            status: checkbox ? checkbox.checked : true,
            comment: comment ? comment.value : ''
        };
    });
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalReports = reports.length;
    const problemReports = reports.filter(r => r.status === 'issues').length;
    const todayReports = reports.filter(r => {
        const today = new Date().toDateString();
        return new Date(r.createdAt).toDateString() === today;
    }).length;
    const completedReports = reports.filter(r => r.status === 'completed').length;
    
    document.getElementById('total-reports').textContent = totalReports;
    document.getElementById('problem-reports').textContent = problemReports;
    document.getElementById('today-reports').textContent = todayReports;
    document.getElementById('completed-reports').textContent = completedReports;
    
    // Show/hide recent section
    const recentSection = document.getElementById('recent-section');
    if (recentSection) {
        recentSection.style.display = totalReports > 0 ? 'block' : 'none';
    }
    
    displayRecentReports();
}

// Display recent reports on dashboard
function displayRecentReports() {
    const container = document.getElementById('recent-list');
    if (!container) return;
    
    const recentReports = reports.slice(-3).reverse();
    
    if (recentReports.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No reports yet</p>';
        return;
    }
    
    container.innerHTML = recentReports.map(report => `
        <div class="report-card" onclick="viewReport('${report.id}')">
            <div class="report-header">
                <div class="report-title">Match ${report.matchNumber}</div>
                <div class="report-status ${report.status}">${report.status === 'completed' ? 'Completed' : 'Has Issues'}</div>
            </div>
            <div class="report-info">
                <div><strong>Teams:</strong> ${report.homeTeam || 'TBD'} vs ${report.awayTeam || 'TBD'}</div>
                <div><strong>Score:</strong> ${report.finalScore}</div>
                <div><strong>Date:</strong> ${formatDate(report.createdAt)}</div>
            </div>
        </div>
    `).join('');
}

// Display all reports
function displayReports() {
    const container = document.getElementById('reports-list');
    if (!container) return;
    
    if (reports.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <span class="material-icons" style="font-size: 4rem; opacity: 0.3;">description</span>
                <h3>No reports yet</h3>
                <p>Create your first match report to get started</p>
                <button onclick="showTab('create')" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">Create Report</button>
            </div>
        `;
        return;
    }
    
    const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = sortedReports.map(report => `
        <div class="report-card" onclick="viewReport('${report.id}')">
            <div class="report-header">
                <div class="report-title">Match ${report.matchNumber} - ${report.homeTeam || 'TBD'} vs ${report.awayTeam || 'TBD'}</div>
                <div class="report-status ${report.status}">${report.status === 'completed' ? 'Completed' : 'Has Issues'}</div>
            </div>
            <div class="report-info">
                <div><strong>Score:</strong> ${report.finalScore}</div>
                <div><strong>Stadium:</strong> ${report.stadium || 'TBD'}</div>
                <div><strong>Manager:</strong> ${report.venueManagerName}</div>
                <div><strong>Created:</strong> ${formatDate(report.createdAt)}</div>
                <div><strong>Spectators:</strong> ${report.spectators}</div>
                <div><strong>Tournament:</strong> ${report.tournament || 'N/A'}</div>
            </div>
        </div>
    `).join('');
}

// Filter reports
function filterReports() {
    const searchTerm = document.getElementById('search-reports')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filter-status')?.value || '';
    
    let filteredReports = reports;
    
    if (searchTerm) {
        filteredReports = filteredReports.filter(report => 
            report.matchNumber.toLowerCase().includes(searchTerm) ||
            (report.homeTeam && report.homeTeam.toLowerCase().includes(searchTerm)) ||
            (report.awayTeam && report.awayTeam.toLowerCase().includes(searchTerm)) ||
            (report.stadium && report.stadium.toLowerCase().includes(searchTerm)) ||
            report.venueManagerName.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter) {
        filteredReports = filteredReports.filter(report => report.status === statusFilter);
    }
    
    const container = document.getElementById('reports-list');
    if (!container) return;
    
    if (filteredReports.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <span class="material-icons" style="font-size: 4rem; opacity: 0.3;">search_off</span>
                <h3>No reports found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    const sortedReports = [...filteredReports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = sortedReports.map(report => `
        <div class="report-card" onclick="viewReport('${report.id}')">
            <div class="report-header">
                <div class="report-title">Match ${report.matchNumber} - ${report.homeTeam || 'TBD'} vs ${report.awayTeam || 'TBD'}</div>
                <div class="report-status ${report.status}">${report.status === 'completed' ? 'Completed' : 'Has Issues'}</div>
            </div>
            <div class="report-info">
                <div><strong>Score:</strong> ${report.finalScore}</div>
                <div><strong>Stadium:</strong> ${report.stadium || 'TBD'}</div>
                <div><strong>Manager:</strong> ${report.venueManagerName}</div>
                <div><strong>Created:</strong> ${formatDate(report.createdAt)}</div>
                <div><strong>Spectators:</strong> ${report.spectators}</div>
                <div><strong>Tournament:</strong> ${report.tournament || 'N/A'}</div>
            </div>
        </div>
    `).join('');
}

// View report details
function viewReport(reportId) {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    
    const modal = document.getElementById('report-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h4 style="margin-bottom: 1rem; color: #333;">Match Information</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div><strong>Match Number:</strong> ${report.matchNumber}</div>
                <div><strong>Date:</strong> ${report.date || 'Not specified'}</div>
                <div><strong>Time:</strong> ${report.time || 'Not specified'}</div>
                <div><strong>Tournament:</strong> ${report.tournament || 'Not specified'}</div>
                <div><strong>Stadium:</strong> ${report.stadium || 'Not specified'}</div>
                <div><strong>Home Team:</strong> ${report.homeTeam || 'Not specified'}</div>
                <div><strong>Away Team:</strong> ${report.awayTeam || 'Not specified'}</div>
                <div><strong>Final Score:</strong> ${report.finalScore}</div>
                <div><strong>Venue Manager:</strong> ${report.venueManagerName}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4 style="margin-bottom: 1rem; color: #333;">Attendance</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                <div><strong>Spectators:</strong> ${report.spectators}</div>
                <div><strong>VIP Guests:</strong> ${report.vipGuests}</div>
                <div><strong>VVIP Guests:</strong> ${report.vvipGuests}</div>
                <div><strong>Media:</strong> ${report.mediaRepresentatives}</div>
                <div><strong>Photographers:</strong> ${report.photographers}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4 style="margin-bottom: 1rem; color: #333;">Functional Areas Status</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem;">
                ${report.functionalAreas.map(area => `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: ${area.status ? '#d4edda' : '#f8d7da'}; border-radius: 4px;">
                        <span>${area.name}</span>
                        <span style="font-weight: bold; color: ${area.status ? '#155724' : '#721c24'};">
                            ${area.status ? 'OK' : 'Issue'}
                        </span>
                    </div>
                    ${!area.status && area.comment ? `<div style="margin-left: 1rem; font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">${area.comment}</div>` : ''}
                `).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4 style="margin-bottom: 1rem; color: #333;">DRS Compliance</h4>
            <div style="padding: 1rem; background: ${report.drsCompliant ? '#d4edda' : '#f8d7da'}; border-radius: 8px;">
                <div style="font-weight: bold; color: ${report.drsCompliant ? '#155724' : '#721c24'};">
                    ${report.drsCompliant ? 'Compliant' : 'Non-Compliant'}
                </div>
                ${!report.drsCompliant && report.drsComment ? `<div style="margin-top: 0.5rem; color: #666;">${report.drsComment}</div>` : ''}
            </div>
        </div>
        
        ${report.generalIssues ? `
            <div style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem; color: #333;">General Comments</h4>
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; white-space: pre-wrap;">${report.generalIssues}</div>
            </div>
        ` : ''}
        
        ${report.additionalComments ? `
            <div style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem; color: #333;">Additional Comments</h4>
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; white-space: pre-wrap;">${report.additionalComments}</div>
            </div>
        ` : ''}
        
        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; color: #666;">
            <small>Created: ${formatDate(report.createdAt)}</small>
        </div>
        
        <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
            <button onclick="deleteReport('${report.id}')" style="padding: 0.5rem 1rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete Report</button>
        </div>
    `;
    
    modal.style.display = 'block';
    currentReportId = reportId;
}

// Delete report
function deleteReport(reportId) {
    if (confirm('Are you sure you want to delete this report?')) {
        reports = reports.filter(r => r.id !== reportId);
        localStorage.setItem('fifa-reports', JSON.stringify(reports));
        closeModal();
        displayReports();
        updateDashboardStats();
        updateStatistics();
        showNotification('Report deleted successfully!', 'success');
    }
}

// Close modal
function closeModal() {
    document.getElementById('report-modal').style.display = 'none';
    currentReportId = null;
}

// Update statistics
function updateStatistics() {
    const container = document.getElementById('detailed-stats');
    if (!container) return;
    
    const totalReports = reports.length;
    const completedReports = reports.filter(r => r.status === 'completed').length;
    const issueReports = reports.filter(r => r.status === 'issues').length;
    const completionRate = totalReports > 0 ? ((completedReports / totalReports) * 100).toFixed(1) : 0;
    
    // Get monthly statistics
    const monthlyStats = getMonthlyStats();
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
            <div style="text-align: center; padding: 1.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px;">
                <div style="font-size: 2rem; font-weight: bold; color: #667eea;">${totalReports}</div>
                <div style="color: #666;">Total Reports</div>
            </div>
            <div style="text-align: center; padding: 1.5rem; background: rgba(40, 167, 69, 0.1); border-radius: 12px;">
                <div style="font-size: 2rem; font-weight: bold; color: #28a745;">${completedReports}</div>
                <div style="color: #666;">Completed</div>
            </div>
            <div style="text-align: center; padding: 1.5rem; background: rgba(220, 53, 69, 0.1); border-radius: 12px;">
                <div style="font-size: 2rem; font-weight: bold; color: #dc3545;">${issueReports}</div>
                <div style="color: #666;">With Issues</div>
            </div>
            <div style="text-align: center; padding: 1.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px;">
                <div style="font-size: 2rem; font-weight: bold; color: #667eea;">${completionRate}%</div>
                <div style="color: #666;">Success Rate</div>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h4 style="margin-bottom: 1rem;">Monthly Breakdown</h4>
            <div style="display: grid; gap: 0.5rem;">
                ${monthlyStats.map(stat => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: rgba(255, 255, 255, 0.8); border-radius: 8px;">
                        <span>${stat.month}</span>
                        <span style="font-weight: bold;">${stat.count} reports</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update charts
    updateCharts();
}

// Get monthly statistics
function getMonthlyStats() {
    const months = {};
    
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

// Update charts (simplified version)
function updateCharts() {
    const statusChart = document.getElementById('statusChart');
    const monthlyChart = document.getElementById('monthlyChart');
    
    if (statusChart) {
        const ctx = statusChart.getContext('2d');
        const completedReports = reports.filter(r => r.status === 'completed').length;
        const issueReports = reports.filter(r => r.status === 'issues').length;
        
        // Simple chart drawing
        ctx.clearRect(0, 0, statusChart.width, statusChart.height);
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        
        if (reports.length === 0) {
            ctx.fillStyle = '#666';
            ctx.fillText('No data available', statusChart.width/2, statusChart.height/2);
        } else {
            // Draw simple bar chart
            const barWidth = statusChart.width / 4;
            const maxHeight = statusChart.height - 40;
            const maxValue = Math.max(completedReports, issueReports, 1);
            
            // Completed bar
            const completedHeight = (completedReports / maxValue) * maxHeight;
            ctx.fillStyle = '#28a745';
            ctx.fillRect(barWidth * 0.5, statusChart.height - completedHeight - 20, barWidth, completedHeight);
            ctx.fillStyle = '#333';
            ctx.fillText('Completed', barWidth, statusChart.height - 5);
            ctx.fillText(completedReports.toString(), barWidth, statusChart.height - completedHeight - 25);
            
            // Issues bar
            const issuesHeight = (issueReports / maxValue) * maxHeight;
            ctx.fillStyle = '#dc3545';
            ctx.fillRect(barWidth * 2.5, statusChart.height - issuesHeight - 20, barWidth, issuesHeight);
            ctx.fillStyle = '#333';
            ctx.fillText('Issues', barWidth * 3, statusChart.height - 5);
            ctx.fillText(issueReports.toString(), barWidth * 3, statusChart.height - issuesHeight - 25);
        }
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('report-modal');
    if (event.target === modal) {
        closeModal();
    }
}