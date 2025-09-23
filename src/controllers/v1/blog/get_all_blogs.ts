/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/*  
custom modules
*/
import config from '@/config';
import { logger } from '@/lib/winston';

/** 
 * models
*/
import Blog from '@/models/blog';
import User from '@/models/user';

/* *
types
*/
import type { Request, Response } from 'express';

interface QueryType {
    status?: 'draft' | 'published';
}

const getAllBlogs = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try{
        const userId  = req.userId;
        const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultResOffset;
        const total= await Blog.countDocuments();

        const user = await User.findById(userId).select('role').lean().exec();

        //show only the published post to a normal user
        // 4.27.52

        const users = await User.find()
            .select('-__v')
            .limit(limit)
            .skip(offset)
            .lean()
            .exec();

        res.status(200).json({
            limit,
            offset,
            total,
            users
        });
    } catch (err) {
                res.status(500).json({
                    code: 'ServerError',
                    message: 'Internal server error',
                    error: err, 
                });

                logger.error('Error while updating current user', err);
            }
}

export default getAllBlogs;