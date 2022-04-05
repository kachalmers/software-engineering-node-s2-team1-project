import {Request, Response} from "express";

export default interface TagControllerI {
    findAllTags(req: Request, res: Response): void;
    findAllUsersThatTaggedTuit (req: Request, res: Response): void;
    findAllTuitsTaggedByUser (req: Request, res: Response): void;
    userTogglesTuitTags (req: Request, res: Response): void; // Probably don't need this
    updateTag(req: Request, res: Response): void;
    createTag(req: Request, res: Response): void;
};