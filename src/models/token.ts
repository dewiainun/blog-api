/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
*node modules
*/
import { Schema, model, Types } from 'mongoose';

interface IToken {
    token: string;
    userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

export default model<IToken>('Token', tokenSchema);