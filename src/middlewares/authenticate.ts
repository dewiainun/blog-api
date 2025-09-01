/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
* node modules
*/

import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/* 
* custom modules
*/
import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";

/* 
*  types
*/
import type { Request, Response, NextFunction } from "express";
import type { Types } from "mongoose";

/**
 * @function authenticate
 * @description middleware to verify the user's access token from the Authorization header.
 *  If the token is valid, the user's ID is attached to request object.
 * otherwise, it returns an appropriate error response.
 *
 * @param {Request} req - Express request object. expects a bearer token in the authorization header
 * @param {Response} res - Express response object used to send error responses if authentication fails
 * @param {NextFunction} next - Express next middleware function to pass control to the next middleware.
 * @returns {void}
 */
const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    // if there is no bearer token, respond with 401 unauthorized
    if(!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Access denied, no access token provided',
        });
        return;
    }

    // split out the token from  'Bearer' prefix
    const[_, token] = authHeader.split(' ');

    try{
        // verify the token and extract the userId from payload
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

        // attach the userId to the request object for later use
        req.userId = jwtPayload.userId;

        // proceed to the next middleware or route handler
        return next();
    } catch(err) {
        // handle expired token error
        if(err instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token expired, request a new one with refresh token',
            });
            return;
    }


    //handle invalid token error
    if(err instanceof JsonWebTokenError) {
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Access token invalid',
        });
        return;
    }

    //catch-all for other errors
    res.status(500).json({
        code: 'ServerError',
        message: 'internal server error',
        error: err
    });

    logger.error('Error during authentication', err);
    }
};

export default authenticate;