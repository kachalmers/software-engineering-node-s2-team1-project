import {Request, Response} from "express";

export default interface LikeControllerI {
    findAllUsersThatLikedTuit (req: Request, res: Response): void;
    findAllTuitsLikedByUser (req: Request, res: Response): void;
    userTogglesTuitLikes (req: Request, res: Response): void;
};