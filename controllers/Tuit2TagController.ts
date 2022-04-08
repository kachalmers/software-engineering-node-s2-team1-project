/**
 * @file Controller RESTful Web service API for the tuit2tag resource
 */


import {Request, Response, Express} from "express";
import TuitDao from "../daos/TuitDao";
import TuitControllerI from "../interfaces/TuitControllerI";
import Tuit from "../models/tuits/Tuit";
import TuitService from "../services/TuitService";
import Tuit2TagDao from "../daos/Tuit2TagDao";
import Tuit2TagControllerI from "../interfaces/Tuit2TagControllerI";
import Tuit2Tag from "../models/tags/Tuit2Tag";

/**
 * @class Tuit2TagController Implements RESTful Web service API for the
 * Tuit2Tag resource.Defines the following HTTP endpoints:
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
 * @property {Tuit2TagDao} tuit2tagDao Singleton DAO implementing tags CRUD operations
 * @property {Tuit2TagController} Tuit2TagController Singleton controller implementing
 * RESTful Web service API
 */

export default class Tuit2TagController implements Tuit2TagControllerI {
    private static tuit2tagDao: Tuit2TagDao = Tuit2TagDao.getInstance();
    private static tuit2tagController: Tuit2TagController | null = null;
    /**
     * Creates a singleton controller instance
     * @param {Express} app express instance to declare the RESTful API
     * @return Tuit2TagController
     */
    public static getInstance = (app: Express): Tuit2TagController => {
        if (Tuit2TagController.tuit2tagController === null) {
            Tuit2TagController.tuit2tagController = new Tuit2TagController();
            app.post("api/tuit2tags", Tuit2TagController.tuit2tagController.createTuit2Tag);
            app.delete("api/tuit2tags", Tuit2TagController.tuit2tagController.deleteTuit2Tag);
        }
        return Tuit2TagController.tuit2tagController;
    }

    private constructor() {}

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
    Tuit2TagController.tuit2tagDao.createTuit2Tag(req.params.tuit, req.params.tag)
        .then((tuit2tag:Tuit2Tag) => res.json(tuit2tag))

/**
 * Removes a tuit2tag document from the database
 * @param {Request} req Represents request from client, including the
 * parameter of a primary key for the t2t to be removed
 * @param {Response} res Represents response to client, including
 * tuit2tag deletion status
 */
deleteTuit2Tag = (req: Request, res: Response) =>
    Tuit2TagController.tuit2tagDao.deleteTuit2Tag(req.params.tuit2tagID)
        .then(status => res.send(status))
}