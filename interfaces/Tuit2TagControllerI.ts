import {Request, Response} from "express";

export default interface Tuit2TagControllerI {
    createTuit2Tag(req: Request, res: Response): void;
    deleteTuit2Tag(req: Request, res: Response): void;
    findTagsByTuit(req: Request, res: Response): void;
    findTuitsByTagText(req: Request, res: Response): void;
    findAllTuit2Tags(req: Request, res: Response): void;
    findTuit2TagsByTuit(req: Request, res: Response): void;
};