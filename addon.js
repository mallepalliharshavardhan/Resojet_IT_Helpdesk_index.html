/**
 * Resojet IT Helpdesk Add-on
 * -------------------------------------------------------------
 * This file extends the existing single-file Resojet IT Helpdesk
 * application, making it fully customisable and resolving known
 * issues (ticket persistence + department list).
 * -------------------------------------------------------------
 * HOW TO USE
 * 1. Place this file in the same GitHub repository as your
 *    existing index.html (root directory).
 * 2. Open index.html and, just before the closing </body> tag,
 *    add the following line AFTER the main <script> block that
 *    defines HelpdeskApp:
 *
 *    <script src="addon.js"></script>
 *
 * 3. Commit & push the changes. GitHub Pages will automatically
 *    redeploy with the new functionality.
 * -------------------------------------------------------------*/

// 1. Customisation Settings (edit to suit)
window.HELPDESK_SETTINGS = {
  branding: {
    companyName: 'Resojet IT Helpdesk',
    primaryColor: '#2563eb',
    accentColor: '#059669'
  },
  departments: [
    'HR',
    'Admin',
    'R&D',
    'PPC',
    'Purchase',
    'Production',
    'Maintenance',
    'Stores',
    'Quality',
    'Security'
  ],
  categories: ['Hardware', 'Software', 'Network'],
  priorities: ['Low', 'Medium', 'High']
};

// 2. Patch the existing HelpdeskApp AFTER it has loaded
window.addEventListener('load', function () {
  if (!window.app) return; // app should be global in original code

  // a) Replace static department dropdown in ticket form
  const deptSelect = document.getElementById('department');
  if (deptSelect) {
    deptSelect.innerHTML = '<option value="">Select Department</option>' +
      window.HELPDESK_SETTINGS.departments
        .map(d => `<option value="${d}">${d}</option>`)
        .join('');
  }

  // b) Ensure admin "Add User" department list stays in sync
  const userDeptSelect = document.getElementById('userDepartment');
  if (userDeptSelect) {
    userDeptSelect.innerHTML = '<option value="">Select Department</option>' +
      window.HELPDESK_SETTINGS.departments
        .map(d => `<option value="${d}">${d}</option>`)
        .join('');
  }

  // c) Persistent storage fix – load existing tickets first
  const stored = JSON.parse(localStorage.getItem('helpdeskTickets') || '[]');
  if (stored.length) {
    app.tickets = stored;
  }

  // d) Monkey-patch app.saveTickets to update admin tables instantly
  const originalSave = app.saveTickets.bind(app);
  app.saveTickets = function () {
    originalSave();
    if (this.isAdmin) {
      this.renderTicketsTable();
      this.renderAdminTicketsTable();
      this.updateDashboard();
    }
  };

  // e) Apply branding colours dynamically (optional)
  const root = document.documentElement;
  if (root && window.HELPDESK_SETTINGS.branding.primaryColor) {
    root.style.setProperty('--color-primary', window.HELPDESK_SETTINGS.branding.primaryColor);
    root.style.setProperty('--color-primary-dark', window.HELPDESK_SETTINGS.branding.primaryColor);
  }
  if (window.HELPDESK_SETTINGS.branding.accentColor) {
    root.style.setProperty('--color-success', window.HELPDESK_SETTINGS.branding.accentColor);
  }
});
