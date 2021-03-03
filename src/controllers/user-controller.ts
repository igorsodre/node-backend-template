import { compare, hash } from 'bcryptjs';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verify } from 'jsonwebtoken';
import { User } from '../entity/User';
import { IRefreshToken } from '../typings/token';
import { createAccessToken, createRefreshToken, setRefreshTokenOnCookie } from '../util/auth-util';
import { ServerErrorResponse } from './../util/default-error-response';

export const refreshToken: RequestHandler = async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
        return res.json({ data: { ok: false, accessToken: '' } });
    }

    // check if token is valid and has an existing user associated with it
    let payload: IRefreshToken;
    try {
        payload = verify(token, process.env.JWT_REFRESH_SECRET || '') as IRefreshToken;
    } catch (err) {
        return res.json({ data: { ok: false, accessToken: '', message: err.message } });
    }
    const user = await User.findOne({ id: payload.userId });

    if (!user || user.tokenVersion !== Number(payload.tokenVersion)) {
        return res.json({ data: { ok: false, accessToken: '' } });
    }

    // if got here, token is valid
    // refreshing the refresh token
    const refreshToken = createRefreshToken(user);
    setRefreshTokenOnCookie(res, refreshToken);
    return res.json({ data: { ok: true, accessToken: createAccessToken(user), user: user.getDisplayableValues() } });
};

export const fetchAllUsers: RequestHandler = async (_req, res) => {
    res.json({ data: await User.find({ select: ['id', 'name', 'email'] }) });
};

export const getLoggedUserDetails: RequestHandler = async (req, res, next) => {
    const { userId } = req.appData as IAccessTokenFormat;
    try {
        const user = await User.findOne(userId);
        if (!user) {
            return next(new ServerErrorResponse('Failed to load user', StatusCodes.NOT_FOUND));
        }
        return res.json({ data: user.getDisplayableValues() });
    } catch (err) {
        return next(new ServerErrorResponse('Failed to load user', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }
};

export const register: RequestHandler = async (req, res, next) => {
    const { email, password, name } = req.body;

    // check if there is an user with provided email
    try {
        const existingUser = await User.find({ where: { email } });
        if (existingUser && existingUser.length) {
            return next(new ServerErrorResponse('Email already exist', StatusCodes.FORBIDDEN));
        }
    } catch (err) {
        return next(new ServerErrorResponse('Failed to add user', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }

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

export const update: RequestHandler = async (req, res, next) => {
    const { email, password, name, newpassword } = req.body;
    const { userId } = req.appData as IAccessTokenFormat;

    // Validating user
    const invalidUserOrPasswordError = new ServerErrorResponse('invalid password', StatusCodes.FORBIDDEN);
    let user: User;
    try {
        user = (await User.findOne(userId)) as User;
        if (!user) {
            return next(invalidUserOrPasswordError);
        }
        const isValid = await compare(password, user.password);
        if (!isValid) {
            return next(invalidUserOrPasswordError);
        }
    } catch (err) {
        return next(new ServerErrorResponse('Failed to update user', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }

    // Cant update email if someone else's got it
    if (user.email !== email) {
        try {
            const existingUser = await User.find({ where: { email } });
            if (existingUser && existingUser.length) {
                return next(new ServerErrorResponse('Email already exist', StatusCodes.FORBIDDEN));
            }
        } catch (err) {
            return next(new ServerErrorResponse('Failed to add user', StatusCodes.INTERNAL_SERVER_ERROR, err));
        }
    }

    const hashedPass = await hash(newpassword, 12);
    try {
        user.email = email;
        user.name = name;
        user.password = hashedPass;
        await user.save();
    } catch (err) {
        return next(new ServerErrorResponse('Failed to update user', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }

    res.json({ data: user.getDisplayableValues() });
};

export const login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    // Validating user
    const invalidUserOrPasswordError = new ServerErrorResponse('invalid user/password', StatusCodes.FORBIDDEN);
    let user: User;
    try {
        user = (await User.findOne({ where: { email } })) as User;
        if (!user) {
            return next(invalidUserOrPasswordError);
        }
        const isValid = await compare(password, user.password);
        if (!isValid) {
            return next(invalidUserOrPasswordError);
        }
    } catch (err) {
        return next(new ServerErrorResponse('Failed to login', StatusCodes.INTERNAL_SERVER_ERROR, err));
    }

    // login success
    const refreshToken = createRefreshToken(user);
    setRefreshTokenOnCookie(res, refreshToken);
    res.json({
        data: {
            accessToken: createAccessToken(user),
            user: user.getDisplayableValues(),
        },
    });
};

export const logout: RequestHandler = async (_req, res) => {
    setRefreshTokenOnCookie(res, '');
    res.json({ data: 'ok' });
};
