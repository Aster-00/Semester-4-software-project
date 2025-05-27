module.exports = function authorizationMiddleware(roles) {
    return (req, res, next) => {
      console.log('=== AUTHORIZATION MIDDLEWARE ===');
      console.log('User:', req.user);
      console.log('Required roles:', roles);
      console.log('User role:', req.user?.role);
      
      if (!req.user) {
        console.log('No user found in request');
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const userRole = req.user.role;
      
      // Handle both string and array roles
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      if (!allowedRoles.includes(userRole)) {
        console.log('Authorization failed. User role:', userRole, 'Required roles:', allowedRoles);
        return res.status(403).json({ message: "Unauthorized access" });
      }
      
      console.log('Authorization successful');
      next();
    };
  }
