/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/*  
*node modules
*/
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/* 
* custom modules
 */
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";

/* 
* models 
*/
import Token from "@/models/token"; 

/* 
* types
*/
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken as string;

    try {
        const tokenExists = await Token.exists({ token: refreshToken });

        if(!tokenExists) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token is not valid',
            });
            return;
        }

        // verify refresh token 
        const jwtPayload = verifyRefreshToken(refreshToken) as { 
            userId: Types.ObjectId 
        };

        const accessToken = generateAccessToken(jwtPayload.userId);

        res.status(200).json({
            accessToken,
        });
    } catch(err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token has expired, please login again.',
            });
            return;
        }

        if (err instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err
        });

        logger.error('Error during refresh token process', err);
    }
}

export default refreshToken;