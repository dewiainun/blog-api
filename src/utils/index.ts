/**
* @copyright (c) 2023 Dewi Ainun Amaliah
* @license: MIT
*/

import { title } from "process";

/* 
* generate a random username (e.g. user123)
 */
export const genUsername = (): string => {
    const usernamePrefix = 'user-';
    const randomChars = Math.random().toString(36).slice(2);

    const username = usernamePrefix + randomChars;

    return username; 
}

/* 
 * generate a random slug from a title (e.g. my-title-abc123)
 * @param title The title to generate a slug from
 * @return A random slug
*/

export const genSlug = (title: string): string => {
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]\s-/g, '') // replace non-alphanumeric characters with hyphens,
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-');

        const randomChars = Math.random().toString(36).slice(2);
        const uniqueSlug =  `${slug}-${randomChars}`;

        return uniqueSlug;
}