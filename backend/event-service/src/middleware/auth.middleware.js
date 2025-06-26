const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token ? token.substring(0, 20) + '...' : 'No token');
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token provided'
      });
    }

    try {
      // Log JWT secret for debugging (first few characters only)
      console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
      if (process.env.JWT_SECRET) {
        console.log('JWT_SECRET preview:', process.env.JWT_SECRET.substring(0, 5) + '...');
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully. User role:', decoded.role);

      // Set user in request object
      // Store decoded token directly as req.user
      req.user = decoded;
      // Note: User ID is available as req.user.id
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - Invalid token'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access to specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorize middleware - Required roles:', roles);
    
    if (!req.user) {
      console.log('Authorize middleware - No user in request');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - User not found in request'
      });
    }
    
    console.log('Authorize middleware - User role:', req.user.role);
    console.log('Authorize middleware - User ID:', req.user.id);

    if (!roles.includes(req.user.role)) {
      console.log(`Authorize middleware - Role mismatch: ${req.user.role} not in [${roles.join(', ')}]`);
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route. Required roles: ${roles.join(', ')}`
      });
    }

    console.log('Authorize middleware - Authorization successful');
    next();
  };
};