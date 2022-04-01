/**
 * @file Controller RESTful Web service API for users resource
 */
import {Request, Response, Express} from "express";
import UserControllerI from "../interfaces/UserControllerI";
import UserDao from "../daos/UserDao";
import User from "../models/users/User";

/**
 * @class UserController Implements RESTful Web service API for users resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users to retrieve all users</li>
 *     <li>GET /api/users/:uid to retrieve a user by their primary key</li>
 *     <li>POST /api/users to create a new user</li>
 *     <li>POST /api/login to retrieve a user by their login credentials</li>
 *     <li>POST /api/register to create a new user</li>
 *     <li>PUT /api/users to update a user</li>
 *     <li>DELETE /api/users/:uid to remove a user by their primary key</li>
 * </ul>
 * @property {UserDao} userDao Singleton DAO implementing user CRUD operations
 * @property {UserController} userController Singleton controller implementing
 * RESTful Web service API
 */
export default class UserController implements UserControllerI {
    private static userDao: UserDao = UserDao.getInstance();
    private static userController: UserController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @returns UserController
     */
    public static getInstance = (app: Express): UserController => {
        if (UserController.userController === null) {
            UserController.userController = new UserController();
            app.get('/api/users', UserController.userController.findAllUsers);
            app.get('/api/users/:uid', UserController.userController.findUserById);
            app.post('/api/users', UserController.userController.createUser);
            app.post('/api/login', UserController.userController.login);
            app.post('/api/register', UserController.userController.register)
            app.put('/api/users/:uid', UserController.userController.updateUser);
            app.delete('/api/users/:uid', UserController.userController.deleteUser);
            app.get('/api/users/username/:username/delete', UserController.userController.deleteUserByUsername);
        }
        return UserController.userController;
    }

    private constructor() {}

    /**
     * Retrieves all user documents from the database.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsers = (req: Request, res: Response) =>
        UserController.userDao.findAllUsers()
            .then((users: User[]) => res.json(users));

    /**
     * Retrieves a user by their primary key.
     * @param {Request} req Represents request from client, including path
     * parameter uid (primary key of the user to be retrieved)
     * @param {Response} res Represents response to client, including a
     * user JSON body
     */
    findUserById = (req: Request, res: Response) =>
        UserController.userDao.findUserById(req.params.uid)
            .then((user: User) => res.json(user));

    /**
     * Creates a new user document in the database.
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new user to be inserted into the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new user that was inserted into
     * the database
     */
    createUser = (req: Request, res: Response) =>
        UserController.userDao.createUser(req.body)
            .then((user: User) => res.json(user));

    /**
     * Removes a user document from the database.
     * @param {Request} req Represents request from client, including path
     * parameter uid (primary key of the user to be removed)
     * @param {Response} res Represents response to client, including
     * deletion status
     */
    deleteUser = (req: Request, res: Response) =>
        UserController.userDao.deleteUser(req.params.uid)
            .then(status => res.json(status))

    /**
     * Updates an existing user instance.
     * @param {Request} req Represents request from client, including path
     * parameter uid (primary key of the user to be updated)
     * and body containing the JSON object for a user instance containing
     * properties and their new values
     * @param {Response} res Represents response to client, including
     * update status
     */
    updateUser = (req: Request, res: Response) =>
        UserController.userDao.updateUser(req.params.uid, req.body)
            .then(status => res.json(status))


    /**
     * Retrieves a user by their credentials for logging in.
     * @param {Request} req Represents request from client, including
     * user JSON body with user's username and password
     * @param {Response} res Represents response to client, including
     * the matching user JSON body if able to log in or an error status if
     * unable to log in
     */
    login = (req: Request, res: Response) => {
        const credentials = req.body;

        // Find user by given credentials
        UserController.userDao.findUserByCredentials(credentials.username, credentials.password)
            .then((user: User) => {
                if (user) { // If user exists...
                    res.json(user); // respond with user JSON
                } else {
                    res.sendStatus(403);    // respond with error status
                }
            })
    }

    /**
     * Creates a new user document in the database.
     * @param {Request} req Represents request from client, including
     * user JSON body for the new user to be inserted into the database
     * @param {Response} res Represents response to client, including
     * the new user JSON body or an error status if unable to insert user
     * into the database
     */
    register = (req: Request, res: Response) => {
        const username = req.body.username

        // Find user by username
        UserController.userDao.findUserByUsername(username)
            .then((user: User) => {
                if (user) { // If user already exists...
                    res.sendStatus(403);    // respond with error status
                } else {
                    // Create and respond with new user
                    UserController.userDao.createUser(req.body)
                        .then((newUser: User) => res.json(newUser))
                }
            })
    }

    /**
     * Removes user documents with a given username from the database.
     * @param {Request} req Represents request from client, including path
     * parameter username (username of the user to be removed)
     * @param {Response} res Represents response to client, including
     * deletion status
     */
    deleteUserByUsername = (req: Request, res: Response) =>
       UserController.userDao.deleteUserByUsername(req.params.username)
           .then(status => res.send(status));
}