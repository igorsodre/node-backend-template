import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { ServerErrorResponse } from './default-error-response';

export const enforceValidInputs: RequestHandler = (req, _res, next) => {
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
        const str = validations
            .array()
            .map((e) => e.param + '##' + e.msg)
            .join(' | ');
        return next(
            new ServerErrorResponse(
                `Invalid inputs, please check your data |${str}|`,
                StatusCodes.UNPROCESSABLE_ENTITY,
            ),
        );
    }
    next();
};
