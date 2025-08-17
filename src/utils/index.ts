/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

/* 
* generate a random username (e.g. user123)
 */
export const genUsername = (): string => {
    const usernamePrefix = 'user-';
    const randomChars = Math.random().toString(36).slice(2);

    const username = usernamePrefix + randomChars;

    return username; 
}