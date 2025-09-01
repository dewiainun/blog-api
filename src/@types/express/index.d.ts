/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
node modules
*/
import * as express from "express";

/* 
types
*/
import { Types } from "mongoose";

declare global {
    namespace Express {
        interface Request{
            userId?: Types.ObjectId;
        }
    }
}