/**
 * @file Controller RESTful Web service API for likes resource
 */
import {Express, Request, Response} from "express";
import LikeDao from "../daos/LikeDao";
import DislikeDao from "../daos/DislikeDao";
import LikeControllerI from "../interfaces/LikeControllerI";
import TuitDao from "../daos/TuitDao";

/**
 * @class LikeController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/likes to retrieve all users that liked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/likes/:tid to record that a user likes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unlikes/:tid to record that a user
 *     no londer likes a tuit</li>
 * </ul>
 * @property {LikeDao} likeDao Singleton DAO implementing likes CRUD operations
 * @property {LikeController} LikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class LikeController implements LikeControllerI {
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static likeController: LikeController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): LikeController => {
        if(LikeController.likeController === null) {
            LikeController.likeController = new LikeController();
            app.get("/api/users/:uid/likes", LikeController.likeController.findAllTuitsLikedByUser);
            app.get("/api/tuits/:tid/likes", LikeController.likeController.findAllUsersThatLikedTuit);
            app.put("/api/users/:uid/likes/:tid", LikeController.likeController.userTogglesTuitLikes);
        }
        return LikeController.likeController;
    }

    private constructor() {}

    /**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatLikedTuit = (req: Request, res: Response) =>
        LikeController.likeDao.findAllUsersThatLikedTuit(req.params.tid)
            .then(likes => res.json(likes));

    /**
     * Retrieves all tuits liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllTuitsLikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        LikeController.likeDao.findAllTuitsLikedByUser(userId)
            .then(likes => {
                const likesNonNullTuits = likes.filter(like => like.tuit);
                const tuitsFromLikes = likesNonNullTuits.map(like => like.tuit);
                res.json(tuitsFromLikes);
            });
    }

    
    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */
    userTogglesTuitLikes = async (req: Request, res: Response) => {
        const likeDao = LikeController.likeDao;
        const dislikeDao = LikeController.dislikeDao;
        const tuitDao = LikeController.tuitDao;
        const uid = req.params.uid; // retrieve user ID from request parameter
        const tid = req.params.tid; // retrieve tuit ID from request parameter
        // @ts-ignore
        const profile = req.session['profile']; // get logged in profile from session
        const userId = uid === "me" && profile ?    // if logged in, get ID from profile
            profile._id : uid;  // otherwise, use parameter
        try {
            const userAlreadyLikedTuit = await likeDao
                .findUserLikesTuit(userId, tid);    // check if user already liked tuit
            const userAlreadyDislikedTuit = await dislikeDao
                .findUserDislikesTuit(userId, tid);    // check if user already disliked tuit
            const howManyLikedTuit = await likeDao
                .countHowManyLikedTuit(tid);    // Count how many like this tuit
            const howManyDislikedTuit = await dislikeDao
                .countHowManyDislikedTuit(tid);    // Count how many dislike this tuit
            let tuit = await tuitDao.findTuitById(tid); // Get the tuit to get current stats

            if (userAlreadyLikedTuit) { // If already liked...
                await likeDao.userUnlikesTuit(userId, tid); // unlike tuit
                tuit.stats.likes = howManyLikedTuit - 1;    // decrement likes count
            } else {    // If not already liked...
                if (userAlreadyDislikedTuit) { // If already disliked...
                    await dislikeDao.userUndislikesTuit(userId, tid); // undislike tuit
                    tuit.stats.dislikes = howManyDislikedTuit - 1;    // decrement dislikes count
                }

                await LikeController.likeDao.userLikesTuit(userId, tid);    // like the tuit
                tuit.stats.likes = howManyLikedTuit + 1;    // increment likes count
            };
            await tuitDao.updateLikes(tid, tuit.stats); // update likes count
            res.sendStatus(200);    // respond success
        } catch (e) {   // if there's an error
            res.sendStatus(404);    // respond with error status
        }
    }
};