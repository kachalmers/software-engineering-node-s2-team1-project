/**
 * @file Controller RESTful Web service API for users authentication
 */
import {Express, Request, Response} from "express";
import UserDao from "../daos/UserDao";
import AuthenticationControllerI from "../interfaces/AuthenticationControllerI";
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @class AuthenticationController Implements RESTful Web Service API for users authentication.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/auth/login to retrieve an individual user instance by their credential for
 *     logging in </li>
 *     <li>POST /api/auth/register to create an individual user instance assuring there is
 *     no repeating username </li>
 *     <li>POST /api/auth/profile to retrieve user's profile based on current session </li>
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
     * Creates singleton controller instance
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
     * Retrieves the user by their credential for logging in
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for a user's credential containing
     * username and password
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the user that matches the credential
     * or the status that there is no user matches the credential (failed to log in)
     */
    login = async (req: Request, res: Response) => {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const existingUser = await AuthenticationController.userDao
            .findUserByUsername(username);
        if (existingUser) {
            const match = await bcrypt.compare(password, existingUser.password);
            if (match) {
                // @ts-ignore
                req.session['profile'] = existingUser;
                res.json(existingUser);
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }

    /**
     * Creates a new user instance assuring there is no repeating username
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new user to be inserted in the database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new user that was inserted in the
     * database or the status that user was not inserted successfully,
     * because of repetitive username in the database
     */
    signup = async (req: Request, res: Response) => {
        const newUser = req.body;
        if (newUser.username && newUser.password && newUser.email) {
            const password = newUser.password;
            newUser.password = await bcrypt.hash(password, saltRounds);
            const existingUser = await AuthenticationController.userDao
                .findUserByUsername(newUser.username);

            if (existingUser) {
                existingUser.password = '*****';
                res.sendStatus(403);
                return;
            } else {
                const insertedUser = await AuthenticationController.userDao
                    .createUser(newUser);
                // @ts-ignore
                req.session['profile'] = insertedUser;
                res.json(insertedUser);
            }
        } else {    // If user, password, or email don't exist...
            res.sendStatus(403);    // Send status 403
        }
    }

    /**
     * Retrieves user's profile information based on current session
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the user that are stored in the
     * current session, otherwise sends the status that session expires and
     * user is not logged in.
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
     * Destroy current session for logging out a user
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * status that user is successfully logged out.
     */
    logout = (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    }

}