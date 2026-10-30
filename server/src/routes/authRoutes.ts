import { Router, Request, Response, NextFunction } from 'express';
import { 
  registerUser, 
  loginUser, 
  verifyAuthToken, 
  deleteAuthToken, 
  updateUserProfile, 
  getUserStatistics,
  UserProfile 
} from '../services/authService.js';

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
  token?: string;
}

export function extractAuthToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const queryToken = req.query.token;
  if (queryToken && typeof queryToken === 'string') {
    return queryToken.trim();
  }
  return null;
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = extractAuthToken(req);
  if (token) {
    const user = verifyAuthToken(token);
    if (user) {
      req.user = user;
      req.token = token;
    }
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = extractAuthToken(req);
  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required. Please sign in.' });
    return;
  }
  const user = verifyAuthToken(token);
  if (!user) {
    res.status(401).json({ success: false, error: 'Session expired or invalid. Please sign in again.' });
    return;
  }
  req.user = user;
  req.token = token;
  next();
}

const router = Router();

// POST /api/auth/register
router.post('/register', (req: Request, res: Response): void => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;
    const { user, token } = registerUser({ name, email, password, targetRole, experienceLevel });
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user,
      token,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required.' });
      return;
    }
    const { user, token } = loginUser(email, password);
    res.json({
      success: true,
      message: 'Logged in successfully!',
      user,
      token,
    });
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message || 'Login failed.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const stats = getUserStatistics(req.user!.id);
    res.json({
      success: true,
      user: req.user,
      stats,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch profile.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { name, targetRole, experienceLevel, bio } = req.body;
    const updated = updateUserProfile(req.user!.id, { name, targetRole, experienceLevel, bio });
    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updated,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to update profile.' });
  }
});

// GET /api/auth/stats
router.get('/stats', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const stats = getUserStatistics(req.user!.id);
    res.json({
      success: true,
      stats,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch user stats.' });
  }
});

// POST /api/auth/logout
router.post('/logout', optionalAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (req.token) {
      deleteAuthToken(req.token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to log out.' });
  }
});

export default router;
