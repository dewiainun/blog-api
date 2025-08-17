/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
node modules
 */
import mongoose from "mongoose";

/* 
custom modules
*/
import config from "@/config";
import { logger } from "@/lib/winston";

/* 
types
*/
import type { ConnectOptions } from "mongoose";

/* 
* client option
*/
const clientOptions: ConnectOptions = {
    dbName: 'blog-db',
    appName: 'Blog API',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    },
};

/* 
* establish a connection to the MongoDB database using mongoose
* if an error occurs during the connection process, it throws an error 
* with a descriptive message
* 
*  - uses "MONGO_URI" as the connection string
* - `clientOptions` contains additional configuration for Mongoose
*  - errors are properly handled and rethrown for better debugging
*/
export const connectToDatabase = async () : Promise<void> => {
    if (!config.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in the configuration.');
    }

    try{
        await mongoose.connect(config.MONGO_URI, clientOptions);

        logger.info('Connected to MongoDB succesfully',{
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (err) {
        if(err instanceof Error) {
            throw err;
        }

        logger.error('Error connecting to the database', err);
    }
};

/* 
* disconnects from the MongoDB database using Mongoose
*
* this function attempts to disconnect from the database asynchronously
* if the disconnection is successful, a success message is logged
* if an error occurs, it is either re-thrown as a new errro(if it's an instance of error)
* or logged to the console
 */
export const disconnectFromDatabase = async () : Promise<void> => {
    try {
        await mongoose.disconnect();

        logger.info('Disconnected from the database successfully.', {
            uri: config.MONGO_URI,
            Options: clientOptions
        });
    } catch (err){
        if(err instanceof Error) {
            throw new Error(err.message);
        }

        logger.error('Error disconnecting from the database', err);
    }
};