import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Users, Building, User } from 'lucide-react'

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

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate loading
        setTimeout(() => {
            setIsLoading(false)
            if (isLogin) {
                console.log('Logged in with:', email, password)
            } else {
                console.log('Signed up with:', fullName, email, password)
            }
        }, 2000)
    }

    const handleSocialLogin = async (provider) => {
        setIsLoading(true);
        setStatusMessage(`Checking ${provider} account...`);
        
        try {
            // Simulate checking if user exists
            await new Promise((res) => setTimeout(res, 1500));
            
            // Simulate random user existence check (30% chance of existing account)
            const userExists = Math.random() > 0.7;
            
            if (userExists) {
                setStatusMessage(`Welcome back! Signing you in with ${provider}...`);
                await new Promise((res) => setTimeout(res, 1000));
                console.log(`${provider} login successful`);
                setStatusMessage('');
            } else {
                setStatusMessage(`No account found. Let's create one for you!`);
                await new Promise((res) => setTimeout(res, 1000));
                setIsLogin(false);
                setStatusMessage('');
            }
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
                            <h1 className="text-2xl font-bold">EmpManager Pro</h1>
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
                        <h1 className="text-xl font-bold text-gray-800">EmpManager Pro</h1>
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

                        {/* Status Message */}
                        {statusMessage && (
                            <div className="text-center mb-6">
                                <p className="text-gray-700 text-sm bg-blue-50 rounded-lg py-2 px-4 border border-blue-200">
                                    {statusMessage}
                                </p>
                            </div>
                        )}

                        {/* Form */}
                        <div className="space-y-6">
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
                                            required
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
                                            required
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
                                onClick={handleSubmit}
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
                        </div>

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