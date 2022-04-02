/**
 * @file Controller RESTful Web service API for dislikes resource
 */
import {Express, Request, Response} from "express";
import DislikeDao from "../daos/DislikeDao";
import DislikeControllerI from "../interfaces/DislikeControllerI";
import Dislike from "../models/dislikes/Dislike";
import TuitDao from "../daos/TuitDao";
import LikeDao from "../daos/LikeDao";
import TuitService from "../services/TuitService";

/**
 * @class DislikeController Implements RESTful Web service API for dislikes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/dislikes to retrieve all the tuits disliked by a user</li>
 *     <li>PUT /api/users/:uid/dislikes/:tid to record that a user dislikes/undislikes a tuit</li>
 * </ul>
 * @property {DislikeDao} dislikeDao Singleton DAO implementing dislikes CRUD operations
 * @property {LikeDao} likeDao Singleton DAO implementing like CRUD operations
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {DislikeController} dislikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class DislikeController implements DislikeControllerI {
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static tuitService: TuitService = TuitService.getInstance();
    private static dislikeController: DislikeController | null = null;

    /**
     * Creates singleton dislike controller instance.
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns DislikeController
     */
    public static getInstance = (app: Express): DislikeController => {
        if (DislikeController.dislikeController === null) {
            DislikeController.dislikeController = new DislikeController();
            app.get('/api/users/:uid/dislikes', DislikeController.dislikeController.findAllTuitsDislikedByUser);
            app.put('/api/users/:uid/dislikes/:tid', DislikeController.dislikeController.userTogglesTuitDislikes)
        }
        return DislikeController.dislikeController;
    }

    private constructor() {
    }

    /**
     * Retrieves all tuits disliked by a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user disliked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were disliked
     */
    findAllTuitsDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];

        /*
        If uid is 'me' and there's a user logged in, set userId to profile id.
        Otherwise, set userId to uid.
         */
        const userId = uid === 'me' && profile ? profile._id : uid;

        if (userId === 'me') {  // If user id is 'me'...
            // User does not exist, so dislikes cannot be retrieved
            res.sendStatus(403);
        } else {    // If proper user id is passed...
            try {
                // Find all dislikes of tuits by user
                DislikeController.dislikeDao.findAllDislikesOfTuitsByUser(userId)
                    .then( async (dislikes: Dislike[]) => {
                        // Filter dislikes for dislikes of non-null tuits
                        const dislikesNonNullTuits = dislikes
                            .filter(dislike => dislike.tuit);

                        // Store list of tuits from dislikes
                        const tuitsFromDislikes = dislikesNonNullTuits
                            .map(dislike => dislike.tuit);

                        // Mark tuits disliked by 'me'
                        const tuitsDislikedByMe = await DislikeController.tuitService
                            .markTuitsForUserInvolvement(userId, tuitsFromDislikes);

                        res.json(tuitsDislikedByMe);   // respond with tuits disliked by 'me'
                    });
            } catch (e) {
                res.sendStatus(403);
            }
        }
    }

    /**
     * Creates a new dislike instance to record that user dislikes a tuit.
     * @param {Request} req Represents request from client, including the path
     * parameter tid and uid representing the tuit being disliked and the user that
     * is disliking the tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new dislike that was inserted in
     * the database
     */
    userDislikesTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.userDislikesTuit(req.params.uid, req.params.tid)
            .then((dislike: Dislike) => res.json(dislike));

    /**
     * Removes dislike document to show user no longer dislikes a tuit.
     * @param {Request} req Represents request from client, including the path
     * parameter tid (tuit to be undisliked) and uid (user to undislike tuit)
     * @param {Response} res Represents response to client, including
     * dislike deletion status
     */
    userUnDislikesTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.userUnDislikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    /**
     * Toggle dislikes/likes of a tuit by a user.
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being disliked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new dislikes that was inserted in the
     * database
     */
    userTogglesTuitDislikes = async (req: Request, res: Response) => {
        const dislikeDao = DislikeController.dislikeDao;
        const likeDao = DislikeController.likeDao;
        const tuitDao = DislikeController.tuitDao;
        const uid = req.params.uid; // store user ID from request parameter
        const tid = req.params.tid; // store tuit ID from request parameter
        // @ts-ignore
        const profile = req.session['profile']; // get logged in profile from session
        const userId = uid === 'me' && profile ?    // if logged in, get ID from profile
            profile._id : uid;  // otherwise, use parameter
        try {
            // Store like and dislike of tuit, if they exist
            const userAlreadyLikedTuit = await likeDao.findUserLikesTuit(userId, tid);
            const userAlreadyDislikedTuit = await dislikeDao.findUserDislikesTuit(userId, tid);

            // Store how many likes/dislikes a tuit has gotten
            const howManyLikedTuit = await likeDao.countHowManyLikedTuit(tid);
            const howManyDislikedTuit = await dislikeDao.countHowManyDislikedTuit(tid);

            let tuit = await tuitDao.findTuitById(tid); // Find and store tuit

            if (userAlreadyDislikedTuit) {
                // User undislikes the tuit
                await dislikeDao.userUnDislikesTuit(userId, tid);

                // Decrement dislike count
                tuit.stats.dislikes = howManyDislikedTuit - 1;
            } else {    // If user hasn't yet disliked the tuit...
                if (userAlreadyLikedTuit) {
                    // User unlikes the tuit
                    await likeDao.userUnlikesTuit(userId, tid);

                    // Decrement likes count
                    tuit.stats.likes = howManyLikedTuit - 1;
                }

                await dislikeDao.userDislikesTuit(userId, tid); // User dislikes tuit

                // Increment dislikes for tuit
                tuit.stats.dislikes = howManyDislikedTuit + 1;
            }
            // Update tuit stats with new likes/dislikes in the database
            await tuitDao.updateTuitStats(tid, tuit.stats);
            res.sendStatus(200);    // respond with success
        } catch (e) {
            res.sendStatus(404);
        }
    }
}

