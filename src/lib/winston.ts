/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
* node modules
*/
import winston from 'winston';

/* 
* custom module
*/
import config from '@/config';
import e from 'express';

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

//define the transport arrays to hold different logging transports
const transports: winston.transport[] = [];


// if the application is not running in production, add a console transport
if (config.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }), // add colors to log levels
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }), // add timestamp to logs
                align(), // align log messages
                printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length 
                    ? `\n${JSON.stringify(meta)}` 
                    : '';

                    return `${timestamp} [${level}]: ${message}${metaStr}`;
                }),
            ),
        }),
    );
}

// create a logger instance using Winston
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info', //set the default logging level to 'info'
    format: combine(timestamp(), errors({ stack: true }), json()), // use JSON format for log messages
    transports,
    silent: config.NODE_ENV === 'test', // disable logging in test environment
})

export { logger };
