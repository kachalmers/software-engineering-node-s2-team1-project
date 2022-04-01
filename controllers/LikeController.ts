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
 *         GET /api/likes to retrieve all the like documents for testing purpose
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
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns LikeController
     */
    public static getInstance = (app: Express): LikeController => {
        if (LikeController.likeController === null) {
            LikeController.likeController = new LikeController();
            app.get('/api/users/:uid/likes', LikeController.likeController.findAllTuitsLikedByUser)
            app.get('/api/tuits/:tid/likes', LikeController.likeController.findAllUsersThatLikedTuit)
            app.get('/api/likes', LikeController.likeController.findAllLike);
            app.put('/api/users/:uid/likes/:tid', LikeController.likeController.userTogglesTuitLikes);
        }
        return LikeController.likeController;
    }

    private constructor() {}

    /**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user object
     */
    findAllUsersThatLikedTuit = (req: Request, res: Response) =>
        LikeController.likeDao.findAllUsersThatLikedTuit(req.params.tid)
            .then((likes: Like[]) => res.json(likes))

    /**
     * Retrieves all tuits that liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllTuitsLikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;

        if (userId === 'me') {
            res.sendStatus(403);
        } else {
            try {
                LikeController.likeDao.findAllTuitsLikedByUser(userId)
                    .then( async (likes: Like[]) => {
                        const likesNonNullTuits = likes.filter(like => like.tuit);
                        const tuitsFromLikes = likesNonNullTuits.map(like => like.tuit);
                        const fetchTuits = await LikeController.tuitService.fetchTuitsForLikesDisLikeOwn(userId, tuitsFromLikes);
                        res.json(fetchTuits);
                    });
            } catch (e) {
                res.sendStatus(403);
            }
        }
    }

    /**
     * Creates a new like instance to record that user likes a tuit
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
     * Removes a like instance to record that user no longer likes the tuit
     * @param {Request} req Represents request from client, including the path
     * parameter tid and uid representing the tuit being unliked and the user is
     * unliking the tuit
     * @param {Response} res Represents response to client, including status
     * on whether deleting the like was successful or not
     */
    userUnLikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status))

    /**
     * Retrieves all likes from the database and returns an array of likes (including
     * all tuits being liked and users liking the tuit)
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the likes objects (including all
     * tuits being liked and users liking the tuit)
     */
    findAllLike = (req: Request, res: Response) =>
        LikeController.likeDao.findAllLike()
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
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;
        try {
            const userAlreadyLikedTuit = await likeDao.findUserLikesTuit(userId, tid);
            const userAlreadyDislikedTuit = await dislikeDao.findUserDislikesTuit(userId, tid);
            const howManyLikedTuit = await likeDao.countHowManyLikedTuit(tid);
            const howManyDislikedTuit = await dislikeDao.countHowManyDislikedTuit(tid);
            // console.log(howManyLikedTuit)
            // console.log(userId)
            let tuit = await tuitDao.findTuitById(tid);
            if (userAlreadyLikedTuit) {
                await likeDao.userUnlikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit - 1;
            } else {
                if (userAlreadyDislikedTuit) {
                    await dislikeDao.userUnDislikesTuit(userId, tid);
                    tuit.stats.dislikes = howManyDislikedTuit - 1;
                }
                await likeDao.userLikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit + 1;
            }
            await tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            // console.log(e);
            res.sendStatus(404);
        }
    }
}