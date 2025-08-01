import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Plus, User, GraduationCap } from 'lucide-react';

const API_BASE_URL = 'https://test-2vr0.onrender.com/api';

const AdminDashboard = () => {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isInstructor = user.role === 'instructor';
  
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCourses: 0,
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: isInstructor ? user.name : '',
    duration: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // Note: In production, use React state instead of localStorage
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Simulated API call - replace with actual API
        const mockData = {
          totalStudents: 247,
          totalCourses: 18
        };
        setDashboardData(mockData);
        
        // Actual API call (commented out for demo):
        const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboard();
  }, [token]);

  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleAddUser = async () => {
    try {
      // Simulated success for demo
      showMessage('User added successfully!', 'success');
      setUserForm({ name: '', email: '', password: '', role: 'student' });
      
      // Actual API call (commented out for demo):
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userForm),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('User added successfully!', 'success');
        setUserForm({ name: '', email: '', password: '', role: 'student' });
      } else {
        showMessage(data.error || 'Failed to add user', 'error');
      }
    } catch (err) {
      showMessage('Failed to add user', 'error');
    }
  };

  const handleAddCourse = async () => {
    try {
      // Simulated success for demo
      showMessage('Course added successfully!', 'success');
      setCourseForm({ title: '', description: '', instructor: '', duration: '' });
      
      // Actual API call (commented out for demo):
      const res = await fetch(`${API_BASE_URL}/admin/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseForm),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('Course added successfully!', 'success');
        setCourseForm({ title: '', description: '', instructor: '', duration: '' });
      } else {
        showMessage(data.error || 'Failed to add course', 'error');
      }
    } catch (err) {
      showMessage('Failed to add course', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            {isInstructor ? 'Instructor Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isInstructor ? 'Manage your courses and students' : 'Manage users and courses efficiently'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Students</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{dashboardData.totalStudents}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Courses</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{dashboardData.totalCourses}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-8 p-4 rounded-xl border ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          } animate-pulse`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {message}
            </div>
          </div>
        )}

        {/* Forms Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add User Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Add User
              </h2>
              <p className="text-gray-600 mt-1">Create new instructor or student accounts</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={userForm.name} 
                  onChange={(e) => handleInputChange(e, setUserForm)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter full name"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={userForm.email} 
                  onChange={(e) => handleInputChange(e, setUserForm)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter email address"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={userForm.password} 
                  onChange={(e) => handleInputChange(e, setUserForm)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter password"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select 
                  name="role" 
                  value={userForm.role} 
                  onChange={(e) => handleInputChange(e, setUserForm)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isInstructor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={isInstructor}
                >
                  <option value="student">Student</option>
                  {!isInstructor && <option value="instructor">Instructor</option>}
                </select>
              </div>

              <button 
                onClick={handleAddUser}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>
          </div>

          {/* Add Course Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-purple-600" />
                Add Course
              </h2>
              <p className="text-gray-600 mt-1">Create new courses for students</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={courseForm.title} 
                  onChange={(e) => handleInputChange(e, setCourseForm)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Enter course title"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={courseForm.description} 
                  onChange={(e) => handleInputChange(e, setCourseForm)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Enter course description"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                <input 
                  type="text" 
                  name="instructor" 
                  value={courseForm.instructor} 
                  onChange={(e) => handleInputChange(e, setCourseForm)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${isInstructor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Enter instructor name"
                  required 
                  readOnly={isInstructor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input 
                  type="text" 
                  name="duration" 
                  value={courseForm.duration} 
                  onChange={(e) => handleInputChange(e, setCourseForm)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 8 weeks, 3 months"
                  required 
                />
              </div>

              <button 
                onClick={handleAddCourse}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;