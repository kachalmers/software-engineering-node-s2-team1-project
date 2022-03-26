/**
 * @file Controller RESTful Web service API for dislikes resource
 */
import {Express, Request, Response} from "express";
import DislikeDao from "../daos/DislikeDao";
import DislikeControllerI from "../interfaces/DislikeControllerI";
import TuitDao from "../daos/TuitDao";
import LikeDao from "../daos/LikeDao";

/**c
 * @class DislikeController Implements RESTful Web service API for dislikes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/dislikes to retrieve all the tuits disliked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/dislikes to retrieve all users that disliked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/dislikes/:tid to record that a user dislikes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/undislikes/:tid to record that a user
 *     no londer dislikes a tuit</li>
 * </ul>
 * @property {DislikeDao} dislikeDao Singleton DAO implementing dislikes CRUD operations
 * @property {DislikeController} DislikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class DislikeController implements DislikeControllerI {
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static dislikeController: DislikeController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): DislikeController => {
        if(DislikeController.dislikeController === null) {
            DislikeController.dislikeController = new DislikeController();
            app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
            app.get("/api/tuits/:tid/dislikes", DislikeController.dislikeController.findAllUsersThatDislikedTuit);
            app.put("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userTogglesTuitDislikes);
            app.get("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.findUserDislikesTuit);
        }
        return DislikeController.dislikeController;
    }

    private constructor() {}

    /**
     * Retrieves all users that disliked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the disliked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatDislikedTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.findAllUsersThatDislikedTuit(req.params.tid)
            .then(dislikes => res.json(dislikes));

    /**
     * Retrieves all tuits disliked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user disliked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were disliked
     */
    findAllTuitsDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
            .then(dislikes => {
                const dislikesNonNullTuits = dislikes.filter(dislike => dislike.tuit);
                const tuitsFromDislikes = dislikesNonNullTuits.map(dislike => dislike.tuit);
                res.json(tuitsFromDislikes);
            });
    }

    
    /**
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
        const uid = req.params.uid; // retrieve user ID from request parameter
        const tid = req.params.tid; // retrieve tuit ID from request parameter
        // @ts-ignore
        const profile = req.session['profile']; // get logged in profile from session
        const userId = uid === "me" && profile ?    // if logged in, get ID from profile
            profile._id : uid;  // otherwise, use parameter
        try {
            const userAlreadyDislikedTuit = await dislikeDao
                .findUserDislikesTuit(userId, tid);    // check if user already disliked tuit
            const howManyDislikedTuit = await dislikeDao
                .countHowManyDislikedTuit(tid);    // Count how many dislike this tuit
            let tuit = await tuitDao.findTuitById(tid); // Get the tuit to get current stats

            if (userAlreadyDislikedTuit) { // If already disliked...
                await dislikeDao.userUndislikesTuit(userId, tid); // undislike tuit
                tuit.stats.dislikes = howManyDislikedTuit - 1;    // decrement dislikes count
            } else {    // If not already disliked...
                const userAlreadyLikedTuit = await likeDao
                    .findUserLikesTuit(userId, tid);    // check if user already liked tuit
                const howManyLikedTuit = await likeDao
                    .countHowManyLikedTuit(tid);    // Count how many like this tuit
                // If user already liked tuit, unlike it
                if (userAlreadyLikedTuit) { // If already liked...
                    await likeDao.userUnlikesTuit(userId, tid); // unlike tuit
                    tuit.stats.likes = howManyLikedTuit - 1;    // decrement likes count
                }

                await DislikeController.dislikeDao.userDislikesTuit(userId, tid);    // dislike the tuit
                tuit.stats.dislikes = howManyDislikedTuit + 1;    // increment dislikes count
            };
            await tuitDao.updateDislikes(tid, tuit.stats); // update dislikes count
            res.sendStatus(200);    // respond success
        } catch (e) {   // if there's an error
            res.sendStatus(404);    // respond with error status
        }
    }

    findUserDislikesTuit = (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        DislikeController.dislikeDao.findUserDislikesTuit(userId, tid)
            .then(dislikes => res.json(dislikes));
    }
};