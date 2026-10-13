const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authorization = req.get('authorization');
  const [scheme, token] = authorization ? authorization.split(' ') : [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload || typeof payload === 'string' || !payload.id) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.user = { id: payload.id };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired authentication token' });
    }

    return next(error);
  }
};

module.exports = authMiddleware;
