/**
 * @file Controller RESTful Web service API for tags resource
 */

import {Express, Request, Response} from "express";
import TagDao from "../daos/TagDao";
import TagControllerI from "../interfaces/TagControllerI";
import Tag from "../models/tags/Tag";

/**
 * @class TagController Implements RESTful Web service API for tags resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/tags to record that a tag has been added to the DB
 *     </li>
 *     <li>DELETE /api/tags/:tagID to record that a tag no longer exists
 *     </li>
 *     <li>GET /api/tags to find all existing tags in the DB
 *     </li>
 *     <li>GET /api/tags/:tag to find a specific tag that exists in the DB
 *     </li>
 *     <li>PUT /api/tags/:tag to update an existing tag
 *     </li>
 * </ul>
 * @property {TagDao} tagDao Singleton DAO implementing tags CRUD operations
 * @property {TagController} TagController Singleton controller implementing
 * RESTful Web service API
 */
export default class TagController implements TagControllerI {
    private static tagDao: TagDao = TagDao.getInstance();
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
            app.delete('/api/tags/:tagID', TagController.tagController.deleteTag);
            app.get("/api/tags", TagController.tagController.findAllTags);
            app.get("/api/tags/:tag", TagController.tagController.findTagByText);
            app.put('/api/tags/:tag', TagController.tagController.updateTag);
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
            // Acquire tag if it exists
            let existingTag = await tagDao.findTagByText(newTag.tag);
            // If tag already exists
            if (existingTag) {
                // Then increase count by one and update that tag
                existingTag.count++; // = existingTag.count.valueOf() + 1;
                await tagDao.updateTag(existingTag);
                res.json(existingTag); // Respond w/updated existing tag
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
        // Delete tag with given tagID string
        TagController.tagDao.deleteTag(req.params.tagID)
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
     * Retrieves all tag documents from the database.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as a JSON array of tag objects
     */
    findTagByText = (req: Request, res: Response) => {
        TagController.tagDao.findTagByText(req.params.tag)
            .then((tag: Tag) => res.json(tag));
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