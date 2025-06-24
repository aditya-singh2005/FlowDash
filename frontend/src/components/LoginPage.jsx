import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Users, Building, User } from 'lucide-react'
import axios from "axios"

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')

    // Test server connection
    const testConnection = async () => {
        try {
            console.log('🔍 Testing server connection...');
            const response = await axios.get('http://localhost:3000/api/test');
            console.log('✅ Server test response:', response.data);
            setStatusMessage('Server is reachable!');
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (error) {
            console.error('❌ Server test failed:', error);
            setStatusMessage('Server is not reachable. Check if server is running on port 3000');
            setTimeout(() => setStatusMessage(''), 5000);
        }
    };

    // Check what users exist in database
    const checkUsers = async () => {
        try {
            console.log('🔍 Checking users in database...');
            const response = await axios.get('http://localhost:3000/api/debug-users');
            console.log('👥 Users in database:', response.data);
            setStatusMessage(`Found ${response.data.count} users in database. Check console for details.`);
            setTimeout(() => setStatusMessage(''), 5000);
        } catch (error) {
            console.error('❌ Failed to check users:', error);
            setStatusMessage('Failed to check users in database');
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage('');

        console.log('🚀 Login attempt started');
        console.log('📧 Email:', email);
        console.log('🔐 Password:', password);

        try {
            if (isLogin) {
                console.log('📡 Sending login request...');
                
                const loginData = {
                    email: email.trim(),
                    password: password
                };
                
                console.log('📦 Login data:', loginData);
                
                const res = await axios.post('http://localhost:3000/api/login', loginData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000 // 10 second timeout
                });
                
                console.log('✅ Login response:', res.data);

                const { token, role, user } = res.data;

                if (!token) {
                    throw new Error('No token received from server');
                }

                // Store token in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                setStatusMessage(`Login successful! Welcome ${user.email}. Redirecting...`);
                
                // Redirect based on role
                setTimeout(() => {
                    if (role === 'admin') {
                        console.log('🔀 Redirecting to admin dashboard...');
                        window.location.href = '/Admin-Dashboard';
                    } else if (role === 'employee') {
                        console.log('🔀 Redirecting to employee dashboard...');
                        window.location.href = '/Employee-Dashboard';
                    } else {
                        console.log('⚠️ Unknown role:', role);
                        setStatusMessage(`Unknown role: ${role}`);
                    }
                }, 2000);

            // Replace the signup section in your handleSubmit function with this:

            } else {
                // SIGNUP logic
                console.log('📝 Signup attempt:', { fullName, email, password, confirmPassword });

                if (password !== confirmPassword) {
                    setStatusMessage('Passwords do not match!');
                    return;
                }
            
                if (password.length < 6) {
                    setStatusMessage('Password must be at least 6 characters long!');
                    return;
                }
            
                try {
                    const signupData = {
                        fullName: fullName.trim(),
                        email: email.trim(),
                        password: password,
                        role: 'employee' // Default role, or you can add a role selector
                    };
                
                    console.log('📦 Signup data:', signupData);
                
                    // Step 1: Register the user
                    const signupResponse = await axios.post('http://localhost:3000/api/register', signupData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000
                    });
                
                    console.log('✅ Signup response:', signupResponse.data);
                
                    // Register endpoint returns token directly
                    const { token, user, role } = signupResponse.data;

                    if (!token) {
                        throw new Error('No token received from server');
                    }

                    // Store token and user data
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    setStatusMessage(`Account created successfully! Welcome ${user.fullName || user.email}. Redirecting...`);

                    // Redirect based on role
                    setTimeout(() => {
                        if (role === 'admin') {
                            window.location.href = '/Admin-Dashboard';
                        } else if (role === 'employee') {
                            window.location.href = '/Employee-Dashboard';
                        } else {
                            setStatusMessage(`Unknown role: ${role}`);
                        }
                    }, 2000);
                
                } catch (signupError) {
                    console.error('💥 Signup error:', signupError);

                    let errorMessage = 'Signup failed';

                    if (signupError.response) {
                        console.log('📊 Signup error response:', signupError.response.data);
                        console.log('📊 Signup error status:', signupError.response.status);

                        if (signupError.response.status === 409) {
                            errorMessage = 'User already exists with this email address';
                        } else {
                            errorMessage = signupError.response.data.msg || 
                                         signupError.response.data.error || 
                                         `Server error: ${signupError.response.status}`;
                        }
                    } else if (signupError.request) {
                        errorMessage = 'No response from server. Check your network connection.';
                    } else {
                        errorMessage = signupError.message;
                    }

                    setStatusMessage(errorMessage);
                }
            }
            } catch (err) {
            console.error('💥 Login error:', err);
            
            let errorMessage = 'Login failed';
            
            if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
                errorMessage = 'Cannot connect to server. Make sure the server is running on port 3000.';
            } else if (err.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Server is taking too long to respond.';
            } else if (err.response) {
                // Server responded with error status
                console.log('📊 Error response:', err.response.data);
                console.log('📊 Error status:', err.response.status);
                errorMessage = err.response.data.msg || err.response.data.error || `Server error: ${err.response.status}`;
            } else if (err.request) {
                // Request was made but no response received
                console.log('📡 No response received:', err.request);
                errorMessage = 'No response from server. Check your network connection.';
            } else {
                // Something else happened
                console.log('❓ Unknown error:', err.message);
                errorMessage = err.message;
            }
            
            setStatusMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setIsLoading(true);
        setStatusMessage(`Checking ${provider} account...`);
        
        try {
            // Simulate checking if user exists
            await new Promise((res) => setTimeout(res, 1500));
            
            // For now, just show a message that social login isn't implemented
            setStatusMessage(`${provider} integration not implemented yet. Use email/password login.`);
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setStatusMessage('Something went wrong. Please try again.');
            setTimeout(() => setStatusMessage(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setStatusMessage('');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    // Quick fill for testing (remove in production)
    const fillTestData = () => {
        setEmail('admin@example.com');
        setPassword('admin123');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
                    <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
                    <div className="absolute bottom-32 left-32 w-40 h-40 border border-white rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-28 h-28 border border-white rounded-full"></div>
                </div>
                
                <div className="relative z-10 flex flex-col top-[25vh] px-16 text-white">
                    <div className="mb-8">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4">
                                <Building className="w-6 h-6 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold">FlowDash</h1>
                        </div>
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Streamline Your<br />
                            Workforce Management
                        </h2>
                        <p className="text-xl opacity-90 leading-relaxed">
                            Efficiently manage employees, track performance, and optimize your organization's productivity with our comprehensive platform.
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-8 text-sm opacity-80">
                        <div className="flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            <span>10,000+ Companies</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-5 h-5 mr-2 flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            </div>
                            <span>99.9% Uptime</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <Building className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">FlowDash</h1>
                    </div>

                    {/* Login form container */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Welcome Back Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-gray-600">
                                {isLogin 
                                    ? 'Sign in to access your dashboard' 
                                    : 'Join us and start managing your workforce'
                                }
                            </p>
                        </div>

                        {/* Debug buttons - remove in production */}
                        <div className="mb-4 space-y-2">
                            <div className="flex space-x-2">
                                <button 
                                    type="button" 
                                    onClick={testConnection}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                                >
                                    Test Server
                                </button>
                                <button 
                                    type="button" 
                                    onClick={checkUsers}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                                >
                                    Check Users
                                </button>
                                <button 
                                    type="button" 
                                    onClick={fillTestData}
                                    className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors text-xs"
                                >
                                    Fill Test Data
                                </button>
                            </div>
                        </div>

                        {/* Status Message */}
                        {statusMessage && (
                            <div className="text-center mb-6">
                                <p className={`text-sm rounded-lg py-3 px-4 border ${
                                    statusMessage.includes('successful') || statusMessage.includes('Welcome') || statusMessage.includes('reachable')
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : statusMessage.includes('Failed') || statusMessage.includes('error') || statusMessage.includes('not')
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                    {statusMessage}
                                </p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name field (only for signup) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-800 placeholder-gray-500"
                                            placeholder="Enter your full name"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-800 placeholder-gray-500"
                                        placeholder="Enter your work email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-800 placeholder-gray-500"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password field (only for signup) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-800 placeholder-gray-500"
                                            placeholder="Confirm your password"
                                            required={!isLogin}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Forgot Password (only for login) */}
                            {isLogin && (
                                <div className="flex justify-end">
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </form>

                        {/* OR Divider */}
                        <div className="my-8 flex items-center">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>

                        {/* Social Sign In Options */}
                        <div className="flex justify-center space-x-4 mb-6">
                            <button
                                onClick={() => handleSocialLogin('Google')}
                                disabled={isLoading}
                                className="flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                                title="Continue with Google"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                            </button>

                            <button
                                onClick={() => handleSocialLogin('Microsoft')}
                                disabled={isLoading}
                                className="flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                                title="Continue with Microsoft"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="#f25022" d="M1 1h10v10H1z"/>
                                    <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                                    <path fill="#7fba00" d="M1 13h10v10H1z"/>
                                    <path fill="#ffb900" d="M13 13h10v10H13z"/>
                                </svg>
                            </button>
                        </div>

                        {/* Toggle Auth Mode */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={toggleMode}
                                    className="ml-2 text-blue-600 hover:text-blue-500 font-medium transition-colors"
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Need access?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                                Contact your administrator
                            </a>
                        </p>
                        <p className="text-xs text-gray-500 mt-4">
                            Protected by enterprise-grade security |{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage