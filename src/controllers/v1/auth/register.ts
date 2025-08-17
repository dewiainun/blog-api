/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
* custom modules 
 */
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import config from "@/config";
import { genUsername } from "@/utils";

/* 
*models
 */
import User from "@/models/user";

/* 
* types
 */
import type { Request, Response } from 'express';
import type { IUser } from "@/models/user";

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData;



    try{
        const username = genUsername();

        const newUser = await User.create({
            username,
            email,
            password,
            role
        });

        // generate access token and refresh token for new user
        
        
        res.status(201).json({
            user:  {
                usernameL: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }  catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error.',
            error: err
        });
        logger.error('Error during user registration', err);
    }
}

export default register;