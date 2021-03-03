import cookieParser from 'cookie-parser';
import { Router } from 'express';
import { check } from 'express-validator';
import { isUserAuthenticated } from '../util/auth-util';
import { enforceValidInputs } from '../util/input-validation-util';
import { getLoggedUserDetails, login, logout, refreshToken, register, update } from './../controllers/user-controller';

const router = Router();

router.post('/refresh_token', cookieParser(), refreshToken);

router.get('/', isUserAuthenticated, getLoggedUserDetails);

router.post(
    '/register',
    [check('name').notEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({ min: 4 })],
    enforceValidInputs,
    register,
);

router.post(
    '/update',
    isUserAuthenticated,
    [
        check('name').notEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 4 }),
        check('newpassword').isLength({ min: 4 }),
    ],
    enforceValidInputs,
    update,
);

router.post('/login', login);

router.post('/logout', logout);

export default router;
