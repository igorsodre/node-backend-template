import { compare, hash } from 'bcryptjs';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verify } from 'jsonwebtoken';
import { User } from '../entity/User';
import { createAccessToken, createRefreshToken, setRefreshTokenOnCookie } from '../util/auth-util';
import { ServerErrorResponse } from './../util/default-error-response';

export const refreshToken: RequestHandler = async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
        return res.json({ data: { ok: false, accessToken: '' } });
    }
    let payload;
    try {
        payload = verify(token, process.env.JWT_REFRESH_SECRET || '');
    } catch (err) {
        return res.json({ data: { ok: false, accessToken: '', message: err.message } });
    }
    const user = await User.findOne({ id: (payload as any).userId });

    if (!user || user.tokenVersion !== Number((payload as any).tokenVersion)) {
        return res.json({ data: { ok: false, accessToken: '' } });
    }

    // if got here, token is valid
    // refreshing the refresh token
    const refreshToken = createRefreshToken(user);
    setRefreshTokenOnCookie(res, refreshToken);
    return res.json({ data: { ok: true, accessToken: createAccessToken({ userId: user.id }) } });
};

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
    const refreshToken = createRefreshToken(user);
    setRefreshTokenOnCookie(res, refreshToken);
    res.json({
        data: {
            accessToken: createAccessToken({ userId: user.id }),
        },
    });
};
