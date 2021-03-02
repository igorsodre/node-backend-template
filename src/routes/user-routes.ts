import { register, login, fetchAllUsers, refreshToken } from './../controllers/user-controller';
import { Router } from 'express';
import cookieParser from 'cookie-parser';
// import { isAuthenticated } from '../util/auth-util';

const router = Router();

router.get('/', fetchAllUsers);

// router.get('/testing/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     await revokeRefreshTokensForUser(Number(userId));
//     res.json({ data: userId });
// });

router.post('/refresh_token', cookieParser(), refreshToken);
router.post('/register', register);
router.post('/login', login);

export default router;
