/**
 * @file Controller RESTful Web service API for tuits resource
 */
import {Request, Response, Express} from "express";
import TuitDao from "../daos/TuitDao";
import TuitControllerI from "../interfaces/TuitControllerI";
import Tuit from "../models/tuits/Tuit";
import TuitService from "../services/TuitService";

/**
 * @class TuitController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/tuits to retrieve all the tuit instances </li>
 *     <li>GET /api/tuits/:tid to retrieve a particular tuit instances </li>
 *     <li>GET /api/users/:uid/tuits to retrieve tuits for a given user </li>
 *     <li>POST /api/tuits to create a new tuit instance </li>
 *     <li>POST /api/users/:uid/tuits to create a new tuit instance for
 *     a given user</li>
 *     <li>PUT /api/tuits/:tid to modify an individual tuit instance </li>
 *     <li>DELETE /api/tuits/:tid to remove a particular tuit instance </li>
 *     <li>DELETE /api/tuits/byContent to remove a tuit that matches the content</li>
 * </ul>
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {TuitController} tuitController Singleton controller implementing
 * RESTful Web service API
 */
export default class TuitController implements TuitControllerI {
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static tuitService: TuitService = TuitService.getInstance();
    private static tuitController: TuitController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @returns TuitController
     */
    public static getInstance = (app: Express): TuitController => {
        if (TuitController.tuitController === null) {
            TuitController.tuitController = new TuitController();
            app.get('/api/tuits', TuitController.tuitController.findAllTuits);
            app.get('/api/tuits/:tid', TuitController.tuitController.findTuitById);
            app.get('/api/users/:uid/tuits', TuitController.tuitController.findTuitsByUser);
            app.post('/api/tuits', TuitController.tuitController.createTuit);
            app.post("/api/users/:uid/tuits", TuitController.tuitController.createTuitByUser);
            app.put('/api/tuits/:tid', TuitController.tuitController.updateTuit);
            app.delete('/api/tuits/:tid', TuitController.tuitController.deleteTuit);
            app.delete('/api/tuits/byContent/:content', TuitController.tuitController.deleteTuitByContent)
        }
        return TuitController.tuitController
    }

    private constructor() {}

    /**
     * Retrieves all tuits from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllTuits = (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {
            // @ts-ignore
            const userId = profile._id;
            TuitController.tuitDao.findAllTuits()
                .then(async (tuits: Tuit[]) => {
                    const fetchTuits = await TuitController.tuitService
                        .fetchTuitsForLikesDisLikeOwn(userId, tuits);
                    res.json(fetchTuits);
                })
        } else {
            TuitController.tuitDao.findAllTuits()
                .then((tuits: Tuit[]) => res.json(tuits));
        }
    }


    /**
     * Retrieves the tuit by its primary key
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the tuit that matches the user ID
     */
    findTuitById = (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {
            // @ts-ignore
            const userId = profile._id;
            TuitController.tuitDao.findTuitById(req.params.tid)
                .then( async (tuit: Tuit) => {
                    if (tuit) {
                        const fetchTuits = await TuitController.tuitService
                            .fetchTuitsForLikesDisLikeOwn(userId, [tuit]);
                        res.json(fetchTuits[0]);
                    } else {
                        res.json(tuit);
                    }
                });
        } else {
            TuitController.tuitDao.findTuitById(req.params.tid)
                .then((tuit: Tuit) => res.json(tuit));
        }
    }


    /**
     * Retrieves all tuits from the database for a particular user and returns
     * an array of tuits.
     * @param {Request} req Represents request from client, including path
     * parameter uid identifying primary key of the user to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findTuitsByUser = (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid === 'me' && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;

        if (userId === 'me') {
            res.sendStatus(403);
        } else {
            TuitController.tuitDao.findTuitsByUser(userId)
                .then( async (tuits: Tuit[]) => {
                    const fetchTuits = await TuitController.tuitService
                        .fetchTuitsForLikesDisLikeOwn(userId, tuits);
                    res.json(fetchTuits);
                })
        }
    }

    /**
     * Creates a new tuit instance
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tuit to be inserted in the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit that was inserted in the
     * database
     */
    createTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.createTuit(req.body)
            .then((tuit: Tuit) => res.json(tuit))

    /**
     * Creates a new tuit instance
     * @param {Request} req Represents request from client, including path
     * parameter uid identifying the primary key of the user that posted
     * the tuit and body containing the JSON object for the new tuit to
     * be inserted in the database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit that was inserted in the
     * database
     */
    createTuitByUser = (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid === "me" && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;
        if (userId === undefined || userId === null) {
            res.sendStatus(403);
        } else {
            TuitController.tuitDao.createTuitByUser(userId, req.body)
                .then((tuit: Tuit) => res.json(tuit))
        }
    }

    /**
     * Modifies an existing tuit instance
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be modified
     * and body containing the JSON object for a tuit instance containing
     * properties and its new values
     * @param {Response} res Represents response to client, including status
     * on whether updating a tuit was successful or not
     */
    updateTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.updateTuit(req.params.tid, req.body)
            .then(status => res.json(status))

    /**
     * Removes a tuit instance from the database
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a tuit was successful or not
     */
    deleteTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.deleteTuit(req.params.tid)
            .then(status => res.json(status))

    /**
     * Only for testing purpose!
     * Removes a tuit instance that matches the content from the database
     * @param {Request} req Represents request from client, including path
     * parameter content identifying the content of the tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a tuit was successful or not
     */
    deleteTuitByContent = (req: Request, res: Response) => {
        // const content = req.body.tuit
        TuitController.tuitDao.deleteTuitByContent(req.params.content)
            .then(status => res.json(status))
    }
}