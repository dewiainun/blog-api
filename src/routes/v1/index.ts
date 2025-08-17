/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
* node modules
*/
import { Router } from 'express';
const router = Router();

/* 
* routes
*/
import authRoutes from '@/routes/v1/auth';

/**
 *  Root route
  */
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is live!',
        status: 'ok',
        version: '1.0.0',
        docs: 'https://docs.blog-api.codewithus.com',
        timestamp: new Date().toISOString(),
    });
});

router.use('/auth', authRoutes);

export default router;
