/**
 * @file Controller RESTful Web service API for likes resource
 */
import {Express, Request, Response} from "express";
import LikeDao from "../daos/LikeDao"
import LikeControllerI from "../interfaces/LikeControllerI";
import Like from "../models/likes/Like";
import TuitDao from "../daos/TuitDao";
import DislikeDao from "../daos/DislikeDao";
import TuitService from "../services/TuitService";

/**
 * @class LikeController Implements RESTful Web service API for likes resource
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>
 *         GET /api/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>
 *         GET /api/users/:uid/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>
 *         GET /api/tuits/:tid/likes to retrieve all users that liked a tuit
 *     </li>
 *     <li>
 *         PUT /api/users/:uid/likes/:tid to record that a user likes/unlikes a tuit
 *     </li>
 * </ul>
 * @property {LikeDao} likeDao Singleton DAO implementing like CRUD operations
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {DislikeDao} dislikeDao Singleton DAO implementing dislike CRUD operations
 * @property {LikeController} likeController Singleton controller implementing
 * RESTful Web service API
 */
export default class LikeController implements LikeControllerI {
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitService: TuitService = TuitService.getInstance();
    private static likeController: LikeController | null = null;

    /**
     * Creates singleton like controller instance.
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns LikeController
     */
    public static getInstance = (app: Express): LikeController => {
        if (LikeController.likeController === null) {
            LikeController.likeController = new LikeController();
            app.get('/api/users/:uid/likes', LikeController.likeController.findAllTuitsLikedByUser)
            app.get('/api/tuits/:tid/likes', LikeController.likeController.findAllUsersThatLikedTuit)
            app.get('/api/likes', LikeController.likeController.findAllLikes);
            app.put('/api/users/:uid/likes/:tid', LikeController.likeController.userTogglesTuitLikes);
        }
        return LikeController.likeController;
    }

    private constructor() {}

    /**
     * Retrieves all users that liked a tuit from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatLikedTuit = (req: Request, res: Response) =>
        LikeController.likeDao.findAllLikesOfTuitByUsers(req.params.tid)
            .then((likes: Like[]) => res.json(likes.map(like => like.likedBy)));

    /**
     * Retrieves all tuits liked by a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllTuitsLikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];

        /*
        If uid is 'me' and there's a user logged in, set userId to profile id.
        Otherwise, set userId to uid.
        */
        const userId = uid === 'me' && profile ? profile._id : uid;

        if (userId === 'me') {  // If user id is 'me'...
            res.sendStatus(403);
        } else {    // If proper user id is passed...
            try {
                // Find all tuits liked by user
                LikeController.likeDao.findAllLikesOfTuitsByUser(userId)
                    .then( async (likes: Like[]) => {
                        // Filter likes for likes of non-null tuits
                        const likesNonNullTuits = likes.filter(like => like.tuit);

                        // Store list of tuits from likes
                        const tuitsFromLikes = likesNonNullTuits
                            .map(like => like.tuit);

                        // Find tuits liked by 'me'
                        const tuitsLikedByMe = await LikeController.tuitService
                            .fetchTuitsForLikesDisLikesOwn(userId, tuitsFromLikes);

                        res.json(tuitsLikedByMe);   // respond with tuits liked by 'me'
                    });
            } catch (e) {
                res.sendStatus(403);
            }
        }
    }

    /**
     * Creates a new like instance to record that user likes a tuit.
     * @param {Request} req Represents request from client, including the path
     * parameter tid and uid representing the tuit being liked and the user that
     * is liking the tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new like that was inserted in
     * the database
     */
    userLikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userLikesTuit(req.params.uid, req.params.tid)
            .then((like: Like) => res.json(like))

    /**
     * Removes like document to show that user no longer likes the tuit.
     * @param {Request} req Represents request from client, including the path
     * parameter tid (tuit to be unliked) and uid (user to unlike tuit)
     * @param {Response} res Represents response to client, including
     * like deletion status
     */
    userUnLikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status))

    /**
     * Retrieves all likes from the database and returns an array of likes.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the likes objects
     */
    findAllLikes = (req: Request, res: Response) =>
        LikeController.likeDao.findAllLikes()
            .then((likes: Like[]) => res.json(likes));

    /**
     * Implements logic for user likes a tuit. If a user already liked a tuit, removes the like;
     * otherwise insert this like into the database. If a user already disliked a tuit, removes the dislike
     * and then insert this like into the database.
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including status
     * on whether tuit is successfully liked or like is removed if tuit is already liked before.
     */
    userTogglesTuitLikes = async (req: Request, res: Response) => {
        const likeDao = LikeController.likeDao;
        const tuitDao = LikeController.tuitDao;
        const dislikeDao = LikeController.dislikeDao;
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

            if (userAlreadyLikedTuit) {
                // User unlikes the tuit
                await likeDao.userUnlikesTuit(userId, tid);

                // Decrement like count
                tuit.stats.likes = howManyLikedTuit - 1;
            } else {    // If user hasn't yet liked the tuit...
                if (userAlreadyDislikedTuit) {
                    // User undislikes the tuit
                    await dislikeDao.userUnDislikesTuit(userId, tid);

                    // Decrement dislikes count
                    tuit.stats.dislikes = howManyDislikedTuit - 1;
                }

                await likeDao.userLikesTuit(userId, tid);   // User likes tuit

                // Increment likes for tuit
                tuit.stats.likes = howManyLikedTuit + 1;
            }
            // Update tuit stats with new likes/dislikes in the database
            await tuitDao.updateTuitStats(tid, tuit.stats);
            res.sendStatus(200);    // respond with success
        } catch (e) {
            res.sendStatus(404);
        }
    }
}