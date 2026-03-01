/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/*  
*node modules
*/
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/*  
custom modules
*/
import { logger } from '@/lib/winston';

/* 
* models
*/
import Blog from '@/models/blog';
import comment from '@/models/comment';

/* 
* types
 */
import type { Request, Response } from 'express';
import type { IComment } from '@/models/comment';

type CommentData = Pick<IComment, 'content'>;

/* 
* Purify the comment content 
*/
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentBlog = async (req: Request, res: Response): Promise<void> => {
    const { content } = req.body as CommentData;
    const { blogId } = req.params;
    const userId = req.userId;

    try {
        const blog = await Blog.findById(blogId).select('commentsCount').exec();

        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }

        const cleanContent = purify.sanitize(content);

        const newComment = await comment.create({
            blogId,
            content: cleanContent,
            userId,
        });

        logger.info('Comment created successfully', newComment);

        blog.commentsCount ++;
        await blog.save();

        logger.info('Blog comments count updated', {
            blogId: blog._id,
            commentsCount: blog.commentsCount,
        });
        
        res.status(201).json({
            comment: newComment,
        })
    } catch (err) {
                res.status(500).json({
                    code: 'ServerError',
                    message: 'Internal server error',
                    error: err, 
                });

                logger.error('Error during commenting', err);
            }
}

export default commentBlog;