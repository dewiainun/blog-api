/**
 * @copyright 2025 dewiainun
 * @license MIT
**/

/* 
* node modules
 */
import dotenv from 'dotenv';

/* 
* TYPES
 */
import type ms from 'ms';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ['https://docs.blog-api.codewithus.com'],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
    WHITELIST_ADMINS_MAIL: [
        'dewiainun04@gmail.com',
        'dwnnmlh@gmail.com'
    ],
    defaultResLimit: 20,
    defaultResOffset: 0,
};

export default config;