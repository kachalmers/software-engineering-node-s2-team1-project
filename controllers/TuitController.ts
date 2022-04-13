/**
 * @file Controller RESTful Web service API for tuits resource
 */
import {Request, Response, Express} from "express";
import TuitDao from "../daos/TuitDao";
import TuitControllerI from "../interfaces/TuitControllerI";
import Tuit from "../models/tuits/Tuit";
import TuitService from "../services/TuitService";
import TagDao from "../daos/TagDao";
import Tuit2TagDao from "../daos/Tuit2TagDao";
import Tag from "../models/tags/Tag";

/**
 * @class TuitController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/tuits to retrieve all tuits </li>
 *     <li>GET /api/tuits/:tid to retrieve a tuit by its primary key </li>
 *     <li>GET /api/users/:uid/tuits to retrieve tuits posted by a given user </li>
 *     <li>POST /api/tuits to create a new tuit </li>
 *     <li>POST /api/users/:uid/tuits to create a new tuit posted by
 *     a given user</li>
 *     <li>PUT /api/tuits/:tid to update a tuit </li>
 *     <li>DELETE /api/tuits/:tid to remove a tuit by its primary key </li>
 *     <li>DELETE /api/tuits/byTuitText to remove a tuit with given text </li>
 * </ul>
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {TuitController} tuitController Singleton controller implementing
 * RESTful Web service API
 */
export default class TuitController implements TuitControllerI {
    private static tagDao: TagDao = TagDao.getInstance();
    private static tuit2TagDao: Tuit2TagDao = Tuit2TagDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static tuitService: TuitService = TuitService.getInstance();
    private static tuitController: TuitController | null = null;

    /**
     * Creates singleton tuit controller instance.
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
            app.delete('/api/tuits/text/:text', TuitController.tuitController.deleteTuitByTuitText)
        }
        return TuitController.tuitController
    }

    private constructor() {}

    /**
     * Retrieves all tuit documents from the database.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as a JSON array of tuit objects
     */
    findAllTuits = (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {  // If user is logged in...
            // @ts-ignore
            const userId = profile._id;

            // Find all tuits
            TuitController.tuitDao.findAllTuits()
                .then(async (tuits: Tuit[]) => {
                    // Mark tuits for tuit ownership, likes, and dislikes
                    const allTuits = await TuitController.tuitService
                        .markTuitsForUserInvolvement(userId, tuits);

                    res.json(allTuits);   // Respond with list of tuits
                })
        } else {    // If user is not logged in...
            // Find all tuits
            TuitController.tuitDao.findAllTuits()
                .then((tuits: Tuit[]) => res.json(tuits));
        }
    }


    /**
     * Retrieves a tuit by its primary key.
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be retrieved
     * @param {Response} res Represents response to client, including the
     * tuit JSON body
     */
    findTuitById = (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {  // If user is logged in
            // @ts-ignore
            const userId = profile._id;

            // Find tuit by its primary key
            TuitController.tuitDao.findTuitById(req.params.tid)
                .then( async (tuit: Tuit) => {
                    if (tuit) { // If tuit exists
                        // Mark tuits for tuit ownership, likes, and dislikes
                        const tuitFoundById = await TuitController.tuitService
                            .markTuitsForUserInvolvement(userId, [tuit]);

                        res.json(tuitFoundById[0]);    // Respond with tuit
                    } else {
                        res.json(tuit); // Respond with empty JSON
                    }
                });
        } else {    // If user not logged in...
            // Find tuit by id
            TuitController.tuitDao.findTuitById(req.params.tid)
                .then((tuit: Tuit) => res.json(tuit));
        }
    }

    /**
     * Retrieves all tuit documents posted by a given user from the database.
     * @param {Request} req Represents request from client, including path
     * parameter uid (primary key of the user to be retrieved)
     * @param {Response} res Represents response to client, including the
     * body formatted as tuit JSON array
     */
    findTuitsByUser = (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid === 'me' && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;

        if (userId === 'me') {  // If no user is logged in...
            res.sendStatus(403);    // respond with error status
        } else {    // If user is logged in...
            // Find tuits posted by user
            TuitController.tuitDao.findTuitsByUser(userId)
                .then( async (tuits: Tuit[]) => {
                    // Mark tuits for tuit ownership, likes, and dislikes
                    const tuitsPostedByUser = await TuitController.tuitService
                        .markTuitsForUserInvolvement(userId, tuits);

                    res.json(tuitsPostedByUser);    // respond with tuits posted by user
                })
        }
    }

    /**
     * Creates a new tuit document in the database.
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tuit to be inserted into the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit that was inserted into
     * the database
     */
    createTuit = async (req: Request, res: Response) => {
        // Initialize variables
        const tuitText = req.body.tuit;
        const splitTuit = tuitText.split(" ");
        let almostTag;
        let newTag;

        // Always create the Tuit
        const tuit2Return = await TuitController.tuitDao.createTuit(req.body);
        // Find the newly created Tuit
        const newTuit = await TuitController.tuitDao.findTuitByText(tuitText);

        // Check if Tuit text contains a tag
        if (tuitText.includes('#')) {
            // Loop through words
            for (let i = 0; i < splitTuit.length; i++) {
                // If the first char is #
                if (splitTuit[i].charAt(0) === '#') {
                    // Prep a Tag (use the word w/o the #)
                    almostTag = {
                        "tag": splitTuit[i].slice(1),
                        "count": 1
                    }
                    // Create the tag
                    await TuitController.tagDao.createTag(almostTag);
                    // Find the newly created Tag
                    newTag = await TuitController.tagDao.findTagByText(almostTag.tag);
                    // and make an entry in Tuit2Tag
                    await TuitController.tuit2TagDao.createTuit2Tag(newTuit._id, newTag._id);
                }
            }
        }
        // Always respond with the new tuit
        res.json(tuit2Return);
    }

    /**
     * Creates a new tuit document in the database.
     * @param {Request} req Represents request from client, including path
     * parameter uid (primary key of the user that posted the tuit) and
     * tuit JSON body for the new tuit to be inserted into the database
     * @param {Response} res Represents response to client, including the
     * tuit JSON body of the new tuit that was inserted into the
     * database
     */
    createTuitByUser = async (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid === "me" && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;

        // If userId not valid...
        if (userId === undefined || userId === null) {
            res.sendStatus(403);    // send error status
        } else {
            // Initialize variables
            const tuitText = req.body.tuit;
            const splitTuit = tuitText.split(" ");
            let almostTag, newTag;

            // Always create tuit to be posted by given user
            const tuit2Return = await TuitController.tuitDao.createTuit(req.body);
            // Find the newly created Tuit
            const newTuit = await TuitController.tuitDao.findTuitByText(tuitText);

            // Check if Tuit text contains a tag
            if (tuitText.includes('#')) {
                // Loop through words
                for (let i = 0; i < splitTuit.length; i++) {
                    // If the first char is #
                    if (splitTuit[i].charAt(0) === '#') {
                        // Prep a Tag (use the word w/o the #)
                        almostTag = {
                            "tag": splitTuit[i].slice(1),
                            "count": 1
                        }
                        // Create the tag
                        await TuitController.tagDao.createTag(almostTag);
                        // Find the newly created Tag
                        newTag = await TuitController.tagDao.findTagByText(almostTag.tag);
                        // and make an entry in Tuit2Tag
                        await TuitController.tuit2TagDao.createTuit2Tag(newTuit._id, newTag._id);
                    }
                }
            }
            // Always respond with the new tuit
            res.json(tuit2Return);
        }
    }

    /**
     * Updates a tuit document.
     * @param {Request} req Represents request from client, including path
     * parameter tid (primary key of the tuit to be updated) and tuit
     * JSON body for the tuit to be updated
     * @param {Response} res Represents response to client, including update
     * status
     */
    updateTuit = async (req: Request, res: Response) => {                      // TODO Check if tag was removed/added
        /*const tuitText = req.body.tuit;

        // Check if there's a tag/tuit row in Tuit2Tag
        const oldT2T = await TuitController.tuit2TagDao.findTuit2TagsByTuit(req.params.tid);
        const oldTags = oldT2T.map(oldT2T => oldT2T.tag); // Turn T2T array into tag array      // TODO Make sure this mapping works

        // Check if the tag is no longer present in req.body
        for (let i = 0; i < oldTags.length; i++) {
            if (tuitText.includes("#" + oldTags[i].tag) == 0) {
                // If not, then remove the Tuit2Tag row
                await TuitController.tuit2TagDao.deleteTuit2Tag(req.params.tid, oldTags[i]._id);
                // If it was the last Tuit with that Tag,
                if (oldTags[i].count === 1) {
                    // then delete the Tag
                    await TuitController.tagDao.deleteTag(oldTags[i]._id)
                } else {
                    //Reduce count
                    oldTags[i].count--;
                }
            }
        }

        // Check if a new Tag is present
        // Initialize variables
        const splitTuit = tuitText.split(" ");
        let almostTag, newTag;

        // Check if Tuit text contains a tag
        if ('#' in tuitText) {
            // Loop through words
            for (let i = 0; i < splitTuit.length; i++) {
                // If the first char is #
                if (splitTuit[i].charAt(0) === '#') {
                    // Prep a Tag (use the word w/o the #)
                    almostTag = {
                        "tag": splitTuit[i].slice(1),
                        "count": 1
                    }
                    // If the almost tag is a new one
                    if (!oldTags.contains(almostTag.tag)) {
                        // Create the tag
                        newTag = await TuitController.tagDao.createTag(almostTag);
                        // and enter a row in Tuit2Tag
                        await TuitController.tuit2TagDao.createTuit2Tag(req.params.tid, newTag._id)
                    }
                }
            }
        }
        // Always update the Tuit
        TuitController.tuitDao.updateTuit(req.params.tid, req.body)
            .then(status => res.json(status))*/
    }

    /**
     * Removes a tuit document from the database.
     * @param {Request} req Represents request from client, including path
     * parameter tid (primary key of the tuit to be removed)
     * @param {Response} res Represents response to client, including
     * deletion status
     */
    deleteTuit = (req: Request, res: Response) => {                       // TODO Check if tag present & if it was the last tuit w/that tag
       /* const oldT2T = await TuitController.tuit2TagDao.findTuit2TagsByTuit(req.params.tid);
        const potentialTags = oldT2T.map(oldT2T => oldT2T.tag); // Turn T2T array into tag array

        // If at least 1 Tag is present in the Tuit
        if (potentialTags) {
            for (let i = 0; i < potentialTags.length; i++) {
                // and if this Tuit is the last one with the Tag
                if (potentialTags[i].count === 1) {
                    // Then delete the Tag
                    TuitController.tagDao.deleteTag(potentialTags[i]._id)
                } else {
                    // Reduce count
                    potentialTags[i].count--;
                }
                // and delete the Tuit2Tag row
                TuitController.tuit2TagDao.deleteTuit2Tag(req.params.tid, potentialTags[i]._id)
            }
        }
        // Delete Tuit with given Tuit id
        TuitController.tuitDao.deleteTuit(req.params.tid)
            .then(status => res.json(status))*/
    }

    /**
     * (For testing) Removes a tuit documents with tuit text that matches the
     * given text.
     * @param {Request} req Represents request from client, including path
     * parameter text (text of the tuit(s) to be removed)
     * @param {Response} res Represents response to client, including
     * deletion status
     */
    deleteTuitByTuitText = (req: Request, res: Response) => {           // TODO Check if tag present & if it was the last tuit w/that tag
        // Delete tuit or tuits with given text
        TuitController.tuitDao.deleteTuitByTuitText(req.params.text)
            .then(status => res.json(status))
    }
}