import axios from 'axios';

/**
 * A pre-configured instance of Axios for making API requests.
 *
 * It's configured with:
 * - The base URL for all API requests.
 * - `withCredentials: true` to automatically send cookies (like session IDs)
 *   with cross-origin requests, which is essential for Spring Security sessions.
 */
export const api = axios.create({
    baseURL:
        'http://localhost:8080/api', // For local dev against Spring Boot server
        withCredentials: true,
});


