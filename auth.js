// Authentication Module for NIIT Student Management System

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const signOutBtn = document.getElementById('sign-out-btn');
    const currentUserSpan = document.getElementById('current-user');
    const demoLoginBtn = document.getElementById('demo-login-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const googleRegisterBtn = document.getElementById('google-register-btn');
    
    // Check if user is already logged in
    checkAuthState();
    
    // Event Listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
    
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
    }
    
    if (demoLoginBtn) {
        demoLoginBtn.addEventListener('click', function() {
            simulateLogin();
        });
    }
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            handleGoogleLogin();
        });
    }
    
    if (googleRegisterBtn) {
        googleRegisterBtn.addEventListener('click', function() {
            handleGoogleLogin();
        });
    }
    
    // Functions
    async function checkAuthState() {
        try {
            const { data: { user }, error } = await app.supabase.auth.getUser();
            
            if (error) {
                throw error;
            }
            
            if (user) {
                // User is logged in
                showDashboard(user);
            } else {
                // User is not logged in
                showLoginForm();
            }
        } catch (error) {
            console.error('Error checking auth state:', error.message);
            showLoginForm();
        }
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        if (!app.isValidEmail(email)) {
            app.showToast('Please enter a valid email address', 'danger');
            return;
        }
        
        try {
            app.showSpinner();
            
            // Use Supabase authentication
            const { data, error } = await app.supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) {
                throw error;
            }
            
            if (!data.user) {
                throw new Error('Login failed. User data not returned.');
            }
            
            // Store user in local storage if remember me is checked
            if (rememberMe) {
                localStorage.setItem('niit_user', JSON.stringify(data.user));
            } else {
                sessionStorage.setItem('niit_user', JSON.stringify(data.user));
            }
            
            // Login successful
            app.showToast('Login successful!', 'success');
            showDashboard(data.user);
        } catch (error) {
            console.error('Login error:', error.message);
            app.showToast(error.message || 'Login failed. Please check your credentials.', 'danger');
            
            // Fallback to demo login if Supabase is not set up
            if (error.message.includes('createClient') || error.message.includes('supabase')) {
                app.showToast('Supabase not configured. Using demo login instead.', 'warning');
                simulateLogin();
            }
        } finally {
            app.hideSpinner();
        }
    }
    
    async function handleRegistration(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const termsAgreed = document.getElementById('terms-agree').checked;
        
        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            app.showToast('Please fill in all required fields', 'warning');
            return;
        }
        
        if (!app.isValidEmail(email)) {
            app.showToast('Please enter a valid email address', 'warning');
            return;
        }
        
        if (password !== confirmPassword) {
            app.showToast('Passwords do not match', 'warning');
            return;
        }
        
        if (password.length < 6) {
            app.showToast('Password must be at least 6 characters long', 'warning');
            return;
        }
        
        if (!termsAgreed) {
            app.showToast('You must agree to the Terms and Conditions', 'warning');
            return;
        }
        
        try {
            app.showSpinner();
            
            // Use Supabase to register the user
            const { data, error } = await app.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            });
            
            if (error) {
                throw error;
            }
            
            if (!data.user) {
                throw new Error('Registration failed. User data not returned.');
            }
            
            // Store user in session storage
            sessionStorage.setItem('niit_user', JSON.stringify(data.user));
            
            // Registration successful
            app.showToast('Registration successful! You are now logged in.', 'success');
            showDashboard(data.user);
        } catch (error) {
            console.error('Registration error:', error.message);
            app.showToast(error.message || 'Registration failed. Please try again.', 'danger');
            
            // Fallback to demo registration if Supabase is not set up
            if (error.message.includes('createClient') || error.message.includes('supabase')) {
                app.showToast('Supabase not configured. Using demo registration instead.', 'warning');
                
                // Create a mock user object
                const user = {
                    id: 'mock-user-id',
                    email: email,
                    user_metadata: {
                        full_name: name
                    }
                };
                
                // Store user in session storage
                sessionStorage.setItem('niit_user', JSON.stringify(user));
                
                // Show dashboard
                showDashboard(user);
            }
        } finally {
            app.hideSpinner();
        }
    }
    
    function handleForgotPassword() {
        const email = prompt('Please enter your email address:');
        
        if (!email) return;
        
        if (!app.isValidEmail(email)) {
            app.showToast('Please enter a valid email address', 'warning');
            return;
        }
        
        // In a real app, this would send a password reset email
        // For demo purposes, we'll just show a message
        app.showToast('Password reset instructions have been sent to your email', 'info');
    }
    
    async function handleGoogleLogin() {
        try {
            app.showSpinner();
            
            // Sign in with Google using Supabase
            const { data, error } = await app.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            });
            
            if (error) {
                throw error;
            }
            
            // If successful, this will redirect to Google for authentication
            // and then back to our app with the user session
            
            // Note: We won't reach this point if the redirect happens
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Google login error:', error.message);
            app.showToast(error.message || 'Google login failed. Please try again.', 'danger');
            
            // Fallback to demo login if Supabase is not set up
            if (error.message.includes('createClient') || error.message.includes('supabase')) {
                app.showToast('Supabase not configured. Using demo login instead.', 'warning');
                simulateLogin();
            }
        } finally {
            app.hideSpinner();
        }
    }
    
    async function handleSignOut(e) {
        e.preventDefault();
        
        try {
            app.showSpinner();
            
            // Sign out from Supabase
            const { error } = await app.supabase.auth.signOut();
            
            if (error) {
                throw error;
            }
            
            // Also clear local storage in case we were using the fallback
            localStorage.removeItem('niit_user');
            sessionStorage.removeItem('niit_user');
            
            // Sign out successful
            app.showToast('You have been signed out', 'info');
            showLoginForm();
        } catch (error) {
            console.error('Sign out error:', error.message);
            app.showToast(error.message || 'Failed to sign out', 'danger');
            
            // Force sign out even if Supabase fails
            localStorage.removeItem('niit_user');
            sessionStorage.removeItem('niit_user');
            showLoginForm();
        } finally {
            app.hideSpinner();
        }
    }
    
    function showDashboard(user) {
        if (authContainer) {
            authContainer.classList.add('d-none');
        }
        
        if (dashboardContainer) {
            dashboardContainer.classList.remove('d-none');
        }
        
        // Update user display name
        if (currentUserSpan) {
            currentUserSpan.textContent = user.user_metadata?.full_name || user.email || 'User';
        }
        
        // Load dashboard data
        if (typeof loadDashboardData === 'function') {
            loadDashboardData();
        }
    }
    
    function showLoginForm() {
        if (authContainer) {
            authContainer.classList.remove('d-none');
        }
        
        if (dashboardContainer) {
            dashboardContainer.classList.add('d-none');
        }
    }
    
    // For development/demo purposes - Simulate login without credentials
    window.simulateLogin = function() {
        const mockUser = {
            id: 'mock-user-id',
            email: 'admin@niit.edu',
            user_metadata: {
                full_name: 'Admin User'
            }
        };
        
        // Store user in session storage
        sessionStorage.setItem('niit_user', JSON.stringify(mockUser));
        
        showDashboard(mockUser);
        app.showToast('Demo login successful!', 'success');
    };
    
    // Check if we have a stored user (for demo purposes)
    function checkStoredUser() {
        const storedUser = localStorage.getItem('niit_user') || sessionStorage.getItem('niit_user');
        
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                showDashboard(user);
                return true;
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('niit_user');
                sessionStorage.removeItem('niit_user');
            }
        }
        
        return false;
    }
    
    // Check for stored user on page load
    if (!checkStoredUser()) {
        showLoginForm();
    }
});
