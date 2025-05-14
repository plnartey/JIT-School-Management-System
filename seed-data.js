// Seed Data Script for NIIT Management System
// This script will populate your Supabase database with mock data

document.addEventListener('DOMContentLoaded', function() {
    const seedDataBtn = document.getElementById('seed-data-btn');
    
    if (seedDataBtn) {
        seedDataBtn.addEventListener('click', seedDatabase);
    }
    
    async function seedDatabase() {
        try {
            app.showSpinner();
            app.showToast('Starting database seeding...', 'info');
            
            // 1. Add Programs
            await seedPrograms();
            
            // Wait a bit to ensure programs are saved
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 2. Add Courses
            await seedCourses();
            
            // Wait a bit to ensure courses are saved
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 3. Add Students
            await seedStudents();
            
            // Wait a bit to ensure students are saved
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 4. Add Enrollments
            await seedEnrollments();
            
            app.showToast('Database seeded successfully!', 'success');
        } catch (error) {
            console.error('Error seeding database:', error);
            app.showToast('Failed to seed database: ' + error.message, 'danger');
        } finally {
            app.hideSpinner();
        }
    }
    
    async function seedPrograms() {
        try {
            const programs = [
                {
                    code: 'BSCS',
                    name: 'Bachelor of Science in Computer Science',
                    description: 'A comprehensive program covering computer science fundamentals and advanced topics.',
                    duration: 48
                },
                {
                    code: 'BSIT',
                    name: 'Bachelor of Science in Information Technology',
                    description: 'A program focused on practical IT skills and business applications.',
                    duration: 48
                },
                {
                    code: 'DIT',
                    name: 'Diploma in Information Technology',
                    description: 'A short program covering essential IT skills.',
                    duration: 24
                }
            ];
            
            // First check if programs exist
            const { data: existingPrograms, error: checkError } = await app.supabase
                .from('programs')
                .select('code');
            
            if (checkError) {
                throw new Error('Failed to check existing programs: ' + checkError.message);
            }
            
            // If no programs exist, insert them
            if (!existingPrograms || existingPrograms.length === 0) {
                const { data, error: insertError } = await app.supabase
                    .from('programs')
                    .insert(programs)
                    .select();
                
                if (insertError) {
                    throw new Error('Failed to seed programs: ' + insertError.message);
                }
                
                if (!data || data.length === 0) {
                    throw new Error('Programs were not created successfully');
                }
                
                console.log('Programs seeded successfully:', data);
                return data;
            } else {
                console.log('Programs already exist:', existingPrograms);
                return existingPrograms;
            }
        } catch (error) {
            console.error('Error in seedPrograms:', error);
            throw error;
        }
    }
    
    async function seedCourses() {
        try {
            // Get program IDs
            const { data: programs, error: programsError } = await app.supabase
                .from('programs')
                .select('id, code');
                
            if (programsError) {
                throw new Error('Failed to fetch programs: ' + programsError.message);
            }
            
            if (!programs || programs.length === 0) {
                throw new Error('No programs found in database. Please seed programs first.');
            }
            
            // Map program codes to IDs
            const programMap = {};
            programs.forEach(program => {
                programMap[program.code] = program.id;
            });
            
            // Verify we have all required program IDs
            const requiredPrograms = ['BSCS', 'BSIT', 'DIT'];
            for (const code of requiredPrograms) {
                if (!programMap[code]) {
                    throw new Error(`Required program ${code} not found in database`);
                }
            }
            
            const courses = [
                {
                    code: 'CS101',
                    name: 'Introduction to Programming',
                    program_id: programMap['BSCS'],
                    description: 'An introductory course to programming concepts using Python.',
                    credits: 3,
                    capacity: 40,
                    start_date: '2025-06-01',
                    end_date: '2025-09-30',
                    status: 'upcoming'
                },
                {
                    code: 'CS102',
                    name: 'Data Structures and Algorithms',
                    program_id: programMap['BSCS'],
                    description: 'A comprehensive study of data structures and algorithms.',
                    credits: 4,
                    capacity: 35,
                    start_date: '2025-06-01',
                    end_date: '2025-09-30',
                    status: 'upcoming'
                },
                {
                    code: 'IT101',
                    name: 'IT Fundamentals',
                    program_id: programMap['BSIT'],
                    description: 'Introduction to information technology concepts.',
                    credits: 3,
                    capacity: 45,
                    start_date: '2025-06-01',
                    end_date: '2025-09-30',
                    status: 'upcoming'
                },
                {
                    code: 'IT102',
                    name: 'Web Development',
                    program_id: programMap['BSIT'],
                    description: 'Introduction to web development using HTML, CSS, and JavaScript.',
                    credits: 3,
                    capacity: 40,
                    start_date: '2025-06-01',
                    end_date: '2025-09-30',
                    status: 'upcoming'
                },
                {
                    code: 'DIT101',
                    name: 'Computer Basics',
                    program_id: programMap['DIT'],
                    description: 'Fundamentals of computer systems and operations.',
                    credits: 2,
                    capacity: 50,
                    start_date: '2025-06-01',
                    end_date: '2025-08-30',
                    status: 'upcoming'
                }
            ];
            
            // First, try to insert the courses
            const { error: insertError } = await app.supabase
                .from('courses')
                .insert(courses);
                
            if (insertError) {
                // If there's a duplicate key error, it means courses exist
                if (insertError.code === '23505') {
                    console.log('Courses already exist, skipping...');
                    return;
                }
                throw new Error('Failed to seed courses: ' + insertError.message);
            }
            
            console.log('Courses seeded successfully');
            
        } catch (error) {
            console.error('Error in seedCourses:', error);
            throw error;
        }
    }
    
    async function seedStudents() {
        try {
            // Get program IDs
            const { data: programs, error: programsError } = await app.supabase
                .from('programs')
                .select('id, code');
                
            if (programsError) {
                throw new Error('Failed to fetch programs: ' + programsError.message);
            }
            
            if (!programs || programs.length === 0) {
                throw new Error('No programs found in database. Please seed programs first.');
            }
            
            // Map program codes to IDs
            const programMap = {};
            programs.forEach(program => {
                programMap[program.code] = program.id;
            });
            
            // Verify we have all required program IDs
            const requiredPrograms = ['BSCS', 'BSIT', 'DIT'];
            for (const code of requiredPrograms) {
                if (!programMap[code]) {
                    throw new Error(`Required program ${code} not found in database`);
                }
            }
            
            const students = [
                {
                    student_id: 'STU001',
                    name: 'John Doe',
                    email: 'john.doe@gmail.com',
                    program_id: programMap['BSCS'],
                    phone: '0555432321',
                    address: 'Osu, Accra',
                    dob: '2000-01-15',
                    gender: 'Male',
                    enrollment_date: '2025-01-15',
                    status: 'active'
                },
                {
                    student_id: 'STU002',
                    name: 'Jane Smith',
                    email: 'jane.smith@gmail.com',
                    program_id: programMap['BSIT'],
                    phone: '0574486403',
                    address: 'Asylum Down, Accra',
                    dob: '1999-02-20',
                    gender: 'Female',
                    enrollment_date: '2025-01-20',
                    status: 'active'
                },
                {
                    student_id: 'STU003',
                    name: 'Robert Johnson',
                    email: 'robert.johnson@gmail.com',
                    program_id: programMap['DIT'],
                    phone: '0244423956',
                    address: 'Labadi, Accra',
                    dob: '1997-11-10',
                    gender: 'Male',
                    enrollment_date: '2025-02-01',
                    status: 'active'
                },
                {
                    student_id: 'STU004',
                    name: 'Emily Asabea',
                    email: 'emily.davis@gmail.com',
                    program_id: programMap['BSCS'],
                    phone: '0234245672',
                    address: 'Labadi, Accra',
                    dob: '1998-07-25',
                    gender: 'Female',
                    enrollment_date: '2025-02-10',
                    status: 'active'
                },
                {
                    student_id: 'STU005',
                    name: 'Michael Wilson',
                    email: 'michael.wilson@gmail.com',
                    program_id: programMap['BSIT'],
                    phone: '0201234567',
                
                    dob: '1999-04-12',
                    gender: 'Male',
                    enrollment_date: '2025-02-15',
                    status: 'active'
                }
            ];
            
            // First, try to insert the students
            const { error: insertError } = await app.supabase
                .from('students')
                .insert(students);
                
            if (insertError) {
                // If there's a duplicate key error, it means students exist
                if (insertError.code === '23505') {
                    console.log('Students already exist, skipping...');
                    return;
                }
                throw new Error('Failed to seed students: ' + insertError.message);
            }
            
            console.log('Students seeded successfully');
            
        } catch (error) {
            console.error('Error in seedStudents:', error);
            throw error;
        }
    }
    
    async function seedEnrollments() {
        try {
            // Get student and course IDs
            const { data: students, error: studentsError } = await app.supabase
                .from('students')
                .select('id, student_id');
                
            if (studentsError) {
                throw new Error('Failed to fetch students: ' + studentsError.message);
            }
            
            if (!students || students.length === 0) {
                throw new Error('No students found in database. Please seed students first.');
            }
            
            const { data: courses, error: coursesError } = await app.supabase
                .from('courses')
                .select('id, code');
                
            if (coursesError) {
                throw new Error('Failed to fetch courses: ' + coursesError.message);
            }
            
            if (!courses || courses.length === 0) {
                throw new Error('No courses found in database. Please seed courses first.');
            }
            
            // Map student and course codes to IDs
            const studentMap = {};
            students.forEach(student => {
                studentMap[student.student_id] = student.id;
            });
            
            const courseMap = {};
            courses.forEach(course => {
                courseMap[course.code] = course.id;
            });
            
            const enrollments = [
                {
                    student_id: studentMap['STU001'],
                    course_id: courseMap['CS101'],
                    enrollment_date: '2025-05-15',
                    status: 'enrolled'
                },
                {
                    student_id: studentMap['STU001'],
                    course_id: courseMap['CS102'],
                    enrollment_date: '2025-05-15',
                    status: 'enrolled'
                },
                {
                    student_id: studentMap['STU002'],
                    course_id: courseMap['IT101'],
                    enrollment_date: '2025-05-16',
                    status: 'enrolled'
                },
                {
                    student_id: studentMap['STU002'],
                    course_id: courseMap['IT102'],
                    enrollment_date: '2025-05-16',
                    status: 'enrolled'
                },
                {
                    student_id: studentMap['STU003'],
                    course_id: courseMap['DIT101'],
                    enrollment_date: '2025-05-17',
                    status: 'enrolled'
                },
                {
                    student_id: studentMap['STU004'],
                    course_id: courseMap['CS101'],
                    enrollment_date: '2025-05-18',
                    status: 'enrolled'
                },
                {
                    student_id: studentMap['STU005'],
                    course_id: courseMap['IT101'],
                    enrollment_date: '2025-05-19',
                    status: 'enrolled'
                }
            ];
            
            // First, try to insert the enrollments
            const { error: insertError } = await app.supabase
                .from('enrollments')
                .insert(enrollments);
                
            if (insertError) {
                // If there's a duplicate key error, it means enrollments exist
                if (insertError.code === '23505') {
                    console.log('Enrollments already exist, skipping...');
                    return;
                }
                throw new Error('Failed to seed enrollments: ' + insertError.message);
            }
            
            console.log('Enrollments seeded successfully');
            
        } catch (error) {
            console.error('Error in seedEnrollments:', error);
            throw error;
        }
    }
});
