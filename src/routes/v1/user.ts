/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/*
node modules 
*/
import { Router } from 'express';
import { param, query, body } from 'express-validator';

/* 
middlewares 
*/
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';

/*  
controllers
*/
import getCurrentUser from '@/controllers/v1/user/get_current_user';

/*  
models
*/
import user from '@/models/user';

const router = Router();

router.get(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    getCurrentUser,
);

router.put(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    updateCurrentUser,
);

export default router;



