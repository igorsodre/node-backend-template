import { RequestHandler } from 'express';

export const allowOrigin: RequestHandler = (_, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
};
