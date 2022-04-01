/**
 * @file Controller RESTful Web service API for follows resource
 */
import {Express, Request, Response} from "express";
import FollowDao from "../daos/FollowDao";
import FollowControllerI from "../interfaces/FollowControllerI";
import Follow from "../models/follows/Follow";

/**
 * @class FollowController Implements RESTful Web service API for follows resource
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/following to retrieve all other users
 *     that a particular user is following </li>
 *     <li>GET /api/users/:uid/followers to retrieve all followers of a
 *     particular user </li>
 *     <li>GET /api/follows to retrieve all follow documents for testing purpose </li>
 *     <li>POST /api/users/:uid/follows/:auid to record that a user follows another user </li>
 *     <li>DELETE /api/users/:uid/unfollows/:auid to record that a user no longer follows
 *     another user </li>
 * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing like CRUD operations
 * @property {FollowController} followController Singleton controller implementing
 * RESTful Web service API
 */
export default class FollowController implements FollowControllerI {
    private static followDao: FollowDao = FollowDao.getInstance();
    private static followController: FollowController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns FollowController
     */
    public static getInstance = (app: Express): FollowController => {
        if (FollowController.followController === null) {
            FollowController.followController = new FollowController();
            app.get('/api/users/:uid/following', FollowController.followController.findAllFollowing);
            app.get('/api/users/:uid/followers', FollowController.followController.findAllFollowers);
            app.get('/api/follows', FollowController.followController.findAllFollow);
            app.post('/api/users/:uid/follows/:auid', FollowController.followController.userFollowsAnotherUser);
            app.delete('/api/users/:uid/unfollows/:auid', FollowController.followController.userUnfollowsAnotherUser);
        }
        return FollowController.followController;
    }

    /**
     * Creates a new follow instance to record that a user follows another user
     * @param {Request} req Represents request from client, including path
     * parameter uid and auid representing the user that is following another user and
     * user being followed by another user
     * @param {Response} res Represents response to client, including the body
     * formatted as JSON containing the new follow that was inserted in the database
     */
    userFollowsAnotherUser = (req: Request, res: Response) =>
        FollowController.followDao.userFollowsAnotherUser(req.params.uid, req.params.auid)
            .then((follow: Follow) => res.json(follow));

    /**
     * Removes a follow instance to record that user no longer follows another user
     * @param {Request} req Represents request from client, including the path
     * parameter uid and auid representing that user that is unfollowing another user
     * and user being unfollowed
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
     */
    userUnfollowsAnotherUser = (req: Request, res: Response) =>
        FollowController.followDao.userUnfollowsAnotherUser(req.params.uid, req.params.auid)
            .then(status => res.send(status));

    /**
     * Retrieves all other users that a particular user is following
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user that is following to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the follow objects
     */
    findAllFollowing = (req: Request, res: Response) =>
        FollowController.followDao.findAllFollowing(req.params.uid)
            .then((followings: Follow[]) => res.json(followings))

    /**
     * Retrieves all followers for a particular user
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user that is followed to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the follow objects
     */
    findAllFollowers = (req: Request, res: Response) =>
        FollowController.followDao.findAllFollowers(req.params.uid)
            .then((followers: Follow[]) => res.json(followers));

    /**
     * Retrieves all follows from the database and returns an array of follows (including
     * all users following other users and users being followed by other users)
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the follow objects (including all
     * users following other users and user being followed by other users)
     */
    findAllFollow = (req: Request, res: Response) =>
        FollowController.followDao.findAllFollow()
            .then((follows: Follow[]) => res.json(follows));
}