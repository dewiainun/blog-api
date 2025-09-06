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
import updateCurrentUser from '@/controllers/v1/user/update_current_user';
import deleteCurrentUser from '@/controllers/v1/user/detele_current_user';

/*  
models
*/
import User from '@/models/user';

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
    body('username')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Username must be less than 20 characters long')
        .custom(async (value) => {
            const userExists = await User.exists({ username: value });

            if (userExists) {
                throw Error('This username already in use');
            }
        }),
    body('email')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters long')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });

            if (userExists) {
                throw Error('This email is already in use');
            }
        }),
    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('first_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('First name must be less than 20 characters long'),
    body('last_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Last name must be less than 20 characters long'),
    body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
        .optional()
        .isURL()
        .withMessage('Invalid URL format')
        .isLength({ max: 100 })
        .withMessage('URL must be less than 100 characters long'),
    validationError,
    updateCurrentUser,
);

// for delete
router.delete(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    deleteCurrentUser,
);

// get all users
router.get(
    "/",
    authorize(['admin']),
    getAllUser
)
export default router;



