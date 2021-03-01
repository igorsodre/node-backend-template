import { RequestHandler } from 'express';
import { compare, hash } from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { createAccessToken, createRefreshToken } from 'src/util/auth-util';
import { User } from '../entity/User';
import { ServerErrorResponse } from './../util/default-error-response';

export const fetchAllUsers: RequestHandler = async (_req, res) => {
    res.json({ data: await User.find({ select: ['id', 'name', 'email'] }) });
};

export const register: RequestHandler = async (req, res, next) => {
    const { email, password, name } = req.body;

    const hashedPass = await hash(password, 12);

    try {
        await User.insert({
            name,
            email,
            password: hashedPass,
        });
    } catch (err) {
        return next(new ServerErrorResponse('Failed to add user', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }

    res.json({ data: 'OK' });
};

export const login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    // Validating user
    const invalidUserPass = new ServerErrorResponse('invalid user/password', StatusCodes.FORBIDDEN);
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(invalidUserPass);
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
        return next(invalidUserPass);
    }

    // login success
    const refreshToken = createRefreshToken({ userId: user.id });
    res.cookie('jid', refreshToken, { httpOnly: true });
    res.json({
        data: {
            accessToken: createAccessToken({ userId: user.id }),
        },
    });
};
