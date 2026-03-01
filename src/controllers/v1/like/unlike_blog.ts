/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/*  
custom modules
*/
import { logger } from '@/lib/winston';

/* 
* models
*/
import Blog from '@/models/blog';
import like from '@/models/like';
import Like from '@/models/like';

/* 
* types
 */
import type { Request, Response } from 'express';

const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;
    const { userId } = req.body;

    try {
        const exitingLike = await Like.findOne({ blogId, userId }).lean().exec();

        if (!exitingLike) {
        res.status(404).json({
            code: 'BadRequest',
            message: 'Like not found',
        });
        return;
    }

    await Like.deleteOne({ _id: exitingLike._id });

        const blog = await Blog.findById(blogId).select('likesCount').exec();

        if (!blog) {
        res.status(404).json({
            code: 'BadRequest',
            message: 'Blog not found',
        });
        return;
        }

        blog.likesCount --;
        await blog.save();

        logger.info('Blog unliked successfully', { 
            userId,
            blogId: blog._id,
            likesCount: blog.likesCount,
        });

        res.sendStatus(204);
    } catch (err) {
                res.status(500).json({
                    code: 'ServerError',
                    message: 'Internal server error',
                    error: err, 
                });

                logger.error('Error while liking blog', err);
            }
}

export default unlikeBlog;
