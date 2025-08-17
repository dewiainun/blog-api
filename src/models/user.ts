/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
* node modules
*/
import { Schema, model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        x?: string;
        youtube?: string;
    };
}

/*
* User Schema 
*/
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            maxLength: [20, 'Username must be at most 20 characters long'],
            unique: [true, 'Username must be unique'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            maxLength: [50, 'Email must be at most 50 characters long'],
            unique: [true, 'Email must be unique'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false, // Exclude password from queries by default
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['admin', 'user'],
                message: '{VALUE} is not supported',
            },
            default: 'user'
        },
        firstName: {
            type: String,
            maxLength: [20, 'First name must be at most 20 characters long'],
        },
        lastName: {
            type: String,
            maxLength: [20, 'Last name must be at most 20 characters long'],
        },
        socialLinks: {
            website: {
                type: String,
                maxLength: [100, 'Website address must be less than 100 characters long'],
            },
            facebook: {
                type: String,
                maxLength: [
                    100, 
                    'Facebook profile link must be less than 100 characters long'
                ],
            },
            instagram: {
                type: String,
                maxLength: [
                    100, 
                    'Instagram profile link must be less than 100 characters long'
                ],
            },
            linkedin: {
                type: String,
                maxLength: [
                    100, 
                    'LinkedIn profile link must be less than 100 characters long'
                ],
            },
            x: {
                type: String,
                maxLength: [
                    100, 
                    'X (Twitter) profile link must be less than 100 characters long'
                ],
            },
            youtube: {
                type: String,
                maxLength: [
                    100, 
                    'YouTube channel link must be less than 100 characters long'
                ],
            },
        },
    }, 
    {
        timestamps: true,
    },
)

export default model<IUser>('User', userSchema);