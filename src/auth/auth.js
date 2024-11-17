const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key'; 

const verifyToken = (req, res, next) => {
  
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next(); 
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
