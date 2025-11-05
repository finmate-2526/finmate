import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // More explicit message to aid debugging during development
      console.error('Auth middleware error: JWT_SECRET is not set');
      return res.status(500).json({ error: 'Server misconfigured: missing JWT secret' });
    }
    const payload = jwt.verify(token, secret);
    req.user = payload; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
