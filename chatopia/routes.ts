/**
 * Array of public routes , which are accessible without authentication
 * @type {string[]}
 */

export const publicRoutes = [
    "/"
];


/**
 * Array of routes used for authentication
 * These routes will redirect logged-in users to /users
 * @type {string[]}
 */
export const authRoutes = [
    "/"
]

/**
 * Prefix for API Authentication routes
 * Routes starting with this prefix are used for API Authentication purposes
 * @type {string}
 */
export const apiAuthprefix = "/api"

/**
 * The default redirect route after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/users"