/**
 * @file Implements middleware for functionality related to authentication.
 */
import {Request, Response, Express} from "express";
import UserDao from "../daos/UserDao";
const bcrypt = require('bcrypt');
const saltRounds = 10;

const AuthenticationController = (app: Express) => {

    const userDao: UserDao = UserDao.getInstance();

    // Expects the request body to contain a JSON object with the user's
    // credentials
    const login = async (req: Request, res: Response) => {
        const user = req.body;
        console.log(user);
        if (!(user.username && user.password)) {
            res.sendStatus(403);
        } else {
            const username = user.username;
            const password = user.password;
            console.log(password);
            const existingUser = await userDao
                .findUserByUsername(username);  // retrieve user by username

            // User's password is compared to hashed password passed from client
            const match = await bcrypt.compare(password, existingUser.password);

            if (match) {    // If user exists and password matches
                existingUser.password = '*****';
                // @ts-ignore

                // User object is stored in the profile attribute in the session,
                // indicating that the user is currently logged in
                req.session['profile'] = existingUser;

                res.json(existingUser);
            } else {    // If user doesn't exist or password mismatches
                res.sendStatus(403);    // Send status 403
            }
        }
    }

    const register = async (req: Request, res: Response) => {
        const newUser = req.body;
        if (!(newUser.username && newUser.password && newUser.email)) {
            const password = newUser.password;
            const hash = await bcrypt.hash(password, saltRounds);
            newUser.password = hash;

            const existingUser = await userDao
                .findUserByUsername(req.body.username);
            if (existingUser) { // If user exists
                // Don't create new user
                res.sendStatus(403);
                return;
            } else {    // If user doesn't exist
                // Create and insert new user into database
                const insertedUser = await userDao
                    .createUser(newUser);
                insertedUser.password = '';
                // @ts-ignore

                // Store user in session under profile attribute to note which user
                // is currently logged in
                req.session['profile'] = insertedUser;

                res.json(insertedUser);
            }
        }
    }

    const profile = (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {  // If profile property in the session exists...
            // Respond with content of the profile property in the session
            res.json(profile);
        } else {
            res.sendStatus(403);    // Respond with status 403
        }
    }

    const logout = (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    }

    app.post("/api/auth/login", login);
    app.post("/api/auth/register", register);
    app.post("/api/auth/profile", profile);
    app.post("/api/auth/logout", logout);
}

export default AuthenticationController;