import { ErrorRequestHandler, RequestHandler } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { ServerErrorResponse } from './default-error-response';

export const defaultErrorRequestHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            err && console.log(err);
        });
    }
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'An unknown error occurred!',
    });
};

export const defaultNotFoundResponse: RequestHandler = (_, _res, next) => {
    return next(new ServerErrorResponse('This route does not exist.', StatusCodes.NOT_FOUND));
};
