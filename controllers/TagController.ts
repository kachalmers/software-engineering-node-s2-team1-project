/**
 * @file Controller RESTful Web service API for tags resource
 */
import {Express, Request, Response} from "express";
import TagDao from "../daos/TagDao";
import TagControllerI from "../interfaces/TagControllerI";
import TuitDao from "../daos/TuitDao";
import Tuit from "../models/tuits/Tuit";

/**
 * @class TagController Implements RESTful Web service API for tags resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/tags to retrieve all the tuits tagged by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/tags to retrieve all users that tagged a tuit
 *     </li>
 *     <li>POST /api/users/:uid/tags/:tid to record that a user tags a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/untags/:tid to record that a user
 *     no longer tags a tuit</li>
 * </ul>
 * @property {TagDao} tagDao Singleton DAO implementing tags CRUD operations
 * @property {TagController} TagController Singleton controller implementing
 * RESTful Web service API
 */
export default class TagController implements TagControllerI {
    private static tagDao: TagDao = TagDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static tagController: TagController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TagController
     */
    public static getInstance = (app: Express): TagController => {
        if(TagController.tagController === null) {
            TagController.tagController = new TagController();
            app.get("/api/users/:uid/tags", TagController.tagController.findAllTuitsTaggedByUser);
            app.get("/api/tuits/:tid/tags", TagController.tagController.findAllUsersThatTaggedTuit);
            app.put("/api/users/:uid/tags/:tid", TagController.tagController.userTogglesTuitTags);
        }
        return TagController.tagController;
    }

    private constructor() {}

    /**
     * Retrieves all users that tagged a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the tagged tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatTaggedTuit = (req: Request, res: Response) =>
        TagController.tagDao.findAllUsersThatTaggedTuit(req.params.tid)
            .then(tags => res.json(tags));

    /**
     * Retrieves all tuits tagged by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user tagged the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were tagged
     */
    findAllTuitsTaggedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        TagController.tagDao.findAllTuitsTaggedByUser(userId)
            .then(tags => {
                const tagsNonNullTuits = tags.filter(tag => tag.tuit);
                const tuitsFromTags = tagsNonNullTuits.map(tag => tag.tuit);
                res.json(tuitsFromTags);
            });
    }

    /**
     * Creates a new tag document in the database.
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tag to be inserted into the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tag that was inserted into
     * the database
     */
    createTag = (req: Request, res: Response) =>
        TagController.tagDao.createTag(req.body)
            .then((tag: Tag) => res.json(tag))


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being tagged
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tags that was inserted in the
     * database
     */
    userTogglesTuitTags = async (req: Request, res: Response) => {
        const tagDao = TagController.tagDao;
        const tuitDao = TagController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            // Get tag related info
            const userAlreadyTaggedTuit = await tagDao.findUserTagsTuit(userId, tid);
            const howManyTaggedTuit = await tagDao.countHowManyTaggedTuit(tid);

            let tuit = await tuitDao.findTuitById(tid);
            // If the user previously tagged the tuit
            if (userAlreadyTaggedTuit) {
                // Then undo the tag
                await tagDao.userUntagsTuit(userId, tid);
                tuit.stats.tags = howManyTaggedTuit - 1;
            } else {
                await TagController.tagDao.userTagsTuit(userId, tid);
                tuit.stats.tags = howManyTaggedTuit + 1;
                }
            await tuitDao.updateTags(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }
};