const jwt = require('jsonwebtoken');

// Clé secrète pour JWT stockée dans le fichier .env
const secretKey = process.env.SECRET_KEY;

const authMiddleware = {
  isAuthenticated: (req, res, next) => {
    next();
    return;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ error: 'No token provided' });
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  }
}

module.exports = authMiddleware;
