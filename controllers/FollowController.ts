/**
 * @file Controller RESTful Web service API for follows resource
 */
import {Express, Request, Response} from "express";
import FollowDao from "../daos/FollowDao";
import FollowControllerI from "../interfaces/FollowControllerI";
import Follow from "../models/follows/Follow";

/**
 * @class UserController Implements RESTful Web service API for follows resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/followees/:ouid to record that a user follows a
 *     user</li>
 *     <li>DELETE /api/users/:uid/followees/:ouid to record that a user
 *     no longer follows a user</li>
 *     <li>GET /api/users/:uid/followees to retrieve all the users followed by a
 *     user</li>
 *     <li>GET /api/users/:uid/followers to retrieve all users that follow a user
 *     </li>
 *     <li>GET /api/follows to retrieve all follows</li>
 *     <li>GET /api/users/:uid/follows/:ouid to retrieve the follow of a user
 *     by another user</li>
 *     <li>GET /api/follows/users/:uid/followees to retrieve all follows of
 *     followees by user</li>
 *     <li>GET /api/follows/users/:uid/followers to retrieve all follows of
 *     user by followers</li>
 * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing follows CRUD operations
 * @property {FollowController} FollowController Singleton controller implementing
 * RESTful Web service API
 */
export default class FollowController implements FollowControllerI {
    private static followDao: FollowDao = FollowDao.getInstance();
    private static followController: FollowController | null = null;

    /**
     * Creates singleton controller instance.
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return {FollowController} FollowController
     */
    public static getInstance = (app: Express): FollowController => {
        if(FollowController.followController === null) {
            FollowController.followController = new FollowController();
            app.post("/api/users/:uid/followees/:ouid", FollowController.followController.userFollowsUser);
            app.delete("/api/users/:uid/followees/:ouid", FollowController.followController.userUnfollowsUser);
            app.get("/api/users/:uid/followees", FollowController.followController.findUsersFollowedByUser);
            app.get("/api/users/:uid/followers", FollowController.followController.findUsersFollowingUser);
            app.get("/api/follows", FollowController.followController.findAllFollows);
            app.get("/api/users/:uid/followees/:ouid", FollowController.followController.findFollowByUsers);
            app.get("/api/follows/users/:uid/followees", FollowController.followController.findFollowsByFollower);
            app.get("/api/follows/users/:uid/followers", FollowController.followController.findFollowsByFollowee);
        }
        return FollowController.followController;
    }

    private constructor() {}

    /**
     * Retrieves all follows from the database and returns an array of follows.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the follow objects
     */
    findAllFollows = (req: Request, res: Response) =>
        FollowController.followDao.findAllFollows()
            .then((follows: Follow[]) => res.json(follows));

    /**
     * Retrieves follows of a user by other users from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user followed by other users
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the follow objects
     */
    findFollowsByFollowee = (req: Request, res: Response) =>
        FollowController.followDao.findFollowsByFollowee(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * Retrieves follows of users by a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user following the users
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the follow objects
     */
    findFollowsByFollower = (req: Request, res: Response) =>
        FollowController.followDao.findFollowsByFollower(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * Retrieves all users following a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user followed by users
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findUsersFollowingUser = (req: Request, res: Response) =>
        FollowController.followDao.findFollowsByFollowee(req.params.uid)
            .then(follows => res.json(follows.map(follow => follow.follower)));

    /**
     * Retrieves all users followed by a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user following the users
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects that were
     * followed
     */
    findUsersFollowedByUser = (req: Request, res: Response) =>
        FollowController.followDao.findFollowsByFollower(req.params.uid)
            .then(follows => res.json(follows.map(follow => follow.followee)));

    /**
     * Retrieves follow of user by a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user following the other user and ouid
     * representing the user being followed
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the follow of one user to the other
     */
    findFollowByUsers = (req: Request, res: Response) =>
        FollowController.followDao.findFollowByUsers(req.params.uid, req.params.ouid)
            .then(follows => res.json(follows));

    /**
     * Creates a new follow instance.
     * @param {Request} req Represents request from client, including the
     * path parameters uid and ouid representing the user that is following the
     * other user and the user being followed
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new follow that was inserted in the
     * database
     */
    userFollowsUser = (req: Request, res: Response) =>
        FollowController.followDao.userFollowsUser(req.params.uid, req.params.ouid)
            .then(follows => res.json(follows));

    /**
     * Removes follow instance from the database.
     * @param {Request} req Represents request from client, including the
     * path parameters uid and ouid representing the user that is unfollowing
     * the other user and the user being unfollowed
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
     */
    userUnfollowsUser = (req: Request, res: Response) =>
        FollowController.followDao.userUnfollowsUser(req.params.uid, req.params.ouid)
            .then(status => res.send(status));
};