/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
* node modules 
*/
import { validationResult } from 'express-validator';

/* 
* types
 */
import type { Request, Response, NextFunction } from 'express';

const validationError = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(400).json({
            code: 'validationError',
            errors: errors.mapped(),
        });
        return;
    }

    next();
};

export default validationError;