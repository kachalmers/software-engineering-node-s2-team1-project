/**
 * @file Controller RESTful Web service API for Explore resource
 */
import {Request, Response, Express} from "express";
import ExploreDao from "../daos/ExploreDao";
import ExploreControllerI from "../interfaces/ExploreControllerI";
import Tuit from "../models/tuits/Tuit";
import Tuit2Tag from "../models/tuits/Tuit2Tag";
import TuitService from "../services/TuitService";
import TuitControllerI from "../interfaces/TuitControllerI";
import TuitDao from "../daos/TuitDao";

/**
 * @class ExploreController Implements RESTful Web service API for Explore resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/tags to retrieve all tags </li>
 *     <li>GET /api/tuits/:tagId to retrieve a tuit by one of its tags </li>
 * </ul>
 * @property {ExploreDao} exploreDao Singleton DAO implementing Explore CRUD operations
 * @property {ExploreController} exploreController Singleton controller implementing
 * RESTful Web service API
 */
export default class ExploreController implements ExploreControllerI {
    private static exploreDao: ExploreDao = ExploreDao.getInstance();
    private static tuitService: TuitService = TuitService.getInstance();
    private static exploreController: ExploreController | null = null;

    /**
     * Creates singleton Explore controller instance.
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @returns TuitController
     */
    public static getInstance = (app: Express): ExploreController => {
        if (ExploreController.exploreController === null) {
            ExploreController.exploreController = new ExploreController();
            app.get('/api/tuits', ExploreController.exploreController.findAllTags);
            app.get('/api/tuits/:tid', ExploreController.exploreController.findTuitByTag);
        }
        return ExploreController.exploreController
    }

    private constructor() {}

}