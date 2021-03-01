import { sign } from 'jsonwebtoken';

export const createRefreshToken = (data: string | Record<string, unknown>): string => {
    return sign(data, process.env.JWT_REFRESH_SECRET || '', { expiresIn: '7d' });
};

export const createAccessToken = (data: string | Record<string, unknown>): string => {
    return sign(data, process.env.JWT_ACCESS_SECRET || '', { expiresIn: '15m' });
};
