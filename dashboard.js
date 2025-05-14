// Dashboard Module for NIIT Student Management System

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const totalStudentsElement = document.getElementById('total-students');
    const totalCoursesElement = document.getElementById('total-courses');
    const todayAttendanceElement = document.getElementById('today-attendance');
    const activeProgramsElement = document.getElementById('active-programs');
    const recentActivityTable = document.getElementById('recent-activity-table');
    const refreshDataBtn = document.getElementById('refresh-data-btn');
    const addStudentBtn = document.getElementById('add-student-btn');
    const saveStudentBtn = document.getElementById('save-student-btn');
    
    // Event Listeners
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', loadDashboardData);
    }
    
    if (saveStudentBtn) {
        saveStudentBtn.addEventListener('click', handleSaveStudent);
    }
    
    // Initialize Dashboard
    initDashboard();
    
    // Functions
    function initDashboard() {
        // Check if user is authenticated
        const isAuthenticated = checkAuthentication();
        
        if (isAuthenticated) {
            loadDashboardData();
        } else {
            // If using the auth.js module, it will handle redirecting to login
            console.log('User not authenticated');
        }
    }
    
    function checkAuthentication() {
        // In a real app, this would check the Supabase session
        // For demo purposes, we'll return true
        return true;
    }
    
    // This function is called from auth.js when login is successful
    window.loadDashboardData = loadDashboardData;
    
    async function loadDashboardData() {
        try {
            app.showSpinner();
            
            // In a real app, these would be actual Supabase queries
            // For demo purposes, we'll use mock data
            
            // Fetch dashboard stats
            const stats = await fetchDashboardStats();
            updateDashboardStats(stats);
            
            // Fetch recent activity
            const activities = await fetchRecentActivity();
            updateRecentActivity(activities);
            
            app.showToast('Dashboard data refreshed', 'success');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            app.showToast('Failed to load dashboard data', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function fetchDashboardStats() {
        // In a real app, this would fetch data from Supabase
        // For demo purposes, we'll return mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            totalStudents: 120,
            totalCourses: 15,
            todayAttendance: 85,
            activePrograms: 4
        };
    }
    
    async function fetchRecentActivity() {
        // In a real app, this would fetch data from Supabase
        // For demo purposes, we'll return mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return [
            {
                date: new Date(),
                action: 'Student Registration',
                user: 'Admin',
                details: 'Added new student: John Doe'
            },
            {
                date: new Date(Date.now() - 3600000), // 1 hour ago
                action: 'Course Created',
                user: 'Admin',
                details: 'Added new course: Web Development'
            },
            {
                date: new Date(Date.now() - 7200000), // 2 hours ago
                action: 'Attendance Marked',
                user: 'Admin',
                details: 'Marked attendance for Data Science class'
            },
            {
                date: new Date(Date.now() - 86400000), // 1 day ago
                action: 'Student Updated',
                user: 'Admin',
                details: 'Updated student info: Jane Smith'
            },
            {
                date: new Date(Date.now() - 172800000), // 2 days ago
                action: 'Course Assignment',
                user: 'Admin',
                details: 'Assigned 5 students to Mobile App Development'
            }
        ];
    }
    
    function updateDashboardStats(stats) {
        if (totalStudentsElement) {
            totalStudentsElement.textContent = stats.totalStudents;
        }
        
        if (totalCoursesElement) {
            totalCoursesElement.textContent = stats.totalCourses;
        }
        
        if (todayAttendanceElement) {
            todayAttendanceElement.textContent = `${stats.todayAttendance}%`;
        }
        
        if (activeProgramsElement) {
            activeProgramsElement.textContent = stats.activePrograms;
        }
    }
    
    function updateRecentActivity(activities) {
        if (!recentActivityTable) return;
        
        if (activities.length === 0) {
            recentActivityTable.innerHTML = '<tr><td colspan="4" class="text-center">No recent activity</td></tr>';
            return;
        }
        
        let html = '';
        
        activities.forEach(activity => {
            html += `
                <tr>
                    <td>${app.formatDateTime(activity.date)}</td>
                    <td>${activity.action}</td>
                    <td>${activity.user}</td>
                    <td>${activity.details}</td>
                </tr>
            `;
        });
        
        recentActivityTable.innerHTML = html;
    }
    
    async function handleSaveStudent() {
        const studentName = document.getElementById('student-name').value;
        const studentEmail = document.getElementById('student-email').value;
        const studentProgram = document.getElementById('student-program').value;
        const studentCourse = document.getElementById('student-course').value;
        const studentPhone = document.getElementById('student-phone').value;
        
        // Validate inputs
        if (!studentName || !studentEmail || !studentProgram || !studentCourse || !studentPhone) {
            app.showToast('Please fill in all required fields', 'warning');
            return;
        }
        
        if (!app.isValidEmail(studentEmail)) {
            app.showToast('Please enter a valid email address', 'warning');
            return;
        }
        
        if (!app.isValidPhone(studentPhone)) {
            app.showToast('Please enter a valid phone number', 'warning');
            return;
        }
        
        try {
            app.showSpinner();
            
            // In a real app, this would save to Supabase
            // For demo purposes, we'll simulate a successful save
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset form
            document.getElementById('add-student-form').reset();
            
            // Refresh dashboard data
            loadDashboardData();
            
            app.showToast('Student added successfully!', 'success');
        } catch (error) {
            console.error('Error saving student:', error);
            app.showToast('Failed to add student', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
});
