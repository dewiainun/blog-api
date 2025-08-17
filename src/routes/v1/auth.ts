/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/**
 * node modules
 */
import {  Router } from 'express';

/* 
* controllers
 */
import register from '@/controllers/v1/auth/register';

/* 
* middlewares
*/

/* 
* models
 */

const router = Router();

router.post('/register', register);

export default router;
