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
 * @class DislikeController Implements RESTful Web service API for dislikes resource
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/dislikes To retrieve all the tuits disliked by a user</li>
 *     <li>PUT /api/users/:uid/dislikes/:tid to record that a user dislikes/un-dislikes a tuit</li>
 * </ul>
 * @property {DislikeDao} dislikeDao Singleton DAO implementing dislike CRUD operations
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
     * Creates singleton controller instance
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

    findAllTuitsDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;

        if (userId === 'me') {
            res.sendStatus(403);
        } else {
            try {
                DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
                    .then( async (likes: Dislike[]) => {
                        const dislikesNonNullTuits = likes.filter(dislike => dislike.tuit);
                        const tuitsFromDislikes = dislikesNonNullTuits.map(dislike => dislike.tuit);
                        const fetchTuits = await DislikeController.tuitService.fetchTuitsForLikesDisLikeOwn(userId, tuitsFromDislikes);
                        res.json(fetchTuits);
                    });
            } catch (e) {
                res.sendStatus(403);
            }
        }
    }

    /**
     * Creates a new dislike instance to record that user dislikes a tuit
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
     * Implements logic for user dislikes a tuit. If a user already disliked a tuit, removes the dislike;
     * otherwise insert this dislike into the database. If a user already liked a tuit, removes the like
     * and then insert this dislike into the database.
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is disliking the tuit
     * and the tuit being disliked
     * @param {Response} res Represents response to client, including status
     * on whether tuit is successfully disliked or dislike is removed if tuit is already disliked before.
     */
    userTogglesTuitDislikes = async (req: Request, res: Response) => {
        const likeDao = DislikeController.likeDao;
        const tuitDao = DislikeController.tuitDao;
        const dislikeDao = DislikeController.dislikeDao;
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
            if (userAlreadyDislikedTuit) {
                await dislikeDao.userUnDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDislikedTuit - 1;
            } else {
                if (userAlreadyLikedTuit) {
                    await likeDao.userUnlikesTuit(userId, tid);
                    tuit.stats.likes = howManyLikedTuit - 1;
                }

                await dislikeDao.userDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDislikedTuit + 1;
            }
            await tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            // console.log(e);
            res.sendStatus(404);
        }
    }


    /**
     * Removes a dislike instance to record that user un-dislikes a tuit
     * @param {Request} req Represents request from client, including the path
     * parameter tid and uid representing the tuit being un-disliked and the user that
     * is un-disliking the tuit
     * @param {Response} res Represents response to client, including status
     * on whether deleting the dislike was successful or not
     */
    userUnDislikesTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.userUnDislikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));
}

