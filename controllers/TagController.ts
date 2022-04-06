/**
 * @file Controller RESTful Web service API for tags resource
 */
import {Express, Request, Response} from "express";
import TagDao from "../daos/TagDao";
import TagControllerI from "../interfaces/TagControllerI";
import TuitDao from "../daos/TuitDao";
import Tuit from "../models/tuits/Tuit";
import Tag from "../models/tags/Tag";

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
            app.post("/api/tags", TagController.tagController.createTag);
            app.put('/api/tags/:tag', TagController.tagController.updateTag);
            app.get("/api/tags", TagController.tagController.findAllTags);
        }
        return TagController.tagController;
    }

    private constructor() {}

    /**
     * Creates a new tag document in the database.
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tag to be inserted into the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tag that was inserted into
     * the database
     */
    createTag = async (req: Request, res: Response) => {
        const tagDao = TagController.tagDao;

        const newTag = req.body; // Body contains the potentially new tag

        try {
            // Create an array of existing tags
            const existingTags = await tagDao.findAllTags();

            // If tag already exists
            let i;
            let flag = false;
            for (i = 0; i < existingTags.length; i++) {
                if (existingTags[i].tag === newTag.tag) {
                    flag = true;
                }
            }
            if (flag) {
                // Then get the existing tag
                let i, existingTag;
                for (i = 0; i < existingTags.length; i++) {
                    if (existingTags[i].tag == newTag.tag) {
                        existingTag = existingTags[i];
                        // Then increase count by one and update that tag
                        existingTag.count = existingTag.count.valueOf() + 1;

                        let updatedTag;
                        updatedTag = await tagDao.updateTag(existingTag)
                            .then(status => res.json(status))
                    }
                }
            }
            // Else
            else {
                // create a new tag
                await tagDao.createTag(req.body)
                    .then((tag: Tag) => res.json(tag))
            }
        } catch (e) {
            res.sendStatus(404);
        }
    }

    /**
     * Removes a tag document from the database.
     * @param {Request} req Represents request from client, including path
     * parameter tag (tag string of the tag to be removed)
     * @param {Response} res Represents response to client, including
     * deletion status
     */
    deleteTag = (req: Request, res: Response) =>
        // Delete tag with given tag string
        TagController.tagDao.deleteTag(req.body.tag)
            .then(status => res.json(status))

    /**
     * Retrieves all tag documents from the database.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as a JSON array of tag objects
     */
    findAllTags = (req: Request, res: Response) => {
        TagController.tagDao.findAllTags()
                .then((tags: Tag[]) => res.json(tags));
    }

    /**
     * Updates a tag document.
     * @param {Request} req Represents request from client, including path
     * parameter tid (primary key of the tag to be updated) and tag
     * JSON body for the tag to be updated
     * @param {Response} res Represents response to client, including update
     * status
     */
    updateTag = (req: Request, res: Response) =>
        TagController.tagDao.updateTag(req.body)
            .then(status => res.json(status))

};