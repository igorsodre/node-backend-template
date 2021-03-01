// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../global.d.ts" />
import { ServerErrorResponse } from './default-error-response';
import { RequestHandler, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { User } from '../entity/User';
import { getConnection } from 'typeorm';

export const createRefreshToken = (user: User): string => {
    return sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.JWT_REFRESH_SECRET || '', {
        expiresIn: '7d',
    });
};

export const createAccessToken = (data: string | Record<string, unknown>): string => {
    return sign(data, process.env.JWT_ACCESS_SECRET || '', { expiresIn: '15m' });
};

export const revokeRefreshTokensForUser = async (userId: number): Promise<boolean> => {
    await getConnection().getRepository(User).increment({ id: userId }, 'tokenVersion', 1);
    return true;
};

export const setRefreshTokenOnCookie = (res: Response, refreshToken: string): void => {
    const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;
    const SEVEN_DAYS_FROM_NOW = new Date(Number(new Date()) + SEVEN_DAYS);
    res.cookie('jid', refreshToken, { httpOnly: true, expires: SEVEN_DAYS_FROM_NOW });
};

export const isAuthenticated: RequestHandler = (req, _res, next) => {
    if (req.method === 'OPTIONS') return next();
    const auth = req.headers['authorization'];

    const token = auth?.split(' ')[1];
    if (!token) {
        return next(new ServerErrorResponse('Invalid credentials', StatusCodes.FORBIDDEN));
    }
    try {
        const payload = verify(
            token,
            process.env.JWT_ACCESS_SECRET || 'NOT_FOUND_SECRET_KJDHSAHJSDA',
        ) as IAppTokenFormat;
        req.appData = payload;
        next();
    } catch (err) {
        console.log('\n[ ', err, '\n ]');
        return next(new ServerErrorResponse('Invalid credentials', StatusCodes.FORBIDDEN, err));
    }
};
