const express = require('express');
const User = require('../Models/user');
const Enrollment = require('../Models/enrollment');
const Course = require('../Models/course');
const authenticateToken = require('../Middleware/authmiddleware');
const router = express.Router();

router.get('/api/enrollments/me', authenticateToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id })
      .populate('courseId');
    
    const enrolledCourses = enrollments.map(enrollment => enrollment.courseId);
    res.json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// POST /api/enrollments - Create a new enrollment record
router.post('/api/enrollments', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      courseId,
      studentId: req.user._id,
    });

    if (existingEnrollment) {
      return res.status(409).json({ error: 'Already enrolled in this course' });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      courseId,
      studentId: req.user._id,
    });

    await enrollment.save();
    
    // Populate course data in response
    await enrollment.populate('courseId');
    
    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment: enrollment,
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

module.exports = router;
