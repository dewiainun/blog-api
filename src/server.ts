/* 
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
* node modules
 */
/**
 * @copyright 2025 dewiainun
 * @license MIT
**/

/* 
* Node Modules
*/
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/* 
* custom modules
 */
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import { logger } from './lib/winston';

/**
 * router  
  */
import v1Router from '@/routes/v1';



/* 
*types
 */
import type { CorsOptions } from 'cors';
import e from 'express';

/* 
* Express app initialization
*/
const app = express();

// configure cors options
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if(config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS Error: ${origin} is not allowed by CORS`), 
            false
            );
            console.log(`CORS Error: ${origin} is not allowed by CORS`);
        }
    },
};

// apply CORS middleware
// apply cors middleware
app.use(cors(corsOptions));

// enable JSON request body parsing
app.use(express.json());

//enable URL-encoded request body  parsing with extended mode
// `extended:true` allows rich objects and arrays via querystring library
app.use(e.urlencoded({ extended: true }));
//enable URL-encoded request body parsing with extended mode 
// `extended: true` allows rich objects and arrays via querysring library
app.use(express.urlencoded ({ extended: true }));

app.use(cookieParser());

//enable response compression to reduce payload size and improve performance
app.use(
    compression({
        threshold: 1024,// only compress responses larger than 1KB
    }),
);

// use helmet to enhance security by setting various HTTP headers
app.use(helmet());

// apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

/* 
* immediately invoked async function expression (IIFE) to start the server
* - tries to connect to the database before initializing the server.
* - defines the API route (`/api/v1`)
* - starts the server on the specified PORT and logs the running URL.
* - if an error occurs during startup, it logged, and the process exits with status 1.
*/

(async () => {
    try{
        await connectToDatabase();

        app.use('/api/v1', v1Router);

        app.listen(config.PORT, () => {
            logger.info(`Server is running http://localhost:${config.PORT}`);
        });
            } catch (err) {
                logger.error('Failed to start the server', err);

                if(config.NODE_ENV === 'production') {
                    process.exit(1);
                }
            }
})();

/* 
* handles server shutdown gracefully by disconnecting from the database.
*
* - attempts to disconnect from the database before shutting down the server.
* logs a success message if the disconnection is successful.
* - if an error occurs during disconnection, it logged to the console.
* - exits the process with status code `0` (indicating a successful shutdown)
*/

const handleServerShutdown = async () => {
    try{
        await disconnectFromDatabase();
        logger.warn('Shutting down server gracefully...');
        process.exit(0);
    }   catch (err) {
        logger.error('Error during server shutdown:', err);
    }
}

/* 
* listen for termination signals (`SIGINT` and `SIGTERM`)
* - `SIGTERM` is the typically sent when stopping a process (e.g., `kill` command or container shutdown)
* - `SIGINT` is triggered when the user interrupts the process (e.g., by pressing `Ctrl+C`)
* - when either signal is received, `handleServerShutdown` is executed to ensure proper cleanup
*/
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);


