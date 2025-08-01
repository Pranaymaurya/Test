const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');
const UserRoutes = require('./Routes/User');
const CourseRoutes = require('./Routes/Course');
const EnrollmentRoutes = require('./Routes/Enrollment');
const User = require('./Models/user');
const Course = require('./Models/course');
const Enrollment = require('./Models/enrollment');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    'https://test-2vr0.onrender.com',
    'https://radiant-melomakarona-d58a1a.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use(UserRoutes);
app.use(CourseRoutes);
app.use(EnrollmentRoutes);

// Seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    console.log('Starting seed process...');

    // Clear existing data
    try {
      await Enrollment.deleteMany({});
      await Course.deleteMany({});
      await User.deleteMany({});
      console.log('All collections cleared successfully');
    } catch (cleanupError) {
      console.log('Cleanup error:', cleanupError.message);
    }

    // Create a demo user
    // const demoUser = await User.create({
    //   name: 'Demo Student',
    //   email: 'demo@example.com',
    //   password: 'password123',
    //   role: 'student',
    // });
    // console.log('Demo user created:', demoUser._id);

    // Sample course data
    const sampleCourses = [
      {
        title: 'Introduction to JavaScript',
        description: 'Learn the fundamentals of JavaScript programming language',
        instructor: 'Dr. Sarah Johnson',
        duration: '8 weeks',
      },
      {
        title: 'React.js Fundamentals',
        description: 'Build dynamic web applications with React.js',
        instructor: 'Prof. Michael Chen',
        duration: '10 weeks',
      },
      {
        title: 'Node.js Backend Development',
        description: 'Create robust backend applications using Node.js and Express',
        instructor: 'Dr. Emily Rodriguez',
        duration: '12 weeks',
      },
      {
        title: 'MongoDB Database Design',
        description: 'Master NoSQL database design and operations',
        instructor: 'Prof. David Kim',
        duration: '6 weeks',
      },
      {
        title: 'Full Stack Web Development',
        description: 'Complete guide to building full stack applications',
        instructor: 'Dr. Lisa Wang',
        duration: '16 weeks',
      },
    ];

    const createdCourses = await Course.insertMany(sampleCourses);
    console.log('Courses created:', createdCourses.length);

    res.status(201).json({
      message: 'Sample data created successfully',
      courses: createdCourses,
      // demoUser: {
      //   email: demoUser.email,
      //   password: 'password123',
      //   note: 'Use these credentials to test the login',
      // },
    });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ error: 'Seeding failed', details: error.message });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
