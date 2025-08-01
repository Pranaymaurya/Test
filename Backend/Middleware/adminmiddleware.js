const adminMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'instructor')) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admins and Instructors only.' });
  }
};

module.exports = adminMiddleware;
