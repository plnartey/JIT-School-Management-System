// Courses Module for NIIT Student Management System

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const coursesTable = document.getElementById('courses-table');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('search-courses');
    const searchBtn = document.getElementById('search-btn');
    const filterProgram = document.getElementById('filter-program');
    const filterStatus = document.getElementById('filter-status');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const addCourseBtn = document.getElementById('add-course-btn');
    const saveCourseBtn = document.getElementById('save-course-btn');
    const courseForm = document.getElementById('course-form');
    const courseModal = document.getElementById('addCourseModal');
    const viewCourseModal = document.getElementById('viewCourseModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    // State variables
    let currentPage = 1;
    let pageSize = 10;
    let totalPages = 1;
    let courses = [];
    let currentCourse = null;
    let filters = {
        search: '',
        program: '',
        status: ''
    };
    
    // Event Listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            filters.search = searchInput.value.trim();
            currentPage = 1;
            loadCourses();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filters.search = searchInput.value.trim();
                currentPage = 1;
                loadCourses();
            }
        });
    }
    
    if (filterProgram) {
        filterProgram.addEventListener('change', function() {
            filters.program = this.value;
            currentPage = 1;
            loadCourses();
        });
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            filters.status = this.value;
            currentPage = 1;
            loadCourses();
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', function() {
            resetCourseForm();
            document.getElementById('addCourseModalLabel').textContent = 'Add New Course';
            currentCourse = null;
        });
    }
    
    if (saveCourseBtn) {
        saveCourseBtn.addEventListener('click', saveCourse);
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteCourse);
    }
    
    // Initialize
    initCoursesPage();
    
    function initCoursesPage() {
        loadCourses();
        setupEventDelegation();
    }
    
    async function loadCourses() {
        try {
            app.showSpinner();
            
            // In a real app, this would fetch from Supabase with filters
            // For demo purposes, we'll use mock data
            const result = await fetchCourses(currentPage, pageSize, filters);
            
            courses = result.data;
            totalPages = Math.ceil(result.total / pageSize);
            
            renderCoursesTable();
            renderPagination();
        } catch (error) {
            console.error('Error loading courses:', error);
            app.showToast('Failed to load courses', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function fetchCourses(page, pageSize, filters) {
        // In a real app, this would query Supabase
        // For demo purposes, we'll return mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const allCourses = [
            {
                id: 1,
                code: 'CS101',
                name: 'Web Development',
                program: 'Computer Science',
                duration: 12,
                credits: 4,
                capacity: 30,
                description: 'Introduction to web development using HTML, CSS, and JavaScript.',
                startDate: '2023-09-01',
                endDate: '2023-11-24',
                status: 'Active',
                students: 25
            },
            {
                id: 2,
                code: 'CS102',
                name: 'Mobile App Development',
                program: 'Computer Science',
                duration: 12,
                credits: 4,
                capacity: 25,
                description: 'Introduction to mobile app development for Android and iOS.',
                startDate: '2023-09-01',
                endDate: '2023-11-24',
                status: 'Active',
                students: 20
            },
            {
                id: 3,
                code: 'IT101',
                name: 'Database Management',
                program: 'Information Technology',
                duration: 10,
                credits: 3,
                capacity: 30,
                description: 'Introduction to database design, SQL, and database management systems.',
                startDate: '2023-09-01',
                endDate: '2023-11-10',
                status: 'Active',
                students: 28
            },
            {
                id: 4,
                code: 'DS101',
                name: 'Machine Learning',
                program: 'Data Science',
                duration: 14,
                credits: 5,
                capacity: 20,
                description: 'Introduction to machine learning algorithms and applications.',
                startDate: '2023-09-01',
                endDate: '2023-12-08',
                status: 'Active',
                students: 18
            },
            {
                id: 5,
                code: 'CS201',
                name: 'Software Engineering',
                program: 'Computer Science',
                duration: 16,
                credits: 5,
                capacity: 25,
                description: 'Advanced software engineering principles and practices.',
                startDate: '2024-01-15',
                endDate: '2024-05-03',
                status: 'Inactive',
                students: 0
            }
        ];
        
        // Apply filters
        let filteredCourses = [...allCourses];
        
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredCourses = filteredCourses.filter(course => 
                course.name.toLowerCase().includes(searchLower) ||
                course.code.toLowerCase().includes(searchLower) ||
                course.description.toLowerCase().includes(searchLower)
            );
        }
        
        if (filters.program) {
            filteredCourses = filteredCourses.filter(course => 
                course.program === filters.program
            );
        }
        
        if (filters.status) {
            filteredCourses = filteredCourses.filter(course => 
                course.status === filters.status
            );
        }
        
        // Paginate
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedCourses = filteredCourses.slice(start, end);
        
        return {
            data: paginatedCourses,
            total: filteredCourses.length
        };
    }
    
    function renderCoursesTable() {
        if (!coursesTable) return;
        
        if (courses.length === 0) {
            coursesTable.innerHTML = '<tr><td colspan="7" class="text-center">No courses found</td></tr>';
            return;
        }
        
        let html = '';
        
        courses.forEach(course => {
            const statusBadge = course.status === 'Active' 
                ? '<span class="badge bg-success">Active</span>' 
                : '<span class="badge bg-secondary">Inactive</span>';
            
            html += `
                <tr>
                    <td>${course.code}</td>
                    <td>${course.name}</td>
                    <td>${course.program}</td>
                    <td>${course.duration} weeks</td>
                    <td>${course.students}/${course.capacity}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-info view-course" data-id="${course.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button" class="btn btn-primary edit-course" data-id="${course.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-danger delete-course" data-id="${course.id}" data-code="${course.code}" data-name="${course.name}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        coursesTable.innerHTML = html;
    }
    
    function renderPagination() {
        if (!paginationContainer) return;
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let html = `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;
        
        paginationContainer.innerHTML = html;
        
        // Add event listeners to pagination links
        const pageLinks = paginationContainer.querySelectorAll('.page-link');
        pageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = parseInt(this.dataset.page);
                if (page && page !== currentPage && page > 0 && page <= totalPages) {
                    currentPage = page;
                    loadCourses();
                }
            });
        });
    }
    
    function setupEventDelegation() {
        // Event delegation for view, edit, and delete buttons
        if (coursesTable) {
            coursesTable.addEventListener('click', function(e) {
                const target = e.target.closest('.view-course, .edit-course, .delete-course');
                
                if (!target) return;
                
                const courseId = parseInt(target.dataset.id);
                
                if (target.classList.contains('view-course')) {
                    viewCourse(courseId);
                } else if (target.classList.contains('edit-course')) {
                    editCourse(courseId);
                } else if (target.classList.contains('delete-course')) {
                    confirmDeleteCourse(courseId, target.dataset.code, target.dataset.name);
                }
            });
        }
    }
    
    async function viewCourse(courseId) {
        try {
            app.showSpinner();
            
            // In a real app, this would fetch from Supabase
            // For demo purposes, we'll find the course in our local array
            const course = courses.find(c => c.id === courseId);
            
            if (!course) {
                throw new Error('Course not found');
            }
            
            // Populate course details in view modal
            document.getElementById('view-course-code').textContent = course.code;
            document.getElementById('view-course-name').textContent = course.name;
            document.getElementById('view-course-status').textContent = course.status;
            document.getElementById('view-course-status').className = `badge ${course.status === 'Active' ? 'bg-success' : 'bg-secondary'}`;
            document.getElementById('view-course-program').textContent = course.program;
            document.getElementById('view-course-duration').textContent = course.duration;
            document.getElementById('view-course-credits').textContent = course.credits;
            document.getElementById('view-course-capacity').textContent = course.capacity;
            document.getElementById('view-course-period').textContent = `${app.formatDate(course.startDate)} to ${app.formatDate(course.endDate)}`;
            document.getElementById('view-course-description').textContent = course.description;
            
            // Update enrollment count
            document.getElementById('enrolled-count').textContent = course.students;
            document.getElementById('max-capacity').textContent = course.capacity;
            
            // Fetch and populate enrolled students
            await loadEnrolledStudents(courseId);
            
            // Fetch and populate attendance records
            await loadCourseAttendance(courseId);
            
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('viewCourseModal'));
            modal.show();
            
            // Setup edit button in view modal
            const editCourseBtn = document.getElementById('edit-course-btn');
            if (editCourseBtn) {
                editCourseBtn.onclick = function() {
                    modal.hide();
                    editCourse(courseId);
                };
            }
        } catch (error) {
            console.error('Error viewing course:', error);
            app.showToast('Failed to load course details', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function loadEnrolledStudents(courseId) {
        // In a real app, this would fetch from Supabase
        // For demo purposes, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const enrolledStudents = [
            {
                id: 'STU001',
                name: 'John Doe',
                email: 'john.doe@example.com',
                enrollmentDate: '2023-09-01'
            },
            {
                id: 'STU002',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                enrollmentDate: '2023-09-01'
            },
            {
                id: 'STU003',
                name: 'Michael Johnson',
                email: 'michael.j@example.com',
                enrollmentDate: '2023-09-01'
            }
        ];
        
        // Update enrolled students table
        const enrolledStudentsTable = document.getElementById('enrolled-students-table');
        if (enrolledStudentsTable) {
            if (enrolledStudents.length === 0) {
                enrolledStudentsTable.innerHTML = '<tr><td colspan="5" class="text-center">No students enrolled</td></tr>';
                return;
            }
            
            let html = '';
            
            enrolledStudents.forEach(student => {
                html += `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${app.formatDate(student.enrollmentDate)}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-danger remove-student" data-id="${student.id}" data-name="${student.name}">
                                <i class="bi bi-x-circle"></i> Remove
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            enrolledStudentsTable.innerHTML = html;
        }
    }
    
    async function loadCourseAttendance(courseId) {
        // In a real app, this would fetch from Supabase
        // For demo purposes, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const attendanceRecords = [
            {
                date: '2023-09-01',
                present: 25,
                absent: 0,
                late: 0
            },
            {
                date: '2023-09-02',
                present: 23,
                absent: 1,
                late: 1
            },
            {
                date: '2023-09-03',
                present: 22,
                absent: 3,
                late: 0
            }
        ];
        
        // Update course attendance table
        const courseAttendanceTable = document.getElementById('course-attendance-table');
        if (courseAttendanceTable) {
            if (attendanceRecords.length === 0) {
                courseAttendanceTable.innerHTML = '<tr><td colspan="5" class="text-center">No attendance records found</td></tr>';
                return;
            }
            
            let html = '';
            
            attendanceRecords.forEach(record => {
                html += `
                    <tr>
                        <td>${app.formatDate(record.date)}</td>
                        <td>${record.present}</td>
                        <td>${record.absent}</td>
                        <td>${record.late}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-info view-attendance" data-date="${record.date}">
                                <i class="bi bi-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            courseAttendanceTable.innerHTML = html;
        }
    }
    
    async function editCourse(courseId) {
        try {
            app.showSpinner();
            
            // In a real app, this would fetch from Supabase
            // For demo purposes, we'll find the course in our local array
            const course = courses.find(c => c.id === courseId);
            
            if (!course) {
                throw new Error('Course not found');
            }
            
            // Store current course for later use
            currentCourse = course;
            
            // Update modal title
            document.getElementById('addCourseModalLabel').textContent = 'Edit Course';
            
            // Populate form fields
            document.getElementById('course-id').value = course.id;
            document.getElementById('course-code').value = course.code;
            document.getElementById('course-name').value = course.name;
            document.getElementById('course-program').value = course.program;
            document.getElementById('course-duration').value = course.duration;
            document.getElementById('course-credits').value = course.credits;
            document.getElementById('course-capacity').value = course.capacity;
            document.getElementById('course-description').value = course.description;
            document.getElementById('course-start-date').value = course.startDate;
            document.getElementById('course-end-date').value = course.endDate;
            document.getElementById('course-status').value = course.status;
            
            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('addCourseModal'));
            modal.show();
        } catch (error) {
            console.error('Error editing course:', error);
            app.showToast('Failed to load course data for editing', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    function confirmDeleteCourse(courseId, courseCode, courseName) {
        // Store the course ID for deletion
        currentCourse = { id: courseId, code: courseCode, name: courseName };
        
        // Update confirmation message
        document.getElementById('delete-course-code').textContent = courseCode;
        document.getElementById('delete-course-name').textContent = courseName;
        
        // Show confirmation modal
        const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        modal.show();
    }
    
    async function saveCourse() {
        // Get form values
        const courseId = document.getElementById('course-id').value;
        const courseCode = document.getElementById('course-code').value;
        const courseName = document.getElementById('course-name').value;
        const courseProgram = document.getElementById('course-program').value;
        const courseDuration = document.getElementById('course-duration').value;
        const courseCredits = document.getElementById('course-credits').value;
        const courseCapacity = document.getElementById('course-capacity').value;
        const courseDescription = document.getElementById('course-description').value;
        const courseStartDate = document.getElementById('course-start-date').value;
        const courseEndDate = document.getElementById('course-end-date').value;
        const courseStatus = document.getElementById('course-status').value;
        
        // Validate required fields
        if (!courseCode || !courseName || !courseProgram || !courseDuration || !courseCredits || !courseCapacity || !courseDescription || !courseStartDate || !courseEndDate) {
            app.showToast('Please fill in all required fields', 'warning');
            return;
        }
        
        // Validate date range
        if (new Date(courseStartDate) >= new Date(courseEndDate)) {
            app.showToast('End date must be after start date', 'warning');
            return;
        }
        
        try {
            app.showSpinner();
            
            // Prepare course data
            const courseData = {
                code: courseCode,
                name: courseName,
                program: courseProgram,
                duration: parseInt(courseDuration),
                credits: parseInt(courseCredits),
                capacity: parseInt(courseCapacity),
                description: courseDescription,
                startDate: courseStartDate,
                endDate: courseEndDate,
                status: courseStatus
            };
            
            if (currentCourse) {
                // Update existing course
                await updateCourse(parseInt(courseId), courseData);
                app.showToast('Course updated successfully', 'success');
            } else {
                // Add new course
                await addCourse(courseData);
                app.showToast('Course added successfully', 'success');
            }
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCourseModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset form and current course
            resetCourseForm();
            currentCourse = null;
            
            // Reload courses
            loadCourses();
        } catch (error) {
            console.error('Error saving course:', error);
            app.showToast('Failed to save course', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function addCourse(courseData) {
        // In a real app, this would insert into Supabase
        // For demo purposes, we'll simulate an API call
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate a new course ID
        courseData.id = Math.floor(Math.random() * 1000) + 10;
        courseData.students = 0;
        
        // In a real app, this would be handled by the server
        console.log('Adding course:', courseData);
        
        return courseData;
    }
    
    async function updateCourse(courseId, courseData) {
        // In a real app, this would update in Supabase
        // For demo purposes, we'll simulate an API call
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be handled by the server
        console.log('Updating course:', courseId, courseData);
        
        return { id: courseId, ...courseData };
    }
    
    async function deleteCourse() {
        if (!currentCourse) {
            app.showToast('No course selected for deletion', 'warning');
            return;
        }
        
        try {
            app.showSpinner();
            
            // In a real app, this would delete from Supabase
            // For demo purposes, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, this would be handled by the server
            console.log('Deleting course:', currentCourse.id);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset current course
            currentCourse = null;
            
            // Reload courses
            loadCourses();
            
            app.showToast('Course deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting course:', error);
            app.showToast('Failed to delete course', 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    function resetCourseForm() {
        if (courseForm) {
            courseForm.reset();
        }
        
        document.getElementById('course-id').value = '';
        
        // Set default values
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('course-start-date').value = today;
        
        // Calculate end date (3 months from today)
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);
        document.getElementById('course-end-date').value = endDate.toISOString().split('T')[0];
        
        document.getElementById('course-status').value = 'Active';
    }
    
    function resetFilters() {
        if (searchInput) searchInput.value = '';
        if (filterProgram) filterProgram.value = '';
        if (filterStatus) filterStatus.value = '';
        
        filters = {
            search: '',
            program: '',
            status: ''
        };
        
        currentPage = 1;
        loadCourses();
    }
});
