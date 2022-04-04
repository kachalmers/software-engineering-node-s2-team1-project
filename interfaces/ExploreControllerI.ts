/**
 * @file Declares Controller RESTful Web service API for Explore resource
 */
import {Request, Response} from "express";

export default interface ExploreControllerI {
    findAllTags(req: Request, res: Response): void;
    findTuitByTag(req: Request, res: Response): void;
}