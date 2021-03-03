// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../global.d.ts" />
import { RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sign, verify } from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { ServerErrorResponse } from './default-error-response';

// Create token that will be set in the http only cookie
export const createRefreshToken = (user: User): string => {
    return sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.JWT_REFRESH_SECRET || '', {
        expiresIn: '7d',
    });
};

// Create token to be stored in memory on the frontend
export const createAccessToken = (user: User): string => {
    return sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET || '', { expiresIn: '15m' });
};

// Used to invalidade all tokens from the given user
export const revokeAllRefreshTokensForUser = async (userId: number): Promise<boolean> => {
    await getConnection().getRepository(User).increment({ id: userId }, 'tokenVersion', 1);
    return true;
};

export const setRefreshTokenOnCookie = (res: Response, refreshToken: string): void => {
    const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;
    const SEVEN_DAYS_FROM_NOW = new Date(Number(new Date()) + SEVEN_DAYS);
    res.cookie('jid', refreshToken, { httpOnly: true, expires: SEVEN_DAYS_FROM_NOW, path: '/api/users/refresh_token' });
};

export const isUserAuthenticated: RequestHandler = (req, _res, next) => {
    if (req.method === 'OPTIONS') return next();
    const auth = req.headers['authorization'];

    const token = auth?.split(' ')[1];
    if (!token) {
        return next(new ServerErrorResponse('Invalid credentials', StatusCodes.FORBIDDEN));
    }
    try {
        const payload = verify(token, process.env.JWT_ACCESS_SECRET || '') as IAccessTokenFormat;
        req.appData = payload;
        next();
    } catch (err) {
        return next(new ServerErrorResponse('Invalid credentials', StatusCodes.FORBIDDEN, err));
    }
};
