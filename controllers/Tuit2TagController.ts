/**
 * @file Controller RESTful Web service API for the tuit2tag resource
 */

import {Request, Response, Express} from "express";
import Tuit2TagDao from "../daos/Tuit2TagDao";
import Tuit2TagControllerI from "../interfaces/Tuit2TagControllerI";
import Tuit2Tag from "../models/tags/Tuit2Tag";
import Tuit from "../models/tuits/Tuit";
import Tag from "../models/tags/Tag";
import TuitService from "../services/TuitService";

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
    private static tuitService: TuitService = TuitService.getInstance();
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
            app.get("/api/tags/:tagText/tuits", Tuit2TagController.tuit2tagController.findTuitsByTagText);
            app.get("/api/tuits/:tuitID/tags", Tuit2TagController.tuit2tagController.findTagsByTuit);
            app.get("/api/tuit2tags",Tuit2TagController.tuit2tagController.findAllTuit2Tags);
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
     * Retrieves all tags in a tuit with the given primary key.
     * @param {Request} req Represents request from client, including the
     * parameter of a primary key for the tuit for which tags are to be
     * retrieved
     * @param {Response} res Represents response to client
     */
    findTagsByTuit = async (req: Request, res: Response) =>
        Tuit2TagController.tuit2tagDao.findTagsByTuit(req.params.tuitID)
            .then((tags: Tag[]) => res.json(tags));

    /**
     * Retrieves all tuits that have tags with a given tag text.
     * @param {Request} req Represents request from client, including the
     * parameter of tag text by which to retrieve tuits
     * @param {Response} res Represents response to client
     */
    findTuitsByTagText = async (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {
            // @ts-ignore
            const userId = profile._id;

            // Find tuits tagged with given tag
            Tuit2TagController.tuit2tagDao.findTuitsByTagText(req.params.tagText)
                .then(async (tuits: Tuit[]) => {
                    // Mark tuits for tuit ownership, likes, and dislikes
                    const tuitsWithTag = await Tuit2TagController.tuitService
                        .markTuitsForUserInvolvement(userId, tuits);

                    res.json(tuitsWithTag); // Respond with list of tuits
                })
        } else {
            // Find tuits tagged with given tag
            Tuit2TagController.tuit2tagDao.findTuitsByTagText(req.params.tagText)
                .then((tuits: Tuit[]) => res.json(tuits));
        }
    }

    /**
     * Retrieve all Tuit2Tag documents from the database.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client
     */
    findAllTuit2Tags = async (req: Request, res: Response) =>
        Tuit2TagController.tuit2tagDao.findAllTuit2Tags()
            .then((tuit2tags: Tuit2Tag[]) => res.json(tuit2tags));


}