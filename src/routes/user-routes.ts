import { register, login, fetchAllUsers } from './../controllers/user-controller';
import { Router } from 'express';

const router = Router();

router.get('/', fetchAllUsers);
router.post('/register', register);
router.post('/login', login);

export default router;
