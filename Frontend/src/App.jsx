import { useState, useEffect } from 'react';
import { BookOpen, Clock, User, CheckCircle, LogOut, UserPlus, LogIn } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';

const API_BASE_URL = 'http://localhost:5000/api';

// Admin Dashboard Component (Placeholder)

// Login Component
const LoginForm = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log('Login response status:', response.status);
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response: missing token or user data');
      }

      console.log('Calling onLogin with:', data.user, data.token);
      onLogin(data.user, data.token);

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={onSwitchToSignup}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </button>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Signup Component
const SignupForm = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onSignup(data.user, data.token);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to existing account
            </button>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password (min 6 characters)"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, isEnrolled, onEnroll, isEnrolling }) => {
  const enrolled = isEnrolled(course._id);
  const isEnrollingThis = isEnrolling === course._id;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
        </div>
        {enrolled && (
          <CheckCircle className="h-6 w-6 text-green-500" />
        )}
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">{course.description}</p>

      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <User className="h-4 w-4" />
          <span>{course.instructor}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{course.duration}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {enrolled ? (
          <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Enrolled
          </span>
        ) : (
          <button
            onClick={() => onEnroll(course._id)}
            disabled={isEnrollingThis}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isEnrollingThis ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enrolling...
              </>
            ) : (
              'Enroll'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Token storage utility (using localStorage for persistence)
const saveAuthData = (user, token) => {
  try {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving auth data to localStorage:', error);
  }
};

const getAuthData = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    return {
      token: token,
      user: user
    };
  } catch (error) {
    console.error('Error reading auth data from localStorage:', error);
    return {
      token: null,
      user: null
    };
  }
};

const clearAuthData = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing auth data from localStorage:', error);
  }
};

// Token validation utility
const isValidToken = (token) => {
  if (!token) return false;
  
  try {
    // Basic token structure validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode the payload (for JWT tokens)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'admin'
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true to check for existing token
  const [enrolling, setEnrolling] = useState(null);
  const [error, setError] = useState(null);

  // Check for existing token on app initialization
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const authData = getAuthData();
        
        if (authData.token && authData.user) {
          console.log('Found existing auth data:', authData);
          
          // Validate token
          if (isValidToken(authData.token)) {
            // Verify token with backend
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
              headers: {
                'Authorization': `Bearer ${authData.token}`,
              },
            });
            
            if (response.ok) {
              const userData = await response.json();
              console.log('Token verified, user data:', userData);
              setUser(userData.user || authData.user);
              setToken(authData.token);
            } else {
              console.log('Token verification failed, clearing auth data');
              clearAuthData();
            }
          } else {
            console.log('Invalid token format, clearing auth data');
            clearAuthData();
          }
        } else {
          console.log('No existing auth data found');
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkExistingAuth();
  }, []);

  // Fetch courses with authentication
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 401 || response.status === 403) {
        console.log('Auth failed while fetching courses, logging out');
        handleLogout();
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Using demo data for now.');
      // Demo data for testing
      setCourses([
        {
          _id: '1',
          title: 'Introduction to React',
          description: 'Learn the basics of React including components, state, and props.',
          instructor: 'John Doe',
          duration: '4 weeks'
        },
        {
          _id: '2',
          title: 'Advanced JavaScript',
          description: 'Deep dive into ES6+, async programming, and modern JavaScript patterns.',
          instructor: 'Jane Smith',
          duration: '6 weeks'
        },
        {
          _id: '3',
          title: 'Node.js Backend Development',
          description: 'Build scalable backend applications with Node.js and Express.',
          instructor: 'Mike Johnson',
          duration: '8 weeks'
        }
      ]);
    }
  };

  // Fetch enrolled courses with authentication
  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 401 || response.status === 403) {
        console.log('Auth failed while fetching enrollments, logging out');
        handleLogout();
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }
      
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setError('Failed to load enrollments. Using demo data for now.');
      setEnrolledCourses([]);
    }
  };

  // Load data when user is authenticated
  useEffect(() => {
    if (user && token && !loading) {
      const loadData = async () => {
        await Promise.all([fetchCourses(), fetchEnrolledCourses()]);
      };
      loadData();
    }
  }, [user, token, loading]);

  // Handle login
  const handleLogin = (userData, userToken) => {
    console.log('Handling login:', userData, userToken);
    setUser(userData);
    setToken(userToken);
    saveAuthData(userData, userToken);
  };

  // Handle signup
  const handleSignup = (userData, userToken) => {
    console.log('Handling signup:', userData, userToken);
    setUser(userData);
    setToken(userToken);
    saveAuthData(userData, userToken);
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Handling logout');
    setUser(null);
    setToken(null);
    setCourses([]);
    setEnrolledCourses([]);
    setCurrentView('dashboard');
    setError(null);
    clearAuthData();
  };

  // Handle enrollment
  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      if (response.status === 401 || response.status === 403) {
        console.log('Auth failed while enrolling, logging out');
        handleLogout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enroll');
      }

      // Refresh enrolled courses
      await fetchEnrolledCourses();
      
    } catch (error) {
      console.error('Error enrolling:', error);
      setError(error.message);
      // For demo purposes, simulate enrollment
      const course = courses.find(c => c._id === courseId);
      if (course) {
        setEnrolledCourses(prev => [...prev, course]);
      }
    } finally {
      setEnrolling(null);
    }
  };

  // Check if student is enrolled in a course
  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId);
  };

  // Show loading screen while checking for existing token
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show auth forms if user is not logged in
  if (!user) {
    return authMode === 'login' ? (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthMode('signup')}
      />
    ) : (
      <SignupForm
        onSignup={handleSignup}
        onSwitchToLogin={() => setAuthMode('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Learning Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.name}</span>
                <span className="ml-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {user.role}
                </span>
              </div>
              {(user.role === 'admin' || user.role === 'instructor') && (
                <button
                  onClick={() => setCurrentView(currentView === 'admin' ? 'dashboard' : 'admin')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {currentView === 'admin' ? 'Dashboard' : (user.role === 'admin' ? 'Admin Dashboard' : 'Instructor Dashboard')}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'admin' ? (
        <AdminDashboard />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="text-sm text-red-700">{error}</div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Available Courses</p>
                  <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                  <p className="text-2xl font-semibold text-gray-900">{enrolledCourses.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {courses.length > 0 ? Math.round((enrolledCourses.length / courses.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Listing */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
            
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No courses available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard 
                    key={course._id} 
                    course={course}
                    isEnrolled={isEnrolled}
                    onEnroll={handleEnroll}
                    isEnrolling={enrolling}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;