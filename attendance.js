// Attendance Module for NIIT Student Management System

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const attendanceForm = document.getElementById('attendance-form');
    const attendanceDate = document.getElementById('attendance-date');
    const attendanceCourse = document.getElementById('attendance-course');
    const attendanceSession = document.getElementById('attendance-session');
    const loadStudentsBtn = document.getElementById('load-students-btn');
    const attendanceList = document.getElementById('attendance-list');
    const studentsAttendanceList = document.getElementById('students-attendance-list');
    const courseNameDisplay = document.getElementById('course-name-display');
    const dateDisplay = document.getElementById('date-display');
    const totalStudentsDisplay = document.getElementById('total-students-display');
    const markAllPresentCheckbox = document.getElementById('mark-all-present');
    const saveAttendanceBtn = document.getElementById('save-attendance-btn');
    
    // Filter elements
    const filterCourse = document.getElementById('filter-course');
    const filterDateFrom = document.getElementById('filter-date-from');
    const filterDateTo = document.getElementById('filter-date-to');
    const filterRecordsBtn = document.getElementById('filter-records-btn');
    const attendanceRecordsTable = document.getElementById('attendance-records-table');
    
    // Report elements
    const reportStudent = document.getElementById('report-student');
    const reportStudentFrom = document.getElementById('report-student-from');
    const reportStudentTo = document.getElementById('report-student-to');
    const generateStudentReportBtn = document.getElementById('generate-student-report-btn');
    
    const reportCourse = document.getElementById('report-course');
    const reportCourseFrom = document.getElementById('report-course-from');
    const reportCourseTo = document.getElementById('report-course-to');
    const generateCourseReportBtn = document.getElementById('generate-course-report-btn');
    
    // State variables
    let loadedStudents = [];
    let attendanceRecords = [];
    let currentAttendanceRecord = null;
    
    // Event Listeners
    if (attendanceDate) {
        // Set default date to today
        attendanceDate.value = app.getCurrentDate();
    }
    
    if (loadStudentsBtn) {
        loadStudentsBtn.addEventListener('click', loadStudentsForAttendance);
    }
    
    if (markAllPresentCheckbox) {
        markAllPresentCheckbox.addEventListener('change', function() {
            markAllStudents(this.checked ? 'Present' : '');
        });
    }
    
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', saveAttendance);
    }
    
    if (filterRecordsBtn) {
        filterRecordsBtn.addEventListener('click', loadAttendanceRecords);
    }
    
    if (generateStudentReportBtn) {
        generateStudentReportBtn.addEventListener('click', generateStudentReport);
    }
    
    if (generateCourseReportBtn) {
        generateCourseReportBtn.addEventListener('click', generateCourseReport);
    }
    
    // Initialize
    initAttendancePage();
    
    function initAttendancePage() {
        loadCourses();
        loadStudents();
        loadAttendanceRecords();
        
        // Set default dates for reports
        const today = app.getCurrentDate();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];
        
        if (reportStudentFrom) reportStudentFrom.value = oneMonthAgoStr;
        if (reportStudentTo) reportStudentTo.value = today;
        if (reportCourseFrom) reportCourseFrom.value = oneMonthAgoStr;
        if (reportCourseTo) reportCourseTo.value = today;
        if (filterDateFrom) filterDateFrom.value = oneMonthAgoStr;
        if (filterDateTo) filterDateTo.value = today;
    }
    
    async function loadCourses() {
        try {
            // In a real app, this would fetch from Supabase
            // For demo purposes, we'll use hardcoded values
            const courses = [
                { id: 1, code: 'CS101', name: 'Web Development' },
                { id: 2, code: 'CS102', name: 'Mobile App Development' },
                { id: 3, code: 'IT101', name: 'Database Management' },
                { id: 4, code: 'DS101', name: 'Machine Learning' }
            ];
            
            // Populate course dropdown in attendance form
            if (attendanceCourse) {
                let html = '<option value="" selected disabled>Select Course</option>';
                courses.forEach(course => {
                    html += `<option value="${course.id}" data-name="${course.name}">${course.code} - ${course.name}</option>`;
                });
                attendanceCourse.innerHTML = html;
            }
            
            // Populate course dropdown in filter
            if (filterCourse) {
                let html = '<option value="">All Courses</option>';
                courses.forEach(course => {
                    html += `<option value="${course.id}">${course.code} - ${course.name}</option>`;
                });
                filterCourse.innerHTML = html;
            }
            
            // Populate course dropdown in reports
            if (reportCourse) {
                let html = '<option value="" selected disabled>Select Course</option>';
                courses.forEach(course => {
                    html += `<option value="${course.id}">${course.code} - ${course.name}</option>`;
                });
                reportCourse.innerHTML = html;
            }
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    }
    
    async function loadStudents() {
        try {
            // In a real app, this would fetch from Supabase
            // For demo purposes, we'll use hardcoded values
            const students = [
                { id: 'STU001', name: 'John Doe' },
                { id: 'STU002', name: 'Jane Smith' },
                { id: 'STU003', name: 'Michael Johnson' },
                { id: 'STU004', name: 'Emily Davis' },
                { id: 'STU005', name: 'David Wilson' }
            ];
            
            // Populate student dropdown in reports
            if (reportStudent) {
                let html = '<option value="" selected disabled>Select Student</option>';
                students.forEach(student => {
                    html += `<option value="${student.id}">${student.id} - ${student.name}</option>`;
                });
                reportStudent.innerHTML = html;
            }
        } catch (error) {
            console.error('Error loading students:', error);
        }
    }
    
    async function loadStudentsForAttendance() {
        const date = attendanceDate.value;
        const courseId = attendanceCourse.value;
        const session = attendanceSession.value;
        
        if (!date || !courseId) {
            app.showToast('Please select a date and course', 'warning');
            return;
        }
        
        try {
            app.showSpinner();
            
            // Get course name
            const courseName = attendanceCourse.options[attendanceCourse.selectedIndex].dataset.name;
            
            // In a real app, this would fetch enrolled students from Supabase
            // For demo purposes, we'll use mock data
            const result = await fetchStudentsForCourse(courseId);
            
            loadedStudents = result.students;
            
            // Update display elements
            if (courseNameDisplay) courseNameDisplay.textContent = courseName;
            if (dateDisplay) dateDisplay.textContent = app.formatDate(date);
            if (totalStudentsDisplay) totalStudentsDisplay.textContent = loadedStudents.length;
            
            // Show attendance list
            if (attendanceList) attendanceList.classList.remove('d-none');
            
            // Render students list
            renderStudentsAttendanceList();
            
            app.showToast('Students loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading students for attendance:', error);
            app.showToast('Failed to load students', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function fetchStudentsForCourse(courseId) {
        // In a real app, this would query Supabase
        // For demo purposes, we'll return mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const students = [
            {
                id: 'STU001',
                name: 'John Doe',
                status: '',
                notes: ''
            },
            {
                id: 'STU002',
                name: 'Jane Smith',
                status: '',
                notes: ''
            },
            {
                id: 'STU003',
                name: 'Michael Johnson',
                status: '',
                notes: ''
            },
            {
                id: 'STU004',
                name: 'Emily Davis',
                status: '',
                notes: ''
            },
            {
                id: 'STU005',
                name: 'David Wilson',
                status: '',
                notes: ''
            }
        ];
        
        return {
            students: students
        };
    }
    
    function renderStudentsAttendanceList() {
        if (!studentsAttendanceList) return;
        
        if (loadedStudents.length === 0) {
            studentsAttendanceList.innerHTML = '<tr><td colspan="5" class="text-center">No students found for this course</td></tr>';
            return;
        }
        
        let html = '';
        
        loadedStudents.forEach((student, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="status-${student.id}" id="present-${student.id}" value="Present" ${student.status === 'Present' ? 'checked' : ''}>
                            <label class="form-check-label text-success" for="present-${student.id}">Present</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="status-${student.id}" id="absent-${student.id}" value="Absent" ${student.status === 'Absent' ? 'checked' : ''}>
                            <label class="form-check-label text-danger" for="absent-${student.id}">Absent</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="status-${student.id}" id="late-${student.id}" value="Late" ${student.status === 'Late' ? 'checked' : ''}>
                            <label class="form-check-label text-warning" for="late-${student.id}">Late</label>
                        </div>
                    </td>
                    <td>
                        <input type="text" class="form-control form-control-sm" id="notes-${student.id}" placeholder="Notes (optional)" value="${student.notes || ''}">
                    </td>
                </tr>
            `;
        });
        
        studentsAttendanceList.innerHTML = html;
    }
    
    function markAllStudents(status) {
        if (!studentsAttendanceList) return;
        
        loadedStudents.forEach(student => {
            const statusRadio = document.getElementById(`${status.toLowerCase()}-${student.id}`);
            if (statusRadio) {
                statusRadio.checked = true;
                student.status = status;
            }
        });
    }
    
    async function saveAttendance() {
        const date = attendanceDate.value;
        const courseId = attendanceCourse.value;
        const session = attendanceSession.value;
        
        if (!date || !courseId) {
            app.showToast('Please select a date and course', 'warning');
            return;
        }
        
        // Validate that all students have a status
        const missingStatus = loadedStudents.some(student => !document.querySelector(`input[name="status-${student.id}"]:checked`));
        
        if (missingStatus) {
            app.showToast('Please mark attendance for all students', 'warning');
            return;
        }
        
        try {
            app.showSpinner();
            
            // Collect attendance data
            const attendanceData = loadedStudents.map(student => {
                const statusRadio = document.querySelector(`input[name="status-${student.id}"]:checked`);
                const notesInput = document.getElementById(`notes-${student.id}`);
                
                return {
                    studentId: student.id,
                    studentName: student.name,
                    status: statusRadio ? statusRadio.value : '',
                    notes: notesInput ? notesInput.value : ''
                };
            });
            
            // In a real app, this would save to Supabase
            // For demo purposes, we'll simulate a successful save
            await saveAttendanceData(date, courseId, session, attendanceData);
            
            // Reset form
            resetAttendanceForm();
            
            app.showToast('Attendance saved successfully', 'success');
            
            // Reload attendance records
            loadAttendanceRecords();
        } catch (error) {
            console.error('Error saving attendance:', error);
            app.showToast('Failed to save attendance', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function saveAttendanceData(date, courseId, session, attendanceData) {
        // In a real app, this would save to Supabase
        // For demo purposes, we'll simulate an API call
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be handled by the server
        console.log('Saving attendance:', { date, courseId, session, attendanceData });
        
        return { success: true };
    }
    
    function resetAttendanceForm() {
        // Reset form fields
        if (attendanceForm) attendanceForm.reset();
        
        // Reset date to today
        if (attendanceDate) attendanceDate.value = app.getCurrentDate();
        
        // Hide attendance list
        if (attendanceList) attendanceList.classList.add('d-none');
        
        // Reset loaded students
        loadedStudents = [];
        
        // Reset mark all checkbox
        if (markAllPresentCheckbox) markAllPresentCheckbox.checked = false;
    }
    
    async function loadAttendanceRecords() {
        const courseId = filterCourse ? filterCourse.value : '';
        const dateFrom = filterDateFrom ? filterDateFrom.value : '';
        const dateTo = filterDateTo ? filterDateTo.value : '';
        
        try {
            app.showSpinner();
            
            // In a real app, this would fetch from Supabase with filters
            // For demo purposes, we'll use mock data
            const result = await fetchAttendanceRecords(courseId, dateFrom, dateTo);
            
            attendanceRecords = result.records;
            
            renderAttendanceRecordsTable();
        } catch (error) {
            console.error('Error loading attendance records:', error);
            app.showToast('Failed to load attendance records', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function fetchAttendanceRecords(courseId, dateFrom, dateTo) {
        // In a real app, this would query Supabase
        // For demo purposes, we'll return mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const records = [
            {
                id: 1,
                date: '2023-09-01',
                courseId: 1,
                courseName: 'Web Development',
                session: 'Morning',
                present: 25,
                absent: 0,
                late: 0,
                percentage: 100
            },
            {
                id: 2,
                date: '2023-09-02',
                courseId: 1,
                courseName: 'Web Development',
                session: 'Morning',
                present: 23,
                absent: 1,
                late: 1,
                percentage: 92
            },
            {
                id: 3,
                date: '2023-09-03',
                courseId: 1,
                courseName: 'Web Development',
                session: 'Morning',
                present: 22,
                absent: 3,
                late: 0,
                percentage: 88
            },
            {
                id: 4,
                date: '2023-09-01',
                courseId: 2,
                courseName: 'Mobile App Development',
                session: 'Afternoon',
                present: 18,
                absent: 2,
                late: 0,
                percentage: 90
            },
            {
                id: 5,
                date: '2023-09-02',
                courseId: 2,
                courseName: 'Mobile App Development',
                session: 'Afternoon',
                present: 17,
                absent: 3,
                late: 0,
                percentage: 85
            }
        ];
        
        // Apply filters
        let filteredRecords = [...records];
        
        if (courseId) {
            filteredRecords = filteredRecords.filter(record => 
                record.courseId === parseInt(courseId)
            );
        }
        
        if (dateFrom) {
            filteredRecords = filteredRecords.filter(record => 
                record.date >= dateFrom
            );
        }
        
        if (dateTo) {
            filteredRecords = filteredRecords.filter(record => 
                record.date <= dateTo
            );
        }
        
        return {
            records: filteredRecords
        };
    }
    
    function renderAttendanceRecordsTable() {
        if (!attendanceRecordsTable) return;
        
        if (attendanceRecords.length === 0) {
            attendanceRecordsTable.innerHTML = '<tr><td colspan="8" class="text-center">No attendance records found</td></tr>';
            return;
        }
        
        let html = '';
        
        attendanceRecords.forEach(record => {
            html += `
                <tr>
                    <td>${app.formatDate(record.date)}</td>
                    <td>${record.courseName}</td>
                    <td>${record.session}</td>
                    <td>${record.present}</td>
                    <td>${record.absent}</td>
                    <td>${record.late}</td>
                    <td>${record.percentage}%</td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-info view-attendance" data-id="${record.id}">
                                <i class="bi bi-eye"></i> View
                            </button>
                            <button type="button" class="btn btn-primary edit-attendance" data-id="${record.id}">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        attendanceRecordsTable.innerHTML = html;
        
        // Add event listeners to buttons
        const viewButtons = attendanceRecordsTable.querySelectorAll('.view-attendance');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const recordId = parseInt(this.dataset.id);
                viewAttendanceRecord(recordId);
            });
        });
        
        const editButtons = attendanceRecordsTable.querySelectorAll('.edit-attendance');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const recordId = parseInt(this.dataset.id);
                editAttendanceRecord(recordId);
            });
        });
    }
    
    async function viewAttendanceRecord(recordId) {
        try {
            app.showSpinner();
            
            // In a real app, this would fetch from Supabase
            // For demo purposes, we'll find the record in our local array
            const record = attendanceRecords.find(r => r.id === recordId);
            
            if (!record) {
                throw new Error('Attendance record not found');
            }
            
            // Store current record for later use
            currentAttendanceRecord = record;
            
            // Fetch attendance details
            const details = await fetchAttendanceDetails(recordId);
            
            // Populate modal fields
            document.getElementById('view-course-name').textContent = record.courseName;
            document.getElementById('view-attendance-date').textContent = app.formatDate(record.date);
            document.getElementById('view-attendance-session').textContent = record.session;
            document.getElementById('view-total-students').textContent = record.present + record.absent + record.late;
            document.getElementById('view-attendance-rate').textContent = `${record.percentage}%`;
            document.getElementById('view-recorded-by').textContent = 'Admin';
            
            // Render attendance details table
            renderAttendanceDetailsTable(details);
            
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('viewAttendanceModal'));
            modal.show();
        } catch (error) {
            console.error('Error viewing attendance record:', error);
            app.showToast('Failed to load attendance details', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function fetchAttendanceDetails(recordId) {
        // In a real app, this would query Supabase
        // For demo purposes, we'll return mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock data
        const details = [
            {
                studentId: 'STU001',
                studentName: 'John Doe',
                status: 'Present',
                notes: ''
            },
            {
                studentId: 'STU002',
                studentName: 'Jane Smith',
                status: 'Present',
                notes: ''
            },
            {
                studentId: 'STU003',
                studentName: 'Michael Johnson',
                status: 'Absent',
                notes: 'Sick leave'
            },
            {
                studentId: 'STU004',
                studentName: 'Emily Davis',
                status: 'Present',
                notes: ''
            },
            {
                studentId: 'STU005',
                studentName: 'David Wilson',
                status: 'Late',
                notes: 'Traffic'
            }
        ];
        
        return details;
    }
    
    function renderAttendanceDetailsTable(details) {
        const detailsTable = document.getElementById('attendance-details-table');
        if (!detailsTable) return;
        
        if (details.length === 0) {
            detailsTable.innerHTML = '<tr><td colspan="4" class="text-center">No attendance details found</td></tr>';
            return;
        }
        
        let html = '';
        
        details.forEach(detail => {
            let statusClass = '';
            if (detail.status === 'Present') statusClass = 'text-success';
            else if (detail.status === 'Absent') statusClass = 'text-danger';
            else if (detail.status === 'Late') statusClass = 'text-warning';
            
            html += `
                <tr>
                    <td>${detail.studentId}</td>
                    <td>${detail.studentName}</td>
                    <td class="${statusClass}">${detail.status}</td>
                    <td>${detail.notes || '-'}</td>
                </tr>
            `;
        });
        
        detailsTable.innerHTML = html;
    }
    
    function editAttendanceRecord(recordId) {
        // In a real app, this would navigate to the edit attendance page
        // For demo purposes, we'll just show a message
        app.showToast('Edit attendance functionality would be implemented here', 'info');
    }
    
    async function generateStudentReport() {
        const studentId = reportStudent.value;
        const dateFrom = reportStudentFrom.value;
        const dateTo = reportStudentTo.value;
        
        if (!studentId || !dateFrom || !dateTo) {
            app.showToast('Please select a student and date range', 'warning');
            return;
        }
        
        try {
            app.showSpinner();
            
            // In a real app, this would generate a report from Supabase
            // For demo purposes, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, this would download a PDF or CSV
            app.showToast('Student attendance report generated successfully', 'success');
        } catch (error) {
            console.error('Error generating student report:', error);
            app.showToast('Failed to generate report', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function generateCourseReport() {
        const courseId = reportCourse.value;
        const dateFrom = reportCourseFrom.value;
        const dateTo = reportCourseTo.value;
        
        if (!courseId || !dateFrom || !dateTo) {
            app.showToast('Please select a course and date range', 'warning');
            return;
        }
        
        try {
            app.showSpinner();
            
            // In a real app, this would generate a report from Supabase
            // For demo purposes, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, this would download a PDF or CSV
            app.showToast('Course attendance report generated successfully', 'success');
        } catch (error) {
            console.error('Error generating course report:', error);
            app.showToast('Failed to generate report', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
});
