import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Zap, ArrowRight, ChevronLeft, Send, Building, Users, Trophy, Menu, X } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface User {
  firstName: string;
  lastName: string;
}

function App() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message); // Display success message
        setEmail(''); // Clear the input field
      } else {
        setMessage(data.message || 'Subscription failed. Please try again.'); // Display error message
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.'); // Handle network errors
    }
  };
  // Check if the user is already logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate the token and fetch user data
      fetch('http://localhost:5000/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setIsLoggedIn(true);
            setUser(data.user);
          }
        })
        .catch((error) => {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
        });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages
    
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Display success message
        setSuccessMessage('Account created successfully!');
        // Optional: redirect after a delay
        setTimeout(() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }, 2000);
      } else {
        // Display the error message from the server
        setErrorMessage(data.message || 'Signup failed');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null); // Clear any previous error
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
  
      if (response.ok) {
        setIsLoggedIn(true);
        setUser({ firstName: data.firstName, lastName: data.lastName }); // Store user data
        localStorage.setItem('token', data.token); // Save the token
        setShowSignIn(false);
      } else {
        setLoginError(data.message || 'Email or password is wrong'); // Set error message
      }
    } catch (error) {
      setLoginError('Something went wrong. Please try again.'); // Set error message
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  if (showSignUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-2 mb-8">
            <button 
              onClick={() => setShowSignUp(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FormifyX</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-600 mb-8">Sign up for early access and exclusive offers</p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="At least 8 characters"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
                      
          {errorMessage && (
            <div className="text-center text-red-500 mt-4">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="text-center text-green-500 mt-4">
              {successMessage}
            </div>
          )}

            <div className="text-center mt-4">
              <span className="text-gray-600">Have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setShowSignIn(true);
                  setShowSignUp(false);
                }}
                className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showSignIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-2 mb-8">
            <button 
              onClick={() => setShowSignIn(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FormifyX</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 mb-8">Sign in to your account to continue</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
  
            {/* Display login error message */}
            {loginError && (
              <p className="text-center text-red-500 mt-4">{loginError}</p>
            )}
  
            <div className="text-center mt-4">
              <span className="text-gray-600">Don't have an account yet? </span>
              <button
                type="button"
                onClick={() => {
                  setShowSignIn(false); // Close the sign-in form
                  setShowSignUp(true);  // Open the sign-up form
                }}
                className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">FormifyX</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            {/* Welcome text visible in both desktop and mobile */}
            <p className="text-gray-900">Welcome, {user?.firstName} {user?.lastName}</p>
            {/* Logout button visible on desktop */}
            <button 
              onClick={handleLogout}
              className="hidden md:inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setShowSignIn(true)}
              className="hidden md:inline-block px-6 py-2 text-blue-600 font-medium hover:text-blue-700"
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowSignUp(true)}
              className="hidden md:inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </>
        )}
        {/* Hamburger menu button for mobile */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  {isMobileMenuOpen && (
    <div className="md:hidden bg-white border-t border-gray-100">
      <div className="px-4 py-2 space-y-2">
        {isLoggedIn ? (
          <>
            {/* Logout button visible in mobile menu */}
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setShowSignIn(true)}
              className="block w-full text-left px-4 py-2 text-blue-600 font-medium hover:text-blue-700"
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowSignUp(true)}
              className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </div>
  )}
</nav>

      {/* Hero Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Make Invoicing
              <span className="text-blue-600"> Simple</span> and
              <span className="text-blue-600"> Faster</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Create professional invoices in seconds with our intuitive mobile app. FormifyX makes billing easier than ever.
            </p>
            <div className="mt-10 flex items-center space-x-4">
              <button 
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <a href="#features">Ask for early access</a>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="lg:w-2/3 mt-12 lg:mt-0 transform scale-100">
            <img 
              src="src/components/iphoneview.svg" 
              alt="iPhone 16 Pro showing FormifyX invoice app" 
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="bg-white py-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 p-6 bg-blue-50 rounded-xl">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">5,000+</p>
                <p className="text-gray-600">Businesses Trust Us</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-blue-50 rounded-xl">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">500K+</p>
                <p className="text-gray-600">Active Users</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 bg-blue-50 rounded-xl">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">#1</p>
                <p className="text-gray-600">Rated Invoice App</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-24">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose FormifyX?</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to manage invoices efficiently</p>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Lightning Fast</h3>
              <p className="mt-4 text-gray-600">Create professional invoices in under 60 seconds</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Professional Templates</h3>
              <p className="mt-4 text-gray-600">Choose from dozens of beautifully designed templates</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Smart Automation</h3>
              <p className="mt-4 text-gray-600">Automate recurring invoices and payment reminders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-blue-600 py-16">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Be the First to Know</h2>
          <p className="mt-4 text-xl text-blue-100">
            Sign up for early access and exclusive offers
          </p>
        </div>
        <div className="mt-8 max-w-md mx-auto">
          <form onSubmit={handleSubscribe} className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
            >
              Subscribe
              <Send className="ml-2 h-4 w-4" />
            </button>
          </form>
          {/* Display success or error message */}
          {message && (
            <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-200' : 'text-red-200'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">FormifyX</span>
              </div>
              <p className="mt-4 text-gray-400">Making invoice creation simple and beautiful for businesses worldwide.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Templates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 FormifyX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;