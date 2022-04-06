import {Request, Response} from "express";

export default interface TagControllerI {
    findAllTags(req: Request, res: Response): void;
    updateTag(req: Request, res: Response): void;
    createTag(req: Request, res: Response): void;
};