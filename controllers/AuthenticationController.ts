/**
 * @file Controller RESTful Web service API for users authentication
 */
import {Request, Response, Express} from "express";
import UserDao from "../daos/UserDao";
import AuthenticationControllerI from "../interfaces/AuthenticationControllerI";
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @class AuthenticationController Implements RESTful Web Service API for user authentication.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/auth/login to retrieve a user instance by their login information </li>
 *     <li>POST /api/auth/register to create a user instance if username does not yet exist </li>
 *     <li>POST /api/auth/profile to retrieve user's profile for the current session </li>
 *     <li>POST /api/auth/logout to destroy the current session for logging out </li>
 * </ul>
 * @property {UserDao} userDao Singleton DAO implementing user CRUD operations
 * @property {AuthenticationController} authenticationController Singleton controller implementing
 * RESTful Web service API
 */
export default class AuthenticationController implements AuthenticationControllerI {
    private static userDao: UserDao = UserDao.getInstance();
    private static authenticationController: AuthenticationController | null = null;

    /**
     * Creates singleton authentication controller instance.
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns AuthenticationController
     */
    public static getInstance = (app: Express): AuthenticationController => {
        if (AuthenticationController.authenticationController === null) {
            AuthenticationController.authenticationController = new AuthenticationController();
            app.post('/api/auth/login', AuthenticationController.authenticationController.login);
            app.post('/api/auth/signup', AuthenticationController.authenticationController.signup);
            app.post('/api/auth/profile', AuthenticationController.authenticationController.profile);
            app.post('/api/auth/logout', AuthenticationController.authenticationController.logout);
        }
        return AuthenticationController.authenticationController;
    }

    private constructor() {}

    /**
     * Retrieves a user by their login information.
     * @param {Request} req Represents request from client, including body,
     * which contains the JSON object for a user information containing
     * username and password
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the user that matches the credentials
     * if the credentials match existing user information, otherwise a status is sent
     */
    login = async (req: Request, res: Response) => {
        const user = req.body;

        if (user.username && user.password) {
            const username = user.username;
            const password = user.password;

            // Find user by given username in the database
            const existingUser = await AuthenticationController.userDao
                .findUserByUsername(username);

            // If user exists in the database...
            if (existingUser) {
                /*
                Encrypt the given password and compare with the password stored for
                the existing user
                 */
                const match = await bcrypt.compare(password, existingUser.password);

                if (match) {    // If password matches...
                    // @ts-ignore
                    req.session['profile'] = existingUser;  // Current session is started for user
                    res.json(existingUser); // Return user JSON
                } else {    // If password doesn't match...
                    res.sendStatus(403);    // Send error status
                }
            } else {    // If user doesn't exist...
                res.sendStatus(403);    // Send error status
            }
        } else {
            res.sendStatus(403);    // Send error status
        }
    }

    /**
     * Creates a new user document if no users yet have the given username.
     * @param {Request} req Represents request from client, including body
     * that contains a JSON object for a new user
     * @param {Response} res Represents response to client, including the
     * new user JSON
     */
    signup = async (req: Request, res: Response) => {
        const newUser = req.body;

        // If username, password, and email are in the body...
        if (newUser.username && newUser.password && newUser.email) {
            const password = newUser.password;
            newUser.password = await bcrypt.hash(password, saltRounds); // encrypt password

            // Retrieve user by username if they exist
            const existingUser = await AuthenticationController.userDao
                .findUserByUsername(newUser.username);

            if (existingUser) { // If user with given username exists already...
                existingUser.password = '*****';
                res.sendStatus(403);    // Respond with error status
                return;
            } else {    // If user with username doesn't yet exist...
                // Create new user with given username, password, and email
                const insertedUser = await AuthenticationController.userDao
                    .createUser(newUser);
                // @ts-ignore
                req.session['profile'] = insertedUser;  // start session for user
                res.json(insertedUser);     // respond with inserted user
            }
        } else {    // If user, password, or email don't exist...
            res.sendStatus(403);    // Send status 403
        }
    }

    /**
     * Retrieves user profile information for the current session.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * profile JSON body with the user stored in the current session or
     * an error status if there is no user logged in
     */
    profile = (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {
            res.json(profile);
        } else {
            res.sendStatus(403);
        }
    }

    /**
     * Destroys current session when user logs out.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * status that user is successfully logged out
     */
    logout = (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    }

}