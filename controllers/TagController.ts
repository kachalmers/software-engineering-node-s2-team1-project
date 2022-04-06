/**
 * @file Controller RESTful Web service API for tags resource
 */
import {Express, Request, Response} from "express";
import TagDao from "../daos/TagDao";
import TagControllerI from "../interfaces/TagControllerI";
import TuitDao from "../daos/TuitDao";
import Tuit from "../models/tuits/Tuit";
import Tag from "../models/tags/Tag";
import User from "../models/users/User";

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
            app.get("/api/tags", TagController.tagController.findAllTags);
            app.get("/api/tags/:tag/tuits", TagController.tagController.findTuitsByTag);
            app.post("/api/tags", TagController.tagController.createTag);
            app.delete("/api/tags", TagController.tagController.removeTag);

        }
        return TagController.tagController;
    }

    private constructor() {}

    /**
     * Retrieves all tag documents from the database.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as a JSON array of tag objects
     */
    findAllTags = (req: Request, res: Response) => {        // Don't know that we need the conditional, just need
        TagController.tagDao.findAllTags()
            .then((tags: Tag[]) => res.json(tags));
            //}
        }

    /**
     * Finds all tuits with a certain tag
     * @param {Request} req Represents request from client, including the path
     * parameter tag representing the desired tag
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findTuitsByTag = (req: Request, res: Response) =>
        TagController.tagDao.findTuitsByTag(req.params.tag)
            .then(tuits => res.json(tuits));


    /**
     * Creates a new tag document in the database.
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tag to be inserted into the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tag that was inserted into
     * the database
     */
    createTag = async (req: Request, res: Response) => {}
        /*
        const tagDao = TagController.tagDao;
        //const tuitDao = TuitController.tuitDao;

        // Not sure if these are needed
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        const newTag = req.body; // Body contains the potentially new tag

        try {
            // Create an array of existing tags
            const existingTags = await tagDao.findAllTags();

            // If tag already exists
            if (newTag.tag in existingTags) { // TODO Will need to check this syntax based on Model/Schema
                // Then get the existing tag
                let i, existingTag;
                for (i = 0; i < existingTags.length; i++) {
                    if (existingTags[i].tag == newTag.tag) {
                        existingTag = existingTags[i];
                        existingTag.count++;
                        break;
                    }
                }
                // Then increase count by one and use that tag

                return; //existingTag; // Should this return?  Or just stop after increasing count?
            }
            // Else
            else {
                // create a new tag
                await tagDao.createTag(req.body)
                    .then((tag: Tag) => res.json(tag))
            }
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }
*/
    removeTag = (req: Request, res: Response) =>
        TagController.tagDao.removeTag(req.params.tag)
            .then(status => res.send(status))

};