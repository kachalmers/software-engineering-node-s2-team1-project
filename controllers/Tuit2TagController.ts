/**
 * @file Controller RESTful Web service API for the tuit2tag resource
 */

import {Request, Response, Express} from "express";
import Tuit2TagDao from "../daos/Tuit2TagDao";
import Tuit2TagControllerI from "../interfaces/Tuit2TagControllerI";
import Tuit2Tag from "../models/tags/Tuit2Tag";
import TagDao from "../daos/TagDao";
import Tuit from "../models/tuits/Tuit";
import User from "../models/users/User";

/**
 * @class Tuit2TagController Implements RESTful Web service API for the
 * Tuit2Tag resource.Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/tuit2tags to record that a new tuit2tag relationship has
 *     been added to the database
 *     </li>
 *     <li>DELETE /api/tuit2tags/:tagID to record that a tuit2tag relationship
 *     has been deleted
 *     </li>
 * </ul>
 * @property {Tuit2TagDao} tuit2tagDao Singleton DAO implementing tags CRUD operations
 * @property {Tuit2TagController} Tuit2TagController Singleton controller implementing
 * RESTful Web service API
 */

export default class Tuit2TagController implements Tuit2TagControllerI {
    private static tuit2tagDao: Tuit2TagDao = Tuit2TagDao.getInstance();
    private static tagDao: TagDao = TagDao.getInstance();
    private static tuit2tagController: Tuit2TagController | null = null;
    /**
     * Creates a singleton controller instance
     * @param {Express} app express instance to declare the RESTful API
     * @return Tuit2TagController
     */
    public static getInstance = (app: Express): Tuit2TagController => {
        if (Tuit2TagController.tuit2tagController === null) {
            Tuit2TagController.tuit2tagController = new Tuit2TagController();
            app.post("/api/tuits/:tuitID/tags/:tagID", Tuit2TagController.tuit2tagController.createTuit2Tag);
            app.delete("/api/tuits/:tuitID/tags/:tagID", Tuit2TagController.tuit2tagController.deleteTuit2Tag);
            app.get('/api/tuit2tags', Tuit2TagController.tuit2tagController.findAllTuit2Tags);
            app.get("/api/tuits/:tuitID/tags", Tuit2TagController.tuit2tagController.findTuit2TagsByTuit);
            //app.get("/api/tags/:tagText/tuits", Tuit2TagController.tuit2tagController.findTuitsByTagText);
        }
        return Tuit2TagController.tuit2tagController;
    }

    private constructor() {
    }

    /**
     * Creates a new tuit2tag document in the database.
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tuit2tag to be inserted into
     * the database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit2tag that was inserted
     * into the database
     */
    createTuit2Tag = (req: Request, res: Response) =>
        Tuit2TagController.tuit2tagDao.createTuit2Tag(req.params.tuitID, req.params.tagID)
            .then((tuit2tag: Tuit2Tag) => res.json(tuit2tag))

    /**
     * Removes a tuit2tag document from the database
     * @param {Request} req Represents request from client, including the
     * parameter of a primary key for the t2t to be removed
     * @param {Response} res Represents response to client, including
     * tuit2tag deletion status
     */
    deleteTuit2Tag = (req: Request, res: Response) =>
        Tuit2TagController.tuit2tagDao.deleteTuit2Tag(req.params.tuitID,req.params.tagID)
            .then(status => res.send(status))

    /**
     * Retrieves all Tuit2Tag documents from the database.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the Tuit2Tag objects
     */
    findAllTuit2Tags = (req: Request, res: Response) =>
        Tuit2TagController.tuit2tagDao.findAllTuit2Tags()
            .then((tuit2tags: Tuit2Tag[]) => res.json(tuit2tags));

    /**
     * Finds a t2t document in the database based on its tuit component
     * @param {Request} req the request from the client, including the
     * parameter of a primary key for the tuit to be searched
     * @param {Response} res the response to the client, including the
     * array of desired tuit2tags
     */
    findTuit2TagsByTuit = (req: Request, res: Response) =>
        Tuit2TagController.tuit2tagDao.findTuit2TagsByTuit(req.params.tuitID)
            .then((tuit2tags: Tuit2Tag[]) => res.json(tuit2tags));

    /**
     *
     * @param req
     * @param res
     */
    /*
    findTuitsByTagText = async (req: Request, res: Response) => {
        // Find tag by tag text
        let tag = await Tuit2TagController.tagDao.findTagByText(req.params.tagText);

        // Map all the returned tuit2tags (from DAO) to their corresponding tuits
        Tuit2TagController.tuit2tagDao.findTuit2TagsByTag(tag._id)
            // The mapping function maps the tuit2tags to the corresponding tuits
            .then(tuit2tags => res.json(tuit2tags.map(tuit2tag => tuit2tag.tuit)));
    }
     */
/*
    findTuitsByTagText = async (req: Request, res: Response) => {
        Tuit2TagController.tuit2tagDao.findTuit2TagsByTagText(req.params.tagText)
            .then((tuits: Tuit[]) => res.json(tuits));
    }

 */


}