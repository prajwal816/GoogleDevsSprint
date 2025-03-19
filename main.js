// Main JavaScript file for AYUSH Startup Registration Portal

// DOM Content Loaded - Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Setup form validations
    setupFormValidations();
    
    // Setup file uploads
    setupFileUploads();
    
    // Initialize dashboard if on dashboard page
    if (document.querySelector('.dashboard-container')) {
        initDashboard();
    }
    
    // Initialize admin panel if on admin page
    if (document.querySelector('.admin-panel')) {
        initAdminPanel();
    }
    
    // Setup navigation and UI interactions
    setupUIInteractions();
});

// Application Initialization
function initApp() {
    // Check authentication status
    checkAuthStatus();
    
    // Register service worker for offline functionality
    registerServiceWorker();
    
    // Set up notification system
    setupNotifications();
}

// Authentication Functions
function checkAuthStatus() {
    const userToken = localStorage.getItem('ayushUserToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    // If no token, redirect to login page if not already there
    if (!userToken && !window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('signup.html') && 
        !window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update UI based on auth status
    updateUIForAuthStatus(userToken, isAdmin);
}

function updateUIForAuthStatus(userToken, isAdmin) {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const dashboardBtn = document.getElementById('dashboard-btn');
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const userNameDisplay = document.getElementById('user-name');
    
    // Hide/show elements based on authentication
    if (userToken) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (dashboardBtn) dashboardBtn.style.display = 'block';
        if (adminPanelBtn) adminPanelBtn.style.display = isAdmin ? 'block' : 'none';
        
        // Display user name if element exists
        if (userNameDisplay) {
            const userData = JSON.parse(localStorage.getItem('userData'));
            userNameDisplay.textContent = userData ? userData.name : 'User';
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (dashboardBtn) dashboardBtn.style.display = 'none';
        if (adminPanelBtn) adminPanelBtn.style.display = 'none';
    }
}

// Login functionality
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                showNotification('Please enter both email and password', 'error');
                return;
            }
            
            // In a real app, this would be an API call
            // For demo, we'll simulate successful login
            simulateLogin(email, password);
        });
    }
}

function simulateLogin(email, password) {
    // This is a mock function - in production, this would be an API call
    // Simulating API response delay
    showNotification('Logging in...', 'info');
    
    setTimeout(() => {
        // For demo purposes only - would be server-validated in production
        if (email === 'admin@ayush.gov.in' && password === 'admin123') {
            // Admin login
            const adminData = {
                id: 'admin1',
                name: 'AYUSH Admin',
                email: email,
                role: 'admin'
            };
            
            localStorage.setItem('ayushUserToken', 'admin-mock-token-xyz');
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('userData', JSON.stringify(adminData));
            
            showNotification('Admin login successful!', 'success');
            window.location.href = 'admin-panel.html';
        } else {
            // Regular user login - in real app would check credentials against database
            const userData = {
                id: 'user' + Math.floor(Math.random() * 1000),
                name: email.split('@')[0],
                email: email,
                role: 'startup'
            };
            
            localStorage.setItem('ayushUserToken', 'user-mock-token-xyz');
            localStorage.setItem('isAdmin', 'false');
            localStorage.setItem('userData', JSON.stringify(userData));
            
            showNotification('Login successful!', 'success');
            window.location.href = 'dashboard.html';
        }
    }, 1000);
}

// Signup functionality
function setupSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters long', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // In a real app, this would be an API call
            simulateSignup(name, email, password);
        });
    }
}

function simulateSignup(name, email, password) {
    // Simulating API response delay
    showNotification('Creating your account...', 'info');
    
    setTimeout(() => {
        // For demo purposes - would be server-side in production
        const userData = {
            id: 'user' + Math.floor(Math.random() * 1000),
            name: name,
            email: email,
            role: 'startup'
        };
        
        localStorage.setItem('ayushUserToken', 'user-mock-token-xyz');
        localStorage.setItem('isAdmin', 'false');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        showNotification('Account created successfully!', 'success');
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear storage
            localStorage.removeItem('ayushUserToken');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('userData');
            
            showNotification('Logged out successfully', 'success');
            window.location.href = 'index.html';
        });
    }
}

// Form validations
function setupFormValidations() {
    // Set up login form
    setupLoginForm();
    
    // Set up signup form
    setupSignupForm();
    
    // Set up logout
    setupLogout();
    
    // Set up registration form
    setupRegistrationForm();
}

// Registration Form - Multi-step form handling
function setupRegistrationForm() {
    const registrationForm = document.getElementById('registration-form');
    if (!registrationForm) return;
    
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const formSteps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress-bar');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    let currentStep = 0;
    
    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (validateCurrentStep(currentStep)) {
                formSteps[currentStep].classList.remove('active');
                currentStep++;
                formSteps[currentStep].classList.add('active');
                updateProgressBar();
            }
        });
    });
    
    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            formSteps[currentStep].classList.remove('active');
            currentStep--;
            formSteps[currentStep].classList.add('active');
            updateProgressBar();
        });
    });
    
    // Update progress bar
    function updateProgressBar() {
        progressSteps.forEach((step, idx) => {
            if (idx <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update progress bar fill
        const progressPercentage = (currentStep / (progressSteps.length - 1)) * 100;
        progressBar.style.width = progressPercentage + '%';
    }
    
    // Form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateCurrentStep(currentStep)) {
            // Collect all form data
            const formData = new FormData(registrationForm);
            submitRegistration(formData);
        }
    });
}

// Validate each step of the registration form
function validateCurrentStep(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        // Remove any existing error messages
        const existingError = field.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }
        
        if (!field.value.trim()) {
            isValid = false;
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
            field.classList.add('invalid-input');
        } else {
            field.classList.remove('invalid-input');
        }
        
        // Additional validation for specific fields
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid email address';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
                field.classList.add('invalid-input');
            }
        }
        
        if (field.id === 'phone' && field.value.trim()) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Please enter a valid 10-digit phone number';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
                field.classList.add('invalid-input');
            }
        }
    });
    
    return isValid;
}

// Submit registration
function submitRegistration(formData) {
    showNotification('Submitting your application...', 'info');
    
    // Convert FormData to object for easier manipulation
    const registrationData = {};
    formData.forEach((value, key) => {
        registrationData[key] = value;
    });
    
    // Add timestamps and status
    registrationData.submittedAt = new Date().toISOString();
    registrationData.status = 'Under Review';
    registrationData.applicationId = 'AYUSH-' + Math.floor(Math.random() * 100000);
    
    // In a real app, this would be an API call
    setTimeout(() => {
        // Save application to local storage (in production, this would go to a database)
        const applications = JSON.parse(localStorage.getItem('ayushApplications') || '[]');
        applications.push(registrationData);
        localStorage.setItem('ayushApplications', JSON.stringify(applications));
        
        showNotification('Application submitted successfully!', 'success');
        window.location.href = 'application-success.html?id=' + registrationData.applicationId;
    }, 2000);
}

// File Upload Handling
function setupFileUploads() {
    const fileInputs = document.querySelectorAll('.file-upload input[type="file"]');
    
    fileInputs.forEach(input => {
        const fileLabel = input.nextElementSibling;
        const filePreview = input.parentElement.querySelector('.file-preview');
        
        input.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('File size must be less than 5MB', 'error');
                    this.value = '';
                    return;
                }
                
                // Check file type
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
                if (!allowedTypes.includes(file.type)) {
                    showNotification('Only PDF, JPG, and PNG files are allowed', 'error');
                    this.value = '';
                    return;
                }
                
                // Update label with file name
                fileLabel.textContent = file.name;
                
                // Show preview for images
                if (file.type.startsWith('image/') && filePreview) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        filePreview.style.display = 'block';
                        filePreview.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    });
}

// Dashboard Functions
function initDashboard() {
    loadUserApplications();
    loadNotifications();
    loadResources();
    setupDashboardInteractions();
}

function loadUserApplications() {
    const applicationsList = document.getElementById('applications-list');
    if (!applicationsList) return;
    
    // Get user data and applications
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;
    
    const allApplications = JSON.parse(localStorage.getItem('ayushApplications') || '[]');
    const userApplications = allApplications.filter(app => app.email === userData.email);
    
    if (userApplications.length === 0) {
        applicationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>No Applications Yet</h3>
                <p>Start your AYUSH startup registration by submitting a new application</p>
                <a href="registration.html" class="btn btn-primary">New Application</a>
            </div>
        `;
        return;
    }
    
    // Render applications
    applicationsList.innerHTML = '';
    userApplications.forEach(app => {
        const statusClass = getStatusClass(app.status);
        
        const appElement = document.createElement('div');
        appElement.className = 'application-card';
        appElement.innerHTML = `
            <div class="app-header">
                <h3>${app.startupName || 'Unnamed Startup'}</h3>
                <span class="status-badge ${statusClass}">${app.status}</span>
            </div>
            <div class="app-details">
                <p><strong>Application ID:</strong> ${app.applicationId}</p>
                <p><strong>Submitted:</strong> ${formatDate(app.submittedAt)}</p>
                <p><strong>Category:</strong> ${app.category || 'Not specified'}</p>
            </div>
            <div class="app-actions">
                <a href="application-details.html?id=${app.applicationId}" class="btn btn-secondary">View Details</a>
            </div>
        `;
        
        applicationsList.appendChild(appElement);
    });
}

function getStatusClass(status) {
    switch(status) {
        case 'Approved':
            return 'status-approved';
        case 'Rejected':
            return 'status-rejected';
        case 'Under Review':
            return 'status-pending';
        case 'More Info Required':
            return 'status-info';
        default:
            return 'status-pending';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function loadNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    if (!notificationsList) return;
    
    // Mock notifications for demo
    const notifications = [
        {
            id: 1,
            title: 'Application Update',
            message: 'Your application is currently under review.',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            read: false
        },
        {
            id: 2,
            title: 'New Resource Available',
            message: 'Check out the new guide on AYUSH funding opportunities.',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            read: true
        },
        {
            id: 3,
            title: 'Upcoming Webinar',
            message: 'Join our webinar on Ayurvedic product development next week.',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            read: true
        }
    ];
    
    // Render notifications
    notificationsList.innerHTML = '';
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        notificationElement.innerHTML = `
            <div class="notification-header">
                <h4>${notification.title}</h4>
                <span class="notification-date">${formatDate(notification.date)}</span>
            </div>
            <p>${notification.message}</p>
            <div class="notification-actions">
                <button class="mark-read-btn" data-id="${notification.id}">
                    ${notification.read ? 'Mark as unread' : 'Mark as read'}
                </button>
            </div>
        `;
        
        notificationsList.appendChild(notificationElement);
    });
    
    // Handle mark as read/unread
    const markReadBtns = document.querySelectorAll('.mark-read-btn');
    markReadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const notificationId = this.getAttribute('data-id');
            const notificationItem = this.closest('.notification-item');
            
            if (notificationItem.classList.contains('read')) {
                notificationItem.classList.remove('read');
                notificationItem.classList.add('unread');
                this.textContent = 'Mark as read';
            } else {
                notificationItem.classList.remove('unread');
                notificationItem.classList.add('read');
                this.textContent = 'Mark as unread';
            }
        });
    });
}

function loadResources() {
    const resourcesList = document.getElementById('resources-list');
    if (!resourcesList) return;
    
    // Mock resources for demo
    const resources = [
        {
            id: 1,
            title: 'AYUSH Funding Schemes',
            description: 'Comprehensive guide to all available funding schemes for AYUSH startups.',
            icon: 'fas fa-hand-holding-usd'
        },
        {
            id: 2,
            title: 'Regulatory Compliance Guide',
            description: 'Step-by-step guide to ensure your AYUSH startup meets all regulatory requirements.',
            icon: 'fas fa-clipboard-check'
        },
        {
            id: 3,
            title: 'Marketing Your AYUSH Products',
            description: 'Learn effective strategies for marketing AYUSH products in the competitive market.',
            icon: 'fas fa-chart-line'
        },
        {
            id: 4,
            title: 'Intellectual Property Rights',
            description: 'Protecting your AYUSH innovations through patents, trademarks, and copyrights.',
            icon: 'fas fa-shield-alt'
        }
    ];
    
    // Render resources
    resourcesList.innerHTML = '';
    resources.forEach(resource => {
        const resourceElement = document.createElement('div');
        resourceElement.className = 'resource-card';
        resourceElement.innerHTML = `
            <div class="resource-icon">
                <i class="${resource.icon}"></i>
            </div>
            <div class="resource-content">
                <h3>${resource.title}</h3>
                <p>${resource.description}</p>
                <a href="resource-details.html?id=${resource.id}" class="btn btn-text">View Resource <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        
        resourcesList.appendChild(resourceElement);
    });
}

function setupDashboardInteractions() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.dashboard-tabs button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length && tabContents.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Show active tab content
                tabContents.forEach(content => {
                    if (content.getAttribute('id') === tabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }
}

// Admin Panel Functions
function initAdminPanel() {
    loadAllApplications();
    setupAdminInteractions();
}

function loadAllApplications() {
    const adminAppList = document.getElementById('admin-applications-list');
    if (!adminAppList) return;
    
    const allApplications = JSON.parse(localStorage.getItem('ayushApplications') || '[]');
    
    if (allApplications.length === 0) {
        adminAppList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No Applications Submitted Yet</h3>
                <p>Applications will appear here once startups begin submitting them</p>
            </div>
        `;
        return;
    }
    
    // Sort applications by date (newest first)
    allApplications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    // Render applications
    adminAppList.innerHTML = '';
    allApplications.forEach(app => {
        const statusClass = getStatusClass(app.status);
        
        const appElement = document.createElement('div');
        appElement.className = 'admin-app-card';
        appElement.innerHTML = `
            <div class="admin-app-header">
                <h3>${app.startupName || 'Unnamed Startup'}</h3>
                <span class="status-badge ${statusClass}">${app.status}</span>
            </div>
            <div class="admin-app-details">
                <p><strong>ID:</strong> ${app.applicationId}</p>
                <p><strong>Submitted:</strong> ${formatDate(app.submittedAt)}</p>
                <p><strong>Category:</strong> ${app.category || 'Not specified'}</p>
                <p><strong>Founder:</strong> ${app.founderName || 'Not specified'}</p>
                <p><strong>Email:</strong> ${app.email || 'Not specified'}</p>
            </div>
            <div class="admin-app-actions">
                <button class="btn btn-primary review-app-btn" data-id="${app.applicationId}">Review</button>
            </div>
        `;
        
        adminAppList.appendChild(appElement);
    });
    
    // Setup review buttons
    const reviewButtons = document.querySelectorAll('.review-app-btn');
    reviewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appId = this.getAttribute('data-id');
            showApplicationReviewModal(appId);
        });
    });
}

function showApplicationReviewModal(appId) {
    const allApplications = JSON.parse(localStorage.getItem('ayushApplications') || '[]');
    const application = allApplications.find(app => app.applicationId === appId);
    
    if (!application) {
        showNotification('Application not found', 'error');
        return;
    }
    
    // Create modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    modalContainer.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Review Application: ${application.startupName || 'Unnamed'}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="app-review-details">
                    <div class="app-review-section">
                        <h3>Basic Information</h3>
                        <p><strong>Application ID:</strong> ${application.applicationId}</p>
                        <p><strong>Submitted:</strong> ${formatDate(application.submittedAt)}</p>
                        <p><strong>Current Status:</strong> ${application.status}</p>
                    </div>
                    
                    <div class="app-review-section">
                        <h3>Startup Details</h3>
                        <p><strong>Startup Name:</strong> ${application.startupName || 'Not provided'}</p>
                        <p><strong>Category:</strong> ${application.category || 'Not provided'}</p>
                        <p><strong>Founded:</strong> ${application.foundedYear || 'Not provided'}</p>
                        <p><strong>Website:</strong> ${application.website || 'Not provided'}</p>
                        <p><strong>Description:</strong> ${application.description || 'Not provided'}</p>
                    </div>
                    
                    <div class="app-review-section">
                        <h3>Founder Information</h3>
                        <p><strong>Name:</strong> ${application.founderName || 'Not provided'}</p>
                        <p><strong>Email:</strong> ${application.email || 'Not provided'}</p>
                        <p><strong>Phone:</strong> ${application.phone || 'Not provided'}</p>
                    </div>
                </div>
                
                <div class="admin-decision">
                    <h3>Update Application Status</h3>
                    <div class="status-options">
                        <select id="status-update">
                            <option value="Under Review" ${application.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                            <option value="More Info Required" ${application.status === 'More Info Required' ? 'selected' : ''}>More Info Required</option>
                            <option value="Approved" ${application.status === 'Approved' ? 'selected' : ''}>Approved</option>
                            <option value="Rejected" ${application.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </div>
                    
                    <div class="admin-feedback">
                        <label for="admin-notes">Notes/Feedback:</label>
                        <textarea id="admin-notes" rows="4">${application.adminNotes || ''}</textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal-btn">Cancel</button>
                <button class="btn btn-primary save-decision-btn">Save Decision</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Close modal functionality
    const closeButtons = modalContainer.querySelectorAll('.close-modal, .close-modal-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modalContainer.remove();
        });
    });
    
    // Save decision functionality
    const saveButton = modalContainer.querySelector('.save-decision-btn');
    saveButton.addEventListener('click', function() {
        const newStatus = document.getElementById('status-update').value;
        const adminNotes = document.getElementById('admin-notes').value;
        
        updateApplicationStatus(appId, newStatus, adminNotes);
        modalContainer.remove();
    });
}

function updateApplicationStatus(appId, newStatus, adminNotes) {
    const allApplications = JSON.parse(localStorage.getItem('ayushApplications') || '[]');
    const appIndex = allApplications.findIndex(app => app.applicationId === appId);
    
    if (appIndex !== -1) {
        allApplications[appIndex].status = newStatus;
        allApplications[appIndex].adminNotes = adminNotes;
        allApplications[appIndex].lastUpdated = new Date().toISOString();
        
        localStorage.setItem('ayushApplications', JSON.stringify(allApplications));
        
        showNotification(`Application status updated to: ${newStatus}`, 'success');
        
        // Refresh the applications list
        loadAllApplications();
    } else {
        showNotification('Error updating application status', 'error');
    }

}

function setupAdminInteractions() {
    // Filter functionality
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterApplicationsByStatus(this.value);
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-applications');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchApplications(this.value);
        });
    }
    
    // Setup certificate generation
    setupCertificateGeneration();
}

function filterApplicationsByStatus(status) {
    const appCards = document.querySelectorAll('.admin-app-card');
    
    appCards.forEach(card => {
        const cardStatus = card.querySelector('.status-badge').textContent;
        
        if (status === 'all' || cardStatus === status) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchApplications(query) {
    query = query.toLowerCase();
    const appCards = document.querySelectorAll('.admin-app-card');
    
    appCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        
        if (cardText.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function setupCertificateGeneration() {
    const generateCertButtons = document.querySelectorAll('.generate-cert-btn');
    
    generateCertButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appId = this.getAttribute('data-id');
            generateCertificate(appId);
        });
    });
}

function generateCertificate(appId) {
    const allApplications = JSON.parse(localStorage.getItem('ayushApplications') || '[]');
    const application = allApplications.find(app => app.applicationId === appId);
    
    if (!application) {
        showNotification('Application not found', 'error');
        return;
    }
    
    if (application.status !== 'Approved') {
        showNotification('Cannot generate certificate for unapproved application', 'error');
        return;
    }
    
    // In a real app, this would generate a PDF certificate
    // For demo, we'll create a simple modal with certificate details
    
    const certDate = new Date().toLocaleDateString('en-IN');
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 2);
    const validUntilDate = validUntil.toLocaleDateString('en-IN');
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    modalContainer.innerHTML = `
        <div class="modal-content certificate-modal">
            <div class="modal-header">
                <h2>AYUSH Startup Certificate</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="certificate">
                    <div class="certificate-header">
                        <img src="img/ayush-logo.png" alt="AYUSH Logo" class="cert-logo">
                        <h2>Ministry of AYUSH</h2>
                        <h3>Government of India</h3>
                    </div>
                    
                    <div class="certificate-title">
                        <h1>Certificate of Recognition</h1>
                    </div>
                    
                    <div class="certificate-content">
                        <p>This is to certify that</p>
                        <h2 class="startup-name">${application.startupName}</h2>
                        <p>has been recognized as an AYUSH Startup under the</p>
                        <h3>AYUSH Startup Initiative</h3>
                        <p>by the Ministry of AYUSH, Government of India</p>
                        
                        <div class="certificate-details">
                            <p><strong>Certificate Number:</strong> AYUSH-CERT-${Math.floor(Math.random() * 10000)}</p>
                            <p><strong>Issued Date:</strong> ${certDate}</p>
                            <p><strong>Valid Until:</strong> ${validUntilDate}</p>
                        </div>
                    </div>
                    
                    <div class="certificate-footer">
                        <div class="signature">
                            <div class="sign-placeholder">Signature</div>
                            <p>Secretary, Ministry of AYUSH</p>
                        </div>
                        <div class="cert-seal">
                            <div class="seal-placeholder">SEAL</div>
                        </div>
                    </div>
                </div>
                
                <div class="certificate-actions">
                    <button class="btn btn-primary download-cert-btn">Download Certificate</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Close modal functionality
    const closeButtons = modalContainer.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modalContainer.remove();
        });
    });
    
    // Download certificate functionality (simulated)
    const downloadButton = modalContainer.querySelector('.download-cert-btn');
    downloadButton.addEventListener('click', function() {
        showNotification('Certificate download started...', 'success');
        setTimeout(() => {
            modalContainer.remove();
        }, 1500);
    });
}

// Utility Functions

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Close notification on click
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 500);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        case 'info':
        default:
            return 'fas fa-info-circle';
    }
}

// Service Worker Registration for offline functionality
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    }
}

// Setup general UI interactions
function setupUIInteractions() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Setup accordion elements
    setupAccordions();
    
    // Setup tooltips
    setupTooltips();
    
    // Setup modals
    setupModals();
}

function setupAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        header.addEventListener('click', function() {
            // Toggle current item
            item.classList.toggle('active');
            
            // Close other items (uncomment for single open accordion)
            /*
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            */
        });
    });
}

function setupTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        const tooltipText = trigger.getAttribute('data-tooltip');
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        // Add tooltip on hover
        trigger.addEventListener('mouseenter', function() {
            document.body.appendChild(tooltip);
            
            // Position tooltip
            const triggerRect = trigger.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            tooltip.style.top = `${triggerRect.top - tooltipRect.height - 10 + window.scrollY}px`;
            tooltip.style.left = `${triggerRect.left + (triggerRect.width/2) - (tooltipRect.width/2)}px`;
            
            // Add active class for animation
            setTimeout(() => {
                tooltip.classList.add('active');
            }, 10);
        });
        
        // Remove tooltip on mouse leave
        trigger.addEventListener('mouseleave', function() {
            const activeTooltip = document.querySelector('.tooltip.active');
            if (activeTooltip) {
                activeTooltip.classList.remove('active');
                setTimeout(() => {
                    if (document.body.contains(activeTooltip)) {
                        document.body.removeChild(activeTooltip);
                    }
                }, 300);
            }
        });
    });
}

function setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        const modalId = trigger.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        
        if (!modal) return;
        
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
        });
        
        // Setup close buttons
        const closeButtons = modal.querySelectorAll('.close-modal, .modal-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        });
        
        // Close on click outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Handle application details page
function loadApplicationDetails() {
    const appDetailsContainer = document.getElementById('application-details');
    if (!appDetailsContainer) return;
    
    // Get application ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');
    
    if (!appId) {
        appDetailsContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Application ID Not Found</h3>
                <p>Please return to dashboard and select a valid application</p>
                <a href="dashboard.html" class="btn btn-primary">Return to Dashboard</a>
            </div>
        `;
        return;
    }
    
    // Get application data
    const allApplications = JSON.parse(localStorage.getItem('ayushApplications') || '[]');
    const application = allApplications.find(app => app.applicationId === appId);
    
    if (!application) {
        appDetailsContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Application Not Found</h3>
                <p>The requested application could not be found</p>
                <a href="dashboard.html" class="btn btn-primary">Return to Dashboard</a>
            </div>
        `;
        return;
    }
    
    // Render application details
    const statusClass = getStatusClass(application.status);
    appDetailsContainer.innerHTML = `
        <div class="app-details-header">
            <h2>${application.startupName || 'Unnamed Startup'}</h2>
            <span class="status-badge ${statusClass}">${application.status}</span>
        </div>
        
        <div class="app-details-timeline">
            <div class="timeline-item ${application.status !== 'Under Review' ? 'completed' : 'active'}">
                <div class="timeline-point"></div>
                <div class="timeline-content">
                    <h3>Application Submitted</h3>
                    <p>${formatDate(application.submittedAt)}</p>
                </div>
            </div>
            
            <div class="timeline-item ${application.status === 'Under Review' ? 'active' : (application.status !== 'Submitted' ? 'completed' : '')}">
                <div class="timeline-point"></div>
                <div class="timeline-content">
                    <h3>Under Review</h3>
                    <p>Your application is being reviewed by our team</p>
                </div>
            </div>
            
            <div class="timeline-item ${application.status === 'More Info Required' ? 'active' : (application.status === 'Approved' || application.status === 'Rejected' ? 'completed' : '')}">
                <div class="timeline-point"></div>
                <div class="timeline-content">
                    <h3>Additional Information</h3>
                    <p>${application.status === 'More Info Required' ? 'Please provide additional information' : 'No additional information needed'}</p>
                </div>
            </div>
            
            <div class="timeline-item ${application.status === 'Approved' || application.status === 'Rejected' ? 'active' : ''}">
                <div class="timeline-point"></div>
                <div class="timeline-content">
                    <h3>Final Decision</h3>
                    <p>${application.status === 'Approved' ? 'Your application has been approved!' : (application.status === 'Rejected' ? 'Your application was not approved' : 'Pending final decision')}</p>
                </div>
            </div>
        </div>
        
        <div class="app-details-sections">
            <div class="app-details-section">
                <h3>Basic Information</h3>
                <div class="details-grid">
                    <div class="details-item">
                        <span class="detail-label">Application ID</span>
                        <span class="detail-value">${application.applicationId}</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">Submitted Date</span>
                        <span class="detail-value">${formatDate(application.submittedAt)}</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">Current Status</span>
                        <span class="detail-value status-text ${statusClass}">${application.status}</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">Last Updated</span>
                        <span class="detail-value">${application.lastUpdated ? formatDate(application.lastUpdated) : 'Not updated yet'}</span>
                    </div>
                </div>
            </div>
            
            <div class="app-details-section">
                <h3>Startup Information</h3>
                <div class="details-grid">
                    <div class="details-item">
                        <span class="detail-label">Startup Name</span>
                        <span class="detail-value">${application.startupName || 'Not provided'}</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">AYUSH Category</span>
                        <span class="detail-value">${application.category || 'Not provided'}</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">Founded Year</span>
                        <span class="detail-value">${application.foundedYear || 'Not provided'}</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">Website</span>
                        <span class="detail-value">${application.website ? `<a href="${application.website}" target="_blank">${application.website}</a>` : 'Not provided'}</span>
                    </div>
                </div>
            </div>
            
            <div class="app-details-section">
                <h3>Founder Information</h3>
                <div class="details-grid">
                    <div class="details-item">
                        <span class="detail-label">Founder Name</span>
                        <span class="detail-value">${application.founderName || 'Not provided'}</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${application.email || 'Not provided'}</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${application.phone || 'Not provided'}</span>
                    </div>
                </div>
            </div>
            
            ${application.adminNotes ? `
            <div class="app-details-section">
                <h3>Feedback from AYUSH</h3>
                <div class="admin-feedback-box">
                    <p>${application.adminNotes}</p>
                </div>
            </div>
            ` : ''}
            
            ${application.status === 'More Info Required' ? `
            <div class="app-details-section">
                <h3>Additional Information Required</h3>
                <div class="additional-info-form">
                    <form id="additional-info-form">
                        <input type="hidden" name="applicationId" value="${application.applicationId}">
                        <div class="form-group">
                            <label for="additional-info">Please provide the requested information:</label>
                            <textarea id="additional-info" name="additionalInfo" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit Additional Information</button>
                    </form>
                </div>
            </div>
            ` : ''}
            
            ${application.status === 'Approved' ? `
            <div class="app-details-section">
                <h3>Congratulations!</h3>
                <div class="approval-information">
                    <p>Your startup has been officially recognized under the AYUSH Startup Initiative. You can now download your certificate and access exclusive resources.</p>
                    <button class="btn btn-primary download-certificate-btn" data-id="${application.applicationId}">
                        <i class="fas fa-certificate"></i> Download Certificate
                    </button>
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    // Setup additional info form submission if it exists
    const additionalInfoForm = document.getElementById('additional-info-form');
    if (additionalInfoForm) {
        additionalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const additionalInfo = document.getElementById('additional-info').value;
            submitAdditionalInfo(application.applicationId, additionalInfo);
        });
    }
    
    // Setup certificate download if available
    const downloadCertBtn = document.querySelector('.download-certificate-btn');
    if (downloadCertBtn) {
        downloadCertBtn.addEventListener('click', function() {
            generateCertificate(application.applicationId);
        });
    }
}

function submitAdditionalInfo(appId, additionalInfo) {
    showNotification('Submitting additional information...', 'info');
    
    // In a real app, this would be an API call
    setTimeout(() => {
        const allApplications = JSON.parse(localStorage.getItem('ayushApplications') || '[]');
        const appIndex = allApplications.findIndex(app => app.applicationId === appId);
        
        if (appIndex !== -1) {
            allApplications[appIndex].additionalInfo = additionalInfo;
            allApplications[appIndex].status = 'Under Review';
            allApplications[appIndex].lastUpdated = new Date().toISOString();
            
            localStorage.setItem('ayushApplications', JSON.stringify(allApplications));
            
            showNotification('Additional information submitted successfully', 'success');
            
            // Reload the page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showNotification('Error submitting additional information', 'error');
        }
    }, 1500);
}

// Handle application success page
function setupApplicationSuccessPage() {
    const successContainer = document.getElementById('application-success');
    if (!successContainer) return;
    
    // Get application ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');
    
    if (!appId) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Set application ID in success message
    const appIdSpan = document.getElementById('success-app-id');
    if (appIdSpan) {
        appIdSpan.textContent = appId;
    }
    
    // Countdown redirect
    let countdown = 10;
    const countdownEl = document.getElementById('redirect-countdown');
    
    if (countdownEl) {
        const interval = setInterval(() => {
            countdown--;
            countdownEl.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(interval);
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    }
}

// Initialize page-specific functions
document.addEventListener('DOMContentLoaded', function() {
    // Call general initialization
    initApp();
    
    // Call page-specific initialization
    if (document.querySelector('.dashboard-container')) {
        initDashboard();
    }
    
    if (document.querySelector('.admin-panel')) {
        initAdminPanel();
    }
    
    if (document.getElementById('application-details')) {
        loadApplicationDetails();
    }
    
    if (document.getElementById('application-success')) {
        setupApplicationSuccessPage();
    }
    
    // Set up general UI interactions
    setupUIInteractions();
});