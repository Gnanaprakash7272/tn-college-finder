const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { validateCourse } = require('../middleware/validation');

// GET /api/courses - Get all courses with filters
router.get('/', courseController.getCourses);

// GET /api/courses/college/:collegeId - Get courses by college
router.get('/college/:collegeId', courseController.getCoursesByCollege);

// GET /api/courses/code/:courseCode - Get courses by course code
router.get('/code/:courseCode', courseController.getCoursesByCode);

// GET /api/courses/fee-range - Get courses by fee range
router.get('/fee-range', courseController.getCoursesByFeeRange);

// GET /api/courses/nba-accredited - Get NBA accredited courses
router.get('/nba-accredited', courseController.getNBAAccreditedCourses);

// GET /api/courses/:id - Get course by ID
router.get('/:id', courseController.getCourseById);

// POST /api/courses - Create new course (admin only)
router.post('/', validateCourse, courseController.createCourse);

// PUT /api/courses/:id - Update course (admin only)
router.put('/:id', validateCourse, courseController.updateCourse);

// DELETE /api/courses/:id - Delete course (admin only)
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
