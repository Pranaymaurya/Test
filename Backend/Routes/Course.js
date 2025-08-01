const express = require('express');
const Course = require('../Models/course');
const User = require('../Models/user');
const authenticateToken = require('../Middleware/authmiddleware');
const adminMiddleware = require('../Middleware/adminmiddleware');
const router = express.Router();

router.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Admin route to add courses
router.post('/api/admin/courses', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const { title, description, instructor, duration } = req.body;

    if (!title || !description || !instructor || !duration) {
      return res.status(400).json({ error: 'All course fields are required' });
    }

    const course = new Course({
      title,
      description,
      instructor,
      duration,
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Admin dashboard route to get total students and total courses
router.get('/api/admin/dashboard', authenticateToken, adminMiddleware, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();

    res.json({
      totalStudents,
      totalCourses,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
