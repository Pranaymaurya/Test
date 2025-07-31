const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  duration: String,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
