// Supabase Configuration
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://rpnxpoviyorfojulahpk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwbnhwb3ZpeW9yZm9qdWxhaHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjgxNjAsImV4cCI6MjA2MjgwNDE2MH0.D4k3t7JxZ6wAxWwxEH8w9wa0zDy5sZWDgcu4Obh6QFc';

// Initialize Supabase client
let supabaseClient;

// Function to initialize Supabase
function initSupabase() {
    try {
        if (typeof supabase === 'undefined') {
            console.error('Supabase library not loaded');
            return createMockClient();
        }
        // Create a Supabase client
        const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        if (!client) {
            throw new Error('Failed to create Supabase client');
        }
        return client;
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        console.warn('Falling back to mock client');
        return createMockClient();
    }
}

// Create a mock client for development/fallback
function createMockClient() {
    console.info('Using mock Supabase client');
    const mockDB = {
        programs: [],
        courses: [],
        students: [],
        enrollments: []
    };
    
    return {
        from: (table) => ({
            select: (columns = '*') => {
                console.log(`Mock selecting from ${table}:`, columns);
                return Promise.resolve({
                    data: mockDB[table] || [],
                    error: null
                });
            },
            insert: (data) => ({
                select: () => {
                    console.log(`Mock inserting into ${table} with select:`, data);
                    if (Array.isArray(data)) {
                        data.forEach(item => {
                            if (!item.id) item.id = crypto.randomUUID();
                        });
                        mockDB[table] = [...(mockDB[table] || []), ...data];
                    } else {
                        if (!data.id) data.id = crypto.randomUUID();
                        mockDB[table] = [...(mockDB[table] || []), data];
                    }
                    return Promise.resolve({ data: Array.isArray(data) ? data : [data], error: null });
                }
            }),
            update: (data) => ({
                eq: (column, value) => {
                    console.log(`Mock updating ${table} where ${column} = ${value}:`, data);
                    const index = mockDB[table].findIndex(item => item[column] === value);
                    if (index !== -1) {
                        mockDB[table][index] = { ...mockDB[table][index], ...data };
                    }
                    return Promise.resolve({ data: [data], error: null });
                }
            }),
            delete: () => ({
                eq: (column, value) => {
                    console.log(`Mock deleting from ${table} where ${column} = ${value}`);
                    mockDB[table] = mockDB[table].filter(item => item[column] !== value);
                    return Promise.resolve({ data: null, error: null });
                }
            })
        }),
        auth: {
            signInWithPassword: async ({ email, password }) => {
                console.log('Mock login with:', email);
                if (email === 'admin@niit.edu' && password === 'password') {
                    const user = {
                        id: 'mock-user-id',
                        email: email,
                        user_metadata: {
                            full_name: 'Admin User'
                        }
                    };
                    return { data: { user }, error: null };
                }
                return { data: { user: null }, error: { message: 'Invalid login credentials' } };
            },
            signUp: async ({ email, password, options }) => {
                console.log('Mock registration with:', email, options);
                const user = {
                    id: 'mock-user-id',
                    email: email,
                    user_metadata: options?.data || {}
                };
                return { data: { user }, error: null };
            },
            signOut: async () => {
                console.log('Mock sign out');
                return { error: null };
            },
            getUser: async () => {
                const storedUser = localStorage.getItem('niit_user') || sessionStorage.getItem('niit_user');
                if (storedUser) {
                    try {
                        return { data: { user: JSON.parse(storedUser) }, error: null };
                    } catch (error) {
                        console.error('Error parsing stored user:', error);
                    }
                }
                return { data: { user: null }, error: null };
            }
        }
    };
}

// Initialize the client
console.log('Initializing Supabase client with URL:', SUPABASE_URL);
supabaseClient = initSupabase();
console.log('Supabase client initialized:', supabaseClient);

// Export the client
const supabase = supabaseClient;

// Toast notification function
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

// Loading spinner functions
function showSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner-overlay';
    spinner.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    document.body.appendChild(spinner);
}

function hideSpinner() {
    const spinner = document.querySelector('.spinner-overlay');
    if (spinner) {
        spinner.remove();
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format time for display
function formatTime(timeString) {
    if (!timeString) return 'N/A';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(timeString).toLocaleTimeString(undefined, options);
}

// Format date and time for display
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
}

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number format
function isValidPhone(phone) {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
}

// Generate a random ID
function generateId(prefix = '') {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
}

// Export functions and variables
window.app = {
    supabase,
    showToast,
    showSpinner,
    hideSpinner,
    formatDate,
    formatTime,
    formatDateTime,
    getCurrentDate,
    isValidEmail,
    isValidPhone,
    generateId
};
